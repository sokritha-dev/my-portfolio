export type NoteSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type NoteListItem = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
};

export type Note = NoteListItem & {
  sections: NoteSection[];
};
