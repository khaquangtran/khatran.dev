import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { articles } from '../data/articles.js'
import { Art } from '../components/Art.jsx'
import { PageIntro } from '../components/PageIntro.jsx'
import { ShopifyArticle } from './ShopifyArticle.jsx'

export function ArticlePage() {
  const { id } = useParams()
  const articleIndex = articles.findIndex((item) => item.id === id)
  const article = articles[articleIndex]

  if (!article)
    return (
      <main className="content-page">
        <PageIntro
          index="404"
          eyebrow="NOT FOUND"
          title="This note isn’t here."
          description="The link may be old or mistyped."
        />
        <Link className="primary-button" to="/articles">
          BACK TO ARTICLES <ArrowRight size={16} />
        </Link>
      </main>
    )

  const isShopify = article.id === 'shopify-reservations'
  const articleNumber = String(articleIndex + 1).padStart(2, '0')
  const nextArticle = articles[(articleIndex + 1) % articles.length]

  return (
    <main className="article-page article-page-v2">
      <div className="article-detail article-redesign">
        <div className="article-topbar">
          <Link to="/articles" className="back-link">
            <ArrowRight size={14} /> ALL FIELD NOTES
          </Link>
          <span>JOURNAL / {articleNumber}</span>
        </div>

        <header className="article-header">
          <div className="article-heading">
            <div className="eyebrow article-category">
              <i className={`dot ${article.accent}`} />
              {article.category}
            </div>
            <h1>{article.title}</h1>
            <p className="article-dek">{article.desc}</p>
          </div>
          <aside className="article-meta-panel" aria-label="Article details">
            <div>
              <span>PUBLISHED</span>
              <b>{article.date}</b>
            </div>
            <div>
              <span>READING TIME</span>
              <b>{article.read}</b>
            </div>
            <div>
              <span>FIELD NOTE</span>
              <b>
                {articleNumber} / {article.year}
              </b>
            </div>
          </aside>
        </header>

        {isShopify && (
          <div className="article-hero-stats">
            <div>
              <span>THE MOVE</span>
              <b>Redis → MySQL</b>
            </div>
            <div>
              <span>THE PRIMITIVE</span>
              <b>SKIP LOCKED</b>
            </div>
            <div>
              <span>THE REAL FIND</span>
              <b>Connection time</b>
            </div>
          </div>
        )}

        <figure className={`detail-art ${article.art}`}>
          <Art type={article.art} />
          <figcaption>
            {isShopify ? 'INVENTORY RESERVATIONS / SYSTEM MAP' : `FIELD NOTE / ${article.year}`}
          </figcaption>
        </figure>

        <div className={`article-reading ${isShopify ? 'shopify-reading' : ''}`}>
          <aside className="article-side-rail">
            {isShopify ? (
              <nav className="article-toc" aria-label="In this article">
                <span className="eyebrow mono">ON THIS PAGE</span>
                <a href="#problem">The split state problem</a>
                <a href="#lifecycle">Reservation lifecycle</a>
                <a href="#unit-rows">One row per unit</a>
                <a href="#bounded-pool">Bounded pool</a>
                <a href="#index-locks">Indexes + isolation</a>
                <a href="#deadlocks-batching">Lock order + batching</a>
                <a href="#real-bottleneck">Connection bottleneck</a>
                <a href="#safe-rollout">Safe cutover</a>
                <a href="#takeaways">Takeaways</a>
              </nav>
            ) : (
              <div className="article-topic-rail">
                <span className="eyebrow mono">SUBJECT</span>
                <b>{article.category}</b>
                <p>Part of the engineering field notes.</p>
                <Link to="/articles">
                  Browse all notes <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </aside>

          <article className="prose-section">
            {isShopify ? (
              <ShopifyArticle />
            ) : (
              <>
                {article.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <h2>Make the trade-off visible</h2>
                <p>
                  Good engineering is the habit of making important trade-offs legible. Once we can
                  see the shape of the problem, we can build systems that stay understandable as
                  they grow.
                </p>
              </>
            )}
          </article>
        </div>

        <nav className="article-pagination" aria-label="Continue reading">
          <Link to="/articles" className="article-pagination-back">
            <span>JOURNAL INDEX</span>
            <b>All field notes</b>
          </Link>
          <Link to={`/article/${nextArticle.id}`} className="article-pagination-next">
            <span>NEXT FIELD NOTE · {nextArticle.category}</span>
            <b>{nextArticle.title}</b>
            <ArrowRight size={18} />
          </Link>
        </nav>
      </div>
    </main>
  )
}
