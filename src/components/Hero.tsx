import { profile } from '../data/resume'
import { entries } from '../data/entries'

export default function Hero() {
  return (
    <section id="top" className="hero" style={{ ['--first' as string]: entries[0].accent }}>
      <div className="container hero__inner">
        <h1 className="hero__name">
          Jaehyeon <span className="hero__name-accent">(Julian)</span> Park
        </h1>
        <p className="hero__contact">
          <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a>
          <span className="hero__contact-sep" aria-hidden="true">·</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span className="hero__contact-sep" aria-hidden="true">·</span>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <span className="hero__contact-sep" aria-hidden="true">·</span>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </p>
      </div>

      <a className="hero__scroll" href={`#${entries[0].id}`} aria-label="Scroll to timeline">
        <span className="hero__scroll-line" />
      </a>
    </section>
  )
}
