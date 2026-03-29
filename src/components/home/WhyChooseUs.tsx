"use client";

import { motion } from "framer-motion";
import { 
  Tag, 
  Zap, 
  ShieldCheck, 
  HeadphonesIcon,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Tag,
    title: "Competitive Prices",
    description: "We offer the best market rates for premium vehicles, ensuring maximum value for your investment with transparent pricing.",
    benefits: ["Market analysis", "No hidden fees", "Price match guarantee"]
  },
  {
    icon: Zap,
    title: "Fast Payment",
    description: "Selling to us? Experience instant payment processing once valuation and paperwork are complete.",
    benefits: ["Same-day payment", "Secure transactions", "Hassle-free process"]
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    description: "Every vehicle undergoes rigorous multi-point inspection by certified mechanics before listing.",
    benefits: ["150-point inspection", "Full service history", "Warranty included"]
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description: "Our dedicated team guides you through the entire process, from selection to financing and registration.",
    benefits: ["24/7 availability", "Personal consultant", "After-sales support"]
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-(--color-background) relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="h-px w-24 bg-linear-to-r from-transparent via-amber-500 to-transparent mb-8 mx-auto" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
Why Choose Konastone Autos
          </h2>
          <p className="text-gray-400 text-lg">
            Experience the difference of dealing with Kenya&apos;s most trusted premium car dealership
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-3xl glass-card hover:border-amber-500/30 transition-all duration-500"
            >
              <div className="flex items-start gap-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="shrink-0 w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-amber-500" />
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full glass">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-amber-600 border-2 border-black flex items-center justify-center text-xs font-bold text-black">
                  {i === 4 ? "+" : "★"}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">Trusted by 2,500+ clients</div>
              <div className="text-sm text-gray-500">4.9/5 average rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}