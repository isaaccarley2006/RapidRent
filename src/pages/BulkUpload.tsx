import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useDropzone } from 'react-dropzone'
import { Loader2, ArrowLeft, Upload, Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import Papa from 'papaparse'

interface PropertyData {
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  property_type: string
  furnished: boolean
  status: string
  row?: number
}

interface ValidationError {
  row: number
  field: string
  message: string
}

interface UploadResult {
  successful: number
  failed: number
  errors: ValidationError[]
}

const BulkUpload: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [parsedData, setParsedData] = useState<PropertyData[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  const validateProperty = (property: any, row: number): ValidationError[] => {
    const errors: ValidationError[] = []

    if (!property.title || property.title.trim() === '') {
      errors.push({ row, field: 'title', message: 'Title is required' })
    }

    if (!property.price || isNaN(parseFloat(property.price))) {
      errors.push({ row, field: 'price', message: 'Valid price is required' })
    }

    if (!property.location || property.location.trim() === '') {
      errors.push({ row, field: 'location', message: 'Location is required' })
    }

    if (property.bedrooms && isNaN(parseInt(property.bedrooms))) {
      errors.push({ row, field: 'bedrooms', message: 'Bedrooms must be a number' })
    }

    if (property.bathrooms && isNaN(parseInt(property.bathrooms))) {
      errors.push({ row, field: 'bathrooms', message: 'Bathrooms must be a number' })
    }

    const validPropertyTypes = ['apartment', 'house', 'studio', 'flat', 'penthouse', 'townhouse']
    if (property.property_type && !validPropertyTypes.includes(property.property_type.toLowerCase())) {
      errors.push({ row, field: 'property_type', message: `Property type must be one of: ${validPropertyTypes.join(', ')}` })
    }

    const validStatuses = ['listed', 'unlisted', 'rented']
    if (property.status && !validStatuses.includes(property.status.toLowerCase())) {
      errors.push({ row, field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` })
    }

    return errors
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (fileExtension !== 'csv') {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      })
      return
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const properties: PropertyData[] = []
        const errors: ValidationError[] = []

        results.data.forEach((row: any, index: number) => {
          const rowNumber = index + 2 // +2 because index starts at 0 and we have header row
          
          // Skip empty rows
          if (!row.title && !row.price && !row.location) return

          const validationErrors = validateProperty(row, rowNumber)
          errors.push(...validationErrors)

          const property: PropertyData = {
            title: row.title?.trim() || '',
            description: row.description?.trim() || '',
            price: parseFloat(row.price) || 0,
            location: row.location?.trim() || '',
            bedrooms: parseInt(row.bedrooms) || 0,
            bathrooms: parseInt(row.bathrooms) || 1,
            property_type: row.property_type?.toLowerCase() || 'apartment',
            furnished: row.furnished?.toLowerCase() === 'true' || row.furnished?.toLowerCase() === 'yes',
            status: row.status?.toLowerCase() || 'listed',
            row: rowNumber
          }

          properties.push(property)
        })

        setParsedData(properties)
        setValidationErrors(errors)
        setUploadResult(null)

        toast({
          title: "File parsed",
          description: `Found ${properties.length} properties with ${errors.length} validation errors.`
        })
      },
      error: (error) => {
        toast({
          title: "Parse error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive"
        })
      }
    })
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  })

  const uploadProperties = async () => {
    if (!user || parsedData.length === 0) return

    setUploading(true)
    setProgress(0)

    const validProperties = parsedData.filter(prop => 
      !validationErrors.some(error => error.row === prop.row)
    )

    let successful = 0
    let failed = 0
    const uploadErrors: ValidationError[] = []

    for (let i = 0; i < validProperties.length; i++) {
      const property = validProperties[i]
      
      try {
        const { error } = await supabase
          .from('properties')
          .insert([{
            title: property.title,
            description: property.description,
            price: property.price,
            location: property.location,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            property_type: property.property_type,
            furnished: property.furnished,
            status: property.status,
            landlord_id: user.id,
            images: []
          }])

        if (error) throw error
        successful++
      } catch (error) {
        failed++
        uploadErrors.push({
          row: property.row || i + 1,
          field: 'general',
          message: error instanceof Error ? error.message : 'Upload failed'
        })
      }

      setProgress(((i + 1) / validProperties.length) * 100)
    }

    setUploadResult({ successful, failed, errors: uploadErrors })
    setUploading(false)

    toast({
      title: "Upload complete",
      description: `${successful} properties uploaded successfully, ${failed} failed.`,
      variant: failed > 0 ? "destructive" : "default"
    })
  }

  const downloadTemplate = () => {
    const template = `title,description,price,location,bedrooms,bathrooms,property_type,furnished,status
Modern 2-bedroom apartment,Beautiful apartment in city center,1200,Manchester M1 2AB,2,1,apartment,true,listed
Victorian house,Charming period property,1500,London SW1A 1AA,3,2,house,false,listed`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-upload-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const canUpload = parsedData.length > 0 && validationErrors.length === 0 && !uploading

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Property Upload</CardTitle>
            <CardDescription>
              Upload multiple properties at once using a CSV file. Download the template to get started.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Template Download */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-medium">Download CSV Template</h3>
                <p className="text-sm text-muted-foreground">
                  Use this template to format your property data correctly
                </p>
              </div>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>

            <Separator />

            {/* File Upload */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p>Drop the CSV file here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop a CSV file here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Only CSV files are accepted
                  </p>
                </div>
              )}
            </div>

            {/* Validation Results */}
            {parsedData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {validationErrors.length === 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                    Validation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <Badge variant="default">
                      {parsedData.length} properties found
                    </Badge>
                    {validationErrors.length > 0 && (
                      <Badge variant="destructive">
                        {validationErrors.length} errors
                      </Badge>
                    )}
                  </div>

                  {validationErrors.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Please fix the validation errors before uploading:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {validationErrors.slice(0, 10).map((error, index) => (
                            <li key={index} className="text-sm">
                              Row {error.row}, {error.field}: {error.message}
                            </li>
                          ))}
                          {validationErrors.length > 10 && (
                            <li className="text-sm font-medium">
                              ...and {validationErrors.length - 10} more errors
                            </li>
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upload Progress */}
            {uploading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading properties...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Results */}
            {uploadResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {uploadResult.failed === 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    Upload Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <Badge variant="default">
                      {uploadResult.successful} successful
                    </Badge>
                    {uploadResult.failed > 0 && (
                      <Badge variant="destructive">
                        {uploadResult.failed} failed
                      </Badge>
                    )}
                  </div>

                  {uploadResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        Upload errors:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {uploadResult.errors.map((error, index) => (
                            <li key={index} className="text-sm">
                              Row {error.row}: {error.message}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upload Button */}
            <Button 
              onClick={uploadProperties}
              disabled={!canUpload}
              className="w-full"
              size="lg"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload {parsedData.length} Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BulkUpload