---
title: 'PostgreSQL row locking, explained'
description: 'A practical guide to PostgreSQL row locks, lock waits, deadlocks, and how row-level locking compares with MySQL.'
date: '2026-10-12'
category: 'Databases / PostgreSQL'
read: '9 min read'
author: 'Kha Trần'
keywords: [PostgreSQL, row locking, transactions, deadlocks, databases]
image: /assets/row-locking/cover.svg
darkImage: /assets/row-locking/cover-dark.svg
imageAlt: Two database transactions contending for different rows, with one waiting on a lock
imageCaption: Row locks protect the records a transaction needs while unrelated work continues.
---

Row locks coordinate concurrent changes to the same records. They let unrelated work continue while protecting the rows a transaction needs to change.

The practical cost is usually waiting. Long transactions keep locks around, and a query that touches rows in an unexpected order can create contention or a deadlock.

Keep transactions short, inspect lock waits, and take locks in a consistent order. The goal is not to avoid locking; it is to make the critical section small and predictable.

## Make the trade-off visible

Good engineering is the habit of making important trade-offs legible. Once we can see the shape of the problem, we can build systems that stay understandable as they grow.
