import { CopyCommand } from './CopyCommand.jsx'

export function CodeBlock({ code, language = 'TEXT', label = 'CODE' }) {
  return (
    <figure className="article-code">
      <figcaption>
        <span>{label}</span>
        <div className="article-code-tools">
          <span>{language}</span>
          <CopyCommand code={code} label="code" />
        </div>
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  )
}

export function ArticleImage({ src, alt = '', caption }) {
  return (
    <figure className="article-image">
      <img src={src} alt={alt} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export function ArticleCallout({ title = 'NOTE', children }) {
  return (
    <aside className="article-callout">
      <span>{title}</span>
      <p>{children}</p>
    </aside>
  )
}

export function ShopifyMigrationDiagram() {
  return (
    <figure className="shopify-diagram">
      <div className="diagram-caption">
        <span>01 / DATA OWNERSHIP</span>
        <span>BEFORE → AFTER</span>
      </div>
      <div className="migration-columns">
        <section className="migration-state old-state">
          <div className="migration-state-title">
            <span>BEFORE</span>
            <b>Two systems</b>
          </div>
          <div className="mini-system">
            <div className="mini-box redis-box">
              <strong>Redis</strong>
              <small>short-lived reservation</small>
            </div>
            <span className="mini-connector split">
              <i /> separate atomic boundary
            </span>
            <div className="mini-box mysql-box">
              <strong>MySQL</strong>
              <small>inventory ledger</small>
            </div>
          </div>
          <p>
            Payment claim had to update MySQL and clean up Redis. Those operations could not commit
            atomically together.
          </p>
        </section>
        <section className="migration-state new-state">
          <div className="migration-state-title">
            <span>AFTER</span>
            <b>One transaction boundary</b>
          </div>
          <div className="mini-box mysql-box unified-box">
            <strong>MySQL</strong>
            <div className="mysql-parts">
              <span>reservation units</span>
              <span>inventory ledger</span>
            </div>
            <small>reserve + claim under ACID</small>
          </div>
          <p>
            Reservations and the ledger share a database, so reserve and claim can use transactional
            guarantees.
          </p>
        </section>
      </div>
      <figcaption>
        The change was about making inventory state and its ledger agree safely—not a claim that
        Redis cannot be durable.
      </figcaption>
    </figure>
  )
}

export function SkipLockedDiagram() {
  const units = ['LOCKED', 'AVAILABLE', 'LOCKED', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE']
  return (
    <figure className="skip-locked-figure">
      <div className="diagram-caption">
        <span>02 / RESERVE TWO UNITS</span>
        <span>MYSQL 8 · SKIP LOCKED</span>
      </div>
      <div className="unit-grid">
        {units.map((state, index) => (
          <div
            key={index}
            className={`unit-cell ${state === 'LOCKED' ? 'unit-locked' : index === 3 || index === 5 ? 'unit-picked' : ''}`}
          >
            <span>UNIT {String(index + 1).padStart(2, '0')}</span>
            <b>
              {state === 'LOCKED' ? 'IN USE' : index === 3 || index === 5 ? 'RESERVED' : 'READY'}
            </b>
          </div>
        ))}
      </div>
      <div className="skip-locked-note">
        <span className="skip-lock-mark">↗</span>
        <p>
          <strong>Skip the rows another checkout holds.</strong>
          <br />
          The query can take other available units instead of waiting on the same locked rows.
        </p>
      </div>
      <div className="sql-strip">
        <span>SELECT … FOR UPDATE SKIP LOCKED</span>
        <span>LOCK ONLY WHAT YOU CLAIM</span>
      </div>
      <figcaption>
        Illustrative example. Shopify describes one reservation row per sellable unit and a bounded
        pool of available rows.
      </figcaption>
    </figure>
  )
}

export function CutoverDiagram() {
  return (
    <figure className="cutover-figure">
      <div className="diagram-caption">
        <span>03 / THE CUTOVER</span>
        <span>GRADUAL · REVERSIBLE</span>
      </div>
      <div className="cutover-steps">
        <div>
          <span>01</span>
          <b>Dual write</b>
          <small>Redis stays source of truth</small>
        </div>
        <i>→</i>
        <div>
          <span>02</span>
          <b>Shadow compare</b>
          <small>Validate outcomes + performance</small>
        </div>
        <i>→</i>
        <div>
          <span>03</span>
          <b>Switch gradually</b>
          <small>Pod by pod, kill switch ready</small>
        </div>
      </div>
      <figcaption>
        Because both systems were live during shadow mode, Shopify says there were no in-flight
        reservations to migrate.
      </figcaption>
    </figure>
  )
}

export function LifecycleFlow() {
  return (
    <div className="lifecycle-flow">
      <div>
        <span>01 / CHECKOUT</span>
        <b>Reserve</b>
        <small>Hold units for a short window</small>
      </div>
      <i>→</i>
      <div>
        <span>02 / PAYMENT</span>
        <b>Claim</b>
        <small>Commit the sale to inventory</small>
      </div>
      <i>↘</i>
      <div>
        <span>02 / PAYMENT FAILS</span>
        <b>Release</b>
        <small>Return units to availability</small>
      </div>
    </div>
  )
}

export function PoolVisual() {
  return (
    <div className="pool-visual">
      <div className="pool-label">
        <span>AVAILABLE UNIT POOL</span>
        <b>CAP: 1,000 / ITEM / LOCATION</b>
      </div>
      <div className="pool-track">
        {Array.from({ length: 10 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="pool-legend">
        <span>
          <i className="pool-ready" />
          Available row
        </span>
        <span>
          <i className="pool-consumed" />
          Reserved / consumed
        </span>
        <span>Replenish from ledger ↗</span>
      </div>
    </div>
  )
}

export function LockOrderVisual() {
  return (
    <div className="lock-order-visual">
      <div>
        <span>BEFORE</span>
        <p>
          RESERVE <b>reserved_quantities</b> → <b>reservation_units</b>
        </p>
        <p>
          CLAIM <b>reserved_quantities</b>
        </p>
        <em>conflicting acquisition order</em>
      </div>
      <div>
        <span>AFTER</span>
        <p>
          RESERVE <b>reservation_units</b> → <b>reserved_quantities</b>
        </p>
        <p>
          CLAIM <b>reserved_quantities</b>
        </p>
        <em>consistent order breaks the cycle</em>
      </div>
    </div>
  )
}

export function MetricCallout() {
  return (
    <div className="metric-callout">
      <div>
        <b>−50%</b>
        <span>primary reads after checkout-path cleanup</span>
      </div>
      <i />
      <div>
        <b>−33%</b>
        <span>primary transactions after cleanup</span>
      </div>
      <small>Production results reported by Shopify Engineering</small>
    </div>
  )
}
