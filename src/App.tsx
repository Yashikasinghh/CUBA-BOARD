import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadNotes from './pages/UploadNotes';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import Flashcards from './pages/Flashcards';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import BattleLobby from './pages/BattleLobby';
import BattleRoom from './pages/BattleRoom';
import TeacherDashboard from './pages/TeacherDashboard';
import Marketplace from './pages/Marketplace';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadNotes />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/battle" element={<BattleLobby />} />
          <Route path="/battle/:roomId" element={<BattleRoom />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
