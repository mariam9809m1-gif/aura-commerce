import React from 'react';

interface CatalogSkeletonProps {
  count?: number;
}

export const CatalogSkeleton: React.FC<CatalogSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`catalog-skel-${i}`}
          className="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col"
        >
          <div className="w-full aspect-square bg-neutral-200" />
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="h-3 w-1/3 bg-neutral-200 rounded" />
              <div className="h-5 w-4/5 bg-neutral-200 rounded" />
              <div className="h-4 w-full bg-neutral-100 rounded" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <div className="h-6 w-1/4 bg-neutral-200 rounded" />
              <div className="h-9 w-24 bg-neutral-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="h-5 w-32 bg-neutral-200 rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="w-full aspect-square bg-neutral-200 rounded-3xl" />
        <div className="space-y-6">
          <div className="h-4 w-28 bg-neutral-200 rounded" />
          <div className="h-10 w-3/4 bg-neutral-200 rounded" />
          <div className="h-8 w-32 bg-neutral-200 rounded" />
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded" />
            <div className="h-4 w-2/3 bg-neutral-100 rounded" />
          </div>
          <div className="h-12 w-full bg-neutral-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-8">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-neutral-200 rounded" />
        <div className="h-10 w-36 bg-neutral-200 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`stat-skel-${i}`} className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3">
            <div className="h-4 w-24 bg-neutral-200 rounded" />
            <div className="h-8 w-36 bg-neutral-300 rounded" />
            <div className="h-3 w-28 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 h-80" />
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 h-80" />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 h-96" />
    </div>
  );
};
