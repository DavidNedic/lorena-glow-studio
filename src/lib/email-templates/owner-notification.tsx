import { Heading, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { emailStyles, MemberLayout } from './member-layout'

export const OWNER_EMAIL = 'thegoldencosmetics@web.de'

function OwnerNotification({ origin, art, felder }: { origin?: string; art?: string; felder?: { label: string; wert: string }[] }) {
  return <MemberLayout origin={origin} preview={`Neue Anfrage: ${art ?? 'Website'}`}>
    <Text style={emailStyles.label}>Neue Anfrage über die Website</Text>
    <Heading style={emailStyles.heading}>{art || 'Anfrage'}</Heading>
    {(felder ?? []).map(f => <Text key={f.label} style={emailStyles.text}><strong>{f.label}:</strong> {f.wert || '–'}</Text>)}
  </MemberLayout>
}

export const template = {
  component: OwnerNotification,
  subject: (d: Record<string, any>) => `Neue Anfrage: ${d['art'] ?? 'Website'}`,
  displayName: 'Inhaberin: Neue Anfrage',
  to: OWNER_EMAIL,
  previewData: { art: 'Academy – Kennenlerngespräch', felder: [{ label: 'Vorname', wert: 'Anna' }, { label: 'Handynummer', wert: '0170 1234567' }] },
} satisfies TemplateEntry
