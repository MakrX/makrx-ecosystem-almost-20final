"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGallery from "@/components/ProductGallery";
import ProductSpecs from "@/components/ProductSpecs";
import ProductReviews from "@/components/ProductReviews";
import RecommendedProducts from "@/components/RecommendedProducts";
import AddToCartForm from "@/components/AddToCartForm";
import CompatibilityInfo from "@/components/CompatibilityInfo";
import ProductVariantSelector, { useProductVariants } from "@/components/ProductVariantSelector";
import { ProductStructuredData, OrganizationStructuredData } from "@/components/StructuredData";
import { ProductSEO } from "@/components/SEOMetaTags";
import { api } from "@/lib/api";
import ProductStructuredDataClient from "@/components/ProductStructuredData";

interface Product {
  id: number;
  slug: string;
  name: string;
  brand?: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  currency: string;
  stock_qty: number;
  in_stock: boolean;
  is_featured: boolean;
  images: string[];
  attributes: Record<string, any>;
  specifications: Record<string, any>;
  compatibility: string[];
  tags: string[];
  category: {
    id: number;
    name: string;
    slug: string;
    path: string;
  };
  rating?: {
    average: number;
    count: number;
    verified_count?: number;
  };
  variants?: Array<{
    id: number;
    sku: string;
    attributes: Record<string, string>;
    price: number;
    sale_price?: number;
    stock_qty: number;
  }>;
  created_at: string;
  updated_at: string;
}

interface RelatedProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  sale_price?: number;
  images: string[];
  rating?: {
    average: number;
    count: number;
  };
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [complementaryProducts, setComplementaryProducts] = useState<
    RelatedProduct[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ name: string; href: string }>
  >([]);

  // Enhanced variant handling
  const {
    selectedVariant,
    selectedAttributes,
    handleVariantChange,
    canAddToCart,
    isInStock,
    currentPrice,
  } = useProductVariants(product?.variants || []);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Fetch product details using API client
        const productData = await api.getProductBySlug(slug);
        setProduct(productData);

        // Build breadcrumbs
        const crumbs = [{ name: "Home", href: "/" }];
        if (productData.category?.slug) {
          // Use category slug to build breadcrumb
          const categoryName = productData.category.name;
          crumbs.push({ name: categoryName, href: `/catalog/${productData.category.slug}` });
        }
        crumbs.push({ name: productData.name, href: `/p/${productData.slug}` });
        setBreadcrumbs(crumbs);

        // For now, set empty related products since we don't have recommendation API
        // TODO: Implement recommendation system
        setRelatedProducts([]);
        setComplementaryProducts([]);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const effectivePrice = currentPrice || product.sale_price || product.price;
  const originalPrice = selectedVariant?.price || product.price;

  const isOnSale = product.sale_price && product.sale_price < product.price;
  const stockStatus = product.stock_qty > 0 ? "In Stock" : "Out of Stock";
  const estimatedDelivery =
    product.stock_qty > 0 ? "2-3 business days" : "Backordered - 1-2 weeks";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            <ProductGallery
              images={product.images || ["/placeholder.svg"]}
              productName={product.name}
              selectedImage={selectedImage}
              onImageChange={setSelectedImage}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  by{" "}
                  <Link
                    href={`/brands/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {product.brand}
                  </Link>
                </p>
              )}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating!.average) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating.average.toFixed(1)} ({product.rating.count}{" "}
                    reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {product.short_description}
              </p>
            )}


            {/* Stock Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${product.stock_qty > 0 ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span
                  className={`text-sm font-medium ${product.stock_qty > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {stockStatus}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Delivery: {estimatedDelivery}
              </span>
            </div>

            {/* Enhanced Variant Selection */}
            {product.variants && product.variants.length > 0 ? (
              <ProductVariantSelector
                variants={product.variants}
                onVariantChange={handleVariantChange}
                basePrice={product.price}
                currency={product.currency}
              />
            ) : (
              /* Price Display for Non-Variant Products */
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {product.currency === "INR" ? "₹" : "$"}
                  {effectivePrice.toLocaleString()}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {product.currency === "INR" ? "₹" : "$"}
                      {originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm font-medium">
                      {Math.round(
                        ((originalPrice - effectivePrice) / originalPrice) * 100
                      )}% OFF
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartForm
              productId={product.id}
              variantId={selectedVariant?.id || null}
              maxQuantity={selectedVariant?.stock_qty || product.stock_qty}
              inStock={product.variants?.length > 0 ? canAddToCart : product.stock_qty > 0}
            />

            {/* Key Features */}
            {product.attributes &&
              Object.keys(product.attributes).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(product.attributes)
                      .slice(0, 6)
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/_/g, " ")}:
                          </span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Compatibility */}
            {product.compatibility && product.compatibility.length > 0 && (
              <CompatibilityInfo
                compatibility={product.compatibility}
                productId={product.id}
              />
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button className="border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 py-2 px-1 text-sm font-medium">
                Description
              </button>
              <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium">
                Specifications
              </button>
              <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium">
                Reviews ({product.rating?.count || 0})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Similar Products
            </h2>
            <RecommendedProducts products={relatedProducts} />
          </div>
        )}

        {/* Frequently Bought Together */}
        {complementaryProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Bought Together
            </h2>
            <RecommendedProducts products={complementaryProducts} />
          </div>
        )}
      </div>

      {/* Structured Data for SEO */}
      {typeof window !== 'undefined' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              description: product.short_description || product.description,
              brand: {
                "@type": "Brand",
                name: product.brand,
              },
              image: product.images,
              offers: {
                "@type": "Offer",
                url: `${window.location.origin}/p/${product.slug}`,
                priceCurrency: product.currency,
                price: effectivePrice,
                availability:
                  product.stock_qty > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                seller: {
                  "@type": "Organization",
                  name: "MakrX Store",
                },
              },
              aggregateRating: product.rating
                ? {
                    "@type": "AggregateRating",
                    ratingValue: product.rating.average,
                    reviewCount: product.rating.count,
                  }
                : undefined,
            }),
          }}
        />
      )}
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/c"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
