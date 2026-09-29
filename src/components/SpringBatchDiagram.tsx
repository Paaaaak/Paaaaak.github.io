/** 넥솔 판매 데이터 파이프라인 전용 아키텍처 그림 (Spring Batch 구조) */

type BoxProps = {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string[]
  tone?: 'plain' | 'accent' | 'frame'
}

function Box({ x, y, w, h, label, sub = [], tone = 'plain' }: BoxProps) {
  const cls = tone === 'accent' ? 'flow__node flow__node--accent' : tone === 'frame' ? 'flow__node sb__frame' : 'flow__node'
  const lines = sub.length
  const labelY = y + h / 2 + (lines ? -lines * 6 + 1 : 5)
  return (
    <g className={cls}>
      <rect x={x} y={y} width={w} height={h} rx="10" />
      <text x={x + w / 2} y={labelY} textAnchor="middle" className="flow__label">
        {label}
      </text>
      {sub.map((s, i) => (
        <text key={i} x={x + w / 2} y={labelY + 15 + i * 12} textAnchor="middle" className="flow__sub">
          {s}
        </text>
      ))}
    </g>
  )
}

const Arrow = ({ d, cls = '' }: { d: string; cls?: string }) => (
  <path d={d} className={`flow__edge ${cls}`} markerEnd={cls.includes('accent') ? 'url(#sb-arrow-accent)' : cls.includes('bad') ? 'url(#sb-arrow-bad)' : 'url(#sb-arrow)'} />
)

export default function SpringBatchDiagram() {
  return (
    <svg className="flow" viewBox="0 0 760 772" role="img" aria-label="Spring Batch pipeline architecture">
      <defs>
        <marker id="sb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="flow__arrowhead" />
        </marker>
        <marker id="sb-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="flow__arrowhead flow__arrowhead--accent" />
        </marker>
        <marker id="sb-arrow-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="sb__arrowhead-bad" />
        </marker>
      </defs>

      {/* ── Job 레벨 ───────────────────────────────── */}
      <Box x={305} y={12} w={150} h={44} label="JobLauncher" sub={['nightly schedule']} />
      <Arrow d="M 380 56 L 380 92" />
      <Box x={290} y={92} w={180} h={48} label="Nightly Sales Job" tone="accent" />
      <Box x={580} y={92} w={150} h={48} label="JobRepository" sub={['run metadata']} />
      <path d="M 470 116 L 580 116" className="flow__edge flow__edge--accent" markerStart="url(#sb-arrow-accent)" markerEnd="url(#sb-arrow-accent)" />
      <text x={525} y={108} textAnchor="middle" className="flow__edge-label flow__edge-label--accent">metadata</text>

      {/* Job → 3 steps */}
      <path d="M 380 140 L 380 160 L 110 160 L 110 180" className="flow__edge" markerEnd="url(#sb-arrow)" />
      <path d="M 380 140 L 380 180" className="flow__edge" markerEnd="url(#sb-arrow)" />
      <path d="M 380 160 L 650 160 L 650 180" className="flow__edge" markerEnd="url(#sb-arrow)" />

      {/* ── Step 1 ─────────────────────────────────── */}
      <Box x={25} y={180} w={170} h={52} label="Step 1" sub={['product master sync']} tone="accent" />
      <Arrow d="M 110 232 L 110 262" />
      <Box x={25} y={262} w={170} h={44} label="ERP API / DB" />
      <Arrow d="M 110 306 L 110 336" />
      <Box x={25} y={336} w={170} h={44} label="Local master table" sub={['SKU · price · category']} tone="accent" />

      {/* ── Step 2 ─────────────────────────────────── */}
      <Box x={295} y={180} w={170} h={52} label="Step 2" sub={['store transactions']} tone="accent" />
      <Arrow d="M 380 232 L 380 262" />
      <Box x={295} y={262} w={170} h={44} label="Manager Step" tone="accent" />
      <Arrow d="M 380 306 L 380 336" />
      <Box x={295} y={336} w={170} h={44} label="Partitioner" sub={['one partition per file']} tone="accent" />

      {/* ── Step 3 ─────────────────────────────────── */}
      <Box x={565} y={180} w={170} h={52} label="Step 3" sub={['aggregation']} tone="accent" />
      <Arrow d="M 650 232 L 650 262" />
      <Box x={565} y={262} w={170} h={44} label="Raw sales" sub={['loaded in step 2']} />
      <Arrow d="M 650 306 L 650 336" />
      <Box x={565} y={336} w={170} h={44} label="Summary tables" sub={['daily · store · category']} tone="accent" />

      {/* Partitioner → stores */}
      <path d="M 380 380 L 380 402 L 250 402 L 250 420" className="flow__edge" markerEnd="url(#sb-arrow)" />
      <path d="M 380 380 L 380 420" className="flow__edge" markerEnd="url(#sb-arrow)" />
      <path d="M 380 402 L 580 402 L 580 420" className="flow__edge" markerEnd="url(#sb-arrow)" />
      <Box x={195} y={420} w={110} h={40} label="Store 1" tone="accent" />
      <Box x={325} y={420} w={110} h={40} label="Store 2" />
      <text x={480} y={446} textAnchor="middle" className="flow__ellipsis">⋯</text>
      <Box x={525} y={420} w={110} h={40} label="Store 500" />

      {/* ── Worker Step (Store 1 기준) ─────────────── */}
      <rect x={15} y={486} width={730} height={274} rx="14" className="sb__container" />
      <text x={730} y={506} textAnchor="end" className="flow__row-title">Worker step · one per store</text>
      <Arrow d="M 250 460 L 250 516" />

      <Box x={150} y={516} w={200} h={48} label="ExecutionContext" sub={['fileName = store_001.csv']} />
      <line x1={350} y1={540} x2={410} y2={540} className="sb__link" />
      <Box x={410} y={516} w={200} h={48} label="StepExecution" sub={['read · write · skip counts']} />
      {/* 커밋마다 JobRepository에 저장 */}
      <path d="M 610 540 L 752 540 L 752 116 L 730 116" className="flow__edge flow__edge--accent" markerEnd="url(#sb-arrow-accent)" />
      <text x={681} y={532} textAnchor="middle" className="flow__edge-label flow__edge-label--accent">saved each commit</text>

      {/* ExecutionContext → Reader */}
      <path d="M 250 564 L 250 584 L 110 584 L 110 604" className="flow__edge" markerEnd="url(#sb-arrow)" />

      <Box x={35} y={604} w={150} h={56} label="FlatFileItemReader" sub={['1 CSV line = 1 item']} tone="accent" />
      <Arrow d="M 185 632 L 215 632" />
      <Box x={215} y={604} w={150} h={56} label="ItemProcessor" sub={['validation', 'master · refund lookup']} tone="accent" />
      <Arrow d="M 365 632 L 395 632" />
      <Box x={395} y={604} w={172} h={56} label="JdbcBatchItemWriter" sub={['chunk = 500']} tone="accent" />
      <Arrow d="M 567 632 L 592 632" />
      <Box x={592} y={604} w={133} h={56} label="MSSQL" sub={['raw sales']} />

      {/* COMMIT */}
      <Arrow d="M 481 660 L 481 688" />
      <rect x={35} y={688} width={690} height={22} rx="6" className="sb__band" />
      <text x={380} y={703} textAnchor="middle" className="sb__band-text">COMMIT · chunk inserts + ExecutionContext in one transaction</text>

      {/* 실패 → rollback → restart */}
      <path d="M 35 699 L 22 699 L 22 632 L 35 632" className="flow__edge flow__edge--bad" markerEnd="url(#sb-arrow-bad)" />
      <text x={380} y={738} textAnchor="middle" className="sb__fail-text">failure → chunk rolls back → restart resumes from the last committed ExecutionContext</text>
    </svg>
  )
}
