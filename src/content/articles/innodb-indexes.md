---
title: 'Deep dive into InnoDB indexes'
description: 'Learn how InnoDB clustered and secondary indexes store data, and how primary-key choices affect query performance and storage.'
date: '2026-09-28'
category: 'System design'
read: '11 min read'
author: 'Kha Trần'
keywords: [MySQL, InnoDB, indexes, clustered index, database performance]
image: /assets/innodb-indexes/cover.svg
darkImage: /assets/innodb-indexes/cover-dark.svg
imageAlt: InnoDB primary-key index tree branching into leaf pages and rows
imageCaption: The primary key organizes the clustered index; secondary indexes point back to it.
---

InnoDB’s primary key is more than a lookup path: it defines how rows are organized in the clustered index. Secondary indexes store their own key and a reference back to that primary key.

This organization can make primary-key lookups efficient, while wide primary keys increase the size of every secondary index. Index design therefore affects both read paths and storage costs.

Use query plans and real workload measurements to decide which indexes earn their cost. An index that is never used still takes space and adds work to writes.

## Make the trade-off visible

Good engineering is the habit of making important trade-offs legible. Once we can see the shape of the problem, we can build systems that stay understandable as they grow.
