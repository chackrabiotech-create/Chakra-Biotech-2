"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Send,
  CornerDownRight,
} from "lucide-react";
import { blogsApi, Blog } from "@/lib/api/blogs";
import { commentsApi, BlogComment } from "@/lib/api/comments";
import { toast } from "sonner";

export default function BlogDetails() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Blog | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [replies, setReplies] = useState<BlogComment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    comment: "",
  });

  useEffect(() => {
    if (slug) {
      loadPostData();
    }
  }, [slug]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      const [postRes, relatedRes, commentsRes] = await Promise.all([
        blogsApi.getBySlug(slug),
        blogsApi.getAll({ limit: 3 }), // Simplified related posts
        commentsApi.getByBlog(slug),
      ]);

      if (postRes.success) {
        setPost(postRes.data);
        // Increment view count
        blogsApi.incrementView(slug);
      }

      if (relatedRes.success) {
        setRelatedPosts(
          relatedRes.data.blogs.filter((b) => b.slug !== slug).slice(0, 2),
        );
      }

      if (commentsRes.success) {
        setComments(commentsRes.data.comments);
        setReplies(commentsRes.data.replies);
      }
    } catch (error) {
      console.error("Failed to load blog post:", error);
      toast.error("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      setCommentLoading(true);
      if (replyTo) {
        await commentsApi.replyToBlogComment(replyTo, commentForm);
        toast.success("Reply submitted for approval!");
      } else {
        await commentsApi.createBlogComment(slug, commentForm);
        toast.success("Comment submitted for approval!");
      }
      setCommentForm({ name: "", email: "", comment: "" });
      setReplyTo(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = (platform?: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = post?.title || "";

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        "_blank",
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else if (navigator.share) {
      navigator.share({ title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Blog post not found</h1>
          <Link href="/blog">
            <Button className="mt-4">Back to Blog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

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
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground truncate">{post.title}</span>
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <Badge className="mb-4">
                {typeof post.category === "object"
                  ? post.category.name
                  : "Uncategorized"}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {post.excerpt}
              </p>

              {/* Author & Meta */}
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "Draft"}
                  </span>
                </div>
                {post.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                )}
              </div>

              {/* Social Share */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("facebook")}
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Tweet
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("linkedin")}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare()}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="aspect-video rounded-2xl overflow-hidden mb-12 shadow-xl"
            >
              <img
                src={post.featuredImage || "/placeholder.jpg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
              <span className="text-sm font-medium text-foreground mr-2">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-20 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Comment List */}
            <div className="space-y-8 mb-16">
              <AnimatePresence>
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center italic py-8">
                    No comments yet. Be the first to share your thoughts!
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
                {replyTo ? "Leave a Reply" : "Leave a Comment"}
              </h3>
              {replyTo && (
                <div className="flex items-center justify-between bg-muted/50 p-2 px-4 rounded-lg mb-6">
                  <span className="text-sm text-muted-foreground">
                    Replying to a comment
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
                      className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                      className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Your Email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comment *
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
                    className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Write your thoughts here..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full md:w-auto px-8"
                  disabled={commentLoading}
                >
                  {commentLoading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <span>Submit {replyTo ? "Reply" : "Comment"}</span>
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  * All comments are subject to moderation before appearing on
                  the site.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-8 text-center">
              More from the Blog
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow border border-border/50"
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.featuredImage || "/placeholder.jpg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="outline" className="mb-2">
                        {typeof relatedPost.category === "object"
                          ? relatedPost.category.name
                          : "Category"}
                      </Badge>
                      <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {relatedPost.publishedAt
                          ? new Date(
                              relatedPost.publishedAt,
                            ).toLocaleDateString()
                          : "Draft"}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back to Blog */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex justify-center">
            <Link href="/blog">
              <Button variant="outline" className="rounded-full px-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to all Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
