// Forside
import { fetchPublishedPosts, getPost, Post } from "@/lib/notion";
import PostCard from "@/components/post-card";

const styles = {
  container: "px-3 sm:px-6 lg:px-8",
  menuBar: "-mt-4 flex items-center justify-between border rounded px-6 py-2 mb-4",
  menuText: "font-bold tracking-wide",
  menuButton: "flex items-center gap-2 font-bold",
  gifWrapper: "mx-auto flex justify-center items-center overflow-hidden mb-1 -mt-4 max-h-[300px]",
  gifImage: "w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl h-auto object-cover m-0 p-0",
  subtitle: "text-base sm:text-lg text-muted-foreground -mt-2 pb-2",
  mainWrapper: "max-w-5xl mx-auto text-center mb-2 mt-0 space-y-0",
  leftColumn: "lg:w-[28%] lg:sticky lg:top-24 self-start",
  rightColumn: "lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6",
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
  const posts = (await getPosts()).sort((a, b) => {
    const da = new Date(a.date || 0).getTime();
    const db = new Date(b.date || 0).getTime();
    return da - db;
  });

  return (
    
    <div className={styles.container}>
      {/* Spacer for initial offset on desktop/tablet */}
      <div className="hidden sm:block h-5" aria-hidden="true" />
      {/* Sticky top nav */}
      <header className="hidden sm:block sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/40 bg-background/50 ring-1 ring-border/50">
        <div className="mx-auto flex max-w-[min(92vw,72rem)] items-center justify-between px-4 py-1.5">
          <span className="text-sm font-bold tracking-widest uppercase">Journey</span>
          <div className="relative">
            {/* Desktop: hover to open */}
            <div className="relative inline-block group pt-2 hidden sm:inline-block">
              <div className="list-none cursor-pointer select-none rounded-md px-3 py-1 text-sm font-semibold hover:bg-black/5 inline-flex items-center gap-2">
                <span className="sr-only">Åpne meny</span>
                {/* <span className="block h-[2px] w-4 bg-current"></span>
                <span className="block h-[2px] w-4 bg-current"></span>
                <span className="block h-[2px] w-4 bg-current"></span> */}
                🔎 UTFORSK
              </div>
              <nav className="absolute right-0 top-full w-48 overflow-hidden rounded-lg border border-border/50 bg-card shadow-lg invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition">
                <a href="/posts/to-skrullinger-p-tur" className="block px-4 py-2 text-sm hover:bg-foreground/5">➡️ Om oss</a>
                <a href="/posts/bildedryss" className="block px-4 py-2 text-sm hover:bg-foreground/5">🏞️ Bildedryss</a>
                <a href="#hvor-er-vi" className="block px-4 py-2 text-sm hover:bg-foreground/5">📍 Hvor er vi?</a>
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile info button & menu */}
      <details className="sm:hidden fixed left-3 bottom-3 z-[60]">
        <summary className="list-none w-12 h-12 rounded-full bg-background/80 backdrop-blur shadow-lg ring-1 ring-border/50 flex items-center justify-center text-sm font-semibold cursor-pointer select-none">
          <span aria-hidden>ℹ️</span>
          <span className="sr-only">Åpne meny</span>
        </summary>
        <nav className="absolute left-0 bottom-14 w-56 rounded-xl border border-border/50 bg-card shadow-xl p-1">
          <a href="/posts/to-skrullinger-p-tur" className="block px-4 py-2 text-sm hover:bg-foreground/5">➡️ Om oss</a>
          <a href="/posts/bildedryss" className="block px-4 py-2 text-sm hover:bg-foreground/5">🏞️ Bildedryss</a>
          <a href="#hvor-er-vi" className="block px-4 py-2 text-sm hover:bg-foreground/5">📍 Hvor er vi?</a>
        </nav>
      </details>
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
              <div key={post.id} className="max-w-md w-full mx-auto">
                <PostCard post={post} />
              </div>
            ))}
        </div>

        {/* Right column for main gallery */}
        <div className={styles.rightColumn}>
          {posts
            .filter((post) => !post.title.toLowerCase().includes("manipal"))
            .map((post) => (
              <div key={post.id} className="break-inside-avoid max-w-md w-full mx-auto">
                <PostCard post={post} />
              </div>
            ))}
        </div>
      </div>

      {/* Hvor er vi – innebygd kart i stedet for ekstern lenke */}
      <section id="hvor-er-vi" className="mx-auto max-w-[min(92vw,72rem)] mb-12 mt-10 scroll-mt-[70px]">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-2">📍 Vi befinner oss i Manipal</h2>
        <div className="w-full rounded-lg overflow-hidden border">
          <div className="w-full h-[280px] sm:h-[360px] md:h-[460px]">
            <iframe
              title="Kart over hvor vi er"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.077650973833!2d74.79233121532976!3d13.352996490610548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbca4c898f93c27%3A0x2bb0145b3f8a4c09!2sManipal%2C%20Karnataka%2C%20India!5e0!3m2!1sno!2sno!4v1700000000000!5m2!1sno!2sno"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
