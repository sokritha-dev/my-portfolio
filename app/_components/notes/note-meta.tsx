type NoteMetaProps = {
  displayDate: string;
  readingTimeLabel: string;
  tags: string[];
};

export function NoteMeta({
  displayDate,
  readingTimeLabel,
  tags,
}: NoteMetaProps) {
  const parts = [displayDate, readingTimeLabel, ...tags];

  return (
    <p className="text-sm text-muted-foreground">
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {index > 0 ? (
            <span className="mx-2 text-muted-foreground/50" aria-hidden>
              ·
            </span>
          ) : null}
          {part}
        </span>
      ))}
    </p>
  );
}
