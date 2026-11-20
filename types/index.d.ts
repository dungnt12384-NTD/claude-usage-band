export type Limit = { kind: string; percentUsed: number; resetsAt?: string }
export type Snap = { limits: Limit[]; ctx?: number; usd?: number }

declare module 'claude-code' {
  interface PluginState {
    'usage-band': { snap: Snap }
  }
}
