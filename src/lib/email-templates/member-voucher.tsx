import { Button, Heading, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { emailStyles, MemberLayout } from './member-layout'
import { CONTACT } from '@/lib/data'
import { VOUCHER_PERCENT } from '@/lib/member-club'

function MemberVoucher({ origin, vorname, code }: { origin?: string; vorname?: string; code?: string }) {
  return <MemberLayout origin={origin} preview="Dein persönlicher Gutscheincode für deinen Besuch im Studio.">
    <Heading style={emailStyles.heading}>Danke, {vorname || 'du'}!</Heading>
    <Text style={emailStyles.text}>Schön, dass du jetzt dabei bist. Als kleines Dankeschön bekommst du einmalig {VOUCHER_PERCENT} % auf eine Behandlung bei mir im Studio.</Text>
    <Text style={emailStyles.muted}>Dein Gutscheincode</Text>
    <Text style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'Consolas, monospace', margin: '12px 0 24px' }}>{code || 'Code folgt per E-Mail'}</Text>
    <Text style={emailStyles.muted}>Einmalig vor Ort im Studio einlösbar, {CONTACT.street}, Brackenheim. Einfach den Code bei der Behandlung zeigen. Nicht mit anderen Aktionen kombinierbar, keine Barauszahlung.</Text>
    <Button href={CONTACT.beautinda} style={emailStyles.button}>Termin buchen</Button>
    <Text style={emailStyles.text}>Ich freu mich auf dich,<br />Lorena</Text>
  </MemberLayout>
}

export const template = {
  component: MemberVoucher,
  subject: `Dein ${VOUCHER_PERCENT} % Gutschein von The Golden Cosmetics`,
  displayName: 'Member Club: Persönlicher Gutschein',
  previewData: { vorname: 'Anna', code: 'GOLDEN-7K3P', origin: 'https://thegoldencosmetics.com' },
} satisfies TemplateEntry