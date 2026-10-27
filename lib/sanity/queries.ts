const seriesProjection = `series {
  title,
  "slug": slug.current,
  part
}`;

export const notesListQuery = `*[_type == "note" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  publishedAt,
  tags,
  ${seriesProjection},
  takeaways,
  body[] {
    _type,
    _key,
    heading,
    text,
    items,
    alt,
    caption,
    code,
    language,
    filename,
    headers,
    rows[] {
      _key,
      cells
    }
  }
}`;

export const noteBySlugQuery = `*[_type == "note" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  publishedAt,
  tags,
  ${seriesProjection},
  takeaways,
  body[] {
    _type,
    _key,
    heading,
    text,
    items,
    alt,
    caption,
    code,
    language,
    filename,
    headers,
    rows[] {
      _key,
      cells
    },
    image {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    }
  }
}`;

export const notesBySeriesSlugQuery = `*[_type == "note" && defined(slug.current) && series.slug.current == $seriesSlug] | order(series.part asc) {
  "slug": slug.current,
  title,
  "part": series.part
}`;

export const noteSlugsQuery = `*[_type == "note" && defined(slug.current)]{ "slug": slug.current }`;
