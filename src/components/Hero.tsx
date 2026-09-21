import { profile } from '../data/resume'
import { entries } from '../data/entries'

export default function Hero() {
  return (
    <section id="top" className="hero" style={{ ['--first' as string]: entries[0].accent }}>
      <div className="container hero__inner">
        <h1 className="hero__name" aria-label="Jaehyeon (Julian) Park">
          {['Jaehyeon', '(Julian)', 'Park'].map((word, i) => (
            <span key={word} className="hero__mask" aria-hidden="true">
              <span
                className={`hero__word ${word === '(Julian)' ? 'hero__word--accent' : ''}`}
                style={{ ['--i' as string]: i }}
              >
                {word.split('').map((ch, j) => (
                  <span key={j} className="hero__char" style={{ ['--j' as string]: j }}>
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero__tagline hero__reveal" style={{ ['--d' as string]: '.55s' }}>
          This portfolio highlights my journey as a software engineer, the problems I’ve solved, and the systems I’ve built
          along the way.
        </p>
        <p className="hero__contact hero__reveal" style={{ ['--d' as string]: '.75s' }}>
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
