import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Settings, Volume2 } from 'lucide-react';
import { SolutionStep } from '../types/cube';

interface VideoPlayerProps {
  solution: SolutionStep[];
  currentStep: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepChange: (step: number) => void;
  onReset: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  solution,
  currentStep,
  isPlaying,
  onPlayPause,
  onStepChange,
  onReset
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = solution.length > 0 ? (currentStep / (solution.length - 1)) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = (clickX / rect.width) * 100;
      const newStep = Math.round((percentage / 100) * (solution.length - 1));
      onStepChange(Math.max(0, Math.min(solution.length - 1, newStep)));
    }
  };

  const formatTime = (step: number) => {
    const totalSeconds = Math.floor(step * (2 / playbackSpeed));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Solution Playback</h2>
        <div className="flex items-center gap-2">
          <div className="bg-gray-900/50 rounded-lg px-3 py-1">
            <span className="text-orange-400 font-bold">{currentStep + 1}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-white">{solution.length}</span>
          </div>
          <span className="text-sm text-gray-400">
            {formatTime(solution.length)} total
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          className="relative h-3 bg-gray-700 rounded-full cursor-pointer group"
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 group-hover:scale-110"
            style={{ left: `calc(${progress}% - 10px)` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>{formatTime(currentStep)}</span>
          <span>{formatTime(solution.length)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={onReset}
          className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
          title="Reset to beginning"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-full transition-colors"
          title="Previous step"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={onPlayPause}
          className="p-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={() => onStepChange(Math.min(solution.length - 1, currentStep + 1))}
          disabled={currentStep === solution.length - 1}
          className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-full transition-colors"
          title="Next step"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
            title="Playback settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {showSettings && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-700 rounded-lg p-4 min-w-48 shadow-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Playback Speed
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          playbackSpeed === speed
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Volume2 className="w-4 h-4 inline mr-1" />
                    Sound Effects
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Step Display */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">
            Step {currentStep + 1} of {solution.length}
          </div>
          <div className="text-sm text-gray-400">
            Speed: {playbackSpeed}x
          </div>
        </div>

        {solution[currentStep] && (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-mono font-bold text-orange-400">
                {solution[currentStep].move}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  {solution[currentStep].description}
                </div>
                <div className="text-sm text-gray-400">
                  Phase: {solution[currentStep].phase}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <span className="mr-4">Space: Play/Pause</span>
        <span className="mr-4">← →: Step</span>
        <span>R: Reset</span>
      </div>
    </div>
  );
};

export default VideoPlayer;