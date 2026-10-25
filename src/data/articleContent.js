const markdownFiles = import.meta.glob('../content/articles/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export function getArticleMarkdown(slug) {
  return markdownFiles[`../content/articles/${slug}.md`] ?? ''
}
