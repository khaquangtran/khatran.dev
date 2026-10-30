---
title: 'Just Use Postgres!: a chapter-by-chapter reading guide'
description: 'A chapter-by-chapter tour of Denis Magda’s book, from relational SQL and indexes to JSON, full-text and vector search, time-series, geospatial, and queue workloads.'
date: '2026-10-28'
category: 'Databases / PostgreSQL'
read: '18 min read'
author: 'Kha Trần'
keywords: [PostgreSQL, Postgres, Denis Magda, database book, SQL, transactions, MVCC, recursive CTEs, window functions, indexes, JSONB, full-text search, vector search, pgvector, PostGIS, TimescaleDB, message queues, pgmq]
image: /assets/just-use-postgres/cover.svg
darkImage: /assets/just-use-postgres/cover-dark.svg
imageAlt: Postgres at the center of connected SQL, search, geospatial, time-series, queue, and vector workloads
imageCaption: The book explores Postgres as an application platform, from relational data to extension-powered workloads.
socialImage: /assets/just-use-postgres/cover.svg
socialImageAlt: Postgres at the center of connected SQL, search, geospatial, time-series, queue, and vector workloads
---

I picked up Denis Magda’s **Just Use Postgres!** because the slogan is easy to repeat and even easier to overread. Having worked through the book, I came away with a more useful interpretation: before bringing in another datastore, learn what the Postgres you already know can do—and make the decision from the workload, not the meme.

That is what makes this book worth recommending. It starts with everyday relational work, then steadily widens the frame to search, JSON, vector similarity, time-series, geospatial data, and queues. The SQL examples below are my simplified illustrations of the ideas, not quotations from the book.

## Chapter 1 — Meeting Postgres

The first chapter gets a working database in front of you: start Postgres, connect with `psql`, generate sample data, and run basic queries. I like that the book begins with a real feedback loop instead of treating Postgres as a list of features. You can type a query, see rows, and start asking better questions. A few `psql` commands make that loop less opaque: `\conninfo` tells you where the session is connected, `\dt` lists tables, and `\d orders` describes one table. Those backslash commands are conveniences from the `psql` client, not SQL statements sent to the server.

One small but useful tool is `generate_series`, which makes practice data directly in SQL. I can create a temporary table, populate it with a small dated set of toy readings, then query the result without writing a separate seed script:

```sql|label=GENERATE A SMALL SERIES
CREATE TEMP TABLE daily_metrics (
  recorded_on date PRIMARY KEY,
  requests integer NOT NULL,
  errors integer NOT NULL
);

INSERT INTO daily_metrics (recorded_on, requests, errors)
SELECT
  current_date - day_offset,
  1000 + day_offset * 17,
  day_offset % 13
FROM generate_series(0, 29) AS series(day_offset);

SELECT
  recorded_on,
  requests,
  errors,
  round(errors::numeric / NULLIF(requests, 0) * 100, 2) AS error_percent
FROM daily_metrics
ORDER BY recorded_on DESC
LIMIT 7;
```

`generate_series(0, 29)` yields 30 integer rows; the `INSERT ... SELECT` turns those rows into dated measurements. `NULLIF` prevents division by zero, while casting the numerator to `numeric` avoids integer division truncating the rate. A temporary table belongs to this session and is dropped when the session ends, which makes it handy for experiments. The larger lesson is that you do not need a separate scripting setup just to create a dataset for a query experiment. The chapter also frames “just use Postgres” as a first option to investigate, not a command to use it for every problem.

## Chapter 2 — Standard RDBMS capabilities

This chapter establishes the part of Postgres many applications rely on every day: tables, schemas, constraints, foreign keys, transactions, joins, functions, triggers, views, and access control. The important idea is that correctness belongs in the data model as well as in application code. A column type narrows the values a row can represent; `NOT NULL`, `CHECK`, `UNIQUE`, and foreign keys encode rules that should remain true no matter which service or maintenance script writes the data.

For example, a foreign key and a check constraint make two rules explicit at the database boundary:

```sql|label=MAKE DATA RULES EXPLICIT
CREATE TABLE order_items (
  order_id bigint REFERENCES orders(id),
  product_id bigint NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, product_id)
);
```

Application validation is still useful for clear errors, but the database constraint protects the invariant if a different code path writes the row. Relational structure also makes related facts straightforward to query: an order item can join its product, and `sum(quantity * unit_price)` can be calculated where the data is stored instead of being reassembled from several inconsistent caches.

Transactions make a group of writes succeed or fail together. Imagine a checkout that reserves inventory and creates an order. The application should check whether the conditional update returned a row; only then should it continue with the order insert and commit:

```sql|label=KEEP A CHECKOUT ATOMIC
BEGIN;

UPDATE inventory
SET available = available - $2
WHERE product_id = $1
  AND available >= $2
RETURNING product_id, available;

-- The application continues only if the UPDATE returned one row.
INSERT INTO orders (customer_id, status)
VALUES ($3, 'confirmed')
RETURNING id;

COMMIT;
```

If the update returns no row, the application should roll back and report that there is not enough stock; it must not insert the order. The check and decrement happen in one statement, so two concurrent checkouts cannot both read the same old count and blindly subtract from it. MVCC gives statements a consistent view of committed data, while row-level write conflicts still have to be coordinated. Transactions do not make every business rule automatic: the application still chooses its retry behavior and handles conflicts or serialization failures where appropriate.

## Chapter 3 — Modern SQL

Here the book moves from basic `SELECT` statements to common table expressions, recursive queries, and window functions. CTEs let me name a query step and build the next step from it. A window function then calculates across related rows without collapsing them into one row per group.

This example totals monthly sales and ranks customers within each month:

```sql|label=AGGREGATE, THEN RANK
WITH monthly_sales AS (
  SELECT
    customer_id,
    date_trunc('month', ordered_at) AS month,
    sum(total) AS revenue
  FROM orders
  GROUP BY customer_id, date_trunc('month', ordered_at)
)
SELECT
  customer_id,
  month,
  revenue,
  dense_rank() OVER (PARTITION BY month ORDER BY revenue DESC) AS monthly_rank
FROM monthly_sales
ORDER BY month, monthly_rank;
```

The CTE computes one row per customer and month. `dense_rank()` compares those rows inside each month, while preserving each customer’s revenue in the output; ties receive the same rank without leaving gaps. That is a different job from `GROUP BY`: aggregation changes the number of rows; a window function adds a calculation to the rows you already have. Another common window calculation is a running balance. The explicit `ROWS` frame makes clear that each row accumulates from the beginning of the customer’s ordered history through the current row:

```sql|label=CALCULATE A RUNNING TOTAL
SELECT
  customer_id,
  paid_at,
  payment_id,
  amount,
  sum(amount) OVER (
    PARTITION BY customer_id
    ORDER BY paid_at, payment_id
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS lifetime_paid
FROM payments
ORDER BY customer_id, paid_at, payment_id;
```

Including a stable tie-breaker such as `payment_id` matters when two payments share a timestamp: otherwise their order in the running result is not defined. Recursive CTEs apply the same step-by-step idea to hierarchical data such as an org chart or category tree. They have an anchor query for the starting node and a recursive query that finds the next level. A path array can guard against following a cycle forever:

```sql|label=TRAVERSE A CATEGORY TREE
WITH RECURSIVE category_tree AS (
  SELECT id, parent_id, name, 0 AS depth, ARRAY[id] AS path
  FROM categories
  WHERE id = $1

  UNION ALL

  SELECT child.id, child.parent_id, child.name,
         parent.depth + 1, parent.path || child.id
  FROM categories AS child
  JOIN category_tree AS parent ON child.parent_id = parent.id
  WHERE NOT child.id = ANY(parent.path)
)
SELECT id, parent_id, name, depth
FROM category_tree
ORDER BY path;
```

The anchor returns the chosen category. Each recursive pass adds its children; `path` remembers the visited IDs, and the final predicate stops a branch if it would revisit one. That guard is useful even when the application is meant to maintain an acyclic tree, because bad imported data should not make a query recurse indefinitely. The [PostgreSQL window-function guide](https://www.postgresql.org/docs/current/tutorial-window.html) is a good companion when the `OVER` clause starts to feel mysterious.

## Chapter 4 — Indexes

I think of an index as a maintained access path, not a saved copy of a query result. The chapter starts with the default B-tree, then compares specialized families: GIN for finding keys or lexemes inside composite values, GiST for structures such as spatial data, and BRIN for compact summaries over large tables whose physical row order correlates with the indexed values. The right question is not “which index is fastest?” but “what work does this query ask the database to do?”

Suppose an order screen needs the 20 newest open orders for one customer. First, write down that read shape:

```sql|label=THE QUERY TO SUPPORT
SELECT id, created_at, total
FROM orders
WHERE customer_id = $1
  AND status = 'open'
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

A partial, composite B-tree can match it:

```sql|label=PARTIAL COMPOSITE COVERING INDEX
CREATE INDEX orders_open_customer_created_idx
ON orders (customer_id, created_at DESC, id DESC)
INCLUDE (total)
WHERE status = 'open';
```

Each part has a job. The `WHERE` clause keeps closed orders out of this index. The leading `customer_id` key supports the equality filter; the next keys provide the requested newest-first order and make ties deterministic. `LIMIT 20` means the database may be able to stop after finding the first 20 matching entries instead of sorting every open order for that customer. `INCLUDE (total)` stores the returned value in the leaf entries without using it to navigate the tree.

That last choice can allow an index-only scan, because the query’s filter and output columns are available from the index. It does not promise one: PostgreSQL also checks whether the relevant heap pages are marked all-visible, and a recently updated table may still require heap visits. Included columns also make the index larger and add work to writes.

To see what PostgreSQL actually chooses, inspect the plan on representative data:

```sql|label=MEASURE THE READ PLAN
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, created_at, total
FROM orders
WHERE customer_id = 42
  AND status = 'open'
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

`EXPLAIN` shows the planned operations. `ANALYZE` runs this `SELECT` and adds actual row counts and timings; `BUFFERS` reports buffer hits and reads. Here `42` is a concrete customer ID to make the example runnable in `psql`; an application would bind a parameter. Compare estimated rows with actual rows, and look at how many rows the plan visits to return 20. The planner’s cost figures are relative units, not milliseconds, so read them with actual timing and buffer activity. A sequential scan is sometimes the best plan—for a tiny table or a query that returns much of it, walking an index and fetching rows can cost more. `EXPLAIN ANALYZE` executes the statement, so be especially careful before using it with writes. The official [EXPLAIN guide](https://www.postgresql.org/docs/current/using-explain.html) shows how to read the output.

The book also covers expression indexes. If an application repeatedly compares email addresses case-insensitively, an index on the expression can support the same expression in the predicate:

```sql|label=INDEX AN EXPRESSION
CREATE INDEX users_email_lower_idx
ON users (lower(email));

SELECT id
FROM users
WHERE lower(email) = lower($1);
```

The planner can use that index when the query expression matches. This is useful for a known access pattern, but each additional index consumes storage and has to be maintained on insert, update, and delete. The [PostgreSQL index guide](https://www.postgresql.org/docs/current/indexes.html) and [multicolumn index notes](https://www.postgresql.org/docs/current/indexes-multicolumn.html) are good references for the fine print.

The other index families become easier to place when I start from the data layout. For a large append-only metrics table whose rows are physically close to timestamp order, a BRIN index summarizes ranges of table pages instead of storing an entry for every row:

```sql|label=USE A SMALL BRIN INDEX FOR TIME-ORDERED DATA
CREATE INDEX metrics_recorded_at_brin_idx
ON metrics USING BRIN (recorded_at)
WITH (pages_per_range = 64);
```

BRIN can stay much smaller than a B-tree, but it is lossy: PostgreSQL uses the summaries to find candidate page ranges, then checks rows inside those ranges. If timestamps are randomly scattered through the table, the summaries become less selective. `pages_per_range` controls the granularity—smaller ranges can improve filtering at the cost of a larger index. GIN and GiST solve different problems, as the JSON, full-text, and geospatial chapters demonstrate.

## Chapter 5 — Postgres and JSON

Postgres can keep structured columns relational while storing a flexible document in `jsonb`. The chapter walks through extracting fields, containment checks, JSON path, and indexes. Unlike `json`, which preserves the original input text, `jsonb` stores a decomposed representation that is convenient to query and index. It is useful when document-shaped attributes genuinely vary, but it does not mean every relational field should be moved into one blob.

For a table with a `payload jsonb` column, a GIN index can help with containment queries:

```sql|label=QUERY A JSON DOCUMENT
CREATE INDEX events_payload_gin_idx
ON events USING GIN (payload);

SELECT id
FROM events
WHERE payload @> '{"kind":"checkout"}'::jsonb;
```

The `@>` operator asks whether the stored document contains the supplied structure. A GIN index is designed for this kind of search across values inside a composite document. The default and `jsonb_path_ops` operator classes support different query shapes, so the right one depends on the operators the application uses. See the official [JSONB indexing documentation](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING).

For a known field, the arrow operators make the difference between returning JSON and returning text visible: `->` keeps a JSON value, while `->>` extracts text. That distinction matters for comparisons and for building an expression index:

```sql|label=EXTRACT AND INDEX A JSON FIELD
SELECT
  id,
  payload -> 'customer' ->> 'email' AS customer_email
FROM events
WHERE payload ->> 'kind' = 'checkout';

CREATE INDEX events_kind_idx
ON events ((payload ->> 'kind'));
```

The index helps this exact expression predicate; a GIN index on the whole document is not automatically the best fit for every scalar lookup. If `kind` becomes a field every query filters by, or needs a foreign key, uniqueness rule, or range constraint, that is a signal to consider a normal relational column. I use JSONB for optional or evolving attributes and keep stable, high-value relationships relational. That balance gives me schema flexibility without giving up constraints and predictable access paths.

## Chapter 6 — Postgres for full-text search

This is the chapter I would point to when someone says “we need search” and immediately draws another box in the architecture. Postgres full-text search is not just a faster `LIKE '%words%'`. It has a pipeline: turn documents into normalized terms, turn the user’s text into a query, find matches, rank them, and optionally build an excerpt for the result page.

### Build a searchable document

`to_tsvector` tokenizes text and normalizes it according to a language configuration. For English, that can remove stop words and reduce word forms to lexemes, so “connects” and “connecting” can match the same normalized term. `setweight` lets a document give fields different importance. Here the title receives weight `A` and the body weight `B`:

```sql|label=STORE WEIGHTED SEARCH TERMS
ALTER TABLE articles
ADD COLUMN search_doc tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(body, '')), 'B')
) STORED;

CREATE INDEX articles_search_doc_gin_idx
ON articles USING GIN (search_doc);
```

The `||` concatenates the title and body vectors while preserving their positions and weights. A stored generated column keeps the search representation in step when either source field changes. The explicit `'english'` configuration is important: the same configuration must be used when building the query, and a different language may need a different configuration.

GIN is an inverted index: it maps each lexeme to the rows where that term appears. It narrows the candidate set for `@@`; PostgreSQL still reads matching rows to calculate a rank. That is why a GIN index can make matching fast without making relevance ranking free.

### Parse the user’s query and rank the matches

`plainto_tsquery` is a good fit when the input is just words and you want all surviving terms to match. For a search box that accepts quoted phrases, `OR`, or a leading minus sign, `websearch_to_tsquery` provides a friendlier search syntax:

```sql|label=SEARCH WITH WEB-LIKE SYNTAX
WITH search_input AS (
  SELECT websearch_to_tsquery('english', $1) AS terms
)
SELECT
  articles.id,
  articles.title,
  ts_rank(articles.search_doc, search_input.terms) AS relevance
FROM articles
CROSS JOIN search_input
WHERE articles.search_doc @@ search_input.terms
ORDER BY relevance DESC, articles.id
LIMIT 10;
```

If `$1` is `"connection pool" OR Postgres -MySQL`, the parser understands the quoted phrase, alternative, and exclusion. The `@@` operator tests whether a `tsvector` matches the `tsquery`. `ts_rank` scores the matching document, and the `ORDER BY` puts higher scores first. I would treat that score as a useful starting point, not an objective measure of relevance: many applications also need business rules such as freshness, popularity, or access permissions.

### Return a useful excerpt

Search results are easier to scan when they show where a match came from. `ts_headline` returns a fragment with the matched terms marked:

```sql|label=MAKE A RESULT EXCERPT
SELECT
  id,
  ts_headline(
    'english',
    articles.body,
    search_input.terms,
    'StartSel=<mark>, StopSel=</mark>, MaxFragments=2, MaxWords=20'
  ) AS excerpt
FROM articles
CROSS JOIN (
  SELECT websearch_to_tsquery('english', $1) AS terms
) AS search_input
WHERE articles.search_doc @@ search_input.terms
ORDER BY ts_rank(articles.search_doc, search_input.terms) DESC, articles.id
LIMIT 10;
```

This is presentation output, not sanitized HTML. If a web application renders the excerpt as markup, sanitize it first; the database does not make untrusted document text safe to inject into a page.

The limits matter too. Full-text search handles tokenization, language rules, boolean matching, and ranking, but it does not automatically handle misspellings or every domain-specific relevance rule. GIN indexes also take space and add write work. The book helped me see this as a capable search feature to measure against a real corpus—not a free replacement for every search service. See PostgreSQL’s [text-search controls](https://www.postgresql.org/docs/current/textsearch-controls.html) and [preferred text-search indexes](https://www.postgresql.org/docs/current/textsearch-indexes.html) for the operator and index details.

## Chapter 7 — Postgres extensions

This chapter explains why Postgres can grow without turning every new capability into a different database engine. Extensions can add types, functions, operators, and index support. They are also software that must be available and maintained wherever the database runs.

The SQL entry point is intentionally small, but I find it useful to check what the server can actually provide before deciding to depend on an extension:

```sql|label=ENABLE AN AVAILABLE EXTENSION
SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE name IN ('postgis', 'vector', 'pgmq')
ORDER BY name;

CREATE EXTENSION IF NOT EXISTS vector;
```

`pg_available_extensions` is a catalog view that reports extensions available to this server and whether one is already installed in the current database. `CREATE EXTENSION` creates that extension’s database objects in the database to which you are connected; it does not install arbitrary code on a hosted server. The extension must first be packaged and permitted by the service, and the required server version and upgrade path need to fit the deployment. I appreciate the book making the ecosystem visible while leaving room to ask practical questions about version support, upgrades, backups, and who owns the extension in production. Extensions are powerful because they integrate with SQL and indexes, but they also add a dependency to the database lifecycle.

## Chapter 8 — Postgres for generative AI

The vector chapter moves from generating embeddings to storing them, comparing them, indexing them, and using them in a retrieval-augmented generation (RAG) flow. With `pgvector`, a vector is data that can live beside the source record it represents. The embedding itself is normally produced by an application calling an embedding model; Postgres stores and searches those vectors. This example uses a 1,536-dimensional vector as a placeholder—its dimension must match the model that created both document and query embeddings:

```sql|label=FIND NEARBY EMBEDDINGS
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id bigint NOT NULL,
  content text NOT NULL,
  embedding vector(1536) NOT NULL
);

CREATE INDEX documents_embedding_hnsw_idx
ON documents USING hnsw (embedding vector_cosine_ops);

SELECT id, content, embedding <=> $1 AS cosine_distance
FROM documents
WHERE tenant_id = $2
ORDER BY embedding <=> $1
LIMIT 10;
```

Here `<=>` is the cosine-distance operator, and lower distance means a closer match. `vector_cosine_ops` tells HNSW which distance operation the index is built to support. HNSW and IVFFlat offer approximate nearest-neighbor search: they can trade some recall for speed and memory, so I would compare their results and latency with exact search on representative data before choosing parameters. A metadata filter such as `tenant_id` is also part of the real retrieval problem; with approximate search, filters can change how many candidates survive, so it needs to be measured rather than assumed to behave like a relational index scan.

In a small RAG flow, the application embeds a user’s question, asks this query for relevant text, and supplies those passages as context to a language model. Postgres handles storage, filtering, and candidate retrieval; the application still owns access control, prompt construction, and deciding whether the retrieved passages actually answer the question. Keeping vectors beside the source text and tenant metadata can simplify that path, but one database does not make the model or evaluation concerns disappear. The [pgvector project guide](https://github.com/pgvector/pgvector) documents its operators and index choices.

## Chapter 9 — Postgres for time-series data

Time-series workloads are organized around measurements arriving over time. This chapter introduces TimescaleDB hypertables and the `time_bucket` function, then uses continuous aggregates to summarize readings by useful intervals.

For instance, an hourly rollup for one device can be expressed as:

```sql|label=ROLL UP READINGS BY HOUR
SELECT
  time_bucket(INTERVAL '1 hour', recorded_at) AS hour,
  avg(value) AS average_value
FROM readings
WHERE device_id = $1
GROUP BY hour
ORDER BY hour;
```

The query groups timestamps into stable windows before calculating the average. A continuous aggregate materializes a rollup from a hypertable, then a refresh policy can keep a recent time range up to date:

```sql|label=MAINTAIN AN HOURLY ROLLUP
CREATE MATERIALIZED VIEW readings_hourly
WITH (timescaledb.continuous) AS
SELECT
  device_id,
  time_bucket(INTERVAL '1 hour', recorded_at) AS bucket,
  avg(value) AS average_value,
  max(value) AS peak_value,
  count(*) AS sample_count
FROM readings
GROUP BY device_id, bucket;

SELECT add_continuous_aggregate_policy(
  'readings_hourly',
  start_offset => INTERVAL '30 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour'
);
```

The source `readings` table is assumed to be a Timescale hypertable, and the `time_bucket` must use its time-partitioning column. The policy revisits a bounded recent window once an hour; it is not a promise that every new row is synchronously reflected in the summary. Choosing `start_offset` means deciding how far back late or corrected measurements should trigger recomputation. Choosing `end_offset` leaves the very newest interval outside that refresh window, which can reduce churn but affects how current a materialized-only read will be. Late-arriving historical data outside the policy window may need a manual refresh. Continuous aggregates can keep summaries ready for repeated reads rather than recomputing every interval from raw points on every dashboard request. That is helpful when the data volume and read pattern justify it; a regular table and ordinary SQL may be enough for a small stream. See the [Timescale continuous-aggregate guide](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/create-a-continuous-aggregate/) and [overview](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/about-continuous-aggregates/).

## Chapter 10 — Postgres for geospatial data

The geospatial chapter introduces spatial types and PostGIS, then shows how to load and query map data. The part I want readers to remember is that a coordinate is not just two numbers: the spatial reference system and the operations you need shape both correctness and performance. `geometry` treats coordinates as points in a chosen reference system, so distance uses that system’s units; for a longitude/latitude geometry those units are degrees, not meters. `geography` models locations on the earth and makes common distance measurements use meters, at additional computational cost. For a global “near me” lookup, geography is often convenient; for local engineering or map overlays in a suitable projected coordinate system, geometry can be the better fit.

With `location` stored as a `geography(Point, 4326)` value, this query finds places within one kilometer of a supplied longitude and latitude. `ST_MakePoint` takes longitude first, then latitude; `ST_SetSRID` labels those coordinates as EPSG:4326 before the point is cast to geography. Setting an SRID does not reproject or repair coordinates, so the label must match the coordinate values:

```sql|label=FIND PLACES NEAR A POINT
SELECT id, name
FROM places
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
  1000
);
```

For geography, that distance is in meters. A GiST spatial index can help PostGIS narrow the candidate set before checking the exact spatial relationship; the operator and indexed expression need to line up:

```sql|label=INDEX GEOGRAPHIC LOCATIONS
CREATE INDEX places_location_gix
ON places USING GIST (location);
```

The PostGIS [spatial-index FAQ](https://postgis.net/documentation/faq/spatial-indexes/) is a useful reference for that connection. It is still important to test the actual plan: an index is an option for the planner, not a command, and a query returning most of a small table may be cheaper as a sequential scan. I find the “spatially index-aware function” idea useful here: choose operations such as `ST_DWithin` that can first reduce candidates with an index and then perform the exact spatial check, instead of calculating an expensive distance against every row.

## Chapter 11 — Postgres as a message queue

The last chapter brings queue behavior back to tables and transactions. It explores a custom queue, `LISTEN` and `NOTIFY`, operational considerations, and the `pgmq` extension. A hand-built queue starts with ordinary relational choices: represent lifecycle state explicitly, make a stable order for eligible work, and index that claim pattern rather than every column:

```sql|label=DEFINE A SMALL JOB QUEUE
CREATE TABLE job_queue (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  state text NOT NULL CHECK (state IN ('ready', 'claimed', 'done', 'dead')),
  available_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz,
  attempts integer NOT NULL DEFAULT 0,
  payload jsonb NOT NULL
);

CREATE INDEX job_queue_ready_idx
ON job_queue (available_at, id)
WHERE state = 'ready';
```

A basic concurrent-claim pattern uses `FOR UPDATE SKIP LOCKED` so workers can claim different ready rows without waiting on the same locked job:

```sql|label=CLAIM READY JOBS
WITH candidates AS (
  SELECT id
  FROM job_queue
  WHERE state = 'ready' AND available_at <= now()
  ORDER BY available_at, id
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
UPDATE job_queue AS jobs
SET state = 'claimed',
    claimed_at = now(),
    attempts = jobs.attempts + 1
FROM candidates
WHERE jobs.id = candidates.id
RETURNING jobs.*;
```

This claim transaction is short: the worker locks a batch, updates their state, increments the attempt count, and receives the rows in one statement. The partial index supports the ready-job filter and ordering. A reaper can return abandoned claims to the ready pool with a delay, or move repeatedly failing jobs to a dead-letter state:

```sql|label=RECOVER EXPIRED CLAIMS
UPDATE job_queue
SET state = CASE WHEN attempts >= 5 THEN 'dead' ELSE 'ready' END,
    available_at = CASE
      WHEN attempts >= 5 THEN available_at
      ELSE now() + INTERVAL '1 minute'
    END,
    claimed_at = NULL
WHERE state = 'claimed'
  AND claimed_at < now() - INTERVAL '5 minutes';
```

This is a simple fixed-delay policy; a production system may use exponential backoff, error metadata, and a separate review path for dead jobs. A worker should make processing idempotent because a timeout can cause the same logical job to be attempted again, and an external side effect cannot be committed atomically with this database transaction.

`LISTEN` and `NOTIFY` can wake an idle worker after a producer commits a new job:

```sql|label=USE NOTIFY AS A WAKE-UP SIGNAL
-- Worker connection:
LISTEN jobs_ready;

-- Producer transaction:
BEGIN;
INSERT INTO job_queue (state, payload)
VALUES ('ready', '{"kind":"send_receipt","order_id":42}'::jsonb);
SELECT pg_notify('jobs_ready', '');
COMMIT;
```

PostgreSQL delivers that notification only after the producer commits. The worker should still query the table after connecting, after waking, and after reconnecting: notifications are a signal to look for durable work, not the durable work themselves. A missed wake-up must not lose a job. Keep transactions short so notifications are not delayed behind unrelated work.

For a ready-made queue, `pgmq` adds queue operations and visibility timeouts. After installing the extension, a consumer can create a queue, send a message, and read a batch that becomes temporarily invisible:

```sql|label=READ A BATCH WITH PGMQ
SELECT pgmq.create('email_jobs');

SELECT *
FROM pgmq.send(
  queue_name => 'email_jobs',
  msg => '{"to":"reader@example.com","template":"receipt"}'
);

SELECT *
FROM pgmq.read(
  queue_name => 'email_jobs',
  vt => 30,
  qty => 5
);

-- After successful processing, archive the message ID returned by read().
SELECT pgmq.archive(
  queue_name => 'email_jobs',
  msg_id => $1
);
```

The `vt` visibility timeout gives a consumer time to process the message; if it is not deleted or archived before the timeout, it becomes readable again. The acknowledgment uses the `msg_id` returned by `read`. That protects work from a crashed consumer, while making duplicate processing a behavior the consumer must expect. The extension supports archiving as well as deleting messages, which can help with inspection and replay. See the [pgmq project documentation](https://github.com/pgmq/pgmq) for the full API and installation options.

Postgres [documents `SKIP LOCKED`](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE) as useful for queue-like access while warning that it intentionally gives an inconsistent view; it is not a shortcut for ordinary reads. PostgreSQL [documents notification delivery](https://www.postgresql.org/docs/current/sql-notify.html) as transaction-aware signaling. That caveat is exactly why I like this chapter: it asks where the database fits, and what mechanics the application must still own.

## The appendices complete the argument

The optimization appendix reinforces practical habits: use `EXPLAIN`, add indexes for real access patterns, use connection pooling, fetch only the columns you need, and let the database do appropriate computation. The final appendix, **When not to use Postgres**, matters just as much as the feature tour. A dedicated system can still be the better choice when the workload needs independent scaling, a different failure boundary, or behavior Postgres does not provide well.

## Why I recommend it

I recommend **Just Use Postgres!** to developers who know basic SQL and want a guided tour of what sits beyond the usual CRUD path. The sequence is the strength: first understand tables and indexes, then see how those same fundamentals support search and specialized workloads. The book gives me more options to evaluate the next time a new service appears in an architecture proposal.

I would not read the title as “put everything in one database.” I read it as “know the tool you already have before adding another one.” That is a practical instinct, and this book gives it enough SQL and examples to become a design conversation instead of a slogan.

:::source-link
[Read the official book description and full contents on Manning](https://www.manning.com/books/just-use-postgres)
