import React, { useState, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ProcessedFile {
  id: string;
  downloadUrl: string;
  originalName: string;
  size: number;
  blurSettings?: { radius: number; sigma: number };
  sharpenSettings?: { sigma: number };
}

function App() {
  const [activeTab, setActiveTab] = useState<'convert' | 'blur' | 'sharpen'>('convert');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('png');
  const [blurRadius, setBlurRadius] = useState(0);
  const [blurSigma, setBlurSigma] = useState(4);
  const [sharpenSigma, setSharpenSigma] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleConvert = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('targetFormat', targetFormat);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Conversion failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('radius', blurRadius.toString());
    formData.append('sigma', blurSigma.toString());

    try {
      const response = await fetch('/api/blur', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Blur failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Blur failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSharpen = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('sigma', sharpenSigma.toString());

    try {
      const response = await fetch('/api/sharpen', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sharpen failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sharpen failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (result) {
      try {
        const response = await fetch(result.downloadUrl);
        if (!response.ok) {
          throw new Error('Download failed');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.originalName.replace(/\.[^/.]+$/, '') + '_processed' + getFileExtension(result.downloadUrl);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download error:', error);
        setError('Download failed. Please try again.');
      }
    }
  };

  const getFileExtension = (filename: string) => {
    const match = filename.match(/\.[^/.]+$/);
    return match ? match[0] : '.png';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ImageMagick Web Interface
          </h1>
          <p className="text-gray-600">
            Convert image formats and apply blur or sharpen effects using ImageMagick
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('convert')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'convert'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Convert Format
            </button>
            <button
              onClick={() => setActiveTab('blur')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'blur'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Apply Blur
            </button>
            <button
              onClick={() => setActiveTab('sharpen')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'sharpen'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sharpen
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Upload Image
            </h2>

            {/* File Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            >
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your image here or click to browse
                </p>
                <p className="text-gray-500">
                  Supports PNG, JPG, JPEG, and WEBP (max 10MB)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {/* Settings */}
            <div className="mt-6">
              {activeTab === 'convert' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="webp">WEBP</option>
                  </select>
                </div>
              )}

              {activeTab === 'blur' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radius: {blurRadius}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={blurRadius}
                      onChange={(e) => setBlurRadius(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sigma: {blurSigma}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={blurSigma}
                      onChange={(e) => setBlurSigma(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'sharpen' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strength (Sigma): {sharpenSigma}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={sharpenSigma}
                    onChange={(e) => setSharpenSigma(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    0.5-1.0: Natural sharpening | 1.0+: Stronger effect
                  </div>
                </div>
              )}
            </div>

            {/* Process Button */}
            <button
              onClick={
                activeTab === 'convert' 
                  ? handleConvert 
                  : activeTab === 'blur' 
                    ? handleBlur 
                    : handleSharpen
              }
              disabled={!selectedFile || loading}
              className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {activeTab === 'convert' 
                    ? 'Convert Image' 
                    : activeTab === 'blur' 
                      ? 'Apply Blur' 
                      : 'Sharpen Image'
                  }
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Preview
            </h2>

            {previewUrl && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original</h3>
                <img
                  src={previewUrl}
                  alt="Original"
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">✅ Processing completed!</p>
                  <p className="text-sm text-green-600 mt-1">
                    File: {result.originalName} ({(result.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  {result.blurSettings && (
                    <p className="text-sm text-green-600">
                      Blur applied: radius {result.blurSettings.radius}, sigma {result.blurSettings.sigma}
                    </p>
                  )}
                  {result.sharpenSettings && (
                    <p className="text-sm text-green-600">
                      Sharpen applied: sigma {result.sharpenSettings.sigma}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Result
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
