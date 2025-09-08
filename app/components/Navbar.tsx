'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

/**
 * Enhanced Navbar for Chirag Sahani
 *
 * Features:
 * - sticky glass navbar with shrink-on-scroll
 * - active link highlighting (IntersectionObserver)
 * - smooth scrolling with keyboard support
 * - accessible mobile menu with animated reveal
 * - back-to-top floating action button (FAB)
 */

const NAV_ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shrunken, setShrunken] = useState(false);
  const [active, setActive] = useState<string>('#home');
  const [showTopBtn, setShowTopBtn] = useState(false);
  const sectionsRef = useRef<Record<string, IntersectionObserverEntry | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Shrink + scrolled state
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setShrunken(y > 80);
      setShowTopBtn(y > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for active link detection
  useEffect(() => {
    const sections = NAV_ITEMS.map((i) => document.querySelector(i.href));
    sectionsRef.current = {};
    const rootMargin = '-35% 0px -40% 0px'; // triggers when section is near middle

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          sectionsRef.current[id] = entry;
        });

        // Choose the most visible section (largest intersectionRatio)
        let mostVisible: { id: string; ratio: number } | null = null;
        Object.entries(sectionsRef.current).forEach(([id, entry]) => {
          if (!entry) return;
          const ratio = entry.intersectionRatio;
          if (!mostVisible || ratio > mostVisible.ratio) {
            mostVisible = { id, ratio };
          }
        });

        if (mostVisible && mostVisible.ratio > 0) setActive(mostVisible.id);
      },
      { root: null, rootMargin, threshold: [0, 0.15, 0.4, 0.75, 1] }
    );

    sections.forEach((s) => {
      if (s && observerRef.current) observerRef.current.observe(s);
    });

    return () => {
      if (observerRef.current) {
        sections.forEach((s) => {
          if (s) observerRef.current?.unobserve(s);
        });
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Close mobile menu on route change / click outside (escape)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Smooth scroll helper (also moves focus to target for accessibility)
  const handleNavClick = useCallback((href: string) => {
    setIsMenuOpen(false);
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // move focus after small delay to allow scroll
    setTimeout(() => {
      el.setAttribute('tabindex', '-1');
      el.focus();
      el.removeAttribute('tabindex');
    }, 400);
  }, []);


  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`flex items-center justify-between h-16 ${shrunken ? 'py-2' : 'py-4'}`}>
            {/* Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('#home')}
                aria-label="Go to home"
                className="flex items-center gap-2 focus:outline-none"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59,130,246,1), rgba(139,92,246,1))',
                    boxShadow: '0 6px 18px rgba(37,99,235,0.12)',
                  }}
                >
                  <Icon icon="material-symbols:code" className="text-white text-lg" />
                </div>
                <span className="text-white font-semibold text-lg select-none">
                  Chirag Sahani
                </span>
              </button>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`relative text-sm font-medium px-3 py-2 focus:outline-none ${
                      isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                    <motion.span
                      layout
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className={`absolute left-0 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 origin-left`}
                      style={{ width: isActive ? '100%' : '0%' }}
                      aria-hidden
                    />
                  </a>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Desktop CTA */}
              <div className="hidden md:block">
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contact');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform"
                  whileTap={{ scale: 0.98 }}
                >
                  Hire Me
                </motion.a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen((s) => !s)}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/6 focus:outline-none"
                >
                  <Icon
                    icon={isMenuOpen ? 'material-symbols:close' : 'material-symbols:menu'}
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-4 space-y-1 bg-black/90 backdrop-blur-lg border-b border-white/10">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                      setIsMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      active === item.href ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}

                <div className="px-3 mt-3">
                  <motion.a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#contact');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    Hire Me
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Back to top FAB */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            aria-label="Back to top"
            className="fixed right-6 bottom-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg flex items-center justify-center text-white hover:scale-105 transition"
            title="Back to top"
          >
            <Icon icon="material-symbols:arrow-upward" className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
