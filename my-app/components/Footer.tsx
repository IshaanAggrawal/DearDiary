'use client';

import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Security', href: '#security' },
        { label: 'Roadmap', href: '#roadmap' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' },
        { label: 'Cookies', href: '#cookies' },
        { label: 'License', href: '#license' },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com',
      label: 'GitHub',
      handle: '@deardiary',
    },
    {
      icon: Twitter,
      href: 'https://twitter.com',
      label: 'Twitter',
      handle: '@deardiary',
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com',
      label: 'LinkedIn',
      handle: 'Dear Diary',
    },
    {
      icon: Mail,
      href: 'mailto:hello@deardiary.com',
      label: 'Email',
      handle: 'hello@deardiary.com',
    },
  ];

  return (
    <motion.footer 
      className="relative bg-black border-t border-white/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-r from-emerald-400 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📔</span>
                </div>
                <span className="text-xl font-bold text-white">Dear Diary</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your digital sanctuary for thoughts, memories, and personal growth.
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>by the team</span>
              </div>
            </div>

            {/* Footer links */}
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 py-8">
            {/* Social links */}
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                Connect With Us
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{social.label}</span>
                        <span className="text-gray-400 text-xs">{social.handle}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 px-6 md:px-10 py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} Dear Diary. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}