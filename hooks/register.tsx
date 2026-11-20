import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Snap } from '../types'

const snap = atom({ plugin: 'usage-band', key: 'snap' } as const, { limits: [] } as Snap)

const NAMES: Record<string, string> = {
  five_hour: '5h',
  seven_day: '7d',
  spend_limit: 'Chi tiêu'
}

const colorOf = (p: number) => (p >= 90 ? 'red' : p >= 80 ? '#ff7a00' : '#2ecc71')

const bar = (p: number, n = 10) => {
  const f = Math.max(0, Math.min(n, Math.round((p / 100) * n)))
  return '█'.repeat(f) + '░'.repeat(n - f)
}

const left = (iso?: string) => {
  if (!iso) return ''
  const ms = Date.parse(iso) - Date.now()
  if (!(ms > 0)) return ''
  const m = Math.round(ms / 60000)
  if (m < 60) return ` ${m}p`
  const h = Math.floor(m / 60)
  return h < 48 ? ` ${h}h${String(m % 60).padStart(2, '0')}` : ` ${Math.round(h / 24)}d`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const u = await $.session.usage()
    await update($, snap, () => ({ limits: u.rateLimits, ctx: u.context.percent, usd: u.cost?.usd }))

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    await update($, snap, () => ({ limits: e.rateLimits, ctx: e.context.percent, usd: e.cost?.usd }))

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = await read($, snap)

    if (e.props.hasSurvey || (s.limits.length === 0 && s.ctx === undefined)) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const parts: any[] = []

    for (const l of s.limits) {
      parts.push(
        <Text key={l.kind} color={colorOf(l.percentUsed)}>
          {NAMES[l.kind] ?? l.kind} {bar(l.percentUsed)} {l.percentUsed}%{left(l.resetsAt)}
        </Text>
      )
    }

    if (s.ctx !== undefined) {
      parts.push(
        <Text key="ctx" color={colorOf(s.ctx)}>
          Ctx {bar(s.ctx, 6)} {s.ctx}%
        </Text>
      )
    }

    if (s.usd !== undefined && s.usd > 0) {
      parts.push(
        <Text key="usd" dimColor>
          ~${s.usd.toFixed(2)}
        </Text>
      )
    }

    return (
      <Box>
        {parts.flatMap((p, i) => (i === 0 ? [p] : [<Text key={`s${i}`} dimColor>{'  │  '}</Text>, p]))}
      </Box>
    )
  })
}
