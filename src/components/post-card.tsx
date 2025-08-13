// Postkort
import Link from "next/link";
import { format } from "date-fns";
import { Post, getWordCount } from "@/lib/notion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface PostCardProps {
  post: Post;
}

// Komponent som viser et kort (card) for hvert blogginnlegg
export default function PostCard({ post }: PostCardProps) {
  const wordCount = post.content ? getWordCount(post.content) : 0;

  return (
    <Card
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 h-[500px] flex flex-col justify-between ${
        post.title === "Manipal"
          ? "bg-white/40 dark:bg-zinc-800/60 shadow-lg md:col-span-2 backdrop-blur-md "
          : "bg-white/40 dark:bg-zinc-900/60 shadow-md border-none backdrop-blur-md"
      }`}
    >
      {/* Klikkbar lenke som dekker hele kortet */}
      <Link
        href={`/posts/${post.slug}`}
        className="absolute inset-0 z-10"
        aria-label={post.title}
      />
      
      {/* Viser forsidebilde (hvis det finnes) */}
      <div className="relative w-full overflow-hidden rounded-t-xl pt-0 mt-[-3rem]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-64 w-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-muted/80" />
        )}
      </div>

      {/* Tittel og beskrivelse */}
      <CardHeader className="px-6 pt-0 pb-6 space-y-2 -mt-4">
        <div className="group-hover:pr-8 transition-all duration-300">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </div>
        <p
          className={`text-sm text-zinc-600 dark:text-zinc-300 ${
            post.title === "Manipal" ? "line-clamp-none" : "line-clamp-4"
          }`}
        >
          {post.description.replace(/[#*_`~>-]+/g, "")}
        </p>
      </CardHeader>

      {/* Viser forfatter hvis satt (høre med Sindre om det er nødvendig) */}
      <CardContent className="px-6 pb-4">
        {post.author && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {Array.isArray(post.author) ? post.author.join(", ") : post.author}
          </p>
        )}
      </CardContent>

      {/* Viser tags som små merkelapper */}
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
