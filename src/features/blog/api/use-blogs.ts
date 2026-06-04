import { useQuery } from "@tanstack/react-query";
import { MOCK_BLOGS } from "../data/mock-blogs";
import { BlogPost } from "../types/blog";

export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_BLOGS;
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const post = MOCK_BLOGS.find((b) => b.slug === slug);
      if (!post) throw new Error("Blog post not found");
      return post;
    },
    enabled: !!slug,
  });
};
