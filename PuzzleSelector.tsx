import React from 'react';
import { Cuboid as Cube, Pyramid, Carrot as Mirror, Star, Zap, Trophy, Play, Upload } from 'lucide-react';
import { PuzzleType, PuzzleConfig } from '../types/cube';

interface PuzzleSelectorProps {
  selectedPuzzle: PuzzleType | null;
  onPuzzleSelect: (puzzle: PuzzleType) => void;
  onPlayModeSelect: (puzzle: PuzzleType) => void;
}

const puzzleConfigs: PuzzleConfig[] = [
  {
    id: '2x2',
    name: '2×2 Pocket Cube',
    description: 'Perfect for beginners - fewer pieces, faster solves',
    faces: 6,
    faceNames: ['Front', 'Back', 'Right', 'Left', 'Up', 'Down'],
    gridSize: 2,
    icon: '🎲',
    colors: ['#ff6b35', '#d63031', '#00b894', '#0984e3', '#fdcb6e', '#ffffff'],
    difficulty: 'Beginner'
  },
  {
    id: '3x3',
    name: '3×3 Classic Cube',
    description: 'The original and most popular Rubiks cube',
    faces: 6,
    faceNames: ['Front', 'Back', 'Right', 'Left', 'Up', 'Down'],
    gridSize: 3,
    icon: '🧩',
    colors: ['#ff6b35', '#d63031', '#00b894', '#0984e3', '#fdcb6e', '#ffffff'],
    difficulty: 'Intermediate'
  },
  {
    id: '4x4',
    name: '4×4 Revenge Cube',
    description: 'More complex with additional center pieces',
    faces: 6,
    faceNames: ['Front', 'Back', 'Right', 'Left', 'Up', 'Down'],
    gridSize: 4,
    icon: '🔲',
    colors: ['#ff6b35', '#d63031', '#00b894', '#0984e3', '#fdcb6e', '#ffffff'],
    difficulty: 'Advanced'
  },
  {
    id: '5x5',
    name: '5×5 Professor Cube',
    description: 'The ultimate challenge for cube masters',
    faces: 6,
    faceNames: ['Front', 'Back', 'Right', 'Left', 'Up', 'Down'],
    gridSize: 5,
    icon: '⬛',
    colors: ['#ff6b35', '#d63031', '#00b894', '#0984e3', '#fdcb6e', '#ffffff'],
    difficulty: 'Expert'
  },
  {
    id: 'pyramid',
    name: 'Pyraminx',
    description: 'Triangular puzzle with unique solving mechanics',
    faces: 4,
    faceNames: ['Front', 'Left', 'Right', 'Bottom'],
    gridSize: 3,
    icon: '🔺',
    colors: ['#ff6b35', '#00b894', '#0984e3', '#fdcb6e'],
    difficulty: 'Intermediate'
  },
  {
    id: 'mirror',
    name: 'Mirror Cube',
    description: 'Shape-shifting cube solved by form, not color',
    faces: 6,
    faceNames: ['Front', 'Back', 'Right', 'Left', 'Up', 'Down'],
    gridSize: 3,
    icon: '🪞',
    colors: ['#c0c0c0', '#c0c0c0', '#c0c0c0', '#c0c0c0', '#c0c0c0', '#c0c0c0'],
    difficulty: 'Advanced'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'text-green-400 bg-green-400/20';
    case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
    case 'Advanced': return 'text-orange-400 bg-orange-400/20';
    case 'Expert': return 'text-red-400 bg-red-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

const PuzzleSelector: React.FC<PuzzleSelectorProps> = ({ selectedPuzzle, onPuzzleSelect, onPlayModeSelect }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Cube className="w-8 h-8 text-orange-400 mr-3" />
          <h2 className="text-3xl font-bold text-white">Choose Your Puzzle</h2>
        </div>
        <p className="text-gray-300 text-lg">
          Select the type of puzzle and choose your solving method
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {puzzleConfigs.map((puzzle) => (
          <div
            key={puzzle.id}
            className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedPuzzle === puzzle.id
                ? 'ring-2 ring-orange-400 bg-orange-400/10'
                : 'hover:bg-gray-700/30'
            } rounded-xl p-6 border border-gray-600 hover:border-orange-400/50`}
          >
            {selectedPuzzle === puzzle.id && (
              <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1">
                <Trophy className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="text-center mb-4">
              <div className="text-4xl mb-3">{puzzle.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{puzzle.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{puzzle.description}</p>
              
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(puzzle.difficulty)}`}>
                  {puzzle.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Faces:</span>
                <span className="text-white font-semibold">{puzzle.faces}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Grid:</span>
                <span className="text-white font-semibold">{puzzle.gridSize}×{puzzle.gridSize}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Colors:</span>
                <div className="flex gap-1">
                  {puzzle.colors.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-500"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {puzzle.colors.length > 4 && (
                    <span className="text-xs text-gray-400 ml-1">+{puzzle.colors.length - 4}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600 space-y-2">
              <button 
                onClick={() => onPlayModeSelect(puzzle.id)}
                className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Play Mode
              </button>
              <button 
                onClick={() => onPuzzleSelect(puzzle.id)}
                className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Images
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Play className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Play Mode</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Practice with built-in cube structures. Perfect for learning algorithms and practicing without physical cube.
          </p>
          <ul className="text-sm text-purple-200 space-y-1">
            <li>• ✨ Pre-built solved cubes</li>
            <li>• 🔀 One-click scrambling</li>
            <li>• 🎮 Interactive manual controls</li>
            <li>• ⚡ Instant solution generation</li>
          </ul>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Upload className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Upload Images</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Solve your real physical cube by uploading photos of each face for AI analysis.
          </p>
          <ul className="text-sm text-orange-200 space-y-1">
            <li>• 📸 AI-powered image analysis</li>
            <li>• 🎯 Real cube state detection</li>
            <li>• 🔍 Color and pattern recognition</li>
            <li>• 📱 Works with phone camera</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PuzzleSelector;