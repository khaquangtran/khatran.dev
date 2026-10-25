import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 KHA TRẦN</span>
      <span>BUILDING SYSTEMS, EXPLORING IDEAS.</span>
      <div>
        <Link to="/about">ABOUT</Link>
        <a href="mailto:hello@kha.trn">EMAIL</a>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          GITHUB ↗
        </a>
      </div>
    </footer>
  )
}
