import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.setAttribute('content', content)
}

function resolveSchemaUrls(value, origin) {
  if (Array.isArray(value)) return value.map((item) => resolveSchemaUrls(item, origin))
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      key === 'url' && typeof item === 'string' && item.startsWith('/')
        ? new URL(item, origin).toString()
        : resolveSchemaUrls(item, origin),
    ]),
  )
}

export function Seo({
  title,
  description,
  author = 'Kha Trần',
  type = 'website',
  keywords,
  image,
  schema,
  robots = 'index,follow',
}) {
  const location = useLocation()

  useEffect(() => {
    const url = new URL(location.pathname, window.location.origin)
    const canonical = url.toString()
    const fullTitle = title.includes('Kha Trần') ? title : `${title} — Kha Trần`
    document.title = fullTitle

    setMeta('name', 'description', description)
    setMeta('name', 'author', author)
    setMeta('name', 'robots', robots)
    setMeta('name', 'keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', 'Kha Trần — Engineering Notes')
    setMeta('property', 'og:locale', 'en_US')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', image ? new URL(image, window.location.origin).toString() : '')
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image ? new URL(image, window.location.origin).toString() : '')

    let canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.append(canonicalLink)
    }
    canonicalLink.href = canonical

    const structuredData = schema
      ? {
          ...resolveSchemaUrls(schema, window.location.origin),
          url: schema['@type'] === 'WebSite' ? window.location.origin : canonical,
          ...(schema['@type'] === 'Article'
            ? { mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } }
            : {}),
        }
      : null
    let script = document.head.querySelector('#page-structured-data')
    if (!structuredData) {
      script?.remove()
      return
    }
    if (!script) {
      script = document.createElement('script')
      script.id = 'page-structured-data'
      script.type = 'application/ld+json'
      document.head.append(script)
    }
    script.textContent = JSON.stringify(structuredData).replace(/</g, '\\u003c')
  }, [author, description, image, keywords, location.pathname, robots, schema, title, type])

  return null
}
