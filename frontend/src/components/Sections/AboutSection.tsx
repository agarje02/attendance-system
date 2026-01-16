"use client";

import { motion } from "framer-motion";
import { companyValues, companyStats } from "@/data/about";

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Transforming{" "}
              <span className="gradient-text">education management</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Attendify was built with a vision: to give schools and organizations 
              a modern, intuitive platform to manage attendance, track progress, 
              and schedule activities—all in one place.
            </p>
            <p className="text-muted-foreground mb-8">
              Today, hundreds of schools trust Attendify to manage their daily operations. 
              From small coaching centers to large universities, we help educators focus 
              on what matters most—teaching and student success.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {companyStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <p className="text-2xl sm:text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {companyValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-secondary/30 rounded-2xl p-6 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
