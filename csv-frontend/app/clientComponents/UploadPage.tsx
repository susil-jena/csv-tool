'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useAppSelector } from '../redux';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const user = useAppSelector((state: any) => state.auth?.user);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return setError('Please select a CSV file');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csv/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token || ''}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      if(data?.fileId){
        router.push(`/home/uploads/${data?.fileId}`);
      }else{
        router.push('/home/uploads');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-10 space-y-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full max-w-xl h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all
        ${isDragActive ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-4m0 0V8m0 4h10m-4 4v-4m0 0V8m0 4H7" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isDragActive ? 'Drop the file here...' : 'Click or drag CSV file to upload'}
          </p>
          {selectedFile && <p className="mt-2 text-green-600">{selectedFile.name}</p>}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        disabled={uploading || !selectedFile}
        onClick={handleUpload}
        className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
