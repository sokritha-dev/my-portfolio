import "../sanity/env-loader.node";

import { getCliClient } from "sanity/cli";

/**
 * Curated related-note links. Edit this map, then:
 *   npm run sanity:link-related
 *
 * Keys and values are note slugs. Links are one-way unless both sides list each other.
 */
const RELATED_BY_SLUG: Record<string, string[]> = {
  "how-can-a-list-of-numbers-understand-a-product": [
    "ai-product-search-step-by-step",
  ],
  "ai-product-search-step-by-step": [
    "how-can-a-list-of-numbers-understand-a-product",
  ],
  // Series notes use series prev/next instead of Related.
  "owasp-top10-overview": [],
  "a01-broken-access-control-explained-with-code": [],
};

const client = getCliClient();

async function idForSlug(slug: string): Promise<string | null> {
  const note = await client.fetch<{ _id: string } | null>(
    `*[_type == "note" && slug.current == $slug][0]{ _id }`,
    { slug }
  );
  return note?._id ?? null;
}

async function linkRelatedNotes() {
  for (const [slug, relatedSlugs] of Object.entries(RELATED_BY_SLUG)) {
    const noteId = await idForSlug(slug);
    if (!noteId) {
      console.warn(`Skip ${slug}: note not found`);
      continue;
    }

    const refs: Array<{
      _type: "reference";
      _key: string;
      _ref: string;
    }> = [];

    for (const relatedSlug of relatedSlugs) {
      const relatedId = await idForSlug(relatedSlug);
      if (!relatedId) {
        console.warn(`  Skip related ${relatedSlug}: not found`);
        continue;
      }
      if (relatedId === noteId) {
        console.warn(`  Skip related ${relatedSlug}: same note`);
        continue;
      }
      refs.push({
        _type: "reference",
        _key: `related-${relatedSlug}`,
        _ref: relatedId,
      });
    }

    await client
      .patch(noteId)
      .set({ relatedNotes: refs })
      .commit({ autoGenerateArrayKeys: false });

    console.log(
      `Linked /notes/${slug} → ${refs.map((ref) => ref._key.replace(/^related-/, "")).join(", ") || "(none)"}`
    );
  }
}

linkRelatedNotes().catch((error) => {
  console.error(error);
  process.exit(1);
});
