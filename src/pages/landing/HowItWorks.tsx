import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Upload, Cpu, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload',
    description: 'Upload your study material — PDFs, notes, presentations, or paste text directly.',
    color: 'electric',
    iconBg: 'bg-electric/15',
    iconColor: 'text-electric-light',
    borderColor: 'border-electric/30',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Generates',
    description: 'Our AI analyzes your content and creates personalized quizzes, flashcards, and study plans.',
    color: 'violet',
    iconBg: 'bg-violet/15',
    iconColor: 'text-violet-light',
    borderColor: 'border-violet/30',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Learn & Grow',
    description: 'Take quizzes, review flashcards, battle friends, and track your progress as you master topics.',
    color: 'neon-green',
    iconBg: 'bg-neon-green/15',
    iconColor: 'text-neon-green-light',
    borderColor: 'border-neon-green/30',
  },
];

export const HowItWorks: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-electric/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-4">
            How It <span className="gradient-text-violet">Works</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Three simple steps to supercharge your learning journey.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-[16.67%] right-[16.67%] -translate-y-1/2 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              className="h-[2px] w-full origin-left"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, #2a3550 0px, #2a3550 8px, transparent 8px, transparent 16px)',
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className="text-center"
              >
                {/* Number badge */}
                <div className="mb-6 inline-flex items-center justify-center">
                  <div className={`relative w-20 h-20 rounded-2xl ${step.iconBg} border ${step.borderColor} flex items-center justify-center`}>
                    <step.icon size={32} className={step.iconColor} />
                    <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-bg-primary border ${step.borderColor} flex items-center justify-center`}>
                      <span className={`text-xs font-bold font-mono ${step.iconColor}`}>{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

                {/* Mobile connecting arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="flex flex-col items-center gap-1"
                    >
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-0.5 h-2 rounded-full bg-border" />
                      ))}
                      <div className="w-2 h-2 rotate-45 border-b border-r border-border" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
