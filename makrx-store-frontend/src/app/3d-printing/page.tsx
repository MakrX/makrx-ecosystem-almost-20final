'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { 
  Upload, 
  File, 
  X, 
  Printer3D, 
  Clock, 
  DollarSign, 
  Ruler,
  Package,
  Star,
  MapPin,
  ChevronDown,
  Info
} from 'lucide-react'
import { formatFileSize, validateSTLFile } from '@/lib/utils'

interface UploadedFile {
  file: File
  id: string
  preview?: string
}

interface PrintQuote {
  material: string
  quality: string
  infill: number
  support: boolean
  price: number
  printTime: number
  volume: number
  providerId: string
  providerName: string
  providerRating: number
  distance: number
}

export default function PrintingHubPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState('PLA')
  const [selectedQuality, setSelectedQuality] = useState('Standard')
  const [infillPercentage, setInfillPercentage] = useState(15)
  const [needsSupport, setNeedsSupport] = useState(false)
  const [quotes, setQuotes] = useState<PrintQuote[]>([])
  const [isGettingQuotes, setIsGettingQuotes] = useState(false)

  const materials = [
    { name: 'PLA', price: 0.025, description: 'Easy to print, biodegradable' },
    { name: 'ABS', price: 0.030, description: 'Strong, heat resistant' },
    { name: 'PETG', price: 0.035, description: 'Chemical resistant, clear' },
    { name: 'TPU', price: 0.050, description: 'Flexible, rubber-like' },
    { name: 'Wood Fill', price: 0.040, description: 'Wood-like appearance' },
    { name: 'Metal Fill', price: 0.080, description: 'Heavy, metallic finish' },
  ]

  const qualities = [
    { name: 'Draft', layer: '0.3mm', description: 'Fast, rough finish' },
    { name: 'Standard', layer: '0.2mm', description: 'Good balance of speed and quality' },
    { name: 'High', layer: '0.1mm', description: 'Slow, smooth finish' },
    { name: 'Ultra', layer: '0.05mm', description: 'Very slow, finest detail' },
  ]

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const validation = validateSTLFile(file)
      if (validation.valid) {
        const newFile: UploadedFile = {
          file,
          id: Math.random().toString(36).substr(2, 9),
        }
        setUploadedFiles(prev => [...prev, newFile])
      } else {
        alert(validation.error)
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.stl'],
      'model/stl': ['.stl'],
    },
    multiple: true,
  })

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const getQuotes = async () => {
    if (uploadedFiles.length === 0) return
    
    setIsGettingQuotes(true)
    
    // Simulate API call for quotes
    setTimeout(() => {
      const mockQuotes: PrintQuote[] = [
        {
          material: selectedMaterial,
          quality: selectedQuality,
          infill: infillPercentage,
          support: needsSupport,
          price: 25.99,
          printTime: 4.5,
          volume: 12.5,
          providerId: '1',
          providerName: 'TechPrint Solutions',
          providerRating: 4.9,
          distance: 2.3
        },
        {
          material: selectedMaterial,
          quality: selectedQuality,
          infill: infillPercentage,
          support: needsSupport,
          price: 28.50,
          printTime: 4.2,
          volume: 12.5,
          providerId: '2',
          providerName: 'MakerSpace Pro',
          providerRating: 4.8,
          distance: 5.1
        },
        {
          material: selectedMaterial,
          quality: selectedQuality,
          infill: infillPercentage,
          support: needsSupport,
          price: 22.75,
          printTime: 5.1,
          volume: 12.5,
          providerId: '3',
          providerName: 'Rapid Prototypes',
          providerRating: 4.7,
          distance: 8.7
        }
      ]
      setQuotes(mockQuotes)
      setIsGettingQuotes(false)
    }, 2000)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <section className="py-16 bg-gradient-to-r from-store-primary to-store-secondary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                3D Printing Hub
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8">
                Upload your designs, get instant quotes, and have them printed by verified local providers
              </p>
              <div className="flex items-center justify-center space-x-8 text-white/90">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Instant Quotes
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Local Providers
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Verified Quality
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Upload & Settings */}
            <div className="space-y-8">
              {/* File Upload */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Upload className="h-6 w-6 mr-2 text-store-primary" />
                  Upload Your Files
                </h2>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragActive 
                      ? 'border-store-primary bg-store-primary/5' 
                      : 'border-gray-300 hover:border-store-primary hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Printer3D className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-store-primary font-medium">Drop your STL files here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop your STL files here, or <span className="text-store-primary font-medium">browse</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports STL files up to 100MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-medium text-gray-900">Uploaded Files:</h3>
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{file.file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Print Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Printer3D className="h-6 w-6 mr-2 text-store-primary" />
                  Print Settings
                </h2>
                
                <div className="space-y-6">
                  {/* Material Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Material
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {materials.map((material) => (
                        <button
                          key={material.name}
                          onClick={() => setSelectedMaterial(material.name)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedMaterial === material.name
                              ? 'border-store-primary bg-store-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-500">{material.description}</div>
                          <div className="text-sm font-medium text-store-primary">
                            ${material.price}/cm³
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Print Quality
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {qualities.map((quality) => (
                        <button
                          key={quality.name}
                          onClick={() => setSelectedQuality(quality.name)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedQuality === quality.name
                              ? 'border-store-primary bg-store-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{quality.name}</div>
                          <div className="text-sm text-gray-500">{quality.layer}</div>
                          <div className="text-sm text-gray-500">{quality.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Infill Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Infill: {infillPercentage}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={infillPercentage}
                      onChange={(e) => setInfillPercentage(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Light (faster)</span>
                      <span>Solid (stronger)</span>
                    </div>
                  </div>

                  {/* Support Material */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={needsSupport}
                        onChange={(e) => setNeedsSupport(e.target.checked)}
                        className="rounded border-gray-300 text-store-primary focus:ring-store-primary"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Add support material
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 ml-6">
                      Recommended for overhangs and complex geometries
                    </p>
                  </div>
                </div>

                <Button
                  onClick={getQuotes}
                  disabled={uploadedFiles.length === 0 || isGettingQuotes}
                  loading={isGettingQuotes}
                  className="w-full mt-6"
                  size="lg"
                >
                  {isGettingQuotes ? 'Getting Quotes...' : 'Get Instant Quotes'}
                </Button>
              </div>
            </div>

            {/* Right Column - Quotes & Providers */}
            <div className="space-y-8">
              {quotes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <Printer3D className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Upload files to get quotes
                  </h3>
                  <p className="text-gray-500">
                    Once you upload your STL files and configure print settings, 
                    you'll see instant quotes from verified local providers.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <DollarSign className="h-6 w-6 mr-2 text-store-primary" />
                    Instant Quotes ({quotes.length})
                  </h2>
                  
                  <div className="space-y-4">
                    {quotes.map((quote, index) => (
                      <div 
                        key={quote.providerId}
                        className="border border-gray-200 rounded-lg p-4 hover:border-store-primary transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{quote.providerName}</h3>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < Math.floor(quote.providerRating) 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-2">
                                {quote.providerRating} • {quote.distance} miles away
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-store-primary">
                              ${quote.price}
                            </div>
                            {index === 0 && (
                              <span className="inline-block bg-store-success text-white text-xs px-2 py-1 rounded-full mt-1">
                                Best Price
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {quote.printTime}h
                          </div>
                          <div className="flex items-center">
                            <Ruler className="h-4 w-4 mr-1" />
                            {quote.volume} cm³
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            {quote.material}
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">
                            View Details
                          </Button>
                          <Button className="flex-1">
                            Select Provider
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How It Works */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-store-primary" />
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-store-primary rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 mt-1">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Upload Your Design</h4>
                      <p className="text-sm text-gray-600">Upload STL files and configure print settings</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-store-primary rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 mt-1">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Compare Quotes</h4>
                      <p className="text-sm text-gray-600">Get instant quotes from verified local providers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-store-primary rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 mt-1">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Place Order</h4>
                      <p className="text-sm text-gray-600">Choose your provider and place your order</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-store-primary rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 mt-1">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Get Your Print</h4>
                      <p className="text-sm text-gray-600">Pickup locally or have it shipped to you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
