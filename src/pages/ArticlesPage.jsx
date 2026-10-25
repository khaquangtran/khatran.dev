import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { articles, topics } from '../data/articles.js'
import { ArticleRow } from '../components/ArticleCards.jsx'
import { PageIntro } from '../components/PageIntro.jsx'
import { Seo } from '../components/Seo.jsx'

export function ArticlesPage() {
  const [topic, setTopic] = useState('All')
  const visible =
    topic === 'All'
      ? articles
      : articles.filter((article) => article.category.toLowerCase().includes(topic.toLowerCase()))
  return (
    <main className="content-page">
      <Seo
        title="Articles on databases and distributed systems"
        description="Browse practical engineering articles on databases, distributed systems, infrastructure, and building reliable software."
        keywords={[
          'engineering articles',
          'database articles',
          'distributed systems',
          'software infrastructure',
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Engineering articles',
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
        index="01"
        eyebrow="THE JOURNAL"
        title={
          <>
            Ideas, notes
            <br />
            and deep dives<span className="accent-period">.</span>
          </>
        }
        description="Writing on databases, distributed systems, infrastructure, and the decisions that make software reliable."
      />
      <div className="filter-bar">
        {topics.map((name) => (
          <button
            key={name}
            className={topic === name ? 'selected' : ''}
            onClick={() => setTopic(name)}
          >
            {name}
            <span>
              {name === 'All'
                ? articles.length
                : articles.filter((article) =>
                    article.category.toLowerCase().includes(name.toLowerCase()),
                  ).length}
            </span>
          </button>
        ))}
      </div>
      <div className="article-list page-article-list">
        {visible.map((article, index) => (
          <ArticleRow key={article.id} article={article} index={index} />
        ))}
      </div>
      <div className="page-end-link">
        <span>Looking for older notes?</span>
        <Link to="/archive">
          Browse the archive <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  )
}
