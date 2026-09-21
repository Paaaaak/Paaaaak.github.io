import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'ko'
/** 두 언어를 함께 담는 문자열 */
export type L = { en: string; ko: string }
export const l = (en: string, ko: string): L => ({ en, ko })

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (s: L) => string; tl: (s: L[]) => string[] }
const LangContext = createContext<Ctx | null>(null)

const STORAGE_KEY = 'portfolio.lang'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'ko') return saved
    } catch {
      /* ignore */
    }
    return 'en'
  })

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = (s: L) => s[lang]
  const tl = (s: L[]) => s.map((x) => x[lang])

  return <LangContext.Provider value={{ lang, setLang, t, tl }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

/** 컴포넌트 공용 UI 문구 */
export const ui = {
  entry: {
    work: l('Work', '경력'),
    education: l('Education', '학력'),
    open: l('View details', '자세히 보기'),
    context: l('Context', '상황'),
    did: l('What I did', '한 일'),
    result: l('Result', '결과'),
  },
  footer: {
    sub: l(
      'Open to software / AI engineering roles. Based in New York, available on-site.',
      '소프트웨어 / AI 엔지니어링 포지션에 열려 있습니다. 뉴욕 거주, 온사이트 가능.',
    ),
  },
}
