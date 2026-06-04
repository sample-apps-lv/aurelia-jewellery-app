import { Link } from "@tanstack/react-router";
import { BlogPost } from "../types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to="/blog/$slug" params={{ slug: post.slug }}>
        <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow h-full group">
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/90 text-slate-900 hover:bg-white">{post.category}</Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-slate-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-3 mb-6">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <User className="w-3 h-3" />
                {post.author}
              </span>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                Read More <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
