import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DocumentUploadProps {
  label: string
  description: string
  accept: string
  icon: React.ReactNode
  onUpload: (url: string) => void
  currentUrl?: string
  required?: boolean
  multiple?: boolean
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  description,
  accept,
  icon,
  onUpload,
  currentUrl,
  required = false,
  multiple = false
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      // Simulate file upload - in demo mode, just create a mock URL
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockUrl = `https://example.com/documents/${files[0].name}`
      onUpload(mockUrl)
      
      toast({
        title: "Document uploaded successfully",
        description: `${files[0].name} has been uploaded.`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
  }

  const removeFile = () => {
    onUpload('')
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      {currentUrl ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Document uploaded</p>
                  <p className="text-xs text-green-700">{description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-green-700 hover:text-green-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                ) : (
                  icon
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>

              <div>
                <input
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  onChange={handleFileSelect}
                  className="hidden"
                  id={`upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                  disabled={isUploading}
                />
                <Label
                  htmlFor={`upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                  className="cursor-pointer"
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isUploading}
                    className="pointer-events-none"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Choose Files'}
                  </Button>
                </Label>
              </div>

              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, JPG, PNG (max 10MB)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {required && !currentUrl && (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">
            This document is required to complete your reference check application.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}