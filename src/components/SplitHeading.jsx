export default function SplitHeading({ text, as: Tag = 'h1', className, splitBy = 'word' }) {
  const words = text.split(/\s+/);
  return (
    <Tag className={className} aria-label={text}>
      <span className="split-wrap" aria-hidden="true">
        {splitBy === 'letter'
          ? [...text].map((ch, i) =>
              ch === ' ' ? ' ' : (
                <span key={i} className="letter" style={{ '--i': i }}>{ch}</span>
              )
            )
          : words.map((w, i) => (
              <span key={i}>
                <span className="word" style={{ '--i': i }}>{w}</span>
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
      </span>
    </Tag>
  );
}
