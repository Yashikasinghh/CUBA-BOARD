import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Github, Linkedin, Youtube, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Quiz Center', href: '/dashboard' },
    { label: 'Flashcards', href: '/dashboard' },
  ],
  Resources: [
    { label: 'Blog', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'API', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-bg-secondary border-t border-border/50">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo & Tagline */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 no-underline">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-electric to-violet flex items-center justify-center">
                <span className="text-white font-black text-lg leading-none">C</span>
                <div className="absolute -top-0.5 -right-0.5">
                  <Sparkles size={10} className="text-gold" />
                </div>
              </div>
              <span className="text-xl font-bold text-text-primary">
                Cuba <span className="gradient-text-electric">Board</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Cuba Board turns personal study material into an interactive learning game with AI quizzes, flashcards, and competitive study modes.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-text-primary font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-text-muted text-sm hover:text-text-secondary transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-8 border-t border-border/50">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-electric/40 transition-all no-underline"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>

          <p className="text-text-muted text-xs flex items-center gap-1">
            © 2026 Cuba Board. Master Product Documentation v1.0. Made with{' '}
            <Heart size={12} className="text-rose fill-rose" /> for students & learners
          </p>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-1 bg-gradient-to-r from-electric via-violet to-electric" />
    </footer>
  );
};

export default Footer;
