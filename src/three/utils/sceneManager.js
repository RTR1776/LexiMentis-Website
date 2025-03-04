import * as THREE from 'three';
import { getShaderSources } from './shaderUtils';

/**
 * Creates and manages the Three.js scene for the fractal landing page
 */
export class FractalSceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.fractalMaterial = null;
    this.animationFrameId = null;
    this.lastTime = 0;
    this.onTransitionUpdate = null;
    this.transitionStarted = false;
    this.mousePosition = new THREE.Vector2(0.5, 0.5);
    this.shaders = getShaderSources();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true, 
      alpha: true 
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    
    // Camera positioning
    this.camera.position.z = 1.5;
    
    // Create fractal plane
    this.createFractalPlane();
    
    // Set up event handlers
    this.setupEventListeners();
    
    return this;
  }

  createFractalPlane() {
    // Create shader material with our shaders
    this.fractalMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        transitionFactor: { value: 0.0 },
        mousePos: { value: this.mousePosition }
      },
      vertexShader: this.shaders.vertex,
      fragmentShader: this.shaders.fractalFragment,
      transparent: true
    });
    
    // Create a plane that fills the view
    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, this.fractalMaterial);
    this.scene.add(plane);
  }

  setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('click', this.handleClick);
  }

  handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    
    if (this.fractalMaterial && this.fractalMaterial.uniforms) {
      this.fractalMaterial.uniforms.resolution.value.set(width, height);
    }
  };

  handleMouseMove = (event) => {
    this.updateMousePosition(event.clientX, event.clientY);
  };

  handleTouchMove = (event) => {
    if (event.touches.length > 0) {
      this.updateMousePosition(event.touches[0].clientX, event.touches[0].clientY);
      event.preventDefault();
    }
  };

  handleClick = () => {
    if (!this.transitionStarted) {
      this.startTransition();
    }
  };

  updateMousePosition(x, y) {
    if (this.mousePosition) {
      this.mousePosition.set(
        x / window.innerWidth,
        1.0 - (y / window.innerHeight)
      );

      if (this.fractalMaterial && this.fractalMaterial.uniforms) {
        this.fractalMaterial.uniforms.mousePos.value = this.mousePosition;
      }
    }
  }

  startTransition() {
    this.transitionStarted = true;
    // Automatically start the transition after a delay
    setTimeout(() => {
      console.log("Starting fractal transition effect");
    }, 500);
  }

  animate = (currentTime) => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Convert to seconds for more intuitive time values
    const now = currentTime * 0.001;
    const deltaTime = Math.min(now - this.lastTime, 0.1); // Limit delta for stable animation
    this.lastTime = now;
    
    // Update time uniform
    if (this.fractalMaterial && this.fractalMaterial.uniforms) {
      this.fractalMaterial.uniforms.time.value += deltaTime;
      
      // Update transition factor if transition has started
      if (this.transitionStarted) {
        const transitionUniform = this.fractalMaterial.uniforms.transitionFactor;
        // Gradually increase transition value over time
        const newTransitionValue = Math.min(transitionUniform.value + deltaTime * 0.2, 1.0);
        transitionUniform.value = newTransitionValue;
        
        // Call the transition update callback if provided
        if (this.onTransitionUpdate) {
          this.onTransitionUpdate(newTransitionValue);
        }
      }
    }
    
    this.renderer.render(this.scene, this.camera);
  };

  start() {
    // Start animation loop
    this.lastTime = performance.now() * 0.001;
    this.animate(this.lastTime * 1000);
    
    // Schedule transition to start after delay (let user see the fractals first)
    setTimeout(() => {
      this.startTransition();
    }, 5000);
  }

  cleanup() {
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('click', this.handleClick);
    
    // Dispose of Three.js resources
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      });
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
