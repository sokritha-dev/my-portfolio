export function SanitySetupNotice() {
  return (
    <div className="mt-12 rounded-[calc(var(--radius)*2)] border border-dashed border-border/70 bg-card/60 px-6 py-10 text-left shadow-[var(--shadow-soft)] sm:px-10">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-[hsl(var(--accent-strong))]">
        Sanity setup
      </p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
        Connect Sanity to publish notes.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
        Add your Sanity project credentials to <code>.env.local</code>, run the
        studio, seed your starter notes, then rebuild the site.
      </p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-7 text-foreground/90 sm:text-base">
        <li>Create a project at sanity.io/manage</li>
        <li>
          Copy <code>.env.example</code> to <code>.env.local</code> and fill in
          your project ID and dataset
        </li>
        <li>
          Run <code>npm run sanity:dev</code> to open the studio
        </li>
        <li>
          Run <code>npm run sanity:seed</code> to import the starter notes
        </li>
        <li>Run <code>npm run build</code> to generate note pages</li>
      </ol>
    </div>
  );
}
