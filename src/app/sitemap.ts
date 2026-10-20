import type { MetadataRoute } from "next";
import { CATEGORIES, TOOLS, categorySlug } from "./lib/tools";
import { SITE_URL } from "./lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    ...CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/categoria/${categorySlug(cat)}`,
      priority: 0.7,
    })),
    ...TOOLS.map((tool) => ({
      url: SITE_URL + tool.href,
      priority: 0.8,
    })),
  ];
}
