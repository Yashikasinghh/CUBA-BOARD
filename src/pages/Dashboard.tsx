import { useNavigate, Link } from 'react-router-dom';
import {
  Zap, Flame, Clock, Brain, Target, BookOpen,
  ChevronRight, TrendingUp, AlertTriangle, CheckCircle,
  Swords, Upload, ArrowUpRight,
} from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { mockQuizzes, weeklyStudyData, subjectDistribution } from '@/lib/mockData';
import { getLevelName, getXPProgress } from '@/lib/utils';
import { SUBJECT_COLORS, DIFFICULTY_CONFIG } from '@/lib/constants';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PolarAngleAxis, PolarGrid, Radar, RadarChart,
} from 'recharts';

// ── Streak strip visualizer ──────────────────────────────
const StreakStrip = ({ days }: { days: number }) => {
  const slots = Array.from({ length: 7 }, (_, i) => i < (days % 7 || 7));
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className="flex gap-2 mt-3">
      {slots.map((on, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`h-9 w-full rounded-lg flex items-center justify-center text-base transition-all ${
              on
                ? 'bg-gradient-to-br from-orange-400 to-rose-500 shadow-[0_0_12px_-2px_rgba(251,146,60,0.5)]'
                : 'bg-surfaceHover border border-white/5'
            }`}
          >
            {on ? '🔥' : ''}
          </div>
          <span className="text-[9px] font-mono text-gray-600 uppercase">{dayLabels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ── Stat card ────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, subtitle, colorClass }: any) => (
  <div className="card flex items-start justify-between card-hover">
    <div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

// ── Custom recharts tooltip ──────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-white/10 rounded-xl px-4 py-2.5 shadow-2xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ── Subject radar data built from subjectDistribution ────
const radarData = subjectDistribution.map(s => ({
  subject: s.subject.replace('Computer Science', 'CS'),
  score: Math.round(50 + (s.quizzes / 14) * 44),
}));

// ── XP area chart data derived from weeklyStudyData ──────
const xpAreaData = weeklyStudyData.map(d => ({
  day: d.day,
  xp: d.quizzes * 75 + d.studyMinutes,
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, attempts } = useUserStore();

  const levelProgress = getXPProgress(user.xp);
  const currentLevelName = getLevelName(user.level);

  // Subject averages for strong/weak areas
  const subjectScores: Record<string, { totalScore: number; count: number }> = {};
  attempts.forEach(attempt => {
    const quiz = mockQuizzes.find(q => q.id === attempt.quizId);
    const subject = quiz ? quiz.subject : 'General';
    if (!subjectScores[subject]) subjectScores[subject] = { totalScore: 0, count: 0 };
    subjectScores[subject].totalScore += attempt.score;
    subjectScores[subject].count += 1;
  });

  const subjectAverages = Object.entries(subjectScores)
    .map(([subject, data]) => ({ subject, avg: Math.round(data.totalScore / data.count) }))
    .sort((a, b) => b.avg - a.avg);

  const strongTopics = subjectAverages.filter(i => i.avg >= 75);
  const weakTopics   = subjectAverages.filter(i => i.avg < 75);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-1">Learning Hub</p>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400 text-sm">Here's what's happening with your learning journey.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2.5 bg-surfaceHover hover:bg-white/10 text-white rounded-xl font-medium transition-colors text-sm border border-white/5 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button
            onClick={() => navigate('/battle')}
            className="px-5 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl font-medium transition-colors text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Swords className="w-4 h-4" />
            Battle Arena
          </button>
        </div>
      </div>

      {/* ── XP Level Bar ──────────────────────────────────── */}
      <div className="card flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center border-4 border-surface shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0">
          <span className="text-xl font-bold text-white">{user.level}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span className="text-primary font-bold">Level {user.level} — {currentLevelName}</span>
            <span className="text-gray-400">{user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP</span>
          </div>
          <div className="h-3 bg-surfaceHover rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700 relative"
              style={{ width: `${levelProgress * 100}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-md" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Daily Streak"      value={`${user.streak} Days`}                  subtitle={`Longest: ${user.longestStreak} days`}        icon={Flame}    colorClass="bg-orange-500/10 text-orange-500" />
        <StatCard title="Accuracy"          value={`${user.accuracy}%`}                     subtitle="Overall correct answers"                     icon={Target}   colorClass="bg-green-500/10 text-green-500"  />
        <StatCard title="Total XP"          value={user.stats.totalXP.toLocaleString()}      subtitle={`${Math.round(levelProgress * 100)}% this level`} icon={Zap}  colorClass="bg-primary/10 text-primary"       />
        <StatCard title="Study Time"        value={`${Math.floor(user.studyTimeMinutes / 60)}h ${user.studyTimeMinutes % 60}m`} subtitle="Spent revising materials" icon={Clock} colorClass="bg-blue-500/10 text-blue-500"   />
        <StatCard title="Quizzes Completed" value={user.quizzesCompleted}                   subtitle="Assessments taken"                           icon={Brain}    colorClass="bg-purple-500/10 text-purple-500" />
        <StatCard title="Topics Mastered"   value={user.topicsMastered}                     subtitle="XP earning subjects"                         icon={BookOpen} colorClass="bg-pink-500/10 text-pink-500"     />
      </div>

      {/* ── Streak Week + Charts Row ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Streak Strip Card */}
        <div className="card space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-bold text-white">This Week's Streak</h2>
          </div>
          <p className="text-4xl font-extrabold text-white">
            {user.streak}
            <span className="text-sm font-mono font-normal text-gray-400 ml-2">days</span>
          </p>
          <StreakStrip days={user.streak} />
        </div>

        {/* XP Area Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Performance · Last 7 Days
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-bold">+24%</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpAreaData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xp-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="xp" name="XP" stroke="#6366f1" strokeWidth={2} fill="url(#xp-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Subject Radar + Strong/Weak ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Radar Chart */}
        <div className="card">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Subject Mastery Radar
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <Radar dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strong/Weak areas */}
        <div className="card space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              Strong & Weak Areas
            </h2>
            <p className="text-xs text-gray-500">AI-powered evaluation based on quiz accuracy per subject</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3 p-4 bg-surfaceHover rounded-xl border border-success/10">
              <h3 className="text-xs font-bold text-success flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" /> Strong (≥ 75%)
              </h3>
              {strongTopics.length > 0 ? (
                strongTopics.map(item => (
                  <div key={item.subject} className="flex justify-between items-center text-sm">
                    <span className="text-gray-200">{item.subject}</span>
                    <span className="font-bold text-success font-mono">{item.avg}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No strong topics yet. Keep taking quizzes!</p>
              )}
            </div>
            <div className="space-y-3 p-4 bg-surfaceHover rounded-xl border border-error/10">
              <h3 className="text-xs font-bold text-error flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Needs Focus ({'<'} 75%)
              </h3>
              {weakTopics.length > 0 ? (
                weakTopics.map(item => (
                  <div key={item.subject} className="flex justify-between items-center text-sm">
                    <span className="text-gray-200">{item.subject}</span>
                    <span className="font-bold text-error font-mono">{item.avg}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">All topics looking strong! 🎉</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Activity + Recommended Quizzes ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {attempts.slice(0, 3).map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surfaceHover flex items-center justify-center">
                    <Target className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Completed Quiz</p>
                    <p className="text-xs text-gray-400">{activity.quizTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${activity.score >= 75 ? 'text-success' : activity.score >= 50 ? 'text-warning' : 'text-error'}`}>
                    {activity.score}%
                  </p>
                  <p className="text-xs text-gray-500 font-medium">+{activity.xpEarned} XP</p>
                </div>
              </div>
            ))}
            {attempts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-6">No recent quiz attempts found.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/battle', icon: Swords, title: 'Battle Arena', desc: '1v1 or group multiplayer battles', color: 'bg-primary/10 text-primary' },
              { to: '/upload', icon: Upload, title: 'Upload Notes', desc: 'PDF, slides — generate a quiz in seconds', color: 'bg-violet/10 text-violet-light' },
              { to: '/flashcards', icon: BookOpen, title: 'Review Flashcards', desc: 'Spaced repetition for deep mastery', color: 'bg-blue-500/10 text-blue-400' },
            ].map(action => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center gap-4 p-4 bg-surfaceHover hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{action.title}</p>
                  <p className="text-xs text-gray-400">{action.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recommended Quizzes ───────────────────────────── */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Recommended Quizzes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => {
            const colors = SUBJECT_COLORS[quiz.subject] || { base: '#94a3b8', light: '#cbd5e1', bg: 'rgba(148, 163, 184, 0.12)' };
            const diffConfig = DIFFICULTY_CONFIG[quiz.difficulty] || { label: quiz.difficulty, color: '#94a3b8' };
            return (
              <div key={quiz.id} className="card flex flex-col justify-between card-hover border-t-4" style={{ borderTopColor: colors.base }}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ color: colors.light, backgroundColor: colors.bg }}>
                      {quiz.subject}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full border" style={{ color: diffConfig.color, borderColor: diffConfig.color }}>
                      {diffConfig.label}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{quiz.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{quiz.topic} &bull; {quiz.questionCount} Questions</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <span className="text-xs text-gray-500 font-medium">Limit: {quiz.timeLimit / 60} min</span>
                  <button
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                    className="text-xs font-bold text-primary hover:text-primaryHover transition-colors flex items-center gap-1"
                  >
                    Start Practice
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
