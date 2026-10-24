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
  chain['maybeSingle'] = vi.fn(async () => result)
  chain['single'] = vi.fn(async () => result)
  chain['then'] = (resolve: (value: unknown) => void) => Promise.resolve(result).then(resolve)
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
    expect(lookup['ilike']).toHaveBeenCalledWith('email', 'anna@example.de')
    expect(db.from).toHaveBeenCalledTimes(3)
    expect(send).not.toHaveBeenCalled()
  })
  it('rejects a concurrent duplicate without sending another email', async () => {
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(query({ data: null })).mockReturnValueOnce(query({ error: { code: '23505' } }))
    expect(await signup(input)).toEqual({ status: 'exists' })
    expect(send).not.toHaveBeenCalled()
  })
  it('sends the voucher code directly with the first email after signup', async () => {
    db.from
      .mockReturnValueOnce(query({ count: 0 })) // rate limit
      .mockReturnValueOnce(query({})) // signup attempt
      .mockReturnValueOnce(query({ data: null })) // members lookup
      .mockReturnValueOnce(query({ data: { id: 'new-member', vorname: 'Anna' } })) // members insert
      .mockReturnValueOnce(query({ data: null })) // vouchers lookup
      .mockReturnValueOnce(query({})) // vouchers insert
    send.mockResolvedValueOnce({ sent: true })
    expect(await signup(input)).toEqual({ status: 'sent' })
    expect(send).toHaveBeenCalledTimes(1)
    const [template, to, opts] = send.mock.calls[0] as [string, string, { templateData: { code: string }; idempotencyKey: string }]
    expect(template).toBe('member-voucher')
    expect(to).toBe('anna@example.de')
    expect(opts.templateData.code).toMatch(/^GOLDEN-[A-HJ-NP-Z2-9]{4}$/)
    expect(opts.idempotencyKey).toBe(`member-voucher-new-member-${opts.templateData.code}`)
  })
  it('allows Davidnedic@web.de to repeat a test signup and reuses the existing voucher', async () => {
    db.from
      .mockReturnValueOnce(query({ count: 0 }))
      .mockReturnValueOnce(query({}))
      .mockReturnValueOnce(query({ data: { id: 'david-test', vorname: 'David', unsubscribed_at: null } }))
      .mockReturnValueOnce(query({ data: { code: 'GOLDEN-TEST' } })) // existing voucher
    send.mockResolvedValueOnce({ sent: true })
    expect(await signup({ data: { ...input.data, email: ' Davidnedic@web.de ' } })).toEqual({ status: 'sent' })
    expect(db.from).toHaveBeenCalledTimes(4) // no new member, no new voucher
    expect(send).toHaveBeenCalledWith('member-voucher', 'davidnedic@web.de', expect.objectContaining({
      templateData: expect.objectContaining({ code: 'GOLDEN-TEST' }),
      idempotencyKey: expect.stringContaining('member-voucher-david-test-GOLDEN-TEST-test-'),
    }))
  })
  it('does not bypass an unsubscribe for the test address', async () => {
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(query({ data: { id: 'david-test', unsubscribed_at: '2026-10-24' } }))
    expect(await signup({ data: { ...input.data, email: 'Davidnedic@web.de' } })).toEqual({ status: 'exists' })
    expect(send).not.toHaveBeenCalled()
  })
})
