import React, { useState, useCallback } from 'react';
import { Zap, RotateCcw, ArrowLeft } from 'lucide-react';
import PuzzleSelector from './components/PuzzleSelector';
import FaceImageUpload from './components/FaceImageUpload';
import EnhancedCubeVisualizer from './components/EnhancedCubeVisualizer';
import VideoPlayer from './components/VideoPlayer';
import SolutionDisplay from './components/SolutionDisplay';
import { PuzzleType, PuzzleConfig, FaceImage, PuzzleState, SolutionStep } from './types/cube';
import { solvePuzzle } from './utils/puzzleSolver';
import { analyzePuzzleFromImages } from './utils/imageAnalysis';
import { generateSolvedState, scramblePuzzle } from './utils/cubeGenerator';

const puzzleConfigs: { [key in PuzzleType]: PuzzleConfig } = {
  '2x2': {
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
  '3x3': {
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
  '4x4': {
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
  '5x5': {
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
  'pyramid': {
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
  'mirror': {
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
};

function App() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleType | null>(null);
  const [faceImages, setFaceImages] = useState<FaceImage[]>([]);
  const [puzzleState, setPuzzleState] = useState<PuzzleState | null>(null);
  const [solution, setSolution] = useState<SolutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'select' | 'upload' | 'solve' | 'play'>('select');
  const [playMode, setPlayMode] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);

  const handlePuzzleSelect = useCallback((puzzle: PuzzleType) => {
    setSelectedPuzzle(puzzle);
    const config = puzzleConfigs[puzzle];
    const initialFaceImages: FaceImage[] = config.faceNames.map((faceName) => ({
      face: faceName,
      file: null,
      preview: null,
      analyzed: false
    }));
    setFaceImages(initialFaceImages);
    setCurrentPhase('upload');
  }, []);

  const handlePlayModeSelect = useCallback((puzzle: PuzzleType) => {
    setSelectedPuzzle(puzzle);
    const config = puzzleConfigs[puzzle];
    
    // Generate solved state
    const solvedState = generateSolvedState(config);
    setPuzzleState(solvedState);
    setPlayMode(true);
    setCurrentPhase('play');
  }, []);

  const handleScramble = useCallback(async () => {
    if (!selectedPuzzle || !puzzleState) return;
    
    setIsScrambling(true);
    const config = puzzleConfigs[selectedPuzzle];
    
    // Animate scrambling process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const scrambledState = scramblePuzzle(puzzleState, config);
    setPuzzleState(scrambledState);
    setSolution([]);
    setCurrentStep(0);
    setIsScrambling(false);
  }, [selectedPuzzle, puzzleState]);

  const handleSolvePlayMode = useCallback(async () => {
    if (!selectedPuzzle || !puzzleState) return;
    
    setIsSolving(true);
    const config = puzzleConfigs[selectedPuzzle];
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    const solutionSteps = solvePuzzle(puzzleState, config);
    setSolution(solutionSteps);
    setCurrentStep(0);
    setIsSolving(false);
  }, [selectedPuzzle, puzzleState]);

  const handleImageUpload = useCallback((faceIndex: number, file: File) => {
    const newFaceImages = [...faceImages];
    newFaceImages[faceIndex] = {
      ...newFaceImages[faceIndex],
      file,
      preview: URL.createObjectURL(file),
      analyzed: false
    };
    setFaceImages(newFaceImages);
  }, [faceImages]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedPuzzle) return;
    
    setIsAnalyzing(true);
    try {
      const config = puzzleConfigs[selectedPuzzle];
      const detectedState = await analyzePuzzleFromImages(faceImages, config);
      setPuzzleState(detectedState);
      setIsAnalyzing(false);
      
      setIsSolving(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const solutionSteps = solvePuzzle(detectedState, config);
      setSolution(solutionSteps);
      setCurrentStep(0);
      setIsSolving(false);
      setCurrentPhase('solve');
    } catch (error) {
      console.error('Error analyzing puzzle:', error);
      setIsAnalyzing(false);
      setIsSolving(false);
    }
  }, [selectedPuzzle, faceImages]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleManualMove = (move: string) => {
    // Handle manual cube rotation
    console.log('Manual move:', move);
  };

  const handleReset = () => {
    setSelectedPuzzle(null);
    setFaceImages([]);
    setPuzzleState(null);
    setSolution([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setPlayMode(false);
    setCurrentPhase('select');
  };

  const handleBack = () => {
    if (currentPhase === 'solve' || currentPhase === 'play') {
      setCurrentPhase(playMode ? 'select' : 'upload');
      setPuzzleState(null);
      setSolution([]);
      setCurrentStep(0);
      setIsPlaying(false);
      if (currentPhase === 'play') {
        setPlayMode(false);
      }
    } else if (currentPhase === 'upload') {
      setCurrentPhase('select');
      setSelectedPuzzle(null);
      setFaceImages([]);
    }
  };

  const currentConfig = selectedPuzzle ? puzzleConfigs[selectedPuzzle] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl mr-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              CubeMaster AI Pro
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced multi-puzzle solver supporting 2×2, 3×3, 4×4, 5×5, Pyraminx, and Mirror Cubes with AI-powered analysis and 3D visualization
          </p>
        </div>

        {/* Navigation */}
        {currentPhase !== 'select' && (
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}

        {/* Phase 1: Puzzle Selection */}
        {currentPhase === 'select' && (
          <PuzzleSelector
            selectedPuzzle={selectedPuzzle}
            onPuzzleSelect={handlePuzzleSelect}
            onPlayModeSelect={handlePlayModeSelect}
          />
        )}

        {/* Phase 2: Image Upload */}
        {currentPhase === 'upload' && currentConfig && (
          <div className="max-w-6xl mx-auto">
            <FaceImageUpload
              puzzleConfig={currentConfig}
              faceImages={faceImages}
              onImageUpload={handleImageUpload}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing || isSolving}
            />
          </div>
        )}

        {/* Phase: Play Mode */}
        {currentPhase === 'play' && currentConfig && (
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header with Controls */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  🎮 Play Mode - {currentConfig.name}
                </h2>
                <p className="text-gray-300">
                  Practice solving without uploading images • Interactive 3D cube with manual controls
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleScramble}
                  disabled={isScrambling}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  {isScrambling ? 'Scrambling...' : 'Scramble'}
                </button>
                <button
                  onClick={handleSolvePlayMode}
                  disabled={isSolving || solution.length > 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Zap className="w-5 h-5" />
                  {isSolving ? 'Solving...' : 'Get Solution'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  New Game
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Panel - 3D Cube */}
              <div>
                <EnhancedCubeVisualizer
                  puzzleConfig={currentConfig}
                  puzzleState={puzzleState}
                  currentMove={solution[currentStep]?.move}
                  isPlaying={isPlaying}
                  onMoveComplete={() => {
                    if (isPlaying && currentStep < solution.length - 1) {
                      setTimeout(() => setCurrentStep(currentStep + 1), 800);
                    } else {
                      setIsPlaying(false);
                    }
                  }}
                  onManualMove={handleManualMove}
                  playMode={true}
                />
              </div>

              {/* Right Panel - Controls and Solution */}
              <div className="space-y-6">
                {solution.length > 0 ? (
                  <>
                    <VideoPlayer
                      solution={solution}
                      currentStep={currentStep}
                      isPlaying={isPlaying}
                      onPlayPause={handlePlayPause}
                      onStepChange={handleStepChange}
                      onReset={() => setCurrentStep(0)}
                    />

                    <SolutionDisplay
                      solution={solution}
                      currentStep={currentStep}
                      onStepClick={handleStepChange}
                    />
                  </>
                ) : (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
                    <div className="text-6xl mb-6">🎯</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to Play!</h3>
                    <p className="text-gray-300 mb-6">
                      Your {currentConfig.name} is ready. You can:
                    </p>
                    <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                      <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-300 mb-2">🔀 Scramble</h4>
                        <p className="text-sm text-purple-200">Mix up the cube to create a challenge</p>
                      </div>
                      <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-300 mb-2">🎮 Manual Control</h4>
                        <p className="text-sm text-blue-200">Use buttons or keyboard to rotate faces</p>
                      </div>
                      <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-green-300 mb-2">⚡ Get Solution</h4>
                        <p className="text-sm text-green-200">Generate step-by-step solving guide</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Solution Display */}
        {currentPhase === 'solve' && currentConfig && !playMode && (
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header with Reset Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentConfig.name} Solution
                </h2>
                <p className="text-gray-300">
                  {solution.length} moves • Interactive 3D visualization with manual controls
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                New Puzzle
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Panel - Controls and Solution */}
              <div className="space-y-6">
                <VideoPlayer
                  solution={solution}
                  currentStep={currentStep}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onStepChange={handleStepChange}
                  onReset={() => setCurrentStep(0)}
                />

                <SolutionDisplay
                  solution={solution}
                  currentStep={currentStep}
                  onStepClick={handleStepChange}
                />
              </div>

              {/* Right Panel - 3D Visualization */}
              <div>
                <EnhancedCubeVisualizer
                  puzzleConfig={currentConfig}
                  puzzleState={puzzleState}
                  currentMove={solution[currentStep]?.move}
                  isPlaying={isPlaying}
                  onMoveComplete={() => {
                    if (isPlaying && currentStep < solution.length - 1) {
                      setTimeout(() => setCurrentStep(currentStep + 1), 800);
                    } else {
                      setIsPlaying(false);
                    }
                  }}
                  onManualMove={handleManualMove}
                  playMode={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Features Grid - Only show on select phase */}
        {currentPhase === 'select' && (
          <div className="mt-16 grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Puzzle Support</h3>
              <p className="text-gray-300 text-sm">Support for 6 different puzzle types with specialized algorithms</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Image Analysis</h3>
              <p className="text-gray-300 text-sm">AI-powered face detection with color and pattern recognition</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-lg font-semibold text-white mb-2">Interactive 3D</h3>
              <p className="text-gray-300 text-sm">Real-time 3D visualization with manual control options</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Advanced Algorithms</h3>
              <p className="text-gray-300 text-sm">Optimized solving algorithms for each puzzle type</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;