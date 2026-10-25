import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro.jsx'
import { CopyCommand } from '../components/CopyCommand.jsx'
import { cheatsheets } from '../data/cheatsheets.js'
import { commandAnchor } from '../utils/search.js'
import { Seo } from '../components/Seo.jsx'

const categories = Object.keys(cheatsheets)
const commands = categories.flatMap((category) =>
  cheatsheets[category].map((command) => ({ ...command, category })),
)

export function CheatsheetsPage() {
  const [category, setCategory] = useState('All')
  const location = useLocation()
  const visible =
    category === 'All' ? commands : commands.filter((item) => item.category === category)
  const filters = ['All', ...categories]

  useEffect(() => {
    const requestedCategory = new URLSearchParams(location.search).get('category')
    setCategory(categories.includes(requestedCategory) ? requestedCategory : 'All')

    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.slice(1))
      requestAnimationFrame(() =>
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      )
    }
  }, [location.pathname, location.search, location.hash])

  return (
    <main className="content-page cheatsheet-page">
      <Seo
        title="Developer cheatsheets and command references"
        description="Quick, searchable command references for AWS, Docker, Kubernetes, Git, and everyday engineering workflows."
        keywords={[
          'developer cheatsheets',
          'AWS CLI commands',
          'Docker commands',
          'Kubernetes kubectl',
          'Git commands',
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Developer command cheatsheets',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: commands.map((command, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: `${command.category}: ${command.title}`,
            })),
          },
        }}
      />
      <PageIntro
        index="04"
        eyebrow="THE TOOLBOX"
        title={
          <>
            Commands worth
            <br />
            keeping close<span className="accent-period">.</span>
          </>
        }
        description="A working reference for the commands I reach for across cloud, containers, and everyday development."
      />

      <div className="filter-bar" role="tablist" aria-label="Filter commands by tool">
        {filters.map((name) => {
          const count = name === 'All' ? commands.length : cheatsheets[name].length
          return (
            <button
              key={name}
              role="tab"
              aria-selected={category === name}
              className={category === name ? 'selected' : ''}
              onClick={() => setCategory(name)}
            >
              {name}
              <span>{String(count).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>

      <section className="cheatsheet-reference" aria-label="Command reference">
        <div className="cheatsheet-reference-heading">
          <div>
            <span className="eyebrow mono">REFERENCE / {category.toUpperCase()}</span>
            <h2>{category === 'All' ? 'The command shelf' : `${category} commands`}</h2>
          </div>
          <span className="cheatsheet-count">
            {String(visible.length).padStart(2, '0')} COMMANDS
          </span>
        </div>

        <div className="cheat-list">
          {visible.map((item, index) => (
            <article
              className="cheat-entry"
              id={commandAnchor(item.category, item.title)}
              key={`${item.category}-${item.title}`}
            >
              <div className="cheat-entry-info">
                <div className="cheat-entry-meta mono">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span className="cheat-entry-divider">/</span>
                  <span>{item.category.toUpperCase()}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
              </div>

              <div className="cheat-entry-code">
                <div className="cheat-entry-code-head">
                  <span>COMMAND</span>
                  <CopyCommand code={item.code} />
                </div>
                <pre>
                  <code>{item.code}</code>
                </pre>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="cheat-footnote">
        <span>BEFORE YOU RUN IT</span> Replace placeholders such as <code>&lt;name&gt;</code> and{' '}
        <code>my-bucket</code> with values from your environment. Review commands that change or
        delete resources before running them.
      </p>
    </main>
  )
}
