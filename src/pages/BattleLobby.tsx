import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Swords, Users, Globe, Lock, Copy, Check, Zap } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { MatchmakingModal } from '@/components/MatchmakingModal';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  level: number;
}

const mockFriends: Friend[] = [
  { id: 'f1', name: 'Sneha Patel', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sneha', online: true, level: 4 },
  { id: 'f2', name: 'Rahul Krishnan', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul', online: true, level: 5 },
  { id: 'f3', name: 'Priya Sharma', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya', online: false, level: 5 },
  { id: 'f4', name: 'Ananya Desai', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya', online: true, level: 4 },
];

const activeRooms = [
  { id: 'r1', subject: 'Physics', host: 'Rahul Krishnan', players: 2, max: 4, code: 'PHY-4920' },
  { id: 'r2', subject: 'Chemistry', host: 'Ananya Desai', players: 1, max: 2, code: 'CHM-1102' },
  { id: 'r3', subject: 'Mathematics', host: 'Sneha Patel', players: 3, max: 4, code: 'MAT-8840' },
];

const BattleLobby = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [subject, setSubject] = useState('Physics');
  const [count, setCount] = useState(6);
  const [timer, setTimer] = useState(15);
  const [isPublic, setIsPublic] = useState(true);
  const [joinCode, setJoinCode] = useState('');

  const [isMatchmakingOpen, setIsMatchmakingOpen] = useState(false);
  
  // Custom notification state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateRoom = () => {
    const prefix = subject.slice(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${prefix}-${randomNum}`;
    showNotification(`Room created! Redirecting with code ${code}...`);
    setTimeout(() => {
      navigate(`/battle/${code}?subject=${subject}&questions=${count}&timer=${timer}`);
    }, 800);
  };

  const handleJoinWithCode = () => {
    if (!joinCode.trim()) {
      showNotification('Please enter a valid room code.');
      return;
    }
    const cleanCode = joinCode.trim().toUpperCase();
    navigate(`/battle/${cleanCode}`);
  };

  const handleCopyLink = (friendName: string, id: string) => {
    const inviteLink = `questify.app/battle/INV-${id}`;
    navigator.clipboard?.writeText(inviteLink);
    setCopiedId(id);
    showNotification(`Copied invite link for ${friendName}!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      <MatchmakingModal
        isOpen={isMatchmakingOpen}
        onClose={() => setIsMatchmakingOpen(false)}
        selectedSubject={subject}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary border border-primary/20 text-white px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2 font-medium text-sm">
          <Swords className="w-4 h-4 text-white" />
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-1">Battle Arena</p>
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Battle Lobby</h1>
          <p className="text-gray-400">Challenge classmates, climb the ranks, and master subjects in real-time battles.</p>
        </div>

        {/* Quick Match Action */}
        <button
          onClick={() => setIsMatchmakingOpen(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-black rounded-2xl text-sm transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center gap-2"
        >
          <Zap className="w-5 h-5 fill-current" />
          Find Random Match (MMR Queue)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create room card */}
        <div className="card space-y-6 bg-surface border border-white/5 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create a Battle Room</h2>
              <p className="text-xs text-gray-400">Host a session and invite your friends</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-surfaceHover border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
              >
                {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'History', 'Computer Science'].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Questions count</label>
              <input
                type="number"
                min={3}
                max={20}
                value={count}
                onChange={(e) => setCount(Math.min(20, Math.max(3, parseInt(e.target.value) || 3)))}
                className="w-full bg-surfaceHover border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Timer (sec/question)</label>
              <input
                type="number"
                min={5}
                max={60}
                value={timer}
                onChange={(e) => setTimer(Math.min(60, Math.max(5, parseInt(e.target.value) || 5)))}
                className="w-full bg-surfaceHover border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Visibility</label>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className="w-full bg-surfaceHover border border-white/5 rounded-xl px-4 py-3 text-white flex items-center justify-between text-sm transition-colors hover:border-white/10"
              >
                <span className="flex items-center gap-2">
                  {isPublic ? <Globe className="w-4 h-4 text-success" /> : <Lock className="w-4 h-4 text-orange-500" />}
                  {isPublic ? 'Public Room' : 'Private Room'}
                </span>
                <span className="text-xs text-gray-500">{isPublic ? 'Anyone can join' : 'Invite code only'}</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full bg-primary hover:bg-primaryHover text-white rounded-xl py-4 font-bold transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base mt-4"
          >
            <Swords className="w-5 h-5" />
            Create Battle Room
          </button>
        </div>

        {/* Join room card */}
        <div className="card space-y-6 bg-surface border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet/10 flex items-center justify-center text-violet-light">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Join with Code</h2>
                <p className="text-xs text-gray-400">Enter a code shared by a classmate</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Room code</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="PHY-7732"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="flex-1 bg-surfaceHover border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary uppercase font-mono tracking-widest text-sm"
                />
                <button
                  onClick={handleJoinWithCode}
                  className="px-6 bg-surfaceHover hover:bg-white/10 text-white rounded-xl font-bold transition-colors border border-white/5 text-sm"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Invite online friends</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {mockFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 bg-surfaceHover rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
                      {friend.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{friend.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium">Lvl {friend.level} &bull; {friend.online ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyLink(friend.name, friend.id)}
                    className="p-2 bg-surface hover:bg-white/5 rounded-lg border border-white/5 text-gray-400 hover:text-white transition-colors"
                    title="Copy Invite Link"
                  >
                    {copiedId === friend.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active public rooms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Live Public Battles
          </h2>
          <span className="text-xs font-mono text-gray-500 font-bold">{activeRooms.length} rooms active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeRooms.map((room) => (
            <div key={room.id} className="card bg-surface border border-white/5 hover:border-primary/30 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/10 uppercase tracking-wider">
                      {room.subject}
                    </span>
                    <h3 className="font-bold text-white text-base mt-2">{room.host}'s Room</h3>
                  </div>
                  <span className="font-mono text-xs text-gray-500 bg-surfaceHover px-2 py-1 rounded border border-white/5">
                    {room.code}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Players: {room.players}/{room.max}</span>
                  <div className="flex -space-x-2">
                    {Array.from({ length: room.players }).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-surface bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">
                        P{i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/battle/${room.code}?subject=${room.subject}`)}
                className="w-full mt-5 py-2.5 bg-surfaceHover group-hover:bg-primary group-hover:text-white border border-white/5 rounded-xl text-xs font-bold text-gray-300 transition-all duration-200"
              >
                Join Battle
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleLobby;
