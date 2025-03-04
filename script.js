import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Basic vertex shader for all materials
const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Mandelbrot Fragment Shader
const mandelbrotShader = `
uniform vec2 resolution;
uniform vec2 center;
uniform float zoom;
varying vec2 vUv;

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    vec2 c = center + uv * zoom;
    vec2 z = vec2(0.0);
    float iter = 0.0;
    const float maxIter = 100.0;
    for (iter = 0.0; iter < maxIter; iter++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) break;
    }
    float color = iter / maxIter;
    // Map to cool tones (blue gradient)
    gl_FragColor = vec4(0.0, color, 1.0 - color, 1.0);
}`;

// Julia Fragment Shader
const juliaShader = `
uniform vec2 resolution;
uniform vec2 c;
varying vec2 vUv;

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    vec2 z = uv * 2.0;
    float iter = 0.0;
    const float maxIter = 100.0;
    for (iter = 0.0; iter < maxIter; iter++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) break;
    }
    float color = iter / maxIter;
    // Map to warm tones (red gradient)
    gl_FragColor = vec4(1.0 - color, color * 0.5, 0.0, 1.0);
}`;

// Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Set up the renderer
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create central fractal
const centralGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const centralMaterial = new THREE.ShaderMaterial({
    uniforms: {
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        center: { value: new THREE.Vector2(-0.5, 0) },
        zoom: { value: 1.5 }
    },
    vertexShader: vertexShader,
    fragmentShader: mandelbrotShader,
    transparent: true
});
const centralFractal = new THREE.Mesh(centralGeometry, centralMaterial);
scene.add(centralFractal);

// Create orbiting fractals
const orbitingFractals = [];
const numOrbiters = 8;
const radius = 3;
for (let i = 0; i < numOrbiters; i++) {
    const angle = (i / numOrbiters) * Math.PI * 2;
    const orbiterGeometry = new THREE.PlaneGeometry(0.75, 0.75);
    const orbiterMaterial = new THREE.ShaderMaterial({
        uniforms: {
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            c: { value: new THREE.Vector2(-0.8 + i * 0.1, 0.156) }
        },
        vertexShader: vertexShader,
        fragmentShader: juliaShader,
        transparent: true,
        side: THREE.DoubleSide
    });
    const orbiter = new THREE.Mesh(orbiterGeometry, orbiterMaterial);
    orbiter.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius);
    orbiter.lookAt(0, 0, 0);
    scene.add(orbiter);
    orbitingFractals.push(orbiter);
}

// Create the logo (golden-yellow triangle)
const triangleShape = new THREE.Shape();
triangleShape.moveTo(0, 1);
triangleShape.lineTo(-0.866, -0.5);
triangleShape.lineTo(0.866, -0.5);
triangleShape.lineTo(0, 1);

const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 };
const logoGeometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);
const logoMaterial = new THREE.MeshPhongMaterial({
    color: 0xffd700, // Golden-yellow
    shininess: 100,  // Glossy finish
    specular: 0x555555,
    transparent: true,
    opacity: 0
});
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logo.position.z = 0.1;
scene.add(logo);

// Purple inverted triangle
const innerShape = new THREE.Shape();
innerShape.moveTo(0, -0.5);
innerShape.lineTo(-0.433, 0.25);
innerShape.lineTo(0.433, 0.25);
innerShape.lineTo(0, -0.5);

const innerGeometry = new THREE.ExtrudeGeometry(innerShape, extrudeSettings);
const innerMaterial = new THREE.MeshPhongMaterial({
    color: 0x800080, // Purple
    shininess: 100,
    specular: 0x555555,
    transparent: true,
    opacity: 0
});
const innerTriangle = new THREE.Mesh(innerGeometry, innerMaterial);
innerTriangle.position.z = 0.2; // Slightly in front
scene.add(innerTriangle);

// Text "Bring Order out of Chaos"
let textMesh;
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Bring Order out of Chaos', {
        font: font,
        size: 0.3,
        height: 0.05,
        curveSegments: 12
    });
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    
    const textMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0
    });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-textWidth/2, -1.5, 0.3); // Centered below logo
    scene.add(textMesh);
});

// Animation variables
let transitioned = false;
let animating = false;

// Transition function
function startTransition() {
    if (transitioned || animating) return;
    animating = true;
    
    // Hide instructions
    document.querySelector('.instructions').classList.add('hidden');
    
    // Fade out orbiting fractals
    orbitingFractals.forEach((orbiter, index) => {
        const delay = index * 100;
        setTimeout(() => {
            let opacity = 1;
            const fade = setInterval(() => {
                opacity -= 0.05;
                orbiter.material.opacity = opacity;
                if (opacity <= 0) {
                    orbiter.visible = false;
                    clearInterval(fade);
                }
            }, 50);
        }, delay);
    });
    
    // Dissolve central fractal
    setTimeout(() => {
        let centralOpacity = 1;
        const dissolve = setInterval(() => {
            centralOpacity -= 0.02;
            centralFractal.material.opacity = centralOpacity;
            if (centralOpacity <= 0) {
                centralFractal.visible = false;
                clearInterval(dissolve);
            }
        }, 50);
    }, 500);
    
    // Fade in logo
    setTimeout(() => {
        let logoOpacity = 0;
        const logoFade = setInterval(() => {
            logoOpacity += 0.02;
            logo.material.opacity = logoOpacity;
            innerTriangle.material.opacity = logoOpacity;
            if (logoOpacity >= 1) {
                clearInterval(logoFade);
            }
        }, 50);
    }, 1500);
    
    // Fade in text word by word
    setTimeout(() => {
        if (textMesh) {
            let textOpacity = 0;
            const textFade = setInterval(() => {
                textOpacity += 0.02;
                textMesh.material.opacity = textOpacity;
                if (textOpacity >= 1) {
                    clearInterval(textFade);
                    transitioned = true;
                    animating = false;
                }
            }, 50);
        }
    }, 2500);
}

// Event listeners
document.addEventListener('click', startTransition);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !transitioned && !animating) {
        startTransition();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update shader uniforms
    centralMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    orbitingFractals.forEach(orbiter => {
        orbiter.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the scene slightly
    scene.rotation.y += 0.002;
    
    // Rotate orbiting fractals
    orbitingFractals.forEach((orbiter, i) => {
        const angle = Date.now() * 0.001 * (0.5 + i * 0.1);
        const orbitRadius = radius;
        orbiter.position.x = Math.cos(angle) * orbitRadius;
        orbiter.position.z = Math.sin(angle) * orbitRadius;
        orbiter.lookAt(0, 0, 0);
    });
    
    // If transition completed, add subtle logo animation
    if (transitioned) {
        logo.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        innerTriangle.rotation.y = logo.rotation.y;
    }
    
    renderer.render(scene, camera);
}

animate();