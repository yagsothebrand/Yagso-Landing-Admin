"use client"

import React, { useEffect, useState } from "react"

const models = [
  {
    name: "Model",
    face: "https://i.pinimg.com/736x/19/cc/87/19cc87f55b3d5acfc7b01f1bcf19501d.jpg",
    earringOffset: { left: { x: -92, y: 35 }, right: { x: 92, y: 35 } },
  },
]

const earrings = [
  {
    id: 1,
    name: "Diamond Drop",
    svg: (
      <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="20" r="12" fill="#E8D5C4" stroke="#D4AF37" strokeWidth="1.5" />
        <path
          d="M 50 32 Q 45 50 40 70 Q 38 85 50 140 Q 62 85 60 70 Q 55 50 50 32"
          fill="#FFD700"
          stroke="#D4AF37"
          strokeWidth="1"
        />
        <circle cx="50" cy="70" r="8" fill="#E8D5C4" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Pearl Classic",
    svg: (
      <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="18" r="14" fill="#F5F5F5" stroke="#D4AF37" strokeWidth="1.5" />
        <ellipse cx="48" cy="16" rx="5" ry="3" fill="white" opacity="0.8" />
        <path d="M 50 32 Q 48 60 50 100 Q 52 60 50 32" stroke="#D4AF37" strokeWidth="2" fill="none" />
        <circle cx="50" cy="110" r="6" fill="#F5F5F5" stroke="#D4AF37" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Ruby Elegant",
    svg: (
      <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="20" r="10" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5" />
        <circle cx="50" cy="20" r="6" fill="#FF1744" opacity="0.7" />
        <path
          d="M 50 30 L 48 70 Q 45 90 50 130 Q 55 90 52 70 L 50 30"
          fill="#C41E3A"
          stroke="#8B0000"
          strokeWidth="1"
        />
        <circle cx="50" cy="120" r="5" fill="#FF1744" />
      </svg>
    ),
  },
]

const EARRING_DURATION = 6
const NEXT_START_DELAY = EARRING_DURATION * 0.9

export default function EarringShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % earrings.length)
    }, NEXT_START_DELAY * 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setRotation({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const model = models[0]
  const currentEarring = earrings[activeIndex]

  return (
    <>
      <style jsx>{`
        @keyframes fadeInScaleRotate {
          0% {
            opacity: 0;
            transform: translateY(-40px) scale(0.6) rotate(-15deg);
          }
          40% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.9) rotate(-15deg);
          }
        }

        @keyframes fadeInScaleRotateRight {
          0% {
            opacity: 0;
            transform: translateY(-40px) scaleX(-0.6) scaleY(0.6) rotate(15deg);
          }
          40% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scaleX(-0.9) scaleY(0.9) rotate(15deg);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .earring-left {
          animation: fadeInScaleRotate ${EARRING_DURATION}s cubic-bezier(0.42, 0, 0.58, 1);
        }

        .earring-right {
          animation: fadeInScaleRotateRight ${EARRING_DURATION}s cubic-bezier(0.42, 0, 0.58, 1);
        }

        .model-face {
          animation: fadeInScale 1s ease-out;
        }
      `}</style>

      <div
        className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900"
        style={{
          perspective: "1000px",
          transform: `rotateX(${rotation.y}deg) rotateY(${rotation.x}deg)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {/* Model Face */}
        <img
          key={activeIndex}
          src={model.face || "/placeholder.svg"}
          alt="Model"
          className="model-face object-cover object-center rounded-3xl shadow-2xl w-[420px] h-[520px]"
        />

        {/* LEFT EARRING - Displayed on left ear */}
        <div
          key={`left-${activeIndex}`}
          className="earring-left absolute w-[80px] h-[140px]"
          style={{
            left: `calc(50% + ${model.earringOffset.left.x}px)`,
            top: `calc(50% + ${model.earringOffset.left.y}px)`,
          }}
        >
          {currentEarring.svg}
        </div>

        {/* RIGHT EARRING - Mirrored for right ear */}
        <div
          key={`right-${activeIndex}`}
          className="earring-right absolute w-[80px] h-[140px]"
          style={{
            left: `calc(50% + ${model.earringOffset.right.x}px)`,
            top: `calc(50% + ${model.earringOffset.right.y}px)`,
          }}
        >
          {currentEarring.svg}
        </div>

        {/* Earring name display */}
        <div className="absolute bottom-12 text-center">
          <p className="text-2xl font-light text-white tracking-wide">{currentEarring.name}</p>
          <div className="flex gap-2 justify-center mt-4">
            {earrings.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex ? "w-8 bg-amber-400" : "w-2 bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Subtle bottom gradient for depth */}
        <div className="absolute bottom-0 w-full h-[150px] bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    </>
  )
}
