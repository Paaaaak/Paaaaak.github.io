import { useEffect, useRef, useState } from 'react'
import { entries, type Entry } from '../data/entries'
import { ui, useLang } from '../i18n'
import EntryModal from './EntryModal'

export default function Journey() {
  const { t } = useLang()
  const [open, setOpen] = useState<Entry | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})

  // 화면 중앙에 들어온 섹션을 활성으로 (배경 글로우)
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).id)),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    Object.values(refs.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  // 좌/우는 work 항목 기준으로 번갈아
  let side = 0

  return (
    <div className="journey" style={{ ['--first' as string]: entries[0].accent }}>
      <span className="journey__line" aria-hidden="true" />

      {entries.map((e, i) => {
        const prev = entries[i - 1]?.accent ?? 'transparent'
        const next = entries[i + 1]?.accent ?? 'transparent'
        const style = {
          ['--accent' as string]: e.accent,
          ['--accent-soft' as string]: e.accentSoft,
          ['--prev' as string]: prev,
          ['--next' as string]: next,
        }

        if (e.kind === 'education') {
          return (
            <section key={e.id} id={e.id} ref={(el) => (refs.current[e.id] = el)} className="milestone" style={style}>
              <span className="milestone__dot" aria-hidden="true">
                🎓
              </span>
              <div className="milestone__body">
                <p className="milestone__period">{e.period}</p>
                <p className="milestone__title">
                  {t(e.summary)} · {e.title}
                </p>
                <p className="milestone__sub">
                  {t(e.role)} · <span className="flag" aria-hidden="true">{e.flag}</span> {t(e.location)}
                </p>
              </div>
            </section>
          )
        }

        const dir = side++ % 2 === 0 ? 'left' : 'right'
        return (
          <section
            key={e.id}
            id={e.id}
            ref={(el) => (refs.current[e.id] = el)}
            className={`entry entry--${dir} ${active === e.id ? 'is-active' : ''}`}
            style={style}
          >
            <span className="entry__dot" aria-hidden="true" />
            <span className="entry__branch" aria-hidden="true" />
            {(() => {
              const [start, end] = e.period.split(/\s[–-]\s/)
              return (
                <>
                  <span className="entry__period entry__period--end">{end ?? start}</span>
                  {end && <span className="entry__period entry__period--start">{start}</span>}
                </>
              )
            })()}

            <div className="container entry__inner">
              <div className="entry__content" onClick={() => setOpen(e)} role="button" tabIndex={0} onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && setOpen(e)}>
                <div className="entry__meta">
                  <span className="entry__kind">{t(ui.entry.work)}</span>
                </div>

                <h2 className="entry__role">{t(e.role)}</h2>

                <p className="entry__where">
                  <button type="button" className="entry__company" onClick={() => setOpen(e)} aria-haspopup="dialog">
                    {e.title}
                    <span className="entry__company-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                  <span className="entry__sep" aria-hidden="true">·</span>
                  <span className="entry__location">
                    <span className="flag" aria-hidden="true">{e.flag}</span> {t(e.location)}
                  </span>
                </p>

                <ul className="entry__tags">
                  {e.tags.map((tag) => (
                    <li key={tag.en}>{t(tag)}</li>
                  ))}
                </ul>

                <button type="button" className="entry__cta" onClick={() => setOpen(e)}>
                  <span className="entry__cta-text">{t(ui.entry.open)}</span>
                  <span className="entry__cta-orb" aria-hidden="true">
                    <span className="entry__cta-arrow">→</span>
                    <span className="entry__cta-arrow entry__cta-arrow--next">→</span>
                  </span>
                </button>
              </div>
            </div>
          </section>
        )
      })}

      <span className="journey__end" aria-hidden="true" />

      <EntryModal entry={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </div>
  )
}
