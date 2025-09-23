import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...uploadedFiles, ...acceptedFiles]
    setUploadedFiles(newFiles)
    onFilesChange(newFiles)
  }, [uploadedFiles, onFilesChange])

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onFilesChange(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 3,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
          isDragActive 
            ? "border-primary bg-secondary/20" 
            : "border-muted hover:border-primary/50 hover:bg-secondary/10"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-text-primary font-medium">
              {isDragActive ? "Drop files here" : "Upload ID documents"}
            </p>
            <p className="text-sm text-text-muted mt-1">
              Passport, driving licence, or biometric residence permit
            </p>
            <p className="text-xs text-text-muted mt-1">
              PNG, JPG, PDF up to 5MB each
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-secondary"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <File className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {file.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10"
                >
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}