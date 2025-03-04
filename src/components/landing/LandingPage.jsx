import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FractalSceneManager } from '../../three/utils/sceneManager';
import './LandingPage.css';

/**
 * Landing page component with Three.js fractal animation
 */
const LandingPage = () => {
  const canvasRef = useRef(null);
  const sceneManagerRef = useRef(null);
  const [transitionState, setTransitionState] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  
  useEffect(() => {
    // Initialize scene only if canvas is available
    if (!canvasRef.current) return;
    
    // Create and initialize the fractal scene
    const sceneManager = new FractalSceneManager(canvasRef.current);
    sceneManager.init();
    
    // Set transition update callback
    sceneManager.onTransitionUpdate = (value) => {
      setTransitionState(value);
      if (value > 0.1) setShowInstructions(false);
    };
    
    // Start animation
    sceneManager.start();
    
    // Store reference to scene manager for cleanup
    sceneManagerRef.current = sceneManager;
    
    // Clean up on component unmount
    return () => {
      if (sceneManagerRef.current) {
        sceneManagerRef.current.cleanup();
      }
    };
  }, []);
  
  return (
    <div className="landing-page">
      {/* Three.js Canvas - full screen background */}
      <canvas ref={canvasRef} className="fractal-canvas" />
      
      {/* Instructions overlay - only visible initially */}
      {showInstructions && (
        <div className="instructions-overlay">
          <p>Click anywhere to begin the experience</p>
        </div>
      )}
      
      {/* Content overlay that fades in after the transition */}
      <div 
        className="content-overlay"
        style={{ opacity: Math.pow(transitionState, 2) }}
      >
        <div className="container mx-auto px-6 py-12 max-w-4xl text-center space-y-8">
          <h1 className="title">
            LexiMentis
          </h1>
          
          <p className="tagline">
            Transforming Workers' Compensation Law Through Intelligent Automation
          </p>
          
          <div className="button-container">
            <Link to="/how-it-works" className="primary-button">
              Learn More
            </Link>
            
            <Link to="/book" className="secondary-button">
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
