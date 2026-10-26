import { Button, Heading, Link, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { emailStyles, MemberLayout } from './member-layout'

type Props = { origin?: string; vorname?: string; betreff?: string; vorschau?: string; ueberschrift?: string; text?: string; buttonText?: string; buttonUrl?: string; unsubscribeUrl?: string }

function MemberNewsletter({ origin, vorname, vorschau, ueberschrift, text, buttonText, buttonUrl, unsubscribeUrl }: Props) {
  const paragraphs = (text || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
  return <MemberLayout origin={origin} preview={vorschau || ueberschrift || 'Neues aus dem Golden Member Club'}>
    <Text style={emailStyles.label}>The Golden Member Club</Text>
    <Heading style={emailStyles.heading}>{ueberschrift}</Heading>
    <Text style={emailStyles.text}>Hallo {vorname || 'du'},</Text>
    {paragraphs.map((p, i) => <Text key={i} style={{ ...emailStyles.text, whiteSpace: 'pre-line' }}>{p}</Text>)}
    {buttonText && buttonUrl ? <Button href={buttonUrl} style={emailStyles.button}>{buttonText}</Button> : null}
    <Text style={emailStyles.text}>Ich freu mich auf dich,<br />Lorena</Text>
    <Text style={{ ...emailStyles.muted, margin: '24px 0 0' }}>Du bekommst diese E-Mail als Mitglied im The Golden Member Club. <Link href={unsubscribeUrl} style={{ ...emailStyles.muted, textDecoration: 'underline' }}>Abmelden</Link></Text>
  </MemberLayout>
}

export const template = {
  component: MemberNewsletter,
  subject: (d: Record<string, any>) => d['betreff'] || 'Neues von The Golden Cosmetics',
  displayName: 'Member Club: Newsletter',
  previewData: { vorname: 'Anna', betreff: 'Neu im Studio', ueberschrift: 'Neu im Studio: Glass Skin', text: 'Ab sofort gibt es …\n\nBuch dir deinen Termin.', buttonText: 'Termin buchen', buttonUrl: 'https://beautinda.de', unsubscribeUrl: 'https://thegoldencosmetics.com/member-club/abmelden', origin: 'https://thegoldencosmetics.com' },
} satisfies TemplateEntry
