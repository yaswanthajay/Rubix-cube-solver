import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCw, MousePointer, Keyboard, Maximize } from 'lucide-react';
import { PuzzleConfig, PuzzleState, Move } from '../types/cube';

interface EnhancedCubeVisualizerProps {
  puzzleConfig: PuzzleConfig;
  puzzleState: PuzzleState | null;
  currentMove?: string;
  isPlaying: boolean;
  onMoveComplete?: () => void;
  onManualMove?: (move: string) => void;
  playMode?: boolean;
}

const EnhancedCubeVisualizer: React.FC<EnhancedCubeVisualizerProps> = ({
  puzzleConfig,
  puzzleState,
  currentMove,
  isPlaying,
  onMoveComplete,
  onManualMove,
  playMode = false
}) => {
  const [rotation, setRotation] = useState({ x: -15, y: 45 });
  const [animatingFace, setAnimatingFace] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [cubeSize, setCubeSize] = useState('normal');
  const [lastExecutedMove, setLastExecutedMove] = useState<string>('');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!manualMode || isPlaying) return;
      
      const keyMoves: { [key: string]: string } = {
        'r': 'R', 'R': "R'",
        'l': 'L', 'L': "L'",
        'u': 'U', 'U': "U'",
        'd': 'D', 'D': "D'",
        'f': 'F', 'F': "F'",
        'b': 'B', 'B': "B'"
      };
      
      if (keyMoves[e.key]) {
        e.preventDefault();
        executeMove(keyMoves[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [manualMode, isPlaying]);
  useEffect(() => {
    if (currentMove && isPlaying) {
      setAnimatingFace(currentMove[0]);
      setTimeout(() => {
        setAnimatingFace(null);
        onMoveComplete?.();
      }, 1000);
    }
  }, [currentMove, isPlaying, onMoveComplete]);

  const executeMove = (move: string) => {
    setLastExecutedMove(move);
    setMoveHistory(prev => [...prev.slice(-9), move]); // Keep last 10 moves
    setAnimatingFace(move[0]);
    onManualMove?.(move);
    
    setTimeout(() => {
      setAnimatingFace(null);
    }, 800);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPlaying && !manualMode && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      setRotation({
        x: -15 + (mouseY / rect.height) * 40,
        y: 45 + (mouseX / rect.width) * 80
      });
    }
  };

  const getFaceColor = (face: string, position: number): string => {
    if (!puzzleState) {
      return puzzleConfig.colors[0] || '#6c5ce7';
    }
    return puzzleState[`${face}${position}`] || puzzleConfig.colors[0];
  };

  const getCubeSize = () => {
    const baseSize = cubeSize === 'large' ? 350 : cubeSize === 'xlarge' ? 450 : 280;
    return baseSize + puzzleConfig.gridSize * 15;
  };
  const renderFace = (face: string, faceClass: string, faceIndex: number) => {
    const isAnimating = animatingFace === face;
    const gridSize = puzzleConfig.gridSize;
    const cubeActualSize = getCubeSize();
    
    const squares = Array.from({ length: gridSize * gridSize }, (_, i) => (
      <div
        key={i}
        className={`cube-square transition-all duration-800 ${
          isAnimating ? 'animate-pulse scale-110 shadow-2xl' : ''
        }`}
        style={{ 
          backgroundColor: getFaceColor(face, i),
          border: `${Math.max(2, cubeActualSize / 100)}px solid rgba(0,0,0,0.4)`,
          borderRadius: `${Math.max(3, cubeActualSize / 80)}px`,
          boxShadow: isAnimating 
            ? `0 0 ${cubeActualSize / 15}px rgba(251, 146, 60, 0.8), inset 0 0 ${cubeActualSize / 25}px rgba(255,255,255,0.2)` 
            : `inset 0 0 ${cubeActualSize / 25}px rgba(0,0,0,0.3), inset 0 0 ${cubeActualSize / 50}px rgba(255,255,255,0.1)`
        }}
      />
    ));

    return (
      <div 
        className={`cube-face ${faceClass} ${isAnimating ? 'animate-glow' : ''}`}
        style={{ 
          width: `${cubeActualSize}px`, 
          height: `${cubeActualSize}px`,
          borderWidth: `${Math.max(3, cubeActualSize / 80)}px`
        }}
      >
        <div 
          className="face-grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gap: `${Math.max(4, cubeActualSize / 60)}px`,
            padding: `${Math.max(12, cubeActualSize / 20)}px`
          }}
        >
          {squares}
        </div>
      </div>
    );
  };

  const manualMoves = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"];

  const getMoveButtonColor = (move: string) => {
    const face = move[0];
    const colors: { [key: string]: string } = {
      'R': 'bg-green-600 hover:bg-green-500 border-green-400',
      'L': 'bg-blue-600 hover:bg-blue-500 border-blue-400',
      'U': 'bg-yellow-600 hover:bg-yellow-500 border-yellow-400',
      'D': 'bg-gray-600 hover:bg-gray-500 border-gray-400',
      'F': 'bg-orange-600 hover:bg-orange-500 border-orange-400',
      'B': 'bg-red-600 hover:bg-red-500 border-red-400'
    };
    return colors[face] || 'bg-purple-600 hover:bg-purple-500 border-purple-400';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {playMode ? '🎮' : '3D'} {puzzleConfig.name} Simulator
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Maximize className="w-4 h-4 text-gray-400" />
            <select
              value={cubeSize}
              onChange={(e) => setCubeSize(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm border border-gray-600 focus:border-orange-400 focus:outline-none"
            >
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="xlarge">Real Size</option>
            </select>
          </div>
          <button
            onClick={() => setManualMode(!manualMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              manualMode 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {manualMode ? <Keyboard className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
            {playMode ? 'Interactive Mode' : 'Manual Control'}
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className={`cube-container relative ${cubeSize === 'xlarge' ? 'h-[600px]' : cubeSize === 'large' ? 'h-[500px]' : 'h-[450px]'}`}
        onMouseMove={handleMouseMove}
      >
        <div 
          className="cube-scene"
          style={{
            width: `${getCubeSize() + 100}px`,
            height: `${getCubeSize() + 100}px`,
            perspective: `${getCubeSize() * 4}px`
          }}
        >
          <div 
            className="cube-wrapper"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: isPlaying ? 'none' : 'transform 0.3s ease'
            }}
          >
            <div className="cube" style={{ 
              width: `${getCubeSize()}px`,
              height: `${getCubeSize()}px`
            }}>
              {puzzleConfig.faces >= 6 && (
                <>
                  {renderFace('F', 'front', 0)}
                  {renderFace('B', 'back', 1)}
                  {renderFace('R', 'right', 2)}
                  {renderFace('L', 'left', 3)}
                  {renderFace('U', 'top', 4)}
                  {renderFace('D', 'bottom', 5)}
                </>
              )}
              {puzzleConfig.id === 'pyramid' && (
                <>
                  {renderFace('F', 'pyramid-front', 0)}
                  {renderFace('L', 'pyramid-left', 1)}
                  {renderFace('R', 'pyramid-right', 2)}
                  {renderFace('B', 'pyramid-bottom', 3)}
                </>
              )}
            </div>
          </div>
        </div>

        {currentMove && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Current Move</div>
                <div className="text-3xl font-mono font-bold text-orange-400 mb-2">
                  {currentMove}
                </div>
                <div className="text-sm text-gray-300">
                  {getMoveDescription(currentMove)}
                </div>
              </div>
            </div>
          </div>
        )}

        {manualMode && lastExecutedMove && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-600/90 backdrop-blur-sm rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs text-green-100 mb-1">Last Move</div>
                <div className="text-2xl font-mono font-bold text-white">
                  {lastExecutedMove}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {manualMode && (
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-4">Manual Controls</h3>
            <p className="text-gray-300 text-sm mb-4">
              Click buttons or use keyboard shortcuts to rotate the cube manually
            </p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {manualMoves.map((move) => (
              <button
                key={move}
                onClick={() => executeMove(move)}
                className={`${getMoveButtonColor(move)} text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-110 border-2 shadow-lg active:scale-95 ${
                  lastExecutedMove === move ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''
                }`}
                disabled={isPlaying}
              >
                <div className="text-center">
                  <div className="text-xl font-mono">{move}</div>
                  <div className="text-xs opacity-80">
                    {move.includes("'") ? 'CCW' : 'CW'}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    {move.toLowerCase()}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {moveHistory.length > 0 && (
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Move History:</h4>
              <div className="flex flex-wrap gap-2">
                {moveHistory.map((move, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm font-mono"
                  >
                    {move}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Controls Guide:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h5 className="font-semibold text-orange-400 mb-2">Mouse Controls:</h5>
                <div className="space-y-1">
                  <div>• Click buttons to execute moves</div>
                  <div>• Mouse over cube to rotate view</div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-orange-400 mb-2">Keyboard Shortcuts:</h5>
                <div className="space-y-1">
                  <div><span className="font-mono bg-gray-700 px-1 rounded">r</span> = R clockwise</div>
                  <div><span className="font-mono bg-gray-700 px-1 rounded">R</span> = R counter-clockwise</div>
                  <div><span className="font-mono bg-gray-700 px-1 rounded">u</span> = U clockwise</div>
                  <div><span className="font-mono bg-gray-700 px-1 rounded">f</span> = F clockwise</div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <h5 className="font-semibold text-white mb-2">Move Notation:</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300">
              <div><span className="font-mono text-orange-400">R</span> = Right Clockwise</div>
              <div><span className="font-mono text-orange-400">R'</span> = Right Counter-CW</div>
              <div><span className="font-mono text-orange-400">L</span> = Left Clockwise</div>
              <div><span className="font-mono text-orange-400">U</span> = Up Clockwise</div>
              <div><span className="font-mono text-orange-400">D</span> = Down Clockwise</div>
              <div><span className="font-mono text-orange-400">F</span> = Front Clockwise</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cube-container { 
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .cube-scene {
          perspective-origin: 50% 50%;
        }

        .cube-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .cube {
          position: relative;
          transform-style: preserve-3d;
          margin: 50px auto;
        }

        .cube-face {
          position: absolute;
          border-color: rgba(0,0,0,0.4);
          border-style: solid;
          border-radius: 12px;
          transition: all 1s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
          background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.1));
        }

        .face-grid {
          display: grid;
          width: 100%;
          height: 100%;
        }

        .cube-square {
          position: relative;
          background-clip: padding-box;
        }

        .cube-square::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.3) 100%);
          border-radius: inherit;
          pointer-events: none;
        }

        .front { transform: rotateY(0deg) translateZ(var(--cube-half-size, 140px)); }
        .back { transform: rotateY(180deg) translateZ(var(--cube-half-size, 140px)); }
        .right { transform: rotateY(90deg) translateZ(var(--cube-half-size, 140px)); }
        .left { transform: rotateY(-90deg) translateZ(var(--cube-half-size, 140px)); }
        .top { transform: rotateX(90deg) translateZ(var(--cube-half-size, 140px)); }
        .bottom { transform: rotateX(-90deg) translateZ(var(--cube-half-size, 140px)); }

        .pyramid-front { transform: rotateY(0deg) rotateX(-30deg) translateZ(var(--pyramid-depth, 120px)); }
        .pyramid-left { transform: rotateY(-120deg) rotateX(-30deg) translateZ(var(--pyramid-depth, 120px)); }
        .pyramid-right { transform: rotateY(120deg) rotateX(-30deg) translateZ(var(--pyramid-depth, 120px)); }
        .pyramid-bottom { transform: rotateX(-90deg) translateZ(var(--pyramid-base, 60px)); }

        .animate-glow {
          animation: glow 1s ease-in-out;
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 20px 60px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.6);
            transform: scale(1.02);
          }
        }
      `}</style>
      
      <style jsx>{`
        .cube {
          --cube-half-size: ${getCubeSize() / 2}px;
          --pyramid-depth: ${getCubeSize() * 0.4}px;
          --pyramid-base: ${getCubeSize() * 0.2}px;
        }
      `}</style>
    </div>
  );
};

const getMoveDescription = (move: string): string => {
  const descriptions: { [key: string]: string } = {
    'R': 'Right face clockwise 90°',
    "R'": 'Right face counter-clockwise 90°',
    'L': 'Left face clockwise 90°',
    "L'": 'Left face counter-clockwise 90°',
    'U': 'Upper face clockwise 90°',
    "U'": 'Upper face counter-clockwise 90°',
    'D': 'Down face clockwise 90°',
    "D'": 'Down face counter-clockwise 90°',
    'F': 'Front face clockwise 90°',
    "F'": 'Front face counter-clockwise 90°',
    'B': 'Back face clockwise 90°',
    "B'": 'Back face counter-clockwise 90°'
  };
  return descriptions[move] || 'Unknown move';
};

export default EnhancedCubeVisualizer;