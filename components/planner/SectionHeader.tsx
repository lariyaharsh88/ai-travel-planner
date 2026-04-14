type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

/** Minimal hierarchy: eyebrow → light display title → optional muted body */
export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <header className="mb-10 max-w-2xl sm:mb-12">
      <p className="type-eyebrow">{eyebrow}</p>
      <h3 className="type-display mt-3">{title}</h3>
      {subtitle ? <p className="type-body-muted mt-4 max-w-[42ch]">{subtitle}</p> : null}
    </header>
  );
}
