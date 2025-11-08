// Ear3D.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function EarModel() {
  const { scene } = useGLTF("/models/ear.glb"); // ✅ load from public
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

export default function Ear3D() {
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={2} />
      <directionalLight position={[2, 2, 2]} />
      <EarModel />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}
