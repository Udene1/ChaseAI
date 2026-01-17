'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadPDFProps {
    onUpload: (data: { url: string; amount?: number; dueDate?: string }) => void;
}

export function UploadPDF({ onUpload }: UploadPDFProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            // Validate file type
            if (file.type !== 'application/pdf') {
                setError('Please upload a PDF file');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }

            setIsUploading(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Upload failed');
                }

                const data = await response.json();
                setUploadedFile(file.name);
                onUpload({
                    url: data.url,
                    amount: data.parsedData?.amount,
                    dueDate: data.parsedData?.dueDate,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Upload failed');
            } finally {
                setIsUploading(false);
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        disabled: isUploading,
    });

    const removeFile = () => {
        setUploadedFile(null);
    };

    if (uploadedFile) {
        return (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="p-2 bg-white rounded-lg">
                    <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 truncate">{uploadedFile}</p>
                    <p className="text-xs text-gray-500">PDF uploaded</p>
                </div>
                <button
                    onClick={removeFile}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div>
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
                    isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                    isUploading && 'pointer-events-none opacity-60'
                )}
            >
                <input {...getInputProps()} />
                {isUploading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                        <p className="mt-2 text-sm text-gray-600">Uploading & parsing...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-gray-100 rounded-full">
                            <Upload className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-dark-900">
                            {isDragActive ? 'Drop PDF here' : 'Drag & drop PDF'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">or click to browse</p>
                    </div>
                )}
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            <p className="mt-2 text-xs text-gray-400">
                We&apos;ll try to extract invoice amount and date automatically.
            </p>
        </div>
    );
}
