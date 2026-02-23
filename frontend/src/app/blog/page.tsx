"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  BackgroundWrapper,
  backgroundPresets,
} from "@/components/ui/background-wrapper";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogsStore, useCategoriesStore } from "@/lib/store";

export default function Blog() {
  const {
    blogs,
    loading,
    error,
    selectedCategory,
    fetchBlogs,
    setSelectedCategory,
  } = useBlogsStore();

  const { blogCategories, fetchBlogCategories } = useCategoriesStore();

  useEffect(() => {
    fetchBlogs({ page: 1, limit: 100 });
    fetchBlogCategories();
  }, []);

  const featuredPost = blogs.find((b) => b.isPublished);
  const regularPosts = blogs.filter(
    (b) => b.isPublished && b._id !== featuredPost?._id
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <BackgroundWrapper
      backgroundImage={backgroundPresets.tea.image}
      overlayOpacity={0.92}
      blurAmount="lg"
      animationType="slide"
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
              Saffron <span className="text-gradient-saffron">Journal</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm md:text-base"
            >
              Explore articles on saffron cultivation, health benefits, recipes,
              and more
            </motion.p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-4 md:py-6 bg-card border-b border-border sticky top-16 md:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-xs md:text-sm"
              >
                All
              </Button>
              {blogCategories.map((category) => (
                <Button
                  key={category._id}
                  variant={
                    selectedCategory === category._id ? "default" : "ghost"
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
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchBlogs()}>Try Again</Button>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="py-8 md:py-12 bg-background">
                <div className="container mx-auto px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center bg-card rounded-2xl md:rounded-3xl overflow-hidden shadow-card"
                  >
                    <div className="aspect-video lg:aspect-auto lg:h-full">
                      <img
                        src={featuredPost.featuredImage || "/hero-saffron.jpg"}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:p-8 lg:p-12">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm font-medium rounded-full">
                        {typeof featuredPost.category === "object"
                          ? featuredPost.category.name
                          : "Featured"}
                      </span>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-foreground mt-4">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mt-4 leading-relaxed text-sm md:text-base line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-6 text-xs md:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 md:w-4 md:h-4" />
                          {featuredPost.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          {formatDate(
                            featuredPost.publishedAt || featuredPost.createdAt
                          )}
                        </span>
                        {featuredPost.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            {featuredPost.readTime}
                          </span>
                        )}
                      </div>
                      <Button
                        asChild
                        className="mt-6 text-sm md:text-base"
                        size="sm"
                      >
                        <Link href={`/blog/${featuredPost.slug}`}>
                          Read Article
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </section>
            )}

            {/* Posts Grid */}
            <section className="py-8 md:py-12 bg-cream-dark">
              <div className="container mx-auto px-4">
                {regularPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">
                      No blog posts found.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {regularPosts.map((post, index) => (
                      <motion.article
                        key={post._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow group"
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featuredImage || "/hero-saffron.jpg"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 md:p-6">
                          <span className="text-xs text-primary font-medium">
                            {typeof post.category === "object"
                              ? post.category.name
                              : "Blog"}
                          </span>
                          <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-xs md:text-sm mt-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 md:gap-3 text-xs text-muted-foreground">
                              <span>
                                {formatDate(post.publishedAt || post.createdAt)}
                              </span>
                              {post.readTime && (
                                <>
                                  <span>•</span>
                                  <span>{post.readTime}</span>
                                </>
                              )}
                            </div>
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="text-xs md:text-sm"
                            >
                              <Link href={`/blog/${post.slug}`}>Read More</Link>
                            </Button>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </Layout>
    </BackgroundWrapper>
  );
}
