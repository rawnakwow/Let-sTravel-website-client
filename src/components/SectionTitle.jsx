export default function SectionTitle({ eyebrow, title, text, action }) {
  return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2 className="title">{title}</h2>{text && <p className="muted">{text}</p>}</div>{action}</div>;
}
