import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Shield,
  Clock,
  Heart,
  Users,
  Zap,
  Star,
  ChevronDown,
} from "lucide-react";

import { useState } from "react";
import CTAFooter from "./CTAFooter";

export default function WhyChooseUs() {
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerView =
    typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Doctor Approved",
      description:
        "All products are FDA-approved and recommended by healthcare professionals",
    },
    {
      icon: CheckCircle,
      title: "Discreet Packaging",
      description:
        "Plain, unmarked packaging that protects your privacy completely",
    },
    {
      icon: Heart,
      title: "Privacy First",
      description:
        "We never share your information. Your privacy is our priority",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our care team is always available to answer your questions",
    },
    {
      icon: Zap,
      title: "Fast Shipping",
      description: "Discreet, fast delivery to your door within 24-48 hours",
    },
    {
      icon: Users,
      title: "Non-Judgmental",
      description: "Professional, compassionate care without judgment",
    },
  ];

  const testimonials = [
    {
      name: "Alex M.",
      role: "Verified Customer",
      text: "The service was incredibly discreet and fast. Exactly what I needed. The entire experience was seamless and professional from start to finish.",
      rating: 5,
    },
    {
      name: "Jordan K.",
      role: "Verified Customer",
      text: "Professional, caring, and absolutely judgment-free. Highly recommend! They truly understand the importance of discretion and privacy.",
      rating: 5,
    },
    {
      name: "Casey T.",
      role: "Verified Customer",
      text: "Great quality products and amazing customer support. Will order again. The packaging was discreet and the delivery was incredibly fast.",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="why-us"
      className="relative py-20 md:py-32 bg-background overflow-hidden"
    >
      {/* Gradient Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fc7182]/10 via-transparent to-[#2b6f99]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-[#fc7182] to-[#2b6f99] bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase">
              Why Choose Us
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Premium Care, Complete Privacy
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            We're committed to providing exceptional wellness products with
            discretion and care at the center of everything we do
          </p>
        </motion.div>

        {/* Image + Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start mb-20 md:mb-32">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="/legs.jpeg"
                alt="Wellness and self-care"
                width={500}
                height={500}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b6f99]/30 via-transparent to-transparent rounded-3xl" />
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="order-2 lg:order-1 grid grid-cols-2 gap-4 md:gap-6"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const gradients = [
                "from-[#fc7182] to-[#f09ba0]",
                "from-[#2b6f99] to-[#4a8bc2]",
              ];
              const gradient = gradients[idx % 2];

              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Card className="p-5 md:p-6 border border-white/90 shadow-xl hover:shadow-sm transition-all duration-300  h-full group">
                    <motion.div
                      className={`p-3 rounded-xl mb-4 w-fit bg-gradient-to-br ${gradient} text-white group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-10 md:mb-14 px-4">
            <div className="inline-block mb-3">
              <div className="bg-gradient-to-r from-[#fc7182] to-[#2b6f99] bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase">
                Trusted by Thousands
              </div>
            </div>

            <h3 className="text-3xl font-bold text-foreground text-balance">
              What Our Customers Say
            </h3>

            {/* mobile hint */}
            <p className="mt-3 text-sm text-muted-foreground md:hidden">
              Swipe to see more →
            </p>
          </div>

          <div className="relative">
            {/* subtle fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />

            {/* ✅ Manual scroll container (works on mobile + desktop) */}
            <div
              className="
        overflow-x-auto overflow-y-visible
        scroll-smooth
        [-webkit-overflow-scrolling:touch]
        scrollbar-hide
        px-4
      "
            >
              <div
                className="
          flex gap-4 md:gap-6
          snap-x snap-mandatory
          py-2
        "
              >
                {testimonials.map((testimonial, index) => {
                  const isOpen = expandedTestimonial === index;

                  return (
                    <div
                      key={`${testimonial.name}-${index}`}
                      className="
                snap-start
                shrink-0
                w-[88%] sm:w-[70%] md:w-[360px] lg:w-[380px]
              "
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.35 }}
                        className="h-full"
                      >
                        <motion.div
                          className="h-full cursor-pointer"
                          onClick={() =>
                            setExpandedTestimonial(isOpen ? null : index)
                          }
                          whileHover={{ y: -6 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Card
                            className={`p-6 md:p-7 bg-white border-2 transition-all duration-300 h-full flex flex-col ${
                              isOpen
                                ? "border-[#fc7182] shadow-xl"
                                : "border-[#2b6f99]/60 hover:border-[#fc7182]/50 shadow-sm"
                            }`}
                          >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                              {Array(testimonial.rating)
                                .fill(null)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-5 h-5 fill-[#fc7182] text-[#fc7182]"
                                  />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-foreground mb-3 text-base leading-relaxed italic flex-grow">
                              “{testimonial.text}”
                            </p>

                            {/* Expand */}
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="border-t border-[#2b6f99]/20 pt-4 mt-4"
                                >
                                  <p className="font-semibold bg-gradient-to-r from-[#fc7182] to-[#2b6f99] bg-clip-text text-transparent text-lg">
                                    {testimonial.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {testimonial.role}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="flex justify-center mt-4 pt-4 border-t border-border">
                              <ChevronDown
                                className={`w-5 h-5 text-[#fc7182] transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </Card>
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
 
      </div>
      <CTAFooter />
    </section>
  );
}
