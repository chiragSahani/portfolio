'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const footerLinks = {
    quick: [
      { name: 'Home', href: '#' },
      { name: 'About', href: '#about' },
      { name: 'Projects', href: '#projects' },
      { name: 'Skills', href: '#skills' },
      { name: 'Contact', href: '#contact' },
    ],
    services: [
      { name: 'Web Development', href: '#' },
      { name: '3D Graphics', href: '#' },
      { name: 'UI/UX Design', href: '#' },
      { name: 'Consulting', href: '#' },
      { name: 'Maintenance', href: '#' },
    ],
    social: [
      { name: 'GitHub', icon: 'mdi:github', href: 'https://github.com/chiragSahani' },
      { name: 'LinkedIn', icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/chiragsahani/' },
      { name: 'Email', icon: 'mdi:email', href: 'mailto:chiragsahaan@gmail.com' },
    ],
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative bg-black/50 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Icon icon="material-symbols:code" className="text-white text-xl" />
              </div>
              <span className="text-white font-medium text-xl">Chirag Sahani</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Crafting innovative digital experiences with modern technologies.
              Let&apos;s build something amazing together.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon icon={social.icon} className="text-lg" />
                  <span className="absolute inset-0 rounded-full border border-cyan-400/20 group-hover:border-cyan-400/40 transition" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-medium mb-4 relative">
              Quick Links
              <span className="absolute left-0 -bottom-1 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {footerLinks.quick.map((link, index) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-medium mb-4 relative">
              Services
              <span className="absolute left-0 -bottom-1 w-10 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((service, index) => (
                <li key={service.name}>
                  <motion.a
                    href={service.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {service.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-white font-medium mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Subscribe to get notified about new projects and updates.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                aria-label="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
              />
              <motion.button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-green-400 text-sm mt-3"
              >
                ✅ Thanks for subscribing!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm">
            © {currentYear} Chirag Sahani. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
