import { getShaderSources } from './shaderUtils';

/**
 * Exports shader sources for Three.js
 */
export const shaders = getShaderSources();

/**
 * Alternative implementation if direct imports aren't working with your bundler
 * This function would fetch shader files at runtime
 */
export const fetchShader = async (shaderPath) => {
  try {
    const response = await fetch(shaderPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch shader: ${shaderPath}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading shader:', error);
    return null;
  }
};
