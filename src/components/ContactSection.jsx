// ContactSection.jsx (collapsible + clean success handling)
// Requires shadcn: Card, Button, Collapsible, CollapsibleTrigger, CollapsibleContent, Separator
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContactInlineForm from "./ContactInlineForm";
import CTAFooter from "./CTAFooter";
import { Mail, Phone, Clock, Zap, ChevronDown } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

const BRAND = "#948179";
const BORDER = `${BRAND}26`;
const cx = (...c) => c.filter(Boolean).join(" ");

export default function ContactSection({formOpen, setFormOpen}) {

  const options = useMemo(
    () => [
      {
        id: "email",
        label: "Email",
        value: "support@yagso.com",
        icon: Mail,
        href: "mailto:support@yagso.com",
      },
      {
        id: "phone",
        label: "Phone",
        value: "+234 812 345 6789",
        icon: Phone,
        href: "tel:+2348123456789",
      },
      { id: "hours", label: "Hours", value: "Mon–Fri • 9–6", icon: Clock },
      { id: "response", label: "Response", value: "24–48h", icon: Zap },
    ],
    [],
  );

  const [active, setActive] = useState("email");
  const [open, setOpen] = useState(true); // collapsible whole contact module

  const selected = options.find((o) => o.id === active) || options[0];

  return (
    <section id="contact" className="bg-[#fbfaf8]/90 pt-14 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* compact header */}
        <div className="flex items-end justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div
              className="inline-flex items-center gap-2 border bg-white px-2.5 py-1"
              style={{ borderColor: BORDER }}
            >
              <span
                className="h-1.5 w-1.5 rounded-sm"
                style={{ backgroundColor: BRAND }}
              />
              <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-slate-600">
                Contact
              </span>
            </div>

            <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              We’re here for you
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Products, delivery, privacy.
            </p>
          </div>
        </div>

        <Collapsible open={open} onOpenChange={setOpen}>
          <Card className="rounded-sm bg-white" style={{ borderColor: BORDER }}>
            <CardHeader className="py-4 px-4 md:px-5">
              {/* Options - compact row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {options.map((o) => {
                  const Icon = o.icon;
                  const isActive = o.id === active;

                  const tile = (
                    <motion.button
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActive(o.id)}
                      className={cx(
                        "w-full text-left border bg-white px-3 py-2.5 rounded-sm transition hover:bg-[#fffdfb]",
                        isActive ? "shadow-sm" : "",
                      )}
                      style={{ borderColor: isActive ? BRAND : BORDER }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-slate-500">
                            {o.label}
                          </p>

                          <p className="mt-0.5 text-[8px]  font-light text-slate-900 truncate">
                            <a
                              href={o.href}
                              onClick={(e) => e.stopPropagation()}
                              className=""
                            
                            >
                              {o.value}
                            </a>
                          </p>
                        </div>

                        <div
                          className="w-9 h-9 flex items-center justify-center border bg-[#fffdfb] rounded-sm"
                          style={{ borderColor: BORDER }}
                        >
                          <Icon className="w-4 h-4" style={{ color: BRAND }} />
                        </div>
                      </div>
                    </motion.button>
                  );

                  return <div key={o.id}>{tile}</div>;
                })}
              </div>
            </CardHeader>

            <Separator style={{ backgroundColor: BORDER }} />

            <CollapsibleContent asChild>
              <CardContent className="px-4 md:px-5 pb-5">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <ContactInlineForm selected={selected} formOpen={formOpen} setFormOpen={setFormOpen} />
                </motion.div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        <div className="mt-10">
          <CTAFooter />
        </div>
      </div>
    </section>
  );
}
