export function PageIntro({ index, eyebrow, title, description }) {
  return (
    <section className="page-intro">
      <div className="eyebrow mono">
        {index} / {eyebrow}
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}
