import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'JEE Aspirant',
    initials: 'PS',
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    quote:
      'Questify transformed my JEE preparation completely. The AI-generated quizzes from my own notes are way more effective than generic question banks. My mock test scores jumped 40% in just two months!',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'NEET Student',
    initials: 'RV',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    quote:
      'The AI quizzes are incredibly accurate and challenging. It picks up on exactly what I need to revise. The spaced repetition flashcards helped me retain Biology concepts I kept forgetting.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'College Student',
    initials: 'AP',
    gradient: 'linear-gradient(135deg, #22c55e, #4ade80)',
    quote:
      "I used to just re-read notes before exams, which never worked. Questify's quiz generation forced me to actively recall information. My GPA went from 7.2 to 8.9 in one semester!",
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    role: 'UPSC Aspirant',
    initials: 'VS',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    quote:
      "The revision planner is a game-changer for UPSC prep. It schedules reviews at exactly the right intervals. The battle arena keeps me competitive and motivated with my study group.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const TestimonialsSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-4">
            Loved by <span className="gradient-text-gold">Students</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            See how Questify is helping students across India ace their exams.
          </p>
        </motion.div>

        {/* Testimonials Grid - Horizontal scroll on mobile, grid on desktop */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="min-w-[320px] sm:min-w-[360px] lg:min-w-0 snap-start"
            >
              <Card variant="glass" glow="violet" padding="lg" className="h-full relative">
                {/* Quote icon */}
                <Quote
                  size={32}
                  className="text-border absolute top-6 right-6 opacity-50"
                />

                {/* Rating */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-gold fill-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-text-secondary text-sm leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: testimonial.gradient }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
