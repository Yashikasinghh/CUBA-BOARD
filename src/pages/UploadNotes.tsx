import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, XCircle, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { useFlashcardStore } from '@/stores/useFlashcardStore';
import { generateAIQuiz } from '@/services/aiQuizGenerator';
import { processDocument, readFileAsText } from '@/services/textExtractor';
import { generateId } from '@/lib/utils';
import { mockQuizzes } from '@/lib/mockData';
import type { FlashcardDeck, Quiz, Difficulty } from '@/types';

const UploadNotes = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addXP } = useUserStore();
  const { addDeck, setCurrentDeck } = useFlashcardStore();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');

  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [extractedSummary, setExtractedSummary] = useState<{ wordCount: number; pages: number; topics: string[] } | null>(null);
  const [generatedQuizId, setGeneratedQuizId] = useState<string>('');
  const [generatedDeckId, setGeneratedDeckId] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processUpload(files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const processUpload = async (file: File) => {
    setFileName(file.name);
    setUploadState('uploading');
    setProgress(20);

    try {
      // 1. Read File Content
      const rawText = await readFileAsText(file);
      setProgress(50);

      setUploadState('processing');
      const doc = processDocument(file.name.replace(/\.[^/.]+$/, ''), rawText || `Study material content for ${file.name}`);
      setExtractedSummary({ wordCount: doc.wordCount, pages: doc.estimatedPages, topics: doc.topics });
      setProgress(80);

      // 2. Generate AI Quiz
      const quiz: Quiz = await generateAIQuiz({
        title: doc.title,
        sourceText: doc.cleanText || rawText || 'General study material text',
        difficulty,
        questionCount,
        subject: doc.topics[0] || 'General Studies',
        sourceFile: file.name,
      });

      // Save quiz to mock store array
      mockQuizzes.push(quiz);
      setGeneratedQuizId(quiz.id);

      // 3. Generate Flashcards Deck
      const deckId = generateId('deck');
      const newDeck: FlashcardDeck = {
        id: deckId,
        title: `${doc.title} Flashcards`,
        subject: doc.topics[0] || 'General Studies',
        topic: doc.topics[1] || 'Core Review',
        cardCount: doc.topics.length + 3,
        mastered: 0,
        createdAt: new Date().toISOString(),
        cards: doc.topics.map((t, idx) => ({
          id: generateId('fc'),
          front: `What is the core definition of "${t}" in ${doc.title}?`,
          back: `"${t}" is a key topic identified in the study document with estimated ${doc.wordCount} words across ${doc.estimatedPages} pages.`,
          status: 'new',
          bookmarked: false,
        })),
      };

      addDeck(newDeck);
      setGeneratedDeckId(deckId);

      // Award XP for uploading material
      addXP(25);
      setProgress(100);
      setUploadState('success');
    } catch (error) {
      console.error(error);
      setUploadState('error');
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim()) return;
    const title = pasteTitle.trim() || 'Pasted Study Notes';
    setFileName(title);
    setUploadState('processing');

    try {
      const doc = processDocument(title, pastedText);
      setExtractedSummary({ wordCount: doc.wordCount, pages: doc.estimatedPages, topics: doc.topics });

      const quiz = await generateAIQuiz({
        title,
        sourceText: pastedText,
        difficulty,
        questionCount,
        subject: doc.topics[0] || 'General Studies',
      });

      mockQuizzes.push(quiz);
      setGeneratedQuizId(quiz.id);

      const deckId = generateId('deck');
      const newDeck: FlashcardDeck = {
        id: deckId,
        title: `${title} Deck`,
        subject: doc.topics[0] || 'General Studies',
        topic: doc.topics[1] || 'Key Terms',
        cardCount: doc.topics.length + 2,
        mastered: 0,
        createdAt: new Date().toISOString(),
        cards: doc.topics.map((t) => ({
          id: generateId('fc'),
          front: `Explain the concept of "${t}"`,
          back: `Topic extracted from study text (${doc.wordCount} words). Review and test your recall!`,
          status: 'new',
          bookmarked: false,
        })),
      };

      addDeck(newDeck);
      setGeneratedDeckId(deckId);
      addXP(20);
      setUploadState('success');
    } catch (err) {
      console.error(err);
      setUploadState('error');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processUpload(files[0]);
    }
  };

  const handleStartQuiz = () => {
    if (generatedQuizId) {
      navigate(`/quiz/${generatedQuizId}`);
    }
  };

  const handleReviewFlashcards = () => {
    if (generatedDeckId) {
      setCurrentDeck(generatedDeckId);
      navigate('/flashcards');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Study Library & File Processing</h1>
          <p className="text-gray-400">Upload notes, PDFs, or paste raw text to generate AI quizzes and flashcards.</p>
        </div>

        {/* Configuration Selectors */}
        <div className="flex items-center gap-3 bg-surface p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span>Questions:</span>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="bg-surfaceHover text-white px-2 py-1 rounded-lg text-xs outline-none border border-white/10"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span>Difficulty:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="bg-surfaceHover text-white px-2 py-1 rounded-lg text-xs outline-none border border-white/10 capitalize"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'upload' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File (PDF, TXT)</span>
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'paste' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paste Text / Notes</span>
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="card border-dashed border-2 border-white/10 hover:border-primary/50 bg-surface/50 p-12 text-center transition-all cursor-pointer rounded-2xl"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.txt,.md,.docx,.ppt"
          />

          {uploadState === 'idle' && (
            <div className="flex flex-col items-center" onClick={triggerFileSelect}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-primary animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Click or drag PDF/TXT document here</h3>
              <p className="text-sm text-gray-400 mb-8 max-w-sm">
                Cuba Board extracts document text, identifies topics, and generates grounded quiz questions.
              </p>
              <div className="flex gap-3 text-xs font-medium text-gray-400 mb-8">
                <span className="px-3 py-1.5 bg-surfaceHover rounded-full border border-white/5">PDF</span>
                <span className="px-3 py-1.5 bg-surfaceHover rounded-full border border-white/5">TXT</span>
                <span className="px-3 py-1.5 bg-surfaceHover rounded-full border border-white/5">Markdown</span>
              </div>
              <button className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-colors shadow-lg">
                Select Study File
              </button>
            </div>
          )}

          {(uploadState === 'uploading' || uploadState === 'processing') && (
            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-surfaceHover rounded-2xl flex items-center justify-center mb-6 shadow-xl relative overflow-hidden">
                <Sparkles className="w-8 h-8 text-primary z-10 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {uploadState === 'uploading' ? `Reading "${fileName}"...` : 'AI is parsing & extracting text...'}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Extracting grounded concepts, chunking text, and building quiz questions.
              </p>
              <div className="w-full h-2 bg-surfaceHover rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating structured assessment...
              </div>
            </div>
          )}

          {uploadState === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 text-success">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Study Material Ready!</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-md">
                Successfully processed <strong>"{fileName}"</strong>. Earned <strong>+25 XP</strong>!
              </p>

              {extractedSummary && (
                <div className="bg-surface p-4 rounded-xl border border-white/10 mb-6 w-full max-w-md text-left">
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Extracted Metadata</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-3">
                    <div>Word Count: <span className="text-white font-semibold">{extractedSummary.wordCount}</span></div>
                    <div>Est. Pages: <span className="text-white font-semibold">{extractedSummary.pages}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedSummary.topics.map((topic, i) => (
                      <span key={i} className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => setUploadState('idle')}
                  className="px-5 py-2.5 bg-surfaceHover hover:bg-white/10 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  Process Another
                </button>
                <button 
                  onClick={handleReviewFlashcards}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium text-sm transition-all shadow-lg"
                >
                  Review Flashcards
                </button>
                <button 
                  onClick={handleStartQuiz}
                  className="px-6 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/30 animate-pulse"
                >
                  Start Timed Quiz
                </button>
              </div>
            </div>
          )}

          {uploadState === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6 text-error">
                <XCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Failed</h3>
              <p className="text-sm text-gray-400 mb-8 max-w-sm">
                An error occurred while extracting document text. Please verify the file format and try again.
              </p>
              <button 
                onClick={() => setUploadState('idle')}
                className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Paste Text Area */
        <div className="bg-surface p-6 rounded-2xl border border-white/10">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Document Title</label>
            <input
              type="text"
              placeholder="e.g. Operating Systems — Memory Management Notes"
              value={pasteTitle}
              onChange={(e) => setPasteTitle(e.target.value)}
              className="w-full bg-background text-white px-4 py-3 rounded-xl border border-white/10 focus:border-primary outline-none text-sm"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Paste Text / Lecture Notes</label>
            <textarea
              rows={10}
              placeholder="Paste your study material, lecture transcript, or textbook summary here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full bg-background text-white p-4 rounded-xl border border-white/10 focus:border-primary outline-none text-sm font-mono"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handlePasteSubmit}
              disabled={!pastedText.trim()}
              className="px-6 py-3 bg-primary hover:bg-primaryHover disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Quiz & Flashcards
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadNotes;
