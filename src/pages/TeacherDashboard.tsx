// ═══════════════════════════════════════════════════════
// CUBA BOARD — Teacher & Mentor Classroom Dashboard
// Class rosters, assignment creation, student performance analytics
// ═══════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Users, Plus, BookOpen, GraduationCap, CheckCircle2, AlertTriangle, ArrowUpRight, Copy } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

interface Student {
  id: string;
  name: string;
  avatar: string;
  quizzesCompleted: number;
  avgAccuracy: number;
  streak: number;
  status: 'active' | 'needs_attention' | 'idle';
}

const mockStudents: Student[] = [
  { id: 's1', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex', quizzesCompleted: 14, avgAccuracy: 88, streak: 12, status: 'active' },
  { id: 's2', name: 'Sneha Patel', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sneha', quizzesCompleted: 11, avgAccuracy: 92, streak: 8, status: 'active' },
  { id: 's3', name: 'Rahul Krishnan', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul', quizzesCompleted: 9, avgAccuracy: 79, streak: 5, status: 'active' },
  { id: 's4', name: 'Pooja Sharma', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Pooja', quizzesCompleted: 4, avgAccuracy: 58, streak: 1, status: 'needs_attention' },
];

const mockAssignments = [
  { id: 'a1', title: 'OS Process Scheduling Assessment', subject: 'Computer Science', dueDate: 'Tomorrow, 11:59 PM', submittedCount: 12, totalCount: 15 },
  { id: 'a2', title: 'Thermodynamics & Heat Transfer Practice', subject: 'Physics', dueDate: 'Sep 18, 2026', submittedCount: 8, totalCount: 15 },
];

const TeacherDashboard: React.FC = () => {
  const [classCode] = useState('CLASS-8821');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Classroom Management</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Teacher & Mentor Dashboard</h1>
          <p className="text-gray-400 text-sm">Monitor student progress, assign AI quizzes, and review class performance.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface p-2.5 rounded-xl border border-white/5 flex items-center gap-3 text-xs">
            <span className="text-gray-400 font-medium">Class Join Code:</span>
            <span className="font-mono font-bold text-white bg-surfaceHover px-2 py-1 rounded border border-white/5">{classCode}</span>
            <button onClick={handleCopyCode} className="text-gray-400 hover:text-white p-1">
              {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button className="px-4 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Class Assignment
          </button>
        </div>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Enrolled', val: '15 Students', icon: Users, color: 'text-primary' },
          { label: 'Class Average', val: '82% Accuracy', icon: CheckCircle2, color: 'text-success' },
          { label: 'Quizzes Taken', val: '148 Total', icon: BookOpen, color: 'text-violet-light' },
          { label: 'Needs Attention', val: '1 Student', icon: AlertTriangle, color: 'text-error' },
        ].map((stat, i) => (
          <div key={i} className="card p-5 bg-surface border border-white/5 rounded-2xl">
            <p className="text-xs text-gray-400 font-medium mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Assignments & Roster Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Assignments */}
        <div className="card space-y-4 bg-surface border border-white/5 p-6 rounded-2xl lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Active Assignments</h2>
            <Badge variant="electric" className="text-xs font-mono">2 Active</Badge>
          </div>

          <div className="space-y-4">
            {mockAssignments.map((ass) => (
              <div key={ass.id} className="p-4 bg-surfaceHover rounded-xl border border-white/5 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{ass.subject}</span>
                  <h3 className="text-sm font-bold text-white mt-1">{ass.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Due: {ass.dueDate}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Submissions</span>
                    <span className="font-mono text-white font-bold">{ass.submittedCount} / {ass.totalCount}</span>
                  </div>
                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(ass.submittedCount / ass.totalCount) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Roster */}
        <div className="card space-y-4 bg-surface border border-white/5 p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Class Roster & Progress</h2>
            <span className="text-xs text-gray-400 font-mono">Sorted by Accuracy</span>
          </div>

          <div className="space-y-3">
            {mockStudents.map((st) => (
              <div key={st.id} className="flex items-center justify-between p-3.5 bg-surfaceHover rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <img src={st.avatar} alt={st.name} className="w-9 h-9 rounded-full object-cover bg-surface" />
                  <div>
                    <p className="text-sm font-bold text-white">{st.name}</p>
                    <p className="text-xs text-gray-400">{st.quizzesCompleted} Quizzes • {st.streak} Day Streak</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div className="text-right">
                    <p className={`font-mono font-bold ${st.avgAccuracy >= 80 ? 'text-success' : 'text-error'}`}>
                      {st.avgAccuracy}% Accuracy
                    </p>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {st.status === 'needs_attention' ? '⚠️ Needs Review' : 'Active'}
                    </span>
                  </div>

                  <button className="p-2 bg-surface hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
