import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { useFlashcardStore } from '@/stores/useFlashcardStore';
import { generateQuiz } from '@/services/quiz.service';
import { uploadFile } from '@/services/upload.service';
import { generateId } from '@/lib/utils';
import { mockQuizzes } from '@/lib/mockData';
import type { FlashcardDeck, Quiz } from '@/types';

const UploadNotes = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addXP } = useUserStore();
  const { addDeck, setCurrentDeck } = useFlashcardStore();

  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
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
    setProgress(0);

    try {
      // 1. Upload File with progress callback
      const uploaded = await uploadFile(file, (p) => {
        setProgress(p);
      });

      setUploadState('processing');

      // 2. Determine subject based on file name keywords
      const nameLower = file.name.toLowerCase();
      let subject = 'General';
      if (nameLower.includes('phys')) subject = 'Physics';
      else if (nameLower.includes('chem')) subject = 'Chemistry';
      else if (nameLower.includes('calc') || nameLower.includes('math')) subject = 'Mathematics';
      else if (nameLower.includes('bio')) subject = 'Biology';
      else if (nameLower.includes('hist')) subject = 'History';
      else if (nameLower.includes('comp') || nameLower.includes('code') || nameLower.includes('dsa')) subject = 'Computer Science';

      // 3. Generate Quiz (shuffles questions from mock database)
      const config = {
        questionCount: 6,
        difficulty: 'medium' as const,
        timeLimit: 360,
      };
      
      const quiz = await generateQuiz(uploaded.id, config);
      
      // Override quiz titles and subject to match file name
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const customizedQuiz: Quiz = {
        ...quiz,
        title: `${cleanName} Assessment`,
        subject,
        topic: 'AI Quiz',
      };
      
      // Save quiz by pushing to global array
      mockQuizzes.push(customizedQuiz);
      setGeneratedQuizId(customizedQuiz.id);

      // 4. Generate corresponding Flashcard Deck
      const deckId = generateId('deck');
      const newDeck: FlashcardDeck = {
        id: deckId,
        title: `${cleanName} Revision`,
        subject,
        topic: 'AI Generated Review',
        cardCount: 5,
        mastered: 0,
        createdAt: new Date().toISOString(),
        cards: [
          {
            id: generateId('fc'),
            front: `What is the core subject of the ${cleanName} note?`,
            back: `The note primary focuses on topics relating to the field of ${subject}.`,
            status: 'new',
            bookmarked: false,
          },
          {
            id: generateId('fc'),
            front: `What is the importance of learning ${subject}?`,
            back: `It expands base knowledge, aids analytical reasoning, and prepares for examinations.`,
            status: 'new',
            bookmarked: false,
          },
          {
            id: generateId('fc'),
            front: `Name one application covered in ${cleanName}.`,
            back: `It provides a foundation for explaining specific mechanisms and calculations in ${subject}.`,
            status: 'new',
            bookmarked: false,
          },
          {
            id: generateId('fc'),
            front: `Key takeaway #1`,
            back: `Always study actively using interactive quizzes to identify weak areas.`,
            status: 'new',
            bookmarked: false,
          },
          {
            id: generateId('fc'),
            front: `Key takeaway #2`,
            back: `Review topics with spaced repetition using these flashcards.`,
            status: 'new',
            bookmarked: false,
          }
        ]
      };

      // Add to Flashcards store
      addDeck(newDeck);
      setGeneratedDeckId(deckId);

      // 5. Award XP to user for uploading files (+20 XP)
      addXP(20);

      setUploadState('success');
    } catch (error) {
      console.error(error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Notes</h1>
        <p className="text-gray-400">Turn your documents into interactive quizzes and flashcards instantly.</p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="card border-dashed border-2 border-white/10 hover:border-primary/50 bg-surface/50 p-12 text-center transition-all cursor-pointer"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.docx,.doc,.ppt,.pptx,.txt,.md"
        />

        {uploadState === 'idle' && (
          <div className="flex flex-col items-center" onClick={triggerFileSelect}>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <UploadCloud className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Click or drag file to this area to upload</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-sm">
              Upload notes or slides. We support PDF, DOCX, PPT, and TXT files.
            </p>
            <div className="flex gap-4 text-xs font-medium text-gray-500 mb-8">
              <span className="px-3 py-1 bg-surfaceHover rounded-full">PDF</span>
              <span className="px-3 py-1 bg-surfaceHover rounded-full">DOCX</span>
              <span className="px-3 py-1 bg-surfaceHover rounded-full">PPT</span>
              <span className="px-3 py-1 bg-surfaceHover rounded-full">TXT</span>
            </div>
            <button 
              className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-colors shadow-lg"
            >
              Select Files
            </button>
          </div>
        )}

        {(uploadState === 'uploading' || uploadState === 'processing') && (
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-surfaceHover rounded-2xl flex items-center justify-center mb-6 shadow-xl relative overflow-hidden">
              <File className="w-8 h-8 text-primary z-10" />
              <div 
                className="absolute bottom-0 left-0 right-0 bg-primary/20 z-0 transition-all duration-300" 
                style={{ height: `${progress}%` }} 
              />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {uploadState === 'uploading' ? `Uploading "${fileName}"...` : 'AI is processing your notes...'}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {uploadState === 'uploading' ? `${progress}% completed` : 'Extracting key concepts, summary and generating assessment.'}
            </p>
            <div className="w-full h-2 bg-surfaceHover rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300" 
                style={{ width: `${uploadState === 'processing' ? 100 : progress}%` }} 
              />
            </div>
            {uploadState === 'processing' && (
              <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating magic...
              </div>
            )}
          </div>
        )}

        {uploadState === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 text-success">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Complete!</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-md">
              We've successfully processed "{fileName}". You earned <strong>+20 XP</strong>! We generated a custom quiz and a 5-card flashcard review deck.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setUploadState('idle')}
                className="px-6 py-3 bg-surfaceHover hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
              >
                Upload Another
              </button>
              <button 
                onClick={handleReviewFlashcards}
                className="px-6 py-3 bg-gradient-to-r from-violet to-violet-light text-white rounded-xl font-medium transition-colors shadow-lg shadow-violet/20"
              >
                Review Flashcards
              </button>
              <button 
                onClick={handleStartQuiz}
                className="px-6 py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/20"
              >
                Start Quiz Now
              </button>
            </div>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6 text-error">
              <XCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Failed</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-sm">
              An error occurred while uploading or processing the file. Please verify it's a valid format and try again.
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
    </div>
  );
};

export default UploadNotes;
