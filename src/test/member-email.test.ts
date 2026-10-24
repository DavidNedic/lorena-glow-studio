import { beforeEach, describe, expect, it, vi } from 'vitest'

const { send } = vi.hoisted(() => ({ send: vi.fn() }))
vi.mock('@lovable.dev/email-js', () => ({
  sendLovableEmail: send,
  EmailAPIError: class extends Error { code = 'recipient_suppressed' },
}))
import { sendTemplateEmail } from '@/lib/email-templates/send-email'
import { EmailAPIError } from '@lovable.dev/email-js'

describe('Member emails through Lovable', () => {
  beforeEach(() => {
    vi.stubEnv('LOVABLE_API_KEY', 'test-only-key')
    send.mockReset().mockResolvedValue({})
  })
  it('uses the brand email and configured delegated domain', async () => {
    await sendTemplateEmail('member-confirmation', 'anna@example.de', {
      templateData: { vorname: 'Anna', confirmUrl: 'https://thegoldencosmetics.com/member-club' },
      idempotencyKey: 'member-confirmation-event-123',
    })
    expect(send.mock.calls[0]?.[0]).toMatchObject({
      to: 'anna@example.de',
      from: { name: 'The Golden Cosmetics & Academy', address: 'info@thegoldencosmetics.com' },
      sender_domain: 'info.thegoldencosmetics.com',
      reply_to: 'info@thegoldencosmetics.com',
      idempotency_key: 'member-confirmation-event-123',
    })
  })
  it('preserves voucher event identity for retries', async () => {
    await sendTemplateEmail('member-voucher', 'anna@example.de', {
      templateData: { code: 'GOLDEN-7K3P' }, idempotencyKey: 'member-voucher-123-GOLDEN-7K3P',
    })
    expect(send.mock.calls[0]?.[0].idempotency_key).toBe('member-voucher-123-GOLDEN-7K3P')
  })
  it('does not retry suppressed recipients', async () => {
    send.mockRejectedValue(new EmailAPIError('suppressed'))
    expect(await sendTemplateEmail('member-confirmation', 'anna@example.de')).toEqual({ sent: false, reason: 'recipient_suppressed' })
    expect(send).toHaveBeenCalledTimes(1)
  })
})