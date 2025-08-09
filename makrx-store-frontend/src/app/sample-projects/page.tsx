'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft,
  Download,
  Eye,
  Clock,
  DollarSign,
  Ruler,
  Package,
  Star,
  Filter,
  Search,
  Play,
  Heart,
  Share,
  Printer,
  Zap,
  Wrench,
  Cpu
} from 'lucide-react'

export default function SampleProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const projects = [
    {
      id: 1,
      title: "Mechanical Keyboard Case",
      category: "electronics",
      image: "/api/placeholder/400/300",
      downloadUrl: "/downloads/keyboard-case.stl",
      difficulty: "Intermediate",
      printTime: "8 hours",
      material: "PLA",
      estimatedCost: "$12.50",
      rating: 4.8,
      downloads: 2847,
      description: "Custom mechanical keyboard case with RGB underglow support. Fits standard 60% layouts.",
      tags: ["Keyboard", "Electronics", "Gaming"],
      featured: true
    },
    {
      id: 2,
      title: "Articulated Dragon",
      category: "art",
      image: "/api/placeholder/400/300",
      downloadUrl: "/downloads/dragon.stl",
      difficulty: "Advanced",
      printTime: "15 hours",
      material: "PLA+",
      estimatedCost: "$8.75",
      rating: 4.9,
      downloads: 5621,
      description: "Fully articulated dragon with moveable joints. No supports needed!",
      tags: ["Dragon", "Articulated", "Decorative"],
      featured: true
    },
    {
      id: 3,
      title: "Phone Stand with Wireless Charging",
      category: "functional",
      image: "/api/placeholder/400/300",
      downloadUrl: "/downloads/phone-stand.stl",
      difficulty: "Beginner",
      printTime: "3 hours",
      material: "PETG",
      estimatedCost: "$4.20",
      rating: 4.7,
      downloads: 3892,
      description: "Adjustable phone stand with built-in wireless charging coil housing.",
      tags: ["Phone", "Wireless", "Desk Accessory"],
      featured: false
    },
    {
      id: 4,
      title: "Modular Toolbox System",
      category: "tools",
      image: "/api/placeholder/400/300",
      downloadUrl: "/downloads/toolbox.stl",
      difficulty: "Intermediate",
      printTime: "12 hours",
      material: "ABS",
      estimatedCost: "$18.90",
      rating: 4.6,
      downloads: 1923,
      description: "Stackable and modular toolbox system with customizable dividers.",
      tags: ["Tools", "Organization", "Modular"],
      featured: false
    },
    {
      id: 5,
      title: "Miniature Greenhouse",
      category: "hobby",
      image: "/api/placeholder/400/300",
      downloadUrl: "/downloads/greenhouse.stl",
      difficulty: "Intermediate",
      printTime: "6 hours",
      material: "Transparent PETG",
      estimatedCost: "$9.40",
      rating: 4.5,
      downloads: 1456,
      description: "Scale model greenhouse with opening windows and removable roof.",
      tags: ["Greenhouse", "Model", "Educational"],
      featured: false
    },
    {
      id: 6,
      title: "Gaming Headset Stand",
      category: "gaming",
      image: "/api/placeholder/400/300",
      downloadUrl: "/downloads/headset-stand.stl",
      difficulty: "Beginner",
      printTime: "4 hours",
      material: "PLA",
      estimatedCost: "$5.60",
      rating: 4.4,
      downloads: 2756,
      description: "Ergonomic headset stand with cable management and RGB accent lighting.",
      tags: ["Gaming", "Headset", "RGB"],
      featured: false
    }
  ]

  const categories = [
    { value: 'all', label: 'All Projects', icon: Package },
    { value: 'functional', label: 'Functional', icon: Wrench },
    { value: 'electronics', label: 'Electronics', icon: Cpu },
    { value: 'gaming', label: 'Gaming', icon: Zap },
    { value: 'art', label: 'Art & Decor', icon: Star },
    { value: 'tools', label: 'Tools', icon: Wrench },
    { value: 'hobby', label: 'Hobby', icon: Heart }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredProjects = projects.filter(project => project.featured)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-800 bg-green-100'
      case 'Intermediate': return 'text-yellow-800 bg-yellow-100'
      case 'Advanced': return 'text-red-800 bg-red-100'
      default: return 'text-gray-800 bg-gray-100'
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-store-text">Sample Projects</h1>
                  <p className="text-store-text-muted mt-1">Free STL files to get you started with 3D printing</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share Collection
                </Button>
                <Link href="/3d-printing">
                  <Button className="font-semibold">
                    <Printer className="h-4 w-4 mr-2" />
                    Print These Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-store-text mb-6">Featured Projects</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-store-primary to-store-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                          <Share className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(project.difficulty)}`}>
                          {project.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-store-text mb-2">{project.title}</h3>
                      <p className="text-store-text-muted mb-4">{project.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center text-store-text-light">
                          <Clock className="h-4 w-4 mr-2" />
                          {project.printTime}
                        </div>
                        <div className="flex items-center text-store-text-light">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {project.estimatedCost}
                        </div>
                        <div className="flex items-center text-store-text-light">
                          <Package className="h-4 w-4 mr-2" />
                          {project.material}
                        </div>
                        <div className="flex items-center text-store-text-light">
                          <Download className="h-4 w-4 mr-2" />
                          {project.downloads.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(project.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-store-text-muted">{project.rating}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="font-semibold">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects, materials, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-store-primary focus:border-store-primary bg-white text-store-text font-medium"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-store-primary text-white'
                          : 'bg-gray-100 text-store-text hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-store-text mb-2">{project.title}</h3>
                  <p className="text-store-text-muted text-sm mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="flex items-center text-store-text-light">
                      <Clock className="h-3 w-3 mr-1" />
                      {project.printTime}
                    </div>
                    <div className="flex items-center text-store-text-light">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {project.estimatedCost}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center mr-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(project.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-store-text-muted">{project.rating}</span>
                    </div>
                    <span className="text-xs text-store-text-muted">
                      {project.downloads.toLocaleString()} downloads
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1 font-semibold">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-store-text mb-2">No projects found</h3>
              <p className="text-store-text-muted mb-6">Try adjusting your search or filter criteria.</p>
              <Button 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-store-primary to-store-secondary rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Print These Projects?</h2>
            <p className="text-lg mb-6 text-white/90">
              Upload any STL file to our 3D printing service and get instant quotes from verified local providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link href="/3d-printing">
                <Button size="lg" className="bg-white text-store-primary font-semibold hover:bg-gray-100 w-full sm:w-auto">
                  <Printer className="mr-2 h-5 w-5" />
                  Start Printing
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-white text-white font-semibold hover:bg-white hover:text-store-primary w-full sm:w-auto">
                <Play className="mr-2 h-5 w-5" />
                Watch Tutorial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
