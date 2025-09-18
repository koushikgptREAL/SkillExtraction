import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
  onUploadResult?: (result: { textLength: number; skills: { name: string; category: string; confidence: number }[] }) => void;
  isProcessing?: boolean;
  isComplete?: boolean;
  onReset?: () => void;
}

export default function FileUpload({ onFileUpload, isProcessing = false, isComplete = false, onReset, onUploadResult }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadToServer = useCallback(async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    setProgress(10);
    const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' });
    setProgress(70);
    if (!res.ok) {
      setProgress(0);
      throw new Error(await res.text());
    }
    const json = await res.json();
    setProgress(100);
    onUploadResult?.(json);
  }, [onUploadResult]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      console.log('File uploaded:', pdfFile.name);
      onFileUpload?.(pdfFile);
      setProgress(0);
      uploadToServer(pdfFile).catch(() => {});
    }
  }, [onFileUpload, uploadToServer]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      console.log('File selected:', file.name);
      onFileUpload?.(file);
      setProgress(0);
      uploadToServer(file).catch(() => {});
    }
  }, [onFileUpload, uploadToServer]);

  const handleReset = () => {
    setUploadedFile(null);
    setProgress(0);
    onReset?.();
    console.log('Upload reset');
  };

  if (uploadedFile) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {isComplete ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <FileText className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" data-testid="text-filename">
                {uploadedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {isProcessing && !isComplete && (
                <div className="mt-3">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {progress < 100 ? 'Uploading...' : 'Processing...'}
                  </p>
                </div>
              )}
              {isComplete && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  Processing complete
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              data-testid="button-remove-file"
              className="h-8 w-8 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`w-full max-w-md transition-colors cursor-pointer hover-elevate ${
        isDragOver ? 'border-primary bg-primary/5' : 'border-dashed border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
      data-testid="dropzone-upload"
    >
      <CardContent className="p-8 text-center">
        <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
        <h3 className="text-lg font-semibold mb-2">
          {isDragOver ? 'Drop your resume here' : 'Upload your resume'}
        </h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your PDF resume or click to browse
        </p>
        <Button variant="outline" data-testid="button-browse-files">
          Browse files
        </Button>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
        <p className="text-xs text-muted-foreground mt-3">
          Only PDF files are supported
        </p>
      </CardContent>
    </Card>
  );
}