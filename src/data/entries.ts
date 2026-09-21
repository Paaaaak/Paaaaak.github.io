import { l, type L } from '../i18n'

export type Story = {
  id: string
  title: L
  /** 대응하는 JD 요구사항 (JD 원문 용어) */
  jd: L[]
  context: L
  did: L[]
  result?: L
  stack: string[]
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
  // ───────────────────────────────────────────────────────────
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
      l('Tool-calling Agents', 'Tool-calling 에이전트'),
      l('Write-back to CI/CD', 'CI/CD Write-back'),
      l('Retrieval & Embedding Pipelines', '검색 & 임베딩 파이프라인'),
    ],
    summary: l(
      'Shipped LLM tooling into a production e-commerce engineering org — an agent that acts on every PR through tool calls, and a retrieval layer behind the recommendation platform.',
      '실제 이커머스 엔지니어링 조직의 프로덕션에 LLM 도구를 출시했습니다 — tool call로 모든 PR에 직접 액션하는 에이전트, 그리고 추천 플랫폼 뒤의 검색 레이어.',
    ),
    stories: [
      {
        id: 'code-review-agent',
        title: l('A code review agent that acts — not just answers', '답만 하지 않고 직접 액션하는 코드 리뷰 에이전트'),
        jd: [l('Agents that act via tool-calling', 'tool-calling으로 액션하는 에이전트'), l('Prompt & context engineering', '프롬프트 & 컨텍스트 엔지니어링'), l('Write back to real systems', '실제 시스템에 write-back')],
        context: l(
          'Reviewers were spending their time on repetitive first-pass checks — style, obvious bugs, missing tests — before substantive review could start. A chatbot that summarizes a diff would not have changed that; the findings had to land inside the PR itself.',
          '리뷰어들이 본격적인 리뷰 전에 스타일, 명백한 버그, 누락된 테스트 같은 반복적인 1차 점검에 시간을 쓰고 있었습니다. diff를 요약해 주는 챗봇으로는 달라질 게 없었고, 지적 사항이 PR 안에 직접 들어가야 했습니다.',
        ),
        did: [
          l(
            'Designed an agent that runs inside Azure DevOps pipelines: it pulls the PR diff, assembles repo-specific context (conventions, touched modules, PR metadata) into the prompt, and asks Claude for structured findings.',
            'Azure DevOps 파이프라인 안에서 도는 에이전트를 설계했습니다. PR diff를 가져오고, 저장소 컨벤션·변경된 모듈·PR 메타데이터 같은 저장소별 컨텍스트를 프롬프트에 조립한 뒤 Claude에 구조화된 지적을 요청합니다.',
          ),
          l(
            'Gave the agent tools to write back: it posts inline comments on the exact changed lines and a PR-level summary through the Azure DevOps API, so the output is an action in the system reviewers already use.',
            '에이전트에 write-back 도구를 붙였습니다. Azure DevOps API를 통해 변경된 라인에 인라인 코멘트를, PR 단위에 요약을 직접 남겨서 결과물이 리뷰어가 이미 쓰는 시스템 안의 액션이 되게 했습니다.',
          ),
          l(
            'Chunked large diffs to stay within context limits without losing cross-file references, and structured the output schema so every finding carries a severity and a concrete suggestion.',
            '큰 diff는 파일 간 참조를 잃지 않도록 청킹해 컨텍스트 한도 안에 맞추고, 모든 지적이 심각도와 구체적인 수정 제안을 갖도록 출력 스키마를 구조화했습니다.',
          ),
        ],
        result: l(
          'The repetitive first pass of code review runs automatically on every PR, and reviewers start from a PR that already has findings pinned to the lines that matter.',
          '모든 PR에서 반복적인 1차 리뷰가 자동으로 돌고, 리뷰어는 중요한 라인에 이미 지적이 달린 PR에서 시작합니다.',
        ),
        stack: ['Claude API', 'Azure DevOps Pipelines & REST API', 'TypeScript'],
      },
      {
        id: 'eval-guardrails',
        title: l('Evaluation and guardrail tuning for the agent', '에이전트 평가와 가드레일 튜닝'),
        jd: [l('Evaluation', '평가'), l('Guardrail tuning', '가드레일 튜닝'), l('Fast validation loops with users', '사용자와의 빠른 검증 루프')],
        context: l(
          'An agent that comments on code is only useful if engineers trust it. Noisy or wrong findings get muted within a week.',
          '코드에 코멘트를 다는 에이전트는 엔지니어가 신뢰해야만 쓸모가 있습니다. 시끄럽거나 틀린 지적은 일주일 안에 무시당합니다.',
        ),
        did: [
          l(
            'Ran the agent against real PRs and reviewed its findings with the engineers who owned the code, treating each round as an evaluation set: which findings were accepted, dismissed, or wrong.',
            '실제 PR에 에이전트를 돌리고 그 코드를 담당하는 엔지니어들과 지적 사항을 함께 검토했습니다. 매 라운드를 평가 세트처럼 다뤄서 어떤 지적이 수용됐고, 무시됐고, 틀렸는지 기록했습니다.',
          ),
          l(
            'Tuned guardrails from that feedback: severity thresholds for what gets posted inline vs. summarized, categories the agent should stay out of, and prompt changes that cut false positives.',
            '그 피드백으로 가드레일을 조정했습니다. 인라인으로 남길지 요약에만 넣을지 가르는 심각도 기준, 에이전트가 건드리지 않아야 할 카테고리, 오탐을 줄이는 프롬프트 변경 등입니다.',
          ),
        ],
        result: l(
          'Findings became precise enough that the team kept the agent on by default instead of muting it.',
          '지적의 정확도가 올라가 팀이 에이전트를 끄지 않고 기본으로 켜 두게 됐습니다.',
        ),
        stack: ['Claude API', 'Prompt design', 'Review feedback loop'],
      },
      {
        id: 'vector-search',
        title: l('Retrieval pipeline behind the recommendation platform', '추천 플랫폼 뒤의 검색 파이프라인'),
        jd: [l('Vector indexes & retrieval sources', '벡터 인덱스 & 검색 소스'), l('Data pipelines', '데이터 파이프라인'), l('Prepare data for AI consumption', 'AI 소비용 데이터 준비')],
        context: l(
          'The production recommendation platform relied on a legacy SAR model that couldn’t surface semantically similar products, and its retraining was a manual step.',
          '프로덕션 추천 플랫폼이 의미적으로 유사한 상품을 찾지 못하는 레거시 SAR 모델에 의존했고, 그 재학습은 수동 작업이었습니다.',
        ),
        did: [
          l(
            'Built a vector-based recommendation service on Azure AI Search: designed the index schema and the embedding pipeline that turns product data into a retrieval source.',
            'Azure AI Search 위에 벡터 기반 추천 서비스를 만들었습니다. 상품 데이터를 검색 소스로 바꾸는 인덱스 스키마와 임베딩 파이프라인을 설계했습니다.',
          ),
          l(
            'Made the pipeline self-maintaining: new products are embedded and indexed with no manual steps, so the retrieval layer stays in sync with the catalog.',
            '파이프라인을 스스로 유지되게 만들었습니다. 새 상품은 수동 작업 없이 임베딩·인덱싱되어 검색 레이어가 카탈로그와 항상 동기화됩니다.',
          ),
          l(
            'Automated retraining of the legacy SAR model through Azure Functions so both recommendation paths stay fresh.',
            'Azure Functions로 레거시 SAR 모델 재학습을 자동화해 두 추천 경로 모두 최신 상태를 유지하게 했습니다.',
          ),
        ],
        result: l(
          'The recommendation stack gained a retrieval layer that can also serve as a grounding source for future LLM features.',
          '추천 스택에 향후 LLM 기능의 근거 소스로도 쓸 수 있는 검색 레이어가 생겼습니다.',
        ),
        stack: ['Azure AI Search', 'Embeddings', 'Azure Functions', 'Python'],
      },
      {
        id: 'ai-driven-dev',
        title: l('AI-driven development as the default workflow', '기본 워크플로우로서의 AI 주도 개발'),
        jd: [l('AI coding agents / harnesses for production-grade development', '프로덕션 개발용 AI 코딩 에이전트 / 하네스'), l('Bias for shipping', '출시 우선')],
        context: l(
          'The job is to orchestrate specialist AI agents through a gated lifecycle rather than hand-write every line. That is already how I work.',
          '이 역할은 모든 코드를 손으로 쓰는 대신, 게이트가 있는 라이프사이클 안에서 전문 AI 에이전트들을 지휘하는 일입니다. 저는 이미 그렇게 일합니다.',
        ),
        did: [
          l(
            'Use Claude Code daily for scaffolding, refactors, test generation, and exploration of unfamiliar codebases — this portfolio was built that way end to end.',
            '스캐폴딩, 리팩토링, 테스트 생성, 낯선 코드베이스 탐색에 Claude Code를 매일 사용합니다 — 이 포트폴리오도 처음부터 끝까지 그렇게 만들었습니다.',
          ),
          l(
            'Keep a human gate on every step: agent output goes through the same review I would give a teammate’s PR before it merges.',
            '모든 단계에 사람의 게이트를 둡니다. 에이전트의 결과물은 동료의 PR을 리뷰하듯 검토한 뒤에만 머지합니다.',
          ),
          l(
            'Built one of those gates myself — the CI/CD review agent above is the automated first pass in that lifecycle.',
            '그 게이트 중 하나를 직접 만들었습니다 — 위의 CI/CD 리뷰 에이전트가 그 라이프사이클의 자동화된 1차 검토입니다.',
          ),
        ],
        stack: ['Claude Code', 'Claude API', 'Git'],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
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

  // ───────────────────────────────────────────────────────────
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
      l('Full-stack (React + Spring)', '풀스택 (React + Spring)'),
      l('Weekly Shipping at 10M Scale', '1,000만 규모 주간 출시'),
      l('Cross-functional Communication', '크로스펑셔널 커뮤니케이션'),
    ],
    summary: l(
      'Shipped weekly to OK Cashbag — a mobile web app serving 10M+ users in Korea — across the React frontend and Spring backend, and owned the integrations and conversations around it.',
      '한국 1,000만+ 사용자의 OK캐쉬백 모바일 웹에 React 프론트엔드와 Spring 백엔드를 넘나들며 매주 출시했고, 그 주변의 연동과 협업을 담당했습니다.',
    ),
    stories: [
      {
        id: 'ok-cashbag',
        title: l('Weekly releases to 10M+ users', '1,000만+ 사용자에게 매주 출시'),
        jd: [l('Full-stack ability (TypeScript/React or similar)', '풀스택 역량 (React 등)'), l('Weekly iterations', '주간 이터레이션'), l('Bias for shipping', '출시 우선')],
        context: l(
          'OK Cashbag is one of Korea’s largest loyalty apps. Every change ships to millions of users, so the team runs on short cycles: build, validate, release, repeat.',
          'OK캐쉬백은 한국 최대 규모의 멤버십 앱 중 하나입니다. 모든 변경이 수백만 사용자에게 배포되기 때문에 팀은 짧은 주기로 돕니다 — 만들고, 검증하고, 출시하고, 반복.',
        ),
        did: [
          l(
            'Delivered features end to end across the React frontend and Spring backend on a weekly release cadence.',
            'React 프론트엔드와 Spring 백엔드에 걸쳐 기능을 처음부터 끝까지 매주 출시 주기로 딜리버리했습니다.',
          ),
          l(
            'Protected that cadence with JUnit unit and integration tests on the business logic that could not regress, and with code reviews across the team.',
            '회귀가 허용되지 않는 비즈니스 로직에 JUnit 단위·통합 테스트를 두고 팀 전체 코드 리뷰를 진행해 그 출시 리듬을 지켰습니다.',
          ),
          l(
            'Profiled render paths and optimized heavy components with deliberate React lifecycle usage.',
            '렌더 경로를 프로파일링하고 React 라이프사이클을 의도적으로 활용해 무거운 컴포넌트를 최적화했습니다.',
          ),
        ],
        result: l(
          'Up to 40% faster loading time, shipped without slowing the weekly release rhythm.',
          '주간 출시 리듬을 늦추지 않고 로딩 시간을 최대 40% 단축했습니다.',
        ),
        stack: ['React', 'Spring', 'Java', 'JUnit'],
      },
      {
        id: 'ad-integration',
        title: l('Integrating external ad systems under hard constraints', '까다로운 제약 아래 외부 광고 시스템 연동'),
        jd: [l('Connect external source systems', '외부 소스 시스템 연동'), l('Make scoping calls', '스코핑 판단'), l('Defend technical decisions to non-engineers', '비엔지니어에게 기술 결정 설득')],
        context: l(
          'Ad revenue depended on third-party partners, each with its own SDK, format, and timing rules — skippable 30-second video, banners, interstitials — and product managers who wanted every placement possible.',
          '광고 수익은 서드파티 파트너에 달려 있었고, 각각 SDK·포맷·타이밍 규칙이 달랐습니다 — 스킵 가능 30초 영상, 배너, 전면 광고 — 그리고 가능한 모든 지면을 원하는 기획자들이 있었습니다.',
        ),
        did: [
          l(
            'Integrated the partner APIs and handled the timing edge cases so an ad never broke the user flow or the reward logic behind it.',
            '파트너 API를 연동하고 타이밍 엣지 케이스를 처리해 광고가 사용자 흐름이나 그 뒤의 리워드 로직을 깨뜨리지 않게 했습니다.',
          ),
          l(
            'Made the scoping calls with product and partner teams: which formats were worth the complexity, where a placement would hurt retention, and why — explained in their terms, not ours.',
            '기획·파트너 팀과 스코핑을 결정했습니다. 어떤 포맷이 복잡도를 감수할 가치가 있는지, 어느 지면이 리텐션을 해칠지, 왜 그런지 — 우리 말이 아니라 그들의 언어로 설명했습니다.',
          ),
        ],
        result: l(
          'Multiple ad formats live in production with seamless timing, and integration decisions the business side understood and backed.',
          '여러 광고 포맷이 매끄러운 타이밍으로 프로덕션에 올라갔고, 비즈니스 쪽이 이해하고 지지한 연동 결정이 됐습니다.',
        ),
        stack: ['JavaScript', 'Ad SDKs', 'REST APIs'],
      },
      {
        id: 'design-collab',
        title: l('Being the engineer the design team could talk to', '디자인팀이 대화할 수 있는 엔지니어'),
        jd: [l('Excellent communication', '뛰어난 커뮤니케이션'), l('Face of the team', '팀의 얼굴'), l('Fast validation loops with business users', '비즈니스 사용자와의 빠른 검증 루프')],
        context: l(
          'UX changes only pay off when design and engineering ship the same thing. Handoffs were where that broke.',
          'UX 개선은 디자인과 엔지니어링이 같은 것을 만들 때만 효과가 납니다. 그게 깨지는 지점이 핸드오프였습니다.',
        ),
        did: [
          l(
            'Worked directly with the design team through each iteration: translated design intent into implementation trade-offs, and brought engineering constraints back early instead of at review.',
            '매 이터레이션마다 디자인팀과 직접 일했습니다. 디자인 의도를 구현 트레이드오프로 번역하고, 엔지니어링 제약은 리뷰 때가 아니라 초기에 가져갔습니다.',
          ),
          l(
            'Validated the results with real usage data after each release rather than at the end of a project.',
            '프로젝트 끝이 아니라 매 출시 후 실제 사용 데이터로 결과를 검증했습니다.',
          ),
        ],
        result: l('30% increase in mobile user traffic after the UX/UI work shipped.', 'UX/UI 작업 출시 후 모바일 사용자 트래픽 30% 증가.'),
        stack: ['React', 'Figma handoff', 'Usage analytics'],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
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
      l('Forward-Deployed', 'Forward-Deployed'),
      l('Legacy Migration → Production', '레거시 마이그레이션 → 프로덕션'),
      l('Data Quality at Scale', '대규모 데이터 품질'),
    ],
    summary: l(
      'Owned the Samsonite EPOS and logistics systems for 500+ stores — went to the warehouses to find the workflow that actually hurt, shipped the fix into live operations, and kept the data underneath it fast and correct.',
      '쌤소나이트 500여 개 매장의 EPOS와 물류 시스템을 책임졌습니다 — 창고에 직접 가서 진짜 아픈 워크플로우를 찾고, 운영 중인 현장에 해결책을 출시하고, 그 아래의 데이터를 빠르고 정확하게 유지했습니다.',
    ),
    stories: [
      {
        id: 'onsite-discovery',
        title: l('Embedded on the warehouse floor → single-scan automation', '창고 현장에 들어가서 → 싱글 스캔 자동화'),
        jd: [l('Embed on-site with customer teams', '고객 팀과 현장 밀착'), l('Map their most painful workflows', '가장 고통스러운 워크플로우 파악'), l('Extract requirements from real users', '실사용자로부터 요구사항 도출'), l('Ship something real in days, not months', '몇 달이 아니라 며칠 안에 출시')],
        context: l(
          'Samsonite’s in/outbound logistics ran on multi-step PDA scanning. Warehouse staff found it slow and error-prone, but that pain never showed up in a ticket — from the office, the system looked fine.',
          '쌤소나이트의 입출고 물류는 여러 단계의 PDA 스캔으로 돌아갔습니다. 현장 직원들은 느리고 실수가 잦다고 느꼈지만 그 불편은 티켓으로는 올라오지 않았습니다 — 사무실에서 보면 시스템은 멀쩡했습니다.',
        ),
        did: [
          l(
            'Went to the logistics warehouses, shadowed operators through real inbound and outbound shifts, and mapped the scanning workflow step by step — where scans were repeated, where confirmations were manual, where errors actually entered.',
            '물류창고에 직접 가서 실제 입고·출고 근무를 작업자 옆에서 따라다니며 스캔 워크플로우를 단계별로 정리했습니다 — 어디서 스캔이 반복되고, 어디서 확인이 수동이고, 오류가 실제로 어디서 들어오는지.',
          ),
          l(
            'Turned that map into a scoped requirement the staff agreed with, then designed a Node-based single-scan flow that collapsed the redundant steps.',
            '그 지도를 현장 직원들이 동의하는 범위의 요구사항으로 만들고, 중복 단계를 하나로 접는 Node 기반 싱글 스캔 흐름을 설계했습니다.',
          ),
          l(
            'Shipped it straight into the live warehouse operation and iterated with the operators on the floor until it fit how they actually worked.',
            '운영 중인 창고에 바로 적용하고, 실제 작업 방식에 맞을 때까지 현장 작업자들과 함께 개선을 반복했습니다.',
          ),
        ],
        result: l(
          'In/outbound scanning collapsed to a single scan, streamlining daily operations — a fix that would never have been found from a requirements document.',
          '입출고 스캔이 싱글 스캔으로 줄어 일상 운영이 간소화됐습니다 — 요구사항 문서로는 절대 찾지 못했을 해결책이었습니다.',
        ),
        stack: ['Node.js', 'PDA / barcode integration', 'MSSQL'],
      },
      {
        id: 'legacy-migration',
        title: l('Migrating a PDA .NET system to Node.js microservices — and running it', 'PDA .NET 시스템을 Node.js 마이크로서비스로 마이그레이션 — 그리고 운영'),
        jd: [l('Migrations & legacy replacements', '마이그레이션 & 레거시 대체'), l('Harden and deploy to production', '프로덕션으로 강화 및 배포'), l('Own deployment and operations', '배포와 운영 오너십')],
        context: l(
          'The PDA-based .NET logistics system was hard to change and went down too often — every outage stopped a warehouse.',
          'PDA 기반 .NET 물류 시스템은 변경이 어렵고 장애가 잦았습니다 — 장애가 날 때마다 창고 하나가 멈췄습니다.',
        ),
        did: [
          l(
            'Re-architected it as a Node.js web application with a microservices structure, migrating the live logistics flows without stopping operations.',
            '운영을 멈추지 않고 실제 물류 흐름을 옮기면서 Node.js 웹 애플리케이션과 마이크로서비스 구조로 재설계했습니다.',
          ),
          l(
            'Owned the deployment and the operations after cutover — monitoring, incidents, and the hardening that followed each one.',
            '전환 이후 배포와 운영을 직접 책임졌습니다 — 모니터링, 장애 대응, 그리고 장애마다 뒤따른 강화 작업까지.',
          ),
        ],
        result: l('Application downtime down 30%.', '애플리케이션 다운타임 30% 감소.'),
        stack: ['Node.js', 'Microservices', '.NET (legacy)', 'Deployment & ops'],
      },
      {
        id: 'data-quality',
        title: l('Keeping the data under 500+ stores fast and correct', '500여 개 매장 아래의 데이터를 빠르고 정확하게'),
        jd: [l('Data pipelines with quality', '품질을 갖춘 데이터 파이프라인'), l('SQL & data modeling', 'SQL & 데이터 모델링'), l('Production systems end to end', '프로덕션 시스템 end to end')],
        context: l(
          'The Spring Boot EPOS system served every Samsonite store in Korea. Reporting queries slowed at peak, and field-level mismatches between microservices could silently corrupt transactions.',
          'Spring Boot EPOS 시스템은 한국의 모든 쌤소나이트 매장을 서비스했습니다. 리포팅 쿼리는 피크 때 느려졌고, 마이크로서비스 간 필드 단위 불일치가 트랜잭션을 조용히 오염시킬 수 있었습니다.',
        ),
        did: [
          l(
            'Applied covering indexes, pre-aggregation tables, and caching to the hottest query paths.',
            '가장 빈번한 쿼리 경로에 커버링 인덱스, 사전 집계 테이블, 캐싱을 적용했습니다.',
          ),
          l(
            'Built 10+ regression tests in Postman that validate JSON request/response payloads across the Spring Boot services, catching schema drift before it reached production.',
            'Spring Boot 서비스 간 JSON 요청/응답 페이로드를 검증하는 10개 이상의 회귀 테스트를 Postman으로 구축해 스키마 드리프트를 프로덕션 전에 잡았습니다.',
          ),
          l(
            'Maintained and extended the EPOS system itself, working directly with store and logistics stakeholders on what to build next.',
            'EPOS 시스템 자체를 운영·확장하면서 매장 및 물류 담당자들과 직접 다음 작업을 정했습니다.',
          ),
        ],
        result: l(
          'Response times down 20% at peak, and accurate processing for 300K+ transactions a year.',
          '피크 응답 시간 20% 단축, 연 30만 건 이상의 트랜잭션을 정확하게 처리.',
        ),
        stack: ['Spring Boot', 'MSSQL', 'Postman', 'Indexing & caching'],
      },
      {
        id: 'enterprise-retail',
        title: l('Enterprise retail & supply chain, in production', '프로덕션의 엔터프라이즈 리테일 & 공급망'),
        jd: [l('Enterprise domain exposure: supply chain, e-commerce', '엔터프라이즈 도메인 경험: 공급망, 이커머스'), l('Korean-speaking stakeholders', '한국어 이해관계자')],
        context: l(
          'Point-of-sale and logistics for a national retail network — the systems a store cannot sell without.',
          '전국 리테일 네트워크의 POS와 물류 — 없으면 매장이 판매를 못 하는 시스템입니다.',
        ),
        did: [
          l('Worked daily with Korean store, warehouse, and logistics stakeholders in their language and on their terms.', '한국의 매장·창고·물류 이해관계자들과 그들의 언어와 방식으로 매일 일했습니다.'),
          l('Learned the retail domain from the inside: inventory movement, store operations, and what breaks at month-end.', '재고 이동, 매장 운영, 월말에 무엇이 깨지는지 — 리테일 도메인을 안에서부터 익혔습니다.'),
        ],
        stack: ['EPOS', 'Retail logistics', '🇰🇷 Korean / 🇺🇸 English'],
      },
    ],
  },
]
