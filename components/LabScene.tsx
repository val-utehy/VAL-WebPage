"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Loss landscape. A slowly shifting noise surface stands in for an
 * optimisation objective, and a handful of optimisers descend it by following
 * the negative gradient with momentum, trailing the path they took.
 *
 * The field is evaluated on the CPU rather than in a vertex shader so the
 * walkers can query exactly the surface the mesh is drawn from — otherwise
 * they drift off it. That puts the whole grid in the per-frame budget, so the
 * noise below uses an integer hash instead of the usual `fract(sin(...))`.
 *
 * The scene deliberately ignores the pointer: it is a backdrop, not a control.
 */
const COLUMNS = 72;
const ROWS = 46;
const SPAN_X = 26;
const SPAN_Y = 17;
const WALKERS = 7;
const TRAIL = 46;
/* Physics runs on a fixed step so the descent looks identical on a 60Hz and a
   144Hz display, and so a dropped frame cannot make a walker lurch. */
const STEP_SECONDS = 1 / 60;
/* How fast the terrain itself moves. Two orders of magnitude below walker
   speed, so the descent still reads as the subject and the hills as weather. */
const DRIFT = 0.045;

/* Scratch for the gradient of the cell corner most recently hashed. Returning
   a tuple here would allocate roughly a hundred thousand arrays per frame. */
let cornerX = 0;
let cornerY = 0;

function hashCorner(ix: number, iy: number) {
  let h = Math.imul(ix, 0x27d4eb2d) ^ Math.imul(iy, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  cornerX = ((h >>> 0) / 2147483648) - 1;
  h = Math.imul(h ^ (h >>> 13), 0x297a2d39);
  cornerY = ((h >>> 0) / 2147483648) - 1;
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  hashCorner(ix, iy);
  const a = cornerX * fx + cornerY * fy;
  hashCorner(ix + 1, iy);
  const b = cornerX * (fx - 1) + cornerY * fy;
  hashCorner(ix, iy + 1);
  const c = cornerX * fx + cornerY * (fy - 1);
  hashCorner(ix + 1, iy + 1);
  const d = cornerX * (fx - 1) + cornerY * (fy - 1);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number) {
  let value = 0;
  let amplitude = 0.5;
  let px = x;
  let py = y;
  for (let octave = 0; octave < 4; octave += 1) {
    value += amplitude * noise(px, py);
    const rx = 0.8 * px + 0.6 * py;
    const ry = -0.6 * px + 0.8 * py;
    px = rx * 2.03;
    py = ry * 2.03;
    amplitude *= 0.5;
  }
  return value;
}

/** The objective itself. Two scales so basins nest inside wider valleys, and
    each scale drifts on its own heading so ridges never slide as a block. */
function loss(x: number, y: number, time: number) {
  const f = 0.34;
  const coarse = fbm(x * f + time * DRIFT, y * f + time * DRIFT * 0.62);
  const fine = fbm(x * f * 2.15 - time * DRIFT * 0.78, y * f * 2.15 + time * DRIFT * 0.31);
  return (coarse + 0.42 * fine) * 2.35;
}

function gradientX(x: number, y: number, time: number) {
  const step = 0.12;
  return (loss(x + step, y, time) - loss(x - step, y, time)) / (2 * step);
}

function gradientY(x: number, y: number, time: number) {
  const step = 0.12;
  return (loss(x, y + step, time) - loss(x, y - step, time)) / (2 * step);
}

const surfaceVertex = /* glsl */ `
  varying float vHeight;
  varying float vDepth;

  void main() {
    vHeight = position.z;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = clamp((-viewPosition.z - 2.5) / 17.0, 0.0, 1.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const surfaceFragment = /* glsl */ `
  precision mediump float;

  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform float uIntensity;
  varying float vHeight;
  varying float vDepth;

  void main() {
    float crest = smoothstep(-0.9, 1.4, vHeight);
    vec3 color = mix(uLow, uHigh, crest);
    float alpha = (0.13 + crest * 0.74) * (1.0 - vDepth) * uIntensity;
    if (alpha < 0.006) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const trailVertex = /* glsl */ `
  attribute float aFade;
  varying float vFade;

  void main() {
    vFade = aFade;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const trailFragment = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uIntensity;
  varying float vFade;

  void main() {
    if (vFade < 0.01) discard;
    gl_FragColor = vec4(uColor, vFade * 0.85 * uIntensity);
  }
`;

const headVertex = /* glsl */ `
  attribute float aPulse;
  attribute float aLife;
  varying float vPulse;
  varying float vLife;

  void main() {
    vPulse = aPulse;
    vLife = aLife;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (6.0 + aPulse * 4.0) * aLife * (11.0 / max(1.0, -viewPosition.z));
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const headFragment = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uIntensity;
  varying float vPulse;
  varying float vLife;

  void main() {
    float radius = length(gl_PointCoord - 0.5);
    float core = 1.0 - smoothstep(0.0, 0.18, radius);
    float halo = 1.0 - smoothstep(0.12, 0.5, radius);
    float alpha = (core * 0.95 + halo * 0.4) * (0.6 + vPulse * 0.4) * vLife * uIntensity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function buildSurface() {
  const positions = new Float32Array(COLUMNS * ROWS * 3);
  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const offset = (row * COLUMNS + column) * 3;
      positions[offset] = (column / (COLUMNS - 1) - 0.5) * SPAN_X;
      positions[offset + 1] = (row / (ROWS - 1) - 0.5) * SPAN_Y;
      positions[offset + 2] = 0;
    }
  }

  const indices: number[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const index = row * COLUMNS + column;
      if (column < COLUMNS - 1) indices.push(index, index + 1);
      if (row < ROWS - 1) indices.push(index, index + COLUMNS);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  return geometry;
}

type Walker = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: number[];
  filled: number;
  stalled: number;
  /* Fades a run in on arrival and out once it has settled, so nothing pops. */
  life: number;
  retiring: boolean;
};

function spawn(walker: Walker, time: number) {
  /* Start high: sample a few candidates and keep the steepest one, so every
     run begins somewhere worth descending from. */
  let bestX = 0;
  let bestY = 0;
  let bestHeight = -Infinity;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const x = (Math.random() - 0.5) * SPAN_X * 0.86;
    const y = (Math.random() - 0.5) * SPAN_Y * 0.86;
    const height = loss(x, y, time);
    if (height > bestHeight) {
      bestHeight = height;
      bestX = x;
      bestY = y;
    }
  }
  walker.x = bestX;
  walker.y = bestY;
  walker.vx = 0;
  walker.vy = 0;
  walker.filled = 0;
  walker.stalled = 0;
  walker.life = 0;
  walker.retiring = false;
}

export default function LabScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60);
    camera.position.set(0, -1.6, 8.4);
    camera.lookAt(0.6, -0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "three-background-canvas";
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(-Math.PI / 2.85, 0, 0.06);
    group.position.set(1.1, -1.2, 0);
    scene.add(group);

    const surfaceGeometry = buildSurface();
    const surfacePositions = surfaceGeometry.attributes.position.array as Float32Array;
    const surfaceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uLow: { value: new THREE.Color(0x5d2a12) },
        uHigh: { value: new THREE.Color(0xff9b4b) },
        uIntensity: { value: 1 },
      },
      vertexShader: surfaceVertex,
      fragmentShader: surfaceFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.LineSegments(surfaceGeometry, surfaceMaterial));

    const updateSurface = (time: number) => {
      for (let offset = 0; offset < surfacePositions.length; offset += 3) {
        surfacePositions[offset + 2] = loss(surfacePositions[offset], surfacePositions[offset + 1], time);
      }
      surfaceGeometry.attributes.position.needsUpdate = true;
    };

    const walkers: Walker[] = Array.from({ length: WALKERS }, () => {
      const walker: Walker = { x: 0, y: 0, vx: 0, vy: 0, history: new Array(TRAIL * 3).fill(0), filled: 0, stalled: 0, life: 0, retiring: false };
      spawn(walker, 0);
      /* Stagger the starts so all seven do not set off in formation. */
      walker.life = -Math.random() * 1.4;
      return walker;
    });

    const segmentCount = WALKERS * (TRAIL - 1);
    const trailPositions = new Float32Array(segmentCount * 2 * 3);
    const trailFades = new Float32Array(segmentCount * 2);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute("aFade", new THREE.BufferAttribute(trailFades, 1));
    const trailMaterial = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0xffb070) }, uIntensity: { value: 1 } },
      vertexShader: trailVertex,
      fragmentShader: trailFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.LineSegments(trailGeometry, trailMaterial));

    const headPositions = new Float32Array(WALKERS * 3);
    const headPulses = new Float32Array(WALKERS);
    const headLives = new Float32Array(WALKERS);
    const headGeometry = new THREE.BufferGeometry();
    headGeometry.setAttribute("position", new THREE.BufferAttribute(headPositions, 3));
    headGeometry.setAttribute("aPulse", new THREE.BufferAttribute(headPulses, 1));
    headGeometry.setAttribute("aLife", new THREE.BufferAttribute(headLives, 1));
    const headMaterial = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0xffd0a4) }, uIntensity: { value: 1 } },
      vertexShader: headVertex,
      fragmentShader: headFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(headGeometry, headMaterial));

    const applyTheme = () => {
      const light = document.documentElement.dataset.theme === "light";
      /* Additive blending turns a light background white, so the light theme
         paints everything normally instead. */
      const blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      for (const material of [surfaceMaterial, trailMaterial, headMaterial]) {
        material.blending = blending;
        material.needsUpdate = true;
      }
      surfaceMaterial.uniforms.uLow.value.set(light ? 0xdcbaa2 : 0x5d2a12);
      surfaceMaterial.uniforms.uHigh.value.set(light ? 0xa8491a : 0xff9b4b);
      trailMaterial.uniforms.uColor.value.set(light ? 0xb1521f : 0xffb070);
      headMaterial.uniforms.uColor.value.set(light ? 0x8f3a11 : 0xffd0a4);
      surfaceMaterial.uniforms.uIntensity.value = light ? 0.92 : 1;
    };
    applyTheme();
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

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

    let fieldTime = 0;

    const step = () => {
      fieldTime += STEP_SECONDS;

      for (let index = 0; index < WALKERS; index += 1) {
        const walker = walkers[index];

        if (walker.retiring) {
          walker.life -= 0.014;
          if (walker.life <= 0) spawn(walker, fieldTime);
        } else if (walker.life < 1) {
          walker.life = Math.min(1, walker.life + 0.012);
        }

        const gx = gradientX(walker.x, walker.y, fieldTime);
        const gy = gradientY(walker.x, walker.y, fieldTime);

        /* Momentum descent. A high momentum with a small learning rate gives
           the long, curved glide of an optimiser rolling into a basin; a large
           rate makes it snap straight down, which reads as coarse. */
        walker.vx = walker.vx * 0.945 - gx * 0.016;
        walker.vy = walker.vy * 0.945 - gy * 0.016;

        const speed = Math.hypot(walker.vx, walker.vy);
        if (speed > 0.085) {
          walker.vx = (walker.vx / speed) * 0.085;
          walker.vy = (walker.vy / speed) * 0.085;
        }

        walker.x += walker.vx;
        walker.y += walker.vy;

        const outside = Math.abs(walker.x) > SPAN_X * 0.48 || Math.abs(walker.y) > SPAN_Y * 0.48;
        walker.stalled = speed < 0.004 ? walker.stalled + 1 : 0;
        if (!walker.retiring && (outside || walker.stalled > 150)) walker.retiring = true;

        const visible = Math.max(0, Math.min(1, walker.life));

        /* Push the newest point onto the front of the trail buffer. */
        walker.history.copyWithin(3, 0, (TRAIL - 1) * 3);
        walker.history[0] = walker.x;
        walker.history[1] = walker.y;
        walker.history[2] = loss(walker.x, walker.y, fieldTime) + 0.07;
        if (walker.filled < TRAIL) walker.filled += 1;

        headPositions[index * 3] = walker.history[0];
        headPositions[index * 3 + 1] = walker.history[1];
        headPositions[index * 3 + 2] = walker.history[2];
        headPulses[index] = Math.min(1, speed / 0.06);
        headLives[index] = visible;

        for (let point = 0; point < TRAIL - 1; point += 1) {
          const segment = index * (TRAIL - 1) + point;
          const from = segment * 6;
          const vertex = segment * 2;
          const live = point + 1 < walker.filled;

          trailPositions[from] = walker.history[point * 3];
          trailPositions[from + 1] = walker.history[point * 3 + 1];
          trailPositions[from + 2] = walker.history[point * 3 + 2];
          trailPositions[from + 3] = walker.history[(point + 1) * 3];
          trailPositions[from + 4] = walker.history[(point + 1) * 3 + 1];
          trailPositions[from + 5] = walker.history[(point + 1) * 3 + 2];

          /* Squared falloff keeps the head bright and lets the tail dissolve
             rather than ending on a visible stub. */
          const along = 1 - point / (TRAIL - 1);
          const fade = live ? along * along * visible : 0;
          trailFades[vertex] = fade;
          trailFades[vertex + 1] = fade * 0.96;
        }
      }

      trailGeometry.attributes.position.needsUpdate = true;
      trailGeometry.attributes.aFade.needsUpdate = true;
      headGeometry.attributes.position.needsUpdate = true;
      headGeometry.attributes.aPulse.needsUpdate = true;
      headGeometry.attributes.aLife.needsUpdate = true;
    };

    updateSurface(0);

    const timer = new THREE.Timer();
    timer.connect(document);
    let frame = 0;
    let accumulator = 0;
    let surfaceAge = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (document.hidden) return;
      timer.update();

      /* Catch up in fixed increments, but never more than a few — a long tab
         stall should resume, not fast-forward. */
      accumulator = Math.min(accumulator + timer.getDelta(), STEP_SECONDS * 4);
      while (accumulator >= STEP_SECONDS) {
        step();
        accumulator -= STEP_SECONDS;
      }

      /* Rebuilding 3300 vertices costs around 2ms, and the terrain drifts two
         orders of magnitude slower than the walkers — half rate is invisible
         here and hands the frame budget back. */
      surfaceAge += timer.getDelta();
      if (surfaceAge >= 1 / 30) {
        updateSurface(fieldTime);
        surfaceAge = 0;
      }

      /* A slow drift of its own, so the scene breathes without the pointer. */
      group.rotation.z = 0.06 + Math.sin(timer.getElapsed() * 0.06) * 0.035;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      timer.disconnect();
      surfaceGeometry.dispose();
      surfaceMaterial.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
      headGeometry.dispose();
      headMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="three-background-host" />;
}
