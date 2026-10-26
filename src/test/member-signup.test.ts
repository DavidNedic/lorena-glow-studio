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
import { signupMember, confirmMember } from '@/lib/member.functions'

const signup = signupMember as unknown as (input: { data: { email: string; vorname: string; nachname: string; newsletter: true } }) => Promise<{ status: string }>
const input = { data: { email: ' Anna@Example.DE ', vorname: 'Anna', nachname: 'Muster', newsletter: true as const } }

function query(result: unknown) {
  const chain: Record<string, unknown> = {}
  for (const method of ['select', 'eq', 'gte', 'insert', 'ilike', 'update']) chain[method] = vi.fn(() => chain)
  chain['maybeSingle'] = vi.fn(async () => result)
  chain['single'] = vi.fn(async () => result)
  chain['then'] = (resolve: (value: unknown) => void) => Promise.resolve(result).then(resolve)
  return chain
}

describe('member signup with double opt-in', () => {
  beforeEach(() => { db.from.mockReset(); send.mockReset() })
  it.each([
    { newsletter_confirmed_at: '2026-10-24', unsubscribed_at: null },
    { newsletter_confirmed_at: '2026-10-24', unsubscribed_at: '2026-10-24' },
    { newsletter_confirmed_at: null, unsubscribed_at: '2026-10-24' },
  ])('rejects an existing confirmed or unsubscribed registration: %j', async state => {
    const lookup = query({ data: { id: 'existing', confirm_token: 't', ...state } })
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(lookup)
    expect(await signup(input)).toEqual({ status: 'exists' })
    expect(lookup['ilike']).toHaveBeenCalledWith('email', 'anna@example.de')
    expect(db.from).toHaveBeenCalledTimes(3)
    expect(send).not.toHaveBeenCalled()
  })
  it('resends the confirmation for a pending registration without creating anything', async () => {
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(query({ data: { id: 'pending', vorname: 'Anna', confirm_token: 'tok123', newsletter_confirmed_at: null, unsubscribed_at: null } }))
    send.mockResolvedValueOnce({ sent: true })
    expect(await signup(input)).toEqual({ status: 'confirm' })
    expect(db.from).toHaveBeenCalledTimes(3)
    const [template, , opts] = send.mock.calls[0] as [string, string, { templateData: { confirmUrl: string }; idempotencyKey: string }]
    expect(template).toBe('member-confirm')
    expect(opts.templateData.confirmUrl).toBe('https://thegoldencosmetics.com/member-club/bestaetigen?token=tok123')
    expect(opts.idempotencyKey).toMatch(/^member-confirm-pending-resend-/)
  })
  it('rejects a concurrent duplicate without sending another email', async () => {
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(query({ data: null })).mockReturnValueOnce(query({ error: { code: '23505' } }))
    expect(await signup(input)).toEqual({ status: 'exists' })
    expect(send).not.toHaveBeenCalled()
  })
  it('sends only the confirmation email after signup, no voucher yet', async () => {
    const insert = query({ data: { id: 'new-member', vorname: 'Anna', confirm_token: 'abc', newsletter_confirmed_at: null, unsubscribed_at: null } })
    db.from
      .mockReturnValueOnce(query({ count: 0 })) // rate limit
      .mockReturnValueOnce(query({})) // signup attempt
      .mockReturnValueOnce(query({ data: null })) // members lookup
      .mockReturnValueOnce(insert) // members insert
    send.mockResolvedValueOnce({ sent: true })
    expect(await signup(input)).toEqual({ status: 'confirm' })
    expect(db.from).toHaveBeenCalledTimes(4)
    expect(db.from).not.toHaveBeenCalledWith('vouchers')
    expect(insert['insert']).toHaveBeenCalledWith({ vorname: 'Anna', nachname: 'Muster', email: 'anna@example.de', newsletter: true })
    expect(send).toHaveBeenCalledTimes(1)
    const [template, to, opts] = send.mock.calls[0] as [string, string, { templateData: { confirmUrl: string }; idempotencyKey: string }]
    expect(template).toBe('member-confirm')
    expect(to).toBe('anna@example.de')
    expect(opts.templateData.confirmUrl).toBe('https://thegoldencosmetics.com/member-club/bestaetigen?token=abc')
    expect(opts.idempotencyKey).toBe('member-confirm-new-member')
  })
  it('lets the test address repeat the signup even when already confirmed', async () => {
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(query({ data: { id: 'david-test', vorname: 'David', confirm_token: 'dt', newsletter_confirmed_at: '2026-10-24', unsubscribed_at: null } }))
    send.mockResolvedValueOnce({ sent: true })
    expect(await signup({ data: { ...input.data, email: ' Davidnedic@web.de ' } })).toEqual({ status: 'confirm' })
    expect(send).toHaveBeenCalledWith('member-confirm', 'davidnedic@web.de', expect.anything())
  })
  it('does not bypass an unsubscribe for the test address', async () => {
    db.from.mockReturnValueOnce(query({ count: 0 })).mockReturnValueOnce(query({})).mockReturnValueOnce(query({ data: { id: 'david-test', unsubscribed_at: '2026-10-24' } }))
    expect(await signup({ data: { ...input.data, email: 'Davidnedic@web.de' } })).toEqual({ status: 'exists' })
    expect(send).not.toHaveBeenCalled()
  })
})

const confirm = confirmMember as unknown as (input: { data: { token: string } }) => Promise<{ ok: boolean; confirmed?: boolean }>
describe('member confirmation and voucher delivery', () => {
  const member = { id: 'member-123', vorname: 'Anna', email: 'anna@example.de', newsletter_confirmed_at: null, unsubscribed_at: null }
  const link = { data: { token: 'a'.repeat(48) } }
  beforeEach(() => { db.from.mockReset(); send.mockReset() })
  it('confirms before creating and emailing one short voucher', async () => {
    const update = query({ error: null }); const insert = query({ error: null })
    db.from.mockReturnValueOnce(query({ data: member })).mockReturnValueOnce(query({ data: null })).mockReturnValueOnce(update).mockReturnValueOnce(insert)
    send.mockResolvedValueOnce({ sent: true })
    expect(await confirm(link)).toEqual({ ok: true, confirmed: true })
    expect(update['update']).toHaveBeenCalledWith({ newsletter_confirmed_at: expect.any(String) })
    expect(insert['insert']).toHaveBeenCalledWith({ member_id: 'member-123', code: expect.stringMatching(/^[A-HJ-NP-Z2-9]{6}$/), rabatt_prozent: 10 })
    expect(send).toHaveBeenCalledWith('member-voucher', 'anna@example.de', expect.objectContaining({ templateData: expect.objectContaining({ code: expect.stringMatching(/^[A-HJ-NP-Z2-9]{6}$/) }) }))
    expect(update['update'] as ReturnType<typeof vi.fn>).toHaveBeenCalledBefore(insert['insert'] as ReturnType<typeof vi.fn>)
  })
  it('reopening the link reuses the same voucher and stable email identity', async () => {
    for (let i = 0; i < 2; i++) db.from.mockReturnValueOnce(query({ data: { ...member, newsletter_confirmed_at: '2026-10-24' } })).mockReturnValueOnce(query({ data: { id: 'voucher', code: 'GOLDEN-7K3P' } }))
    send.mockResolvedValue({ sent: true })
    await confirm(link); await confirm(link)
    expect(db.from).toHaveBeenCalledTimes(4)
    expect(send.mock.calls[0]).toEqual(send.mock.calls[1])
    expect(send.mock.calls[0]?.[2]).toMatchObject({ templateData: { code: 'GOLDEN-7K3P' }, idempotencyKey: 'member-voucher-member-123-GOLDEN-7K3P' })
  })
  it('preserves successful confirmation when email sending fails', async () => {
    db.from.mockReturnValueOnce(query({ data: { ...member, newsletter_confirmed_at: '2026-10-24' } })).mockReturnValueOnce(query({ data: { code: '7K3P8M' } }))
    send.mockRejectedValueOnce(new Error('delivery unavailable'))
    expect(await confirm(link)).toEqual({ ok: false, confirmed: true })
  })
  it('never sends a voucher for an invalid confirmation', async () => {
    db.from.mockReturnValueOnce(query({ data: null }))
    expect(await confirm(link)).toEqual({ ok: false })
    expect(send).not.toHaveBeenCalled()
  })
})
