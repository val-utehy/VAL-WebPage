"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function hash(index: number, salt: number) { const value = Math.sin(index * 91.77 + salt * 17.31) * 43758.5453; return value - Math.floor(value); }

export default function ResearchMotionScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current; if (!host) return;
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30); camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); renderer.setClearColor(0x000000, 0); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2)); renderer.domElement.className = "three-background-canvas"; host.appendChild(renderer.domElement);
    const pointGeometry = new THREE.BufferGeometry(); const count = 64; const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) { positions[index * 3] = (hash(index, 1) - 0.5) * 12; positions[index * 3 + 1] = (hash(index, 2) - 0.5) * 7; positions[index * 3 + 2] = -1.5 - hash(index, 3) * 4; }
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointMaterial = new THREE.PointsMaterial({ color: 0xbba89c, size: 0.03, transparent: true, opacity: 0.18, depthWrite: false }); const points = new THREE.Points(pointGeometry, pointMaterial); scene.add(points);
    const ringGeometry = new THREE.TorusGeometry(3.6, 0.012, 8, 120); const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xa97052, transparent: true, opacity: 0.13, depthWrite: false }); const ring = new THREE.Mesh(ringGeometry, ringMaterial); ring.position.set(1.8, 0, -2); ring.rotation.set(Math.PI / 2.4, 0.25, 0); scene.add(ring);
    const resize = () => { const width = Math.max(host.clientWidth, 1); const height = Math.max(host.clientHeight, 1); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); }; const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const timer = new THREE.Timer(); timer.connect(document); let frame = 0; const animate = () => { timer.update(); const elapsed = timer.getElapsed(); points.rotation.y = elapsed * 0.008; ring.rotation.z = elapsed * 0.018; renderer.render(scene, camera); frame = window.requestAnimationFrame(animate); }; animate();
    return () => { window.cancelAnimationFrame(frame); observer.disconnect(); timer.disconnect(); pointGeometry.dispose(); pointMaterial.dispose(); ringGeometry.dispose(); ringMaterial.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); };
  }, []);
  return <div ref={hostRef} className="three-background-host" />;
}
