import { Twitter, Linkedin, Github, Instagram, LucideIcon } from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export const footerLinks: Record<string, FooterSection> = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "For Schools", href: "#" },
      { label: "For Universities", href: "#" },
      { label: "For Organizations", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Webinars", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Data Protection", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
};

export const socialLinks: SocialLink[] = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export const contactInfo = {
  email: "hello@attendify.io",
  phone: "+91 (800) 123-4567",
  address: "Mumbai, India",
};
