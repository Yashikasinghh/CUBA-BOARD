import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { HeroSection } from './landing/HeroSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { StatsSection } from './landing/StatsSection';
import { HowItWorks } from './landing/HowItWorks';
import { TestimonialsSection } from './landing/TestimonialsSection';
import { CTASection } from './landing/CTASection';
import { Footer } from './landing/Footer';

const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass border-b-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="text-primary w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">Cuba Board</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="px-5 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-full text-sm font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-pulse"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-full text-sm font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Landing page sections */}
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
