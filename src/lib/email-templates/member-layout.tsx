import type { ReactNode } from 'react'
import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from '@react-email/components'
import { CONTACT } from '@/lib/data'

// Farben 1:1 aus dem Website-Design (src/styles.css)
export const emailStyles = {
  body: { backgroundColor: '#F8F0EC', fontFamily: 'Hanken Grotesk, Arial, Helvetica, sans-serif', color: '#2A1D19', margin: 0, padding: '24px 0' },
  container: { maxWidth: '560px', padding: '0 16px', textAlign: 'center' as const },
  card: { backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px 28px', boxShadow: '0 24px 60px -28px rgba(42, 29, 25, 0.22)' },
  label: { fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#B98A78', margin: '0 0 12px' },
  heading: { fontSize: '26px', fontWeight: 600, lineHeight: '1.1', margin: '0 0 16px' },
  text: { fontSize: '15px', lineHeight: '1.65', margin: '0 0 14px' },
  muted: { fontSize: '12px', lineHeight: '1.6', color: '#7A665E' },
  button: { backgroundColor: '#2A1D19', color: '#ffffff', borderRadius: '999px', padding: '14px 28px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', margin: '8px 0 20px' },
  voucher: { backgroundColor: '#F8F0EC', border: '1px solid #E3D5CE', borderRadius: '24px', padding: '28px 16px', margin: '24px 0' },
  code: { color: '#2A1D19', fontSize: '30px', fontWeight: 700, fontFamily: 'Consolas, monospace', letterSpacing: '2px', margin: '12px 0 0' },
}

export function MemberLayout({ origin = 'https://thegoldencosmetics.com', preview, children }: { origin?: string | undefined; preview: string; children: ReactNode }) {
  return <Html lang="de" dir="ltr"><Head /><Preview>{preview}</Preview>
    <Body style={emailStyles.body}><Container style={emailStyles.container}>
      <Section style={emailStyles.card}>
        <Img src={`${origin}/android-chrome-192x192.png`} alt="Kolibri von The Golden Cosmetics & Academy" width="64" height="64" style={{ margin: '0 auto 16px' }} />
        <Text style={{ ...emailStyles.muted, margin: '0' }}>{CONTACT.name}</Text>
        <Text style={{ ...emailStyles.muted, margin: '0 0 28px' }}>by Lorena Kovacevic · Fachkosmetikerin in Brackenheim</Text>
        {children}
      </Section>
      <Text style={{ ...emailStyles.muted, marginTop: '24px' }}>{CONTACT.name}<br />{CONTACT.owner}<br />{CONTACT.street}, {CONTACT.city}<br />
        <Link href={`${origin}/rechtliches#impressum`} style={emailStyles.muted}>Impressum</Link>
      </Text>
    </Container></Body>
  </Html>
}
