import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import gsap from "gsap";

const videos = [
      "/pinterestVideo.mp4",
  "/animate.mp4",

  "/get.mp4",

  "/GetInspired4.mp4",
  "/glass.mp4",
    "/cicart.mp4",
];

const BRAND = "#948179";
const CREAM = "#fbfaf8";

// detect orientation
function getRatioKey(w, h) {
  if (!w || !h) return "landscape";
  const r = w / h;
  if (r < 0.92) return "portrait";
  if (r > 1.08) return "landscape";
  return "square";
}

function ratioStyle(key) {
  if (key === "portrait") return { aspectRatio: "9 / 16" };
  if (key === "square") return { aspectRatio: "1 / 1" };
  return { aspectRatio: "16 / 9" };
}

export default function GetInspired() {
  const controls = useAnimation();
  const wrapRef = useRef(null);
  const headingRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.25 });

  const [aspectBySrc, setAspectBySrc] = useState({});
  const [badSrcs, setBadSrcs] = useState(() => new Set());

  // duplicate for smooth loop
  const list = useMemo(() => [...videos, ...videos], []);

  const onMeta = useCallback((src, w, h) => {
    const key = getRatioKey(w, h);
    setAspectBySrc((prev) => (prev[src] ? prev : { ...prev, [src]: key }));
  }, []);

  const onBad = useCallback((src) => {
    setBadSrcs((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!inView) return;

    controls.start({
      x: ["0%", "-50%"],
      transition: { duration: 35, ease: "linear", repeat: Infinity },
    });

    const heading = headingRef.current;
    if (!heading) return;

    const raw = heading.getAttribute("data-text") || heading.textContent || "";
    heading.setAttribute("data-text", raw);
    heading.textContent = "";

    raw.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      if (char === " ") span.style.marginRight = "8px";
      heading.appendChild(span);
    });

    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(heading.querySelectorAll("span"), {
      opacity: 1,
      duration: 0.5,
      stagger: 0.025,
      ease: "power2.out",
    });

    return () => tl.kill();
  }, [inView, controls]);

  return (
    <section
      ref={wrapRef}
      className="relative w-full overflow-hidden backdrop-blur-sm bg-white"
    >
      {/* Subtle fade edges */}
      <div
        className="absolute left-0 top-0 h-full w-[80px] sm:w-[140px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${CREAM} 0%, transparent 100%)`,
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-[80px] sm:w-[140px] z-10 pointer-events-none"
        // style={{
        //   background: `linear-gradient(to left, ${CREAM} 0%, transparent 100%)`,
        // }}
      />

      {/* Ticker */}
      <motion.div
        animate={controls}
        className="relative z-10 flex gap-3 px-4 sm:px-6 will-change-transform"
        style={{ width: "max-content" }}
      >
        {list.map((src, i) => {
          if (badSrcs.has(src)) return null;
          return (
            <VideoCard
              key={`${src}-${i}`}
              src={src}
              aspect={aspectBySrc[src]}
              onMeta={onMeta}
              onBad={onBad}
            />
          );
        })}
      </motion.div>
    </section>
  );
}

function VideoCard({ src, aspect = "landscape", onMeta, onBad }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useInView(cardRef, { amount: 0.15 });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!inView) v.pause();
    else v.play().catch(() => {});
  }, [inView]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-shrink-0"
    >
      <div
        className="
          relative overflow-hidden rounded-none
          border border-slate-200 bg-white/40 backdrop-blur-sm
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          transition-all duration-500
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        "
        style={{
          ...ratioStyle(aspect),
          width:
            aspect === "portrait"
              ? "clamp(220px, 34vw, 280px)"
              : aspect === "square"
                ? "clamp(240px, 36vw, 300px)"
                : "clamp(280px, 46vw, 360px)",
        }}
      >
        {/* Subtle blur background */}
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onError={() => onBad?.(src)}
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-105 opacity-20"
        />

        {/* Main video */}
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onError={() => onBad?.(src)}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            onMeta?.(src, v.videoWidth, v.videoHeight);
          }}
          className="relative z-10 w-full h-full object-contain"
        />

        {/* Subtle overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.05) 0%, transparent 50%)`,
          }}
        />

        {/* Decorative corner accent */}
        <div
          className="absolute bottom-0 right-0 w-16 h-16 opacity-10 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${BRAND} 100%)`,
          }}
        />
      </div>
    </motion.div>
  );
}
