# Lorena Glow Studio

Baue die Website „The Golden Cosmetics & Academy“ (Lorena Kovacevic, anerkannte Fachkosmetikerin, Austraße 26, 74336 Brackenheim). Sprache: Deutsch, Du-Form, Lorena spricht in der Ich-Form. Das Design steht bereits fest, bitte exakt so umsetzen: ruhig, minimalistisch, warm, hochwertig, verkaufsorientiert.

## Wichtig: Kein AI-Slop
NICHT verwenden:
- Lila/Blau-Verläufe, Verlaufs-Text, Glassmorphism
- Emojis, Lucide-Icons überall, drei Icon-Boxen in einer Reihe
- Badge über der Headline, Fade-in beim Scrollen
- Inter, Space Grotesk, Instrument Serif, kursive Serifen-Akzentwörter
- farbige Rand-Karten, unverändertes shadcn-Styling
- Gedankenstriche im Text, Buzzword-Texte

Wenig Text, Details hinter Akkordeons.

## Design-Tokens
- Schrift: „Hanken Grotesk“ für alles, Headlines 600, letter-spacing −0.035 bis −0.045em. „Caveat“ nur für kurze handschriftliche Notizen von Lorena (z. B. „Ich freu mich auf dich!“).
- Hell (Behandlungen):
  - Hintergrund #F7F2ED, Fläche #FFFFFF, Fläche 2 #EFE7DF
  - Text #1C1512, gedämpft #6E625A, Linie #E7DDD4
  - Gold #B8893A, Gold-Text #8A6420
  - Primär-Button #1C1512 mit weißer Schrift
- Dunkel (Academy):
  - Hintergrund #14100D, Fläche #1E1814, Fläche 2 #2A221D
  - Text #F6F0EA, gedämpft #B5A89E, Linie #322923
  - Gold #C9A055, Primär-Button gold mit dunkler Schrift
- Radien:
  - Karten 20–28px
  - Buttons/Chips 999px (Pill)
  - Bilder 24px
- Schatten weich und warm: 0 24px 60px -28px rgba(90,60,40,.28)

## Navigation (alle Unterseiten)
Schwebende, sticky Kapsel oben mittig (14px Abstand oben, runde Pill, Hintergrund #FFFCF9 hell bzw. #2A221D dunkel, weicher Schatten). Inhalt von links nach rechts:
- runder Zurück-Button (←) zur übergeordneten Seite
- Logo + „The Golden“
- 2–3 Links
- rechts der Haupt-Button in Nude-Rosé (#C88B7C → #B0705F, weiße Schrift), dessen linke Kante schräg angeschnitten ist wie ein Lippenstift-Abstrich (clip-path polygon(16px 0,100% 0,100% 100%,0 100%), rechts rund)

Mobil sichtbar: nur Zurück, Logo-Zeichen und Button.

## Startseite `/`
1. Intro (nur beim ersten Besuch pro Session, Überspringen-Button):
   - schwarzer Bildschirm
   - ein dünner goldener Kreis zeichnet sich (SVG stroke-dashoffset)
   - darin erscheint das Logo (Kolibri) aus Blur mit Lichtschimmer, darunter „Hallo!“ und „Willkommen bei The Golden Cosmetics“
   - nach ~3,5 s verschwinden Text und Ring, der Kolibri holt kurz Schwung (scale .88, rotate −4°)
   - dann fliegt die Kamera DURCH den Kolibri in die Seite: Die Seite ist mit der Kolibri-Silhouette (kolibri-maske.png) maskiert, die über 1,5 s exponentiell riesig skaliert (easeInOutQuart), bis die Seite voll sichtbar ist. Die Silhouette startet golden und wird im Flug zur Seite.
2. Hintergrund: helle, cremige Textur (creme-hintergrund.jpg). Darüber ein WebGL-Shader, der wie langsam fließende Gesichtscreme aussieht (Elfenbein/Nude, weiche Highlights). Mausbewegung und Klick erzeugen Wellenringe wie Tropfen in Creme. Alle 3–5 s fällt automatisch ein Tropfen. Bei prefers-reduced-motion statisch.
3. Kopfzeile: Logo + „The Golden“ links, rechts Behandlungen, Academy, Kontakt und der Button „Termin buchen“.
4. Zentriert „Wofür bist du hier?“ und darunter „Wähle einfach aus. Du kannst jederzeit wechseln.“
5. Zwei Karten nebeneinander (mobil untereinander):
   - Karte „Behandlung“: hell (#FFFCF9), oben Bild kachel-behandlung.jpg in abgerundetem Rahmen (16:10), darunter „Für dich und deine Haut“ / „Behandlung“ / „Treatments für sichtbar schöne Haut im Studio in Brackenheim.“, runder Pfeil-Button rechts
   - Karte „Academy“: dunkel (#1C1512), Bild kachel-academy.jpg, „Für Kosmetikerinnen“ / „Academy“ / „Masterclasses mit Zertifikat und Mentoring für Kosmetikerinnen.“
   - Hover: Karte hebt sich 6px, Bild zoomt langsam, Pfeil dreht sich −45° und wird gold
   - Wahl in localStorage merken
6. Unten klein: Adresse · „Termin direkt buchen“ · [TELEFON]

## Behandlungen `/behandlungen` (hell, Onepager, Ziel: Termin auf Beautinda)
1. Hero:
   - links „Deine Haut verdient eine Lösung.“ und der Text „Hautästhetik mit Anspruch. Individuelle Behandlungen, moderne Skin-Konzepte und fundiertes Fachwissen, abgestimmt auf die Bedürfnisse deiner Haut.“
   - Buttons „Termin buchen“ (Beautinda) und „Behandlungen entdecken“
   - rechts studio.jpg (4:5), darunter rundes Mini-Porträt (lorena-portrait-2.jpg) + handschriftlich „Ich freu mich auf dich!“ + „Lorena, Inhaberin“
   - mobil: Bild oben im Format 4:3, Buttons volle Breite
2. Problem:
   - links groß „Du probierst Produkt um Produkt und bist morgens trotzdem unzufrieden mit dem, was du im Spiegel siehst?“, darunter „Vielleicht hast du schon vieles versucht, ohne wirklich zu verstehen, was deine Haut braucht. Es ist Zeit, deine Haut nicht länger nur zu kaschieren, sondern sie gezielt zu verstehen und professionell zu behandeln.“
   - rechts „Was davon kennst du? Tipp an, was dich stört.“ und 4 Zeilen mit Trennlinien: Unreine Haut → Ausreinigung, Verstopfte Poren → Aquafacial, Unebenmäßiges Hautbild → Microneedling, Der Glow fehlt → Glass Skin
   - Klick scrollt zur Liste und klappt das passende Treatment auf
3. „Meine Behandlungen“:
   - Filter-Chips Alle / Reine Haut / Glow / Struktur / Augen (mobil seitlich scrollbar)
   - weiße Karte mit Akkordeon-Zeilen (Name, Unterzeile, „ab [XX] €“, runder +)
   - Aufgeklappt: Thumbnail, Satz, „Ideal bei“-Tags, „Dauer: [XX] Min. · Jede Behandlung startet mit einer Hautanalyse.“, Buttons „{Name} buchen“ und „Ablauf ansehen“ (→ Detailseite)
   - Daten:
     - Glass Skin (Signature, „12 abgestimmte Schritte für strahlende, ebenmäßige Haut.“, Bild ergebnis-1)
     - Aquafacial (Tiefenreinigung, „Reinigung, Feuchtigkeit und frischer Glow in einer Behandlung.“, ergebnis-4)
     - Microneedling (Hautstruktur, „Kann die natürliche Regeneration der Haut anregen.“, ergebnis-3)
     - Ausreinigung (Auch als Men Edition, ergebnis-5)
     - Lash & Brow (Korean Lash Lifting, lorena-portrait-1)
     - Zahnaufhellung (Kosmetisch, „Schonende kosmetische Zahnaufhellung, mit Beratung vorab.“, Platzhalter)
4. Slider „Direkt nach der Behandlung“ (Label „Echte Haut. Echter Glow.“):
   - horizontale Scroll-Snap-Reihe mit ergebnis-1 bis 5 (4:5)
   - Pfeil-Buttons auf Desktop, mobil wischen (Slides 78% breit)
   - Link „Mehr Ergebnisse auf Instagram“ (@thegoldencosmetics)
5. Lorena:
   - Bild lorena-portrait-1.jpg, handschriftlich „Hi, ich bin Lorena.“
   - Headline „Skin is my expertise. Your next level is my mission.“
   - Text „Als anerkannte Fachkosmetikerin schaue ich mir deine Haut genau an und sage dir ehrlich, was sie braucht. In meinem Studio in Brackenheim nehme ich mir Zeit für dich.“
   - Button „Termin bei Lorena buchen“
6. „Gut zu wissen“:
   - links Satz + „Per WhatsApp fragen“
   - rechts Akkordeon:
     - erster Termin (Hautanalyse)
     - welches Treatment passt
     - Vorbereitung (ungeschminkt kommen)
     - Gutscheine (ja, per WhatsApp)
     - Männer (Men Edition)
     - Termin verschieben [STORNOBEDINGUNGEN]

## Academy `/academy` (dunkel, Onepager, Ziel: Telefonnummer, NIRGENDS Preise)
1. Hero:
   - „You were made for more.“ und „Dein Können. Deine Expertise. Deine Zukunft. Masterclasses mit Zertifikat und Mentoring, persönlich begleitet von Lorena. Ich bilde dich nicht nur aus, ich begleite dich auf deinem weiteren Weg.“
   - Buttons „Welche Masterclass passt zu mir?“ (→ Check) und „Kostenlos beraten lassen“ (→ Rückruf)
   - Bild absolventinnen-1.jpg, handschriftlich „Ich zeig dir, wie es geht.“
2. Skin Expert Masterclass:
   - Karte mit „Drei Schulungen. Drei Behandlungskonzepte. Fünf Zertifikate. Dein nächster Schritt zur Skin Expertin.“
   - Kacheln Aquafacial + Microneedling + Glass Skin = goldene Kachel „5 Zertifikate“
   - Button „Paket anfragen“
3. „Alle Masterclasses“:
   - Pill-Tabs „Fachlich“ / „Business & Wachstum“
   - Akkordeon-Liste: Name, Format, rechts „Preis im Gespräch“
   - Aufgeklappt: fetter Leitsatz, Text, Tags, „Platz anfragen“ und „Alle Details“
   - Fachlich:
     - Hautkunde (Online · PDF · Zertifikat „Fachkunde der Haut“ per Post)
     - Aquafacial („Lerne nicht einfach eine Behandlung. Lerne, was dahintersteckt.“)
     - Glass Skin („12 aufeinander abgestimmte Schritte“, Signature-Treatment)
     - Microneedling
     - Korean Lash Lifting & Browlifting
     - Zahnbleaching (Online + Live-Call statt nur PDF)
   - Business & Wachstum:
     - Business Growth Mentoring (1:1 · Premium, „Du hast bewiesen, dass du es kannst. Jetzt geht es darum, wie viel mehr möglich ist.“)
     - Trainer Mentoring („Von der Beauty-Expertin zur Trainerin“, Unterlagen, Verträge, Zahlungsarten, Preiskalkulation)
     - Social Media Masterclass („Neue Kundinnen finden kaum den Weg zu dir?“)
4. Slider „Meine Absolventinnen“ (Label „Deine Entwicklung endet nicht mit dem Zertifikat.“) mit absolventinnen-1 bis 4.
5. Karriere-Check (Karte, Fortschrittsbalken, große Antwort-Buttons):
   - Fragen:
     - Wo stehst du? (neu / Kosmetikerin / eigenes Studio)
     - Ziel? (neue Treatments / Fachwissen / Kundinnen & Umsatz / selbst ausbilden)
     - Lernform? (vor Ort / online / egal)
     - Start? (sofort / 1–3 Monate / informiere mich)
   - Ergebnis: Karte „Mein Vorschlag für dich: {Kurs}“, daneben Formular Vorname + Handynummer, „Kostenlosen Rückruf sichern“, Link „Lieber per WhatsApp schreiben“
   - Logik:
     - Ziel ausbilden → Trainer Mentoring
     - Ziel Umsatz → Studio: Business Growth Mentoring, sonst Social Media
     - neu oder Fachwissen → online: Hautkunde, sonst Skin Expert
     - online → Zahnbleaching
     - Studio → Lash & Browlifting
     - sonst Skin Expert
6. „Gut zu wissen“ (Akkordeon): Was kostet eine Masterclass? (am Telefon) / online lernen (nach Absprache) / Raten (Klarna, vorbehaltlich Genehmigung) / Vorkenntnisse / nach der Schulung (Ansprechpartnerin bleibt)
7. Rückruf (id „rueckruf“):
   - handschriftlich „Wie lange willst du noch zuschauen?“
   - Text, [TELEFON], WhatsApp-Link, Calendly-Link
   - Formular Vorname, Handynummer, Interesse-Chips (Skin Expert Paket / Einzelne Masterclass / Business & Mentoring / Weiß noch nicht), Button „Rückruf anfordern“, Datenschutz-Hinweis

## Detailseiten
- `/behandlungen/:slug`:
  - Chip-Leiste aller Treatments, „← Alle Behandlungen“, Name, Satz, „Dauer [XX] Min. · ab [XX] € · Mit Hautanalyse“, Tags, Buttons „{Name} buchen“ + „Frage stellen“ (WhatsApp), Bild
  - Akkordeon „So läuft dein Termin“ (Ankommen und Hautanalyse / Vorbereitung [TEXT] / Treatment [TEXT] / Pflege für zuhause)
  - Ergebnis-Slider
  - „Passt auch zu dir“ als Zeilenliste
- `/academy/:slug`:
  - Chip-Leiste, „← Alle Masterclasses“, Name, Leitsatz, „Format · Preis im persönlichen Gespräch · Ratenzahlung mit Klarna“, Buttons „Platz anfragen“ + „Per WhatsApp fragen“, Bild
  - Akkordeon „Alles, was du wissen musst“ (Das lernst du / Für wen? / Rahmen / Preis und Bezahlung)
  - Bei Aquafacial, Microneedling und Glass Skin zusätzlich der Hinweis „Auch im Skin Expert Paket“
  - Bild für Business Growth Mentoring: success-is-a-decision.jpg

## Footer (alle Unterseiten, dunkel #14100D)
- oben große Zeile („Bereit für deinen Glow?“ bzw. „Lass uns über deine Karriere sprechen.“) + goldener Button
- darunter Logo + „Kosmetikstudio und Academy von Lorena Kovacevic in Brackenheim.“, Studio-Adresse, [ÖFFNUNGSZEITEN], Kontakt ([TELEFON], [E-MAIL], Instagram)
- unten © 2026, Impressum, Datenschutz

Mobil gibt es eine feste Buttonleiste unten: „Termin buchen“ bzw. „Rückruf anfordern“ + WhatsApp.

## Technik
- Beautinda-Link: https://www.beautinda.de (später Deeplinks pro Treatment)
- WhatsApp: https://wa.me/[NUMMER]
- Calendly: https://calendly.com/thegoldencosmetics
- Instagram: @thegoldencosmetics und @academy_thegoldencosmetics
- Formulare erst mal nur mit Danke-Zustand, Backend kommt in einem zweiten Schritt.
- `/rechtliches` mit Ankern #impressum und #datenschutz (Platzhalter).
- SEO-Titel pro Seite (z. B. „Microneedling in Brackenheim · The Golden Cosmetics“), alt-Texte, LocalBusiness-Schema (BeautySalon).

Die Bilder lade ich im nächsten Schritt hoch: logo.png, kolibri-maske.png, studio.jpg, lorena-portrait-1/2.jpg, absolventinnen-1–4.jpg, ergebnis-1–5.jpg, zertifikat-box.jpg, kachel-behandlung.jpg, kachel-academy.jpg, creme-hintergrund.jpg, success-is-a-decision.jpg. Bis dahin bitte neutrale, warm getönte Platzhalter in den richtigen Seitenverhältnissen mit genau diesen Dateinamen unter /public/images verwenden.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lorena-glow-studio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e61080df-91f9-41b0-832f-d0388001737e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
