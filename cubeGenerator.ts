import { PuzzleState, PuzzleConfig } from '../types/cube';

export function generateSolvedState(config: PuzzleConfig): PuzzleState {
  const state: PuzzleState = {};
  const gridSize = config.gridSize;
  const totalSquares = gridSize * gridSize;
  
  // Generate solved state where each face has its own color
  config.faceNames.forEach((faceName, faceIndex) => {
    const faceKey = faceName[0]; // F, B, R, L, U, D
    const faceColor = config.colors[faceIndex];
    
    for (let i = 0; i < totalSquares; i++) {
      state[`${faceKey}${i}`] = faceColor;
    }
  });
  
  return state;
}

export function scramblePuzzle(solvedState: PuzzleState, config: PuzzleConfig): PuzzleState {
  const scrambledState = { ...solvedState };
  const gridSize = config.gridSize;
  const totalSquares = gridSize * gridSize;
  
  // Create a realistic scrambled state by mixing colors between faces
  config.faceNames.forEach((faceName, faceIndex) => {
    const faceKey = faceName[0];
    
    // For each square on this face, randomly assign colors from available colors
    for (let i = 0; i < totalSquares; i++) {
      // 60% chance to keep original color, 40% chance to use random color
      if (Math.random() < 0.4) {
        const randomColorIndex = Math.floor(Math.random() * config.colors.length);
        scrambledState[`${faceKey}${i}`] = config.colors[randomColorIndex];
      }
    }
    
    // Ensure at least some squares maintain the original face color for realism
    const originalColorPositions = getRandomPositions(totalSquares, Math.floor(totalSquares * 0.3));
    originalColorPositions.forEach(pos => {
      scrambledState[`${faceKey}${pos}`] = config.colors[faceIndex];
    });
  });
  
  return scrambledState;
}

export function generateRandomScramble(config: PuzzleConfig): string[] {
  const moves = ['R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'"];
  const scrambleMoves: string[] = [];
  const scrambleLength = Math.min(25, config.gridSize * 5); // Longer scrambles for bigger cubes
  
  let lastMove = '';
  let lastAxis = '';
  
  for (let i = 0; i < scrambleLength; i++) {
    let validMoves = moves.filter(move => {
      const moveAxis = move[0];
      // Avoid consecutive moves on same face or opposite faces
      if (moveAxis === lastMove[0]) return false;
      if (getOppositeAxis(moveAxis) === lastAxis) return false;
      return true;
    });
    
    if (validMoves.length === 0) validMoves = moves;
    
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    scrambleMoves.push(randomMove);
    lastMove = randomMove;
    lastAxis = randomMove[0];
  }
  
  return scrambleMoves;
}

export function applyScrambleToState(state: PuzzleState, scrambleMoves: string[], config: PuzzleConfig): PuzzleState {
  let currentState = { ...state };
  
  // Simulate applying scramble moves to create realistic mixed state
  scrambleMoves.forEach(move => {
    currentState = simulateMove(currentState, move, config);
  });
  
  return currentState;
}

function simulateMove(state: PuzzleState, move: string, config: PuzzleConfig): PuzzleState {
  const newState = { ...state };
  const face = move[0];
  const isCounterClockwise = move.includes("'");
  const gridSize = config.gridSize;
  
  // Simulate face rotation by shuffling colors within the face
  const faceSquares = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    faceSquares.push(newState[`${face}${i}`]);
  }
  
  // Rotate the face colors
  const rotatedSquares = isCounterClockwise ? 
    rotateArrayCounterClockwise(faceSquares, gridSize) : 
    rotateArrayClockwise(faceSquares, gridSize);
  
  // Apply rotated colors back
  for (let i = 0; i < gridSize * gridSize; i++) {
    newState[`${face}${i}`] = rotatedSquares[i];
  }
  
  return newState;
}

function rotateArrayClockwise(arr: string[], gridSize: number): string[] {
  const rotated = new Array(arr.length);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const oldIndex = i * gridSize + j;
      const newIndex = j * gridSize + (gridSize - 1 - i);
      rotated[newIndex] = arr[oldIndex];
    }
  }
  return rotated;
}

function rotateArrayCounterClockwise(arr: string[], gridSize: number): string[] {
  const rotated = new Array(arr.length);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const oldIndex = i * gridSize + j;
      const newIndex = (gridSize - 1 - j) * gridSize + i;
      rotated[newIndex] = arr[oldIndex];
    }
  }
  return rotated;
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

function getOppositeAxis(axis: string): string {
  const opposites: { [key: string]: string } = {
    'R': 'L', 'L': 'R',
    'U': 'D', 'D': 'U',
    'F': 'B', 'B': 'F'
  };
  return opposites[axis] || '';
}

// Generate practice patterns for learning
export function generatePracticePattern(config: PuzzleConfig, pattern: 'cross' | 'corners' | 'edges'): PuzzleState {
  const state = generateSolvedState(config);
  
  switch (pattern) {
    case 'cross':
      return generateCrossPattern(state, config);
    case 'corners':
      return generateCornerPattern(state, config);
    case 'edges':
      return generateEdgePattern(state, config);
    default:
      return state;
  }
}

function generateCrossPattern(state: PuzzleState, config: PuzzleConfig): PuzzleState {
  const newState = { ...state };
  const gridSize = config.gridSize;
  const center = Math.floor(gridSize / 2);
  
  // Mix up everything except the cross pattern on top face
  config.faceNames.forEach((faceName, faceIndex) => {
    const faceKey = faceName[0];
    
    if (faceKey === 'U') {
      // Keep cross pattern on top face
      for (let i = 0; i < gridSize * gridSize; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        
        // Keep center and cross edges
        if ((row === center && col === center) || 
            (row === center && col !== center) || 
            (col === center && row !== center)) {
          // Keep original color
        } else {
          // Mix other squares
          const randomColorIndex = Math.floor(Math.random() * config.colors.length);
          newState[`${faceKey}${i}`] = config.colors[randomColorIndex];
        }
      }
    } else {
      // Mix other faces
      for (let i = 0; i < gridSize * gridSize; i++) {
        if (Math.random() < 0.7) {
          const randomColorIndex = Math.floor(Math.random() * config.colors.length);
          newState[`${faceKey}${i}`] = config.colors[randomColorIndex];
        }
      }
    }
  });
  
  return newState;
}

function generateCornerPattern(state: PuzzleState, config: PuzzleConfig): PuzzleState {
  const newState = { ...state };
  const gridSize = config.gridSize;
  
  // Mix everything except corners
  config.faceNames.forEach((faceName, faceIndex) => {
    const faceKey = faceName[0];
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Check if it's a corner position
      const isCorner = (row === 0 || row === gridSize - 1) && (col === 0 || col === gridSize - 1);
      
      if (!isCorner) {
        const randomColorIndex = Math.floor(Math.random() * config.colors.length);
        newState[`${faceKey}${i}`] = config.colors[randomColorIndex];
      }
    }
  });
  
  return newState;
}

function generateEdgePattern(state: PuzzleState, config: PuzzleConfig): PuzzleState {
  const newState = { ...state };
  const gridSize = config.gridSize;
  const center = Math.floor(gridSize / 2);
  
  // Mix everything except edge pieces
  config.faceNames.forEach((faceName, faceIndex) => {
    const faceKey = faceName[0];
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Check if it's an edge position (not corner, not center)
      const isEdge = ((row === 0 || row === gridSize - 1) && col === center) ||
                     ((col === 0 || col === gridSize - 1) && row === center);
      
      if (!isEdge && !(row === center && col === center)) {
        const randomColorIndex = Math.floor(Math.random() * config.colors.length);
        newState[`${faceKey}${i}`] = config.colors[randomColorIndex];
      }
    }
  });
  
  return newState;
}