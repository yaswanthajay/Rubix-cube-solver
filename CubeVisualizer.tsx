import React, { useEffect, useState } from 'react';
import { CubeState, Move } from '../types/cube';

interface CubeVisualizerProps {
  cubeState: CubeState | null;
  currentMove?: string;
  isPlaying: boolean;
  onMoveComplete?: () => void;
}

const CubeVisualizer: React.FC<CubeVisualizerProps> = ({ 
  cubeState, 
  currentMove, 
  isPlaying, 
  onMoveComplete 
}) => {
  const [rotation, setRotation] = useState({ x: -15, y: 45 });
  const [animatingFace, setAnimatingFace] = useState<string | null>(null);

  useEffect(() => {
    if (currentMove && isPlaying) {
      setAnimatingFace(currentMove[0]);
      setTimeout(() => {
        setAnimatingFace(null);
        onMoveComplete?.();
      }, 800);
    }
  }, [currentMove, isPlaying, onMoveComplete]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPlaying) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      setRotation({
        x: -15 + (mouseY / rect.height) * 30,
        y: 45 + (mouseX / rect.width) * 60
      });
    }
  };

  const getFaceColor = (face: string, position: number): string => {
    if (!cubeState) {
      // Default solved cube colors
      const colors = {
        'F': '#ff6b35', // Orange (Front)
        'B': '#d63031', // Red (Back)  
        'R': '#00b894', // Green (Right)
        'L': '#0984e3', // Blue (Left)
        'U': '#fdcb6e', // Yellow (Up)
        'D': '#ffffff'  // White (Down)
      };
      return colors[face as keyof typeof colors] || '#6c5ce7';
    }
    
    // Use detected state colors
    return cubeState[`${face}${position}` as keyof CubeState] || '#6c5ce7';
  };

  const renderFace = (face: string, faceClass: string) => {
    const isAnimating = animatingFace === face;
    const squares = Array.from({ length: 9 }, (_, i) => (
      <div
        key={i}
        className={`cube-square transition-all duration-300 ${
          isAnimating ? 'animate-pulse scale-110' : ''
        }`}
        style={{ 
          backgroundColor: getFaceColor(face, i),
          border: '2px solid rgba(0,0,0,0.3)',
          borderRadius: '2px'
        }}
      />
    ));

    return (
      <div className={`cube-face ${faceClass} ${isAnimating ? 'animate-spin-slow' : ''}`}>
        <div className="face-grid">
          {squares}
        </div>
      </div>
    );
  };

  return (
    <div className="cube-container" onMouseMove={handleMouseMove}>
      <div className="cube-scene">
        <div 
          className="cube-wrapper"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          <div className="cube">
            {renderFace('F', 'front')}
            {renderFace('B', 'back')}
            {renderFace('R', 'right')}
            {renderFace('L', 'left')}
            {renderFace('U', 'top')}
            {renderFace('D', 'bottom')}
          </div>
        </div>
      </div>

      {currentMove && (
        <div className="mt-6 text-center">
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-4 inline-block">
            <div className="text-sm text-gray-400 mb-1">Current Move</div>
            <div className="text-3xl font-mono font-bold text-orange-400 mb-2">
              {currentMove}
            </div>
            <div className="text-sm text-gray-300">
              {getMoveDescription(currentMove)}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cube-container {
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .cube-scene {
          width: 300px;
          height: 300px;
          perspective: 1000px;
          perspective-origin: 50% 50%;
        }

        .cube-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }

        .cube {
          width: 200px;
          height: 200px;
          position: relative;
          transform-style: preserve-3d;
          margin: 50px auto;
        }

        .cube-face {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 3px solid rgba(0,0,0,0.2);
          border-radius: 8px;
          transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .face-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 3px;
          padding: 8px;
          width: 100%;
          height: 100%;
        }

        .cube-square {
          border-radius: 4px;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
        }

        .front { transform: rotateY(0deg) translateZ(100px); }
        .back { transform: rotateY(180deg) translateZ(100px); }
        .right { transform: rotateY(90deg) translateZ(100px); }
        .left { transform: rotateY(-90deg) translateZ(100px); }
        .top { transform: rotateX(90deg) translateZ(100px); }
        .bottom { transform: rotateX(-90deg) translateZ(100px); }

        .animate-spin-slow {
          animation: spin-slow 0.8s linear;
        }

        @keyframes spin-slow {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(90deg); }
        }
      `}</style>
    </div>
  );
};

const getMoveDescription = (move: string): string => {
  const descriptions: { [key: string]: string } = {
    'R': 'Right face clockwise',
    "R'": 'Right face counter-clockwise',
    'L': 'Left face clockwise',
    "L'": 'Left face counter-clockwise',
    'U': 'Upper face clockwise',
    "U'": 'Upper face counter-clockwise',
    'D': 'Down face clockwise',
    "D'": 'Down face counter-clockwise',
    'F': 'Front face clockwise',
    "F'": 'Front face counter-clockwise',
    'B': 'Back face clockwise',
    "B'": 'Back face counter-clockwise'
  };
  return descriptions[move] || 'Unknown move';
};

export default CubeVisualizer;