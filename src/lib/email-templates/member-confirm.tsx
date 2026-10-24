import { Button, Heading, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { emailStyles, MemberLayout } from './member-layout'
import { VOUCHER_PERCENT } from '@/lib/member-club'

function MemberConfirm({ origin, vorname, confirmUrl }: { origin?: string; vorname?: string; confirmUrl?: string }) {
  return <MemberLayout origin={origin} preview="Ein Klick noch, dann ist dein Gutschein unterwegs.">
    <Text style={emailStyles.label}>Dein Golden Member Club</Text>
    <Heading style={emailStyles.heading}>Bitte bestätige deine Anmeldung</Heading>
    <Text style={emailStyles.text}>Hallo {vorname || 'du'}, schön, dass du dich für meinen Member Club angemeldet hast.</Text>
    <Text style={emailStyles.text}>Bitte bestätige kurz, dass du meinen Newsletter erhalten möchtest. Direkt danach schicke ich dir deinen persönlichen {VOUCHER_PERCENT} %-Gutschein.</Text>
    <Button href={confirmUrl || `${origin ?? 'https://thegoldencosmetics.com'}/member-club`} style={emailStyles.button}>Anmeldung bestätigen</Button>
    <Text style={emailStyles.muted}>Du hast dich nicht angemeldet? Dann ignoriere diese E-Mail einfach. Ohne Bestätigung erhältst du keinen Newsletter.</Text>
    <Text style={emailStyles.text}>Bis bald,<br />Lorena</Text>
  </MemberLayout>
}

export const template = {
  component: MemberConfirm,
  subject: 'Bitte bestätige deine Anmeldung bei The Golden Cosmetics',
  displayName: 'Member Club: Anmeldung bestätigen',
  previewData: { vorname: 'Anna', confirmUrl: 'https://thegoldencosmetics.com/member-club/bestaetigen?token=example', origin: 'https://thegoldencosmetics.com' },
} satisfies TemplateEntry
