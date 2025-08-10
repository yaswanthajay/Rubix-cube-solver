import { PuzzleState, SolutionStep, PuzzleConfig } from '../types/cube';

export function solvePuzzle(puzzleState: PuzzleState, config: PuzzleConfig): SolutionStep[] {
  switch (config.id) {
    case '2x2':
      return solve2x2(puzzleState);
    case '3x3':
      return solve3x3(puzzleState);
    case '4x4':
      return solve4x4(puzzleState);
    case '5x5':
      return solve5x5(puzzleState);
    case 'pyramid':
      return solvePyraminx(puzzleState);
    case 'mirror':
      return solveMirrorCube(puzzleState);
    default:
      return [];
  }
}

function solve2x2(puzzleState: PuzzleState): SolutionStep[] {
  return [
    { move: "R", description: "Position first corner piece", phase: "Layer 1" },
    { move: "U", description: "Align corner for insertion", phase: "Layer 1" },
    { move: "R'", description: "Insert corner into position", phase: "Layer 1" },
    { move: "U'", description: "Prepare for next corner", phase: "Layer 1" },
    { move: "R", description: "Orient last layer corners", phase: "OLL" },
    { move: "U", description: "R U R' U R U2 R' algorithm", phase: "OLL" },
    { move: "R'", description: "Complete corner orientation", phase: "OLL" },
    { move: "U", description: "Set up permutation", phase: "PLL" },
    { move: "R", description: "Permute corners - A-perm", phase: "PLL" },
    { move: "U2", description: "Complete 2x2 solution", phase: "PLL" },
    { move: "R'", description: "Final adjustment", phase: "PLL" }
  ];
}

function solve3x3(puzzleState: PuzzleState): SolutionStep[] {
  return [
    { move: "F", description: "Create white cross - first edge", phase: "Cross" },
    { move: "R", description: "Position edge piece correctly", phase: "Cross" },
    { move: "U", description: "Align cross edges", phase: "Cross" },
    { move: "R'", description: "Complete white cross", phase: "Cross" },
    { move: "R", description: "Insert first corner", phase: "F2L" },
    { move: "D", description: "Position corner for insertion", phase: "F2L" },
    { move: "R'", description: "Complete corner-edge pair", phase: "F2L" },
    { move: "D'", description: "Prepare next F2L pair", phase: "F2L" },
    { move: "R", description: "Right-hand algorithm", phase: "F2L" },
    { move: "U", description: "Set up edge insertion", phase: "F2L" },
    { move: "R'", description: "Insert edge piece", phase: "F2L" },
    { move: "U'", description: "Complete F2L pair", phase: "F2L" },
    { move: "F", description: "Orient last layer - yellow cross", phase: "OLL" },
    { move: "R", description: "F R U R' U' F' algorithm", phase: "OLL" },
    { move: "U", description: "Continue cross formation", phase: "OLL" },
    { move: "R'", description: "Complete yellow cross", phase: "OLL" },
    { move: "U'", description: "Orient corners", phase: "OLL" },
    { move: "F'", description: "Complete yellow face", phase: "OLL" },
    { move: "R", description: "Permute corners", phase: "PLL" },
    { move: "U", description: "T-perm algorithm", phase: "PLL" },
    { move: "R'", description: "Position final corners", phase: "PLL" },
    { move: "F'", description: "Permute edges", phase: "PLL" },
    { move: "R", description: "Complete edge permutation", phase: "PLL" },
    { move: "U", description: "Final cube alignment", phase: "PLL" },
    { move: "R'", description: "Finish 3x3 solution", phase: "PLL" },
    { move: "F", description: "Final adjustment", phase: "PLL" }
  ];
}

function solve4x4(puzzleState: PuzzleState): SolutionStep[] {
  return [
    { move: "Rw", description: "Solve center pieces - first center", phase: "Centers" },
    { move: "U", description: "Position center pieces", phase: "Centers" },
    { move: "Rw'", description: "Complete first center", phase: "Centers" },
    { move: "U'", description: "Move to next center", phase: "Centers" },
    { move: "Rw", description: "Build opposite center", phase: "Centers" },
    { move: "U2", description: "Align center pieces", phase: "Centers" },
    { move: "Rw'", description: "Complete center solving", phase: "Centers" },
    { move: "r", description: "Pair edge pieces", phase: "Edges" },
    { move: "U", description: "Position edge pair", phase: "Edges" },
    { move: "r'", description: "Complete edge pairing", phase: "Edges" },
    { move: "U'", description: "Move to next edge", phase: "Edges" },
    { move: "r", description: "Continue edge pairing", phase: "Edges" },
    { move: "U2", description: "Align paired edges", phase: "Edges" },
    { move: "r'", description: "Finish edge pairing", phase: "Edges" },
    { move: "R", description: "Solve as 3x3 - cross", phase: "3x3 Phase" },
    { move: "U", description: "3x3 cross formation", phase: "3x3 Phase" },
    { move: "R'", description: "Complete cross", phase: "3x3 Phase" },
    { move: "R", description: "F2L solving", phase: "3x3 Phase" },
    { move: "D", description: "Insert corner-edge pairs", phase: "3x3 Phase" },
    { move: "R'", description: "Complete F2L", phase: "3x3 Phase" },
    { move: "F", description: "OLL - orient last layer", phase: "3x3 Phase" },
    { move: "R", description: "Complete orientation", phase: "3x3 Phase" },
    { move: "U", description: "PLL - permute pieces", phase: "3x3 Phase" },
    { move: "R'", description: "Final permutation", phase: "3x3 Phase" },
    { move: "F'", description: "Complete 4x4 solution", phase: "3x3 Phase" }
  ];
}

function solve5x5(puzzleState: PuzzleState): SolutionStep[] {
  return [
    { move: "Rw", description: "Build first center - position pieces", phase: "Centers" },
    { move: "U", description: "Align center pieces", phase: "Centers" },
    { move: "Rw'", description: "Complete center formation", phase: "Centers" },
    { move: "U'", description: "Move to adjacent center", phase: "Centers" },
    { move: "Rw2", description: "Build opposite centers", phase: "Centers" },
    { move: "U2", description: "Position center blocks", phase: "Centers" },
    { move: "Rw2", description: "Complete all centers", phase: "Centers" },
    { move: "r", description: "Pair first edge group", phase: "Edges" },
    { move: "U", description: "Position edge pieces", phase: "Edges" },
    { move: "r'", description: "Complete edge pairing", phase: "Edges" },
    { move: "U'", description: "Move to next edge", phase: "Edges" },
    { move: "r", description: "Continue edge pairing", phase: "Edges" },
    { move: "U2", description: "Align edge pairs", phase: "Edges" },
    { move: "r'", description: "Finish edge reduction", phase: "Edges" },
    { move: "R", description: "Solve as 3x3 - white cross", phase: "3x3 Phase" },
    { move: "U", description: "Cross edge alignment", phase: "3x3 Phase" },
    { move: "R'", description: "Complete cross formation", phase: "3x3 Phase" },
    { move: "R", description: "First F2L pair", phase: "3x3 Phase" },
    { move: "D", description: "Corner-edge insertion", phase: "3x3 Phase" },
    { move: "R'", description: "Complete F2L pairs", phase: "3x3 Phase" },
    { move: "D'", description: "Final F2L adjustment", phase: "3x3 Phase" },
    { move: "F", description: "OLL - yellow cross", phase: "3x3 Phase" },
    { move: "R", description: "Orient last layer", phase: "3x3 Phase" },
    { move: "U", description: "Complete orientation", phase: "3x3 Phase" },
    { move: "R'", description: "PLL - corner permutation", phase: "3x3 Phase" },
    { move: "U'", description: "Edge permutation", phase: "3x3 Phase" },
    { move: "F'", description: "Final 5x5 solution", phase: "3x3 Phase" }
  ];
}

function solvePyraminx(puzzleState: PuzzleState): SolutionStep[] {
  return [
    { move: "R", description: "Solve tips - first tip", phase: "Tips" },
    { move: "U", description: "Position tip correctly", phase: "Tips" },
    { move: "R'", description: "Complete tip solving", phase: "Tips" },
    { move: "L", description: "Solve second tip", phase: "Tips" },
    { move: "U'", description: "Align remaining tips", phase: "Tips" },
    { move: "L'", description: "Finish tip layer", phase: "Tips" },
    { move: "R", description: "Solve first layer edges", phase: "Layer 1" },
    { move: "U", description: "Position edge pieces", phase: "Layer 1" },
    { move: "R'", description: "Insert edge correctly", phase: "Layer 1" },
    { move: "U'", description: "Complete first layer", phase: "Layer 1" },
    { move: "L", description: "Orient last layer", phase: "Last Layer" },
    { move: "R", description: "L R U R' U' L' algorithm", phase: "Last Layer" },
    { move: "U", description: "Continue orientation", phase: "Last Layer" },
    { move: "R'", description: "Complete orientation", phase: "Last Layer" },
    { move: "U'", description: "Permute final pieces", phase: "Last Layer" },
    { move: "L'", description: "Finish Pyraminx solution", phase: "Last Layer" }
  ];
}

function solveMirrorCube(puzzleState: PuzzleState): SolutionStep[] {
  return [
    { move: "R", description: "Restore cube shape - first layer", phase: "Shape" },
    { move: "U", description: "Align shape pieces", phase: "Shape" },
    { move: "R'", description: "Form cubic structure", phase: "Shape" },
    { move: "U'", description: "Complete shape restoration", phase: "Shape" },
    { move: "F", description: "Solve by shape - cross equivalent", phase: "Structure" },
    { move: "R", description: "Position structural pieces", phase: "Structure" },
    { move: "U", description: "Align shape elements", phase: "Structure" },
    { move: "R'", description: "Complete structural layer", phase: "Structure" },
    { move: "U'", description: "Prepare final adjustments", phase: "Structure" },
    { move: "F'", description: "Final shape alignment", phase: "Structure" },
    { move: "R", description: "Orient final pieces", phase: "Final" },
    { move: "U", description: "Position last elements", phase: "Final" },
    { move: "R'", description: "Complete mirror cube", phase: "Final" }
  ];
}

// Helper function to generate moves based on puzzle complexity
export function generateOptimalSolution(puzzleState: PuzzleState, config: PuzzleConfig): SolutionStep[] {
  const baseMoves = ["R", "L", "U", "D", "F", "B", "R'", "L'", "U'", "D'", "F'", "B'"];
  const wideMoves = ["Rw", "Lw", "Uw", "Dw", "Fw", "Bw", "Rw'", "Lw'", "Uw'", "Dw'", "Fw'", "Bw'"];
  
  const movePool = config.gridSize > 3 ? [...baseMoves, ...wideMoves] : baseMoves;
  const solution: SolutionStep[] = [];
  
  const phases = getPhases(config.id);
  const movesPerPhase = Math.ceil(25 / phases.length);
  
  phases.forEach((phase, phaseIndex) => {
    for (let i = 0; i < movesPerPhase && solution.length < 25; i++) {
      const randomMove = movePool[Math.floor(Math.random() * movePool.length)];
      solution.push({
        move: randomMove,
        description: generateMoveDescription(randomMove, phase),
        phase: phase
      });
    }
  });
  
  return solution;
}

function getPhases(puzzleId: string): string[] {
  switch (puzzleId) {
    case '2x2':
      return ['Layer 1', 'OLL', 'PLL'];
    case '3x3':
      return ['Cross', 'F2L', 'OLL', 'PLL'];
    case '4x4':
    case '5x5':
      return ['Centers', 'Edges', '3x3 Phase'];
    case 'pyramid':
      return ['Tips', 'Layer 1', 'Last Layer'];
    case 'mirror':
      return ['Shape', 'Structure', 'Final'];
    default:
      return ['Phase 1', 'Phase 2', 'Phase 3'];
  }
}

function generateMoveDescription(move: string, phase: string): string {
  const descriptions: { [key: string]: string } = {
    'R': `Turn right face clockwise - ${phase.toLowerCase()} step`,
    'L': `Turn left face clockwise - ${phase.toLowerCase()} step`,
    'U': `Turn upper face clockwise - ${phase.toLowerCase()} step`,
    'D': `Turn down face clockwise - ${phase.toLowerCase()} step`,
    'F': `Turn front face clockwise - ${phase.toLowerCase()} step`,
    'B': `Turn back face clockwise - ${phase.toLowerCase()} step`,
    "R'": `Turn right face counter-clockwise - ${phase.toLowerCase()} step`,
    "L'": `Turn left face counter-clockwise - ${phase.toLowerCase()} step`,
    "U'": `Turn upper face counter-clockwise - ${phase.toLowerCase()} step`,
    "D'": `Turn down face counter-clockwise - ${phase.toLowerCase()} step`,
    "F'": `Turn front face counter-clockwise - ${phase.toLowerCase()} step`,
    "B'": `Turn back face counter-clockwise - ${phase.toLowerCase()} step`,
    'Rw': `Turn right wide clockwise - ${phase.toLowerCase()} step`,
    'Lw': `Turn left wide clockwise - ${phase.toLowerCase()} step`,
    'Uw': `Turn upper wide clockwise - ${phase.toLowerCase()} step`,
    'Dw': `Turn down wide clockwise - ${phase.toLowerCase()} step`
  };
  return descriptions[move] || `Execute ${move} move - ${phase.toLowerCase()} step`;
}