import { listAllImagesFromPublishedPosts } from "@/lib/notion";

export const dynamic = "force-dynamic";

function slugifyTitle(title: string) {
  return (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function BildedryssPage() {
  const images = await listAllImagesFromPublishedPosts();

  return (
    <div className="px-3 sm:px-6 lg:px-8 mx-auto max-w-[min(92vw,72rem)]">
      <h1 className="text-xl font-bold tracking-widest uppercase my-4">Bildedryss</h1>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingen bilder funnet ennå. Legg til bilder i postene dine i Notion, så dukker de opp her automatisk ✨</p>
      ) : (
        <div className="columns-2 md:columns-3 gap-3 md:gap-6 [column-fill:balance]">
          {images.map((img, i) => {
            const title = (img as any).title as string;
            const slug = slugifyTitle(title);
            const href = `/posts/${slug}`;
            return (
              <figure key={`${img.blockId}-${i}`} className="break-inside-avoid mb-3">
                <a href={href} className="block">
                  <img
                    src={img.url}
                    alt=""
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </a>
              </figure>
            );
          })}
        </div>
      )}
    </div>
  );
}