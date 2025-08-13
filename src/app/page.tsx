// Forside
import { fetchPublishedPosts, getPost, Post } from "@/lib/notion";
import PostCard from "@/components/post-card";

export const dynamic = "force-dynamic";

async function getPosts(): Promise<Post[]> {
  const posts = await fetchPublishedPosts();
  const allPosts: Post[] = [];
  for (const p of posts.results) {
    const post = await getPost(p.id);
    if (post) allPosts.push(post);
  }
  return allPosts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Sindre skriver
        </h1>
        <p className="text-lg text-muted-foreground">
          om folk, steder og tilfeldige tanker i India
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
        {/* Left column for intro */}
        <div className="lg:w-[28%] lg:sticky lg:top-24 self-start">
          {posts
            .filter((post) => post.title.toLowerCase().includes("manipal")) // fikse så det ikke er hardcoda
            .map((post) => (
              <div key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
        </div>

        {/* Right column for main gallery */}
        <div className="lg:w-[65%] grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts
            .filter((post) => !post.title.toLowerCase().includes("manipal"))
            .map((post) => (
              <div key={post.id} className="break-inside-avoid">
                <PostCard post={post} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
