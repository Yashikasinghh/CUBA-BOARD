import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth';
import materialsRoutes from './routes/materials';
import quizRoutes from './routes/quiz';
import aiRoutes from './routes/ai';
import progressRoutes from './routes/progress';

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cuba Board Master API is running', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

app.listen(PORT, () => {
  console.log(`Cuba Board API Server is running on port ${PORT}`);
});
