import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { articles, topics } from '../data/articles.js'
import { ArticleRow } from '../components/ArticleCards.jsx'
import { PageIntro } from '../components/PageIntro.jsx'

export function ArticlesPage() {
  const [topic, setTopic] = useState('All')
  const visible =
    topic === 'All'
      ? articles
      : articles.filter((article) => article.category.toLowerCase().includes(topic.toLowerCase()))
  return (
    <main className="content-page">
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
