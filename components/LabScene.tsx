"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  attribute float aProgress;
  attribute float aLane;
  attribute float aDepth;
  attribute float aPhase;
  attribute float aDirection;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aWarmth;
  varying float vWarmth;
  varying float vAlpha;

  void main() {
    float travel = mod(aProgress + uTime * aSpeed + 14.0, 28.0) - 14.0;
    vec2 direction = vec2(cos(aDirection), sin(aDirection));
    vec2 perpendicular = vec2(-direction.y, direction.x);
    float wave = sin(travel * 0.72 + aPhase + uTime * 0.34) * 0.26;
    float braid = sin(travel * 1.55 - aPhase * 1.7 + uTime * 0.55) * 0.12;
    vec2 flow = direction * travel + perpendicular * (aLane + wave + braid);
    vec3 p = vec3(flow, aDepth);
    p.xy += uPointer * (0.06 + aWarmth * 0.07);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (14.0 / max(1.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
    vWarmth = aWarmth;
    vAlpha = 0.48 + 0.52 * smoothstep(10.0, 1.3, abs(travel));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uCool;
  uniform vec3 uWarm;
  varying float vWarmth;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float radius = length(uv);
    float halo = 1.0 - smoothstep(0.06, 0.5, radius);
    float core = 1.0 - smoothstep(0.0, 0.15, radius);
    float alpha = (halo * 0.48 + core * 0.74) * vAlpha;
    if (alpha < 0.018) discard;
    gl_FragColor = vec4(mix(uCool, uWarm, vWarmth), alpha);
  }
`;

export default function LabScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 40);
    camera.position.set(0, 0, 10.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "three-background-canvas";
    host.appendChild(renderer.domElement);

    const particleCount = window.innerWidth < 720 ? 180 : 420;
    const geometry = new THREE.BufferGeometry();
    const progress = new Float32Array(particleCount);
    const lane = new Float32Array(particleCount);
    const depth = new Float32Array(particleCount);
    const phase = new Float32Array(particleCount);
    const direction = new Float32Array(particleCount);
    const speed = new Float32Array(particleCount);
    const size = new Float32Array(particleCount);
    const warmth = new Float32Array(particleCount);

    for (let index = 0; index < particleCount; index += 1) {
      const laneIndex = index % 13;
      const flowGroup = index % 5;
      const flowDirections = [0, Math.PI, 0.34, Math.PI + 0.34, -0.28];
      progress[index] = seeded(index, 1) * 28 - 14;
      lane[index] = -4.2 + laneIndex * 0.69 + (seeded(index, 2) - 0.5) * 0.9;
      depth[index] = -0.8 - seeded(index, 3) * 5.2;
      phase[index] = seeded(index, 4) * Math.PI * 2;
      direction[index] = flowDirections[flowGroup] + (seeded(index, 8) - 0.5) * 0.14;
      speed[index] = 0.38 + seeded(index, 5) * 0.72;
      size[index] = 2.8 + Math.pow(seeded(index, 6), 2.1) * 8.8;
      warmth[index] = 0.12 + seeded(index, 7) * 0.88;
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(particleCount * 3, 3));
    geometry.setAttribute("aProgress", new THREE.BufferAttribute(progress, 1));
    geometry.setAttribute("aLane", new THREE.BufferAttribute(lane, 1));
    geometry.setAttribute("aDepth", new THREE.BufferAttribute(depth, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    geometry.setAttribute("aDirection", new THREE.BufferAttribute(direction, 1));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geometry.setAttribute("aWarmth", new THREE.BufferAttribute(warmth, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uCool: { value: new THREE.Color(0xb9aaa2) },
        uWarm: { value: new THREE.Color(0xff8d48) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stream = new THREE.Points(geometry, material);
    stream.rotation.z = -0.035;
    scene.add(stream);

    const applyTheme = () => {
      const light = document.documentElement.dataset.theme === "light";
      material.uniforms.uCool.value.set(light ? 0x796a63 : 0xb9aaa2);
      material.uniforms.uWarm.value.set(light ? 0xb65b33 : 0xff8d48);
    };
    applyTheme();
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => targetPointer.set((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1));
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      pointer.lerp(targetPointer, 0.03);
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uPointer.value.copy(pointer);
      camera.position.x = pointer.x * 0.12;
      camera.position.y = pointer.y * 0.08;
      camera.lookAt(0, 0, -2.5);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="three-background-host" />;
}
