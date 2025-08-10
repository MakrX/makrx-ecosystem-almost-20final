"use client";

import { useState, useEffect } from "react";
import { X, Filter, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { getAllFiltersForCategory, type CategoryFilter } from "@/data/categoryFilters";

interface FilterFacet {
  name: string;
  values: Array<{
    id: string;
    name: string;
    count?: number;
  }>;
}

interface EnhancedCategoryFiltersProps {
  // New interface for facet-based filtering
  facets?: FilterFacet[];
  activeFilters?: Record<string, string[]>;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onToggle?: () => void;

  // Legacy interface for category-based filtering
  category?: string;
  onFiltersChange?: (filters: any) => void;
  onClose?: () => void;

  // Common props
  isOpen: boolean;
  className?: string;
}

export default function EnhancedCategoryFilters({
  facets,
  activeFilters,
  onFilterChange,
  onToggle,
  category,
  onFiltersChange,
  onClose,
  isOpen,
  className = "",
}: EnhancedCategoryFiltersProps) {
  // Handle legacy category-based interface by loading actual filters
  if (category && onFiltersChange) {
    return <CategoryBasedFilters
      category={category}
      onFiltersChange={onFiltersChange}
      onClose={onClose}
      className={className}
    />;
  }
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["categories", "brands", "price", "material"])
  );

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const clearAllFilters = () => {
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const removeFilter = (filterType: string, value?: string) => {
    const newFilters = { ...(activeFilters || {}) };
    if (value) {
      if (Array.isArray(newFilters[filterType])) {
        newFilters[filterType] = newFilters[filterType].filter(
          (v: string) => v !== value
        );
        if (newFilters[filterType].length === 0) {
          delete newFilters[filterType];
        }
      }
    } else {
      delete newFilters[filterType];
    }
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const addFilter = (filterType: string, value: string) => {
    const safeActiveFilters = activeFilters || {};
    const currentValues = safeActiveFilters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    if (onFilterChange) {
      onFilterChange({
        ...safeActiveFilters,
        [filterType]: newValues.length > 0 ? newValues : undefined,
      });
    }
  };

  const hasActiveFilters = Object.keys(activeFilters || {}).length > 0;
  const activeFilterCount = Object.values(activeFilters || {}).flat().length;

  // Close drawer on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen && onToggle) {
        onToggle();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onToggle]);

  const FilterContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
          {activeFilterCount > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, values]) =>
              values.map((value: string) => (
                <span
                  key={`${key}-${value}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  <span className="font-medium capitalize">
                    {key.replace("_", " ")}:
                  </span>
                  <span>{value}</span>
                  <button
                    onClick={() => removeFilter(key, value)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto">
        {facets.map((facet) => (
          <div
            key={facet.name}
            className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <button
              onClick={() => toggleSection(facet.name)}
              className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {facet.name.replace("_", " ")}
                {activeFilters[facet.name]?.length > 0 && (
                  <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
                    {activeFilters[facet.name].length}
                  </span>
                )}
              </span>
              {expandedSections.has(facet.name) ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.has(facet.name) && (
              <div className="px-4 pb-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {facet.values?.map((value) => {
                    const isChecked = activeFilters[facet.name]?.includes(value.id) || false;
                    return (
                      <label
                        key={value.id}
                        className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => addFilter(facet.name, value.id)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300 flex-1">
                          {value.name}
                          {value.count !== undefined && (
                            <span className="text-gray-400 ml-1">
                              ({value.count})
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={onToggle}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop Left Rail */}
      <div className={`hidden lg:block ${className}`}>
        <div className="sticky top-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onToggle} />
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md">
              <div className="h-full bg-white dark:bg-gray-800 shadow-xl">
                <FilterContent />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Mobile Filter Toggle Hook
export function useFiltersToggle() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const toggleFilters = () => setIsFiltersOpen(!isFiltersOpen);
  const closeFilters = () => setIsFiltersOpen(false);

  // Show filters by default on desktop, hide on mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      setIsFiltersOpen(isDesktop);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFiltersOpen) {
        closeFilters();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFiltersOpen]);

  return {
    isFiltersOpen,
    toggleFilters,
    closeFilters,
  };
}
