"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroFeatures } from "@/data/features";
import { dashboardStats, recentActivity, socialProof } from "@/data/hero";
import { useState, useRef } from "react";

// Animated CTA Button Component with stunning effects
function AnimatedCTAButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Magnetic effect - button follows cursor slightly
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const maxDistance = 30;
    
    x.set(Math.max(-maxDistance, Math.min(maxDistance, distanceX * 0.3)));
    y.set(Math.max(-maxDistance, Math.min(maxDistance, distanceY * 0.3)));
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipples((prev) => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);
  };
  
  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="relative inline-block"
    >
      <motion.button
        ref={buttonRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className="relative inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-primary text-white shadow-soft hover:shadow-glow h-14 rounded-xl px-10 text-lg group overflow-hidden"
        style={{
          scale: isPressed ? 0.95 : isHovered ? 1.05 : 1,
        }}
        animate={{
          boxShadow: isHovered
            ? [
                "0 10px 40px rgba(59, 130, 246, 0.4)",
                "0 15px 50px rgba(59, 130, 246, 0.6)",
                "0 10px 40px rgba(59, 130, 246, 0.4)",
              ]
            : "0 4px 20px rgba(59, 130, 246, 0.2)",
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut",
          },
          scale: {
            type: "spring",
            stiffness: 400,
            damping: 17,
          },
        }}
      >
        {/* Pulsing glow background */}
        <motion.div
          className="absolute inset-0 bg-gradient-primary rounded-xl z-0"
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Shimmer/Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-[1]"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "linear",
          }}
          style={{
            transform: "skewX(-20deg)",
          }}
        />
        
        {/* Sparkle particles on hover */}
        {isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full z-[2]"
                initial={{
                  x: "50%",
                  y: "50%",
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: `${50 + (Math.cos((i * Math.PI * 2) / 8) * 100)}%`,
                  y: `${50 + (Math.sin((i * Math.PI * 2) / 8) * 100)}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
        
        {/* Ripple effects on click */}
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute bg-white/40 rounded-full z-[2]"
            initial={{
              x: ripple.x,
              y: ripple.y,
              width: 0,
              height: 0,
              opacity: 0.8,
            }}
            animate={{
              width: 200,
              height: 200,
              x: ripple.x - 100,
              y: ripple.y - 100,
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          />
        ))}
        
        {/* Content */}
        <span className="relative z-10 flex items-center">
          Start Free Trial
          <motion.span
            animate={{
              x: isHovered ? [0, 5, 0] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.span>
        </span>
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-white/50 z-[3] pointer-events-none"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>
      
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-primary blur-xl -z-10"
        animate={{
          opacity: isHovered ? [0.4, 0.7, 0.4] : 0.2,
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-hero-pattern">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              For Schools & Organizations
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Manage your school{" "}
              <span className="gradient-text">smarter</span>,{" "}
              <br className="hidden sm:block" />
              track progress{" "}
              <span className="gradient-text">effortlessly</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Complete school management solution. Track student & teacher attendance, 
              schedule timetables, monitor progress, and manage your institution online.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
            >
              {heroFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <AnimatedCTAButton />
              <Button variant="outline" size="xl" className="group">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social Proof mini */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-4 mt-10 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {[...Array(socialProof.avatarCount)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-foreground">{socialProof.count}</span>
                <span className="text-muted-foreground"> {socialProof.text}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-3xl" />
              
              {/* Dashboard mockup */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-white rounded-2xl shadow-card-hover border border-border/50 p-4 lg:p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground">School Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Today&apos;s overview</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-muted-foreground">Live</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {dashboardStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-secondary/50 rounded-xl p-4 text-center"
                    >
                      <p className={`text-2xl font-bold ${stat.color === 'success' ? 'text-success' : stat.color === 'primary' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Student Attendance</span>
                    <span className="font-semibold text-success">96.8%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "96.8%" }}
                      transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-success rounded-full"
                    />
                  </div>
                </div>

                {/* Recent activity */}
                <div className="mt-6 space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.2 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {activity.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.status}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -left-4 lg:-left-12 top-1/4 bg-white rounded-xl shadow-card-hover border border-border/50 p-4 max-w-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Class Started!</p>
                    <p className="text-xs text-muted-foreground">Class 10-A Math session</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
