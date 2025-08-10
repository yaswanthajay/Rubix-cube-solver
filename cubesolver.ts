import { CubeState, SolutionStep } from '../types/cube';

export function solveCube(cubeState: CubeState): SolutionStep[] {
  // This is a simplified solving algorithm for demonstration
  // In a real implementation, you would use algorithms like CFOP, Roux, or ZZ
  
  const solution: SolutionStep[] = [];
  
  // Phase 1: White Cross
  solution.push(
    { move: "F", description: "Create white cross - position first edge", phase: "Cross" },
    { move: "R", description: "Create white cross - position second edge", phase: "Cross" },
    { move: "U", description: "Create white cross - align third edge", phase: "Cross" },
    { move: "R'", description: "Create white cross - complete cross formation", phase: "Cross" }
  );
  
  // Phase 2: White Corners
  solution.push(
    { move: "R", description: "Insert first white corner", phase: "F2L" },
    { move: "D", description: "Position corner for insertion", phase: "F2L" },
    { move: "R'", description: "Complete corner insertion", phase: "F2L" },
    { move: "D'", description: "Prepare for next corner", phase: "F2L" }
  );
  
  // Phase 3: Middle Layer
  solution.push(
    { move: "R", description: "Right hand algorithm start", phase: "F2L" },
    { move: "U", description: "Set up edge piece", phase: "F2L" },
    { move: "R'", description: "Right hand algorithm", phase: "F2L" },
    { move: "U'", description: "Complete edge insertion", phase: "F2L" },
    { move: "F'", description: "Front face preparation", phase: "F2L" },
    { move: "U'", description: "Left hand algorithm start", phase: "F2L" },
    { move: "F", description: "Complete left hand algorithm", phase: "F2L" }
  );
  
  // Phase 4: Yellow Cross (OLL)
  solution.push(
    { move: "F", description: "Orient last layer - create yellow cross", phase: "OLL" },
    { move: "R", description: "F R U R' U' F' algorithm", phase: "OLL" },
    { move: "U", description: "Continue yellow cross formation", phase: "OLL" },
    { move: "R'", description: "Complete cross orientation", phase: "OLL" },
    { move: "U'", description: "Prepare for corner orientation", phase: "OLL" },
    { move: "F'", description: "Finish yellow cross", phase: "OLL" }
  );
  
  // Phase 5: Yellow Face (OLL)
  solution.push(
    { move: "R", description: "Orient all yellow pieces", phase: "OLL" },
    { move: "U", description: "R U R' U R U2 R' algorithm", phase: "OLL" },
    { move: "R'", description: "Continue orientation", phase: "OLL" },
    { move: "U", description: "Set up for final orientation", phase: "OLL" },
    { move: "R", description: "Complete yellow face", phase: "OLL" },
    { move: "U2", description: "Final orientation adjustment", phase: "OLL" },
    { move: "R'", description: "Finish OLL phase", phase: "OLL" }
  );
  
  // Phase 6: Permute Last Layer (PLL)
  solution.push(
    { move: "R", description: "Position corners correctly", phase: "PLL" },
    { move: "U", description: "A-perm or T-perm algorithm", phase: "PLL" },
    { move: "R'", description: "Adjust corner positions", phase: "PLL" },
    { move: "F'", description: "Set up edge permutation", phase: "PLL" },
    { move: "R", description: "Execute edge 3-cycle", phase: "PLL" },
    { move: "U", description: "Complete permutation", phase: "PLL" },
    { move: "R'", description: "Finish edge positioning", phase: "PLL" },
    { move: "F", description: "Final cube adjustment", phase: "PLL" }
  );
  
  return solution;
}

// Helper function to generate random scrambled solution for demo
export function generateScrambledSolution(): SolutionStep[] {
  const moves = ["R", "L", "U", "D", "F", "B", "R'", "L'", "U'", "D'", "F'", "B'", "R2", "L2", "U2", "D2", "F2", "B2"];
  const solution: SolutionStep[] = [];
  
  for (let i = 0; i < 20; i++) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    solution.push({
      move: randomMove,
      description: getMoveDescription(randomMove),
      phase: getPhaseForMove(i)
    });
  }
  
  return solution;
}

function getMoveDescription(move: string): string {
  const descriptions: { [key: string]: string } = {
    'R': 'Turn right face clockwise 90°',
    'L': 'Turn left face clockwise 90°',
    'U': 'Turn upper face clockwise 90°',
    'D': 'Turn down face clockwise 90°',
    'F': 'Turn front face clockwise 90°',
    'B': 'Turn back face clockwise 90°',
    "R'": 'Turn right face counter-clockwise 90°',
    "L'": 'Turn left face counter-clockwise 90°',
    "U'": 'Turn upper face counter-clockwise 90°',
    "D'": 'Turn down face counter-clockwise 90°',
    "F'": 'Turn front face counter-clockwise 90°',
    "B'": 'Turn back face counter-clockwise 90°',
    'R2': 'Turn right face 180°',
    'L2': 'Turn left face 180°',
    'U2': 'Turn upper face 180°',
    'D2': 'Turn down face 180°',
    'F2': 'Turn front face 180°',
    'B2': 'Turn back face 180°'
  };
  return descriptions[move] || 'Unknown move';
}

function getPhaseForMove(index: number): string {
  if (index < 4) return 'Cross';
  if (index < 10) return 'F2L';
  if (index < 15) return 'OLL';
  return 'PLL';
}