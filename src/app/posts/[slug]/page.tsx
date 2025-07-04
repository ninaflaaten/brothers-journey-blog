// Postkort-innside

import { fetchPublishedPosts, getPost, getWordCount } from "@/lib/notion"; // funksjoner for å samhandle m Notion
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { components } from "@/components/mdx-component";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export const dynamic = "force-dynamic"; // dynamisk rendering (oppdatert innhold fra Notion)

// Slug for å hente riktig innlegg basert på URL
interface PostPageProps {
  params: Promise<{ slug: string }>; // slug er URL vennlig versjon av postkort-tittelen (f.eks. hvem-er-jeg)
}

// Bakgrunnsfunksjon genererer metadata basert på slug-parameteren
export async function generateMetadata(
  { params }: PostPageProps // mottar argument med slug fra URL
): Promise<Metadata> {
  const { slug } = await params; // Henter slug fra params
  const posts = await fetchPublishedPosts(); // Henter alle publiserte innlegg
  // Henter detaljert data for hvert innlegg i en asynkron løkke
  const allPosts = await Promise.all(posts.results.map((p) => getPost(p.id)));
  // Finner innlegget som matcher slug-parameteren
  const post = allPosts.find((p) => p?.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // TODO: oppdatere om endret domenet!!
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://india-sindres-journey.vercel.app/";

  // Returnerer metadata-objekt med informasjon om innlegget: tittel, beskrivelse
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteUrl}/posts/${post.slug}`, // canonical URL
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteUrl}/posts/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : [],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || `${siteUrl}/opengraph-image.png`, // Bruker coverbilde eller fallback-bilde
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

// Hovedkomponenten for post-siden: rendrer innhold basert på slugen
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params; // hent slug fra URL-parametere
  const posts = await fetchPublishedPosts(); // hent alle innlegg fra Notion som er "published"
  // hent detaljert data for hvert innlegg
  const allPosts = await Promise.all(posts.results.map((p) => getPost(p.id)));
  const post = allPosts.find((p) => p?.slug === slug); // finn innlegget som matcher slugen
  const wordCount = post?.content ? getWordCount(post.content) : 0; // wordcount

  if (!post) {
    notFound();
  }

  // Henter nettstedets base-URL for bruk i JSON-LD og metadata
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://india-sindres-journey.vercel.app";

  // Lager usynlig data Google kan lese for å forstå hva innlegget handler om
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage || `${siteUrl}/opengraph-image.png`,
    datePublished: new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: post.author || "Guest Author",
    },
    publisher: {
      "@type": "Organization",
      name: "Your Site Name",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/posts/${post.slug}`,
    },
  };

  // Returnerer JSX som rendrer selve innlegget
  return (
    <>
      {/* Legger til JSON-LD strukturert data i HTML for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto prose dark:prose-invert">
        {/* Viser coverbilde hvis det finnes */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full object-cover rounded-lg aspect-video mb-8"
          />
        )}

        <header className="mb-8">
          {/* Viser dato, forfatter og ordtelling */}
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <time>{format(new Date(post.date), "MMMM d, yyyy")}</time>
            {post.author && <span>By {post.author}</span>}
            <span>{wordCount} words</span>
          </div>

          {/* Viser tittelen på innlegget */}
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            {post.title}
          </h1>

    
        </header>

        {/* Rendre Markdown-innholdet til HTML med støtte for GFM og rå HTML */}
        <div className="max-w-none">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}
