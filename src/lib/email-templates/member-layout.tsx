import type { ReactNode } from 'react'
import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components'
import { CONTACT } from '@/lib/data'

// Farben 1:1 aus dem Website-Design (src/styles.css)
export const emailStyles = {
  body: { backgroundColor: '#F8F0EC', fontFamily: 'Hanken Grotesk, Arial, Helvetica, sans-serif', color: '#2A1D19', margin: 0, padding: '32px 0' },
  container: { maxWidth: '560px', padding: '0 16px', textAlign: 'center' as const },
  card: { backgroundColor: '#ffffff', borderRadius: '28px', padding: '44px 32px 40px' },
  brand: { fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' as const, color: '#2A1D19', margin: '18px 0 4px' },
  brandSub: { fontSize: '12px', lineHeight: '1.6', color: '#7A665E', margin: '0' },
  goldBar: { width: '56px', borderTop: '3px solid #C08A6E', borderRadius: '3px', margin: '22px auto 30px' },
  label: { fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#B98A78', margin: '0 0 12px' },
  heading: { fontSize: '28px', fontWeight: 600, lineHeight: '1.15', margin: '0 0 18px' },
  text: { fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px' },
  muted: { fontSize: '12px', lineHeight: '1.6', color: '#7A665E' },
  button: { backgroundColor: '#2A1D19', color: '#ffffff', borderRadius: '999px', padding: '15px 32px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', margin: '10px 0 22px' },
  voucher: { backgroundColor: '#FBF4EE', border: '1px solid #E3D5CE', borderRadius: '24px', padding: '30px 16px', margin: '26px 0' },
  code: { color: '#2A1D19', fontSize: '32px', fontWeight: 700, fontFamily: 'Consolas, monospace', letterSpacing: '3px', margin: '12px 0 0' },
  footer: { fontSize: '12px', lineHeight: '1.7', color: '#7A665E', marginTop: '26px' },
}

export function MemberLayout({ origin = 'https://thegoldencosmetics.com', preview, children }: { origin?: string | undefined; preview: string; children: ReactNode }) {
  const base = 'https://thegoldencosmetics.com'
  return <Html lang="de" dir="ltr"><Head /><Preview>{preview}</Preview>
    <Body style={emailStyles.body}><Container style={emailStyles.container}>
      <Section style={emailStyles.card}>
        <Img src={`${base}/android-chrome-192x192.png`} alt="Kolibri von The Golden Cosmetics & Academy" width="72" height="72" style={{ margin: '0 auto' }} />
        <Text style={emailStyles.brand}>{CONTACT.name}</Text>
        <Text style={emailStyles.brandSub}>by {CONTACT.owner} · Fachkosmetikerin in Brackenheim</Text>
        <Hr style={emailStyles.goldBar} />
        {children}
      </Section>
      <Text style={emailStyles.footer}>{CONTACT.name}<br />{CONTACT.owner} · {CONTACT.street}, {CONTACT.city}<br />
        <Link href={`${base}/rechtliches#impressum`} style={emailStyles.muted}>Impressum</Link>
      </Text>
    </Container></Body>
  </Html>
}
