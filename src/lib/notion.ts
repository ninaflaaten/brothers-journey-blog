import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const n2m = new NotionToMarkdown({ notionClient: notion });

export interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  description: string;
  date: string;
  content: string;
  author?: string;
  tags?: string[];
  category?: string;
}

export async function getDatabaseStructure() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!,
  });
  return database;
}

export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleanText.split(" ").length;
}

export async function fetchPublishedPosts() {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Status",
          status: {
            equals: "Published",
          },
        },
      ],
    },
    sorts: [
      {
        property: "Published Date",
        direction: "ascending",
      },
    ],
  });

  return posts;
}

export async function getPost(pageId: string): Promise<Post | null> {
  try {
    const page = (await notion.pages.retrieve({
      page_id: pageId,
    })) as PageObjectResponse;
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const { parent: contentStringRaw } = n2m.toMarkdownString(mdBlocks); // endret for å lage new posts lettere
    const contentString = contentStringRaw ?? "";

    const paragraphs = contentString
      .split("\n")
      .filter((line: string) => line.trim().length > 0);



    const firstParagraph = paragraphs[0] || "";
    const description =
      firstParagraph.slice(0, 160) + (firstParagraph.length > 160 ? "..." : "");

    const properties = page.properties as any;
    const post: Post = {
      id: page.id,
      title: properties.Title.title[0]?.plain_text || "Untitled",
      slug:
        properties.Title.title[0]?.plain_text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") // Replace any non-alphanumeric chars with dash
          .replace(/^-+|-+$/g, "") || // Remove leading/trailing dashes
        "untitled",
      coverImage: (() => {
        const feat = properties["Featured Image"];
        if (!feat) return undefined;
        if (feat.type === "files" && Array.isArray(feat.files) && feat.files.length > 0) {
          const f = feat.files[0];
          if (f.type === "file") return f.file?.url;
          if (f.type === "external") return f.external?.url;
        }
        return undefined;
      })(),


      
      description,
      date:
        properties["Published Date"]?.date?.start || new Date().toISOString(),
      content: contentString,
      author: properties.Author?.people[0]?.name,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      category: properties.Category?.select?.name,
    };


    return post;
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}

// --------------------
// Image collection helpers
// --------------------

// Recursively list all blocks (and children of blocks that can contain children)
async function listBlocksDeep(blockId: string): Promise<any[]> {
  const all: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    const resp = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    all.push(...resp.results);
    cursor = resp.has_more ? resp.next_cursor ?? undefined : undefined;
  } while (cursor);

  const parentsWithChildren = all.filter(
    (b: any) =>
      b.has_children === true &&
      [
        "column_list",
        "column",
        "toggle",
        "paragraph",
        "bulleted_list_item",
        "numbered_list_item",
        "callout",
        "quote",
        "table_row",
        "synced_block",
        "heading_1",
        "heading_2",
        "heading_3",
        "to_do",
        "list_item",
      ].includes(b.type)
  );
  for (const parent of parentsWithChildren) {
    const kids = await listBlocksDeep(parent.id);
    all.push(...kids);
  }
  return all;
}

// Get all image blocks from a single page
export async function listImagesFromPage(pageId: string) {
  const blocks = await listBlocksDeep(pageId);
  return blocks
    .filter((b: any) => b.type === "image")
    .map((b: any) => {
      const img = b.image;
      const url = img.type === "file" ? img.file.url : img.external.url;
      const caption = (img.caption?.[0]?.plain_text ?? "").trim();
      return { url, caption, blockId: b.id, pageId };
    });
}

// Get all image blocks from all published posts in the database
export async function listAllImagesFromPublishedPosts() {
  const posts = await fetchPublishedPosts();
  const out: { url: string; caption: string; blockId: string; pageId: string; title: string }[] = [];
  for (const r of posts.results as any[]) {
    const post = await getPost(r.id);
    if (!post) continue;
    const imgs = await listImagesFromPage(r.id);
    for (const img of imgs) {
      out.push({ ...img, title: post.title });
    }
    // Also include the post's Featured Image (cover)
    if (post.coverImage) {
      out.push({
        url: post.coverImage,
        caption: "",
        blockId: `featured-${r.id}`,
        pageId: r.id,
        title: post.title,
      });
    }
  }

  // De-duplicate by URL (Notion file URLs rotate but path stays same within expiry window)
  const uniq = new Map<string, (typeof out)[number]>();
  for (const it of out) {
    if (!uniq.has(it.url)) uniq.set(it.url, it);
  }
  return Array.from(uniq.values());
}
