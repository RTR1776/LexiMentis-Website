import vertexShaderSource from '../shaders/vertexShader.glsl';
import fractalFragmentShaderSource from '../shaders/fractalFragmentShader.glsl';

/**
 * Shader loader utility that provides shader code to Three.js
 */
export const getShaderSources = () => {
  // For development, handle the case where webpack/bundler might not properly import the shader files
  // In that case, we provide fallback shader code
  const vertexShader = vertexShaderSource || `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fractalFragment = fractalFragmentShaderSource || `
    uniform float time;
    uniform vec2 resolution;
    uniform float transitionFactor;
    uniform vec2 mousePos;
    varying vec2 vUv;

    // Complex number multiplication
    vec2 cmul(vec2 a, vec2 b) {
      return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }

    // Complex number exponentiation (z^2)
    vec2 csquare(vec2 z) {
      return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
    }

    float cosh(float x) {
      return (exp(x) + exp(-x)) * 0.5;
    }

    float sinh(float x) {
      return (exp(x) - exp(-x)) * 0.5;
    }

    // Enhanced fractal function with multiple fractal types
    vec4 fractal(vec2 uv) {
      // Map UV to complex plane
      vec2 c = 2.8 * (uv - 0.5);
      
      // Julia set seeds for variation
      vec2 seed1 = 0.7 * vec2(cos(time * 0.3), sin(time * 0.3));
      
      vec2 z = c;
      float iter = 0.0;
      const float maxIter = 100.0;
      
      for(float i = 0.0; i < maxIter; i++) {
        // Standard Mandelbrot/Julia blend
        z = csquare(z) + mix(c, seed1, 0.5 + 0.5 * sin(time * 0.2));
        
        if(length(z) > 4.0) {
          iter = i;
          break;
        }
      }
      
      if(iter == 0.0) {
        return vec4(0.0, 0.0, 0.0, 1.0);
      }
      
      // Enhanced coloring with more color bands
      float t = iter / maxIter;
      
      // Color palette aligned with website theme
      vec3 deepBlue = vec3(0.0, 0.1, 0.4);  // Primary-800
      vec3 skyBlue = vec3(0.03, 0.52, 0.91); // Primary-600 
      vec3 gold = vec3(1.0, 0.84, 0.0);      // Gold accent
      vec3 orange = vec3(1.0, 0.5, 0.0);
      
      // Color cycling based on time
      float shift = fract(time * 0.05);
      t = fract(t + shift);
      
      vec3 color;
      if(t < 0.33) {
        color = mix(deepBlue, skyBlue, t * 3.0);
      } else if(t < 0.66) {
        color = mix(skyBlue, gold, (t - 0.33) * 3.0);
      } else {
        color = mix(gold, deepBlue, (t - 0.66) * 3.0);
      }
      
      return vec4(color, 1.0);
    }

    // Logo mask function - triangle shape
    float logoMask(vec2 uv) {
      // Center the coordinates
      vec2 p = uv * 2.0 - 1.0;
      
      // Triangle definition
      float triangle = max(abs(p.x) * 0.866025 + p.y * 0.5, -p.y);
      triangle = smoothstep(0.0, 0.05, 1.0 - triangle);
      
      // Inner triangle
      vec2 p2 = p * 0.6; // Slightly smaller to create a border
      float innerTriangle = max(abs(p2.x) * 0.866025 + p2.y * 0.5, -p2.y);
      innerTriangle = smoothstep(0.0, 0.05, 1.0 - innerTriangle);
      
      // Combine for basic triangle shape with inner cutout
      return max(triangle - innerTriangle, 0.0);
    }

    void main() {
      vec2 uv = vUv;
      vec4 fractalColor = fractal(uv);
      
      // Logo mask with transition factor
      float mask = logoMask(uv);
      mask *= smoothstep(0.0, 1.0, transitionFactor * 2.0); // Fade in logo
      
      // Logo colors - gold triangle
      vec4 logoColor = vec4(1.0, 0.84, 0.0, 1.0);
      
      // Combine fractal and logo based on transition
      vec4 finalColor = mix(fractalColor, logoColor, mask);
      
      // Mouse interaction effect - subtle distortion
      vec2 mouseEffect = uv - mousePos;
      float mouseDist = length(mouseEffect);
      float mouseInfluence = 0.0;
      
      // Only apply mouse effect when not fully transitioned to logo
      if(transitionFactor < 0.9) {
        mouseInfluence = exp(-mouseDist * 10.0) * 0.2 * (1.0 - transitionFactor);
        finalColor.rgb += mouseInfluence * vec3(0.5, 0.8, 1.0);
      }
      
      // Add energy waves during transition
      if(transitionFactor > 0.0 && transitionFactor < 1.0) {
        float dist = length(uv - 0.5);
        float wave = sin((dist * 10.0 - time * 2.0) * 3.14159);
        float waves = wave * 0.3 * transitionFactor * (1.0 - transitionFactor) * 4.0;
        finalColor.rgb += waves * vec3(1.0, 0.8, 0.0);  // Gold waves
      }
      
      gl_FragColor = finalColor;
    }
  `;

  return {
    vertex: vertexShader,
    fractalFragment: fractalFragment
  };
};
