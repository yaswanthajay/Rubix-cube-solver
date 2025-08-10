import React, { useState, useCallback } from 'react';
import { Upload, Camera, Check, X, RotateCw, Image as ImageIcon } from 'lucide-react';
import { PuzzleConfig, FaceImage } from '../types/cube';

interface FaceImageUploadProps {
  puzzleConfig: PuzzleConfig;
  faceImages: FaceImage[];
  onImageUpload: (faceIndex: number, file: File) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const FaceImageUpload: React.FC<FaceImageUploadProps> = ({
  puzzleConfig,
  faceImages,
  onImageUpload,
  onAnalyze,
  isAnalyzing
}) => {
  const [draggedFace, setDraggedFace] = useState<number | null>(null);

  const handleDrag = useCallback((e: React.DragEvent, faceIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDraggedFace(faceIndex);
    } else if (e.type === 'dragleave') {
      setDraggedFace(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, faceIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedFace(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(faceIndex, file);
      }
    }
  }, [onImageUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, faceIndex: number) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(faceIndex, e.target.files[0]);
    }
  }, [onImageUpload]);

  const allImagesUploaded = faceImages.every(face => face.file !== null);
  const uploadedCount = faceImages.filter(face => face.file !== null).length;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-orange-400 mr-3" />
          <h2 className="text-3xl font-bold text-white">Upload Face Images</h2>
        </div>
        <p className="text-gray-300 text-lg mb-4">
          Upload clear photos of each face of your {puzzleConfig.name}
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-gray-900/50 rounded-lg px-4 py-2">
            <span className="text-orange-400 font-bold text-lg">{uploadedCount}</span>
            <span className="text-gray-300 ml-1">/ {puzzleConfig.faces} faces</span>
          </div>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadedCount / puzzleConfig.faces) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="text-center py-12">
          <div className="relative mb-6">
            <div className="animate-spin w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RotateCw className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Analyzing Puzzle State...</h3>
          <p className="text-gray-300 mb-6">Our AI is processing your {puzzleConfig.name} images</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {['Detecting Colors', 'Mapping Positions', 'Validating State', 'Generating Solution'].map((step, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-orange-500 animate-pulse' :
                    index === 1 ? 'bg-blue-500 animate-pulse animation-delay-300' :
                    index === 2 ? 'bg-green-500 animate-pulse animation-delay-600' :
                    'bg-purple-500 animate-pulse animation-delay-900'
                  }`} />
                </div>
                <p className="text-xs text-gray-400">{step}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {faceImages.map((faceImage, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-300 ${
                  draggedFace === index ? 'scale-105' : ''
                }`}
              >
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                    draggedFace === index
                      ? 'border-orange-400 bg-orange-400/10'
                      : faceImage.file
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={(e) => handleDrag(e, index)}
                  onDragLeave={(e) => handleDrag(e, index)}
                  onDragOver={(e) => handleDrag(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {puzzleConfig.faceNames[index]} Face
                    </h3>
                    <div 
                      className="w-8 h-8 rounded mx-auto mb-2 border-2 border-gray-500"
                      style={{ backgroundColor: puzzleConfig.colors[index] }}
                    />
                  </div>

                  {faceImage.preview ? (
                    <div className="space-y-3">
                      <img
                        src={faceImage.preview}
                        alt={`${puzzleConfig.faceNames[index]} face`}
                        className="max-w-full max-h-32 mx-auto rounded-lg shadow-lg"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">Uploaded</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-300 text-sm mb-2">
                        {draggedFace === index ? 'Drop image here' : 'Click or drag image'}
                      </p>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Choose File
                      </button>
                    </div>
                  )}
                </div>

                {faceImage.file && (
                  <button
                    onClick={() => {
                      // Reset this face
                      const event = new Event('change') as any;
                      event.target = { files: [] };
                      handleFileChange(event, index);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {allImagesUploaded && (
            <div className="text-center">
              <button
                onClick={onAnalyze}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <RotateCw className="w-6 h-6" />
                  <span className="text-lg">Analyze & Solve Puzzle</span>
                </div>
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-8 bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
        <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Photography Guidelines
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-200">
          <div>
            <h5 className="font-semibold mb-2">✅ Do:</h5>
            <ul className="space-y-1">
              <li>• Use bright, even lighting</li>
              <li>• Keep the face centered and flat</li>
              <li>• Ensure all squares are visible</li>
              <li>• Take photos from directly above</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">❌ Avoid:</h5>
            <ul className="space-y-1">
              <li>• Shadows covering squares</li>
              <li>• Blurry or tilted images</li>
              <li>• Reflections on the surface</li>
              <li>• Fingers blocking the view</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceImageUpload;