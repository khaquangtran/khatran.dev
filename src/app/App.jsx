import { useLayoutEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { Footer } from '../components/Footer.jsx'
import { Home } from '../pages/Home.jsx'
import { ArticlesPage } from '../pages/ArticlesPage.jsx'
import { ArchivePage } from '../pages/ArchivePage.jsx'
import { AboutPage } from '../pages/AboutPage.jsx'
import { CheatsheetsPage } from '../pages/CheatsheetsPage.jsx'
import { ArticlePage } from '../pages/ArticlePage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'
import '../styles/global.css'

export function App() {
  const [dark, setDark] = useState(localStorage.getItem('kha-theme') === 'dark')
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('kha-theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <div className="site-shell">
      <Header dark={dark} setDark={setDark} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cheatsheets" element={<CheatsheetsPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  )
}
