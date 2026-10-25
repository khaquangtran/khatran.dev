import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Art } from './Art.jsx'
import { articles } from '../data/articles.js'

export function ArticleRow({ article, index }) {
  return (
    <Link to={`/article/${article.id}`} className="article-row">
      <div className={`article-thumb ${article.art}`}>
        <Art type={article.art} />
        <span className="thumb-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="article-copy">
        <div className="eyebrow">
          <i className={`dot ${article.accent}`} />
          {article.category}
        </div>
        <h3>{article.title}</h3>
        <p>{article.desc}</p>
        <div className="article-meta">
          {article.date}
          <span>·</span>
          {article.read}
        </div>
      </div>
      <ArrowRight className="row-arrow" size={20} />
    </Link>
  )
}

function FeatureArtwork() {
  return (
    <div className="feature-illustration">
      <div className="feature-illustration-label">
        <span>FIELD NOTE / INVENTORY</span>
        <span>01 — 03</span>
      </div>
      <svg
        viewBox="0 0 500 230"
        role="img"
        aria-label="Reservation state moving from separate Redis and MySQL systems into one MySQL transaction boundary"
      >
        <defs>
          <marker
            id="feature-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0 0L6 3L0 6" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
          </marker>
        </defs>
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="24" y="53" width="132" height="54" rx="2" />
          <rect x="24" y="123" width="132" height="54" rx="2" />
          <path d="M39 87h17m7 0h80M39 157h17m7 0h80" opacity=".35" />
          <path d="M171 115h94" stroke="var(--accent)" markerEnd="url(#feature-arrow)" />
          <rect x="294" y="53" width="180" height="124" rx="2" />
          <path d="M294 85h180M384 85v92" />
          <circle cx="45" cy="69" r="3" fill="var(--accent)" stroke="none" />
          <circle cx="45" cy="139" r="3" fill="var(--blue)" stroke="none" />
          <circle cx="313" cy="69" r="3" fill="var(--accent)" stroke="none" />
        </g>
        <g fill="currentColor" fontFamily="monospace">
          <text x="39" y="78" fontSize="11">
            Redis
          </text>
          <text x="39" y="99" fontSize="8" opacity=".58">
            RESERVATION COUNTER
          </text>
          <text x="39" y="148" fontSize="11">
            MySQL
          </text>
          <text x="39" y="169" fontSize="8" opacity=".58">
            INVENTORY LEDGER
          </text>
          <text x="315" y="74" fontSize="11">
            MySQL
          </text>
          <text x="309" y="108" fontSize="8" opacity=".58">
            RESERVATION UNITS
          </text>
          <text x="396" y="108" fontSize="8" opacity=".58">
            LEDGER
          </text>
          <text x="172" y="103" fontSize="7" opacity=".65">
            ONE ATOMIC
          </text>
          <text x="181" y="133" fontSize="7" opacity=".65">
            BOUNDARY
          </text>
        </g>
      </svg>
      <div className="feature-illustration-caption">
        <span>SEPARATE STATE</span>
        <i />
        <span>SHARED TRANSACTION</span>
      </div>
    </div>
  )
}

export function FeaturedArticle({ article }) {
  return (
    <Link to={`/article/${article.id}`} className={`featured-card ${article.art}`}>
      <FeatureArtwork />
      <div className="featured-copy">
        <div className="featured-label">
          <span className="eyebrow">
            <i className={`dot ${article.accent}`} />
            EDITOR’S PICK
          </span>
          <span className="eyebrow mono">01 / {String(articles.length).padStart(2, '0')}</span>
        </div>
        <div className="eyebrow featured-topic">{article.category}</div>
        <h3>{article.title}</h3>
        <p>{article.desc}</p>
        <div className="featured-bottom">
          <span className="article-meta">
            {article.date}
            <span>·</span>
            {article.read}
          </span>
          <span className="featured-read">
            READ STORY <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  )
}
