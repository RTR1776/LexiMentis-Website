import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const LexiMentisLanding = () => {
  const containerRef = useRef(null);
  const [animationPhase, setAnimationPhase] = useState('chaos');
  const [textOpacity, setTextOpacity] = useState(0);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background to match logo
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create vibrant lighting to match the logo's colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Create colored lights matching the logo
    const blueLight = new THREE.PointLight(0x4169e1, 1, 100); // Royal blue
    blueLight.position.set(-20, 10, 30);
    scene.add(blueLight);
    
    const goldLight = new THREE.PointLight(0xffd700, 1, 100); // Gold
    goldLight.position.set(20, 15, 30);
    scene.add(goldLight);
    
    const purpleLight = new THREE.PointLight(0x800080, 0.8, 100); // Purple
    purpleLight.position.set(0, -20, 30);
    scene.add(purpleLight);
    
    const redLight = new THREE.PointLight(0xff4500, 0.7, 100); // Red-orange
    redLight.position.set(15, -10, 20);
    scene.add(redLight);
    
    // Function to create letter textures with dynamic colors and stylized text
    const createLetterTexture = (letter, index) => {
      // Create a canvas to draw the letter
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      // Create gradient background based on letter position
      const gradient = context.createLinearGradient(0, 0, 512, 512);
      
      // Use colors from the logo
      const colorSchemes = [
        { start: '#fcd34d', end: '#f59e0b' }, // Gold gradient from CSS
        { start: '#f59e0b', end: '#fcd34d' }, // Reverse gold gradient
        { start: '#f59e0b', end: '#fcd34d' }, // Gold gradient again
        { start: '#fcd34d', end: '#f59e0b' }  // Reverse gold gradient
      ];
      
      const colorScheme = colorSchemes[index % colorSchemes.length];
      gradient.addColorStop(0, colorScheme.start);
      gradient.addColorStop(1, colorScheme.end);
      
      // Fill background with gradient
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 512);
      
      // Add a subtle border
      context.strokeStyle = '#ffffff';
      context.lineWidth = 5;
      context.strokeRect(10, 10, 492, 492);
      
      // Create a 3D effect with shadow
      context.shadowColor = 'rgba(0, 0, 0, 0.5)';
      context.shadowBlur = 15;
      context.shadowOffsetX = 5;
      context.shadowOffsetY = 5;
      
      // Create a metallic gradient for the text
      const textGradient = context.createLinearGradient(100, 100, 400, 400);
      textGradient.addColorStop(0, '#ffffff');
      textGradient.addColorStop(0.5, '#f0f0f0');
      textGradient.addColorStop(0.51, '#e0e0e0');
      textGradient.addColorStop(1, '#ffffff');
      
      // Draw letter outline first (for embossed effect)
      context.lineWidth = 8;
      context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      context.font = 'bold 300px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.strokeText(letter, 256, 256);
      
      // Draw letter with gradient fill
      context.fillStyle = textGradient;
      context.fillText(letter, 256, 256);
      
      // Add shine effect
      context.fillStyle = 'rgba(255, 255, 255, 0.2)';
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
    
    // Function to create document textures
    const createDocumentTexture = (type) => {
      // Create a canvas to draw the document
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      if (type === 'legal') {
        // Draw legal pad
        context.fillStyle = "#f5d682";
        context.fillRect(0, 0, 512, 512);
        
        // Draw red margin
        context.strokeStyle = "#cc3333";
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(70, 0);
        context.lineTo(70, 512);
        context.stroke();
        
        // Draw blue lines
        context.strokeStyle = "#9999cc";
        context.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          context.beginPath();
          context.moveTo(0, 80 + i * 60);
          context.lineTo(512, 80 + i * 60);
          context.stroke();
        }
        
      } else if (type === 'medical') {
        // Draw medical record
        context.fillStyle = "#f0f7ff";
        context.fillRect(0, 0, 512, 512);
        
        // Draw header
        context.fillStyle = "#d3e0ea";
        context.fillRect(20, 20, 472, 100);
        context.strokeStyle = "#6097c1";
        context.lineWidth = 4;
        context.strokeRect(20, 20, 472, 100);
        
        // Draw medical cross
        context.fillStyle = "#cc3333";
        context.fillRect(50, 30, 30, 80);
        context.fillRect(25, 55, 80, 30);
        
      } else {
        // Default document
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, 512, 512);
        
        // Draw header area
        context.fillStyle = "#f5f5f5";
        context.fillRect(50, 50, 412, 80);
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.strokeRect(50, 50, 412, 80);
        
        // Draw lines
        context.strokeStyle = "#dddddd";
        context.lineWidth = 1;
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
    
    // Create letter textures for "LEXIMENTIS"
    const letterTextures = [];
    [..."LEXIMENTIS"].forEach((letter, index) => {
      letterTextures.push(createLetterTexture(letter, index));
    });
    
    // Create document textures for background documents
    const documentTextures = [
      createDocumentTexture('legal'),
      createDocumentTexture('medical'),
      createDocumentTexture('default')
    ];
    
    // Generate positions for a horizontal "LexiMentis" formation
    const generateLexiMentisPositions = () => {
      // Simple horizontal line with even spacing for "LEXIMENTIS"
      const positions = [];
      const letterCount = 10; // LEXIMENTIS has 10 letters
      const spacing = 6; // Horizontal spacing between letters
      
      for (let i = 0; i < letterCount; i++) {
        positions.push(new THREE.Vector3(
          (i - (letterCount - 1) / 2) * spacing,
          8, // Position higher up
          -5
        ));
      }
      
      return positions;
    };
    
    // Objects (legal documents, folders, etc.)
    const NUM_OBJECTS = 40;
    const objects = [];
    
    // Create main letter objects first (for "LEXIMENTIS")
    const letterPositions = generateLexiMentisPositions();
    for (let i = 0; i < letterPositions.length; i++) {
      const geometry = new THREE.PlaneGeometry(5, 6);
      const material = new THREE.MeshStandardMaterial({
        map: letterTextures[i],
        transparent: true,
        side: THREE.DoubleSide,
        metalness: 0.1,
        roughness: 0.8,
        depthWrite: true,
        depthTest: true,
        alphaTest: 0.1,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Randomize initial positions (chaos)
      mesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Store animation data
      mesh.userData = {
        targetPosition: letterPositions[i],
        swirlSpeed: 0.005 + Math.random() * 0.015,
        swirlRadius: 30 + Math.random() * 10,
        angle: Math.random() * Math.PI * 2,
        isLetter: true,
        letterIndex: i
      };
      
      objects.push(mesh);
      scene.add(mesh);
    }
    
    // Add extra document objects
    for (let i = letterPositions.length; i < NUM_OBJECTS; i++) {
      const geometry = new THREE.PlaneGeometry(4, 5);
      const docType = i % documentTextures.length;
      const material = new THREE.MeshStandardMaterial({
        map: documentTextures[docType],
        transparent: true,
        side: THREE.DoubleSide,
        metalness: 0.1,
        roughness: 0.8,
        depthWrite: true,
        depthTest: true,
        alphaTest: 0.1,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Randomize initial positions (chaos)
      mesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Position background documents in a scattered formation with more space
      mesh.userData = {
        targetPosition: new THREE.Vector3(
          (Math.random() - 0.5) * 80, // Spread more horizontally
          -25 - Math.random() * 15,   // Position much lower
          -20 - Math.random() * 10    // Further back
        ),
        swirlSpeed: 0.005 + Math.random() * 0.015,
        swirlRadius: 30 + Math.random() * 10,
        angle: Math.random() * Math.PI * 2,
        isLetter: false,
        fadingOut: Math.random() < 0.3 // Only 30% of background documents will fade out
      };
      
      objects.push(mesh);
      scene.add(mesh);
    }
    
    // Animation control
    let startTime = performance.now();
    let isConverging = false;
    let hasFixedDepthSorting = false;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsed = performance.now() - startTime;
      
      // Phase 1: Chaos swirling
      if (!isConverging) {
        objects.forEach((obj) => {
          obj.userData.angle += obj.userData.swirlSpeed;
          
          // Swirl in 3D space
          const radius = obj.userData.swirlRadius;
          obj.position.x = Math.cos(obj.userData.angle) * radius;
          obj.position.y = Math.sin(obj.userData.angle) * radius;
          obj.position.z = Math.sin(obj.userData.angle * 0.5) * radius * 0.5;
          
          // Rotation
          obj.rotation.x += 0.005;
          obj.rotation.y += 0.005;
          obj.rotation.z += 0.005;
        });
        
        // After 6 seconds, trigger convergence
        if (elapsed > 6000) {
          isConverging = true;
          startTime = performance.now();
          setAnimationPhase('converging');
        }
      } else {
        // Phase 2: Converge to target positions
        let allConverged = true;
        
        objects.forEach((obj) => {
          const { targetPosition } = obj.userData;
          
          // Check if this object has finished converging
          const distanceToTarget = obj.position.distanceTo(targetPosition);
          if (distanceToTarget > 0.1) {
            allConverged = false;
          }
          
          // Lerp to target
          obj.position.lerp(targetPosition, 0.03);
          
          // Align rotation
          obj.rotation.x = THREE.MathUtils.lerp(obj.rotation.x, 0, 0.05);
          obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, 0, 0.05);
          obj.rotation.z = THREE.MathUtils.lerp(obj.rotation.z, 0, 0.05);
        });
        
        // Fix depth sorting issues after objects have mostly converged
        if (!hasFixedDepthSorting && elapsed > 3000) {
          // Sort objects based on material and position to prevent flickering
          objects.forEach((obj, index) => {
            // Assign consistent z-depths to prevent z-fighting
            const baseZ = obj.userData.targetPosition.z;
            obj.position.z = baseZ - (index * 0.01);
            
            // Set consistent rotation to prevent geometry flicker
            obj.rotation.set(0, 0, 0);
            
            // Update material to prevent rendering artifacts
            if (obj.material) {
              // Clone the material to prevent shared material issues
              obj.material = obj.material.clone();
              obj.material.needsUpdate = true;
              obj.material.depthWrite = true;
              obj.material.depthTest = true;
              obj.material.alphaTest = 0.1;
              obj.material.transparent = true;
              
              // Force texture update
              if (obj.material.map) {
                obj.material.map.needsUpdate = true;
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
        
        // Fade out background documents that are marked for fading
        if (elapsed > 4000) {
          objects.forEach(obj => {
            if (!obj.userData.isLetter && obj.userData.fadingOut) {
              // Fade out but not completely - stop at 30% opacity for a subtle effect
              if (obj.material && obj.material.opacity > 0.3) {
                obj.material.opacity = Math.max(0.3, obj.material.opacity - 0.01);
              }
            }
          });
        }
        
        // Fade in title after 2 seconds of convergence
        if (elapsed > 2000) {
          setTextOpacity(Math.min((elapsed - 2000) / 1000, 1));
        }
        
        if (allConverged && elapsed > 4000) {
          setAnimationPhase('ordered');
        }
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Responsive resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      
      // Dispose of resources
      objects.forEach(obj => {
        obj.geometry.dispose();
        obj.material.dispose();
      });
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="absolute inset-0" />
      
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none z-10"
        style={{ opacity: textOpacity }}
      >
        {/* No LexiMentis text here since it will be formed by the documents */}
        <div className="mt-64 text-center"> {/* Increased top margin to accommodate higher logo */}
          <p className="text-3xl font-light bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Bringing Order Out of Chaos
          </p>
          
          {animationPhase === 'ordered' && (
            <div className="mt-16 transition-opacity duration-500"> {/* Increased spacing */}
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Leveraging AI to streamline workers' compensation legal workflows
              </p>
              <button 
                className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-semibold py-4 px-10 rounded-lg 
                          transition-colors pointer-events-auto shadow-lg text-lg"
              >
                Learn More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LexiMentisLanding;
