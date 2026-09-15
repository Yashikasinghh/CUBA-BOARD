import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, HelpCircle, MessageSquare, ThumbsUp } from 'lucide-react';

interface StatItem {
  icon: React.FC<{ size?: number; className?: string }>;
  end: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: Users,
    end: 10000,
    suffix: '+',
    label: 'Active Students',
    color: 'text-electric-light',
  },
  {
    icon: HelpCircle,
    end: 50000,
    suffix: '+',
    label: 'Quizzes Generated',
    color: 'text-violet-light',
  },
  {
    icon: MessageSquare,
    end: 1000000,
    suffix: '+',
    label: 'Questions Answered',
    color: 'text-neon-green-light',
  },
  {
    icon: ThumbsUp,
    end: 95,
    suffix: '%',
    label: 'Student Satisfaction',
    color: 'text-gold-light',
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
  return num.toString();
}

const AnimatedCounter: React.FC<{
  end: number;
  suffix: string;
  isInView: boolean;
  color: string;
}> = ({ end, suffix, isInView, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end]);

  return (
    <span className={`text-4xl sm:text-5xl lg:text-6xl font-black font-mono gradient-text-mixed ${color}`}>
      {formatNumber(count)}
      {count >= end ? suffix : ''}
    </span>
  );
};

export const StatsSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary/50 to-bg-primary" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-4">
            Numbers That <span className="gradient-text-neon">Speak</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Join a growing community of smart learners.
          </p>
        </motion.div>

        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-3 rounded-xl bg-bg-card border border-border mb-4">
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="mb-2">
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  isInView={isInView}
                  color={stat.color}
                />
              </div>
              <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
