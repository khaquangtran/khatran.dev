import { articles } from '../data/articles.js'
import { getArticleMarkdown } from '../data/articleContent.js'
import { cheatsheets } from '../data/cheatsheets.js'

const stopWords = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'how',
  'in',
  'into',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'this',
  'to',
  'with',
])

function normalize(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function editDistanceWithin(left, right, limit) {
  if (Math.abs(left.length - right.length) > limit) return Infinity

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row]
    let rowMinimum = row
    for (let column = 1; column <= right.length; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + cost,
      )
      rowMinimum = Math.min(rowMinimum, current[column])
    }
    if (rowMinimum > limit) return Infinity
    previous = current
  }
  return previous[right.length]
}

const categoryAliases = {
  AWS: 'amazon web services aws cli',
  Docker: 'containers container images',
  Kubernetes: 'k8s kubectl cluster orchestration',
  Git: 'version control source control',
}

const searchIndex = [
  ...articles.map((article) => ({
    id: `article-${article.id}`,
    href: `/article/${article.id}`,
    kind: 'ARTICLE',
    title: article.title,
    category: article.category,
    description: article.desc,
    content: `${getArticleMarkdown(article.content)} ${article.searchText ?? ''}`,
    meta: `${article.date} · ${article.read}`,
    preview: article.desc,
  })),
  ...Object.entries(cheatsheets).flatMap(([category, entries]) =>
    entries.map((entry) => ({
      id: `command-${category}-${entry.title}`,
      href: `/cheatsheets?category=${encodeURIComponent(category)}#${commandAnchor(category, entry.title)}`,
      kind: `${category.toUpperCase()} COMMAND`,
      title: entry.title,
      category,
      description: entry.note,
      content: `${entry.code} ${entry.note} ${categoryAliases[category] ?? ''}`,
      meta: `CHEATSHEET · ${category}`,
      preview: entry.code,
    })),
  ),
]

const fields = [
  ['title', 10],
  ['category', 7],
  ['content', 5],
  ['description', 4],
]

export function commandAnchor(category, title) {
  return `cheat-${normalize(`${category}-${title}`).replace(/\s+/g, '-')}`
}

function scoreField(token, value, weight) {
  const words = normalize(value).split(' ').filter(Boolean)
  if (words.includes(token)) return weight
  if (words.some((word) => word.startsWith(token) || token.startsWith(word))) return weight * 0.78
  if (token.length >= 4 && words.some((word) => word.includes(token))) return weight * 0.58

  const threshold = token.length >= 8 ? 2 : token.length >= 4 ? 1 : 0
  if (!threshold) return 0
  const nearest = Math.min(...words.map((word) => editDistanceWithin(token, word, threshold)))
  return nearest <= threshold ? weight * (0.5 - nearest * 0.1) : 0
}

function scoreItem(item, query, tokens) {
  const normalizedQuery = normalize(query)
  const normalizedTitle = normalize(item.title)
  let score = 0
  let matchedTokens = 0

  if (normalizedTitle === normalizedQuery) score += 24
  else if (normalizedTitle.startsWith(normalizedQuery)) score += 16
  else if (normalizedTitle.includes(normalizedQuery)) score += 11

  for (const token of tokens) {
    const bestScore = Math.max(
      ...fields.map(([field, weight]) => scoreField(token, item[field], weight)),
    )
    if (bestScore > 0) {
      score += bestScore
      matchedTokens += 1
    }
  }

  if (tokens.length > 2 && matchedTokens < Math.ceil(tokens.length * 0.5)) return 0
  if (matchedTokens) score += (matchedTokens / tokens.length) * 3
  return score
}

export function searchContent(query) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []

  const tokens = normalizedQuery.split(' ').filter((token) => token && !stopWords.has(token))
  if (!tokens.length) return []

  return searchIndex
    .map((item, index) => ({ item, index, score: scoreItem(item, normalizedQuery, tokens) }))
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ item }) => item)
}
