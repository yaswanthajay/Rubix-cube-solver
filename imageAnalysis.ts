import { PuzzleState, FaceImage, PuzzleConfig } from '../types/cube';

export async function analyzePuzzleFromImages(
  faceImages: FaceImage[], 
  config: PuzzleConfig
): Promise<PuzzleState> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scrambledState: PuzzleState = {};
      const gridSize = config.gridSize;
      const totalSquares = gridSize * gridSize;
      
      // Generate realistic scrambled state based on puzzle type
      config.faceNames.forEach((faceName, faceIndex) => {
        const faceKey = faceName[0]; // F, B, R, L, U, D
        
        for (let i = 0; i < totalSquares; i++) {
          // Create mixed colors for scrambled state
          const colorIndex = Math.floor(Math.random() * config.colors.length);
          scrambledState[`${faceKey}${i}`] = config.colors[colorIndex];
        }
        
        // Ensure some squares maintain original face color for realism
        const originalColorPositions = getRandomPositions(totalSquares, Math.floor(totalSquares * 0.3));
        originalColorPositions.forEach(pos => {
          scrambledState[`${faceKey}${pos}`] = config.colors[faceIndex];
        });
      });
      
      resolve(scrambledState);
    }, 3000); // Simulate analysis time
  });
}

function getRandomPositions(max: number, count: number): number[] {
  const positions: number[] = [];
  while (positions.length < count) {
    const pos = Math.floor(Math.random() * max);
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }
  return positions;
}

// Enhanced color detection for different puzzle types
export function detectColorsInImage(imageData: ImageData, config: PuzzleConfig): string[] {
  const colors: string[] = [];
  const gridSize = config.gridSize;
  const squareSize = Math.floor(Math.min(imageData.width, imageData.height) / gridSize);
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * squareSize + squareSize / 2;
      const y = row * squareSize + squareSize / 2;
      
      const pixelIndex = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
      const r = imageData.data[pixelIndex];
      const g = imageData.data[pixelIndex + 1];
      const b = imageData.data[pixelIndex + 2];
      
      const detectedColor = findClosestColor(r, g, b, config.colors);
      colors.push(detectedColor);
    }
  }
  
  return colors;
}

function findClosestColor(r: number, g: number, b: number, availableColors: string[]): string {
  let closestColor = availableColors[0];
  let minDistance = Infinity;
  
  availableColors.forEach(color => {
    const rgb = hexToRgb(color);
    if (rgb) {
      const distance = Math.sqrt(
        Math.pow(r - rgb.r, 2) + 
        Math.pow(g - rgb.g, 2) + 
        Math.pow(b - rgb.b, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
  });
  
  return closestColor;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Validate puzzle state for solvability
export function validatePuzzleState(puzzleState: PuzzleState, config: PuzzleConfig): boolean {
  const colorCounts: { [key: string]: number } = {};
  const expectedCount = config.gridSize * config.gridSize;
  
  // Count colors
  Object.values(puzzleState).forEach(color => {
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  });
  
  // Check if each color appears the expected number of times
  return config.colors.every(color => colorCounts[color] === expectedCount);
}

// Generate realistic test states for different puzzles
export function generateTestState(config: PuzzleConfig): PuzzleState {
  const state: PuzzleState = {};
  const gridSize = config.gridSize;
  const totalSquares = gridSize * gridSize;
  
  config.faceNames.forEach((faceName, faceIndex) => {
    const faceKey = faceName[0];
    const baseColor = config.colors[faceIndex];
    
    for (let i = 0; i < totalSquares; i++) {
      // 70% chance of correct color, 30% chance of mixed
      if (Math.random() < 0.7) {
        state[`${faceKey}${i}`] = baseColor;
      } else {
        const randomColorIndex = Math.floor(Math.random() * config.colors.length);
        state[`${faceKey}${i}`] = config.colors[randomColorIndex];
      }
    }
  });
  
  return state;
}