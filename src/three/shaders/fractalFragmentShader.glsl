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

// Complex operations for fractals
vec2 cpow3(vec2 z) {
  // z^3 = r^3 * (cos(3θ) + i*sin(3θ))
  float r = length(z);
  float theta = atan(z.y, z.x);
  float r3 = r * r * r;
  float angle = 3.0 * theta;
  return r3 * vec2(cos(angle), sin(angle));
}

vec2 cpow4(vec2 z) {
  // z^4 using two squarings
  return csquare(csquare(z));
}

vec2 csin(vec2 z) {
  // sin(z) = sin(x)cosh(y) + i*cos(x)sinh(y)
  return vec2(
    sin(z.x) * cosh(z.y),
    cos(z.x) * sinh(z.y)
  );
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
  
  // Multiple Julia set seeds for variation
  vec2 seed1 = 0.7 * vec2(cos(time * 0.3), sin(time * 0.3));
  vec2 seed2 = 0.5 * vec2(cos(time * 0.2 + 1.5), sin(time * 0.4 + 0.8));
  vec2 seed3 = 0.6 * vec2(sin(time * 0.25), cos(time * 0.15));
  
  // Fractal type selection based on time
  float fractalType = mod(floor(time * 0.2), 4.0);
  
  // Reduce complexity during transition
  fractalType = mix(fractalType, 0.0, transitionFactor);
  
  vec2 z = c;
  float iter = 0.0;
  const float maxIter = 150.0;
  
  for(float i = 0.0; i < maxIter; i++) {
    // Different fractal formulas based on current type
    if(fractalType < 1.0) {
      // Standard Mandelbrot/Julia blend
      z = csquare(z) + mix(c, seed1, 0.5 + 0.5 * sin(time * 0.2));
    } else if(fractalType < 2.0) {
      // Cubic Mandelbrot/Julia variant
      z = cpow3(z) + mix(c, seed2, 0.5 + 0.5 * cos(time * 0.25));
    } else if(fractalType < 3.0) {
      // Burning Ship fractal variant (uses absolute values)
      z = vec2(abs(z.x), abs(z.y));
      z = csquare(z) + mix(c, seed3, 0.5 + 0.5 * sin(time * 0.15));
    } else {
      // Sin(z) + c variant
      z = csin(z) * 0.4 + mix(c, seed1, 0.5 + 0.5 * cos(time * 0.3));
    }
    
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
  
  // Extended color palette
  vec3 deepBlue = vec3(0.0, 0.1, 0.4);
  vec3 skyBlue = vec3(0.0, 0.5, 1.0);
  vec3 purple = vec3(0.5, 0.0, 0.5);
  vec3 magenta = vec3(1.0, 0.0, 0.7);
  vec3 gold = vec3(1.0, 0.84, 0.0);
  vec3 orange = vec3(1.0, 0.5, 0.0);
  vec3 red = vec3(1.0, 0.0, 0.3);
  vec3 teal = vec3(0.0, 0.8, 0.8);
  
  // Color cycling based on time
  float shift = fract(time * 0.05);
  t = fract(t + shift);
  
  vec3 color;
  if(t < 0.125) {
    color = mix(deepBlue, skyBlue, t * 8.0);
  } else if(t < 0.25) {
    color = mix(skyBlue, teal, (t - 0.125) * 8.0);
  } else if(t < 0.375) {
    color = mix(teal, purple, (t - 0.25) * 8.0);
  } else if(t < 0.5) {
    color = mix(purple, magenta, (t - 0.375) * 8.0);
  } else if(t < 0.625) {
    color = mix(magenta, red, (t - 0.5) * 8.0);
  } else if(t < 0.75) {
    color = mix(red, orange, (t - 0.625) * 8.0);
  } else if(t < 0.875) {
    color = mix(orange, gold, (t - 0.75) * 8.0);
  } else {
    color = mix(gold, deepBlue, (t - 0.875) * 8.0);
  }
  
  // Enhanced glow effect with more variation
  float glow = 0.15 * (sin(time * 1.1 + uv.x * 15.0) * cos(time * 0.9 + uv.y * 12.0));
  color += vec3(glow * sin(time), glow * cos(time * 0.7), glow * sin(time * 1.3));
  
  // Add subtle texture
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233) * floor(time))) * 43758.5453);
  color += noise * 0.02 * vec3(1.0, 0.8, 0.2);
  
  return vec4(color, 1.0);
}

// Logo mask function - approximation of triangle shape
float logoMask(vec2 uv) {
  // Center the coordinates
  vec2 p = uv * 2.0 - 1.0;
  
  // Triangle definition
  float triangle = max(abs(p.x) * 0.866025 + p.y * 0.5, -p.y);
  triangle = smoothstep(0.0, 0.05, 1.0 - triangle);
  
  // Inner triangle
  vec2 p2 = p * 0.7;
  float innerTriangle = max(abs(p2.x) * 0.866025 + p2.y * 0.5, -p2.y);
  innerTriangle = smoothstep(0.0, 0.05, 1.0 - innerTriangle);
  
  // Combine for basic triangle shape
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
  
  // Add some energy waves emanating from the center during transition
  if(transitionFactor > 0.0 && transitionFactor < 1.0) {
    float dist = length(uv - 0.5);
    float wave1 = sin((dist * 10.0 - time * 2.0) * 3.14159);
    float wave2 = cos((dist * 15.0 - time * 3.0) * 3.14159);
    float waves = (wave1 * wave2) * 0.3 * transitionFactor * (1.0 - transitionFactor) * 4.0;
    finalColor.rgb += waves * vec3(0.5, 0.3, 1.0);
  }
  
  gl_FragColor = finalColor;
}
