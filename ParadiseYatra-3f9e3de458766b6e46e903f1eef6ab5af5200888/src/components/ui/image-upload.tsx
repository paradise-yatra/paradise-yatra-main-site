"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onUpload?: (file: File) => Promise<string>;
  label?: string;
  className?: string;
}

const ImageUpload = ({ 
  value, 
  onChange, 
  onUpload, 
  label = "Image",
  className = ""
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      let imageUrl: string;

      if (onUpload) {
        // Use custom upload function if provided
        imageUrl = await onUpload(file);
      } else {
        // Default upload to backend
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/upload/image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        imageUrl = data.imageUrl;
      }

      onChange(imageUrl);
      setPreviewUrl(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreviewUrl(url);
  };

  const handleRemoveImage = () => {
    onChange('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const input = fileInputRef.current;
        if (input) {
          input.files = files;
          await handleFileSelect({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
        }
      } else {
        toast.error('Please drop a valid image file');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* URL Input */}
      <div className="space-y-2">
        <Input
          type="url"
          value={value || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="bg-white"
        />
        <div className="text-xs text-gray-500">
          Or upload an image file below
        </div>
      </div>

      {/* File Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : previewUrl 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-6">
          <div className="text-center">
            {previewUrl && getImageUrl(previewUrl) ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <Image
                    src={getImageUrl(previewUrl)!}
                    alt="Preview"
                    width={192}
                    height={192}
                    className="max-h-48 max-w-full rounded-lg object-cover"
                    onError={() => {
                      console.error('Preview image failed to load:', previewUrl);
                      console.error('Processed URL:', getImageUrl(previewUrl));
                    }}
                    onLoad={() => {
              
                    }}
                  />
                  <Button
                    type="button"
                    variant="admin-outline"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Image uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <ImageIcon className="h-12 w-12" />
                </div>
                <div>
                  <p className={`text-sm font-medium transition-colors ${
                    isDragOver ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {isDragOver ? 'Drop the image here!' : 'Drag and drop an image here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 
             px-5 py-2.5 text-sm font-medium text-white shadow-md 
             hover:from-blue-700 hover:to-indigo-700 
             disabled:cursor-not-allowed disabled:opacity-60 
             transition-all duration-300 ease-in-out"
                  >
                  <Upload className="h-4 w-4 text-white" />
                  {isUploading ? <p className="text-white">Uploading...</p> : <p className="text-white">Choose File</p>}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
