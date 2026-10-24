import { Button, Heading, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { emailStyles, MemberLayout } from './member-layout'
import { CONTACT } from '@/lib/data'
import { VOUCHER_PERCENT } from '@/lib/member-club'

function MemberVoucher({ origin, vorname, code }: { origin?: string; vorname?: string; code?: string }) {
  return <MemberLayout origin={origin} preview={`Dein persönlicher ${VOUCHER_PERCENT} %-Gutschein wartet auf dich.`}>
    <Text style={emailStyles.label}>Dein Golden Member Club</Text>
    <Heading style={emailStyles.heading}>Schön, dass du dabei bist.</Heading>
    <Text style={emailStyles.text}>Hallo {vorname || 'du'}, danke für deine Anmeldung zum Member Club. Ich freue mich, dich begrüßen zu dürfen.</Text>
    <Text style={emailStyles.text}>Als kleines Dankeschön schenke ich dir einmalig {VOUCHER_PERCENT} % auf eine Behandlung bei mir im Studio.</Text>
    <Section style={emailStyles.voucher}>
      <Text style={{ ...emailStyles.heading, margin: '0' }}>{VOUCHER_PERCENT} % für deinen nächsten Besuch</Text>
      <Text style={emailStyles.muted}>Dein persönlicher, einmaliger Code</Text>
      <Text style={emailStyles.code}>{code || 'Code folgt per E-Mail'}</Text>
    </Section>
    <Text style={emailStyles.text}>Bewahre diese E-Mail auf und zeig mir deinen Code bei deinem Termin.</Text>
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