import { ArrowUpRight } from 'lucide-react'
import { PageIntro } from '../components/PageIntro.jsx'

export function AboutPage() {
  return (
    <main className="content-page about-page">
      <PageIntro
        index="03"
        eyebrow="A LITTLE ABOUT ME"
        title={
          <>
            Hello, I’m
            <br />
            Kha<span className="accent-period">.</span>
          </>
        }
        description="Backend engineer, curious systems thinker, and writer of these field notes."
      />
      <section className="about-layout">
        <div className="about-monogram" aria-hidden="true">
          <span>K</span>
          <i>SAIGON · VN</i>
        </div>
        <div className="about-copy">
          <span className="eyebrow mono">WHY THIS JOURNAL EXISTS</span>
          <p className="about-lead">
            I’m interested in the invisible architecture behind software: the data models, queues,
            databases, and careful decisions that help products stay dependable as they grow.
          </p>
          <p>
            This journal is where I work through what I’m learning. I write practical notes on
            backend engineering, distributed systems, databases, and infrastructure, with an
            emphasis on making complicated ideas easier to reason about.
          </p>
          <p>
            Outside the code, I’m drawn to clear writing, thoughtful tools, and the small
            engineering choices that make a system easier for the next person to understand.
          </p>
          <div className="about-contact">
            <span className="eyebrow mono">SAY HELLO</span>
            <a href="mailto:hello@kha.trn">
              hello@kha.trn <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
