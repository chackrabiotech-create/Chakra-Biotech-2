"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  BackgroundWrapper,
  backgroundPresets,
} from "@/components/ui/background-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Grid3X3,
  Grid2X2,
  List,
  Search,
  X,
  ZoomIn,
  Share2,
  Heart,
  Eye,
  Calendar,
  MapPin,
  Camera,
  Loader2,
} from "lucide-react";

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  image: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags?: string[];
  location?: string;
  date?: string;
  photographer?: string;
  views: number;
  likes: number;
  isPublished: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "masonry" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedImages, setLikedImages] = useState<string[]>([]);

  useEffect(() => {
    loadGallery();
    loadCategories();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery`
      );
      const data = await response.json();
      if (data.success) {
        setImages(data.data.images || []);
      }
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery-categories`
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const filteredImages = images.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category._id === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const toggleLike = async (imageId: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/${imageId}/like`,
        {
          method: "POST",
        }
      );
      setLikedImages((prev) =>
        prev.includes(imageId)
          ? prev.filter((id) => id !== imageId)
          : [...prev, imageId]
      );
    } catch (error) {
      console.error("Failed to like image:", error);
    }
  };

  const handleShare = (image: GalleryImage) => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: image.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const categoryOptions = [
    { id: "all", name: "All Photos", count: images.length },
    ...categories.map((cat) => ({
      id: cat._id,
      name: cat.name,
      count: images.filter((img) => img.category._id === cat._id).length,
    })),
  ];

  if (loading) {
    return (
      <BackgroundWrapper
        backgroundImage={backgroundPresets.hero.image}
        overlayOpacity={0.95}
        blurAmount="md"
        animationType="fade"
      >
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        </Layout>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper
      backgroundImage={backgroundPresets.hero.image}
      overlayOpacity={0.95}
      blurAmount="md"
      animationType="fade"
    >
      <Layout>
        {/* Header */}
        <section className="py-16 bg-gradient-hero pattern-saffron">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Camera className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                Saffron <span className="text-gradient-saffron">Gallery</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-4 max-w-xl mx-auto"
            >
              Explore our stunning collection of saffron photography, from
              harvest to table
            </motion.p>
          </div>
        </section>

        {/* Controls */}
        <section className="py-8 bg-card/80 backdrop-blur-sm border-b border-border sticky top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    {category.name}
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "masonry" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("masonry")}
                >
                  <Grid2X2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${viewMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`
                  ${
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : ""
                  }
                  ${
                    viewMode === "masonry"
                      ? "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                      : ""
                  }
                  ${viewMode === "list" ? "space-y-6" : ""}
                `}
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`
                      group cursor-pointer
                      ${
                        viewMode === "list"
                          ? "flex gap-6 bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated"
                          : ""
                      }
                      ${
                        viewMode !== "list"
                          ? "bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated"
                          : ""
                      }
                    `}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div
                      className={`
                      relative overflow-hidden
                      ${
                        viewMode === "list"
                          ? "w-64 h-48 flex-shrink-0"
                          : "aspect-square"
                      }
                    `}
                    >
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">{image.views}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLike(image._id);
                                }}
                                className="text-white hover:text-red-500"
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    likedImages.includes(image._id)
                                      ? "fill-red-500 text-red-500"
                                      : ""
                                  }`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(image);
                                }}
                                className="text-white hover:text-primary"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:text-primary"
                              >
                                <ZoomIn className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <Badge className="absolute top-4 left-4 capitalize">
                        {image.category.name}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div
                      className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {image.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {image.description}
                      </p>

                      {(image.location || image.date || image.photographer) && (
                        <div className="space-y-2 text-xs text-muted-foreground">
                          {image.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{image.location}</span>
                            </div>
                          )}
                          {image.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>{image.date}</span>
                            </div>
                          )}
                          {image.photographer && (
                            <div className="flex items-center gap-2">
                              <Camera className="w-3 h-3" />
                              <span>{image.photographer}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-4">
                          {image.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {image.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {image.likes +
                              (likedImages.includes(image._id) ? 1 : 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredImages.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No photos found matching your criteria.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl max-h-[90vh] bg-card rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 text-white hover:bg-black/20"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                <div className="grid lg:grid-cols-2">
                  <div className="relative">
                    <img
                      src={selectedImage.image}
                      alt={selectedImage.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8">
                    <Badge className="mb-4 capitalize">
                      {selectedImage.category.name}
                    </Badge>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                      {selectedImage.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {selectedImage.description}
                    </p>

                    <div className="space-y-4 mb-6">
                      {selectedImage.location && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{selectedImage.location}</span>
                        </div>
                      )}
                      {selectedImage.date && (
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{selectedImage.date}</span>
                        </div>
                      )}
                      {selectedImage.photographer && (
                        <div className="flex items-center gap-3 text-sm">
                          <Camera className="w-4 h-4 text-primary" />
                          <span>{selectedImage.photographer}</span>
                        </div>
                      )}
                    </div>

                    {selectedImage.tags && selectedImage.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedImage.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {selectedImage.views} views
                        </span>
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          {selectedImage.likes +
                            (likedImages.includes(selectedImage._id)
                              ? 1
                              : 0)}{" "}
                          likes
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLike(selectedImage._id)}
                        >
                          <Heart
                            className={`w-4 h-4 mr-2 ${
                              likedImages.includes(selectedImage._id)
                                ? "fill-red-500 text-red-500"
                                : ""
                            }`}
                          />
                          Like
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(selectedImage)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </BackgroundWrapper>
  );
}
