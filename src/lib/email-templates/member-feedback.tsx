import { Button, Heading, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { emailStyles, MemberLayout } from './member-layout'

function MemberFeedback({ origin, vorname, feedbackUrl }: { origin?: string; vorname?: string; feedbackUrl?: string }) {
  return <MemberLayout origin={origin} preview="Wie geht es deiner Haut? Ich freue mich über dein Feedback.">
    <Text style={emailStyles.label}>Dein Golden Member Club</Text>
    <Heading style={emailStyles.heading}>Wie hat dir deine Behandlung gefallen?</Heading>
    <Text style={emailStyles.text}>Hallo {vorname || 'du'}, vor zwei Tagen warst du bei mir im Studio. Ich hoffe, deine Haut fühlt sich wunderbar an.</Text>
    <Text style={emailStyles.text}>Magst du mir in einer Minute sagen, wie es dir gefallen hat? Dein Feedback hilft mir sehr.</Text>
    <Button href={feedbackUrl || `${origin ?? 'https://thegoldencosmetics.com'}/member-club`} style={emailStyles.button}>Feedback geben</Button>
    <Text style={emailStyles.text}>Danke dir,<br />Lorena</Text>
  </MemberLayout>
}

export const template = {
  component: MemberFeedback,
  subject: 'Wie hat dir deine Behandlung gefallen?',
  displayName: 'Member Club: Feedback nach Behandlung',
  previewData: { vorname: 'Anna', feedbackUrl: 'https://thegoldencosmetics.com/member-club/feedback?token=example', origin: 'https://thegoldencosmetics.com' },
} satisfies TemplateEntry
