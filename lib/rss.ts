// Dependency-free XML RSS feed parser for Google News and gCaptain.

export interface FeedItem {
  id: string;
  headline: string;
  link: string;
  pubDate: string;
  source: string;
}

function cleanXmlString(str: string): string {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1") // Clean CDATA wrapper
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "") // Strip any residual HTML tags
    .trim();
}

const matchTag = (content: string, tag: string): string => {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, "i");
  return content.match(regex)?.[1] || "";
};

export async function fetchRssFeed(url: string, defaultSource: string): Promise<FeedItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 } // Cache results for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch RSS from ${url}: Status ${res.status}`);
    }

    const xmlText = await res.text();
    const items: FeedItem[] = [];

    // Match all <item> tags
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let limitCount = 0;

    while ((match = itemRegex.exec(xmlText)) !== null && limitCount < 12) {
      const itemContent = match[1];

      const rawTitle = matchTag(itemContent, "title");
      const rawLink = matchTag(itemContent, "link");
      const rawPubDate = matchTag(itemContent, "pubDate");
      const rawSource = matchTag(itemContent, "source") || defaultSource;

      if (!rawTitle || !rawLink) continue;

      const headline = cleanXmlString(rawTitle);
      const link = cleanXmlString(rawLink);
      const pubDate = cleanXmlString(rawPubDate);
      const source = cleanXmlString(rawSource);

      items.push({
        id: `rss-${Buffer.from(link).toString("base64").slice(0, 12)}-${Date.now()}`,
        headline,
        link,
        pubDate,
        source
      });
      limitCount++;
    }

    return items;
  } catch (error) {
    console.error(`RSS Parser Error for ${url}:`, error);
    return [];
  }
}
