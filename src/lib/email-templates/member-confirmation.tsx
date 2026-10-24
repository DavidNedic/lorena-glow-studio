import { Button, Heading, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { emailStyles, MemberLayout } from './member-layout'

function MemberConfirmation({ origin, vorname, confirmUrl }: { origin?: string; vorname?: string; confirmUrl?: string }) {
  return <MemberLayout origin={origin} preview="Bitte bestätige deine Anmeldung zum Member Club.">
    <Heading style={emailStyles.heading}>Hallo {vorname || 'du'},</Heading>
    <Text style={emailStyles.text}>schön, dass du dabei sein möchtest. Bitte bestätige kurz deine Anmeldung zum Newsletter. Danach schicke ich dir deinen 10 %-Gutschein.</Text>
    <Button href={confirmUrl || 'https://thegoldencosmetics.com/member-club'} style={emailStyles.button}>Anmeldung bestätigen</Button>
    <Text style={emailStyles.muted}>Du hast dich nicht angemeldet? Dann ignoriere diese E-Mail einfach.</Text>
  </MemberLayout>
}

export const template = {
  component: MemberConfirmation,
  subject: 'Bitte bestätige deine Anmeldung',
  displayName: 'Member Club: Anmeldung bestätigen',
  previewData: { vorname: 'Anna', origin: 'https://thegoldencosmetics.com', confirmUrl: 'https://thegoldencosmetics.com/member-club' },
} satisfies TemplateEntry