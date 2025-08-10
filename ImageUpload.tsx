import React, { useCallback, useState } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onImageUpload(file);
      }
    }
  }, [onImageUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Upload Cube Image</h2>
      
      {isAnalyzing ? (
        <div className="text-center py-12">
          <div className="relative">
            <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Analyzing Cube...</h3>
          <p className="text-gray-300">Our AI is detecting the cube's current state</p>
          <div className="mt-4 bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-4 text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></div>
                Detecting colors
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2 animation-delay-300"></div>
                Mapping faces
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2 animation-delay-600"></div>
                Validating state
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-orange-400 bg-orange-400/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {previewUrl ? (
            <div className="space-y-4">
              <img 
                src={previewUrl} 
                alt="Cube preview" 
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <p className="text-green-400 font-medium">Image uploaded successfully!</p>
            </div>
          ) : (
            <div className="py-8">
              <div className="mb-6">
                <div className="relative">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {dragActive ? 'Drop your image here' : 'Upload a cube image'}
              </h3>
              <p className="text-gray-300 mb-6">
                Drag and drop your scrambled Rubik's cube photo, or click to browse
              </p>
              
              <div className="space-y-3">
                <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                  Choose Image
                </button>
                <div className="text-sm text-gray-400">
                  Supports JPG, PNG, WebP • Max 10MB
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <h4 className="font-semibold text-blue-300 mb-2">📸 Photography Tips</h4>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Ensure good lighting for clear color detection</li>
          <li>• Hold the cube at a slight angle to show 3 faces</li>
          <li>• Keep the cube centered in the frame</li>
          <li>• Avoid shadows covering the cube faces</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;