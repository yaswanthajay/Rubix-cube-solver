export interface CubeState {
  // Front face (Orange)
  F0: string; F1: string; F2: string;
  F3: string; F4: string; F5: string;
  F6: string; F7: string; F8: string;
  
  // Back face (Red)
  B0: string; B1: string; B2: string;
  B3: string; B4: string; B5: string;
  B6: string; B7: string; B8: string;
  
  // Right face (Green)
  R0: string; R1: string; R2: string;
  R3: string; R4: string; R5: string;
  R6: string; R7: string; R8: string;
  
  // Left face (Blue)
  L0: string; L1: string; L2: string;
  L3: string; L4: string; L5: string;
  L6: string; L7: string; L8: string;
  
  // Upper face (Yellow)
  U0: string; U1: string; U2: string;
  U3: string; U4: string; U5: string;
  U6: string; U7: string; U8: string;
  
  // Down face (White)
  D0: string; D1: string; D2: string;
  D3: string; D4: string; D5: string;
  D6: string; D7: string; D8: string;
}

export interface Move {
  face: 'R' | 'L' | 'U' | 'D' | 'F' | 'B';
  direction: 'clockwise' | 'counter-clockwise';
  notation: string;
}

export interface SolutionStep {
  move: string;
  description: string;
  phase: string;
}

export interface CubeColors {
  white: string;
  yellow: string;
  red: string;
  orange: string;
  blue: string;
  green: string;
}

export type PuzzleType = '2x2' | '3x3' | '4x4' | '5x5' | 'pyramid' | 'mirror';

export interface PuzzleConfig {
  id: PuzzleType;
  name: string;
  description: string;
  faces: number;
  faceNames: string[];
  gridSize: number;
  icon: string;
  colors: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface FaceImage {
  face: string;
  file: File | null;
  preview: string | null;
  analyzed: boolean;
}

export interface PuzzleState {
  [key: string]: string;
}