import { useEffect, useState } from 'react'

export function ArticleToc({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    if (!headings.length) return undefined

    let frame = 0
    function updateActiveHeading() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const readingLine = 180
        let current = headings[0].id

        for (const heading of headings) {
          const element = document.getElementById(heading.id)
          if (element && element.getBoundingClientRect().top <= readingLine) current = heading.id
        }

        const atPageEnd =
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
        setActiveId(atPageEnd ? headings[headings.length - 1].id : current)
      })
    }

    updateActiveHeading()
    window.addEventListener('scroll', updateActiveHeading, { passive: true })
    window.addEventListener('resize', updateActiveHeading)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveHeading)
      window.removeEventListener('resize', updateActiveHeading)
    }
  }, [headings])

  return (
    <nav className="article-toc" aria-label="In this article">
      <span className="eyebrow mono">ON THIS PAGE</span>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          aria-current={activeId === heading.id ? 'location' : undefined}
        >
          {heading.title}
        </a>
      ))}
    </nav>
  )
}
