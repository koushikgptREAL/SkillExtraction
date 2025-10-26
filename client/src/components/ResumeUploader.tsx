import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface ResumeUploaderProps {
  onSkillsExtracted: (skills: string[]) => void;
}

export default function ResumeUploader({ onSkillsExtracted }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError(null);
    },
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a resume file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/extract-skills', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract skills');
      }

      const data = await response.json();
      onSkillsExtracted(data.skills || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while extracting skills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the resume file here...</p>
          ) : (
            <p>Drag and drop a resume PDF here, or click to select a file</p>
          )}
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">PDF</Badge>
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            </div>
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="ml-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting Skills...
                </>
              ) : (
                'Extract Skills'
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}