import { useEffect, useRef, useState } from 'react'
import { entries, type Entry, type Story, type StoryDetail } from '../data/entries'
import { Bi, ui, useLang, type L } from '../i18n'
import FlowDiagram from './FlowDiagram'

type Props = {
  entry: Entry | null
  onClose: () => void
  onNavigate?: (entry: Entry) => void
}

function CaseStudyBody({ story }: { story: Story }) {
  const { t } = useLang()
  const cs = story.caseStudy!
  return (
    <div className="case">
      <h4 className="modal__label modal__label--first">
        <span className="case__step">01</span> {t(ui.entry.architecture)}
      </h4>
      <div className="case__diagram">
        <FlowDiagram spec={cs.architecture} />
      </div>
      {cs.architectureNote && <p className="case__note"><Bi s={cs.architectureNote} /></p>}

      <h4 className="modal__label">
        <span className="case__step">02</span> {t(ui.entry.problem)}
      </h4>
      <ul className="modal__list">
        {cs.problem.map((h, i) => (
          <li key={i}><Bi s={h} /></li>
        ))}
      </ul>

      <h4 className="modal__label">
        <span className="case__step">03</span> {t(ui.entry.solution)}
      </h4>
      <ol className="case__steps">
        {cs.solution.map((h, i) => (
          <li key={i}><Bi s={h} /></li>
        ))}
      </ol>

      {cs.promptDesign && (
        <aside className="case__callout">
          <p className="case__callout-title">{t(ui.entry.promptDesign)}</p>
          <ul className="modal__list">
            {cs.promptDesign.map((h, i) => (
              <li key={i}><Bi s={h} /></li>
            ))}
          </ul>
        </aside>
      )}

      <h4 className="modal__label">
        <span className="case__step">04</span> {t(ui.entry.result)}
      </h4>
      <ul className="modal__list case__results">
        {cs.result.map((h, i) => (
          <li key={i}><Bi s={h} /></li>
        ))}
      </ul>
    </div>
  )
}

function DetailBody({ detail }: { detail: StoryDetail }) {
  const { t } = useLang()
  const block = (label: L, items: L[], first = false) => (
    <>
      <h4 className={`modal__label ${first ? 'modal__label--first' : ''}`}>{t(label)}</h4>
      <ul className="modal__list">
        {items.map((h, i) => (
          <li key={i}><Bi s={h} /></li>
        ))}
      </ul>
    </>
  )
  return (
    <div className="detail">
      {block(ui.entry.context, detail.context, true)}
      {block(ui.entry.did, detail.did)}
      {block(ui.entry.result, detail.result)}
    </div>
  )
}

export default function EntryModal({ entry, onClose, onNavigate }: Props) {
  const { t } = useLang()
  const closeRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  // ESC 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!entry) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [entry, onClose])

  // 회사 바뀌면 맨 위로 + 첫 스토리 활성
  useEffect(() => {
    if (!entry) return
    setActiveId(entry.stories[0]?.id ?? null)
    bodyRef.current?.scrollTo({ top: 0 })
  }, [entry])

  // 스크롤 위치에 따라 TOC 활성 항목 갱신
  useEffect(() => {
    const root = bodyRef.current
    if (!entry || !root) return
    const io = new IntersectionObserver(
      (es) => {
        const hit = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActiveId((hit.target as HTMLElement).dataset.story ?? null)
      },
      { root, rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    )
    root.querySelectorAll<HTMLElement>('[data-story]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [entry])

  if (!entry) return null

  const work = entries.filter((e) => e.kind === 'work')
  const idx = work.findIndex((e) => e.id === entry.id)
  const prevEntry = work[idx - 1]
  const nextEntry = work[idx + 1]
  const [start, end] = entry.period.split(/\s[–-]\s/)

  const jump = (id: string) => {
    const el = bodyRef.current?.querySelector<HTMLElement>(`[data-story="${id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-title"
      style={{ ['--accent' as string]: entry.accent, ['--accent-soft' as string]: entry.accentSoft }}
    >
      <aside className="sheet__side">
        <button ref={closeRef} className="sheet__close" onClick={onClose} aria-label="Close">
          <span aria-hidden="true">×</span> Close
        </button>

        <div className="sheet__side-body">
          <p className="sheet__period">
            <span>{end ?? start}</span>
            <span className="sheet__period-line" aria-hidden="true" />
            {end && <span>{start}</span>}
          </p>
          <h2 id="entry-title" className="sheet__company">
            {entry.title}
          </h2>
          <p className="sheet__role">{t(entry.role)}</p>
          <p className="sheet__location">
            <span className="flag" aria-hidden="true">{entry.flag}</span> {t(entry.location)}
          </p>
          <p className="sheet__summary"><Bi s={entry.summary} /></p>
          <ul className="sheet__tags">
            {entry.tags.map((tag) => (
              <li key={tag.en}>{t(tag)}</li>
            ))}
          </ul>

          <nav className="sheet__toc" aria-label="Stories">
            {entry.stories.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`sheet__toc-item ${activeId === s.id ? 'is-active' : ''}`}
                onClick={() => jump(s.id)}
              >
                <span className="sheet__toc-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="sheet__toc-title">{t(s.title)}</span>
                {s.caseStudy && <span className="sheet__toc-star" aria-label={t(ui.entry.featured)}>★</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="sheet__nav">
          <button
            type="button"
            className="sheet__nav-btn"
            disabled={!prevEntry}
            onClick={() => prevEntry && onNavigate?.(prevEntry)}
          >
            ← {prevEntry?.title}
          </button>
          <button
            type="button"
            className="sheet__nav-btn"
            disabled={!nextEntry}
            onClick={() => nextEntry && onNavigate?.(nextEntry)}
          >
            {nextEntry?.title} →
          </button>
        </div>
      </aside>

      <div className="sheet__body" ref={bodyRef}>
        <div className="sheet__body-inner">
          {entry.stories.map((s, i) => (
            <section key={s.id} className={`sstory ${s.caseStudy ? 'sstory--featured' : ''}`} data-story={s.id}>
              <header className="sstory__head">
                <span className="sstory__index">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sstory__title"><Bi s={s.title} /></h3>
                {s.caseStudy && <span className="story__badge">★ {t(ui.entry.featured)}</span>}
              </header>

              {s.caseStudy ? (
                <CaseStudyBody story={s} />
              ) : s.detail ? (
                <DetailBody detail={s.detail} />
              ) : (
                <ul className="story__bullets">
                  {(s.bullets ?? []).map((h, j) => (
                    <li key={j}><Bi s={h} /></li>
                  ))}
                </ul>
              )}

              {s.stack.length > 0 && (
                <div className="chips chips--stack">
                  {s.stack.map((x) => (
                    <span key={x} className="chip">
                      {x}
                    </span>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
