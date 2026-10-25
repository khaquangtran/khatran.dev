const markdownFiles = import.meta.glob('../content/articles/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseValue(value) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => parseValue(item))
      .filter(Boolean)
  }
  return trimmed
}

export function getArticleDocument(slug) {
  const source = markdownFiles[`../content/articles/${slug}.md`] ?? ''
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { metadata: {}, content: source }

  const metadata = Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .map((line) => line.match(/^([\w-]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, parseValue(value)]),
  )
  return { metadata, content: match[2] }
}

export function getArticleMarkdown(slug) {
  return getArticleDocument(slug).content
}
