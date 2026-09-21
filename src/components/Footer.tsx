import { profile } from '../data/resume'
import { ui, useLang } from '../i18n'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p>{t(ui.footer.sub)}</p>
        </div>
        <div className="footer__links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            github.com/Paaaaak
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
      <p className="footer__copy container">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  )
}
