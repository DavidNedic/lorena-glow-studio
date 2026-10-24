import type { ReactNode } from 'react'
import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from '@react-email/components'
import { CONTACT } from '@/lib/data'

export const emailStyles = {
  body: { backgroundColor: '#ffffff', fontFamily: 'Hanken Grotesk, Arial, Helvetica, sans-serif', color: '#2A1D19', margin: 0 },
  container: { maxWidth: '560px', padding: '32px 20px', textAlign: 'center' as const },
  panel: { backgroundColor: '#F8F0EC', borderRadius: '8px', padding: '36px 24px' },
  heading: { fontSize: '24px', fontWeight: 600, margin: '0 0 16px' },
  text: { fontSize: '15px', lineHeight: '1.6' },
  muted: { fontSize: '12px', lineHeight: '1.6', color: '#7A665E' },
  button: { backgroundColor: '#2A1D19', color: '#ffffff', borderRadius: '8px', padding: '14px 24px', fontSize: '15px', textDecoration: 'none' },
  voucher: { backgroundColor: '#ffffff', border: '1px solid #EBDAD3', borderRadius: '8px', padding: '24px 12px', margin: '24px 0' },
  code: { color: '#2A1D19', fontSize: '28px', fontWeight: 700, fontFamily: 'Consolas, monospace', margin: '12px 0 0' },
}

export function MemberLayout({ origin = 'https://thegoldencosmetics.com', preview, children }: { origin?: string | undefined; preview: string; children: ReactNode }) {
  return <Html lang="de" dir="ltr"><Head /><Preview>{preview}</Preview>
    <Body style={emailStyles.body}><Container style={emailStyles.container}>
      <Section style={emailStyles.panel}>
        <Img src={`${origin}/android-chrome-192x192.png`} alt="Kolibri von The Golden Cosmetics & Academy" width="64" height="64" style={{ margin: '0 auto 16px' }} />
        <Text style={emailStyles.muted}>{CONTACT.name}</Text>
        <Text style={{ ...emailStyles.muted, margin: '0 0 28px' }}>by Lorena Kovacevic · Fachkosmetikerin in Brackenheim</Text>
        {children}
      </Section>
      <Text style={emailStyles.muted}>{CONTACT.name}<br />{CONTACT.owner}<br />{CONTACT.street}, {CONTACT.city}<br />
        <Link href={`${origin}/rechtliches#impressum`} style={emailStyles.muted}>Impressum</Link>
      </Text>
    </Container></Body>
  </Html>
}