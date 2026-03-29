"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Car, Users, Award, Clock } from "lucide-react";

const stats = [
  { 
    icon: Car, 
    value: 500, 
    suffix: "+", 
    label: "Vehicles Sold",
    description: "Premium vehicles delivered to satisfied clients" 
  },
  { 
    icon: Users, 
    value: 2500, 
    suffix: "+", 
    label: "Happy Clients",
    description: "Trusted by thousands across Kenya" 
  },
  { 
    icon: Award, 
    value: 15, 
    suffix: "+", 
    label: "Years Experience",
    description: "Decades of automotive excellence" 
  },
  { 
    icon: Clock, 
    value: 24, 
    suffix: "/7", 
    label: "Support",
    description: "Round-the-clock customer assistance" 
  },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-linear-to-b from-(--color-surface) to-(--color-background)">
      <div className="container-luxury">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-4 group-hover:bg-amber-500/20 transition-colors"
              >
                <stat.icon className="w-8 h-8 text-amber-500" />
              </motion.div>
              <div className="text-4xl md:text-5xl font-bold text-white font-display mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}