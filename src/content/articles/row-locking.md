Row locks coordinate concurrent changes to the same records. They let unrelated work continue while protecting the rows a transaction needs to change.

The practical cost is usually waiting. Long transactions keep locks around, and a query that touches rows in an unexpected order can create contention or a deadlock.

Keep transactions short, inspect lock waits, and take locks in a consistent order. The goal is not to avoid locking; it is to make the critical section small and predictable.

## Make the trade-off visible

Good engineering is the habit of making important trade-offs legible. Once we can see the shape of the problem, we can build systems that stay understandable as they grow.
