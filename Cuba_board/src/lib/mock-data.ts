export type Subject = "Biology" | "History" | "Math" | "Physics" | "Law" | "CS";

export const currentUser = {
  id: "u_1",
  name: "Alex Morgan",
  handle: "@alex.m",
  email: "alex@cuba.board",
  avatar: "AM",
  points: 12450,
  level: 24,
  xp: 6400,
  xpToNext: 8000,
  rank: "Diamond",
  streak: 12,
  joined: "2024-02-14",
};

export type Note = {
  id: string; title: string; subject: Subject; pages: number; updated: string; color: string;
};
export const notes: Note[] = [
  { id: "n1", title: "Cellular Respiration", subject: "Biology", pages: 24, updated: "2h ago", color: "from-emerald-500/30 to-cyan-500/30" },
  { id: "n2", title: "World War II — Pacific Theater", subject: "History", pages: 41, updated: "yesterday", color: "from-amber-500/30 to-rose-500/30" },
  { id: "n3", title: "Linear Algebra: Eigenvectors", subject: "Math", pages: 18, updated: "3d ago", color: "from-indigo-500/30 to-violet-500/30" },
  { id: "n4", title: "Quantum Tunneling", subject: "Physics", pages: 32, updated: "1w ago", color: "from-blue-500/30 to-cyan-500/30" },
  { id: "n5", title: "Constitutional Law Cases", subject: "Law", pages: 56, updated: "2w ago", color: "from-fuchsia-500/30 to-pink-500/30" },
  { id: "n6", title: "Data Structures: Trees", subject: "CS", pages: 22, updated: "3w ago", color: "from-sky-500/30 to-indigo-500/30" },
];

export type Quiz = { id: string; title: string; subject: Subject; score: number; total: number; date: string };
export const quizzes: Quiz[] = [
  { id: "q1", title: "Cell Bio Sprint", subject: "Biology", score: 9, total: 10, date: "Today" },
  { id: "q2", title: "WWII Battles", subject: "History", score: 7, total: 10, date: "Yesterday" },
  { id: "q3", title: "Eigen Drill", subject: "Math", score: 8, total: 10, date: "Mon" },
  { id: "q4", title: "Quantum 101", subject: "Physics", score: 6, total: 10, date: "Sun" },
  { id: "q5", title: "Tree Traversals", subject: "CS", score: 10, total: 10, date: "Sat" },
];

export type LeaderRow = { rank: number; name: string; handle: string; xp: number; delta: number; avatar: string; you?: boolean };
export const leaderboard: LeaderRow[] = [
  { rank: 1, name: "Quantum Queer", handle: "@qq", xp: 24500, delta: 0, avatar: "QQ" },
  { rank: 2, name: "BioHacker99", handle: "@bio", xp: 23110, delta: 1, avatar: "BH" },
  { rank: 3, name: "Sarah Jenkins", handle: "@sj", xp: 22300, delta: -1, avatar: "SJ" },
  { rank: 4, name: "Leo Zhang", handle: "@leoz", xp: 19980, delta: 2, avatar: "LZ" },
  { rank: 5, name: "Amara Okafor", handle: "@amara", xp: 18750, delta: 0, avatar: "AO" },
  { rank: 6, name: "Alex Morgan", handle: "@alex.m", xp: 12450, delta: 4, avatar: "AM", you: true },
  { rank: 7, name: "Jordan Rivera", handle: "@jordan", xp: 11200, delta: -1, avatar: "JR" },
  { rank: 8, name: "Maya Chen", handle: "@maya", xp: 10410, delta: 0, avatar: "MC" },
];

export type Achievement = { id: string; name: string; description: string; rarity: "common" | "rare" | "epic" | "legendary"; unlocked: boolean; icon: string };
export const achievements: Achievement[] = [
  { id: "a1", name: "First Blood", description: "Win your first battle", rarity: "common", unlocked: true, icon: "🩸" },
  { id: "a2", name: "Streak Master", description: "Maintain a 10-day streak", rarity: "rare", unlocked: true, icon: "🔥" },
  { id: "a3", name: "Brainiac", description: "Score 100% on 5 quizzes", rarity: "rare", unlocked: true, icon: "🧠" },
  { id: "a4", name: "Speed Demon", description: "Answer 10 questions in under 30s", rarity: "epic", unlocked: true, icon: "⚡" },
  { id: "a5", name: "Untouchable", description: "Win 25 battles in a row", rarity: "legendary", unlocked: false, icon: "👑" },
  { id: "a6", name: "Polymath", description: "Top 10% in 5 subjects", rarity: "epic", unlocked: false, icon: "🎓" },
  { id: "a7", name: "Knowledge Hoarder", description: "Upload 100 notes", rarity: "rare", unlocked: false, icon: "📚" },
  { id: "a8", name: "Late Night Scholar", description: "Study after midnight 10x", rarity: "common", unlocked: true, icon: "🌙" },
];

export type Notif = { id: string; type: "battle" | "achievement" | "friend" | "reminder"; title: string; body: string; time: string; read: boolean };
export const notifications: Notif[] = [
  { id: "nt1", type: "battle", title: "Battle invite from Sarah", body: "Biology · 10 questions · 30s timer", time: "5m", read: false },
  { id: "nt2", type: "achievement", title: "Achievement unlocked", body: "You earned 'Speed Demon' ⚡", time: "1h", read: false },
  { id: "nt3", type: "friend", title: "New friend request", body: "Leo Zhang wants to connect", time: "3h", read: false },
  { id: "nt4", type: "reminder", title: "Daily streak", body: "Take a quiz today to keep your 12-day streak", time: "6h", read: true },
  { id: "nt5", type: "battle", title: "Rematch from Jordan", body: "WWII rematch — best of 3", time: "yesterday", read: true },
];

export type Friend = { id: string; name: string; handle: string; avatar: string; online: boolean; xp: number };
export const friends: Friend[] = [
  { id: "f1", name: "Sarah Jenkins", handle: "@sj", avatar: "SJ", online: true, xp: 22300 },
  { id: "f2", name: "Leo Zhang", handle: "@leoz", avatar: "LZ", online: true, xp: 19980 },
  { id: "f3", name: "Amara Okafor", handle: "@amara", avatar: "AO", online: false, xp: 18750 },
  { id: "f4", name: "Jordan Rivera", handle: "@jordan", avatar: "JR", online: true, xp: 11200 },
  { id: "f5", name: "Maya Chen", handle: "@maya", avatar: "MC", online: false, xp: 10410 },
];

export type Question = { id: string; q: string; options: string[]; correct: number };
export function generateMockQuestions(subject: Subject, count = 5): Question[] {
  const bank: Record<Subject, Question[]> = {
    Biology: [
      { id: "b1", q: "Which organelle is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], correct: 1 },
      { id: "b2", q: "DNA replication occurs in which phase?", options: ["G1", "S", "G2", "M"], correct: 1 },
      { id: "b3", q: "Photosynthesis primarily occurs in the…", options: ["Mitochondria", "Chloroplast", "Vacuole", "Lysosome"], correct: 1 },
      { id: "b4", q: "ATP stands for…", options: ["Adenosine Triphosphate", "Amino Tri Peptide", "Active Transport Pump", "Alpha Test Protein"], correct: 0 },
      { id: "b5", q: "Which is NOT a base in DNA?", options: ["Adenine", "Uracil", "Cytosine", "Guanine"], correct: 1 },
    ],
    History: [
      { id: "h1", q: "WWII ended in what year?", options: ["1943", "1945", "1947", "1939"], correct: 1 },
      { id: "h2", q: "Pearl Harbor attack date?", options: ["Dec 7 1941", "Sep 1 1939", "Jun 6 1944", "Aug 6 1945"], correct: 0 },
      { id: "h3", q: "Operation Overlord was…", options: ["Stalingrad", "D-Day", "Midway", "Yalta"], correct: 1 },
      { id: "h4", q: "Who led the Soviet Union in WWII?", options: ["Lenin", "Stalin", "Khrushchev", "Trotsky"], correct: 1 },
      { id: "h5", q: "Where was the atomic bomb dropped first?", options: ["Tokyo", "Nagasaki", "Hiroshima", "Osaka"], correct: 2 },
    ],
    Math: [
      { id: "m1", q: "Derivative of sin(x) is…", options: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"], correct: 0 },
      { id: "m2", q: "An eigenvector of I is…", options: ["Only 0", "Any nonzero vector", "Only unit vectors", "Doesn't exist"], correct: 1 },
      { id: "m3", q: "∫ 1/x dx =", options: ["ln|x| + C", "1/x² + C", "x + C", "eˣ + C"], correct: 0 },
      { id: "m4", q: "Det of a 2x2 matrix [[a,b],[c,d]] =", options: ["ad-bc", "ac-bd", "ab-cd", "a+d"], correct: 0 },
      { id: "m5", q: "π is…", options: ["Rational", "Irrational", "Imaginary", "Integer"], correct: 1 },
    ],
    Physics: [
      { id: "p1", q: "Unit of force is…", options: ["Joule", "Newton", "Watt", "Pascal"], correct: 1 },
      { id: "p2", q: "Speed of light ≈", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1 },
      { id: "p3", q: "Quantum tunneling is…", options: ["Classical", "Probabilistic", "Impossible", "Magnetic"], correct: 1 },
      { id: "p4", q: "E = mc², c is…", options: ["Mass", "Speed of light", "Charge", "Constant of gravity"], correct: 1 },
      { id: "p5", q: "Planck's constant symbol…", options: ["h", "k", "G", "ε"], correct: 0 },
    ],
    Law: [
      { id: "l1", q: "Marbury v. Madison established…", options: ["Judicial review", "Habeas corpus", "Miranda rights", "Eminent domain"], correct: 0 },
      { id: "l2", q: "First Amendment protects…", options: ["Bear arms", "Free speech", "Due process", "Search/seizure"], correct: 1 },
      { id: "l3", q: "Mens rea means…", options: ["Guilty act", "Guilty mind", "Reasonable doubt", "Burden of proof"], correct: 1 },
      { id: "l4", q: "Stare decisis is…", options: ["Precedent", "Plea deal", "Tort", "Discovery"], correct: 0 },
      { id: "l5", q: "Habeas corpus protects against…", options: ["Self-incrimination", "Unlawful detention", "Double jeopardy", "Censorship"], correct: 1 },
    ],
    CS: [
      { id: "c1", q: "Binary search complexity?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
      { id: "c2", q: "A balanced BST has height…", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 1 },
      { id: "c3", q: "DFS uses which structure?", options: ["Queue", "Stack", "Heap", "Hash"], correct: 1 },
      { id: "c4", q: "Quicksort worst case?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 2 },
      { id: "c5", q: "Hash table avg lookup?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 0 },
    ],
  };
  return bank[subject].slice(0, count);
}

export const activityData = [
  { day: "Mon", xp: 320 }, { day: "Tue", xp: 540 }, { day: "Wed", xp: 280 },
  { day: "Thu", xp: 760 }, { day: "Fri", xp: 620 }, { day: "Sat", xp: 980 }, { day: "Sun", xp: 700 },
];

export const subjectRadar = [
  { subject: "Bio", score: 88 }, { subject: "History", score: 72 },
  { subject: "Math", score: 81 }, { subject: "Physics", score: 65 },
  { subject: "Law", score: 78 }, { subject: "CS", score: 94 },
];

export const battles = [
  { id: "br1", subject: "Biology" as Subject, host: "Sarah Jenkins", players: 2, max: 4, code: "BIO-7732" },
  { id: "br2", subject: "Math" as Subject, host: "Leo Zhang", players: 3, max: 4, code: "MTH-2210" },
  { id: "br3", subject: "History" as Subject, host: "Maya Chen", players: 1, max: 2, code: "HIS-9981" },
  { id: "br4", subject: "CS" as Subject, host: "Jordan Rivera", players: 4, max: 4, code: "CSX-5503" },
];
