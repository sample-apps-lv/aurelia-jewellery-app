import { createFileRoute } from "@tanstack/react-router";
import { useBlogs } from "@/features/blog/api/use-blogs";
import { BlogCard } from "@/features/blog/components/blog-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const Route = createFileRoute("/blog/")({
  component: BlogListPage,
});

function BlogListPage() {
  const { data: blogs, isLoading } = useBlogs();

  return (
    <div className="bg-white min-h-screen pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4 block"
          >
            Insights & Inspiration
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif mb-6 text-slate-900"
          >
            The Gajanand Journal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Discover the artistry behind our jewelry, expert guides on gemstones, and the latest trends in luxury and elegance.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs?.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
