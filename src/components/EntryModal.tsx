import { useEffect, useRef, useState } from 'react'
import type { Entry, Story } from '../data/entries'
import { ui, useLang } from '../i18n'

type Props = {
  entry: Entry | null
  onClose: () => void
}

function StoryRow({ story, open, onToggle }: { story: Story; open: boolean; onToggle: () => void }) {
  const { t } = useLang()
  return (
    <article className={`story ${open ? 'story--open' : ''}`}>
      <button type="button" className="story__head" onClick={onToggle} aria-expanded={open}>
        <span className="story__title">{t(story.title)}</span>
        <span className="story__chevron" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="story__body">
          <h4 className="modal__label modal__label--first">{t(ui.entry.context)}</h4>
          <p className="modal__text">{t(story.context)}</p>

          <h4 className="modal__label">{t(ui.entry.did)}</h4>
          <ul className="modal__list">
            {story.did.map((h, i) => (
              <li key={i}>{t(h)}</li>
            ))}
          </ul>

          {story.result && (
            <>
              <h4 className="modal__label">{t(ui.entry.result)}</h4>
              <p className="modal__summary">{t(story.result)}</p>
            </>
          )}

          {story.stack.length > 0 && (
            <div className="chips chips--stack">
              {story.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function EntryModal({ entry, onClose }: Props) {
  const { t } = useLang()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (!entry) return
    setOpenId(entry.stories[0]?.id ?? null)
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

  if (!entry) return null

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-title"
        onClick={(e) => e.stopPropagation()}
        style={{ ['--accent' as string]: entry.accent, ['--accent-soft' as string]: entry.accentSoft }}
      >
        <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <header className="modal__hero">
          <p className="kicker kicker--accent">
            {entry.period} · <span className="flag" aria-hidden="true">{entry.flag}</span> {t(entry.location)}
          </p>
          <h3 id="entry-title" className="modal__title">
            {entry.title}
          </h3>
          <p className="modal__role">{t(entry.role)}</p>
          <p className="modal__desc">{t(entry.summary)}</p>
          <div className="chips chips--tight">
            {entry.tags.map((tag) => (
              <span key={tag.en} className="chip chip--jd">
                {t(tag)}
              </span>
            ))}
          </div>
        </header>

        <div className="stories">
          {entry.stories.map((s) => (
            <StoryRow key={s.id} story={s} open={openId === s.id} onToggle={() => setOpenId(openId === s.id ? null : s.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
