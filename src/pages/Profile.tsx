import { useState } from 'react';
import { Settings, Target, Zap, Clock, BookOpen, Award, UserCheck, Flame, Trophy, Lock } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { getLevelName, getRelativeTime, getInitials } from '@/lib/utils';
import { mockQuizzes, mockAchievements } from '@/lib/mockData';

const rarityConfig: Record<string, { ring: string; bg: string; label: string }> = {
  common:    { ring: 'ring-zinc-400/40',    bg: 'bg-zinc-700/30',    label: 'text-zinc-400' },
  rare:      { ring: 'ring-sky-400/60',     bg: 'bg-sky-900/30',     label: 'text-sky-400' },
  epic:      { ring: 'ring-fuchsia-400/60', bg: 'bg-fuchsia-900/30', label: 'text-fuchsia-400' },
  legendary: { ring: 'ring-amber-400/80',   bg: 'bg-amber-900/30',   label: 'text-amber-400' },
};

const Profile = () => {
  const { user, attempts } = useUserStore();
  const [showPreferences, setShowPreferences] = useState(false);
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const subjectScores: Record<string, { totalScore: number; count: number }> = {};
  attempts.forEach(attempt => {
    const quiz = mockQuizzes.find(q => q.id === attempt.quizId);
    const subject = quiz ? quiz.subject : 'General';
    if (!subjectScores[subject]) subjectScores[subject] = { totalScore: 0, count: 0 };
    subjectScores[subject].totalScore += attempt.score;
    subjectScores[subject].count += 1;
  });

  const subjectMastery = Object.entries(subjectScores).map(([name, data]) => ({
    name,
    val: Math.round(data.totalScore / data.count),
  }));

  const displayMastery = subjectMastery.length > 0
    ? subjectMastery
    : [{ name: 'Physics', val: 0 }, { name: 'Chemistry', val: 0 }, { name: 'Mathematics', val: 0 }];

  const filteredAchievements = mockAchievements.filter(a => {
    if (achievementFilter === 'unlocked') return a.unlocked;
    if (achievementFilter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-2xl relative z-10" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-surface shadow-2xl relative z-10">
            {getInitials(user.name)}
          </div>
        )}
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">{user.name}</h1>
              <p className="text-primary font-semibold text-sm mt-1 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block">
                Level {user.level} {getLevelName(user.level)}
              </p>
            </div>
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center gap-2 px-4 py-2.5 bg-surfaceHover hover:bg-white/10 text-white rounded-xl font-bold transition-colors text-sm border border-white/5 shadow-md"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5 font-mono">
              <Zap className="w-4 h-4 text-primary" /> {user.stats.totalXP.toLocaleString()} XP
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Flame className="w-4 h-4 text-orange-500" /> {user.streak} Day Streak
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" /> Joined {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {showPreferences && (
        <div className="card space-y-4 border border-primary/20 bg-primary/5 transition-all">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-gray-500">Exam Focus</p>
              <p className="text-white font-semibold">{user.preferences.examType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500">Daily Study Goal</p>
              <p className="text-white font-semibold">{user.preferences.dailyGoalMinutes} Minutes</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500">Registered Subjects</p>
              <p className="text-white font-semibold leading-relaxed">{user.preferences.subjects.join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Stats + Mastery */}
        <div className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Statistics
            </h2>
            <div className="space-y-4">
              {[
                { icon: <Target className="w-4 h-4" />, label: 'Quizzes Taken', value: user.quizzesCompleted, color: '' },
                { icon: <Zap className="w-4 h-4 text-primary" />, label: 'Avg. Accuracy', value: `${user.accuracy}%`, color: 'text-success' },
                { icon: <Clock className="w-4 h-4 text-blue-500" />, label: 'Study Time', value: `${Math.floor(user.studyTimeMinutes / 60)}h ${user.studyTimeMinutes % 60}m`, color: '' },
                { icon: <Flame className="w-4 h-4 text-orange-500" />, label: 'Best Streak', value: `${user.longestStreak} Days`, color: 'text-orange-500' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-gray-400 flex items-center gap-2">{stat.icon} {stat.label}</span>
                  <span className={`font-bold font-mono ${stat.color || 'text-white'}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Subject Mastery
            </h2>
            <div className="space-y-5">
              {displayMastery.map(sub => (
                <div key={sub.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{sub.name}</span>
                    <span className="text-primary font-bold font-mono">{sub.val}%</span>
                  </div>
                  <div className="h-2 bg-surfaceHover rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700" style={{ width: `${sub.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - History */}
        <div className="md:col-span-2">
          <div className="card h-full flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Quiz History
            </h2>
            <div className="space-y-4 flex-1">
              {attempts.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between p-4 bg-surfaceHover rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.score >= 75 ? 'bg-success/20 text-success' :
                      item.score >= 50 ? 'bg-orange-500/20 text-orange-500' :
                      'bg-error/20 text-error'
                    }`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm line-clamp-1">{item.quizTitle}</h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{getRelativeTime(item.completedAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold font-mono text-sm ${
                      item.score >= 75 ? 'text-success' :
                      item.score >= 50 ? 'text-orange-500' : 'text-error'
                    }`}>{item.score}%</p>
                    <p className="text-[10px] text-primary font-bold font-mono">+{item.xpEarned} XP</p>
                  </div>
                </div>
              ))}
              {attempts.length === 0 && (
                <div className="py-16 text-center text-gray-500 text-sm">
                  No quiz history found. Generate and take quizzes to populate your record!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Achievements Section ── */}
      <div className="card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Achievements
            <span className="text-xs font-mono text-gray-500 ml-1">
              ({mockAchievements.filter(a => a.unlocked).length}/{mockAchievements.length} unlocked)
            </span>
          </h2>
          <div className="flex gap-2">
            {(['all', 'unlocked', 'locked'] as const).map(f => (
              <button
                key={f}
                onClick={() => setAchievementFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  achievementFilter === f
                    ? 'bg-primary text-white'
                    : 'bg-surfaceHover text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAchievements.map(achievement => {
            const rarity = rarityConfig[achievement.rarity] ?? rarityConfig.common;
            const progress = Math.min(100, Math.round((achievement.progress / achievement.requirement) * 100));

            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-xl border transition-all group ${
                  achievement.unlocked
                    ? 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:-translate-y-0.5'
                    : 'border-white/5 bg-white/[0.01] opacity-50 grayscale'
                }`}
              >
                {!achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-3 h-3 text-gray-600" />
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl ${rarity.bg} ring-2 ring-offset-2 ring-offset-surface ${rarity.ring} grid place-items-center text-2xl mb-3 mx-auto`}>
                  {/* Icon represented as emoji-like initials since we store Lucide icon names */}
                  <span>{achievement.icon === 'Rocket' ? '🚀' : achievement.icon === 'BookOpen' ? '📖' : achievement.icon === 'Star' ? '⭐' : achievement.icon === 'Flame' ? '🔥' : achievement.icon === 'Layers' ? '📚' : achievement.icon === 'Trophy' ? '🏆' : achievement.icon === 'Zap' ? '⚡' : achievement.icon === 'Swords' ? '⚔️' : achievement.icon === 'Brain' ? '🧠' : achievement.icon === 'Crown' ? '👑' : achievement.icon === 'RotateCcw' ? '🔄' : achievement.icon === 'Timer' ? '⏱️' : '🎯'}</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white truncate">{achievement.title}</p>
                  <p className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${rarity.label}`}>{achievement.rarity}</p>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{achievement.description}</p>
                </div>
                {!achievement.unlocked && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[9px] text-gray-600 font-mono mb-1">
                      <span>{achievement.progress}</span>
                      <span>{achievement.requirement}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
