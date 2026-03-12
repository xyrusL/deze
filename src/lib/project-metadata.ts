import { unstable_cache } from "next/cache";

export interface ProjectSource {
  url: string;
  fallbackName: string;
  fallbackDescription: string;
}

export interface ProjectMetadata {
  url: string;
  name: string;
  description: string;
  faviconUrl: string;
  hostname: string;
  isFallback: boolean;
}

const REVALIDATE_SECONDS = 60 * 60 * 12;
const INVALID_METADATA_PATTERN =
  /vercel security checkpoint|we'?re verifying your browser|enable javascript to continue/i;

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, decimal: string) =>
      String.fromCodePoint(parseInt(decimal, 10)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function parseAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {};

  for (const match of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*["']([^"']*)["']/g)) {
    attributes[match[1].toLowerCase()] = decodeHtmlEntities(match[2].trim());
  }

  return attributes;
}

function getHeadHtml(html: string): string {
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  return headMatch ? headMatch[0] : html;
}

function getMetaContent(headHtml: string, key: "name" | "property", value: string): string | null {
  for (const match of headHtml.matchAll(/<meta\s+[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    if (attrs[key] && attrs[key].toLowerCase() === value.toLowerCase()) {
      return attrs.content ?? null;
    }
  }

  return null;
}

function getTitle(headHtml: string): string | null {
  const match = headHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]) : null;
}

function getFavicon(headHtml: string, baseUrl: string): string {
  const relPriority = ["icon", "shortcut icon"];

  for (const preferredRel of relPriority) {
    for (const match of headHtml.matchAll(/<link\s+[^>]*>/gi)) {
      const attrs = parseAttributes(match[0]);
      const rel = attrs.rel?.toLowerCase();
      const href = attrs.href;

      if (!rel || !href) {
        continue;
      }

      if (rel === preferredRel || rel.split(/\s+/).includes(preferredRel)) {
        try {
          return new URL(href, baseUrl).toString();
        } catch {
          continue;
        }
      }
    }
  }

  return new URL("/favicon.ico", baseUrl).toString();
}

function isInvalidMetadata(title: string | null, description: string | null): boolean {
  return INVALID_METADATA_PATTERN.test(`${title ?? ""} ${description ?? ""}`.trim());
}

async function fetchProjectMetadata(source: ProjectSource): Promise<ProjectMetadata> {
  const hostname = new URL(source.url).hostname.replace(/^www\./, "");
  const fallbackFaviconUrl = new URL("/favicon.ico", source.url).toString();

  try {
    const response = await fetch(source.url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; DezeLandingBot/1.0; +https://landing.deze.me)",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Metadata request failed with status ${response.status}`);
    }

    const html = await response.text();
    const headHtml = getHeadHtml(html);
    const title = getMetaContent(headHtml, "property", "og:title") ?? getTitle(headHtml);
    const description =
      getMetaContent(headHtml, "property", "og:description") ??
      getMetaContent(headHtml, "name", "description");

    if (!title || !description || isInvalidMetadata(title, description)) {
      throw new Error("Metadata was missing or blocked by an interstitial page");
    }

    return {
      url: source.url,
      name: title,
      description,
      faviconUrl: getFavicon(headHtml, source.url),
      hostname,
      isFallback: false,
    };
  } catch {
    return {
      url: source.url,
      name: source.fallbackName,
      description: source.fallbackDescription,
      faviconUrl: fallbackFaviconUrl,
      hostname,
      isFallback: true,
    };
  }
}

const getCachedProjects = unstable_cache(
  async (sources: ProjectSource[]) => Promise.all(sources.map(fetchProjectMetadata)),
  ["landing-project-metadata"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getProjectMetadata(
  sources: ProjectSource[],
): Promise<ProjectMetadata[]> {
  return getCachedProjects(sources);
}
