// useSmoothScroll.js
import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    const scrollEl = document.querySelector("#scroll-container");
    if (!scrollEl) return;

    const locoScroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      // optional settings...
    });

    // Tell ScrollTrigger to use this scroll container
    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        if (arguments.length) {
          locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
        } else {
          return locoScroll.scroll.instance.scroll.y;
        }
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // Choose pinType depending on transform support
      pinType: scrollEl.style.transform ? "transform" : "fixed",
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", () => locoScroll.update());
      locoScroll.destroy();
    };
  }, []);
}
