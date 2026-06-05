import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useBlogPost, useBlogs } from "@/features/blog/api/use-blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, Share2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Markdown from "@/components/markdown";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { data: post, isLoading, error } = useBlogPost(slug);
  const { data: otherPosts } = useBlogs();

  const relatedPosts = otherPosts?.filter((p) => p.slug !== slug).slice(0, 2);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pt-40 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Skeleton className="h-4 w-24 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-10" />
          <Skeleton className="aspect-video w-full rounded-3xl mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-40">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog">
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-24">
      <article className="max-w-4xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Journal
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-slate-100 text-slate-900 hover:bg-slate-200 border-none">
              {post.category}
            </Badge>
            <span className="text-slate-300">•</span>
            <span className="text-sm font-medium text-slate-500">{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif mb-8 text-slate-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-slate-100 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{post.author}</p>
                <p className="text-xs text-slate-500">{post.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="aspect-video w-full rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl shadow-slate-200"
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-slate prose-lg max-w-none mb-20"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> */}

        <Markdown content={post.content} />

        <div className="pt-20 border-t border-slate-100">
          <h3 className="text-2xl font-serif mb-10 text-center">More from the Journal</h3>
          <div className="grid md:grid-cols-2 gap-8">
             {relatedPosts?.map((p) => (
                <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group">
                   <div className="bg-slate-50 p-6 rounded-3xl transition-colors group-hover:bg-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{p.category}</p>
                      <h4 className="text-xl font-bold mb-4 line-clamp-2">{p.title}</h4>
                      <span className="text-sm font-bold text-slate-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read Story <Clock className="w-4 h-4" />
                      </span>
                   </div>
                </Link>
             ))}
          </div>
        </div>
      </article>
    </div>
  );
}
