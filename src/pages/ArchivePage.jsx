import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { articles } from '../data/articles.js'
import { PageIntro } from '../components/PageIntro.jsx'
import { Seo } from '../components/Seo.jsx'

export function ArchivePage() {
  const years = [...new Set(articles.map((article) => article.year))].sort((a, b) =>
    b.localeCompare(a),
  )
  return (
    <main className="content-page">
      <Seo
        title="Article archive"
        description="Explore the chronological archive of Kha Trần’s engineering notes on databases, distributed systems, and infrastructure."
        keywords={['engineering article archive', 'database notes', 'systems engineering']}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Engineering notes archive',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: articles.map((article, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: article.title,
              url: `/article/${article.id}`,
            })),
          },
        }}
      />
      <PageIntro
        index="02"
        eyebrow="THE ARCHIVE"
        title={
          <>
            Everything,
            <br />
            in its time<span className="accent-period">.</span>
          </>
        }
        description="A chronological index of published field notes and technical essays."
      />
      <div className="archive-years">
        {years.map((year) => {
          const yearArticles = articles.filter((article) => article.year === year)
          const months = [...new Set(yearArticles.map((article) => article.month))]
          return (
            <section className="archive-year" key={year}>
              <div className="archive-year-label">
                <span>{year}</span>
                <small>{yearArticles.length} ARTICLES</small>
              </div>
              <div className="archive-months">
                {months.map((month) => (
                  <div className="archive-month" key={month}>
                    <h2>{month}</h2>
                    {yearArticles
                      .filter((article) => article.month === month)
                      .map((article) => (
                        <Link
                          className="archive-entry"
                          to={`/article/${article.id}`}
                          key={article.id}
                        >
                          <span>{article.date.replace(`${month.slice(0, 3)} `, '')}</span>
                          <strong>{article.title}</strong>
                          <small>{article.read}</small>
                          <ArrowRight size={16} />
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
