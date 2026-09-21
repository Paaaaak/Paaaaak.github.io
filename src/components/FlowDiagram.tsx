import { useLang, type L } from '../i18n'

export type FlowNode = {
  id: string
  label: L
  /** 박스 아래 작은 부제 (한 줄) */
  sub?: L
  /** 회사 색으로 강조 (내가 만든 부분) */
  accent?: boolean
  /** 'bad' = 장애/비정상 노드 (빨간 점선) */
  tone?: 'ok' | 'bad'
}

export type FlowDiagramSpec = {
  /** 행(row) 단위로 노드를 배치. 행 안은 왼→오, 행 사이는 마지막 → 다음 행 첫 노드로 연결 */
  rows: FlowNode[][]
  /** 행 사이 연결선 라벨 (index = 행 번호) */
  rowLinks?: (L | undefined)[]
  /** 되돌아가는 화살표 (예: write-back → PR) */
  loop?: { from: string; to: string; label: L }
  /** 행 왼쪽에 붙는 제목 (예: Before / After) */
  rowTitles?: L[]
  /** false면 행 사이를 연결하지 않음 (Before/After 비교용) */
  linkRows?: boolean
  /** true면 행의 마지막 노드에서 다음 행의 모든 노드로 분기 (팬아웃) */
  fanOut?: boolean
}

const NODE_W = 186
const NODE_H = 58
const GAP_X = 52
const ROW_H = 118
const PAD = 16
const LOOP_MARGIN = 34
const TITLE_W = 74

export default function FlowDiagram({ spec }: { spec: FlowDiagramSpec }) {
  const { t } = useLang()
  const cols = Math.max(...spec.rows.map((r) => r.length))
  const leftPad = (spec.loop ? LOOP_MARGIN : 0) + (spec.rowTitles ? TITLE_W : 0)
  const width = PAD * 2 + cols * NODE_W + (cols - 1) * GAP_X + leftPad
  const height = PAD * 2 + spec.rows.length * NODE_H + (spec.rows.length - 1) * (ROW_H - NODE_H) + (spec.loop ? 34 : 0)

  // 위치 계산
  const pos = new Map<string, { x: number; y: number }>()
  spec.rows.forEach((row, ri) => {
    const rowWidth = row.length * NODE_W + (row.length - 1) * GAP_X
    const startX = PAD + leftPad + (width - PAD * 2 - leftPad - rowWidth) / 2
    row.forEach((n, ci) => {
      pos.set(n.id, { x: startX + ci * (NODE_W + GAP_X), y: PAD + ri * ROW_H })
    })
  })

  const arrows: { d: string; label?: L; lx?: number; ly?: number; bad?: boolean }[] = []
  spec.rows.forEach((row, ri) => {
    // 행 안 연결
    for (let i = 0; i < row.length - 1; i++) {
      const a = pos.get(row[i].id)!
      const b = pos.get(row[i + 1].id)!
      arrows.push({ d: `M ${a.x + NODE_W} ${a.y + NODE_H / 2} L ${b.x} ${b.y + NODE_H / 2}` })
    }
    // 다음 행으로
    const next = spec.rows[ri + 1]
    if (next && spec.linkRows !== false && spec.fanOut) {
      const a = pos.get(row[row.length - 1].id)!
      const ax = a.x + NODE_W / 2
      const ay = a.y + NODE_H
      const midY = ay + (next[0] ? (pos.get(next[0].id)!.y - ay) / 2 : 30)
      next.forEach((n, i) => {
        const b = pos.get(n.id)!
        const bx = b.x + NODE_W / 2
        arrows.push({
          d: `M ${ax} ${ay} L ${ax} ${midY} L ${bx} ${midY} L ${bx} ${b.y}`,
          label: i === Math.floor(next.length / 2) ? spec.rowLinks?.[ri] : undefined,
          lx: ax,
          ly: midY - 8,
          bad: n.tone === 'bad',
        })
      })
    } else if (next && spec.linkRows !== false) {
      const a = pos.get(row[row.length - 1].id)!
      const b = pos.get(next[0].id)!
      const ax = a.x + NODE_W / 2
      const ay = a.y + NODE_H
      const bx = b.x + NODE_W / 2
      const by = b.y
      const midY = ay + (by - ay) / 2
      arrows.push({
        d: `M ${ax} ${ay} L ${ax} ${midY} L ${bx} ${midY} L ${bx} ${by}`,
        label: spec.rowLinks?.[ri],
        lx: (ax + bx) / 2,
        ly: midY - 8,
      })
    }
  })

  let loopPath: { d: string; lx: number; ly: number } | null = null
  if (spec.loop) {
    const a = pos.get(spec.loop.from)!
    const b = pos.get(spec.loop.to)!
    // 마지막 박스 아래로 → 맨 아래 → 왼쪽 가장자리 → 위로 → 대상 박스 왼쪽 옆으로 진입 (다른 박스를 관통하지 않음)
    const ax = a.x + NODE_W / 2
    const ay = a.y + NODE_H
    const yLow = height - PAD - 6
    const xLeft = PAD + 6
    const by = b.y + NODE_H / 2
    const bx = b.x
    loopPath = { d: `M ${ax} ${ay} L ${ax} ${yLow} L ${xLeft} ${yLow} L ${xLeft} ${by} L ${bx} ${by}`, lx: (ax + xLeft) / 2, ly: yLow - 8 }
  }

  return (
    <svg className="flow" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Architecture diagram">
      <defs>
        <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="flow__arrowhead" />
        </marker>
        <marker id="flow-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="flow__arrowhead flow__arrowhead--accent" />
        </marker>
      </defs>

      {arrows.map((a, i) => (
        <g key={i}>
          <path d={a.d} className={`flow__edge ${a.bad ? 'flow__edge--bad' : ''}`} markerEnd="url(#flow-arrow)" />
          {a.label && a.lx !== undefined && (
            <text x={a.lx} y={a.ly} className="flow__edge-label" textAnchor="middle">
              {t(a.label)}
            </text>
          )}
        </g>
      ))}

      {loopPath && spec.loop && (
        <g>
          <path d={loopPath.d} className="flow__edge flow__edge--accent" markerEnd="url(#flow-arrow-accent)" />
          <text x={loopPath.lx} y={loopPath.ly} className="flow__edge-label flow__edge-label--accent" textAnchor="middle">
            {t(spec.loop.label)}
          </text>
        </g>
      )}

      {spec.rowTitles?.map((title, ri) => (
        <text key={ri} x={PAD} y={PAD + ri * ROW_H + NODE_H / 2 + 4} className="flow__row-title">
          {t(title)}
        </text>
      ))}

      {spec.rows.flat().map((n) => {
        const p = pos.get(n.id)!
        return (
          <g key={n.id} className={`flow__node ${n.accent ? 'flow__node--accent' : ''} ${n.tone === 'bad' ? 'flow__node--bad' : ''}`}>
            <rect x={p.x} y={p.y} width={NODE_W} height={NODE_H} rx="12" />
            <text x={p.x + NODE_W / 2} y={p.y + (n.sub ? 25 : 34)} textAnchor="middle" className="flow__label">
              {t(n.label)}
            </text>
            {n.sub && (
              <text x={p.x + NODE_W / 2} y={p.y + 43} textAnchor="middle" className="flow__sub">
                {t(n.sub)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
