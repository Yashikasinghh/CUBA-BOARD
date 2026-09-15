import type { Upload, UploadStatus } from '@/types';
import { mockUploads } from '@/lib/mockData';
import { generateId, delay, formatFileSize } from '@/lib/utils';

// In-memory store for upload simulation
let uploads: Upload[] = [...mockUploads];

/**
 * Returns all uploaded files.
 */
export async function getUploads(): Promise<Upload[]> {
  await delay(300);
  return [...uploads];
}

/**
 * Simulates a file upload with progress updates.
 * Returns the completed Upload object.
 *
 * @param file - The File object from an input element
 * @param onProgress - Optional callback invoked with progress percentage (0–100)
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Upload> {
  const id = generateId();
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'txt';

  const fileTypeMap: Record<string, Upload['fileType']> = {
    pdf: 'pdf',
    docx: 'docx',
    pptx: 'pptx',
    txt: 'txt',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    webp: 'image',
  };

  const newUpload: Upload = {
    id,
    fileName: file.name,
    fileType: fileTypeMap[fileExtension] || 'txt',
    fileSize: file.size,
    status: 'uploading',
    progress: 0,
    uploadedAt: new Date().toISOString(),
    generatedQuizzes: 0,
    generatedFlashcards: 0,
  };

  uploads = [newUpload, ...uploads];

  // Simulate upload progress in increments
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await delay(200 + Math.random() * 300);
    const progress = Math.round((i / steps) * 100);
    newUpload.progress = progress;
    onProgress?.(progress);
  }

  // Transition to processing
  newUpload.status = 'processing';
  newUpload.progress = 100;
  onProgress?.(100);

  // Simulate processing
  await delay(1000 + Math.random() * 1500);

  // Complete
  newUpload.status = 'ready';
  newUpload.pageCount = Math.floor(Math.random() * 50) + 5;

  // Update in-memory store
  uploads = uploads.map((u) => (u.id === id ? { ...newUpload } : u));

  return { ...newUpload };
}

/**
 * Removes an upload by ID.
 */
export async function deleteUpload(id: string): Promise<boolean> {
  await delay(300);
  const index = uploads.findIndex((u) => u.id === id);
  if (index === -1) return false;
  uploads = uploads.filter((u) => u.id !== id);
  return true;
}

/**
 * Returns the current status of an upload.
 */
export async function getUploadStatus(
  id: string
): Promise<{ status: UploadStatus; progress: number } | null> {
  await delay(200);
  const upload = uploads.find((u) => u.id === id);
  if (!upload) return null;
  return { status: upload.status, progress: upload.progress };
}

/**
 * Returns a formatted summary string for an upload.
 */
export function getUploadSummary(upload: Upload): string {
  const size = formatFileSize(upload.fileSize);
  const pages = upload.pageCount ? `${upload.pageCount} pages` : 'processing';
  return `${upload.fileName} (${size}, ${pages})`;
}
