import { useLang } from '../i18n'

export default function Nav() {
  const { lang, setLang } = useLang()

  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__dot" />
          Portfolio
        </a>
        <div className="nav__right">
          <div className="lang" role="group" aria-label="Language">
            <button type="button" className={`lang__btn ${lang === 'en' ? 'is-active' : ''}`} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>
              EN
            </button>
            <button type="button" className={`lang__btn ${lang === 'ko' ? 'is-active' : ''}`} onClick={() => setLang('ko')} aria-pressed={lang === 'ko'}>
              한국어
            </button>
            <span className="lang__thumb" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  )
}
