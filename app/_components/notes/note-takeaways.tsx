type NoteTakeawaysProps = {
  takeaways: string[];
};

export function NoteTakeaways({ takeaways }: NoteTakeawaysProps) {
  if (takeaways.length === 0) {
    return null;
  }

  return (
    <div className="border-y border-[hsl(var(--hairline))] py-6 sm:py-7">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
        Key takeaways
      </p>
      <ul className="mt-4 space-y-2.5 text-[15px] leading-7 text-foreground sm:text-base">
        {takeaways.slice(0, 5).map((takeaway) => (
          <li key={takeaway} className="flex gap-3">
            <span
              className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground"
              aria-hidden
            />
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
