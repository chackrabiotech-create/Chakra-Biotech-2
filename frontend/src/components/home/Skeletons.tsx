import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProductsSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <Skeleton className="h-4 w-24 mx-auto mb-2" />
          <Skeleton className="h-8 md:h-10 w-48 md:w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 md:w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-card p-0"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 md:p-5 space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogPreviewSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <Skeleton className="h-4 w-28 mx-auto mb-2" />
          <Skeleton className="h-8 md:h-10 w-56 md:w-80 mx-auto mb-4" />
          <Skeleton className="h-4 w-72 md:w-[500px] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-card"
            >
              <Skeleton className="w-full h-48 md:h-52" />
              <div className="p-4 md:p-6 space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl bg-muted/20">
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl space-y-6">
            <Skeleton className="h-6 w-32 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-10 md:h-16 w-full max-w-lg" />
              <Skeleton className="h-10 md:h-16 w-3/4 max-w-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-5/6 max-w-sm" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Skeleton className="h-12 w-40 rounded-lg" />
              <Skeleton className="h-12 w-40 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Indicators Skeleton */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        <Skeleton className="w-8 h-2 md:h-3 rounded-full" />
        <Skeleton className="w-3 h-2 md:h-3 rounded-full" />
        <Skeleton className="w-3 h-2 md:h-3 rounded-full" />
      </div>
    </section>
  );
}
