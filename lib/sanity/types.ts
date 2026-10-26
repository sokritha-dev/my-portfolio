export type NoteImageAsset = {
  _id?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
    };
  };
};

export type NoteHeadingBlock = {
  _type: "noteHeading";
  _key: string;
  heading: string;
};

export type NoteParagraphBlock = {
  _type: "noteParagraph";
  _key: string;
  text: string;
};

export type NoteBulletsBlock = {
  _type: "noteBullets";
  _key: string;
  items: string[];
};

export type NoteImageBlock = {
  _type: "noteImage";
  _key: string;
  alt: string;
  caption?: string;
  image?: {
    asset?: NoteImageAsset;
  };
};

export type NoteCodeBlock = {
  _type: "noteCode";
  _key: string;
  code: string;
  language?: string;
  filename?: string;
};

export type NoteBodyBlock =
  | NoteHeadingBlock
  | NoteParagraphBlock
  | NoteBulletsBlock
  | NoteImageBlock
  | NoteCodeBlock;

export type NoteSeries = {
  title: string;
  slug: string;
  part: number;
};

export type NoteListItem = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  series?: NoteSeries | null;
  takeaways?: string[];
};

export type Note = NoteListItem & {
  takeaways?: string[];
  body: NoteBodyBlock[];
};

export type NoteTocHeading = {
  id: string;
  label: string;
};

export type NoteSeriesPart = {
  slug: string;
  title: string;
  part: number;
};

export type NoteSeriesNav = {
  title: string;
  part: number;
  totalParts: number;
  previous: NoteSeriesPart | null;
  next: NoteSeriesPart | null;
};
