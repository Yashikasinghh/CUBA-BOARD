import { useState } from 'react';
import { Trophy, Flame, Zap, Award } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { getInitials, getLevelName } from '@/lib/utils';

// Static base contestants
const baseContestants = [
  { name: 'Alex Johnson', xp: 5800, level: 'Scholar', streak: 42, avatar: 'A' },
  { name: 'Sarah Miller', xp: 4100, level: 'Scholar', streak: 28, avatar: 'S' },
  { name: 'David Chen', xp: 2200, level: 'Explorer', streak: 7, avatar: 'D' },
  { name: 'Emily Davis', xp: 1400, level: 'Beginner', streak: 12, avatar: 'E' },
  { name: 'Nikhil Sen', xp: 950, level: 'Beginner', streak: 5, avatar: 'N' },
  { name: 'Pooja Sharma', xp: 450, level: 'Beginner', streak: 2, avatar: 'P' },
];

const Podium = ({ users }: { users: any[] }) => {
  // Safe ordering: 2nd (index 1), 1st (index 0), 3rd (index 2)
  const first = users[0];
  const second = users[1] || { rank: 2, name: '-', xp: 0, avatar: '?', level: 'Beginner' };
  const third = users[2] || { rank: 3, name: '-', xp: 0, avatar: '?', level: 'Beginner' };

  const podiumOrder = [second, first, third];

  return (
    <div className="flex justify-center items-end h-80 gap-6 mb-16 mt-8">
      {podiumOrder.map((user, idx) => {
        const isFirst = idx === 1;
        const isSecond = idx === 0;
        const isThird = idx === 2;
        
        let heightClass = "h-40";
        let colorClass = "from-purple-500/80 to-indigo-600/80 border-purple-500/20";
        let rankLabel = "3rd";
        
        if (isFirst) {
          heightClass = "h-56";
          colorClass = "from-yellow-500/80 to-amber-600/80 border-yellow-500/20";
          rankLabel = "1st";
        } else if (isSecond) {
          heightClass = "h-48";
          colorClass = "from-gray-400/80 to-gray-600/80 border-gray-400/20";
          rankLabel = "2nd";
        }

        return (
          <div key={user.name + '-' + idx} className={`flex flex-col items-center w-32 relative group transition-transform duration-300 hover:-translate-y-1 ${
            user.isCurrentUser ? 'scale-105' : ''
          }`}>
            {isFirst && <Trophy className="w-10 h-10 text-yellow-400 absolute -top-12 animate-bounce" />}
            
            <div className="flex flex-col items-center mb-3 text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white border-2 bg-surfaceHover relative ${
                isFirst ? 'ring-4 ring-yellow-400/20 border-yellow-400' : isSecond ? 'ring-4 ring-gray-400/20 border-gray-400' : 'ring-4 ring-purple-400/20 border-amber-700'
              }`}>
                {user.avatar ? user.avatar.slice(0, 2) : '?'}
                {user.isCurrentUser && (
                  <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-bg-primary">
                    YOU
                  </span>
                )}
              </div>
              <p className="text-white font-bold mt-2 text-sm truncate max-w-[110px]">{user.name}</p>
              <p className="text-primary text-xs font-semibold font-mono">{user.xp.toLocaleString()} XP</p>
            </div>
            
            <div className={`w-full ${heightClass} bg-gradient-to-t ${colorClass} rounded-t-2xl border-t border-x shadow-2xl flex flex-col justify-start items-center pt-4 relative overflow-hidden transition-all group-hover:brightness-110`}>
              <div className="absolute inset-0 bg-white/5" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 10%, 0 20%)' }}></div>
              <span className="text-3xl font-black text-white/20 select-none">{rankLabel}</span>
              <span className="text-[10px] text-white/50 font-medium px-2 py-0.5 bg-black/10 rounded-full mt-2 truncate max-w-[80px]">
                {user.level}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Leaderboard = () => {
  const { user } = useUserStore();
  const [tab, setTab] = useState<'global' | 'weekly' | 'monthly'>('global');

  // Compute standings dynamically based on chosen tab
  const getRankedEntries = () => {
    // Randomize slightly for other tabs to simulate progress
    let multiplier = 1;
    if (tab === 'weekly') multiplier = 0.35;
    if (tab === 'monthly') multiplier = 0.7;

    const currentXp = user.stats.totalXP;
    
    const entries = baseContestants.map(c => ({
      name: c.name,
      xp: Math.round(c.xp * multiplier),
      level: c.level,
      streak: c.streak,
      avatar: c.avatar,
      isCurrentUser: false,
    }));

    // Inject User entry
    entries.push({
      name: user.name,
      xp: currentXp,
      level: `${user.level} ${getLevelName(user.level)}`,
      streak: user.streak,
      avatar: getInitials(user.name),
      isCurrentUser: true,
    });

    // Sort entries descending
    entries.sort((a, b) => b.xp - a.xp);

    // Apply ranking values
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  };

  const rankedUsers = getRankedEntries();
  const podiumUsers = rankedUsers.slice(0, 3);
  const userEntry = rankedUsers.find(u => u.isCurrentUser);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Title Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <Trophy className="text-yellow-400 w-8 h-8" />
          Leaderboard
        </h1>
        <div className="inline-flex bg-surface p-1 rounded-full border border-white/5">
          <button 
            onClick={() => setTab('global')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              tab === 'global' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Global
          </button>
          <button 
            onClick={() => setTab('weekly')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              tab === 'weekly' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTab('friends')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              tab === 'friends' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Podium (Top 3) */}
      <Podium users={podiumUsers} />

      {/* Full Leaderboard Standings */}
      <div className="card max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Rank Standings
          </h2>
          {userEntry && (
            <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full border border-primary/15">
              Your Rank: #{userEntry.rank}
            </span>
          )}
        </div>

        <div className="space-y-4">
          {rankedUsers.map((userItem) => (
            <div 
              key={userItem.name} 
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                userItem.isCurrentUser 
                  ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-2 ring-primary/20 scale-[1.01]' 
                  : 'bg-surfaceHover border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 text-center font-bold text-sm ${
                  userItem.rank === 1 ? 'text-yellow-400' : userItem.rank === 2 ? 'text-gray-400' : userItem.rank === 3 ? 'text-amber-700' : 'text-gray-500'
                }`}>
                  #{userItem.rank}
                </span>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border text-white ${
                  userItem.isCurrentUser ? 'bg-primary border-primary' : 'bg-surface border-white/10'
                }`}>
                  {userItem.avatar}
                </div>
                
                <div>
                  <p className="text-white font-bold text-sm flex items-center gap-2">
                    {userItem.name}
                    {userItem.isCurrentUser && (
                      <span className="text-[9px] bg-primary text-white font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{userItem.level}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-orange-500 font-bold font-mono">
                  <Flame className="w-4 h-4" />
                  {userItem.streak}
                </div>
                <div className="flex items-center gap-1 text-primary font-black font-mono">
                  <Zap className="w-4 h-4" />
                  {userItem.xp.toLocaleString()} XP
                </div>
                {!userItem.isCurrentUser && (
                  <button
                    onClick={() => window.location.href = '/battle'}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-all border border-primary/20"
                  >
                    Challenge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
