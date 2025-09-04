'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage } from 'lucide-react';
import { cn, validateImageFile, fileToBase64 } from '@/lib/utils';

interface FileUploaderProps {
  onFileUpload: (file: File, base64: string) => void;
  className?: string;
}

export function FileUploader({ onFileUpload, className }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }

    const uploadedFile = acceptedFiles[0];
    const validation = validateImageFile(uploadedFile);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);
    try {
      // Create preview
      const objectUrl = URL.createObjectURL(uploadedFile);
      setPreview(objectUrl);
      setFile(uploadedFile);

      // Convert to base64
      const base64 = await fileToBase64(uploadedFile);
      onFileUpload(uploadedFile, base64);
    } catch (err) {
      setError('Failed to process file');
      console.error('File processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
            error && 'border-red-500 bg-red-50'
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              'p-4 rounded-full',
              isDragActive ? 'bg-blue-100' : 'bg-gray-100'
            )}>
              <Upload className={cn(
                'w-8 h-8',
                isDragActive ? 'text-blue-600' : 'text-gray-600'
              )} />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your hardware diagram here' : 'Upload Hardware Diagram'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Supports PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            {preview && (
              <div className="flex-shrink-0">
                <img
                  src={preview}
                  alt="Hardware diagram preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileImage className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {isProcessing && (
                    <p className="mt-2 text-xs text-blue-600">Processing...</p>
                  )}
                </div>
                
                <button
                  onClick={removeFile}
                  className="ml-4 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
