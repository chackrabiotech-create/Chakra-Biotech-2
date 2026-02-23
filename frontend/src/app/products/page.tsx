"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  BackgroundWrapper,
  backgroundPresets,
} from "@/components/ui/background-wrapper";
import { Button } from "@/components/ui/button";
import { AnimatedImage } from "@/components/ui/animated-image";
import { ShoppingBag, Filter, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProductsStore, useCategoriesStore } from "@/lib/store";
import { useCompanyData } from "@/hooks/use-company-data";

export default function Products() {
  const {
    products,
    loading,
    error,
    selectedCategory,
    fetchProducts,
    setSelectedCategory,
  } = useProductsStore();

  const { productCategories, fetchProductCategories } = useCategoriesStore();
  const { whatsappNumber } = useCompanyData();

  useEffect(() => {
    fetchProducts({ page: 1, limit: 100 });
    fetchProductCategories();
  }, []);

  const handleOrder = (product: (typeof products)[0]) => {
    const message = `Hello! I want to order ${product.name} – ${product.weight || "1g"
      } (₹${product.price.toLocaleString()})`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <BackgroundWrapper
      backgroundImage={backgroundPresets.product.image}
      overlayOpacity={0.95}
      blurAmount="md"
      animationType="fade"
    >
      <Layout>
        {/* Header */}
        <section className="py-12 md:py-16 bg-gradient-hero pattern-saffron">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground"
            >
              Our <span className="text-gradient-saffron">Products</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm md:text-base"
            >
              Discover the world's finest saffron varieties, handpicked for
              quality and authenticity
            </motion.p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 md:py-8 bg-card border-b border-border sticky top-16 md:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs md:text-sm"
                >
                  All
                </Button>
                {productCategories.map((category) => (
                  <Button
                    key={category._id}
                    variant={
                      selectedCategory === category._id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category._id)}
                    className="text-xs md:text-sm"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => fetchProducts()}>Try Again</Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No products found.</p>
                <Button
                  variant="link"
                  onClick={() => setSelectedCategory(null)}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <AnimatedImage
                        src={
                          product.featuredImage ||
                          product.images[0] ||
                          "/product-saffron-jar.jpg"
                        }
                        alt={product.name}
                        className="w-full h-full"
                        animationType="zoom"
                        hoverScale={1.1}
                        delay={index * 0.05}
                      />
                      {product.badge && (
                        <span className="absolute top-3 md:top-4 left-3 md:left-4 px-2 md:px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                          {product.badge}
                        </span>
                      )}
                      <div className="absolute top-3 md:top-4 right-3 md:right-4 flex items-center gap-1 bg-card/90 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        <span className="text-xs font-medium">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        {product.grade && (
                          <span className="text-xs text-primary font-medium">
                            {product.grade}
                          </span>
                        )}
                        {product.origin && (
                          <>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {product.origin}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div>
                          <span className="text-xl md:text-2xl font-bold text-primary">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.weight && (
                            <span className="text-xs md:text-sm text-muted-foreground ml-2">
                              / {product.weight}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleOrder(product)}
                        className="w-full mb-2 text-sm md:text-base"
                        size="sm"
                      >
                        <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Order on WhatsApp
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full text-sm md:text-base"
                        size="sm"
                      >
                        <Link href={`/products/${product.slug}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </Layout>
    </BackgroundWrapper>
  );
}
