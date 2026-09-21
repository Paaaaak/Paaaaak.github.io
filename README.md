# Julian Park — Portfolio

Vite + React + TypeScript 단일 페이지 포트폴리오.

## 로컬 실행

```bash
npm install
npm run dev        # http://localhost:5173
```

## 내용 수정

- 이력서 데이터: `src/data/resume.ts` (경력 / 프로젝트 / 스킬 / 학력 전부 여기)
- 회사 로고: `public/logos/` 에 `fragrancex.png`, `polycube.png`, `nexol.png` 넣기
- 스타일: `src/styles.css` (색상은 `:root` 변수)

## GitHub Pages 배포

### 방법 1 — GitHub Actions (권장)

1. GitHub에 리포 생성 후 push
2. 리포 Settings → Pages → Source를 **GitHub Actions** 로 설정
3. `main`에 push하면 `.github/workflows/deploy.yml`이 자동 빌드·배포
   (리포 이름을 base path로 자동 설정합니다)

### 방법 2 — gh-pages 패키지

```bash
VITE_BASE=/<repo-name>/ npm run deploy
```

리포 이름이 `Paaaaak.github.io`라면 `VITE_BASE`는 생략하세요.
