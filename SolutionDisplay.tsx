import React from 'react';
import { CheckCircle, Circle, RotateCw } from 'lucide-react';
import { SolutionStep } from '../types/cube';

interface SolutionDisplayProps {
  solution: SolutionStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ 
  solution, 
  currentStep, 
  onStepClick 
}) => {
  const getMoveColor = (move: string): string => {
    const face = move[0];
    const colors: { [key: string]: string } = {
      'R': 'text-green-400 bg-green-400/20',
      'L': 'text-blue-400 bg-blue-400/20',
      'U': 'text-yellow-400 bg-yellow-400/20',
      'D': 'text-white bg-white/20',
      'F': 'text-orange-400 bg-orange-400/20',
      'B': 'text-red-400 bg-red-400/20'
    };
    return colors[face] || 'text-purple-400 bg-purple-400/20';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <RotateCw className="w-6 h-6 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Solution Steps</h2>
        <span className="text-sm text-gray-400 ml-auto">{solution.length} moves</span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {solution.map((step, index) => (
          <div
            key={index}
            onClick={() => onStepClick(index)}
            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
              index === currentStep
                ? 'bg-orange-600/20 border border-orange-600/50 shadow-lg transform scale-105'
                : index < currentStep
                ? 'bg-green-600/10 border border-green-600/30'
                : 'bg-gray-900/30 border border-gray-700/50 hover:bg-gray-700/30'
            }`}
          >
            <div className="flex-shrink-0">
              {index < currentStep ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : index === currentStep ? (
                <div className="w-6 h-6 bg-orange-400 rounded-full animate-pulse" />
              ) : (
                <Circle className="w-6 h-6 text-gray-500" />
              )}
            </div>

            <div className="flex-shrink-0 text-right">
              <span className="text-xs text-gray-400 block">Step {index + 1}</span>
            </div>

            <div className={`flex-shrink-0 px-3 py-1 rounded font-mono font-bold text-lg ${getMoveColor(step.move)}`}>
              {step.move}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm ${
                index === currentStep ? 'text-white' : 'text-gray-300'
              } truncate`}>
                {step.description}
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className={`text-xs px-2 py-1 rounded ${
                index < currentStep 
                  ? 'bg-green-600/20 text-green-400'
                  : index === currentStep
                  ? 'bg-orange-600/20 text-orange-400'
                  : 'bg-gray-600/20 text-gray-400'
              }`}>
                {index < currentStep ? 'Done' : index === currentStep ? 'Current' : 'Pending'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Move Notation Guide</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded font-mono">R</span>
            <span className="text-gray-300">Right face clockwise</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded font-mono">R'</span>
            <span className="text-gray-300">Right face counter-clockwise</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded font-mono">L</span>
            <span className="text-gray-300">Left face clockwise</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded font-mono">U</span>
            <span className="text-gray-300">Upper face clockwise</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.7);
        }
      `}</style>
    </div>
  );
};

export default SolutionDisplay;