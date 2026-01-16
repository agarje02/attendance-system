"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { footerLinks, socialLinks, contactInfo } from "@/data/footer";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Logo className="mb-4" />
              <p className="text-muted-foreground mb-6 max-w-sm">
                Complete school management platform. Track attendance, schedule timetables, 
                and monitor student progress—all in one place.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {contactInfo.email}
                </a>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {contactInfo.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {contactInfo.address}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-lg bg-white shadow-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Link Columns */}
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-foreground mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Attendify. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
