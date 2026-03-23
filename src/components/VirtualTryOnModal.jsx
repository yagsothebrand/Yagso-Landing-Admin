import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Upload, ZoomIn, ZoomOut, RefreshCcw } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function VirtualTryOnModal({ open, onClose, product }) {
  const videoRef = useRef(null);
  const stageRef = useRef(null);

  const [mode, setMode] = useState("camera");
  const [photoUrl, setPhotoUrl] = useState("");
  const [stream, setStream] = useState(null);

  const images = useMemo(() => {
    return [
      ...(product?.tryOnImage ? [product.tryOnImage] : []),
      ...(Array.isArray(product?.images) ? product.images : []),
    ].filter(Boolean);
  }, [product]);

  const [overlayIndex, setOverlayIndex] = useState(0);
  const overlaySrc = images[overlayIndex] || "";

  const [pos, setPos] = useState({ x: 60, y: 120 });
  const posRef = useRef({ x: 60, y: 120 });
  const [scale, setScale] = useState(1.25);

  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const updatePos = (next) => {
    posRef.current = next;
    setPos(next);
  };

  const centerOverlay = () => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    updatePos({ x: r.width / 2 - 120, y: r.height / 2 - 120 });
  };

  useEffect(() => {
    if (!open) return;
    setMode("camera");
    setPhotoUrl("");
    setOverlayIndex(0);

    const mobile = window.innerWidth < 768;
    setScale(mobile ? 1.35 : 1.15);
    updatePos(mobile ? { x: 30, y: 110 } : { x: 60, y: 120 });

    setTimeout(centerOverlay, 80);
  }, [open]);

  // camera
  useEffect(() => {
    const start = async () => {
      if (!open || mode !== "camera") return;
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
      } catch (e) {
        console.error(e);
      }
    };

    start();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  const capture = () => {
    const v = videoRef.current;
    if (!v) return;

    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 720;
    canvas.height = v.videoHeight || 1280;

    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

    setPhotoUrl(canvas.toDataURL("image/png"));
    setMode("upload");
    setTimeout(centerOverlay, 80);
  };

  const onUpload = (file) => {
    setPhotoUrl(URL.createObjectURL(file));
    setMode("upload");
    setTimeout(centerOverlay, 80);
  };

  const startDrag = (clientX, clientY) => {
    draggingRef.current = true;
    offsetRef.current = {
      x: clientX - posRef.current.x,
      y: clientY - posRef.current.y,
    };
  };

  const moveDrag = (clientX, clientY) => {
    if (!draggingRef.current) return;
    updatePos({
      x: clientX - offsetRef.current.x,
      y: clientY - offsetRef.current.y,
    });
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent
        // Full-height on mobile, centered dialog-style on desktop
        className="
          p-0 gap-0 rounded-none border-t border-slate-200
          h-[95dvh]
          md:h-auto md:max-h-[90dvh]
           bg-white
          flex flex-col focus:outline-none
        "
      >
        {/* Header — shadcn drawer already renders the drag handle above this */}
        <DrawerHeader className="flex-row items-center justify-between px-3 md:px-4 py-2.5 border-b border-slate-200 space-y-0 shrink-0">
          <DrawerTitle className="font-semibold text-slate-900 text-base">
            Virtual Try-On
          </DrawerTitle>
        </DrawerHeader>

        {/* Body */}
        <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-[1fr_320px] overflow-hidden">

          {/* ── Stage ── */}
          <div
            className="shrink-0 md:shrink bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col"
            onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
            onMouseUp={endDrag}
            onTouchMove={(e) => {
              const t = e.touches?.[0];
              if (t) moveDrag(t.clientX, t.clientY);
            }}
            onTouchEnd={endDrag}
          >
            <div
              ref={stageRef}
              className="relative w-full overflow-hidden"
              style={{ height: "min(52vh, 460px)" }}
            >
              {mode === "camera" ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                  playsInline
                  muted
                />
              ) : photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Your photo"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm px-6 text-center">
                  Upload a selfie or capture from camera.
                </div>
              )}

              {!!overlaySrc && (
                <img
                  src={overlaySrc}
                  alt="overlay"
                  draggable={false}
                  onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const t = e.touches?.[0];
                    if (t) startDrag(t.clientX, t.clientY);
                  }}
                  className="absolute select-none"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    width: 240,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    opacity: 0.98,
                    cursor: "grab",
                    touchAction: "none",
                  }}
                />
              )}
            </div>

            {/* Zoom / center row */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-200 bg-white shrink-0">
              <button
                type="button"
                onClick={centerOverlay}
                className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold rounded-none inline-flex items-center gap-2"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Center
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
                  className="p-2 border border-slate-200 rounded-none hover:bg-slate-50"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.min(2.8, Number((s + 0.1).toFixed(2))))}
                  className="p-2 border border-slate-200 rounded-none hover:bg-slate-50"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Controls ── scrollable on mobile so jewelry picker is always reachable */}
          <div
            className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-3 bg-white"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("camera")}
                className={`px-3 py-2 border rounded-none text-sm font-medium ${
                  mode === "camera"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white border-slate-200"
                }`}
              >
                <span className="inline-flex items-center gap-2 justify-center w-full">
                  <Camera className="w-4 h-4" />
                  Camera
                </span>
              </button>

              <label className="px-3 py-2 border border-slate-200 rounded-none text-sm font-medium cursor-pointer hover:bg-slate-50">
                <span className="inline-flex items-center gap-2 justify-center w-full">
                  <Upload className="w-4 h-4" />
                  Upload
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                />
              </label>
            </div>

            {mode === "camera" && (
              <button
                type="button"
                onClick={capture}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded-none text-sm font-semibold hover:bg-slate-800"
              >
                Capture Photo
              </button>
            )}

            <div className="pt-2 border-t border-slate-200">
              <div className="text-sm font-semibold text-slate-900">Pick product image</div>

              {images.length === 0 ? (
                <div className="text-xs text-slate-500 mt-2">No product images found.</div>
              ) : (
                <div
                  className="mt-2 flex gap-2 overflow-x-auto pb-1"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {images.map((src, idx) => (
                    <button
                      key={`${src}_${idx}`}
                      type="button"
                      onClick={() => setOverlayIndex(idx)}
                      className="shrink-0 border rounded-none overflow-hidden"
                      style={{
                        borderColor: idx === overlayIndex ? "#0f172a" : "#e2e8f0",
                        width: 56,
                        height: 56,
                        background: "white",
                      }}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}