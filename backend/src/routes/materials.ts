import { Router } from 'express';

const router = Router();

// In-memory material storage for MVP demonstration
const materialsStore: any[] = [
  {
    id: 'mat-1',
    userId: 'usr-1',
    title: 'Operating Systems — Process Management',
    originalFilename: 'os_process_notes.pdf',
    fileType: 'pdf',
    fileSize: 1048576,
    processingStatus: 'ready',
    extractedText: 'Process state transitions, scheduling algorithms, semaphores, deadlock prevention.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mat-2',
    userId: 'usr-1',
    title: 'Computer Networks — OSI Layer Overview',
    originalFilename: 'osi_layers.txt',
    fileType: 'txt',
    fileSize: 524288,
    processingStatus: 'ready',
    extractedText: 'Physical, Data Link, Network, Transport, Session, Presentation, Application layers.',
    createdAt: new Date().toISOString(),
  }
];

// GET /api/materials - List user's study materials
router.get('/', (req, res) => {
  res.json({ materials: materialsStore });
});

// POST /api/materials - Create study material record
router.post('/', (req, res) => {
  const { title, originalFilename, fileType, fileSize, rawText } = req.body;
  const newMaterial = {
    id: `mat-${Date.now()}`,
    userId: 'usr-1',
    title: title || originalFilename || 'Untitled Note',
    originalFilename: originalFilename || 'notes.txt',
    fileType: fileType || 'txt',
    fileSize: fileSize || 1024,
    processingStatus: 'processing',
    extractedText: rawText || '',
    createdAt: new Date().toISOString(),
  };

  materialsStore.unshift(newMaterial);
  res.status(201).json({ material: newMaterial });
});

// POST /api/materials/:id/process - Trigger document text extraction & topic parsing
router.post('/:id/process', (req, res) => {
  const material = materialsStore.find((m) => m.id === req.params.id);
  if (!material) {
    return res.status(404).json({ error: 'Material not found' });
  }

  material.processingStatus = 'ready';
  res.json({
    message: 'Material processed successfully',
    material,
    topics: ['Process Scheduling', 'CPU Utilization', 'Deadlock Avoidance']
  });
});

// DELETE /api/materials/:id - Delete study material
router.delete('/:id', (req, res) => {
  const index = materialsStore.findIndex((m) => m.id === req.params.id);
  if (index !== -1) {
    materialsStore.splice(index, 1);
    return res.json({ message: 'Material deleted successfully' });
  }
  res.status(404).json({ error: 'Material not found' });
});

export default router;
