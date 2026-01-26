import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContactDetails from "./ContactDetails";
import ContactInlineForm from "./ContactInlineForm";
import CTAFooter from "./CTAFooter";

export default function ContactSection() {
  const [showForm, setShowForm] = useState(true);

  return (
    <section
      id="contact"
      className="
        relative pt-24 pb-28 overflow-hidden
        bg-gradient-to-br from-[#f7fbff] via-white to-[#fff5f7]
      "
    >
      {/* soft blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2b6f99]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#fc7182]/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <div className="bg-gradient-to-r from-[#fc7182] to-[#2b6f99] bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase">
            Contact Us
          </div>

          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-gray-900">
            We’re here for you.
          </h2>

          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Questions about products, delivery, or privacy? Reach out anytime.
          </p>
        </motion.div>

        {/* content */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* LEFT */}
          <motion.div
            layout
            className={showForm ? "lg:col-span-5" : "lg:col-span-12"}
            transition={{ layout: { duration: 0.35, ease: "easeOut" } }}
          >
            <ContactDetails
              showForm={showForm}
              onToggle={() => setShowForm((s) => !s)}
            />
          </motion.div>

          {/* RIGHT */}
          <AnimatePresence mode="wait">
            {showForm && (
              <motion.div
                key="contact-form"
                layout
                className="lg:col-span-7"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 32 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <ContactInlineForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="mt-24">
          <CTAFooter />
        </div>
      </div>
    </section>
  );
}
