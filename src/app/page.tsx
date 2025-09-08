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

  // Velg "featured" post som den med "manipal" i tittelen (case-insensitive), resten som otherPosts
  const featuredPost = posts.find((p) => p.title.toLowerCase().includes("manipal"));
  const otherPosts = posts.filter((p) => !p.title.toLowerCase().includes("manipal"));

  const getTime = (p: Post) => {
    const d = (p as any).date || (p as any).publishedAt || (p as any).created_time || (p as any).createdTime || (p as any).created || null;
    return d ? new Date(d as string).getTime() : 0;
  };

  const sorted = [...otherPosts].sort((a, b) => getTime(a) - getTime(b)); // tidligst først
  const smallCount = Math.min(sorted.length, 2); // vis maks 2 små kort
  const small = sorted.slice(0, smallCount);
  const rest = sorted.slice(smallCount);

  const today = new Date().toLocaleDateString("nb-NO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative">
      {/* Sticky top nav with hamburger */}
      <header className="sticky top-1 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/50 bg-background/70 ring-1 ring-border/50">
        <div className="mx-auto flex max-w-[min(92vw,72rem)] items-center justify-between px-4 py-1.5">
          <span className="text-sm font-bold tracking-widest uppercase">Journey</span>
          <details className="relative">
            <summary className="list-none cursor-pointer select-none rounded-md px-3 py-1 text-sm font-semibold hover:bg-black/5">
              <span className="inline-flex items-center gap-2">
                <span className="sr-only">Åpne meny</span>
                <span className="block h-[2px] w-4 bg-current"></span>
                <span className="block h-[2px] w-4 bg-current"></span>
                <span className="block h-[2px] w-4 bg-current"></span>
                Meny
              </span>
            </summary>
            <nav className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border/50 bg-card shadow-lg">
              <a href="#forside" className="block px-4 py-2 text-sm hover:bg-foreground/5">Forside</a>
              <a href="#artikler" className="block px-4 py-2 text-sm hover:bg-foreground/5">Artikler</a>
              <a href="#om" className="block px-4 py-2 text-sm hover:bg-foreground/5">Om</a>
            </nav>
          </details>
        </div>
      </header>

      {/* Hero-seksjon */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[min(92vw,72rem)] pt-4 pb-6">
       
          <div className="rounded-2xl border border-border/50 bg-card/70 p-4 sm:p-5 backdrop-blur">
            <div className="flex justify-end mb-2">
              <span className="text-sm font-semibold text-muted-foreground">{today}</span>
            </div>
            <div className="flex justify-center my-2 sm:my-3 overflow-hidden">
              <img src="/manipal5.gif" alt="Manipal City" className="w-full -my-50 max-h-[28rem] sm:max-h-[36rem] object-cover" />
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-balance text-center text-base text-muted-foreground sm:text-lg">
              Reportasjer, bildebrev og små notiser fra turen 🌍
            </p>

            {/* kicker ribbons */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="rounded-full px-3 py-1 text-xs font-medium ring-1 ring-border/60 text-foreground/80">Felt-notater</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium ring-1 ring-border/60 text-foreground/80">Bildegalleri</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium ring-1 ring-border/60 text-foreground/80">Stedsguide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Innhold */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[min(92vw,72rem)]">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Venstre kolonne: Featured / intro  */}
            <aside className="lg:sticky lg:top-28 lg:basis-[38.2%] self-start">
              <div className="space-y-4" id="forside">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Forside-sak
                </h2>
                {featuredPost ? (
                  <div className="rounded-xl bg-card p-1 ring-1 ring-border/60 shadow-none backdrop-blur text-sm">
                    <PostCard post={featuredPost} />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Ingen innlegg enda – kom tilbake snart ✨
                  </p>
                )}

                {/* Liten om-boks */}
                <div className="-mt-3 rounded-xl border border-border/50 bg-muted/30 p-5 shadow-sm backdrop-blur" id="om">
                  <h3 className="mb-1 text-base font-semibold">Om reisen</h3>
                  <p className="text-sm text-muted-foreground">
                    Vi samler steder, folk og tilfeldige tanker i et lite digitalt
                    reisebrev. Bla deg nedover for galleriet 📸
                  </p>
                </div>
              </div>
            </aside>

            {/* Høyre kolonne: Galleri */}
            <main className="lg:basis-[61.8%]" id="artikler">
              <header className="mb-4 flex items-end justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Siste artikler
                </h2>
                <span className="rounded-md bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">Om oss</span>
              </header>

              {/* Øverste rad: små kort (2 eller opptil 4) */}
              {small.length > 0 && (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {small.map((post) => (
                    <div key={post.id} className="group aspect-square">
                      <div className="relative h-full overflow-hidden rounded-xl ring-1 ring-border/60 transition duration-200 ease-out group-hover:ring-2 group-hover:ring-foreground/30">
                        <PostCard post={post} />
                        <div className="absolute inset-0 flex items-end justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="mb-4 px-2 text-center text-white text-sm font-semibold">
                            {post.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Resten: 2 per rad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <div key={post.id}>
                    <div className="rounded-xl ring-1 ring-border/60 transition duration-200 ease-out hover:-translate-y-0.5 hover:ring-2 hover:ring-foreground/30">
                      <PostCard post={post} />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
