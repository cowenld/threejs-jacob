import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particuleTexture = textureLoader.load("/textures/particles/jacob.jpg");
const alexTexture = textureLoader.load("./alex.jpeg");
const danTexture = textureLoader.load("./dan.jpeg");
const chrisTexture = textureLoader.load("./chris.jpeg");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

const fontLoader = new THREE.FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    // Material
    const material = new THREE.MeshBasicMaterial({
      matcap: matcapTexture,
      wireframe: true,
    });

    Text;
    const textGeometry = new THREE.TextBufferGeometry(`Goodbye Jacob`, {
      font: font,
      size: 1,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    // let heartShape = new THREE.Shape();
    // heartShape.moveTo(25, 25);
    // heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    // heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    // heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    // heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    // heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    // heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    // let geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    // for (let i = 0; i < 100; i++) {
    //   const donut = new THREE.Mesh(geometry, material);
    //   donut.position.x = (Math.random() - 0.5) * 15;
    //   donut.position.y = (Math.random() - 0.5) * 15;
    //   donut.position.z = (Math.random() - 0.5) * 15;
    //   donut.rotation.x = Math.random() * Math.PI;
    //   donut.rotation.y = Math.random() * Math.PI;
    //   //   const scale = Math.random();
    //   //   donut.scale.set(scale, scale, scale);
    //   donut.scale.set(0.005, 0.005, 0.005);
    //   donutArr.push(donut);
    //   scene.add(donut);
    // }
  });
});

// // Cube
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const cubeMaterial = new THREE.MeshBasicMaterial({ map: alexTexture });
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// scene.add(cube);

// // Cube
// const cubeGeometry2 = new THREE.BoxGeometry(1, 1, 1);
// const cubeMaterial2 = new THREE.MeshBasicMaterial({ map: danTexture });
// const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
// cube2.position.y = -1;
// scene.add(cube2);

// // Cube3
// const cubeGeometry3 = new THREE.BoxGeometry(1, 1, 1);
// const cubeMaterial3 = new THREE.MeshBasicMaterial({ map: chrisTexture });
// const cube3 = new THREE.Mesh(cubeGeometry3, cubeMaterial3);
// cube3.position.y = 1;
// scene.add(cube3);

/**
 * Particles
 */
const particleGeometry = new THREE.BufferGeometry();
const count = 9000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 15;
  colors[i] = Math.random();
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  map: particuleTexture,
  transparent: true,
  depthWrite: false,
  vertexColors: true,
});

// Points
const particles = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -5;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   particles.rotation.y = elapsedTime;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const x = particleGeometry.attributes.position.array[i3 + 0];
    particleGeometry.attributes.position.array[i3 + 2] = Math.cos(
      elapsedTime + x * Math.random() * 4
    );
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x * 2
    );
  }
  particleGeometry.attributes.position.needsUpdate = true;

  camera.position.x = Math.sin(elapsedTime * 2);
  camera.position.y = Math.cos(elapsedTime * 5);

  //   for (let i = 0; i < count * 3; i++) {
  //     positions[i] += 0.01;
  //   }
  //   particleGeometry.setAttribute(
  //     "position",
  //     new THREE.BufferAttribute(positions, 3)
  //   );

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
