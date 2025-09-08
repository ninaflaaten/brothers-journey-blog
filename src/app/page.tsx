// Forside
import { fetchPublishedPosts, getPost, Post } from "@/lib/notion";
import PostCard from "@/components/post-card";

const styles = {
  container: "px-8 sm:px-6 lg:px-8",
  menuBar: "flex items-center justify-between border rounded px-6 py-2 mb-4",
  menuText: "font-bold tracking-wide",
  menuButton: "flex items-center gap-2 font-bold",
  gifWrapper: "mx-auto flex justify-center items-center overflow-hidden mb-1 -mt-4 h-[220px] sm:h-[260px] md:h-[300px]",
  gifImage: "w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl h-auto object-contain m-0 p-0",
  subtitle: "text-lg text-muted-foreground -mt-2 pb-2",
  mainWrapper: "max-w-5xl mx-auto text-center mb-2 mt-0 space-y-0",
  leftColumn: "lg:w-[28%] lg:sticky lg:top-24 self-start",
  rightColumn: "lg:w-[65%] grid grid-cols-1 sm:grid-cols-2 gap-6",
  menuWrap: "relative inline-block",
  menuSummary: "list-none cursor-pointer flex items-center gap-2 font-bold rounded px-3 py-1 hover:bg-gray-100",
  menuDropdown: "absolute right-0 top-full w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50",
  menuLink: "block px-4 py-2 text-sm hover:bg-gray-100"
};

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
    <div className={styles.container}>
      <div className="relative">
        {/* Sticky top nav with hamburger */}
        <header className="hidden sm:block sticky top-1 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/50 bg-background/70 ring-1 ring-border/50">
          <div className="mx-auto flex max-w-[min(92vw,72rem)] items-center justify-between px-4 py-1.5">
            <span className="text-sm font-bold tracking-widest uppercase">Journey</span>
            <div className="relative">
              {/* Mobile: tap to open */}
              <details className="relative sm:hidden group">
                <summary className="list-none cursor-pointer select-none rounded-md px-3 py-1 text-sm font-semibold hover:bg-black/5 inline-flex items-center gap-2 group-open:hidden">
                  <span className="sr-only">Åpne meny</span>
                  <span className="block h-[2px] w-4 bg-current"></span>
                  <span className="block h-[2px] w-4 bg-current"></span>
                  <span className="block h-[2px] w-4 bg-current"></span>
                  Meny
                </summary>
                <nav className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border border-border/50 bg-card shadow-lg z-50">
                  <a href="/" className="block px-4 py-2 text-sm hover:bg-foreground/5">Forside</a>
                  <a href="#artikler" className="block px-4 py-2 text-sm hover:bg-foreground/5">Artikler</a>
                  <a href="/posts/to-skrullinger-p-tur" className="block px-4 py-2 text-sm hover:bg-foreground/5">Om oss</a>
                </nav>
              </details>

              {/* Desktop: hover to open */}
              <div className="relative inline-block group pt-2 hidden sm:inline-block">
                <div className="list-none cursor-pointer select-none rounded-md px-3 py-1 text-sm font-semibold hover:bg-black/5 inline-flex items-center gap-2">
                  <span className="sr-only">Åpne meny</span>
                  <span className="block h-[2px] w-4 bg-current"></span>
                  <span className="block h-[2px] w-4 bg-current"></span>
                  <span className="block h-[2px] w-4 bg-current"></span>
                  Meny
                </div>
                <nav className="absolute right-0 top-full w-48 overflow-hidden rounded-lg border border-border/50 bg-card shadow-lg invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition">
                  <a href="/" className="block px-4 py-2 text-sm hover:bg-foreground/5">Forside</a>
                  <a href="#artikler" className="block px-4 py-2 text-sm hover:bg-foreground/5">Artikler</a>
                  <a href="/posts/to-skrullinger-p-tur" className="block px-4 py-2 text-sm hover:bg-foreground/5">Om oss</a>
                </nav>
              </div>
            </div>
          </div>
        </header>
      </div>
      <div className={styles.mainWrapper}>
        <div className={styles.gifWrapper}>
          <img
            src="/manipal5.gif"
            alt="Manipal illustration"
            className={styles.gifImage}
          />
        </div>

        
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
        {/* Left column for intro */}
        <div className={styles.leftColumn}>
          {posts
            .filter((post) => post.title.toLowerCase().includes("manipal")) // fikse så det ikke er hardcoda
            .map((post) => (
              <div key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
        </div>

        {/* Right column for main gallery */}
        <div className={styles.rightColumn}>
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
