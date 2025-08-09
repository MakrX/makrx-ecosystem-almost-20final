'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Users, Package, Truck, Clock } from 'lucide-react';
import { api, type Product, type Category, formatPrice } from '@/lib/api';
import { DarkModeDemo } from '@/components/DarkModeDemo';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getFeaturedProducts(8),
          api.getCategories()
        ]);
        
        setFeaturedProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryClick = (category: Category) => {
    window.location.href = `/catalog/category/${category.slug}`;
  };

  const handleProductClick = (product: Product) => {
    window.location.href = `/product/${product.slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium 3D Printing
              <span className="block text-blue-200">Materials & Services</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              From high-quality filaments to professional printing services, 
              we're your one-stop shop for all 3D printing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/catalog"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Shop Products
              </Link>
              <Link
                href="/3d-printing"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Upload & Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground">
              Explore our comprehensive range of 3D printing materials and equipment
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="bg-card border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 text-center"
              >
                {category.image_url && (
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-card-foreground mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/catalog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View All Categories <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
              <p className="text-lg text-muted-foreground">
                Our most popular and highly-rated products
              </p>
            </div>
            <Link
              href="/catalog?is_featured=true"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View All Featured
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(featuredProducts || []).map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-card border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="aspect-square bg-muted relative">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  {product.sale_price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.short_description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-card-foreground">
                        {formatPrice(product.effective_price, product.currency)}
                      </span>
                      {product.sale_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.price, product.currency)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-muted-foreground ml-1">4.8</span>
                    </div>
                  </div>
                  {!product.in_stock && (
                    <div className="mt-2">
                      <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Professional 3D Printing Services</h2>
            <p className="text-lg text-muted-foreground">
              From prototypes to production, we bring your ideas to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Upload & Quote</h3>
              <p className="text-muted-foreground mb-6">
                Get instant pricing for your 3D models. Simply upload your file and
                receive a quote within minutes.
              </p>
              <Link
                href="/upload"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Get Quote
              </Link>
            </div>

            <div className="bg-card border border-border p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Fast Turnaround</h3>
              <p className="text-muted-foreground mb-6">
                Most prints completed within 24-48 hours. Rush orders available
                for urgent projects.
              </p>
              <Link
                href="/3d-printing"
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Learn More
              </Link>
            </div>

            <div className="bg-card border border-border p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Premium Quality</h3>
              <p className="text-muted-foreground mb-6">
                Professional-grade printers and materials ensure exceptional
                quality for every project.
              </p>
              <Link
                href="/sample-projects"
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View Samples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-blue-200 dark:text-blue-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-blue-200 dark:text-blue-300">Prints Delivered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24hr</div>
              <div className="text-blue-200 dark:text-blue-300">Average Turnaround</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-blue-200 dark:text-blue-300">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Mode Demo Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            🌙 NEW: Dark Mode Support!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Experience our enhanced interface with light, dark, and system theme options.
            Try the theme toggle in the header or use the demo below!
          </p>
          <DarkModeDemo />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you need materials for your own printer or professional printing services,
            we're here to help bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Shop Materials
            </Link>
            <Link
              href="/upload"
              className="bg-transparent border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors"
            >
              Upload File
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
