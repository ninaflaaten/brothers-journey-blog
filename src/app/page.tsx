import { fetchPublishedPosts, getPost, Post } from "@/lib/notion";
import PostCard from "@/components/post-card";

async function getPosts(): Promise<Post[]> {
  const posts = await fetchPublishedPosts();
  const allPosts = await Promise.all(
    posts.results.map((post) => getPost(post.id))
  );
  return allPosts.filter((post): post is Post => post !== null);
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Sindre skriver
        </h1>
        <p className="text-lg text-muted-foreground">
          om folk, steder og tilfeldige tanker i India
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-center">
        {/* Left column for intro */}
        <div className="lg:w-[30%]">
          {posts
            .filter((post) => post.title.toLowerCase().includes("hvem er jeg"))
            .map((post) => (
              <div key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
        </div>

        {/* Right column for main gallery */}
        <div className="lg:w-[50%] columns-1 md:columns-2 lg:columns-2 gap-6 space-y-6">
          {posts
            .filter((post) => !post.title.toLowerCase().includes("hvem er jeg"))
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
