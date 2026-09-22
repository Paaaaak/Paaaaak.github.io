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
              'Tested it against real pull requests and adjusted the prompt structure and severity thresholds until the comments were useful and the noise was low.',
              '실제 PR을 대상으로 테스트하면서, 코멘트가 실제로 도움이 되고 불필요한 지적은 적어질 때까지 프롬프트 구조와 심각도 기준을 조정했습니다.',
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
        title: l('Vector-based recommendation service on Azure AI Search', 'Azure AI Search 기반 벡터 추천 서비스'),
        stack: ['Azure AI Search', 'Embeddings', 'Python'],
        detail: {
          context: [
            l(
              'The existing recommendation system only knew which products were bought together. It had no way to say that two products are similar in themselves, so a customer looking at one fragrance would not see others that smell alike unless people had already bought them together.',
              '기존 추천은 "함께 구매된 상품"만 알고 있었습니다. 상품 자체가 서로 비슷하다는 걸 판단할 수 없어서, 어떤 향수를 보고 있는 고객에게 비슷한 향의 상품을 보여주려면 누군가 이미 그 둘을 함께 산 기록이 있어야 했습니다.',
            ),
          ],
          did: [
            l(
              'Turned each product’s name, description and attributes into an embedding (a list of numbers that captures its meaning) and stored them in an Azure AI Search index that supports vector search.',
              '각 상품의 이름, 설명, 속성을 임베딩(상품의 의미를 숫자 벡터로 표현한 것)으로 바꾸고, 벡터 검색을 지원하는 Azure AI Search 인덱스에 저장했습니다.',
            ),
            l(
              'Built the service that takes a product, finds the closest vectors in the index, and returns them as "similar products", with basic filters such as in-stock only.',
              '상품 하나를 받으면 인덱스에서 가장 가까운 벡터들을 찾아 "비슷한 상품"으로 돌려주는 서비스를 만들었습니다. 재고 있는 상품만 보여주는 것 같은 기본 필터도 넣었습니다.',
            ),
            l(
              'Wrote the job that keeps the index in step with the product catalog, so new or changed products get embedded and added without a manual step.',
              '상품 카탈로그가 바뀌면 인덱스도 따라가도록, 새 상품이나 변경된 상품을 자동으로 임베딩해서 넣는 작업을 만들었습니다.',
            ),
          ],
          result: [
            l(
              'Product pages can now recommend items that are similar in content, not only in purchase history, and the service runs alongside the existing recommendation path in production.',
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
              'The existing recommendation model (SAR, a Microsoft algorithm based on which products are bought together) had to be retrained by hand. Someone pulled the latest order data, ran the training, and uploaded the result, so it happened irregularly and new products took a long time to show up in recommendations.',
              '기존 추천 모델(SAR, 함께 구매된 상품 기반으로 동작하는 마이크로소프트 알고리즘)은 사람이 직접 재학습시켜야 했습니다. 최신 주문 데이터를 뽑아서 학습을 돌리고 결과를 올리는 과정이 손으로 이루어져서 주기가 불규칙했고, 신상품이 추천에 반영되기까지 오래 걸렸습니다.',
            ),
          ],
          did: [
            l(
              'Moved the whole retraining run into an Azure Function that runs on a schedule: it pulls recent order data, retrains the SAR model, and publishes the new model where the recommendation service reads it.',
              '재학습 과정 전체를 스케줄에 따라 실행되는 Azure Function으로 옮겼습니다. 최근 주문 데이터를 가져와 SAR 모델을 다시 학습하고, 새 모델을 추천 서비스가 읽는 위치에 올리는 것까지 한 번에 처리합니다.',
            ),
            l(
              'Added a simple check before publishing so a run that produced an empty or broken model leaves the previous one in place instead of replacing it.',
              '새 모델을 올리기 전에 간단한 검증을 넣어서, 결과가 비어 있거나 잘못 나온 경우에는 이전 모델을 그대로 두도록 했습니다.',
            ),
          ],
          result: [
            l(
              'Retraining now happens automatically on a fixed schedule with no one having to run it, and together with the vector service this modernized the production recommendation platform.',
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
      l('Kubernetes Operations', 'Kubernetes 운영'),
      l('10M+ Users in Production', '1,000만+ 사용자 프로덕션'),
    ],
    summary: l(
      'Java full-stack developer on OK Cashbag, a rewards platform with 10M+ users in Korea. Integrated third-party ad providers, made the reward payment logic reliable with tests, sped up the pages, and ran the reward service on Kubernetes so a broken instance is isolated and restarted on its own.',
      '국내 1,000만+ 사용자의 리워드 플랫폼 OK캐쉬백에서 Java 풀스택 개발자로 일했습니다. 서드파티 광고사를 연동하고, 리워드 지급 로직을 테스트로 안정화하고, 페이지 속도를 올렸으며, 리워드 서비스를 Kubernetes에서 운영해 고장 난 인스턴스가 스스로 격리·재시작되도록 만들었습니다.',
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
        title: l('OK Cashbag mobile web, a rewards platform for 10M+ users', 'OK캐쉬백 모바일 웹, 1,000만+ 사용자의 리워드 플랫폼'),
        stack: ['Spring', 'Java', 'React'],
        detail: {
          context: [
            l(
              'OK Cashbag is a cash-like rewards platform in Korea with more than 10 million users. People earn points by joining events, playing mini-games, or watching ads, and spend them on purchases, partner points, or gift cards.',
              'OK캐쉬백은 국내 1,000만 명 이상이 쓰는 현금성 리워드 플랫폼입니다. 이벤트 참여, 미니게임, 광고 시청으로 포인트를 모으고, 그 포인트를 결제나 제휴 포인트, 기프트카드로 쓸 수 있습니다.',
            ),
          ],
          did: [
            l(
              'Worked as a Java full-stack developer on the mobile web app: Spring on the backend, React on the frontend.',
              '모바일 웹 앱의 Java 풀스택 개발자로 일했습니다. 백엔드는 Spring, 프론트엔드는 React였습니다.',
            ),
            l(
              'My three main areas were integrating third-party ad providers, making the reward payment logic solid with tests, and improving page performance. Each is described below.',
              '주로 맡은 일은 세 가지였습니다. 서드파티 광고사 연동, 리워드 지급 로직을 테스트로 단단하게 만드는 일, 그리고 페이지 성능 개선입니다. 각각은 아래에 따로 정리했습니다.',
            ),
          ],
          result: [
            l(
              'Points are money to users, so the work was less about shipping fast and more about making sure every reward was paid exactly once, to the right person, on a page that loads quickly on a phone.',
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
              'Ads were directly tied to revenue: part of what advertisers paid came back to users as points, so the ad pipeline was effectively part of the revenue pipeline.',
              '광고는 매출과 직접 연결되어 있었습니다. 광고주가 낸 돈의 일부가 사용자에게 포인트로 돌아가는 구조라서, 광고 파이프라인이 사실상 매출 파이프라인의 일부였습니다.',
            ),
            l(
              'Every ad provider had a different SDK, a different callback structure and a different error format. Wiring each one directly into the business logic would have scattered provider-specific code across the app.',
              '광고사마다 SDK, 콜백 구조, 에러 형식이 전부 달랐습니다. 이걸 비즈니스 로직에 직접 붙이면 광고사별 코드가 앱 전체에 흩어져서 관리가 안 될 상황이었습니다.',
            ),
          ],
          did: [
            l(
              'How the flow works: when a user opens the event page, the frontend loads the provider’s SDK in an iframe and the provider serves a video. When the video finishes, the provider’s server, not our frontend, tells our Spring backend directly through a server-to-server postback (POST /postback/{vendor}) with the transaction ID, user ID and campaign ID. We treated that postback as the source of truth, because the frontend can be faked.',
              '흐름은 이렇습니다. 사용자가 이벤트 페이지를 열면 프론트엔드가 광고사 SDK를 iframe으로 띄우고, 광고사가 영상을 내려줍니다. 영상이 끝나면 우리 프론트엔드가 아니라 광고사 서버가 우리 Spring 백엔드에 직접 알려줍니다(서버 간 postback, POST /postback/{vendor}). 트랜잭션 ID, 사용자 ID, 캠페인 ID가 함께 옵니다. 프론트엔드는 조작될 수 있으니 이 postback을 기준으로 삼았습니다.',
            ),
            l(
              'Used the Adapter pattern: one common AdProvider interface (requestAd, onComplete, onSkip, onError) and one adapter class per provider. Adding a new provider means one adapter and one config entry, with no change to the business logic.',
              'Adapter 패턴을 썼습니다. 공통 AdProvider 인터페이스(requestAd, onComplete, onSkip, onError)를 정의하고 광고사마다 그걸 구현한 어댑터 클래스를 하나씩 두었습니다. 새 광고사를 붙일 때는 어댑터 하나와 설정 한 줄만 추가하면 되고, 비즈니스 로직은 건드리지 않습니다.',
            ),
            l(
              'Kept the controller thin: it receives the request, uses the right adapter to turn the provider’s payload into a common PostbackEvent, then checks the sender’s IP against the provider’s allowed ranges, verifies the signature with a shared secret, and checks the campaign status and whether the user is still eligible. Errors are handled in one place with @ControllerAdvice.',
              '컨트롤러는 얇게 유지했습니다. 요청을 받아 해당 어댑터로 광고사별 데이터를 공통 PostbackEvent로 바꾸고, 보낸 쪽 IP가 광고사의 허용 범위인지, 공유 비밀키로 서명이 맞는지, 캠페인이 유효한지, 사용자가 아직 받을 자격이 있는지를 확인합니다. 에러 처리는 @ControllerAdvice로 한곳에 모았습니다.',
            ),
            l(
              'The reward itself is written inside one database transaction so the reward record and the user’s balance always change together. A unique constraint on (vendor, transaction_id) blocks duplicates: if the same postback arrives twice, the second insert is rejected, we treat it as already processed and still return 200 OK, because providers retry when they don’t get a success response and we don’t want to trigger more retries.',
              '리워드 지급은 하나의 DB 트랜잭션 안에서 처리해서 리워드 기록과 사용자 잔액이 항상 함께 바뀝니다. (vendor, transaction_id)에 유니크 제약을 걸어 중복을 막았고, 같은 postback이 두 번 오면 두 번째 insert는 DB가 거부합니다. 이때는 "이미 처리됨"으로 보고 200 OK를 돌려줍니다. 광고사는 성공 응답을 못 받으면 재전송하기 때문에, 에러를 돌려주면 재시도만 늘어나기 때문입니다.',
            ),
            l(
              'Kept the handler fast: validation and the reward write happen synchronously, while notifications and analytics are pushed off to run asynchronously with ApplicationEventPublisher and @Async. Meanwhile the frontend shows "Checking your reward..." and polls GET /rewards/status?txId= every few seconds until the backend confirms.',
              '핸들러는 빠르게 응답하도록 했습니다. 검증과 리워드 기록은 동기로 처리하고, 알림이나 통계 같은 부수 작업은 ApplicationEventPublisher와 @Async로 비동기로 넘겼습니다. 그 사이 프론트엔드는 "리워드 확인 중..."을 보여주면서 GET /rewards/status?txId= 를 몇 초마다 확인하고, 백엔드가 확인해 주면 포인트를 표시합니다.',
            ),
          ],
          result: [
            l(
              'Skippable 30-second video, banner and interstitial formats from several providers all run through the same flow, new providers plug in with one adapter, and the same completed ad can never pay a user twice.',
              '여러 광고사의 스킵 가능한 30초 영상, 배너, 전면 광고가 모두 같은 흐름으로 처리되고, 새 광고사는 어댑터 하나로 붙일 수 있으며, 같은 광고 시청으로 포인트가 두 번 나가는 일이 없습니다.',
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
              'The provider could resend the same postback if our server answered slowly or the network hiccupped. The one thing that must never happen is a user getting paid twice for the same ad, so this logic needed tests more than anything else in the app.',
              '우리 서버 응답이 늦거나 네트워크가 잠깐 끊기면 광고사가 같은 postback을 다시 보낼 수 있습니다. 절대 일어나면 안 되는 건 같은 광고로 포인트가 두 번 나가는 것이었고, 그래서 앱에서 이 로직에 테스트가 가장 필요했습니다.',
            ),
          ],
          did: [
            l(
              'Wrote unit tests with JUnit and Mockito, mocking the ad provider and database pieces so the reward logic could be tested on its own and the tests stayed fast. The core case: the same transaction ID sent twice must create exactly one reward record and pay the points once.',
              'JUnit과 Mockito로 단위 테스트를 작성했습니다. 광고사와 DB 관련 부분은 목으로 대체해서 리워드 로직만 따로, 빠르게 테스트할 수 있게 했습니다. 핵심 케이스는 같은 트랜잭션 ID가 두 번 왔을 때 리워드 기록은 하나만 생기고 포인트도 한 번만 지급되는지였습니다.',
            ),
            l(
              'Covered the business edge cases that should all be rejected: a reward after the campaign budget ran out, a user over their daily limit, a skip signal on a campaign that requires the full video, and an unknown campaign ID.',
              '거부되어야 하는 비즈니스 예외 상황도 다 넣었습니다. 캠페인 예산이 다 떨어진 뒤의 지급 요청, 하루 한도를 넘긴 사용자, 영상을 끝까지 봐야 하는 캠페인에서 온 스킵 신호, 존재하지 않는 캠페인 ID 같은 것들입니다.',
            ),
            l(
              'Added integration tests with an in-memory H2 database and the real Spring context, so the whole path from the incoming web request through the business logic to the saved reward record is exercised.',
              '인메모리 DB인 H2와 실제 Spring 컨텍스트로 통합 테스트도 작성해서, 웹 요청이 들어와서 비즈니스 로직을 거쳐 리워드 기록이 DB에 저장되는 전체 경로를 검증했습니다.',
            ),
            l(
              'Also reviewed teammates’ code regularly, with the same focus on correctness of point calculations and maintainability.',
              '팀원들의 코드 리뷰도 꾸준히 했고, 포인트 계산이 정확한지와 유지보수하기 쉬운지를 주로 봤습니다.',
            ),
          ],
          result: [
            l(
              'Regressions in the reward logic are caught before release rather than by users, and the duplicate-payment case is locked down by both a test and a database constraint.',
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
              'Measured first: used the Chrome DevTools performance profiler and Lighthouse with mobile throttling to find the actual bottlenecks, looking at when the main content appears and when the page becomes usable.',
              '먼저 측정했습니다. Chrome DevTools 성능 프로파일러와 Lighthouse를 모바일 속도 제한 상태로 돌려서 실제 병목이 어디인지 찾았고, 주요 콘텐츠가 뜨는 시점과 페이지가 실제로 쓸 수 있게 되는 시점을 봤습니다.',
            ),
            l(
              'The biggest issue was that the ad SDK scripts were loaded synchronously at page load even though the ad wasn’t visible yet. Changed it to load the SDK only when the ad container gets close to the viewport, which alone cut more than a second off the initial load.',
              '가장 큰 문제는 광고 SDK 스크립트가 아직 광고가 보이지도 않는데 페이지 로드 시점에 동기로 로드되는 것이었습니다. 광고 영역이 화면에 가까워질 때만 SDK를 불러오도록 바꿨고, 이것만으로 초기 로딩이 1초 이상 줄었습니다.',
            ),
            l(
              'Removed unnecessary re-renders and repeated requests. For example, the reward status was being fetched again on every re-render, so I cached the result instead of asking the server the same thing repeatedly.',
              '불필요한 리렌더링과 반복 요청도 정리했습니다. 예를 들어 리워드 상태를 리렌더링마다 다시 요청하고 있어서, 결과를 캐싱해서 같은 요청을 반복하지 않게 했습니다.',
            ),
          ],
          result: [
            l(
              'Loading time dropped by about 40%, and the page feels noticeably more responsive on mobile.',
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
              'Coordinated directly with the design team while implementing the screens, checking details on real devices together instead of approximating the mockups and fixing differences later.',
              '화면을 구현하면서 디자인팀과 직접 소통했습니다. 목업을 대충 비슷하게 만들고 나중에 차이를 고치는 대신, 실제 기기에서 함께 세부를 확인하며 맞췄습니다.',
            ),
          ],
          result: [
            l('Mobile user traffic increased by 30% after the redesigned screens shipped.', '리디자인된 화면이 배포된 뒤 모바일 사용자 트래픽이 30% 증가했습니다.'),
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
      // ── EPOS ─────────────────────────────────────────────────
      {
        id: 'epos',
        title: l('Samsonite EPOS system for 500+ stores', '쌤소나이트 EPOS 시스템, 전국 500여 개 매장'),
        stack: ['Spring Boot', 'MSSQL', 'Batch'],
        detail: {
          context: [
            l(
              'Nexol System builds and runs the retail and logistics systems for Samsonite Korea, including the EPOS (point-of-sale) system used in 500+ stores and the warehouse management system. I developed and maintained both, on Spring Boot.',
              '넥솔시스템은 쌤소나이트 코리아의 리테일·물류 시스템을 개발하고 운영하는 회사입니다. 전국 500여 개 매장에서 쓰는 EPOS(판매 시점 관리)와 창고 관리 시스템이 여기 포함되고, 저는 둘 다 Spring Boot 기반으로 개발·운영했습니다.',
            ),
          ],
          did: [
            l(
              'On the maintenance side, the nightly closing batch was the critical piece. Every night the transactions from all 500 stores are aggregated and sent to headquarters, and when that failed, HQ had no sales report in the morning. A common cause was a store losing its network during the day, so its transactions arrived late or not at all.',
              '운영 쪽에서 가장 중요한 건 야간 마감 배치였습니다. 매일 밤 500개 매장의 거래를 모아서 본사로 보내는데, 이게 실패하면 본사는 아침에 매출 리포트를 볼 수 없습니다. 흔한 원인은 매장이 낮에 네트워크가 끊겨서 거래가 늦게 오거나 아예 안 오는 경우였습니다.',
            ),
            l(
              'Improved the retry and re-processing logic so late transactions are picked up automatically in the next run, instead of someone manually re-running the batch at 7 a.m.',
              '재시도와 재처리 로직을 고쳐서, 늦게 도착한 거래를 다음 실행에서 자동으로 반영하도록 했습니다. 누군가 아침 7시에 배치를 손으로 다시 돌리는 일이 없어졌습니다.',
            ),
            l(
              'On the development side, built the sales dashboard screens for headquarters. Those dashboard queries turned out to be the slow ones I later fixed in the performance work below.',
              '개발 쪽에서는 본사용 매출 대시보드 화면을 만들었습니다. 이 대시보드의 쿼리가 나중에 느려져서, 아래의 성능 개선 작업으로 이어졌습니다.',
            ),
          ],
          result: [
            l(
              'Headquarters got its morning sales report reliably, and the dashboard became the main way they looked at store performance.',
              '본사가 아침 매출 리포트를 안정적으로 받게 되었고, 대시보드는 본사가 매장 실적을 보는 기본 창구가 되었습니다.',
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
              'Visited the Samsonite logistics warehouses to see how the inbound and outbound scanning actually worked, rather than going by what the tickets said.',
              '티켓에 적힌 내용만 보지 않고, 쌤소나이트 물류창고에 직접 가서 입출고 스캔 작업이 실제로 어떻게 돌아가는지 봤습니다.',
            ),
          ],
          did: [
            l(
              'Found that for every item, a worker scanned the barcode, then searched for the product manually, found the matching row, and updated the quantity and status by hand. Several steps for something that should be one.',
              '작업자가 상품마다 바코드를 찍은 뒤, 상품을 직접 검색해서 해당 행을 찾고, 수량과 상태를 손으로 바꾸고 있었습니다. 한 번에 끝나야 할 일이 여러 단계로 쪼개져 있었습니다.',
            ),
            l(
              'Built a Node.js-based single-scan flow: once the barcode is scanned, the system identifies the product and updates the inventory record itself, so the worker only confirms when something doesn’t match.',
              'Node.js 기반의 싱글 스캔 흐름을 만들었습니다. 바코드를 찍으면 시스템이 상품을 알아서 찾아 재고 기록을 바로 갱신하고, 작업자는 뭔가 안 맞을 때만 확인하면 됩니다.',
            ),
          ],
          result: [
            l(
              'The number of manual steps per inbound and outbound operation dropped, and the change came from watching the work rather than from a feature request.',
              '입출고 작업마다 필요한 수작업 단계가 줄었습니다. 그리고 이 개선은 기능 요청이 아니라 현장에서 일하는 모습을 직접 본 데서 나왔습니다.',
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
              'The logistics system was a .NET application installed on each PDA device. Every update had to be distributed to every device, so shipping a fix was slow and production issues took a long time to resolve.',
              '물류 시스템은 PDA 기기마다 설치되는 .NET 애플리케이션이었습니다. 업데이트할 때마다 모든 기기에 배포해야 해서 수정 하나 내보내는 데 시간이 오래 걸렸고, 운영 이슈 대응도 느렸습니다.',
            ),
          ],
          did: [
            l(
              'Helped migrate it to a Node.js web application, split into services by area, that runs in the PDA browser. Updates are now deployed once on the server and every device gets the latest version the next time it opens the app.',
              'PDA 브라우저에서 동작하는 Node.js 웹 애플리케이션으로 옮기는 작업을 맡았고, 기능 영역별로 서비스를 나눴습니다. 이제 서버에 한 번 배포하면 모든 기기가 다음에 앱을 열 때 최신 버전을 쓰게 됩니다.',
            ),
            l(
              'Owned deployment and operations of the new system afterward.',
              '전환 이후 새 시스템의 배포와 운영을 직접 맡았습니다.',
            ),
          ],
          result: [
            l(
              'Rolling out bug fixes and responding to production issues became much faster, and application downtime decreased by 30%.',
              '버그 수정 배포와 운영 이슈 대응이 훨씬 빨라졌고, 애플리케이션 다운타임이 30% 줄었습니다.',
            ),
          ],
        },
      },

      // ── DB performance ───────────────────────────────────────
      {
        id: 'db-performance',
        title: l('Faster dashboard queries under heavy traffic, 20% lower response time', '트래픽이 몰릴 때의 대시보드 쿼리 개선, 응답 시간 20% 단축'),
        stack: ['MSSQL', 'Indexing', 'Caching'],
        detail: {
          context: [
            l(
              'The headquarters sales dashboard aggregated data across 500+ stores, and when many people opened it at once the queries slowed down noticeably.',
              '본사 매출 대시보드는 500여 개 매장의 데이터를 집계하는데, 여러 사람이 동시에 열면 쿼리가 눈에 띄게 느려졌습니다.',
            ),
          ],
          did: [
            l(
              'Added covering indexes for the queries the dashboard ran most, so they could be answered from the index without touching the full table.',
              '대시보드가 가장 자주 실행하는 쿼리에 커버링 인덱스를 추가해서, 테이블 전체를 읽지 않고 인덱스만으로 답할 수 있게 했습니다.',
            ),
            l(
              'Built pre-aggregated summary tables, filled ahead of time, so the dashboard reads totals that are already computed instead of summing raw transactions on every request.',
              '미리 집계해 둔 요약 테이블을 만들어서, 요청마다 원본 거래를 다 더하는 대신 이미 계산된 합계를 읽도록 했습니다.',
            ),
            l(
              'Cached results that rarely change so repeated requests didn’t hit the database again.',
              '자주 바뀌지 않는 결과는 캐싱해서 반복 요청이 DB까지 가지 않게 했습니다.',
            ),
          ],
          result: [
            l('Response times decreased by 20% and stayed stable when traffic peaked.', '응답 시간이 20% 줄었고, 트래픽이 몰릴 때도 안정적으로 유지되었습니다.'),
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
              'Before big promotions like Black Friday or Christmas, discount and sales logic changed often, and a small change in an API or a data format could quietly break something that used to work.',
              '블랙프라이데이나 크리스마스 같은 큰 프로모션 전에는 할인과 판매 로직이 자주 바뀌었고, API나 데이터 형식이 조금만 달라져도 잘 되던 기능이 조용히 깨질 수 있었습니다.',
            ),
          ],
          did: [
            l(
              'Built and ran a set of 10+ regression tests in Postman against the Spring Boot services, checking the JSON request and response of each API so that a renamed or missing field would be caught before release.',
              'Spring Boot 서비스를 대상으로 Postman 회귀 테스트 10개 이상을 만들어 실행했습니다. 각 API의 JSON 요청과 응답을 검증해서, 필드 이름이 바뀌거나 빠진 경우를 배포 전에 잡아냈습니다.',
            ),
            l(
              'Ran the set whenever business logic or an API changed, especially in the run-up to major campaigns.',
              '비즈니스 로직이나 API가 바뀔 때마다, 특히 큰 캠페인 직전에 이 테스트를 돌렸습니다.',
            ),
          ],
          result: [
            l(
              'Prevented field-level data mismatches from reaching production and kept 300K+ transactions a year processing correctly.',
              '필드 단위 데이터 불일치가 프로덕션까지 가는 것을 막고, 연 30만 건 이상의 거래가 정확하게 처리되도록 했습니다.',
            ),
          ],
        },
      },
    ],
  },
]
