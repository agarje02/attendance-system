"use client";

import { Navbar } from "@/components/Navbar";
import {
  HeroSection,
  FeaturesSection,
  AboutSection,
  TestimonialsSection,
  CTASection,
  Footer,
} from "@/components/Sections";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
