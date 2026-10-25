import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro.jsx'

export function NotFoundPage() {
  return (
    <main className="content-page not-found-page">
      <PageIntro
        index="404"
        eyebrow="PAGE NOT FOUND"
        title={
          <>
            This note
            <br />
            isn’t here<span className="accent-period">.</span>
          </>
        }
        description="The address may be out of date or mistyped. The journal is still here when you’re ready."
      />
      <Link className="primary-button" to="/articles">
        BROWSE THE JOURNAL <ArrowRight size={16} />
      </Link>
    </main>
  )
}
