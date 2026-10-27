import { Heading, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { emailStyles, MemberLayout } from './member-layout'

function AcademyConfirm({ origin, vorname, zeitfenster }: { origin?: string; vorname?: string; zeitfenster?: string }) {
  return <MemberLayout origin={origin} preview="Danke für deine Anfrage – ich melde mich bei dir.">
    <Text style={emailStyles.label}>The Golden Academy</Text>
    <Heading style={emailStyles.heading}>Danke für deine Anfrage</Heading>
    <Text style={emailStyles.text}>Hallo {vorname || 'du'}, schön, dass du dich für meine Masterclasses interessierst.</Text>
    <Text style={emailStyles.text}>Ich habe deine Anfrage erhalten und melde mich persönlich bei dir{zeitfenster ? ` – am liebsten ${zeitfenster.toLowerCase()}` : ''}.</Text>
    <Text style={emailStyles.text}>Bis bald,<br />Lorena</Text>
  </MemberLayout>
}

export const template = {
  component: AcademyConfirm,
  subject: 'Deine Anfrage bei The Golden Academy',
  displayName: 'Academy: Anfrage-Bestätigung',
  previewData: { vorname: 'Anna', zeitfenster: 'Vormittags', origin: 'https://thegoldencosmetics.com' },
} satisfies TemplateEntry
