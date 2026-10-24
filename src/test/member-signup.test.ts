import { beforeEach, describe, expect, it, vi } from 'vitest'

const { db, send } = vi.hoisted(() => ({ db: { from: vi.fn() }, send: vi.fn() }))
vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => {
    const builder = { middleware: () => builder, inputValidator: () => builder, handler: (handler: unknown) => handler }
    return builder
  },
}))
vi.mock('@tanstack/react-start/server', () => ({ getRequestHeader: () => 'test-ip', getRequest: () => ({ url: 'https://thegoldencosmetics.com' }) }))
vi.mock('@/integrations/supabase/auth-middleware', () => ({ requireSupabaseAuth: {} }))
vi.mock('@/integrations/supabase/client.server', () => ({ supabaseAdmin: db }))
vi.mock('@/lib/email-templates/send-email', () => ({ sendTemplateEmail: send }))
import { signupMember } from '@/lib/member.functions'

const signup = signupMember as unknown as (input: { data: { email: string; vorname: string; newsletter: true } }) => Promise<{ status: string }>
const input = { data: { email: ' Anna@Example.DE ', vorname: 'Anna', newsletter: true as const } }

function query(result: unknown) {
  const chain: Record<string, unknown> = {}
  for (const method of ['select', 'eq', 'gte', 'insert', 'ilike']) chain[method] = vi.fn(() => chain)
  chain.maybeSingle = vi.fn(async () => result)
  chain.single = vi.fn(async () => result)
  chain.then = (resolve: (value: unknown) => void) => Promise.resolve(result).then(resolve)
  return chain
}

describe('one signup per saved email', () => {
  beforeEach(() => { db.from.mockReset(); send.mockReset() })
  it.each([
    { newsletter_confirmed_at: null, unsubscribed_at: null },
    { newsletter_confirmed_at: '2026-10-24', unsubscribed_at: null },
    { newsletter_confirmed_at: '2026-10-24', unsubscribed_at: '2026-10-24' },
  ])('rejects an existing pending, confirmed or unsubscribed registration: %j', async state => {
    const lookup = query({ data: { id: 'existing', ...state } })
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(lookup)
    expect(await signup(input)).toEqual({ status: 'exists' })
    expect(lookup.ilike).toHaveBeenCalledWith('email', 'anna@example.de')
    expect(db.from).toHaveBeenCalledTimes(3)
    expect(send).not.toHaveBeenCalled()
  })
  it('rejects a concurrent duplicate without sending another email', async () => {
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(query({ data: null })).mockReturnValueOnce(query({ error: { code: '23505' } }))
    expect(await signup(input)).toEqual({ status: 'exists' })
    expect(send).not.toHaveBeenCalled()
  })
})