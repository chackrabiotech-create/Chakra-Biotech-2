"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedImage } from "@/components/ui/animated-image";
import { useProductsStore } from "@/lib/store";
import { useCompanyData } from "@/hooks/use-company-data";

import { FeaturedProductsSkeleton } from "./Skeletons";

export function FeaturedProducts() {
  const { products, loading, fetchProducts } = useProductsStore();
  const { whatsappNumber } = useCompanyData();

  useEffect(() => {
    fetchProducts({ featured: true, limit: 4 });
  }, []);

  const handleOrder = (product: (typeof products)[0]) => {
    const message = `Hello! I want to order ${product.name} – ${product.weight || "1g"
      } (₹${product.price.toLocaleString()})`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return <FeaturedProductsSkeleton />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cream-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-primary font-medium text-sm md:text-base">
            Our Collection
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mt-2">
            Featured Products
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm md:text-base">
            Explore our handpicked selection of the world's finest saffron
            varieties
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
                  delay={index * 0.1}
                />
                {product.badge && (
                  <span className="absolute top-3 md:top-4 left-3 md:left-4 px-2 md:px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4 md:p-5">
                {product.grade && (
                  <span className="text-xs text-primary font-medium">
                    {product.grade}
                  </span>
                )}
                <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mt-1 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg md:text-xl font-bold text-primary">
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
                  className="w-full mt-4 text-sm md:text-base"
                  variant="default"
                  size="sm"
                >
                  <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  Order Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            asChild
            className="text-sm md:text-base"
          >
            <Link href="/products">
              View All Products
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
