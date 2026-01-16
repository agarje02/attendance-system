"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { features, featureStats } from "@/data/features";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent-600",
  success: "bg-success/10 text-success-600",
};

const highlightColors = {
  primary: "text-primary",
  accent: "text-accent-600",
  success: "text-success-600",
};

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Complete{" "}
            <span className="gradient-text">school management</span> solution
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything your school needs—from digital attendance tracking and smart timetable scheduling 
            to progress monitoring, parent communication, and role-based access for everyone.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {featureStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-5 text-center shadow-card border border-border/50"
            >
              <p className="text-2xl sm:text-3xl font-bold gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-border/50 transition-all duration-300 flex flex-col"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${colorClasses[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                  {feature.description}
                </p>

                {/* Highlights */}
                {feature.highlights && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className={`inline-flex items-center gap-1 text-xs font-medium ${highlightColors[feature.color]}`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-white shadow-lg">
            <span className="text-sm font-medium">
              And many more features to streamline your school operations
            </span>
            <span className="text-lg">→</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
