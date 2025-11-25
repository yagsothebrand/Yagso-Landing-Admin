"use client"

import { useEffect } from "react"
import { gsap } from "gsap"

export function BackgroundVideos({ currentImageIndex, showForm, videoRefs }) {
  const videos = [
    { src: "/bowl.mp4", alt: "Jeweled chess piece" },
    { src: "/media.mp4", alt: "Statement rings on hands" },
    { src: "/hand.mp4", alt: "Luxury lifestyle flatlay" },
    { src: "/card.mp4", alt: "Jeweled chess piece" },
  ]

  useEffect(() => {
    videoRefs.current.forEach((img, index) => {
      if (img) {
        if (index === currentImageIndex) {
          gsap.to(img, {
            opacity: 1,
            scale: 1.05,
            duration: 2,
            ease: "power2.inOut",
          })
        } else {
          gsap.to(img, {
            opacity: 0,
            scale: 1,
            duration: 2,
            ease: "power2.inOut",
          })
        }
      }
    })
  }, [currentImageIndex])

  useEffect(() => {
    if (showForm) {
      gsap.to(videoRefs.current, {
        scale: 1.15,
        opacity: 0.15,
        filter: "blur(8px)",
        duration: 1.2,
        ease: "power3.inOut",
      })
    } else {
      gsap.to(videoRefs.current, {
        scale: 1.05,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.inOut",
      })
    }
  }, [showForm])

  return (
    <div className="fixed inset-0">
      {videos.map((video, index) => (
        <div
          key={index}
          ref={(el) => (videoRefs.current[index] = el)}
          className="absolute inset-0 opacity-0 transition-opacity duration-1000"
        >
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={video.src} type="video/mp4" />
          </video>
        </div>
      ))}
    </div>
  )
}
