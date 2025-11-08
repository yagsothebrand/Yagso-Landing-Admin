import React from "react";

const HeroSection = () => {
  return (
    <div
      style={{ backgroundImage: "url('hijabibg.JPG')" }}
      className="relative h-[80vh] md:min-h-[60vh] w-screen bg-no-repeat bg-cover bg-center"
    >
      {/* Animated element (earring) */}
      <img
        src="https://res.cloudinary.com/deywxghov/image/upload/v1760121653/download_2_-fotor-2025101019328_obleje.png"
        alt="Earring"
        id="brace"
        className="fixed z-[9999] top-[37.4%] w-[10%] opacity-1 left-[860px] pointer-events-none"
      />
    </div>
  );
};

export default HeroSection;

// import React, { useEffect, useRef, useState } from "react";

// const HeroSection = () => {
//   const videos = [
//     "/Handonshoe.mp4",
//     "/Handinwater.mp4",
//     "Burger.mp4",
//     "Sand.mp4",
//     "Champagne.mp4",
//   ];
//   const videoRef = useRef(null);
//   const [currentVideo, setCurrentVideo] = useState(0);

//   useEffect(() => {
//     const videoElement = videoRef.current;
//     if (!videoElement) return;

//     // When a video ends, move to next one (loop through array)
//     const handleEnded = () => {
//       setCurrentVideo((prev) => (prev + 1) % videos.length);
//     };

//     videoElement.addEventListener("ended", handleEnded);
//     return () => videoElement.removeEventListener("ended", handleEnded);
//   }, [videos.length]);

//   useEffect(() => {
//     // Update video source when currentVideo changes
//     const videoElement = videoRef.current;
//     if (videoElement) {
//       videoElement.src = videos[currentVideo];
//       videoElement.play().catch(() => {});
//     }
//   }, [currentVideo, videos]);

//   return (
//     <div className="relative h-[100vh] w-[100vw]">
//       {/* Background videos */}
//       <video
//         ref={videoRef}
//         className="absolute top-0 left-0 w-full h-full object-cover z-[10]"
//         autoPlay
//         muted
//         playsInline
//       />

//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black opacity-40 z-[20]"></div>

//       {/* Foreground image or text */}
//       <img
//         src="https://res.cloudinary.com/deywxghov/image/upload/v1760121653/download_2_-fotor-2025101019328_obleje.png"
//         alt="Bracelet"
//         id="brace"
//         className="absolute z-80 top-[37.4%] w-[0%] opacity-0 lg:left-[860px]"
//       />
//     </div>
//   );
// };

// export default HeroSection;

// // import React from "react";

// // const HeroSection = () => {
// //   return (
// //     <div
// //       id="hero-section"
// //       className="bg-no-repeat bg-center h-[100vh] w-[100vw] relative"
// //       style={{
// //         backgroundImage: "url('/bg1.jpeg')",
// //         // "url('https://res.cloudinary.com/deywxghov/image/upload/e_enhance,w_1600,q_auto,f_auto/v1760179502/download_3_napb2i.jpg')",
// //         backgroundSize: "cover", // ✅ keeps full portrait visible
// //         backgroundPosition: "center 70%", // ✅ shows both model + table
// //         // backgroundColor: "#e5ddd4", // subtle background to blend the edges
// //       }}
// //     >
// //       <img
// //         // src="https://res.cloudinary.com/deywxghov/image/upload/v1760121652/download-fotor-20251010191944_guluoz.png"
// //         src="https://res.cloudinary.com/deywxghov/image/upload/v1760121653/download_2_-fotor-2025101019328_obleje.png"
// //         // src="https://res.cloudinary.com/deywxghov/image/upload/e_improve,e_sharpen,e_background_removal/e_dropshadow:azimuth_220;elevation_60;spread_20,w_350/f_png/v1759480529/coppertist-wu-mvNCH3DinOQ-unsplash_fgbbpm.jpg"
// //         alt=""
// //         id="brace"
// //         className="absolute z-[80] opacity-0 top-[37.4%] w-[0%] lg:left-[860px]"
// //       />
// //     </div>
// //   );
// // };

// // export default HeroSection;
