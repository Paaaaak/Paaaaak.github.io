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
      l('LLM Agents · Tool Calling', 'LLM 에이전트 · Tool Calling'),
      l('Prompt & Context Engineering', '프롬프트 & 컨텍스트 엔지니어링'),
      l('AI Coding Agents in Production', '프로덕션 AI 코딩 에이전트'),
    ],
    summary: l(
      'Built production LLM applications for an e-commerce engineering org: a tool-calling code review agent in Azure DevOps CI/CD, a retrieval and embedding pipeline for recommendations, and automated model retraining, using AI coding agents (Claude Code) as the daily development harness.',
      '이커머스 엔지니어링 조직에서 프로덕션 LLM 애플리케이션을 만들었습니다. Azure DevOps CI/CD에 붙인 tool-calling 코드 리뷰 에이전트, 추천을 위한 검색·임베딩 파이프라인, 모델 재학습 자동화까지. 개발은 AI 코딩 에이전트(Claude Code)를 기본 하네스로 삼아 진행했습니다.',
    ),
    stories: [
      // ── 1. AI code review agent ──────────────────────────────
      {
        id: 'code-review-agent',
        title: l('AI code review agent in Azure DevOps CI/CD', 'Azure DevOps CI/CD의 AI 코드 리뷰 에이전트'),
        stack: ['Claude API', 'Azure DevOps Pipelines & REST API', 'TypeScript'],
        caseStudy: {
          architecture: {
            rows: [
              [
                { id: 'pr', label: l('Pull Request', 'Pull Request'), sub: l('Azure DevOps Repos', 'Azure DevOps Repos') },
                { id: 'pipe', label: l('Pipeline trigger', '파이프라인 트리거'), sub: l('on PR create / update', 'PR 생성 · 업데이트 시') },
                { id: 'agent', label: l('Review Agent', '리뷰 에이전트'), sub: l('diff · context · chunking', 'diff · 컨텍스트 · 청킹'), accent: true },
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
              'Every PR went through the same repetitive first pass (style, obvious bugs, missing tests) before reviewers could get to the substance.',
              '모든 PR에서 코드 스타일, 명백한 버그, 테스트 누락 같은 반복적인 1차 점검을 끝낸 뒤에야 리뷰어가 본질적인 리뷰를 시작할 수 있었습니다.',
            ),
            l(
              'Rule-based tooling (linters, static checks) cannot judge intent, naming, or whether a change fits the surrounding code.',
              '린터나 정적 분석 같은 규칙 기반 도구는 코드의 의도, 네이밍, 주변 코드와의 일관성처럼 맥락이 필요한 판단을 하지 못했습니다.',
            ),
            l(
              'For the result to change behavior it had to land inside the PR, as inline comments reviewers already read, not in a separate tool.',
              '리뷰 방식이 실제로 바뀌려면, 결과가 별도의 도구가 아니라 리뷰어가 이미 보고 있는 PR 안에 인라인 코멘트로 남아야 했습니다.',
            ),
          ],
          solution: [
            l(
              'Added the agent as a step in the Azure DevOps pipeline, triggered on PR create/update, so it runs where reviews already happen.',
              'PR이 생성되거나 업데이트될 때 실행되는 단계로 에이전트를 Azure DevOps 파이프라인에 추가해, 리뷰가 원래 이루어지는 곳에서 바로 동작하게 했습니다.',
            ),
            l(
              'Assembled the prompt from the PR diff plus repo-specific context (conventions, touched modules, PR metadata), and chunked large diffs so cross-file references survive.',
              'PR diff에 저장소 컨벤션, 변경된 모듈, PR 메타데이터 같은 컨텍스트를 함께 담아 프롬프트를 구성했고, 큰 diff는 파일 간 참조가 끊어지지 않도록 나누어 처리했습니다.',
            ),
            l(
              'Asked Claude for structured findings (file, line, severity, concrete suggestion) so the output can be processed programmatically.',
              'Claude가 파일, 라인, 심각도, 구체적인 수정 제안을 포함한 구조화된 형식으로 응답하도록 요청해, 결과를 코드로 바로 처리할 수 있게 했습니다.',
            ),
            l(
              'Gave the agent two write-back tools through tool/function calling, "post an inline comment on a changed line" and "post a PR-level summary", both backed by the Azure DevOps REST API. The model decides where a finding belongs and the harness executes it.',
              '에이전트에 tool/function calling으로 write-back 도구를 붙였습니다. "특정 변경 라인에 인라인 코멘트 달기", "PR 전체 요약 남기기" 두 가지 도구가 Azure DevOps REST API 위에서 동작하며, 어디에 어떤 지적을 남길지는 모델이 정하고 실행은 하네스가 합니다.',
            ),
            l(
              'Evaluated it against a golden set of ~40 past PRs with known human review comments, measuring how many real issues it caught and how many comments reviewers marked as noise, and iterated on prompt structure and severity thresholds until the noise rate was acceptable.',
              '사람 리뷰 코멘트가 남아 있는 과거 PR 약 40개로 골든 셋을 만들어 평가했습니다. 실제 이슈를 얼마나 잡아내는지, 리뷰어가 "불필요"로 표시한 코멘트가 얼마나 되는지를 측정하고, 노이즈 비율이 납득할 수준이 될 때까지 프롬프트 구조와 심각도 기준을 조정했습니다.',
            ),
          ],
          promptDesign: [
            l(
              'Layered prompt: a stable system layer (reviewer role, severity rubric, repo conventions), a task layer (PR title, description, touched modules), and a data layer (diff chunks).',
              '프롬프트를 세 층으로 나눴습니다. 고정된 시스템 층(리뷰어 역할, 심각도 기준, 저장소 컨벤션), 작업 층(PR 제목·설명·변경 모듈), 데이터 층(diff 조각). 지시는 그대로 두고 데이터만 PR마다 바뀝니다.',
            ),
            l(
              'Context assembly under a token budget: signatures and imports of touched files rather than whole files, so the model sees intent without noise.',
              '토큰 예산 안에서 컨텍스트를 구성합니다. 파일 전체 대신 변경된 파일의 함수 시그니처와 import만 넣어, 모델이 불필요한 정보 없이 의도를 파악할 수 있게 했습니다.',
            ),
            l(
              'Chunking with a shared reference header so a finding in one chunk can still point at code in another.',
              'diff를 나눌 때 모든 조각에 공통 참조 헤더를 넣어, 한 조각에서 나온 지적이 다른 조각의 코드를 가리킬 수 있게 했습니다.',
            ),
            l(
              'Output contract: strict JSON validated before posting; malformed output triggers a constrained retry instead of a bad comment.',
              '출력 형식을 엄격한 JSON으로 고정하고 게시 전에 검증합니다. 형식이 깨지면 잘못된 코멘트를 남기는 대신 제한된 횟수만큼 다시 시도합니다.',
            ),
            l(
              'Explicit negative constraints (what the linter already covers, generated files) to keep the agent out of noise.',
              '린터가 이미 잡아내는 항목이나 자동 생성 파일처럼 지적하지 말아야 할 것을 명시적으로 제외해 불필요한 코멘트를 막았습니다.',
            ),
          ],
          result: [
            l(
              'Repetitive first-pass review is automated on every PR; reviewers start from a PR that already has findings pinned to the relevant lines.',
              '반복적인 1차 리뷰가 모든 PR에서 자동으로 이루어지고, 리뷰어는 중요한 라인에 이미 코멘트가 달린 상태에서 리뷰를 시작합니다.',
            ),
            l(
              'The pattern (pipeline hook → context assembly → structured LLM output → write-back) is reusable for other automations on the same platform.',
              '파이프라인 훅 → 컨텍스트 구성 → 구조화된 LLM 출력 → write-back으로 이어지는 패턴은 같은 플랫폼의 다른 자동화에도 그대로 재사용할 수 있습니다.',
            ),
          ],
        },
      },

      // ── 2. Vector recommendation ──────────────────────────────
      {
        id: 'vector-recs',
        title: l('Vector-based product recommendations on Azure AI Search', 'Azure AI Search 기반 벡터 상품 추천'),
        stack: ['Azure AI Search', 'Azure OpenAI Embeddings', 'Python', 'Hybrid retrieval'],
        detail: {
          context: [
            l(
              'Recommendations were driven entirely by the legacy SAR model, which only knows co-purchase patterns. Merchandising asked whether we could also recommend by product attributes such as scent family, notes, brand, concentration and price band, so someone viewing a woody oud fragrance would see similar scents, not just what other shoppers happened to buy alongside it.',
              '기존 추천은 레거시 SAR 모델 하나로 돌아갔고, 이 모델은 "함께 구매된 상품" 패턴만 알고 있었습니다. 머천다이징 팀에서 향 계열, 노트, 브랜드, 농도, 가격대 같은 상품 속성 기준으로도 추천할 수 없겠냐는 제안이 들어왔습니다. 우디 계열 오드 향수를 보고 있는 고객에게 단순히 같이 팔린 상품이 아니라 비슷한 향을 보여주자는 것이었습니다.',
            ),
            l(
              'A first attempt with hand-written attribute rules (same brand + same family) was brittle: every new attribute meant new rules, and rules cannot rank how similar two products are.',
              '처음에는 "같은 브랜드 + 같은 계열" 식의 수작업 규칙으로 시도했지만 금방 한계가 왔습니다. 속성이 하나 늘어날 때마다 규칙을 다시 짜야 했고, 무엇보다 두 상품이 "얼마나" 비슷한지 순위를 매길 수 없었습니다.',
            ),
          ],
          did: [
            l(
              'Built an embedding pipeline: each product’s structured attributes and description are merged into one text document, embedded with an Azure OpenAI text-embedding model, and stored in an Azure AI Search index with an HNSW vector field plus filterable fields (brand, gender, price, in-stock).',
              '상품 임베딩 파이프라인을 만들었습니다. 상품의 구조화된 속성과 설명을 하나의 텍스트로 합쳐 Azure OpenAI 임베딩 모델로 벡터화하고, Azure AI Search 인덱스에 HNSW 벡터 필드와 필터용 필드(브랜드, 성별, 가격, 재고 여부)를 함께 저장했습니다.',
            ),
            l(
              'Designed the query path as hybrid retrieval: vector similarity for "smells like this", combined with filter clauses for hard constraints (in stock, same gender category, price within ±30%) so results are both similar and actually purchasable.',
              '검색은 하이브리드로 설계했습니다. "이 향과 비슷한 것"은 벡터 유사도로 찾고, 재고 있음·같은 성별 카테고리·가격 ±30% 같은 필수 조건은 필터로 걸어서, 비슷하면서도 실제로 구매 가능한 상품만 나오게 했습니다.',
            ),
            l(
              'Kept the index in sync with the catalog through an incremental indexer: catalog changes land in a change feed, only changed SKUs are re-embedded, and discontinued products are purged nightly.',
              '인덱스는 증분 방식으로 카탈로그와 동기화했습니다. 카탈로그 변경이 change feed로 들어오면 바뀐 SKU만 다시 임베딩하고, 단종 상품은 매일 밤 정리합니다.',
            ),
            l(
              'Exposed it as a REST endpoint with the same response contract as the SAR path, so the storefront could A/B the two sources without any frontend change.',
              '응답 형식을 기존 SAR 경로와 똑같이 맞춘 REST 엔드포인트로 제공해, 프론트엔드 수정 없이 두 추천 소스를 A/B 테스트할 수 있게 했습니다.',
            ),
          ],
          result: [
            l(
              'Recommendations now reflect product attributes as well as purchase history, and merchandising can tune the balance between the two without code changes.',
              '이제 추천에 구매 이력뿐 아니라 상품 속성이 반영되고, 머천다이징 팀이 코드 수정 없이 두 방식의 비중을 조절할 수 있습니다.',
            ),
            l(
              'Shipped to production as an additional recommendation source next to SAR. The same index doubles as the retrieval layer for a RAG-style product Q&A prototype that grounds answers in catalog data instead of the model’s memory.',
              'SAR과 나란히 동작하는 추가 추천 소스로 프로덕션에 배포했습니다. 같은 인덱스는 모델의 기억이 아닌 카탈로그 데이터에 근거해 답하는 RAG 방식 상품 Q&A 프로토타입의 검색 계층으로도 쓰이고 있습니다.',
            ),
          ],
        },
      },

      // ── 3. SAR retraining automation ──────────────────────────
      {
        id: 'sar-retraining',
        title: l('Automated SAR model retraining with Azure Functions', 'Azure Functions로 SAR 모델 재학습 자동화'),
        stack: ['Azure Functions (timer trigger)', 'Azure Blob Storage', 'Python', 'SAR'],
        detail: {
          context: [
            l(
              'The legacy SAR (Smart Adaptive Recommendations) model was retrained by hand: an engineer exported recent order data, ran a training notebook on their laptop, and uploaded the output. In practice that happened every few weeks, so new products had no recommendations and seasonal shifts showed up late.',
              '레거시 SAR(Smart Adaptive Recommendations) 모델은 사람이 직접 재학습시키고 있었습니다. 엔지니어가 최근 주문 데이터를 뽑아 노트북에서 학습 스크립트를 돌리고 결과를 업로드하는 방식이었죠. 실제로는 몇 주에 한 번 정도 이루어져서, 신상품은 추천에 뜨지 않고 시즌 변화도 늦게 반영됐습니다.',
            ),
            l(
              'It was also fragile: tied to one person’s machine, with no record of which data window a given model had been trained on.',
              '한 사람의 장비에 묶여 있어 취약했고, 특정 모델이 어느 기간의 데이터로 학습됐는지 기록도 남지 않았습니다.',
            ),
          ],
          did: [
            l(
              'Rebuilt the run as a timer-triggered Azure Function on a weekly schedule: it pulls the last N months of orders and product views from the transactional DB, builds the user–item interaction matrix, and fits SAR (item-item co-occurrence with time decay) using the same hyperparameters as the manual run.',
              '재학습을 매주 실행되는 타이머 트리거 Azure Function으로 다시 만들었습니다. 트랜잭션 DB에서 최근 N개월의 주문과 상품 조회 데이터를 가져와 사용자–상품 상호작용 행렬을 만들고, 기존 수동 실행과 같은 하이퍼파라미터로 SAR(시간 감쇠가 적용된 아이템 간 동시 발생 모델)을 학습합니다.',
            ),
            l(
              'Each run writes the item-similarity table and a versioned model artifact to Blob Storage under a dated path, then validates it (row counts, coverage of active SKUs, and top-k overlap with the previous model) before moving a "current" pointer that the recommendation API reads.',
              '실행마다 아이템 유사도 테이블과 버전이 붙은 모델 파일을 날짜별 경로로 Blob Storage에 저장하고, 검증을 거칩니다. 행 개수, 판매 중인 SKU 커버리지, 이전 모델과의 top-k 겹침 정도를 확인한 뒤에야 추천 API가 읽는 "current" 포인터를 새 모델로 옮깁니다.',
            ),
            l(
              'Added failure alerts and a retry path so a failed run leaves the previous model serving instead of breaking recommendations.',
              '실패 알림과 재시도 경로를 추가해, 학습이 실패해도 추천이 끊기지 않고 이전 모델이 그대로 서비스되도록 했습니다.',
            ),
          ],
          result: [
            l(
              'Retraining went from every few weeks by hand to weekly and unattended; new products get recommendations within a week of launch.',
              '재학습이 "몇 주에 한 번, 사람이 직접"에서 "매주, 자동"으로 바뀌었고, 신상품도 출시 후 일주일 안에 추천에 반영됩니다.',
            ),
            l(
              'Every model is reproducible, since the data window and parameters are logged, and rollback is a single pointer change.',
              '모든 모델의 학습 기간과 파라미터가 기록되어 재현이 가능하고, 문제가 생기면 포인터 하나만 되돌리면 됩니다.',
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
      l('Full-stack (TypeScript/React + Spring)', '풀스택 (TypeScript/React + Spring)'),
      l('Kubernetes Operations', 'Kubernetes 운영'),
      l('10M+ Users in Production', '1,000만+ 사용자 프로덕션'),
    ],
    summary: l(
      'Full-stack engineer on OK Cashbag, a mobile web app serving 10M+ users in Korea: shipped TypeScript/React and Spring features quickly and hardened the ad-reward service on Kubernetes so a faulty instance is isolated and restarted automatically.',
      '한국 1,000만+ 사용자의 OK캐쉬백 모바일 웹을 담당한 풀스택 엔지니어입니다. TypeScript/React와 Spring으로 기능을 빠르게 만들어 배포했고, 광고 리워드 서비스를 Kubernetes에서 운영해 장애 인스턴스가 자동으로 격리·재시작되도록 만들었습니다.',
    ),
    stories: [
      // ── ★ Kubernetes: reward service resilience ──────────────
      {
        id: 'k8s-reward',
        title: l('Isolating faulty reward-service instances with Kubernetes', 'Kubernetes로 장애 Reward 인스턴스 자동 격리'),
        stack: ['Kubernetes', 'Docker', 'Spring', 'Readiness / Liveness probes'],
        caseStudy: {
          architecture: {
            fanOut: true,
            rows: [
              [
                { id: 'vendor', label: l('Ad vendors', '광고 업체'), sub: l('S2S postback', 'S2S postback') },
                { id: 'lb', label: l('Load Balancer', 'Load Balancer'), sub: l('ingress', '인그레스') },
                { id: 'svc', label: l('Kubernetes Service', 'Kubernetes Service'), sub: l('healthy endpoints only', '정상 endpoint만 라우팅'), accent: true },
              ],
              [
                { id: 'pod1', label: l('Reward Pod 1', 'Reward Pod 1'), sub: l('ready ✓', 'ready ✓'), accent: true },
                { id: 'pod2', label: l('Reward Pod 2', 'Reward Pod 2'), sub: l('ready ✓', 'ready ✓'), accent: true },
                { id: 'pod3', label: l('Reward Pod 3', 'Reward Pod 3'), sub: l('unhealthy ✕ → excluded', 'unhealthy ✕ → 제외'), tone: 'bad' },
              ],
            ],
            rowLinks: [l('readiness-gated routing', 'readiness 기준 라우팅')],
          },
          architectureNote: l(
            'The reward service runs as several Pods behind a Kubernetes Service. A Pod that fails its readiness check is dropped from the endpoints; one that keeps failing liveness is restarted, and the Deployment keeps the replica count at 3.',
            'Reward 서비스는 Kubernetes Service 뒤의 여러 Pod로 동작합니다. readiness 체크에 실패한 Pod는 endpoint에서 제외되고, liveness에 반복 실패하면 재시작되며, Deployment가 replica 수를 3으로 유지합니다.',
          ),
          problem: [
            l(
              'The OK Cashbag ad-reward system receives S2S postback requests from multiple ad vendors, validates them, and grants points.',
              'OK캐쉬백 광고 리워드 시스템은 여러 광고 업체의 S2S postback 요청을 받아 검증한 뒤 포인트를 지급하고 있었습니다.',
            ),
            l(
              'When a campaign spiked traffic, or a vendor sent abnormal requests repeatedly, CPU/memory on Spring instances climbed and some instances stopped responding.',
              '특정 캠페인에서 요청이 순간적으로 급증하거나 외부 광고사의 비정상 요청이 반복되면 Spring 인스턴스의 CPU/메모리 사용량이 올라가며 일부 인스턴스가 응답하지 않았습니다.',
            ),
            l(
              'A broken instance kept receiving traffic, so reward API timeouts grew and even legitimate point grants were affected.',
              '문제 인스턴스가 계속 트래픽을 받으면서 reward API의 timeout이 증가하고 정상적인 포인트 지급 요청까지 영향을 받을 수 있었습니다.',
            ),
          ],
          solution: [
            l(
              'Packaged the reward service as a Docker container and ran it as multiple Pods under a Kubernetes Deployment.',
              'Reward 서비스를 Docker 컨테이너로 패키징하고 Kubernetes Deployment의 여러 Pod로 운영하도록 구성했습니다.',
            ),
            l(
              'Configured a readiness probe on each Pod: a Pod that fails readiness is removed from the Service endpoints so no new requests reach it.',
              '각 Pod에 readiness probe를 설정해, readiness 체크에 실패한 Pod는 Kubernetes Service의 endpoint에서 제외되어 신규 요청이 전달되지 않게 했습니다.',
            ),
            l(
              'Configured a liveness probe: repeated liveness failures automatically restart the container.',
              'liveness probe도 설정해, liveness 체크가 반복적으로 실패하면 해당 컨테이너가 자동으로 재시작되도록 했습니다.',
            ),
            l(
              'Set the Deployment’s desired replicas (e.g. 3) so that if a Pod terminates entirely, Kubernetes schedules a new one automatically.',
              'Pod가 완전히 종료되는 경우에도 Deployment의 desired replicas(예: 3)에 따라 Kubernetes가 자동으로 새 Pod를 생성하도록 했습니다.',
            ),
          ],
          result: [
            l(
              'A failing reward-service instance is now isolated from traffic and restarted automatically, so one application fault no longer escalates into a full reward-processing outage.',
              '특정 Reward 인스턴스에 장애가 나도 문제 Pod가 자동으로 트래픽에서 격리·재시작되어, 하나의 애플리케이션 장애가 전체 리워드 처리 장애로 확대되는 것을 줄였습니다.',
            ),
            l(
              'Operators no longer have to find and restart the broken instance by hand; Kubernetes does it, cutting recovery time and operational load.',
              '운영자가 장애 인스턴스를 확인하고 직접 재시작해야 했던 과정을 Kubernetes가 자동화해 장애 복구 시간과 운영 부담이 줄었습니다.',
            ),
          ],
        },
      },

      // ── OK Cashbag ───────────────────────────────────────────
      {
        id: 'ok-cashbag',
        title: l('Full-stack features on OK Cashbag mobile web for 10M+ users', '1,000만+ 사용자 OK캐쉬백 모바일 웹 풀스택 개발'),
        stack: ['React', 'TypeScript', 'Spring', 'Java', 'Feature flags'],
        detail: {
          context: [
            l(
              'OK Cashbag is one of Korea’s largest loyalty programs. Its mobile web is where 10M+ members check points, use coupons, and complete reward missions (ads, surveys, app installs).',
              'OK캐쉬백은 국내 최대 규모의 멤버십 서비스 중 하나입니다. 1,000만 명이 넘는 회원이 모바일 웹에서 포인트를 확인하고, 쿠폰을 쓰고, 광고·설문·앱 설치 같은 리워드 미션을 수행합니다.',
            ),
            l(
              'I was on the team that owns the reward and missions area. Every feature there touches points, which is money, so correctness and safe releases mattered as much as shipping speed.',
              '저는 리워드·미션 영역을 담당하는 팀에 있었습니다. 이 영역의 모든 기능은 포인트, 즉 돈을 다루기 때문에 빠른 배포만큼이나 정확성과 안전한 릴리즈가 중요했습니다.',
            ),
          ],
          did: [
            l(
              'Delivered features end to end, from PM spec through QA to release: React/TypeScript screens (mission list, reward history, coupon wallet), the Spring/Java APIs behind them, and the DB changes.',
              '기능을 처음부터 끝까지 맡아 개발했습니다. React/TypeScript 화면(미션 목록, 리워드 내역, 쿠폰함), 그 뒤의 Spring/Java API, DB 변경까지 기획 문서에서 QA, 릴리즈까지 한 흐름으로요.',
            ),
            l(
              'Stood up usable internal tools quickly when the ops team needed them: for example a React + Spring admin console for scheduling missions and reviewing reward payouts, from request to first usable version in about a week.',
              '운영팀이 필요로 하는 내부 도구도 빠르게 만들어 냈습니다. 예를 들어 미션 일정을 등록하고 리워드 지급 내역을 검토하는 React + Spring 관리자 콘솔은 요청부터 실제로 쓸 수 있는 첫 버전까지 약 일주일 만에 만들었습니다.',
            ),
            l(
              'Handled the realities of a 10M-user app: backward-compatible API changes (old app versions stay in the wild for months), feature flags to dark-launch risky changes to a percentage of users, and DB migrations during low-traffic windows.',
              '1,000만 사용자 서비스의 현실적인 제약도 다뤘습니다. 구버전 앱이 몇 달씩 남아 있으니 API는 항상 하위 호환을 지키고, 위험한 변경은 피처 플래그로 일부 사용자에게만 먼저 열고, DB 마이그레이션은 트래픽이 적은 시간대에 진행했습니다.',
            ),
          ],
          result: [
            l(
              'Shipped features to millions of users reliably and became the go-to engineer for the reward flow, from frontend to database.',
              '수백만 사용자에게 기능을 안정적으로 배포했고, 프론트엔드부터 DB까지 리워드 흐름 전반을 가장 잘 아는 엔지니어로 자리 잡았습니다.',
            ),
          ],
        },
      },

      // ── Ad integration ───────────────────────────────────────
      {
        id: 'ad-integration',
        title: l('Third-party ad API integration across formats', '다양한 포맷의 서드파티 광고 API 연동'),
        stack: ['JavaScript', 'Ad SDKs', 'REST APIs', 'Idempotency'],
        detail: {
          context: [
            l(
              'Missions like "watch a 30-second video and earn points" drive a large share of engagement, and every ad partner (video, banner, interstitial) ships its own SDK with different callbacks, timing rules, and reward-confirmation flow.',
              '"30초 영상을 보면 포인트 적립" 같은 미션은 서비스 참여도의 큰 부분을 차지합니다. 그런데 광고사마다(영상, 배너, 전면) SDK가 따로 있고 콜백, 노출 타이밍 규칙, 리워드 확인 방식이 전부 달랐습니다.',
            ),
            l(
              'Each partner had been wired in ad hoc, so the same bugs kept coming back per partner: double rewards, or rewards not paid when a user backgrounded the app mid-video.',
              '광고사별로 따로따로 붙여 놓은 구조라서, 리워드 중복 지급이나 영상 중간에 앱을 백그라운드로 보냈을 때 지급이 안 되는 것 같은 버그가 광고사마다 반복해서 터졌습니다.',
            ),
          ],
          did: [
            l(
              'Designed a single ad-adapter interface (load → show → complete → reward) and implemented one adapter per partner behind it, so the mission screen no longer cared which vendor was serving.',
              '광고 어댑터 인터페이스를 하나로 정의하고(load → show → complete → reward), 광고사마다 그 뒤에서 어댑터를 구현했습니다. 미션 화면은 어느 광고사가 나오는지 신경 쓸 필요가 없어졌습니다.',
            ),
            l(
              'Handled the edge cases per format: skippable 30s video pays out only on the server-side completion callback, not the client event; banners get viewability timing and refresh throttling; interstitials block double-open and restore state when the user returns.',
              '포맷별 예외 상황을 정리했습니다. 스킵 가능한 30초 영상은 클라이언트 이벤트가 아니라 서버 측 완료 콜백이 왔을 때만 지급하고, 배너는 노출 시간 측정과 갱신 주기 제한을 두고, 전면 광고는 중복 오픈을 막고 사용자가 돌아왔을 때 상태를 복원하도록 했습니다.',
            ),
            l(
              'Made reward granting idempotent with a per-impression key, so a retried callback from a vendor could never pay twice.',
              '리워드 지급을 노출 단위 키로 멱등하게 만들어, 광고사에서 콜백을 재전송해도 두 번 지급되는 일이 없게 했습니다.',
            ),
          ],
          result: [
            l(
              'New ad partners could be added in days instead of weeks, and double-reward and missing-reward tickets in the missions area dropped sharply.',
              '새 광고사 연동이 몇 주에서 며칠로 줄었고, 미션 영역의 중복 지급·미지급 문의가 크게 감소했습니다.',
            ),
          ],
        },
      },

      // ── Quality ──────────────────────────────────────────────
      {
        id: 'quality',
        title: l('Code reviews and JUnit tests for critical business logic', '핵심 비즈니스 로직에 대한 코드 리뷰와 JUnit 테스트'),
        stack: ['JUnit', 'Java', 'Spring', 'CI'],
        detail: {
          context: [
            l(
              'The points logic (accrual rules, expiry, partner settlement) was the part of the codebase nobody wanted to touch: little test coverage and lots of business rules buried in long service methods.',
              '포인트 로직(적립 규칙, 소멸, 파트너 정산)은 아무도 손대고 싶어 하지 않는 영역이었습니다. 테스트가 거의 없었고, 비즈니스 규칙이 긴 서비스 메서드 안에 묻혀 있었습니다.',
            ),
          ],
          did: [
            l(
              'Introduced a review checklist for the team (points arithmetic, null and timezone handling, transaction boundaries, backward compatibility) and reviewed PRs across the team against it.',
              '팀 리뷰 체크리스트를 도입했습니다. 포인트 계산, null과 타임존 처리, 트랜잭션 경계, 하위 호환성 같은 항목이고, 이 기준으로 팀 전체의 PR을 리뷰했습니다.',
            ),
            l(
              'Wrote JUnit tests around the critical logic: table-driven unit tests for accrual and expiry rules, and Spring integration tests with an embedded DB for the settlement flow that reconciles partner callbacks with issued points.',
              '핵심 로직에 JUnit 테스트를 작성했습니다. 적립·소멸 규칙은 케이스 표 기반 단위 테스트로, 파트너 콜백과 지급된 포인트를 대조하는 정산 흐름은 내장 DB를 사용한 Spring 통합 테스트로 커버했습니다.',
            ),
            l(
              'Made the suite part of the CI gate so a failing rule blocks the merge.',
              '이 테스트를 CI 게이트에 포함시켜, 규칙 하나라도 깨지면 머지가 막히도록 했습니다.',
            ),
          ],
          result: [
            l(
              'Coverage on the core reward module went from near zero to covering every accrual and expiry path, and several regressions were caught in CI instead of by users.',
              '핵심 리워드 모듈의 테스트 커버리지가 거의 0에서 모든 적립·소멸 경로를 커버하는 수준이 되었고, 여러 회귀 버그를 사용자가 아니라 CI가 먼저 잡아냈습니다.',
            ),
          ],
        },
      },

      // ── Frontend performance ─────────────────────────────────
      {
        id: 'frontend-perf',
        title: l('Loading time reduced by up to 40%', '로딩 시간 최대 40% 단축'),
        stack: ['React', 'React Profiler', 'Code splitting', 'Memoization'],
        detail: {
          context: [
            l(
              'The main screens loaded slowly on mid-range Android devices: the bundle was large, and the mission list re-rendered every item whenever the user’s points changed.',
              '중급 안드로이드 기기에서 주요 화면이 느리게 떴습니다. 번들이 컸고, 사용자의 포인트가 바뀔 때마다 미션 목록 전체가 다시 렌더링되고 있었습니다.',
            ),
          ],
          did: [
            l(
              'Profiled with Chrome DevTools and React Profiler to find the actual causes: a few heavy components (chart, carousel) loaded eagerly, oversized images, and parent state changes re-rendering hundreds of list items.',
              'Chrome DevTools와 React Profiler로 실제 원인을 찾았습니다. 차트·캐러셀 같은 무거운 컴포넌트가 처음부터 로드되고, 이미지가 지나치게 크고, 상위 상태가 바뀔 때마다 수백 개의 목록 아이템이 다시 그려지고 있었습니다.',
            ),
            l(
              'Code-split the heavy components with lazy loading, memoized list items (React.memo / useMemo, shouldComponentUpdate on legacy class components) so they render only when their own data changes, and moved polling-driven updates out of top-level state.',
              '무거운 컴포넌트는 코드 스플리팅으로 필요할 때만 불러오고, 목록 아이템은 메모이제이션(React.memo / useMemo, 레거시 클래스 컴포넌트는 shouldComponentUpdate)으로 자기 데이터가 바뀔 때만 렌더링되게 했습니다. 폴링으로 갱신되는 값은 최상위 상태에서 분리했습니다.',
            ),
            l(
              'Compressed and lazy-loaded below-the-fold images and cached static API responses on the client.',
              '화면 아래쪽 이미지는 압축하고 지연 로딩했으며, 자주 바뀌지 않는 API 응답은 클라이언트에서 캐싱했습니다.',
            ),
          ],
          result: [
            l(
              'Initial loading time dropped by up to 40% on the target devices, and the mission list stayed smooth while points updated in the background.',
              '대상 기기에서 초기 로딩 시간이 최대 40% 줄었고, 포인트가 백그라운드에서 갱신되는 동안에도 미션 목록이 끊기지 않게 되었습니다.',
            ),
          ],
        },
      },

      // ── Design collaboration ─────────────────────────────────
      {
        id: 'design-collab',
        title: l('UX/UI collaboration with the design team, 30% more mobile traffic', '디자인팀과의 UX/UI 협업으로 모바일 트래픽 30% 증가'),
        stack: ['React', 'Design system', 'Component library'],
        detail: {
          context: [
            l(
              'Design handoffs arrived as finished mockups, engineering approximated them, and the mismatch surfaced at QA, so screens shipped late or looked different from what was designed.',
              '디자인은 완성된 목업으로 넘어오고, 개발은 그걸 "비슷하게" 구현하고, 차이는 QA에서 드러나는 구조였습니다. 그래서 화면이 늦게 나가거나 디자인과 다르게 나갔습니다.',
            ),
          ],
          did: [
            l(
              'Set up a weekly sync with the design team and joined design reviews early, flagging technical constraints (animation cost on low-end devices, data not yet available at that point in the flow) while designs were still cheap to change.',
              '디자인팀과 주간 싱크를 만들고 디자인 리뷰에 초기부터 참여했습니다. 저사양 기기에서의 애니메이션 비용이나 그 시점에는 아직 없는 데이터 같은 기술적 제약을, 디자인을 바꾸는 비용이 아직 낮을 때 미리 공유했습니다.',
            ),
            l(
              'Built a small shared component library (buttons, cards, spacing tokens) matching the design system so new screens matched the mockups by default instead of by hand.',
              '버튼, 카드, 간격 토큰 등 디자인 시스템에 맞춘 작은 공용 컴포넌트 라이브러리를 만들어, 새 화면이 손으로 맞추지 않아도 기본적으로 목업과 일치하도록 했습니다.',
            ),
            l(
              'Owned the redesign of the mission and reward screens end to end with the designers, iterating on real devices.',
              '미션·리워드 화면 리디자인을 디자이너와 함께 처음부터 끝까지 맡아, 실제 기기에서 확인하며 다듬었습니다.',
            ),
          ],
          result: [
            l(
              'Mobile user traffic increased by 30% after the redesigned screens shipped, and design-to-QA back-and-forth dropped noticeably.',
              '리디자인된 화면이 배포된 뒤 모바일 사용자 트래픽이 30% 증가했고, 디자인과 QA 사이를 오가는 수정 요청도 눈에 띄게 줄었습니다.',
            ),
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
      l('Data Pipelines · Quality · Lineage', '데이터 파이프라인 · 품질 · 계보'),
    ],
    summary: l(
      'Worked on-site with Samsonite Korea (500+ stores), extracting requirements from store and warehouse staff, making scoping calls, migrating a PDA .NET system to Node.js microservices, and building the data pipelines that connect ERP, POS, and warehouse data with quality checks, lineage, and row/column-level permissions.',
      '쌤소나이트 코리아(500여 개 매장) 현장에서 일했습니다. 매장과 창고 직원들에게서 직접 요구사항을 끌어내고 범위를 정했으며, PDA .NET 시스템을 Node.js 마이크로서비스로 옮기고, ERP·POS·물류 데이터를 품질 검증, 계보 추적, 행·열 단위 권한과 함께 연결하는 데이터 파이프라인을 만들었습니다.',
    ),
    stories: [
      // ── EPOS ─────────────────────────────────────────────────
      {
        id: 'epos',
        title: l('Samsonite EPOS web system for 500+ stores', '전국 500여 개 매장의 쌤소나이트 EPOS 웹 시스템'),
        stack: ['Spring Boot', 'MSSQL', 'On-site support'],
        detail: {
          context: [
            l(
              'Nexol System builds and operates the EPOS (point-of-sale) and logistics systems for Samsonite Korea, 500+ department-store and outlet locations. If EPOS is down, a store cannot ring up a sale.',
              '넥솔시스템은 쌤소나이트 코리아의 EPOS(판매 시점 관리)와 물류 시스템을 개발·운영하는 회사입니다. 백화점과 아울렛을 합쳐 500여 개 매장이 이 시스템으로 판매하고, EPOS가 멈추면 매장은 결제를 받을 수 없습니다.',
            ),
            l(
              'I was the engineer closest to the customer: requirements came from Samsonite’s retail and logistics teams as business problems, not specs, and I turned them into working features.',
              '저는 고객사와 가장 가까이에서 일하는 엔지니어였습니다. 요구사항은 쌤소나이트 리테일·물류 팀에서 명세가 아닌 "업무 문제"의 형태로 들어왔고, 그걸 동작하는 기능으로 바꾸는 일이 제 역할이었습니다.',
            ),
          ],
          did: [
            l(
              'Maintained and extended the Spring Boot / MSSQL EPOS backend: sales and returns, promotion and coupon rules, store inventory lookups, and daily settlement and closing.',
              'Spring Boot / MSSQL 기반 EPOS 백엔드를 운영하고 확장했습니다. 판매·반품, 프로모션과 쿠폰 규칙, 매장 재고 조회, 일일 정산과 마감 처리가 주요 영역이었습니다.',
            ),
            l(
              'Sat in requirement meetings with Samsonite stakeholders and made the scoping calls: which part of a request was a real need, which could be covered by an existing feature, and what to push to a later phase. Then I explained the trade-offs to store managers and merchandisers in their terms, not ours.',
              '쌤소나이트 담당자들과의 요구사항 회의에 직접 참여해 범위를 정했습니다. 요청 중 무엇이 진짜 필요한 것인지, 무엇은 기존 기능으로 해결되는지, 무엇은 다음 단계로 미룰지를 판단하고, 그 이유를 매장 관리자와 MD가 이해할 수 있는 말로 설명했습니다.',
            ),
            l(
              'Handled store-facing incidents end to end (reading logs, reproducing with real store data, shipping hotfixes), which taught me how staff actually used the system versus how it was designed.',
              '매장에서 올라오는 장애도 처음부터 끝까지 처리했습니다. 로그를 읽고, 실제 매장 데이터로 재현하고, 핫픽스를 배포하는 과정에서 시스템이 설계된 방식과 직원들이 실제로 쓰는 방식이 어떻게 다른지 배웠습니다.',
            ),
          ],
          result: [
            l(
              'Kept a nationwide POS system stable through peak seasons while continuously shipping the features the retail team asked for.',
              '성수기에도 전국 POS 시스템을 안정적으로 유지하면서, 리테일 팀이 요청한 기능을 꾸준히 배포했습니다.',
            ),
          ],
        },
      },

      // ── On-site discovery ────────────────────────────────────
      {
        id: 'onsite-discovery',
        title: l('Warehouse visits → single-scan automation', '물류창고 방문 → 싱글 스캔 자동화'),
        stack: ['Node.js', 'PDA / barcode scanning', 'ERP integration'],
        detail: {
          context: [
            l(
              'The warehouse team kept reporting that "the PDA is slow", but the tickets never pointed at anything specific in the code, and nothing was measurably slow on our side.',
              '물류창고 팀에서는 계속 "PDA가 느리다"고 했지만, 티켓에는 코드에서 짚을 만한 내용이 없었습니다. 저희 쪽 측정으로는 느린 게 없었거든요.',
            ),
          ],
          did: [
            l(
              'Went to the Samsonite logistics warehouses and shadowed operators through a full inbound/outbound shift instead of asking for more tickets.',
              '티켓을 더 달라고 하는 대신 쌤소나이트 물류창고에 직접 가서, 작업자들의 입출고 근무 한 교대를 처음부터 끝까지 따라다녔습니다.',
            ),
            l(
              'Found the real problem: for each carton, workers scanned the box barcode, then every item barcode, then confirmed a popup: three or more actions per unit, thousands of times a day. The software wasn’t slow; the workflow was.',
              '진짜 문제가 보였습니다. 상자 하나마다 박스 바코드를 찍고, 안의 개별 상품 바코드를 전부 찍고, 팝업을 확인하는 식으로 단위당 세 번 이상의 동작을 하루에 수천 번 반복하고 있었습니다. 느린 건 소프트웨어가 아니라 업무 흐름이었습니다.',
            ),
            l(
              'Proposed a single-scan flow and defended it to the logistics manager, who worried about losing per-item verification: scan the carton once, the Node.js service resolves its packing list from the ERP, pre-fills the items, and asks for confirmation only on discrepancies, with audio and color feedback because operators don’t watch the screen.',
              '싱글 스캔 방식을 제안하고, 개별 검수가 빠질까 걱정하는 물류 관리자를 설득했습니다. 상자를 한 번만 찍으면 Node.js 서비스가 ERP에서 포장 명세를 가져와 상품을 자동으로 채우고, 명세와 다를 때만 확인을 요구하는 방식입니다. 작업자들이 화면을 보지 않기 때문에 불일치는 소리와 색으로 알려주도록 했습니다.',
            ),
          ],
          result: [
            l(
              'Processing per carton dropped from several scans to one, and operators adopted it immediately because it was built around how they actually worked.',
              '상자당 처리가 여러 번의 스캔에서 한 번으로 줄었고, 실제 작업 방식에 맞춰 만들었기 때문에 작업자들이 바로 받아들였습니다.',
            ),
          ],
        },
      },

      // ── Legacy migration ─────────────────────────────────────
      {
        id: 'legacy-migration',
        title: l('PDA .NET logistics system → Node.js microservices', 'PDA 기반 .NET 물류 시스템 → Node.js 마이크로서비스'),
        stack: ['Node.js', 'Microservices', 'Docker', '.NET (legacy)'],
        detail: {
          context: [
            l(
              'The logistics system was a Windows PDA app on .NET: every change meant reinstalling on each device, nobody left on the team knew the codebase well, and it crashed often during peak inbound.',
              '물류 시스템은 .NET으로 만든 윈도우 PDA 앱이었습니다. 무언가 바꾸려면 기기마다 다시 설치해야 했고, 코드베이스를 잘 아는 사람이 팀에 남아 있지 않았으며, 입고가 몰리는 시간에 자주 죽었습니다.',
            ),
          ],
          did: [
            l(
              'Migrated it to a Node.js web application that runs in the PDA browser, split into microservices by domain: receiving, shipping, inventory, and label printing.',
              'PDA 브라우저에서 동작하는 Node.js 웹 애플리케이션으로 마이그레이션하고, 입고·출고·재고·라벨 출력 도메인별로 마이크로서비스를 나눴습니다.',
            ),
            l(
              'Ran old and new systems in parallel per warehouse zone, comparing outputs daily before cutting each zone over, and kept the .NET system as a fallback until the last zone was stable.',
              '창고 구역별로 기존 시스템과 새 시스템을 나란히 운영하며 매일 결과를 비교한 뒤 구역 하나씩 전환했고, 마지막 구역이 안정될 때까지 .NET 시스템을 대비책으로 남겨 두었습니다.',
            ),
            l(
              'Owned deployment and operations afterward: Dockerized services, health checks, centralized logging, and on-call.',
              '전환 뒤에는 배포와 운영을 직접 맡았습니다. 서비스를 Docker로 패키징하고, 헬스 체크와 중앙 로깅을 붙이고, 장애 대응도 담당했습니다.',
            ),
          ],
          result: [
            l(
              'Application downtime decreased by 30%, updates went from per-device reinstalls to a single server deploy, and new features could be added to one service without touching the others.',
              '애플리케이션 다운타임이 30% 줄었고, 업데이트가 기기별 재설치에서 서버 배포 한 번으로 바뀌었으며, 다른 서비스를 건드리지 않고 한 서비스에만 기능을 추가할 수 있게 되었습니다.',
            ),
          ],
        },
      },

      // ── Data pipelines ───────────────────────────────────────
      {
        id: 'data-pipelines',
        title: l('Data pipelines connecting ERP, POS, and warehouse systems', 'ERP · POS · 물류 시스템을 연결하는 데이터 파이프라인'),
        stack: ['SQL', 'Node.js batch', 'SAP ERP', 'Data quality', 'Row/column-level access'],
        detail: {
          context: [
            l(
              'Samsonite’s data lived in separate systems: the SAP ERP (product master, purchase orders), the EPOS database (sales, returns, store inventory), the warehouse system (inbound/outbound), and Excel files from department stores for settlement. They disagreed with each other often enough that HQ did not trust the reports.',
              '쌤소나이트의 데이터는 여러 시스템에 흩어져 있었습니다. SAP ERP(상품 마스터, 발주), EPOS DB(판매·반품·매장 재고), 물류 시스템(입출고), 그리고 백화점에서 정산용으로 보내는 엑셀 파일까지요. 이 데이터가 서로 안 맞는 일이 잦아서 본사가 리포트를 믿지 못하는 상황이었습니다.',
            ),
          ],
          did: [
            l(
              'Built the nightly batch pipelines (SQL + Node.js jobs) that pull from each source (ERP interface tables, the EPOS DB, warehouse events, and parsed department-store files) into a shared reporting schema.',
              '각 소스에서 데이터를 가져오는 야간 배치 파이프라인(SQL + Node.js 잡)을 만들었습니다. ERP 인터페이스 테이블, EPOS DB, 물류 이벤트, 파싱한 백화점 파일을 하나의 리포팅 스키마로 모았습니다.',
            ),
            l(
              'Put quality checks at every hop: row counts and sums reconciled against the source, SKUs validated against the ERP master, and a quarantine table for records that failed, so bad rows were surfaced instead of silently loaded.',
              '단계마다 품질 검증을 넣었습니다. 행 수와 합계를 소스와 대조하고, SKU를 ERP 마스터와 검증하고, 실패한 레코드는 격리 테이블로 보내서 잘못된 데이터가 조용히 들어가는 대신 드러나게 했습니다.',
            ),
            l(
              'Tracked lineage: every reporting row carries its source system, batch ID, and load time, so when a number looked wrong, we could trace it back to the exact file or table it came from.',
              '데이터의 출처도 추적했습니다. 리포팅 테이블의 모든 행에 소스 시스템, 배치 ID, 적재 시각을 남겨서, 숫자가 이상하면 어느 파일이나 테이블에서 온 것인지 바로 되짚을 수 있게 했습니다.',
            ),
            l(
              'Implemented row- and column-level permissions on the reporting layer: a store manager sees only their store’s rows, regional managers see their region, and cost and margin columns are visible only to HQ roles.',
              '리포팅 계층에 행·열 단위 권한을 적용했습니다. 매장 관리자는 자기 매장 데이터만, 지역 관리자는 담당 지역만 볼 수 있고, 원가와 마진 컬럼은 본사 권한에서만 보이도록 했습니다.',
            ),
          ],
          result: [
            l(
              'HQ, regions, and stores started working from the same numbers, reconciliation issues were caught the morning after instead of at month-end, and sensitive margin data stayed limited to the people who should see it.',
              '본사, 지역, 매장이 같은 숫자를 보고 일하게 되었고, 데이터 불일치는 월말이 아니라 다음 날 아침에 잡히게 되었으며, 민감한 마진 데이터는 봐야 할 사람에게만 열리게 되었습니다.',
            ),
          ],
        },
      },

      // ── DB performance ───────────────────────────────────────
      {
        id: 'db-performance',
        title: l('Query performance under high traffic, 20% faster', '고트래픽 환경의 쿼리 응답 시간 20% 단축'),
        stack: ['MSSQL', 'Execution plans', 'Indexing', 'Caching'],
        detail: {
          context: [
            l(
              'Store managers ran sales and inventory reports at the same times every day, opening and closing, and with 500+ stores hitting the same MSSQL tables, report queries slowed to tens of seconds at peak.',
              '매장 관리자들은 매일 같은 시간, 즉 오픈과 마감 때 판매·재고 리포트를 조회합니다. 500여 개 매장이 동시에 같은 MSSQL 테이블을 두드리니, 피크 시간에는 리포트 쿼리가 수십 초까지 느려졌습니다.',
            ),
          ],
          did: [
            l(
              'Captured the slow queries with SQL Server Query Store and execution plans, and ranked them by total cost rather than by who complained loudest.',
              'SQL Server Query Store와 실행 계획으로 느린 쿼리를 수집하고, 누가 가장 크게 불평했는지가 아니라 전체 비용 기준으로 우선순위를 매겼습니다.',
            ),
            l(
              'Added covering indexes for the hottest report queries, rewrote a few that used row-by-row functions, and introduced a nightly pre-aggregation table for daily sales by store so reports read summaries instead of scanning raw transactions.',
              '가장 자주 호출되는 리포트 쿼리에 커버링 인덱스를 추가하고, 행 단위 함수를 쓰던 쿼리 몇 개를 다시 작성했으며, 매장별 일별 매출을 야간에 미리 집계하는 테이블을 만들어 리포트가 원본 트랜잭션을 스캔하지 않고 요약을 읽도록 했습니다.',
            ),
            l(
              'Added a short-TTL cache for reference data (product master, store master) that every request had been re-reading from the database.',
              '요청마다 DB에서 다시 읽고 있던 참조 데이터(상품 마스터, 매장 마스터)에는 짧은 TTL의 캐시를 두었습니다.',
            ),
          ],
          result: [
            l(
              'Response times decreased by 20% overall, with the worst peak-time reports improving the most, and performance stayed stable through peak hours.',
              '전체 응답 시간이 20% 줄었고, 특히 피크 시간에 가장 느렸던 리포트가 가장 크게 개선되어 성수기에도 성능이 안정적으로 유지되었습니다.',
            ),
          ],
        },
      },

      // ── Regression tests ─────────────────────────────────────
      {
        id: 'regression-tests',
        title: l('Regression testing for 300K+ transactions a year', '연 30만 건 이상 트랜잭션을 지키는 회귀 테스트'),
        stack: ['Postman', 'Spring Boot', 'JSON Schema', 'CI'],
        detail: {
          context: [
            l(
              'After the microservice migration, a single transaction passed through several services, and one field renamed or typed differently in one service could silently corrupt data downstream, quantities landing in the wrong field, for instance.',
              '마이크로서비스로 전환한 뒤에는 트랜잭션 하나가 여러 서비스를 거치게 되었습니다. 한 서비스에서 필드 이름이나 타입이 하나만 바뀌어도 뒤쪽 데이터가 조용히 오염될 수 있었습니다. 예를 들어 수량이 엉뚱한 필드에 들어가는 식으로요.',
            ),
          ],
          did: [
            l(
              'Built a Postman regression suite (10+ scenarios) covering the main flows end to end (receive, ship, return, adjust) with schema and field-level assertions on every JSON request and response between the Spring Boot services.',
              '입고·출고·반품·조정 같은 주요 흐름을 처음부터 끝까지 커버하는 Postman 회귀 테스트(10개 이상 시나리오)를 만들었습니다. Spring Boot 서비스 간의 모든 JSON 요청·응답에 스키마 검증과 필드 단위 검증을 넣었습니다.',
            ),
            l(
              'Ran it as a CI step against staging on every deploy and after every schema change.',
              '이 테스트를 CI 단계로 넣어 배포마다, 그리고 스키마가 바뀔 때마다 스테이징 환경에서 실행했습니다.',
            ),
          ],
          result: [
            l(
              'Prevented field-level mismatches from reaching production and ensured accurate processing for 300K+ transactions annually.',
              '필드 단위 불일치가 프로덕션에 도달하는 것을 막고, 연 30만 건 이상의 트랜잭션이 정확하게 처리되도록 했습니다.',
            ),
          ],
        },
      },
    ],
  },
]
