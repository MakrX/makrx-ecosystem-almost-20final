"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Category } from "@/lib/api";

interface CategoryCarouselProps {
  categories: Category[];
  onCategorySelect?: (categoryId: number) => void;
  selectedCategoryId?: number;
}

export default function CategoryCarousel({
  categories,
  onCategorySelect,
  selectedCategoryId,
}: CategoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Number of visible categories based on screen size
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 6;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 768) return 3;
    if (window.innerWidth < 1024) return 4;
    if (window.innerWidth < 1280) return 5;
    return 6;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < categories.length - visibleCount;

  const scrollLeft = () => {
    if (canScrollLeft && !isScrolling) {
      setIsScrolling(true);
      setCurrentIndex(Math.max(0, currentIndex - 1));
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const scrollRight = () => {
    if (canScrollRight && !isScrolling) {
      setIsScrolling(true);
      setCurrentIndex(Math.min(categories.length - visibleCount, currentIndex + 1));
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category.id);
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
        <Link
          href="/catalog"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All Categories
        </Link>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft || isScrolling}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-200 ${
            canScrollLeft && !isScrolling
              ? "hover:bg-gray-50 hover:shadow-xl"
              : "opacity-50 cursor-not-allowed"
          }`}
          style={{ marginLeft: "-12px" }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight || isScrolling}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-200 ${
            canScrollRight && !isScrolling
              ? "hover:bg-gray-50 hover:shadow-xl"
              : "opacity-50 cursor-not-allowed"
          }`}
          style={{ marginRight: "-12px" }}
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>

        {/* Categories Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-hidden"
          style={{ 
            paddingLeft: "12px",
            paddingRight: "12px"
          }}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              width: `${(categories.length / visibleCount) * 100}%`,
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0"
                style={{ width: `${100 / categories.length}%` }}
              >
                <div
                  className={`group cursor-pointer transition-all duration-200 ${
                    selectedCategoryId === category.id
                      ? "transform scale-105"
                      : "hover:transform hover:scale-105"
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div
                    className={`relative rounded-lg overflow-hidden mb-3 ${
                      selectedCategoryId === category.id
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "group-hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                      
                      {/* Product Count Badge */}
                      {(category.product_count || (category as any).productCount) > 0 && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {category.product_count || (category as any).productCount}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center px-2">
                    <h3
                      className={`font-semibold text-sm mb-1 transition-colors duration-200 ${
                        selectedCategoryId === category.id
                          ? "text-blue-600"
                          : "text-gray-900 group-hover:text-blue-600"
                      }`}
                    >
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {category.description || `Explore ${category.name.toLowerCase()}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        {categories.length > visibleCount && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from(
              { length: Math.ceil(categories.length / visibleCount) },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isScrolling) {
                      setIsScrolling(true);
                      setCurrentIndex(index * visibleCount);
                      setTimeout(() => setIsScrolling(false), 300);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    Math.floor(currentIndex / visibleCount) === index
                      ? "bg-blue-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Featured Categories Quick Access */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.slice(0, 8).map((category) => (
            <button
              key={`quick-${category.id}`}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                selectedCategoryId === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
