import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { articles } from '../data/articles.js'

export function Header({ dark, setDark }) {
  const [menu, setMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  useEffect(() => {
    setMenu(false)
    setSearchOpen(false)
    setQuery('')
  }, [location.pathname])
  const matches = query.trim()
    ? articles.filter((article) => article.title.toLowerCase().includes(query.toLowerCase()))
    : []
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
        <span>
          KHA<span className="brand-dot">.</span>TRN
        </span>
      </Link>
      <nav className={menu ? 'nav open' : 'nav'}>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/articles">Articles</NavLink>
        <NavLink to="/archive">Archive</NavLink>
        <NavLink to="/cheatsheets">Cheatsheets</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <div className="header-actions">
        <button
          className="icon-button"
          aria-label="Search articles"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search size={18} />
        </button>
        <button
          className="theme-button"
          aria-label="Toggle color theme"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
          <span>{dark ? 'Light' : 'Dark'}</span>
        </button>
        <a className="contact-button" href="mailto:hello@kha.trn">
          Get in touch <ArrowUpRight size={15} />
        </a>
        <button
          className="mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle navigation"
        >
          {menu ? <X /> : <Menu />}
        </button>
      </div>
      {searchOpen && (
        <div className="search-box">
          <Search size={16} />
          <input
            autoFocus
            placeholder="Search articles…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {matches.map((article) => (
            <Link key={article.id} to={`/article/${article.id}`}>
              {article.title}
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
