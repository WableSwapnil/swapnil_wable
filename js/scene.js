/**
 * scene.js — Three.js scene
 * Apple-product aesthetic: one perfect silver sphere, sparse stars, cinematic lighting
 */

import * as THREE from 'three';
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/addons/postprocessing/OutputPass.js';

let renderer, scene, camera, composer;
let sphere, wireIco, particles;
let lights = [];
let smoothT = 0, targetT = 0;
let W = window.innerWidth, H = window.innerHeight;

// Camera waypoints — elegant drift as page scrolls
const WAYPOINTS = [
  new THREE.Vector3(-3.0,  0,   8.0),  // hero — camera left so sphere appears on right
  new THREE.Vector3( 1.0,  0.5, 7.2),  // statement
  new THREE.Vector3(-1.2,  0.8, 6.5),  // about
  new THREE.Vector3( 0.5, -0.5, 7.5),  // experience
  new THREE.Vector3(-1.5,  0.3, 6.8),  // projects
  new THREE.Vector3( 0.8,  0.6, 7.2),  // education
  new THREE.Vector3( 0,    0,   9.0),  // contact — pull back
];
const camCurve = new THREE.CatmullRomCurve3(WAYPOINTS);

export async function initScene(onProgress) {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas) return;

  // ── Renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch(e) {
    document.body.style.background = '#000';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  onProgress && onProgress(0.1);

  // ── Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.008);

  // ── Camera
  camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 200);
  camera.position.copy(WAYPOINTS[0]);
  onProgress && onProgress(0.2);

  // ── Environment map (simple gradient for metal reflections)
  const pmremGen = new THREE.PMREMGenerator(renderer);
  const envTexture = generateEnvMap(pmremGen);
  scene.environment = envTexture;
  pmremGen.dispose();
  onProgress && onProgress(0.4);

  // ── Main sphere
  const sphereGeo = new THREE.SphereGeometry(2.2, 128, 128);
  const sphereMat = new THREE.MeshPhysicalMaterial({
    color:      0xc8c8c8,
    metalness:  1.0,
    roughness:  0.04,
    envMapIntensity: 1.6,
    reflectivity: 1.0,
  });
  sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);
  onProgress && onProgress(0.55);

  // ── Wireframe icosphere (very faint, around sphere)
  const icoGeo = new THREE.IcosahedronGeometry(3.8, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, wireframe: true,
    transparent: true, opacity: 0.032,
  });
  wireIco = new THREE.Mesh(icoGeo, icoMat);
  scene.add(wireIco);

  // ── Particles (sparse stars)
  buildParticles();
  onProgress && onProgress(0.70);

  // ── Lights
  // Key light — warm white
  const key = new THREE.PointLight(0xffffff, 35, 60);
  key.position.set(6, 4, 8);
  scene.add(key);
  lights.push({ light: key, base: new THREE.Vector3(6, 4, 8) });

  // Fill — cold blue-white
  const fill = new THREE.PointLight(0x88aaff, 18, 60);
  fill.position.set(-6, -2, 4);
  scene.add(fill);
  lights.push({ light: fill, base: new THREE.Vector3(-6, -2, 4) });

  // Rim — warm rim
  const rim = new THREE.PointLight(0xffeecc, 22, 60);
  rim.position.set(0, 6, -4);
  scene.add(rim);
  lights.push({ light: rim, base: new THREE.Vector3(0, 6, -4) });

  // Ambient — very low
  const amb = new THREE.AmbientLight(0x111111, 2);
  scene.add(amb);

  // ── Post-processing
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(W, H),
    0.28,   // strength — subtle
    0.4,    // radius
    0.85    // threshold
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  onProgress && onProgress(1.0);
}

function generateEnvMap(pmremGen) {
  // Create a simple gradient environment texture
  const size = 64;
  const data  = new Uint8Array(size * size * 4);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const idx = (i * size + j) * 4;
      const t   = j / size;
      // Gradient: near-black bottom, slightly lighter top
      const v = Math.round(t * 30);
      data[idx]     = v;
      data[idx + 1] = v;
      data[idx + 2] = v;
      data[idx + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.needsUpdate = true;
  return pmremGen.fromEquirectangular(tex).texture;
}

function buildParticles() {
  const count = 4500;
  const pos   = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Spherical shell — r between 20 and 70
    const r     = 20 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = 0.04 + Math.random() * 0.06;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color:        0xffffff,
    size:         0.06,
    sizeAttenuation: true,
    transparent:  true,
    opacity:      0.55,
    blending:     THREE.AdditiveBlending,
    depthWrite:   false,
  });

  particles = new THREE.Points(geo, mat);
  scene.add(particles);
}

export function updateScene(ts) {
  if (!renderer || !scene || !camera) return;

  const t = ts * 0.001;

  // Smooth scroll T
  smoothT += (targetT - smoothT) * 0.032;

  // Camera path
  const camPt = camCurve.getPoint(Math.min(smoothT, 0.999));
  camera.position.lerp(camPt, 0.04);
  camera.lookAt(0, 0, 0);

  // Sphere rotation
  if (sphere) {
    sphere.rotation.y += 0.0008;
    sphere.rotation.x += 0.0003;
  }

  // Wireframe counter-rotation
  if (wireIco) {
    wireIco.rotation.y -= 0.0005;
    wireIco.rotation.x += 0.0002;
  }

  // Particles drift
  if (particles) {
    particles.rotation.y += 0.00012;
    particles.rotation.x += 0.00005;
  }

  // Light orbit
  lights.forEach((l, i) => {
    const speed = 0.18 + i * 0.12;
    const phase = (i * Math.PI * 2) / lights.length;
    l.light.position.x = l.base.x + Math.sin(t * speed + phase) * 2;
    l.light.position.y = l.base.y + Math.cos(t * speed * 0.7 + phase) * 1.5;
  });

  composer ? composer.render() : renderer.render(scene, camera);
}

export function setScrollT(t) {
  targetT = Math.max(0, Math.min(1, t));
}

export function onResize(w, h) {
  W = w; H = h;
  if (!renderer) return;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
  if (composer) composer.setSize(W, H);
}
