import { ArrowUpRight } from 'lucide-react'
import { CopyCommand } from '../components/CopyCommand.jsx'

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

export function CodeBlock({ label, language, code }) {
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

export function ShopifyArticle() {
  return (
    <>
      <p className="article-lede">
        A checkout reservation is a short promise: hold these units while payment finishes, then
        claim them if payment succeeds or release them if it does not. Shopify moved this workflow
        from Redis into MySQL so reservation state and the inventory ledger could share a
        transaction boundary.
      </p>
      <div className="article-callout">
        <span>THE CORE IDEA</span>
        <p>
          Replace a hot quantity counter with a bounded pool of individual unit rows. A transaction
          locks available rows, skips rows another checkout already holds, and moves the selected
          units into a reservation.
        </p>
      </div>

      <h2 id="problem">The real problem was split ownership</h2>
      <p>
        The previous design stored a quantity key in Redis. Reserving inventory decremented that
        counter; releasing it incremented the counter again:
      </p>
      <CodeBlock
        label="SIMPLIFIED REDIS COUNTER"
        language="PSEUDOCODE"
        code={`# Reserve one unit\nDECR inventory:item-42\n\n# Release one unit\nINCR inventory:item-42`}
      />
      <p>
        Redis handled concurrency. The difficult edge was the later claim: after payment, MySQL had
        to update the inventory ledger while Redis removed the reservation. Those writes could not
        commit atomically across both systems. A failure between them could leave the ledger and
        reservation disagreeing: an item might be sold but not deducted, or deducted while still
        appearing reserved.
      </p>
      <ShopifyMigrationDiagram />
      <p>
        Putting reservation state beside the ledger gave Shopify one place to coordinate those
        transitions with ACID transactions. It also made it possible to model which inventory
        location can fulfill a reservation and removed the operational cost of a separate Redis
        cluster for this particular workflow. This is a workload-specific trade: Redis was not
        failing at atomic counter operations; the challenge was coordinating that counter with MySQL
        state.
      </p>

      <h2 id="lifecycle">Reservation lifecycle: hold, claim, or release</h2>
      <p>
        A reservation is temporary. When payment starts, the system holds units so another checkout
        cannot take them. A successful payment claims the reserved quantity against the inventory
        ledger. An unsuccessful or expired payment releases the hold back into the available pool.
      </p>
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
      <p>
        The SQL below is a teaching sketch of the reservation selection pattern. It is not Shopify’s
        production query or complete schema: it leaves out application-specific columns, validation,
        and the surrounding transaction handling.
      </p>

      <h2 id="unit-rows">Why represent each unit as a row?</h2>
      <p>
        An earlier shape—one row per item with a quantity column—concentrated concurrent updates on
        the same record. Shopify instead modeled each sellable unit as a row. To reserve two units,
        the transaction selects two rows for the correct shop, item, and inventory group.
      </p>
      <SkipLockedDiagram />
      <CodeBlock
        label="SIMPLIFIED RESERVATION SELECTION"
        language="MYSQL 8 · ILLUSTRATIVE"
        code={`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;\nSTART TRANSACTION;\n\nSELECT id\nFROM reservation_units\nWHERE shop_id = ?\n  AND inventory_item_id = ?\n  AND inventory_group_id = ?\nORDER BY id\nLIMIT 2\nFOR UPDATE SKIP LOCKED;\n\n-- The application checks that two rows were found,\n-- then removes those unit rows and records the hold.\nCOMMIT;`}
      />
      <p>
        <code>FOR UPDATE</code> locks the selected rows until the transaction completes.{' '}
        <code>SKIP LOCKED</code> tells MySQL not to wait for rows another checkout has locked; it
        can return different available units instead. That lets independent checkouts make progress
        without all queuing behind one hot counter.
      </p>
      <p>
        The production flow moves the selected unit rows out of the available pool and records the
        reservation. The order matters: Shopify changed reserve to delete from the unit pool first,
        then insert into <code>reserved_quantities</code>. Claim operates on the reservation record.
        Keeping this work transactional is what makes the state transition reliable.
      </p>
      <CodeBlock
        label="THE IMPORTANT WRITE ORDER"
        language="TRANSACTION SHAPE"
        code={`BEGIN;\n  SELECT available unit rows\n    FOR UPDATE SKIP LOCKED;\n\n  DELETE selected rows FROM reservation_units;\n  INSERT reservation record INTO reserved_quantities;\nCOMMIT;`}
      />

      <h2 id="bounded-pool">Keep the row pool bounded</h2>
      <p>
        One row per unit everywhere would make the table proportional to all stock. For an item with
        50,000 units stocked at 10 locations, that could mean 500,000 rows to scan and maintain.
        Shopify keeps a bounded pool—up to 1,000 available rows per item and location
        combination—and replenishes it from the inventory ledger.
      </p>
      <div className="pool-visual">
        <div className="pool-label">
          <span>AVAILABLE UNIT POOL</span>
          <b>CAP: 1,000 / ITEM / LOCATION</b>
        </div>
        <div className="pool-track">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
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
      <p>
        The cap is large enough to absorb bursts, but small enough to keep the table and lock scan
        manageable. If a hot item exhausts its pool, the reserve path replenishes inline. A lock
        makes one transaction do the refill while other reservations for that item wait, avoiding a
        thundering herd of refill attempts. That path can add latency, but it avoids incorrectly
        telling a buyer that available stock is sold out.
      </p>

      <h2 id="index-locks">Indexes and isolation change lock behavior</h2>
      <p>
        The first prototype used an auto-increment primary key. InnoDB then needed to lock the
        secondary index used by the filter and the clustered primary-key record. Shopify observed
        two row locks per reservation. The composite key placed the filter dimensions in the primary
        key itself:
      </p>
      <CodeBlock
        label="COMPOSITE PRIMARY KEY"
        language="MYSQL · SCHEMA SKETCH"
        code={`PRIMARY KEY (\n  shop_id,\n  inventory_item_id,\n  inventory_group_id,\n  id\n)`}
      />
      <p>
        That brought the observed lock count down to one row lock per reservation row. At high
        concurrency, a key definition changes how much lock work the database does for every
        checkout.
      </p>
      <p>
        They also found a less obvious issue when the pool was empty. Under MySQL’s default{' '}
        <code>REPEATABLE READ</code>, a locking read could take gap locks—including the supremum
        pseudo-record—which blocked replenishment inserts and contributed to deadlocks. For these
        transactions, Shopify switched to <code>READ COMMITTED</code>:
      </p>
      <CodeBlock
        label="TRANSACTION-SCOPED ISOLATION"
        language="MYSQL"
        code={`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;\nSTART TRANSACTION;\n\nSELECT id\nFROM reservation_units\nWHERE shop_id = ? AND inventory_item_id = ?\nFOR UPDATE SKIP LOCKED;\n\nCOMMIT;`}
      />
      <p>
        This was a targeted choice for the reservation path, not a blanket setting for every
        transaction in the application.
      </p>

      <h2 id="deadlocks-batching">Consistent lock order and fewer round trips</h2>
      <p>
        Reserve and claim initially touched two tables in different orders. Reserve inserted into{' '}
        <code>reserved_quantities</code> before deleting from <code>reservation_units</code>; claim
        deleted from <code>reserved_quantities</code>. Concurrent transactions could form a cycle
        while waiting on each other. Shopify standardized the reserve order to delete units first,
        then insert the reservation record.
      </p>
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
      <p>
        For carts with multiple line items, the team also used <code>UNION ALL</code> to batch
        reservation reads into one database round trip. This is a schematic illustration of the
        batching idea, not production SQL:
      </p>
      <CodeBlock
        label="BATCH LINE-ITEM LOOKUPS"
        language="SQL SHAPE · ILLUSTRATIVE"
        code={`(SELECT item_id, unit_id\n FROM available_units\n WHERE item_id = ?\n LIMIT ?)\n\nUNION ALL\n\n(SELECT item_id, unit_id\n FROM available_units\n WHERE item_id = ?\n LIMIT ?);`}
      />

      <h2 id="real-bottleneck">The bottleneck was connection time—not query speed</h2>
      <p>
        After the database design and queries looked healthy, throughput still hit a ceiling below
        target. Reservation latency was acceptable and CPU was not maxed out. Load tests showed
        MySQL threads queuing and backend connections exhausting at the ProxySQL layer. The team had
        optimized the reservation query, but had not yet identified which business processes were
        holding connections for how long.
      </p>
      <p>
        They tagged SQL statements with the calling process, then aggregated connection hold time
        through ProxySQL. The comment tag made usage attributable instead of treating the connection
        pool as one opaque total:
      </p>
      <CodeBlock
        label="TAG THE CALLER, MEASURE THE HOLD"
        language="SQL COMMENT"
        code={`/* conn_tag:checkout_completion */\nSELECT ...;\n\n-- Aggregate connection hold time by conn_tag\n-- at the ProxySQL layer.`}
      />
      <p>
        That visibility showed other checkout code was holding connections longer than necessary.
        Reservations were the last pressure on a pool that was already close to depletion—not the
        only slow query. Cleaning up the broader checkout path removed half of primary-database
        reads and a third of primary-database transactions. Revisiting MySQL thread-concurrency
        settings also helped remove the ceiling.
      </p>
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
      <p>
        The diagnostic lesson is useful: low CPU plus queuing can point toward connection pressure
        or time spent holding connections, even when individual queries look fast. Measure
        connection occupancy and caller behavior alongside query latency and CPU.
      </p>

      <h2 id="safe-rollout">Shadow mode made the migration reversible</h2>
      <p>
        Shopify ran Redis and MySQL in parallel. Every reservation was written to both systems while
        Redis remained the source of truth. The team compared business outcomes and performance
        against real production traffic; there were no in-flight reservations to migrate because
        both systems were live and building state.
      </p>
      <CutoverDiagram />
      <p>
        After confidence in correctness and performance, the source of truth moved to MySQL
        gradually, pod by pod, from lower-traffic environments toward the largest merchants. The
        dual-write path and kill switch preserved a way back to Redis during rollout.
      </p>

      <h2 id="takeaways">What I’m taking away</h2>
      <ul className="article-takeaways">
        <li>
          Keep reservation state and its ledger together when correctness depends on changing both
          atomically.
        </li>
        <li>
          Use a row-level data shape and <code>SKIP LOCKED</code> to let concurrent checkouts claim
          different units.
        </li>
        <li>Bound the pool so the per-unit model stays operationally manageable.</li>
        <li>
          Inspect real lock behavior, isolation, and lock ordering; small schema choices change
          concurrency costs.
        </li>
        <li>
          When a throughput ceiling does not match CPU or query latency, measure connection hold
          time across the full checkout path.
        </li>
        <li>
          Use shadow traffic and gradual rollout to validate outcomes before changing the source of
          truth.
        </li>
      </ul>
      <p className="source-note">
        This is an explanatory walkthrough, not Shopify’s production SQL or schema. The mechanics,
        migration decisions, and reported figures are summarized from the original engineering post.
      </p>
      <a
        className="source-link"
        href="https://shopify.engineering/scaling-inventory-reservations"
        target="_blank"
        rel="noreferrer"
      >
        Read the original on Shopify Engineering <ArrowUpRight size={15} />
      </a>
      <p className="signature">— Kha</p>
    </>
  )
}
