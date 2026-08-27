type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}: Props) {
  return (
    <div
      className={`reveal max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
    >
      {eyebrow && (
        <div
          className={`flex items-center gap-3 mb-5 ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          <span className="hairline" />
          <span className="text-gold-500 text-xs font-semibold tracking-super-wide uppercase">
            {eyebrow}
          </span>
          <span className="hairline" />
        </div>
      )}
      <h2
        className={`font-display text-4xl md:text-5xl font-medium leading-tight ${
          light ? 'text-ink-900' : 'text-white'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-base md:text-lg leading-relaxed ${
            light ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
