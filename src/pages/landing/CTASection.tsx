import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

export const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-electric/8 blur-[150px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-violet/8 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] rounded-full bg-electric/5 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Sparkle icon */}
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex mb-6"
          >
            <Sparkles size={40} className="text-gold" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-6 leading-tight">
            Ready to Transform
            <br />
            Your <span className="gradient-text-electric">Learning</span>?
          </h2>

          <p className="text-text-secondary text-lg sm:text-xl max-w-xl mx-auto mb-10">
            Join 10,000+ students who are studying smarter, not harder. Start for free and unlock your potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="xl" rightIcon={<ArrowRight size={20} />}>
                Start Learning Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" size="xl">
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="text-text-muted text-sm mt-6">
            No credit card required • Free forever plan available
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
