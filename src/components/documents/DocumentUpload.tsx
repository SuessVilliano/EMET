'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'indexed' | 'failed';
  progress?: number;
  category: string;
}

interface DocumentUploadProps {
  onUpload?: (file: File, category: string) => void;
  acceptedFormats?: string[];
}

const ACCEPTED_FORMATS = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/gif',
];

const CATEGORIES = ['Legal', 'Case Filing', 'Guidelines', 'Evidence', 'Other'];

const statusConfig = {
  uploading: { icon: Upload, color: 'text-blue-400', label: 'Uploading...' },
  processing: { icon: Upload, color: 'text-warning', label: 'Processing...' },
  indexed: { icon: CheckCircle, color: 'text-success', label: 'Indexed' },
  failed: { icon: AlertCircle, color: 'text-destructive', label: 'Failed' },
};

export function DocumentUpload({
  onUpload,
  acceptedFormats = ACCEPTED_FORMATS,
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [category, setCategory] = useState('Legal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    processFiles(droppedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      if (acceptedFormats.includes(file.type)) {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          status: 'uploading',
          progress: 0,
          category,
        };

        setFiles((prev) => [newFile, ...prev]);
        onUpload?.(file, category);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 40;
          if (progress >= 100) {
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === newFile.id
                  ? { ...f, status: 'processing', progress: 100 }
                  : f
              )
            );

            // Simulate processing completion
            setTimeout(() => {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === newFile.id
                    ? { ...f, status: 'indexed' }
                    : f
                )
              );
            }, 2000);
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === newFile.id
                  ? { ...f, progress }
                  : f
              )
            );
          }
        }, 500);
      }
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Document Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={cn(
            'w-full px-4 py-2 rounded-lg bg-gray-800/60 border border-primary/20',
            'text-white focus:outline-none focus:border-primary/50 transition-colors',
            'text-sm'
          )}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-gray-900">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-all duration-200',
          'text-center cursor-pointer',
          dragActive
            ? 'border-primary bg-primary/10 bg-opacity-50'
            : 'border-primary/30 bg-gray-900/20 hover:border-primary/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={acceptedFormats.join(',')}
          className="hidden"
          aria-label="Upload files"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="relative z-10"
        >
          <Upload className={cn(
            'w-8 h-8 mx-auto mb-3 transition-colors',
            dragActive ? 'text-primary' : 'text-primary/60'
          )} />
          <p className="font-semibold text-white text-sm">
            {dragActive ? 'Drop files here' : 'Drag & drop documents here'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            or click to browse
          </p>
        </button>

        <div className="mt-3">
          <p className="text-xs text-gray-500">
            Supported: PDF, DOCX, TXT, CSV, PNG, JPG, GIF
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file) => {
              const config = statusConfig[file.status];
              const Icon = config.icon;

              return (
                <div
                  key={file.id}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-200',
                    'bg-gray-900/40 border-primary/10 hover:border-primary/20'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {file.status === 'uploading' || file.status === 'processing' ? (
                        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <Icon className={cn('w-5 h-5', config.color)} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white truncate">
                          {file.name}
                        </p>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="ml-2 p-1 hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className={cn(
                          'text-xs font-medium',
                          config.color
                        )}>
                          {config.label}
                        </p>
                        {file.progress !== undefined && file.progress < 100 && (
                          <p className="text-xs text-gray-500">
                            {Math.round(file.progress)}%
                          </p>
                        )}
                      </div>

                      {/* Progress bar */}
                      {file.progress !== undefined && file.progress < 100 && (
                        <div className="mt-2 h-1.5 rounded-full bg-gray-700/50 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
