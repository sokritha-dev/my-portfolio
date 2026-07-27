export const notesListQuery = `*[_type == "note" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  summary,
  publishedAt,
  tags
}`;

export const noteBySlugQuery = `*[_type == "note" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  summary,
  publishedAt,
  tags,
  sections[] {
    heading,
    paragraphs,
    bullets
  }
}`;

export const noteSlugsQuery = `*[_type == "note" && defined(slug.current)]{ "slug": slug.current }`;
