export default function VideoLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/for.mp4" type="video/mp4" />
      </video>

      <div className="fixed inset-0 bg-black/30 -z-10" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
