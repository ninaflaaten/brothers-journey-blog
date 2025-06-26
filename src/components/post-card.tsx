import Link from "next/link";
// import Image from "next/image";
import { format } from "date-fns";
import { Post, getWordCount } from "@/lib/notion";
import { Badge } from "@/components/ui/badge";
// import { calculateReadingTime } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const wordCount = post.content ? getWordCount(post.content) : 0;
  // const readingTime = calculateReadingTime(wordCount);
 

  return (
    <Card
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 h-[500px] flex flex-col justify-between ${
        post.title === "Hvem er jeg"
          ? "bg-white/40 dark:bg-zinc-800/60 shadow-lg md:col-span-2 backdrop-blur-md"
          : "bg-white/40 dark:bg-zinc-900/60 shadow-md border-none backdrop-blur-md"
      }`}
    >
      <Link
        href={`/posts/${post.slug}`}
        className="absolute inset-0 z-10"
        aria-label={post.title}
      />
      <div className="relative w-full overflow-hidden rounded-t-xl pt-0 mt-[-3rem]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-64 w-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <img
            src="/fallback.jpg"
            alt="Fallback image"
            className="h-64 w-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {post.category && (
          <div className="absolute top-4 left-4 z-20">
            <Badge
              variant="secondary"
              className="bg-white/90 dark:bg-zinc-800/80 text-xs px-2 py-1 rounded shadow"
            >
              {post.category}
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="px-6 pt-0 pb-6 space-y-2">
        <div className="group-hover:pr-8 transition-all duration-300">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </div>
        <p
          className={`text-sm text-zinc-600 dark:text-zinc-300 ${
            post.title === "Hvem er jeg" ? "line-clamp-none" : "line-clamp-4"
          }`}
        >
          {post.description}
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        {post.author && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">By {post.author}</p>
        )}
      </CardContent>
      {post.tags && post.tags.length > 0 && (
        <CardFooter className="px-6 pb-4">
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-zinc-100 dark:bg-zinc-700 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
