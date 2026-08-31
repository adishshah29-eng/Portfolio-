export default function SplitHeading({ text, as: Tag = 'h1', className }) {
  const words = text.split(/\s+/);
  return (
    <Tag className={className} aria-label={text}>
      <span className="split-wrap" aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="word" style={{ '--i': i }}>{w}</span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
