import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

// Shortened animation timing constants
const CHAOS_DURATION = 3000;
const CONVERGENCE_FADE_IN_DELAY = 500;
const FIX_DEPTH_SORT_DELAY = 1000;
const ORDERED_PHASE_DELAY = 1500;

// Custom interface for Material with dispose method
interface Material extends THREE.Material {
  map?: THREE.Texture;
  dispose: () => void;
}

const LexiMentisLanding = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] = useState<'chaos' | 'converging' | 'ordered'>('chaos');
  
  // Track animation frame ID for proper cleanup
  const requestIdRef = useRef<number | null>(null);
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    if (!containerRef.current) return;
    
    // Store a reference to the current container for cleanup
    const container = containerRef.current;
    
    // Scene setup - use dark background that works with both dark/light modes
    const scene = new THREE.Scene();
    
    // Check if we're in dark mode by checking for a dark-mode class or data attribute
    // This assumes your app applies a class/attribute to the HTML or body element
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Set background color based on theme
    scene.background = new THREE.Color(isDarkMode ? 0x111827 : 0xf3f4f6); // dark:bg-gray-900 or bg-gray-100
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Improved lighting for better document visibility
    const ambientLight = new THREE.AmbientLight(0x444444, 0.8); // Brighter ambient light
    scene.add(ambientLight);
    
    // Create brighter gold lighting
    const goldLight = new THREE.PointLight(0xffd700, 1.5, 120); // Brighter gold light with wider range
    goldLight.position.set(20, 15, 40);
    scene.add(goldLight);
    
    const warmLight = new THREE.PointLight(0xe67e22, 1.2, 100); // Brighter warm orange
    warmLight.position.set(-20, 10, 30);
    scene.add(warmLight);
    
    // Add extra light to illuminate documents better
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.7);
    frontLight.position.set(0, 0, 50);
    scene.add(frontLight);
    
    // Function to create letter textures with consistent golden style
    const createLetterTexture = (letter: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      // Use background color based on theme
      context.fillStyle = isDarkMode ? '#111111' : '#333333';
      context.fillRect(0, 0, 512, 512);
      
      // Create very bright gold metallic gradient for text
      const textGradient = context.createLinearGradient(100, 100, 400, 400);
      textGradient.addColorStop(0, '#fff9c4'); // Very bright gold
      textGradient.addColorStop(0.3, '#ffd700'); // Bright gold
      textGradient.addColorStop(0.7, '#f39c12'); // Amber
      textGradient.addColorStop(1, '#e67e22'); // Orange
      
      // Strong shadow for depth
      context.shadowColor = 'rgba(0, 0, 0, 0.8)';
      context.shadowBlur = 25;
      context.shadowOffsetX = 10;
      context.shadowOffsetY = 10;
      
      // Draw letter with bold styling and larger font
      context.font = 'bold 350px Arial'; // Larger font
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Draw thick outline for more definition
      context.lineWidth = 15;
      context.strokeStyle = '#2c2c2c';
      context.strokeText(letter, 256, 256);
      
      // Fill with gold gradient
      context.fillStyle = textGradient;
      context.fillText(letter, 256, 256);
      
      // Add shine effect for metallic look
      context.fillStyle = 'rgba(255, 255, 255, 0.35)'; // Brighter shine
      context.beginPath();
      context.moveTo(100, 100);
      context.lineTo(400, 100);
      context.lineTo(400, 150);
      context.lineTo(100, 150);
      context.closePath();
      context.fill();
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      return texture;
    };
    
    // Function to create document textures with much more brightness for visibility on black
    const createDocumentTexture = (type: 'legal' | 'medical' | 'default') => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      if (!context) return null;
      
      if (type === 'legal') {
        // Draw legal pad with much brighter colors
        context.fillStyle = "#ffeb99"; // Brighter yellow
        context.fillRect(0, 0, 512, 512);
        
        // Add stronger red margin
        context.strokeStyle = "#ff5555"; // Brighter red
        context.lineWidth = 8;
        context.beginPath();
        context.moveTo(70, 0);
        context.lineTo(70, 512);
        context.stroke();
        
        // Draw blue lines with more contrast
        context.strokeStyle = "#5555ff"; // Brighter blue
        context.lineWidth = 3; // Thicker lines
        for (let i = 0; i < 8; i++) {
          context.beginPath();
          context.moveTo(0, 80 + i * 60);
          context.lineTo(512, 80 + i * 60);
          context.stroke();
        }
        
      } else if (type === 'medical') {
        // Draw medical record with much brighter colors
        context.fillStyle = "#ffffff"; // Pure white
        context.fillRect(0, 0, 512, 512);
        
        // Draw header
        context.fillStyle = "#99ccff"; // Brighter blue
        context.fillRect(20, 20, 472, 100);
        context.strokeStyle = "#0066ff"; // Vivid blue
        context.lineWidth = 4;
        context.strokeRect(20, 20, 472, 100);
        
        // Draw medical cross
        context.fillStyle = "#ff3333"; // Brighter red
        context.fillRect(50, 30, 30, 80);
        context.fillRect(25, 55, 80, 30);
        
      } else {
        // Default document with high contrast
        context.fillStyle = "#ffffff"; // Pure white
        context.fillRect(0, 0, 512, 512);
        
        // Draw header area
        context.fillStyle = "#dddddd";
        context.fillRect(50, 50, 412, 80);
        context.strokeStyle = "#000000";
        context.lineWidth = 3;
        context.strokeRect(50, 50, 412, 80);
        
        // Draw lines
        context.strokeStyle = "#666666"; // Darker lines for contrast
        context.lineWidth = 2; // Thicker lines
        for (let i = 0; i < 6; i++) {
          context.beginPath();
          context.moveTo(50, 200 + i * 40);
          context.lineTo(462, 200 + i * 40);
          context.stroke();
        }
      }
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      return texture;
    };
    
    // Create letter textures for "LEXIMENTIS" with consistent style
    const letterTextures: (THREE.Texture | null)[] = [];
    [..."LEXIMENTIS"].forEach((letter) => {
      const texture = createLetterTexture(letter);
      if (texture) letterTextures.push(texture);
    });
    
    // Create document textures for background documents
    const documentTextures = [
      createDocumentTexture('legal'),
      createDocumentTexture('medical'),
      createDocumentTexture('default')
    ].filter(Boolean) as THREE.Texture[];
    
    // Generate positions for a better "LexiMentis" formation with more spacing
    const generateLexiMentisPositions = () => {
      const positions = [];
      const letterCount = 10; // LEXIMENTIS has 10 letters
      const spacing = 7; // Wider spacing between letters for better readability
      
      for (let i = 0; i < letterCount; i++) {
        positions.push(new THREE.Vector3(
          (i - (letterCount - 1) / 2) * spacing,
          10, // Position higher up for better separation from tagline
          -5
        ));
      }
      
      return positions;
    };
    
    // Create more flying documents for a more dramatic effect
    const NUM_OBJECTS = 60; // Increased from 40
    const objects: THREE.Mesh[] = [];
    
    // Create main letter objects first (for "LEXIMENTIS")
    const letterPositions = generateLexiMentisPositions();
    for (let i = 0; i < letterPositions.length; i++) {
      const geometry = new THREE.PlaneGeometry(6, 8); // Even larger letters
      const material = new THREE.MeshStandardMaterial({
        map: letterTextures[i] || null,
        transparent: true,
        side: THREE.DoubleSide,
        metalness: 0.8, // More metallic
        roughness: 0.2, // Less rough for shinier look
        depthWrite: true,
        depthTest: true,
        alphaTest: 0.1,
        emissive: new THREE.Color(0xffcc00), // Golden emissive glow
        emissiveIntensity: 0.2, // Subtle glow
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Randomize initial positions with wider spread for more dramatic convergence
      mesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2, 
        Math.random() * Math.PI * 2
      );
      
      // Store animation data
      mesh.userData = {
        targetPosition: letterPositions[i],
        swirlSpeed: 0.004 + Math.random() * 0.012,
        swirlRadius: 35 + Math.random() * 15, // Wider radius
        angle: Math.random() * Math.PI * 2,
        isLetter: true,
        letterIndex: i
      };
      
      objects.push(mesh);
      scene.add(mesh);
    }
    
    // Add extra document objects with emissive glow for visibility
    for (let i = letterPositions.length; i < NUM_OBJECTS; i++) {
      const geometry = new THREE.PlaneGeometry(4, 5);
      const docType = i % documentTextures.length;
      const material = new THREE.MeshStandardMaterial({
        map: documentTextures[docType],
        transparent: true,
        side: THREE.DoubleSide,
        metalness: 0.3,
        roughness: 0.7,
        depthWrite: true,
        depthTest: true,
        alphaTest: 0.1,
        emissive: new THREE.Color(0xffffff), // White emissive for documents
        emissiveIntensity: 0.15, // Subtle glow
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Randomize initial positions with wider spread
      mesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Position background documents in a scattered formation
      mesh.userData = {
        targetPosition: new THREE.Vector3(
          (Math.random() - 0.5) * 100, // Wider spread
          -30 - Math.random() * 20,   // Position lower down to create more space
          -30 - Math.random() * 15    // Further back
        ),
        swirlSpeed: 0.005 + Math.random() * 0.015,
        swirlRadius: 35 + Math.random() * 15,
        angle: Math.random() * Math.PI * 2,
        isLetter: false,
        fadingOut: Math.random() < 0.5 // More documents fade out
      };
      
      objects.push(mesh);
      scene.add(mesh);
    }
    
    // Animation control
    let startTime = performance.now();
    let isConverging = false;
    let hasFixedDepthSorting = false;
    
    // Animation loop with improved dynamics
    const animate = () => {
      if (!isMountedRef.current) return;
      
      requestIdRef.current = requestAnimationFrame(animate);
      const elapsed = performance.now() - startTime;
      
      // Phase 1: Chaos swirling with more dynamic movement
      if (!isConverging) {
        objects.forEach((obj) => {
          obj.userData.angle += obj.userData.swirlSpeed;
          
          // More dynamic 3D swirling
          const radius = obj.userData.swirlRadius;
          obj.position.x = Math.cos(obj.userData.angle) * radius * 0.8;
          obj.position.y = Math.sin(obj.userData.angle * 1.1) * radius;
          obj.position.z = Math.sin(obj.userData.angle * 0.7) * radius * 0.6;
          
          // More dynamic rotation
          obj.rotation.x += 0.01;
          obj.rotation.y += 0.008;
          obj.rotation.z += 0.005;
        });
        
        if (elapsed > CHAOS_DURATION && isMountedRef.current) {
          isConverging = true;
          startTime = performance.now();
          setAnimationPhase('converging');
        }
      } else {
        // Phase 2: Converge to target positions with improved dynamics
        let allConverged = true;
        
        objects.forEach((obj) => {
          const { targetPosition } = obj.userData;
          
          // Check if this object has finished converging
          const distanceToTarget = obj.position.distanceTo(targetPosition);
          if (distanceToTarget > 0.1) {
            allConverged = false;
          }
          
          // Faster convergence for a more dramatic effect
          obj.position.lerp(targetPosition, 0.05);
          
          // Align rotation with more dynamic damping
          obj.rotation.x = THREE.MathUtils.lerp(obj.rotation.x, 0, 0.08);
          obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, 0, 0.08);
          obj.rotation.z = THREE.MathUtils.lerp(obj.rotation.z, 0, 0.08);
        });
        
        // Fix depth sorting issues
        if (!hasFixedDepthSorting && elapsed > FIX_DEPTH_SORT_DELAY) {
          // Sort objects based on material and position to prevent flickering
          objects.forEach((obj, index) => {
            // Assign consistent z-depths to prevent z-fighting
            const baseZ = obj.userData.targetPosition.z;
            obj.position.z = baseZ - (index * 0.01);
            
            // Set consistent rotation to prevent geometry flicker
            obj.rotation.set(0, 0, 0);
            
            // Update material to prevent rendering artifacts
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                // Handle material array
                obj.material = obj.material.map(mat => {
                  const clonedMat = mat.clone();
                  clonedMat.needsUpdate = true;
                  clonedMat.depthWrite = true;
                  clonedMat.depthTest = true;
                  clonedMat.alphaTest = 0.1;
                  clonedMat.transparent = true;
                  
                  const typedClonedMat = clonedMat as THREE.MeshStandardMaterial;
                  
                  if (typedClonedMat.map) {
                    typedClonedMat.map.needsUpdate = true;
                  }
                  return typedClonedMat;
                });
              } else {
                // Handle single material
                const material = obj.material.clone();
                material.needsUpdate = true;
                material.depthWrite = true;
                material.depthTest = true;
                material.alphaTest = 0.1;
                material.transparent = true;
                
                const typedMaterial = material as THREE.MeshStandardMaterial;
                obj.material = typedMaterial;
                
                if (typedMaterial.map) {
                  typedMaterial.map.needsUpdate = true;
                }
              }
            }
          });
          
          // Sort render order
          objects.sort((a, b) => {
            return a.position.z - b.position.z;
          }).forEach((obj, index) => {
            obj.renderOrder = index;
          });
          
          hasFixedDepthSorting = true;
        }
        
        // Fade out background documents
        if (elapsed > ORDERED_PHASE_DELAY) {
          objects.forEach(obj => {
            if (!obj.userData.isLetter && obj.userData.fadingOut) {
              // Handle material property which could be a single material or an array
              if (obj.material) {
                if (Array.isArray(obj.material)) {
                  // Handle material array
                  obj.material.forEach(mat => {
                    // Fade out but not completely - stop at 30% opacity for a subtle effect
                    if (mat.opacity !== undefined && mat.opacity > 0.3) {
                      mat.opacity = Math.max(0.3, mat.opacity - 0.01);
                    }
                  });
                } else {
                  // Handle single material
                  // Fade out but not completely - stop at 30% opacity for a subtle effect
                  if (obj.material.opacity !== undefined && obj.material.opacity > 0.3) {
                    obj.material.opacity = Math.max(0.3, obj.material.opacity - 0.01);
                  }
                }
              }
            }
          });
        }
        
        // Fade in texts after brief delay
        if (elapsed > CONVERGENCE_FADE_IN_DELAY) {
          // Fade in the tagline text
          if (textRef.current) {
            textRef.current.style.opacity = Math.min((elapsed - CONVERGENCE_FADE_IN_DELAY) / 800, 1).toString();
          }
          
          // Fade in the LexiMentis text with a slight delay
          if (logoTextRef.current) {
            const logoDelay = 300; // 300ms after tagline starts appearing
            if (elapsed > CONVERGENCE_FADE_IN_DELAY + logoDelay) {
              logoTextRef.current.style.opacity = Math.min((elapsed - CONVERGENCE_FADE_IN_DELAY - logoDelay) / 600, 1).toString();
            }
          }
        }
        
        if (allConverged && elapsed > ORDERED_PHASE_DELAY && isMountedRef.current) {
          setAnimationPhase('ordered');
        }
      }
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Responsive resizing
    const handleResize = () => {
      if (!isMountedRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Listen for theme changes
    const handleThemeChange = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      if (scene) {
        scene.background = new THREE.Color(isDarkMode ? 0x111827 : 0xf3f4f6); // Update scene background
      }
    };
    
    // Add mutation observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Cleanup
    return () => {
      // Set mounted flag to false to prevent further updates
      isMountedRef.current = false;
      
      // Cancel animation frame
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      observer.disconnect(); // Stop observing theme changes
      
      // Clean up THREE.js resources
      if (container && renderer && renderer.domElement) {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      
      // Dispose of geometries and materials with proper type checking
      objects.forEach(obj => {
        if (obj.geometry) obj.geometry.dispose();
        
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => {
            // Cast to your custom Material interface
            const typedMat = mat as Material;
            if (typedMat.map) typedMat.map.dispose();
            mat.dispose();
          });
        } else if (obj.material) {
          // Cast to your custom Material interface
          const typedMat = obj.material as Material;
          if (typedMat.map) typedMat.map.dispose();
          obj.material.dispose();
        }
      });
      
      // Clean up lights
      [ambientLight, goldLight, warmLight, frontLight].forEach(light => {
        if (light && scene) {
          scene.remove(light);
        }
      });
      
      // Clean up all objects in the scene
      while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);
      }
      
      // Dispose renderer
      if (renderer) renderer.dispose();
    };
  }, []);

  // Use theme-aware classes instead of hard-coded bg-black
  return (
    <div className="relative w-full h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Add explicit LexiMentis text overlay that will fade in */}
      <div 
        ref={logoTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: 0 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 
                    bg-clip-text text-transparent drop-shadow-xl tracking-wide">
          LEXIMENTIS
        </h1>
      </div>
      
      {/* Tagline and button */}
      <div 
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 dark:text-white pointer-events-none z-20"
        style={{ opacity: 0 }}
      >
        <div className="mt-80 text-center"> {/* Increased top margin for better spacing */}
          <p className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
            Bringing Order Out of Chaos
          </p>
          
          {animationPhase === 'ordered' && (
            <div className="mt-20 transition-opacity duration-500"> {/* Increased spacing */}
              <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
                Leveraging AI to streamline workers' compensation legal workflows
              </p>
              
              <Link 
                to="/how-it-works"
                className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-semibold py-4 px-12 rounded-lg 
                          transition-colors pointer-events-auto shadow-lg text-lg inline-block"
              >
                Learn More
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LexiMentisLanding;
