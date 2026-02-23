"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, User, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogsStore } from "@/lib/store";

import { BlogPreviewSkeleton } from "./Skeletons";

export function BlogPreview() {
  const { blogs, loading, fetchBlogs } = useBlogsStore();

  useEffect(() => {
    fetchBlogs({ limit: 3 });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const publishedBlogs = blogs.filter((b) => b.isPublished).slice(0, 3);

  if (loading) {
    return <BlogPreviewSkeleton />;
  }

  if (publishedBlogs.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-primary font-medium text-sm md:text-base">
            From Our Blog
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mt-2">
            Latest <span className="text-gradient-saffron">Articles</span> &
            Insights
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Explore expert knowledge about saffron, health tips, recipes, and
            cultivation techniques.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {publishedBlogs.map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-card group hover:shadow-elevated transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.featuredImage || "/hero-saffron.jpg"}
                  alt={post.title}
                  className="w-full h-48 md:h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 md:top-4 left-3 md:left-4 bg-primary text-primary-foreground px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                  {typeof post.category === "object"
                    ? post.category.name
                    : "Blog"}
                </span>
              </div>

              <div className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {post.readTime}
                    </div>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-serif font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {post.author}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary text-xs md:text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
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
            <Link href="/blog">
              View All Articles
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
