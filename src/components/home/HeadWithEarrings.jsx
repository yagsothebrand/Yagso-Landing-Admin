"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  Html,
  Environment,
} from "@react-three/drei";
import { a } from "@react-spring/three"; // optional - only if using react-spring (not required)
import * as THREE from "three";

/**
 * Props:
 *  - activeIndex (number) -> index of current earring to show
 *  - earrings (array of image URLs)
 *  - modelPath (string) -> path to head glb
 *
 * Usage:
 * <HeadWithEarrings activeIndex={activeIndex} earrings={earrings} modelPath="/models/head.glb" />
 */

function AutoRotate({ speed = 0.25 }) {
  // small helper to auto-rotate the scene's camera target
  const { camera } = useThree();
  useFrame((state, delta) => {
    camera.rotation.y += delta * 0.0; // don't rotate camera itself
  });
  return null;
}

function EarringPlane({ texture, side = "right", headMeshRef }) {
  // texture: THREE.Texture
  const ref = useRef();
  // offset positions; you may need to tweak these per model
  const offsets = {
    right: {
      position: [0.115, 0.02, 0.045],
      rotation: [0.25, -0.6, 0.1],
      scale: [0.12, 0.12, 0.12],
    },
    left: {
      position: [-0.115, 0.02, 0.045],
      rotation: [0.25, 0.6, -0.1],
      scale: [0.12, 0.12, 0.12],
    },
  };

  const { position, rotation, scale } = offsets[side] || offsets.right;

  // Always face the camera a bit (billboard-like) while remaining attached to ear
  useFrame((state) => {
    if (!ref.current) return;
    // subtle billboarding toward camera
    const camPos = state.camera.position;
    ref.current.lookAt(camPos);
    // small constraint so it doesn't fully face camera; keep rotation offsets
    ref.current.rotation.x += rotation[0];
  });

  return (
    <group ref={ref}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          side={THREE.DoubleSide}
          depthTest={true}
        />
      </mesh>
    </group>
  );
}

function HeadModel({ modelPath, earringTexture, visible = true }) {
  // Loads the GLTF head model. Expect a neutral head that is centered and scaled reasonably.
  const gltf = useGLTF(modelPath);
  const group = useRef();

  // If your glTF contains named bones for ears (e.g. "RightEar", "LeftEar"), you can search:
  // const rightEarNode = gltf.scene.getObjectByName("RightEar") || null

  useEffect(() => {
    // optional: center & normalize scale if needed
    if (!gltf || !gltf.scene) return;
    // compute bounding box and scale to approx size
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const max = Math.max(size.x, size.y, size.z);
    const scaleFactor = 1 / max;
    gltf.scene.scale.setScalar(scaleFactor * 1.6); // tune multiplier
    gltf.scene.position.set(0, -0.85, 0); // tune vertical offset
  }, [gltf]);

  if (!gltf) return null;
  return (
    <group ref={group} dispose={null}>
      {/* head */}
      <primitive object={gltf.scene} />
      {/* attach the earring plane manually (fine-tune positions) */}
      {visible && earringTexture && (
        <>
          <EarringPlane
            texture={earringTexture}
            side="right"
            headMeshRef={group}
          />
          {/* if you want both ears: <EarringPlane texture={earringTexture} side="left" headMeshRef={group} /> */}
        </>
      )}
    </group>
  );
}

export default function HeadWithEarrings({
  activeIndex = 0,
  earrings = [],
  modelPath = "/models/head.glb",
}) {
  // activeIndex selects the currently visible earring texture
  const texture = useTexture(earrings[activeIndex] || "/earr.png"); // fallback to your provided ear image
  // improve texture settings
  useEffect(() => {
    if (texture) {
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = 16;
    }
  }, [texture]);

  return (
    <div className="w-full h-[520px] rounded-lg overflow-hidden bg-[#072018]">
      <Canvas camera={{ position: [0, 0, 1.8], fov: 35 }}>
        {/* Soft environment lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1.2} />
        <spotLight
          intensity={0.18}
          position={[-5, 10, 5]}
          penumbra={1}
          castShadow
        />

        {/* Optional HDRI - if you have one, uncomment and add <Environment files="..." /> */}
        {/* <Environment preset="studio" /> */}

        <Suspense fallback={null}>
          <HeadModel
            modelPath={modelPath}
            earringTexture={texture}
            visible={true}
          />
        </Suspense>

        {/* Controls: rotate, zoom, etc */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          autoRotate={true}
          autoRotateSpeed={0.6}
        />

        <AutoRotate />
      </Canvas>
    </div>
  );
}
