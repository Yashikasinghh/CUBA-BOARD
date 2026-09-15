// ═══════════════════════════════════════════════════════
// CUBA BOARD — Text Extraction & Processing Engine
// Extracts, cleans, and chunks uploaded PDF, TXT, and raw text
// ═══════════════════════════════════════════════════════

export interface ExtractedDocument {
  title: string;
  rawText: string;
  cleanText: string;
  charCount: number;
  wordCount: number;
  estimatedPages: number;
  topics: string[];
  chunks: TextChunk[];
}

export interface TextChunk {
  id: string;
  chunkIndex: number;
  pageNumber: number;
  content: string;
  heading?: string;
}

/**
 * Clean raw text extracted from documents: removes redundant whitespace, broken headers, control characters
 */
export function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract key topics from document content based on keyword frequency and headings
 */
export function extractTopicsFromText(text: string): string[] {
  const clean = cleanExtractedText(text);
  const headings = clean.match(/^#+\s+(.+)$/gm) || [];
  const headingTopics = headings.map(h => h.replace(/^#+\s+/, '').trim()).slice(0, 5);

  if (headingTopics.length >= 3) {
    return headingTopics;
  }

  // Fallback: extract common high-frequency academic keywords
  const words = clean
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4);

  const stopWords = new Set(['these', 'there', 'their', 'which', 'about', 'would', 'could', 'should', 'other', 'after', 'first']);
  const frequencyMap: Record<string, number> = {};

  words.forEach(w => {
    if (!stopWords.has(w)) {
      frequencyMap[w] = (frequencyMap[w] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

  const combined = Array.from(new Set([...headingTopics, ...sortedWords]));
  return combined.length > 0 ? combined.slice(0, 6) : ['General Overview', 'Key Concepts'];
}

/**
 * Splits extracted document into digestible chunks (approx 1200 characters each) with page metadata
 */
export function chunkText(text: string, chunkSize = 1200): TextChunk[] {
  const clean = cleanExtractedText(text);
  const paragraphs = clean.split('\n\n');
  const chunks: TextChunk[] = [];

  let currentChunk = '';
  let chunkIdx = 0;
  let currentEstimatedPage = 1;
  const wordsPerPage = 300;

  let totalWordsSoFar = 0;

  paragraphs.forEach((p) => {
    const wordCount = p.split(/\s+/).length;
    totalWordsSoFar += wordCount;
    currentEstimatedPage = Math.max(1, Math.ceil(totalWordsSoFar / wordsPerPage));

    if ((currentChunk + '\n\n' + p).length > chunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `chunk-${chunkIdx}`,
        chunkIndex: chunkIdx,
        pageNumber: currentEstimatedPage,
        content: currentChunk.trim(),
      });
      chunkIdx++;
      currentChunk = p;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
    }
  });

  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `chunk-${chunkIdx}`,
      chunkIndex: chunkIdx,
      pageNumber: currentEstimatedPage,
      content: currentChunk.trim(),
    });
  }

  return chunks;
}

/**
 * Process raw text or file content into structured ExtractedDocument object
 */
export function processDocument(title: string, rawContent: string): ExtractedDocument {
  const clean = cleanExtractedText(rawContent);
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 300));
  const topics = extractTopicsFromText(clean);
  const chunks = chunkText(clean);

  return {
    title,
    rawText: rawContent,
    cleanText: clean,
    charCount: clean.length,
    wordCount,
    estimatedPages,
    topics,
    chunks,
  };
}

/**
 * Reads a browser File object asynchronously as plain text
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string || '');
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
