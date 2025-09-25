import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react';
import { DocumentRequirement } from '@/utils/visaRequirements';

interface DocumentUploadSectionProps {
  document: DocumentRequirement;
  isUploaded: boolean;
  isSkipped?: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  uploadedFileName?: string;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  document,
  isUploaded,
  isSkipped = false,
  onUpload,
  onRemove,
  uploadedFileName
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const getStatusIcon = () => {
    if (isSkipped) return <CheckCircle className="w-5 h-5 text-blue-600" />;
    if (isUploaded) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (document.required) return <AlertCircle className="w-5 h-5 text-orange-600" />;
    return <FileText className="w-5 h-5 text-muted-foreground" />;
  };

  const getStatusBadge = () => {
    if (isSkipped) return <Badge variant="secondary" className="text-blue-600">Already Provided</Badge>;
    if (isUploaded) return <Badge variant="outline" className="text-green-600">Uploaded</Badge>;
    if (document.required) return <Badge variant="destructive">Required</Badge>;
    return <Badge variant="secondary">Optional</Badge>;
  };

  if (isSkipped) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getStatusIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">{document.label}</h3>
                {getStatusBadge()}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{document.description}</p>
              <p className="text-sm text-blue-700">
                This document was provided during your identity verification process.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isUploaded) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getStatusIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">{document.label}</h3>
                {getStatusBadge()}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{document.description}</p>
              {uploadedFileName && (
                <p className="text-sm text-green-700 font-medium">{uploadedFileName}</p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onRemove}
                className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={document.required ? "border-orange-200" : "border-border"}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground">{document.label}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{document.description}</p>
            
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your file here, or{' '}
                    <label className="text-primary cursor-pointer hover:underline">
                      browse files
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PDF, JPG, PNG (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};