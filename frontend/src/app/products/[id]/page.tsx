"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QualityCertification } from "@/components/ui/quality-certification";
import {
  ShoppingBag,
  Star,
  ArrowLeft,
  Heart,
  Share2,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { productsApi, Product } from "@/lib/api/products";
import { commentsApi, BlogComment as ProductComment } from "@/lib/api/comments";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  CornerDownRight,
  Clock,
  User,
  Calendar,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useCompanyData } from "@/hooks/use-company-data";

export default function ProductDetails() {
  const params = useParams();
  const slugParam = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [replies, setReplies] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const { whatsappNumber } = useCompanyData();

  useEffect(() => {
    if (slugParam) {
      loadData();
    }
  }, [slugParam]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productRes, commentsRes] = await Promise.all([
        productsApi.getBySlug(slugParam),
        commentsApi.getByProduct(slugParam),
      ]);

      if (productRes.success) {
        setProduct(productRes.data);
        // Increment view count
        productsApi.incrementView(slugParam);
      }

      if (commentsRes.success) {
        setComments(commentsRes.data.comments);
        setReplies(commentsRes.data.replies);
      }
    } catch (error) {
      console.error("Failed to load product data:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setCommentLoading(true);
      if (replyTo) {
        await commentsApi.replyToProductComment(replyTo, commentForm);
        toast.success("Reply submitted for approval!");
      } else {
        await commentsApi.createProductComment(slugParam, commentForm);
        toast.success("Comment submitted for approval!");
      }
      setCommentForm({ name: "", email: "", comment: "" });
      setReplyTo(null);
      // Optionally reload comments after submission
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleOrder = () => {
    if (!product) return;
    const message = `Hello! I want to order ${product.name} – ${product.weight || "1g"} x${quantity} (₹${(product.price * quantity).toLocaleString()})`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.shortDescription || product.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const allImages = [
    product.featuredImage || product.images[0] || "/product-saffron-jar.jpg",
    ...product.images.filter((img) => img !== product.featuredImage),
  ].filter(Boolean);

  const hasSpecifications =
    product.specifications &&
    Object.values(product.specifications).some((v) => v);

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="py-4 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Product Images */}
            <div className="space-y-4">
              <motion.div
                className="aspect-square rounded-2xl overflow-hidden bg-card border border-border/50"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={allImages[selectedImage] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                          ? "border-primary"
                          : "border-border"
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {product.badge && (
                    <Badge className="bg-primary hover:bg-primary/90">
                      {product.badge}
                    </Badge>
                  )}
                  {product.grade && (
                    <Badge variant="secondary">{product.grade}</Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-gold fill-gold" />
                    <span className="font-bold text-foreground">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                  {product.origin && (
                    <div className="text-sm text-muted-foreground border-l border-border pl-4">
                      Origin:{" "}
                      <span className="text-foreground font-medium">
                        {product.origin}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <span className="text-4xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.weight && (
                  <span className="text-sm text-muted-foreground bg-white/50 px-3 py-1 rounded-full border border-border">
                    {product.weight}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm prose-p:text-muted-foreground">
                <p className="leading-relaxed text-base italic text-foreground/80 mb-4">
                  {product.shortDescription}
                </p>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Features/Benefits */}
              {(product.features?.length ?? 0) > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {product.features?.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Plus className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center gap-6">
                  <span className="font-bold text-foreground">Quantity:</span>
                  <div className="flex items-center bg-card border border-border rounded-xl p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !product.inStock}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-6 py-2 min-w-[3.5rem] text-center font-bold">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleOrder}
                    className="flex-1 h-14 text-lg rounded-xl"
                    disabled={!product.inStock}
                  >
                    <ShoppingBag className="w-5 h-5 mr-3" />
                    Order on WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-xl"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-xl"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Quality Badges */}
              <div className="bg-cream p-6 rounded-2xl border border-border shadow-sm">
                <QualityCertification
                  variant="minimal"
                  showMetrics={false}
                  showCertifications={false}
                  className="flex items-center justify-around"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      {(hasSpecifications || (product.benefits?.length ?? 0) > 0) && (
        <section className="py-20 bg-card border-y border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <Tabs
              defaultValue={hasSpecifications ? "specifications" : "benefits"}
              className="w-full"
            >
              <TabsList
                className={`grid w-full mb-8 h-12 ${hasSpecifications && (product.benefits?.length ?? 0) > 0 ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {hasSpecifications && (
                  <TabsTrigger value="specifications" className="text-base">
                    Technical Specs
                  </TabsTrigger>
                )}
                {(product.benefits?.length ?? 0) > 0 && (
                  <TabsTrigger value="benefits" className="text-base">
                    Health Benefits
                  </TabsTrigger>
                )}
              </TabsList>

              {hasSpecifications && (
                <TabsContent value="specifications" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
                    {Object.entries(product.specifications || {})
                      .filter(([_, v]) => v)
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-4 border-b border-border/50"
                        >
                          <span className="font-semibold text-foreground uppercase text-xs tracking-wider">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {value as string}
                          </span>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              )}

              {(product.benefits?.length ?? 0) > 0 && (
                <TabsContent value="benefits">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {product.benefits &&
                      product.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-5 bg-background rounded-2xl border border-border shadow-sm"
                        >
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 text-primary fill-primary/20" />
                          </div>
                          <span className="text-foreground font-medium">
                            {benefit}
                          </span>
                        </motion.div>
                      ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </section>
      )}

      {/* Comments Section */}
      <section className="py-20 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Product Discussions ({comments.length})
              </h2>
            </div>

            {/* Comment List */}
            <div className="space-y-8 mb-16">
              <AnimatePresence>
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center italic py-8">
                    No discussions yet. Be the first to share your experience!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="space-y-4">
                      <div className="p-6 bg-card rounded-2xl border border-border">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                              {comment.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {comment.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  comment.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                            onClick={() => {
                              setReplyTo(comment._id);
                              document
                                .getElementById("comment-form")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Reply
                          </Button>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {comment.comment}
                        </p>
                      </div>

                      {/* Replies */}
                      {replies
                        .filter((r) => r.parentComment === comment._id)
                        .map((reply) => (
                          <div
                            key={reply._id}
                            className="ml-8 lg:ml-12 pl-6 border-l-2 border-border space-y-4"
                          >
                            <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
                              <div className="flex items-center gap-3 mb-3">
                                <CornerDownRight className="w-4 h-4 text-muted-foreground" />
                                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-bold">
                                  {reply.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground">
                                    {reply.name}
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground">
                                    {new Date(
                                      reply.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {reply.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Comment Form */}
            <div
              id="comment-form"
              className="bg-card p-8 rounded-2xl border border-border shadow-sm"
            >
              <h3 className="text-xl font-serif font-bold text-foreground mb-6">
                {replyTo ? "Post a Reply" : "Join the Discussion"}
              </h3>
              {replyTo && (
                <div className="flex items-center justify-between bg-muted/50 p-2 px-4 rounded-lg mb-6">
                  <span className="text-sm text-muted-foreground">
                    Replying to a discussion thread
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={commentForm.name}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, name: e.target.value })
                      }
                      className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={commentForm.email}
                      onChange={(e) =>
                        setCommentForm({
                          ...commentForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                      placeholder="Your Email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={commentForm.comment}
                    onChange={(e) =>
                      setCommentForm({
                        ...commentForm,
                        comment: e.target.value,
                      })
                    }
                    className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-sans"
                    placeholder="Write your question or experience..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full md:w-auto px-8 h-12 rounded-xl"
                  disabled={commentLoading}
                >
                  {commentLoading ? (
                    "Posting..."
                  ) : (
                    <>
                      <span>Post {replyTo ? "Reply" : "Comment"}</span>
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  * All discussions are moderated to maintain quality of
                  conversation.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Link href="/products">
            <Button variant="ghost" className="rounded-full px-8 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Catalog
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
