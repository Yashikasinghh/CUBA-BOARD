import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Layers, Calendar, Swords, BarChart3, Trophy } from 'lucide-react';
import { Card } from '@/components/ui';

const features = [
  {
    icon: Brain,
    title: 'Smart Quiz Generation',
    description: 'Upload your notes, PDFs, or presentations and get instant, AI-generated quizzes tailored to your material.',
    gradient: 'from-electric to-electric-light',
    iconBg: 'bg-electric/15',
    iconColor: 'text-electric-light',
  },
  {
    icon: Layers,
    title: 'AI Flashcards',
    description: 'Auto-generated flashcards from your study material with spaced repetition for maximum retention.',
    gradient: 'from-violet to-violet-light',
    iconBg: 'bg-violet/15',
    iconColor: 'text-violet-light',
  },
  {
    icon: Calendar,
    title: 'Revision Planner',
    description: 'Smart spaced repetition scheduling that adapts to your performance and learning speed.',
    gradient: 'from-neon-green to-neon-green-light',
    iconBg: 'bg-neon-green/15',
    iconColor: 'text-neon-green-light',
  },
  {
    icon: Swords,
    title: 'Battle Arena',
    description: 'Challenge friends in real-time quiz battles. Compete on leaderboards and earn glory.',
    gradient: 'from-rose to-rose/80',
    iconBg: 'bg-rose/15',
    iconColor: 'text-rose',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track every metric of your learning journey with beautiful charts and actionable insights.',
    gradient: 'from-gold to-gold-light',
    iconBg: 'bg-gold/15',
    iconColor: 'text-gold-light',
  },
  {
    icon: Trophy,
    title: 'Achievement System',
    description: 'Earn XP, unlock badges, climb levels, and stay motivated with gamified learning rewards.',
    gradient: 'from-electric to-violet',
    iconBg: 'bg-electric/15',
    iconColor: 'text-electric-light',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const FeaturesSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-violet/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-4">
            Everything You Need to{' '}
            <span className="gradient-text-electric">Learn Smarter</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Six powerful tools working together to transform how you study, practice, and master any subject.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                variant="glass"
                glow="electric"
                padding="lg"
                className="h-full group"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${feature.iconBg} mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon size={24} className={feature.iconColor} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom gradient line */}
                <div className="mt-6 h-0.5 w-12 rounded-full bg-gradient-to-r opacity-50 group-hover:opacity-100 group-hover:w-20 transition-all duration-500"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--color-${feature.gradient.split(' ')[0].replace('from-', '')}), var(--color-${feature.gradient.split(' ')[1]?.replace('to-', '') || feature.gradient.split(' ')[0].replace('from-', '')}))`,
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
