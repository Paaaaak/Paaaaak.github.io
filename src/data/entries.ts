import { l, type L } from '../i18n'
import type { FlowDiagramSpec } from '../components/FlowDiagram'

/** 4단계 케이스 스터디: Architecture → Problem → Solution → Result */
export type CaseStudy = {
  architecture: FlowDiagramSpec
  /** 다이어그램 아래 한 줄 설명 */
  architectureNote?: L
  problem: L[]
  solution: L[]
  /** Solution 아래에 강조 박스로 표시되는 프롬프트 & 컨텍스트 설계 포인트 */
  promptDesign?: L[]
  result: L[]
}

/** Context → What I did → Result */
export type StoryDetail = { context: L[]; did: L[]; result: L[] }

export type Story = {
  id: string
  title: L
  stack: string[]
  /** 단순 불릿 (detail이 없을 때 폴백) */
  bullets?: L[]
  /** 배경 → 한 일 → 결과 구조의 일반 스토리 */
  detail?: StoryDetail
  /** 있으면 ★ Case study 배지와 함께 4단계 형식으로 렌더링 */
  caseStudy?: CaseStudy
}

export type Entry = {
  id: string
  kind: 'work' | 'education'
  title: string
  role: L
  period: string
  location: L
  flag: string
  accent: string
  accentSoft: string
  /** 직무 아래에 붙는 역량 태그 */
  tags: L[]
  summary: L
  stories: Story[]
}

/** 위→아래 = 최신→과거 */
export const entries: Entry[] = [
  // ═══════════════════════════════════════════════════════════
  // FragranceX
  // ═══════════════════════════════════════════════════════════
  {
    id: 'fragrancex',
    kind: 'work',
    title: 'FragranceX',
    role: l('Software Engineer Intern', '소프트웨어 엔지니어 인턴'),
    period: 'May 2026 – Aug 2026',
    location: l('New York, USA', '미국 뉴욕'),
    flag: '🇺🇸',
    accent: '#8b1e5e',
    accentSoft: '#f6e7ef',
    tags: [
      l('LLM Agents in CI/CD', 'CI/CD 속 LLM 에이전트'),
      l('Prompt & Context Engineering', '프롬프트 & 컨텍스트 엔지니어링'),
      l('Retrieval & Embedding Pipelines', '검색 & 임베딩 파이프라인'),
    ],
    summary: l(
      'My first internship in the U.S., where I learned to work with AI and bring it into existing services: a Claude-based code review agent wired into the team’s Azure DevOps CI/CD, and a vector-based recommendation service with automated retraining of the legacy model.',
      '미국에서의 첫 인턴십으로, AI를 다루고 기존 서비스에 통합하는 법을 배운 곳입니다. 팀의 Azure DevOps CI/CD에 연결한 Claude 기반 코드 리뷰 에이전트와, 레거시 모델 재학습을 자동화한 벡터 기반 추천 서비스를 만들었습니다.',
    ),
    stories: [
      // ── 1. AI code review agent ──────────────────────────────
      {
        id: 'code-review-agent',
        title: l('AI code review agent in Azure DevOps CI/CD', 'Azure DevOps CI/CD의 AI 코드 리뷰 에이전트'),
        stack: ['Claude API', 'Azure DevOps Pipelines & REST API', 'Python'],
        caseStudy: {
          architecture: {
            rows: [
              [
                { id: 'pr', label: l('Pull Request', 'Pull Request'), sub: l('Azure DevOps Repos', 'Azure DevOps Repos') },
                { id: 'pipe', label: l('Build validation', 'Build validation'), sub: l('branch policy on main', 'main 브랜치 정책') },
                { id: 'agent', label: l('Python review step', 'Python 리뷰 스텝'), sub: l('PR info · diff · rules', 'PR 정보 · diff · 규칙'), accent: true },
              ],
              [
                { id: 'claude', label: l('Claude API', 'Claude API'), sub: l('structured output', '구조화 출력') },
                { id: 'findings', label: l('Findings', '지적 사항'), sub: l('file · line · severity', '파일 · 라인 · 심각도'), accent: true },
                { id: 'writeback', label: l('Write-back', 'Write-back'), sub: l('Azure DevOps REST API', 'Azure DevOps REST API'), accent: true },
              ],
            ],
            rowLinks: [l('prompt + repo context', '프롬프트 + 저장소 컨텍스트')],
            loop: { from: 'writeback', to: 'pr', label: l('inline comments + PR summary', '인라인 코멘트 + PR 요약') },
          },
          architectureNote: l(
            'Colored boxes are the parts I built. The agent runs as a pipeline step and closes the loop by writing its findings back into the PR.',
            '색이 칠해진 박스가 제가 직접 만든 부분입니다. 에이전트는 파이프라인의 한 단계로 실행되며, 리뷰 결과를 PR에 직접 남겨 흐름을 완성합니다.',
          ),
          problem: [
            l(
              'Every PR went through the same **repetitive first pass** (style, obvious bugs, missing tests) before reviewers could get to the substance.',
              '모든 PR에서 코드 스타일, 명백한 버그, 테스트 누락 같은 반복적인 1차 점검을 끝낸 뒤에야 리뷰어가 본질적인 리뷰를 시작할 수 있었습니다.',
            ),
            l(
              'Linters and static checks **can’t judge intent**, whether a name actually makes sense, or whether a change fits the surrounding code.',
              '린터나 정적 분석은 코드의 의도, 이름이 실제로 적절한지, 변경이 주변 코드와 어울리는지를 판단하지 못했습니다.',
            ),
            l(
              'To actually get used, the feedback had to show up **inside the PR as inline comments**, where reviewers already look, not in a separate tool.',
              '실제로 쓰이려면 리뷰 결과가 별도 도구가 아니라, 리뷰어가 이미 보고 있는 PR 안에 인라인 코멘트로 나타나야 했습니다.',
            ),
          ],
          solution: [
            l(
              'Added a **build validation policy** on the main branch, so opening or updating a PR **automatically runs the pipeline**. No one has to start the review.',
              'main 브랜치에 build validation 정책을 추가해서, PR을 만들거나 업데이트하면 파이프라인이 자동으로 실행되게 했습니다. 누가 따로 리뷰를 시작할 필요가 없습니다.',
            ),
            l(
              'Added a **Python step** to that pipeline that runs the agent: it reads the PR ID from the pipeline variables, pulls the **PR title, description and changed files** through the Azure DevOps REST API, gets the **diff** with git, and loads the **review rules** from the code-review-hub repo.',
              '그 파이프라인에 에이전트를 실행하는 Python 스텝을 추가했습니다. 파이프라인 변수에서 PR 번호를 읽고, Azure DevOps REST API로 PR 제목·설명·변경 파일을 가져오고, git으로 diff를 뜨고, code-review-hub 저장소에서 리뷰 규칙을 불러옵니다.',
            ),
            l(
              'Assembled each prompt from the team’s review rules, the PR’s metadata, and the diff with the code around it (details below).',
              '프롬프트는 팀 리뷰 규칙, PR 메타데이터, 그리고 diff와 그 주변 코드로 구성했습니다(자세한 내용은 아래).',
            ),
            l(
              'Asked Claude for **structured findings** (file, line, severity, concrete suggestion) so the output can be processed programmatically.',
              'Claude가 파일, 라인, 심각도, 구체적인 수정 제안을 포함한 구조화된 형식으로 응답하도록 요청해, 결과를 코드로 바로 처리할 수 있게 했습니다.',
            ),
            l(
              'The script then validates the findings and posts each one back through the Azure DevOps REST API as an **inline comment on the changed line**, plus one **PR-level summary**.',
              '그다음 스크립트가 지적 사항을 검증한 뒤, Azure DevOps REST API로 각 지적을 해당 변경 라인에 인라인 코멘트로 남기고 PR 전체 요약도 하나 남깁니다.',
            ),
            l(
              'Tested it against **real pull requests** and adjusted the prompt structure and severity thresholds until the comments were useful and the noise was low.',
              '실제 PR을 대상으로 테스트하면서, 코멘트가 실제로 도움이 되고 불필요한 지적은 적어질 때까지 프롬프트 구조와 심각도 기준을 조정했습니다.',
            ),
          ],
          promptDesign: [
            l(
              '**Part 1, the rules (prompt engineering):** severity levels, our team’s review rules, what not to flag (things the linter already covers, generated files), and the JSON output format. The rules live in **markdown files in a separate code-review-hub repo**, not in the agent’s code, so changing how the agent reviews is a markdown edit and a PR. **No redeploy**, and anyone on the team can add a rule.',
              '1부, 규칙(프롬프트 엔지니어링): 심각도 단계, 팀 리뷰 규칙, 지적하지 말아야 할 것(린터가 이미 잡는 항목, 자동 생성 파일), JSON 출력 형식. 규칙은 에이전트 코드가 아니라 별도 code-review-hub 저장소의 마크다운 파일에 있어서, 리뷰 방식을 바꾸는 건 마크다운 수정과 PR 하나로 끝납니다. 재배포가 없고 팀 누구나 규칙을 추가할 수 있습니다.',
            ),
            l(
              '**Part 2, PR metadata:** the title and the author’s description say **why the change was made** and what it is meant to do, and the changed-file list shows the shape of the change before the model reads a single diff line.',
              '2부, PR 메타데이터: 제목과 작성자의 설명은 왜, 무엇을 바꿨는지를 알려주고, 변경 파일 목록은 diff를 읽기 전에 변경의 윤곽을 보여줍니다.',
            ),
            l(
              '**Part 3, the diff plus surrounding context:** the diff alone is not enough, because a changed line often calls a method whose implementation is outside the diff. So the agent also includes the **implementation of methods the changed code calls**, and the imports and signatures of touched files.',
              '3부, diff와 주변 컨텍스트: diff만으로는 부족합니다. 바뀐 줄이 호출하는 메소드의 구현은 diff 밖에 있는 경우가 많으니까요. 그래서 변경된 코드가 호출하는 메소드의 구현, 변경 파일의 import와 시그니처도 함께 넣습니다.',
            ),
            l(
              '**Context engineering:** deciding what goes into parts 2 and 3, and how much. The context window is a **finite resource**. Sending the whole repository would exceed it, bury the model in irrelevant code, and add latency and cost, so the agent **selects only what this PR needs**.',
              '컨텍스트 엔지니어링: 2부와 3부에 무엇을 얼마나 넣을지 정하는 일입니다. 컨텍스트 윈도우는 유한한 자원입니다. 저장소 전체를 보내면 토큰이 넘치고, 무관한 코드에 묻히고, 지연과 비용이 늘어나기 때문에 이 PR에 필요한 것만 골라 넣습니다.',
            ),
            l(
              '**Large diffs** are split into chunks that share a **common header** (PR summary and full file list), so a finding in one chunk can still point at code in another.',
              '큰 diff는 청크로 나누되 모든 청크에 공통 헤더(PR 요약과 전체 파일 목록)를 붙여서, 한 청크에서 나온 지적이 다른 청크의 코드를 가리킬 수 있게 합니다.',
            ),
            l(
              '**Output contract:** strict JSON, **validated before anything is posted**. Malformed output triggers a limited retry instead of a bad comment.',
              '출력 형식: 엄격한 JSON으로 고정하고 게시 전에 검증합니다. 형식이 깨지면 잘못된 코멘트를 남기는 대신 제한된 횟수만 재시도합니다.',
            ),
          ],
          result: [
            l(
              'Repetitive first-pass review is **automated on every PR**; reviewers start from a PR that already has findings pinned to the relevant lines.',
              '반복적인 1차 리뷰가 모든 PR에서 자동으로 이루어지고, 리뷰어는 중요한 라인에 이미 코멘트가 달린 상태에서 리뷰를 시작합니다.',
            ),
            l(
              'Every PR is checked against the same written team rules, so the first pass is **consistent no matter who reviews it**, and the team can keep tuning those rules without touching the agent’s code.',
              '모든 PR이 같은 팀 규칙 문서를 기준으로 검토되어 누가 리뷰하든 1차 리뷰가 일관되고, 팀은 에이전트 코드를 건드리지 않고도 규칙을 계속 다듬을 수 있습니다.',
            ),
          ],
        },
      },

      // ── 2. Vector recommendation ──────────────────────────────
      {
        id: 'vector-recs',
        title: l('Vector-based recommendation service on Azure AI Search', 'Azure AI Search 기반 벡터 추천 서비스'),
        stack: ['Azure AI Search', 'Azure OpenAI', 'Python'],
        detail: {
          context: [
            l(
              'The existing recommendation system only knew **which products were bought together**. It had no way to say that two products are similar in themselves, so a customer looking at one fragrance would **not see others that smell alike** unless people had already bought them together.',
              '기존 추천은 "함께 구매된 상품"만 알고 있었습니다. 상품 자체가 서로 비슷하다는 걸 판단할 수 없어서, 어떤 향수를 보고 있는 고객에게 비슷한 향의 상품을 보여주려면 누군가 이미 그 둘을 함께 산 기록이 있어야 했습니다.',
            ),
          ],
          did: [
            l(
              'Turned each product’s name, description and attributes (scent notes, brand, concentration, gender) into an **embedding**, a list of numbers that captures its meaning, using the **Azure OpenAI text-embedding-3-small** model, and stored the vectors in an **Azure AI Search** index that supports vector search.',
              '각 상품의 이름, 설명, 속성(향 노트, 브랜드, 농도, 성별)을 Azure OpenAI의 text-embedding-3-small 모델로 임베딩(상품의 의미를 숫자 벡터로 표현한 것)으로 바꾸고, 벡터 검색을 지원하는 Azure AI Search 인덱스에 저장했습니다.',
            ),
            l(
              'Built the service that takes a product, **finds the closest vectors** in the index, and returns them as "similar products", with basic filters such as in-stock only.',
              '상품 하나를 받으면 인덱스에서 가장 가까운 벡터들을 찾아 "비슷한 상품"으로 돌려주는 서비스를 만들었습니다. 재고 있는 상품만 보여주는 것 같은 기본 필터도 넣었습니다.',
            ),
            l(
              'Wrote the job that keeps the index in step with the product catalog, so **new or changed products get embedded and added** without a manual step.',
              '상품 카탈로그가 바뀌면 인덱스도 따라가도록, 새 상품이나 변경된 상품을 자동으로 임베딩해서 넣는 작업을 만들었습니다.',
            ),
          ],
          result: [
            l(
              'Product pages can now recommend items that are **similar in content, not only in purchase history**, and the service runs alongside the existing recommendation path in production.',
              '이제 상품 페이지에서 구매 이력이 아니라 상품 내용이 비슷한 것도 추천할 수 있고, 이 서비스는 기존 추천과 함께 프로덕션에서 동작하고 있습니다.',
            ),
          ],
        },
      },

      // ── 3. SAR retraining automation ──────────────────────────
      {
        id: 'sar-retraining',
        title: l('Automated retraining of the legacy SAR model with Azure Functions', 'Azure Functions로 레거시 SAR 모델 재학습 자동화'),
        stack: ['Azure Functions', 'Python', 'SAR'],
        detail: {
          context: [
            l(
              'The existing recommendation model (SAR, a Microsoft algorithm based on which products are bought together) had to be **retrained by hand**. Someone pulled the latest order data, ran the training, and uploaded the result, so it happened irregularly and **new products took a long time to show up** in recommendations.',
              '기존 추천 모델(SAR, 함께 구매된 상품 기반으로 동작하는 마이크로소프트 알고리즘)은 사람이 직접 재학습시켜야 했습니다. 최신 주문 데이터를 뽑아서 학습을 돌리고 결과를 올리는 과정이 손으로 이루어져서 주기가 불규칙했고, 신상품이 추천에 반영되기까지 오래 걸렸습니다.',
            ),
          ],
          did: [
            l(
              'Moved the whole retraining run into an **Azure Function that runs on a schedule**: it **pulls recent order data, retrains the SAR model, and publishes the new model** where the recommendation service reads it.',
              '재학습 과정 전체를 스케줄에 따라 실행되는 Azure Function으로 옮겼습니다. 최근 주문 데이터를 가져와 SAR 모델을 다시 학습하고, 새 모델을 추천 서비스가 읽는 위치에 올리는 것까지 한 번에 처리합니다.',
            ),
            l(
              'Added a simple check before publishing so a run that produced an empty or broken model **leaves the previous one in place** instead of replacing it.',
              '새 모델을 올리기 전에 간단한 검증을 넣어서, 결과가 비어 있거나 잘못 나온 경우에는 이전 모델을 그대로 두도록 했습니다.',
            ),
          ],
          result: [
            l(
              'Retraining now **happens automatically on a fixed schedule** with no one having to run it, and together with the vector service this **modernized the production recommendation platform**.',
              '재학습이 정해진 주기에 자동으로 돌아가고 사람이 손댈 일이 없어졌습니다. 벡터 추천 서비스와 함께, 프로덕션 추천 플랫폼을 현대화한 작업입니다.',
            ),
          ],
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // Stony Brook (milestone)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'sbu',
    kind: 'education',
    title: 'Stony Brook University',
    role: l('B.S. in Computer Science', '컴퓨터과학 학사'),
    period: 'May 2026',
    location: l('Stony Brook, New York', '미국 뉴욕 스토니브룩'),
    flag: '🇺🇸',
    accent: '#b91c1c',
    accentSoft: '#fee2e2',
    tags: [],
    summary: l('Graduated', '졸업'),
    stories: [],
  },

  // ═══════════════════════════════════════════════════════════
  // Polycube
  // ═══════════════════════════════════════════════════════════
  {
    id: 'polycube',
    kind: 'work',
    title: 'Polycube',
    role: l('Software Engineer', '소프트웨어 엔지니어'),
    period: 'Dec 2023 – Oct 2024',
    location: l('Seoul, South Korea', '대한민국 서울'),
    flag: '🇰🇷',
    accent: '#0284c7',
    accentSoft: '#e0f2fe',
    tags: [
      l('Java Full-stack (Spring + React)', 'Java 풀스택 (Spring + React)'),
      l('Ad Integration & Reward Logic', '광고 연동 & 리워드 로직'),
      l('10M+ Users in Production', '1,000만+ 사용자 프로덕션'),
    ],
    summary: l(
      'Java full-stack developer on OK Cashbag, a rewards platform with 10M+ users in Korea. Integrated third-party ad providers, made the reward payment logic reliable with tests, and sped up the pages.',
      '국내 1,000만+ 사용자의 리워드 플랫폼 OK캐쉬백에서 Java 풀스택 개발자로 일했습니다. 서드파티 광고사를 연동하고, 리워드 지급 로직을 테스트로 안정화하고, 페이지 속도를 올렸습니다.',
    ),
    stories: [
      // ── OK Cashbag ───────────────────────────────────────────
      {
        id: 'ok-cashbag',
        title: l('OK Cashbag mobile web, a rewards platform for 10M+ users', 'OK캐쉬백 모바일 웹, 1,000만+ 사용자의 리워드 플랫폼'),
        stack: ['Spring', 'Java', 'React'],
        detail: {
          context: [
            l(
              'OK Cashbag is a cash-like rewards platform in Korea with **more than 10 million users**. People earn points by joining events, playing mini-games, or watching ads, and spend them on purchases, partner points, or gift cards.',
              'OK캐쉬백은 국내 1,000만 명 이상이 쓰는 현금성 리워드 플랫폼입니다. 이벤트 참여, 미니게임, 광고 시청으로 포인트를 모으고, 그 포인트를 결제나 제휴 포인트, 기프트카드로 쓸 수 있습니다.',
            ),
          ],
          did: [
            l(
              'Worked as a **Java full-stack developer** on the mobile web app: **Spring** on the backend, **React** on the frontend.',
              '모바일 웹 앱의 Java 풀스택 개발자로 일했습니다. 백엔드는 Spring, 프론트엔드는 React였습니다.',
            ),
            l(
              'My three main areas were integrating third-party ad providers, making the reward payment logic solid with tests, and improving page performance. Each is described below.',
              '주로 맡은 일은 세 가지였습니다. 서드파티 광고사 연동, 리워드 지급 로직을 테스트로 단단하게 만드는 일, 그리고 페이지 성능 개선입니다. 각각은 아래에 따로 정리했습니다.',
            ),
          ],
          result: [
            l(
              'Points are money to users, so the work was less about shipping fast and more about making sure **every reward was paid exactly once**, to the right person, on a page that loads quickly on a phone.',
              '사용자에게 포인트는 곧 돈이라서, 빨리 만드는 것보다 모든 리워드가 정확히 한 번, 맞는 사람에게 지급되고, 그 페이지가 폰에서 빠르게 뜨게 하는 데 집중했습니다.',
            ),
          ],
        },
      },

      // ── Ad integration ───────────────────────────────────────
      {
        id: 'ad-integration',
        title: l('Third-party ad integration and the reward flow', '서드파티 광고 연동과 리워드 지급 흐름'),
        stack: ['Spring', 'Adapter pattern', 'S2S postback', 'React'],
        detail: {
          context: [
            l(
              'Ads were **tied directly to revenue**, since part of what advertisers paid came back to users as points. Every provider had a **different SDK, callback structure and error format**, so wiring each one straight into the business logic would have scattered provider-specific code across the app.',
              '광고는 매출과 직접 연결되어 있었습니다. 광고주가 낸 돈의 일부가 사용자에게 포인트로 돌아가는 구조였으니까요. 그런데 광고사마다 SDK, 콜백 구조, 에러 형식이 전부 달라서, 비즈니스 로직에 직접 붙이면 광고사별 코드가 앱 전체에 흩어질 상황이었습니다.',
            ),
          ],
          did: [
            l(
              'Used the **Adapter pattern**: one common **AdProvider** interface (requestAd, onComplete, onSkip, onError) with one adapter per provider. A new provider is **one adapter class and one config entry**, with no change to the business logic.',
              'Adapter 패턴을 썼습니다. 공통 AdProvider 인터페이스(requestAd, onComplete, onSkip, onError)를 두고 광고사마다 어댑터를 하나씩 구현했습니다. 새 광고사는 어댑터 클래스 하나와 설정 한 줄로 붙고, 비즈니스 로직은 그대로입니다.',
            ),
            l(
              'Treated the provider’s server-to-server postback (POST /postback/{vendor}) as the **source of truth** instead of the frontend. The backend checks the sender’s **IP range**, verifies the **signature** with a shared secret, and checks campaign status and user eligibility before paying anything.',
              '리워드 지급의 기준은 프론트엔드가 아니라 광고사 서버가 직접 보내는 postback(POST /postback/{vendor})으로 잡았습니다. 백엔드는 보낸 쪽 IP 범위, 공유 비밀키 서명, 캠페인 상태와 사용자 자격을 확인한 뒤에만 지급합니다.',
            ),
            l(
              'Made the payment **safe to retry**: the reward is written in **one database transaction**, and a **unique constraint on (vendor, transaction_id)** rejects a duplicate postback. A duplicate still gets **200 OK**, because providers retry until they see success. Notifications and analytics **run asynchronously** so the response stays fast.',
              '같은 요청이 다시 와도 안전하게 만들었습니다. 리워드는 하나의 DB 트랜잭션으로 기록하고, (vendor, transaction_id) 유니크 제약으로 중복 postback을 막습니다. 중복이어도 200 OK를 돌려주는데, 광고사는 성공 응답을 받을 때까지 재전송하기 때문입니다. 알림과 통계는 비동기로 넘겨서 응답은 빠르게 유지했습니다.',
            ),
          ],
          result: [
            l(
              'Skippable video, banner and interstitial ads from several providers run through **one flow**, new providers plug in with a single adapter, and the same completed ad **can never pay a user twice**.',
              '여러 광고사의 스킵 가능 영상, 배너, 전면 광고가 하나의 흐름으로 처리되고, 새 광고사는 어댑터 하나로 붙으며, 같은 광고 시청으로 포인트가 두 번 나가는 일이 없습니다.',
            ),
          ],
        },
      },

      // ── Quality ──────────────────────────────────────────────
      {
        id: 'quality',
        title: l('Testing the reward logic with JUnit and Mockito', 'JUnit과 Mockito로 리워드 로직 검증'),
        stack: ['JUnit', 'Mockito', 'H2', 'Spring'],
        detail: {
          context: [
            l(
              'The provider could resend the same postback if our server answered slowly or the network hiccupped. The one thing that must never happen is a user **getting paid twice for the same ad**, so this logic needed tests more than anything else in the app.',
              '우리 서버 응답이 늦거나 네트워크가 잠깐 끊기면 광고사가 같은 postback을 다시 보낼 수 있습니다. 절대 일어나면 안 되는 건 같은 광고로 포인트가 두 번 나가는 것이었고, 그래서 앱에서 이 로직에 테스트가 가장 필요했습니다.',
            ),
          ],
          did: [
            l(
              'Wrote **unit tests with JUnit and Mockito**, mocking the ad provider and database pieces so the reward logic could be tested on its own and the tests stayed fast. The core case: the same transaction ID sent twice must create **exactly one reward record** and pay the points once.',
              'JUnit과 Mockito로 단위 테스트를 작성했습니다. 광고사와 DB 관련 부분은 목으로 대체해서 리워드 로직만 따로, 빠르게 테스트할 수 있게 했습니다. 핵심 케이스는 같은 트랜잭션 ID가 두 번 왔을 때 리워드 기록은 하나만 생기고 포인트도 한 번만 지급되는지였습니다.',
            ),
            l(
              'Covered the **business edge cases** that should all be rejected: a reward after the campaign budget ran out, a user over their daily limit, a skip signal on a campaign that requires the full video, and an unknown campaign ID.',
              '거부되어야 하는 비즈니스 예외 상황도 다 넣었습니다. 캠페인 예산이 다 떨어진 뒤의 지급 요청, 하루 한도를 넘긴 사용자, 영상을 끝까지 봐야 하는 캠페인에서 온 스킵 신호, 존재하지 않는 캠페인 ID 같은 것들입니다.',
            ),
            l(
              'Added **integration tests** with an in-memory **H2** database and the real Spring context, so the whole path from the incoming web request through the business logic to the saved reward record is exercised.',
              '인메모리 DB인 H2와 실제 Spring 컨텍스트로 통합 테스트도 작성해서, 웹 요청이 들어와서 비즈니스 로직을 거쳐 리워드 기록이 DB에 저장되는 전체 경로를 검증했습니다.',
            ),
            l(
              'Also reviewed teammates’ code regularly, with the same focus on correctness of point calculations and maintainability.',
              '팀원들의 코드 리뷰도 꾸준히 했고, 포인트 계산이 정확한지와 유지보수하기 쉬운지를 주로 봤습니다.',
            ),
          ],
          result: [
            l(
              'Regressions in the reward logic are **caught before release** rather than by users, and the duplicate-payment case is locked down by **both a test and a database constraint**.',
              '리워드 로직의 회귀 버그는 사용자가 아니라 배포 전에 잡히고, 중복 지급은 테스트와 DB 제약 두 겹으로 막혀 있습니다.',
            ),
          ],
        },
      },

      // ── Frontend performance ─────────────────────────────────
      {
        id: 'frontend-perf',
        title: l('Page loading time reduced by about 40%', '페이지 로딩 시간 약 40% 단축'),
        stack: ['React', 'Chrome DevTools', 'Lighthouse'],
        detail: {
          context: [
            l(
              'The event page felt slow on phones, and engagement depends on that page loading quickly.',
              '이벤트 페이지가 폰에서 느리게 느껴졌고, 사용자 참여는 이 페이지가 얼마나 빨리 뜨는지에 크게 좌우됐습니다.',
            ),
          ],
          did: [
            l(
              'Measured first: used the **Chrome DevTools** performance profiler and **Lighthouse** with mobile throttling to find the actual bottlenecks, looking at when the main content appears and when the page becomes usable.',
              '먼저 측정했습니다. Chrome DevTools 성능 프로파일러와 Lighthouse를 모바일 속도 제한 상태로 돌려서 실제 병목이 어디인지 찾았고, 주요 콘텐츠가 뜨는 시점과 페이지가 실제로 쓸 수 있게 되는 시점을 봤습니다.',
            ),
            l(
              'The biggest issue was that the **ad SDK scripts were loaded synchronously** at page load even though the ad wasn’t visible yet. Changed it to **load the SDK only when the ad container gets close to the viewport**, which alone **cut more than a second** off the initial load.',
              '가장 큰 문제는 광고 SDK 스크립트가 아직 광고가 보이지도 않는데 페이지 로드 시점에 동기로 로드되는 것이었습니다. 광고 영역이 화면에 가까워질 때만 SDK를 불러오도록 바꿨고, 이것만으로 초기 로딩이 1초 이상 줄었습니다.',
            ),
            l(
              'Removed **unnecessary re-renders and repeated requests**. For example, the reward status was being fetched again on every re-render, so I **cached the result** instead of asking the server the same thing repeatedly.',
              '불필요한 리렌더링과 반복 요청도 정리했습니다. 예를 들어 리워드 상태를 리렌더링마다 다시 요청하고 있어서, 결과를 캐싱해서 같은 요청을 반복하지 않게 했습니다.',
            ),
          ],
          result: [
            l(
              'Loading time **dropped by about 40%**, and the page feels noticeably more responsive on mobile.',
              '로딩 시간이 약 40% 줄었고, 특히 모바일에서 페이지가 눈에 띄게 빨라졌습니다.',
            ),
          ],
        },
      },

      // ── Design collaboration ─────────────────────────────────
      {
        id: 'design-collab',
        title: l('Working with the design team on UX/UI', '디자인팀과의 UX/UI 협업'),
        stack: ['React', 'Design handoff'],
        detail: {
          context: [
            l(
              'Event and reward screens are where users spend most of their time, so how faithfully the designs were implemented had a direct effect on whether people came back.',
              '이벤트와 리워드 화면은 사용자가 가장 오래 머무는 곳이라서, 디자인이 얼마나 의도대로 구현되는지가 사용자가 다시 오는지에 직접 영향을 줬습니다.',
            ),
          ],
          did: [
            l(
              'Coordinated **directly with the design team** while implementing the screens, checking details **on real devices together** instead of approximating the mockups and fixing differences later.',
              '화면을 구현하면서 디자인팀과 직접 소통했습니다. 목업을 대충 비슷하게 만들고 나중에 차이를 고치는 대신, 실제 기기에서 함께 세부를 확인하며 맞췄습니다.',
            ),
          ],
          result: [
            l('Mobile user traffic **increased by 20%** after the redesigned screens shipped.', '리디자인된 화면이 배포된 뒤 모바일 사용자 트래픽이 20% 증가했습니다.'),
          ],
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // Nexol System
  // ═══════════════════════════════════════════════════════════
  {
    id: 'nexol',
    kind: 'work',
    title: 'Nexol System',
    role: l('Software Engineer', '소프트웨어 엔지니어'),
    period: 'Oct 2022 – Nov 2023',
    location: l('Seoul, South Korea', '대한민국 서울'),
    flag: '🇰🇷',
    accent: '#1e3a8a',
    accentSoft: '#dbeafe',
    tags: [
      l('On-site Requirements Discovery', '현장 요구사항 발굴'),
      l('Legacy Migration → Production', '레거시 마이그레이션 → 프로덕션'),
      l('Retail & Logistics Systems', '리테일 & 물류 시스템'),
    ],
    summary: l(
      'My first company. Developed and maintained the Samsonite EPOS and warehouse systems for 500+ stores on Spring Boot, visited the warehouses to fix the scanning workflow, helped move a PDA .NET system to a Node.js web app, and kept the HQ dashboards fast.',
      '첫 회사입니다. 쌤소나이트 500여 개 매장의 EPOS와 창고 시스템을 Spring Boot로 개발·운영했고, 창고를 직접 방문해 스캔 작업을 고치고, PDA .NET 시스템을 Node.js 웹 앱으로 옮기는 일을 맡았으며, 본사 대시보드를 빠르게 유지했습니다.',
    ),
    stories: [
      // ── ★ Data pipeline: nightly batch → HQ dashboard ────────
      {
        id: 'data-pipeline',
        title: l('Sales data pipeline for 500 stores, from nightly batch to HQ dashboard', '500개 매장 판매 데이터 파이프라인, 야간 배치에서 본사 대시보드까지'),
        stack: ['Spring Batch', 'MSSQL', 'ERP integration', 'Spring Cache', 'SQL optimization'],
        caseStudy: {
          architecture: {
            rows: [
              [
                { id: 'stores', label: l('500 stores', '500개 매장'), sub: l('daily CSV per store', '매장별 일일 CSV') },
                { id: 'job', label: l('Spring Batch job', 'Spring Batch 잡'), sub: l('nightly · partitioned', '매일 밤 · 파티션'), accent: true },
              ],
              [
                { id: 'erp', label: l('ERP sync', 'ERP 동기화'), sub: l('product master', '상품 마스터'), accent: true },
                { id: 'reader', label: l('Reader', 'Reader'), sub: l('FlatFileItemReader', 'FlatFileItemReader'), accent: true },
                { id: 'processor', label: l('Processor', 'Processor'), sub: l('validate · error table', '검증 · 오류 테이블'), accent: true },
                { id: 'writer', label: l('Writer', 'Writer'), sub: l('bulk insert · chunk = tx', '일괄 insert · 청크 = 트랜잭션'), accent: true },
              ],
              [
                { id: 'summary', label: l('Summary tables', '집계 테이블'), sub: l('daily · store · category', '일별 · 매장 · 카테고리'), accent: true },
                { id: 'dash', label: l('HQ dashboard', '본사 대시보드'), sub: l('cache · covering indexes', '캐시 · 커버링 인덱스') },
              ],
            ],
            rowLinks: [l('steps 1–2', 'Step 1–2'), l('step 3: aggregate', 'Step 3: 집계')],
          },
          architectureNote: l(
            'Colored boxes are the parts I built. Each store runs as its own partition, so one store’s broken file fails only that partition, and bad records go to an error table to be retried on the next run.',
            '색이 칠해진 박스가 제가 만든 부분입니다. 매장마다 별도 파티션으로 돌기 때문에 한 매장의 파일이 깨져도 그 파티션만 실패하고, 잘못된 레코드는 오류 테이블로 가서 다음 실행에서 다시 처리됩니다.',
          ),
          problem: [
            l(
              'Samsonite Korea had about **500 stores** across department stores, duty-free shops and outlets, and headquarters needed to **see every store’s sales and refunds in one place** and trust the numbers.',
              '쌤소나이트코리아는 백화점, 면세점, 아울렛까지 합쳐 전국에 약 500개 매장이 있었고, 본사는 모든 매장의 판매·환불 데이터를 한곳에서 정확하게 봐야 했습니다.',
            ),
            l(
              'Each store sent its **daily transactions as a CSV file**, about **3,000 sales and 200 refunds a day** across all stores. Files could have missing fields, wrong formats, duplicates, or refunds whose original sale hadn’t arrived yet, and **one bad file could not be allowed to block the other 499 stores**.',
              '매장마다 하루 거래를 CSV 파일로 보냈고, 전체 매장을 합쳐 하루 판매 약 3,000건, 환불 약 200건 규모였습니다. 필수값 누락, 포맷 오류, 중복, 원거래가 아직 도착하지 않은 환불 같은 문제가 섞여 들어올 수 있었고, 파일 하나 때문에 나머지 499개 매장 처리가 막히면 안 됐습니다.',
            ),
            l(
              'Over time the dashboard slowed down. Summaries existed only per day and store, so comparisons by product and category, such as year-over-year, still ran against the raw transaction table, which had grown to **several million rows**. Every morning HQ and store managers opened the dashboard at the same time and ran those **same heavy queries** again and again.',
              '시간이 지나며 대시보드가 느려졌습니다. 집계는 일별·매장별로만 있어서 전년 대비 같은 상품·카테고리별 비교는 여전히 원본 거래 테이블을 읽었는데, 이 테이블이 수백만 건으로 커졌습니다. 아침마다 본사와 매장 관리자들이 동시에 대시보드를 열어 같은 무거운 쿼리가 반복 실행됐습니다.',
            ),
          ],
          solution: [
            l(
              'Built the **nightly Spring Batch job** in three steps. Step 1 syncs the latest **product master from the ERP** (SKU, price, category) into a local reference table.',
              'Spring Batch 야간 잡을 세 단계로 만들었습니다. Step 1은 ERP에서 최신 상품 마스터(SKU, 가격, 카테고리)를 가져와 로컬 참조 테이블에 동기화합니다.',
            ),
            l(
              'Step 2 reads the store CSVs with a **FlatFileItemReader**, **partitioned by store**. Each store’s file runs as its own partition with its own skip limit, so a completely broken file **fails only that store’s partition** and is flagged for a rerun instead of stopping the whole job.',
              'Step 2는 FlatFileItemReader로 매장 CSV를 읽는데, 매장별로 파티션을 나눴습니다. 매장마다 별도 파티션과 skip limit을 갖기 때문에, 파일이 통째로 깨져도 그 매장 파티션만 실패하고 재실행 대상으로 표시될 뿐 전체 잡은 멈추지 않습니다.',
            ),
            l(
              'An **ItemProcessor validates every record**: required fields, date and amount formats, duplicates by store, receipt and line number, SKUs checked against the ERP product master, and refunds matched to an original sale. Failed records go to an **error table instead of failing the job**, and refunds whose original sale hasn’t arrived yet are **re-checked on the next run**.',
              'ItemProcessor에서 레코드마다 필수값, 날짜·금액 포맷, 매장·영수증·라인 번호 기준 중복, ERP 상품 마스터 기준 SKU 유효성, 환불과 원거래 매칭을 검증합니다. 실패한 레코드는 잡을 멈추는 대신 오류 테이블로 보내고, 원거래가 아직 안 들어온 환불은 다음 실행에서 다시 확인합니다.',
            ),
            l(
              'An **ItemWriter bulk-inserts** the valid records into MSSQL. **Each chunk is its own transaction**, so a failure rolls back only that chunk and the partition **restarts from the last commit**.',
              'ItemWriter가 검증을 통과한 데이터를 MSSQL에 일괄 insert합니다. 청크 하나가 트랜잭션 하나라서 실패해도 그 청크만 롤백되고, 파티션은 마지막 커밋 지점부터 재시작합니다.',
            ),
            l(
              'Step 3 updates the **daily per-store summary tables**, and recalculates any past date that received late records, so the numbers correct themselves the next morning.',
              'Step 3은 일별·매장별 집계 테이블을 갱신하고, 늦게 도착한 레코드가 있는 과거 날짜도 다시 계산해서 다음 날 아침이면 숫자가 자동으로 바로잡힙니다.',
            ),
            l(
              'For the slow dashboard: added **monthly and product/category summary tables** to the batch using the ERP categories, **covering indexes** for the queries that still read raw data, and **Spring Cache** for the most-viewed screens, cleared when the nightly batch finishes.',
              '느린 대시보드에는 ERP 카테고리를 이용한 월별·상품/카테고리별 집계 테이블을 배치에 추가하고, 여전히 원본을 읽는 쿼리에는 커버링 인덱스를 만들고, 자주 보는 화면은 Spring Cache로 캐싱해서 야간 배치가 끝나면 비우도록 했습니다.',
            ),
          ],
          result: [
            l(
              'Headquarters gets **one trusted set of numbers across all 500 stores** every morning. A bad file from one store no longer delays the rest, and late records are picked up automatically.',
              '본사는 매일 아침 500개 매장 전체에 대해 믿을 수 있는 하나의 숫자를 받게 되었습니다. 매장 한 곳의 파일 문제가 나머지를 지연시키지 않고, 늦게 온 레코드도 자동으로 반영됩니다.',
            ),
            l(
              'Dashboard response time **dropped by 20%** and stayed stable at the morning peak.',
              '대시보드 응답 시간이 20% 줄었고 아침 피크 시간에도 안정적으로 동작합니다.',
            ),
          ],
        },
      },

      // ── On-site discovery ────────────────────────────────────
      {
        id: 'onsite-discovery',
        title: l('Warehouse visits and single-scan automation', '물류창고 방문과 싱글 스캔 자동화'),
        stack: ['Node.js', 'PDA / barcode scanning'],
        detail: {
          context: [
            l(
              '**Visited the Samsonite logistics warehouses** to see how the inbound and outbound scanning workflows actually ran, and to find where the time was going.',
              '쌤소나이트 물류창고를 직접 방문해 입출고 스캔 작업이 실제로 어떻게 돌아가는지, 어디서 시간이 새는지 확인했습니다.',
            ),
          ],
          did: [
            l(
              '**Identified the inefficiency**: for every item, a worker scanned the barcode, then **searched for the product manually**, found the matching row, and **updated the quantity and status by hand**.',
              '비효율을 찾아냈습니다. 작업자가 상품마다 바코드를 찍은 뒤 상품을 직접 검색해 해당 행을 찾고, 수량과 상태를 손으로 바꾸고 있었습니다.',
            ),
            l(
              'Implemented a **Node.js-based single-scan automation**: once the barcode is scanned, the system **identifies the product and updates the inventory record itself**, so the worker only steps in when something doesn’t match.',
              'Node.js 기반의 싱글 스캔 자동화를 구현했습니다. 바코드를 찍으면 시스템이 상품을 알아서 찾아 재고 기록을 바로 갱신하고, 작업자는 뭔가 안 맞을 때만 개입합니다.',
            ),
          ],
          result: [
            l(
              '**Fewer manual steps** per inbound and outbound operation, and a smoother workflow for the warehouse team.',
              '입출고 작업마다 필요한 수작업 단계가 줄었고, 창고 팀의 작업 흐름이 매끄러워졌습니다.',
            ),
          ],
        },
      },

      // ── Legacy migration ─────────────────────────────────────
      {
        id: 'legacy-migration',
        title: l('PDA .NET logistics system to a Node.js web application', 'PDA 기반 .NET 물류 시스템을 Node.js 웹 애플리케이션으로'),
        stack: ['Node.js', 'Microservices', '.NET (legacy)'],
        detail: {
          context: [
            l(
              'The logistics system was a **.NET application installed on each PDA device**. **Every update had to be distributed to every device**, so shipping a fix was slow and production issues took a long time to resolve.',
              '물류 시스템은 PDA 기기마다 설치되는 .NET 애플리케이션이었습니다. 업데이트할 때마다 모든 기기에 배포해야 해서 수정 하나 내보내는 데 시간이 오래 걸렸고, 운영 이슈 대응도 느렸습니다.',
            ),
          ],
          did: [
            l(
              'Helped migrate it to a **Node.js web application**, split into services by area, that runs in the PDA browser. Updates are now **deployed once on the server** and every device gets the latest version the next time it opens the app.',
              'PDA 브라우저에서 동작하는 Node.js 웹 애플리케이션으로 옮기는 작업을 맡았고, 기능 영역별로 서비스를 나눴습니다. 이제 서버에 한 번 배포하면 모든 기기가 다음에 앱을 열 때 최신 버전을 쓰게 됩니다.',
            ),
            l(
              '**Owned deployment and operations** of the new system afterward.',
              '전환 이후 새 시스템의 배포와 운영을 직접 맡았습니다.',
            ),
          ],
          result: [
            l(
              'Rolling out bug fixes and responding to production issues became much faster, and **application downtime decreased by 30%**.',
              '버그 수정 배포와 운영 이슈 대응이 훨씬 빨라졌고, 애플리케이션 다운타임이 30% 줄었습니다.',
            ),
          ],
        },
      },

      // ── Regression tests ─────────────────────────────────────
      {
        id: 'regression-tests',
        title: l('Regression tests in Postman for 300K+ transactions a year', '연 30만 건 이상 거래를 지키는 Postman 회귀 테스트'),
        stack: ['Postman', 'Spring Boot', 'JSON'],
        detail: {
          context: [
            l(
              'Before **big promotions like Black Friday or Christmas**, discount and sales logic **changed often**, and a small change in an API or a data format could quietly break something that used to work.',
              '블랙프라이데이나 크리스마스 같은 큰 프로모션 전에는 할인과 판매 로직이 자주 바뀌었고, API나 데이터 형식이 조금만 달라져도 잘 되던 기능이 조용히 깨질 수 있었습니다.',
            ),
          ],
          did: [
            l(
              'Built and ran a set of **10+ regression tests in Postman** against the Spring Boot services, checking the JSON request and response of each API so that a **renamed or missing field would be caught before release**.',
              'Spring Boot 서비스를 대상으로 Postman 회귀 테스트 10개 이상을 만들어 실행했습니다. 각 API의 JSON 요청과 응답을 검증해서, 필드 이름이 바뀌거나 빠진 경우를 배포 전에 잡아냈습니다.',
            ),
            l(
              'Ran the set whenever business logic or an API changed, especially in the run-up to major campaigns.',
              '비즈니스 로직이나 API가 바뀔 때마다, 특히 큰 캠페인 직전에 이 테스트를 돌렸습니다.',
            ),
          ],
          result: [
            l(
              'Prevented **field-level data mismatches** from reaching production and kept **300K+ transactions a year** processing correctly.',
              '필드 단위 데이터 불일치가 프로덕션까지 가는 것을 막고, 연 30만 건 이상의 거래가 정확하게 처리되도록 했습니다.',
            ),
          ],
        },
      },
    ],
  },
]
