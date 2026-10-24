import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AccordionItem, Footer, FloatingNav, Section } from "@/components/site";
import { CONTACT, LEGAL_TERMS } from "@/lib/data";
import { OG, breadcrumbs, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/rechtliches")({
  head: () => seoHead({ path: "/rechtliches", title: "Impressum, AGB & Datenschutz · The Golden Cosmetics", description: "Impressum, AGB, Widerrufsbelehrung und Datenschutzerklärung von The Golden Cosmetics & Academy, Kosmetikstudio von Lorena Kovacevic in Brackenheim bei Heilbronn.", image: OG.behandlungen, jsonLd: [breadcrumbs([["Start", "/"], ["Impressum & Datenschutz", "/rechtliches"]])] }),
  component: Legal,
});

function LegalAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="accordion-list card mt-6 overflow-hidden">{items.map((it, i) => <AccordionItem key={it.q} open={open === i} onToggle={() => setOpen(open === i ? null : i)} head={<span className="font-semibold">{it.q}</span>}><p className="whitespace-pre-line text-muted-foreground">{it.a}</p></AccordionItem>)}</div>;
}

const AGB: { q: string; a: string }[] = [
  { q: "1. Geltungsbereich und Anbieterin", a: `Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über kosmetische Behandlungen, Gutscheine, Masterclasses, Mentorings und den Member Club zwischen dir und

The Golden Cosmetics & Academy
Inhaberin: Lorena Kovacevic
Austraße 26, 74336 Brackenheim
Telefon: 0162 9709213
E-Mail: info@thegoldencosmetics.com

Rechtsform: Einzelunternehmen. Abweichende Bedingungen gelten nur, wenn wir ihnen ausdrücklich schriftlich zustimmen.` },
  { q: "2. Leistungen", a: `Wir bieten kosmetische Behandlungen an. Sie sind keine ärztliche oder heilkundliche Behandlung und ersetzen keinen Arztbesuch. Welche Behandlung im Einzelfall sinnvoll ist, besprechen wir vor Ort. Wir dürfen eine Behandlung ablehnen oder anpassen, wenn aus fachlicher Sicht etwas dagegen spricht.` },
  { q: "3. Terminbuchung und Vertragsschluss", a: `Termine kannst du online über Beautinda, telefonisch, per WhatsApp oder vor Ort buchen. Mit deiner Buchung gibst du ein verbindliches Angebot ab. Der Vertrag kommt zustande, sobald wir den Termin bestätigen. Bei Online-Buchungen über Beautinda erfolgt die Bestätigung automatisch per E-Mail oder SMS.` },
  { q: "4. Preise und Bezahlung", a: `Es gelten die Preise, die zum Zeitpunkt der Buchung angegeben sind. Alle Preise sind Endpreise inklusive gesetzlicher Umsatzsteuer. Die Behandlung bezahlst du direkt im Anschluss im Studio. Wir akzeptieren alle angebotenen Zahlungsarten, einschließlich ${LEGAL_TERMS.paymentMethods.join(", ")}.` },
  { q: "5. Absage, Verschiebung und Nichterscheinen", a: `Du kannst deinen Termin bis ${LEGAL_TERMS.treatmentCancellationHours} Stunden vor Beginn kostenlos absagen oder verschieben, telefonisch, per WhatsApp oder über Beautinda.

Sagst du später ab oder erscheinst du nicht, berechnen wir ${LEGAL_TERMS.cancellationFeePercent} % des Preises der gebuchten Behandlung als pauschalen Ausfall. Du kannst nachweisen, dass uns kein oder ein deutlich geringerer Schaden entstanden ist, zum Beispiel weil der Termin neu vergeben wurde.

Müssen wir einen Termin absagen, informieren wir dich so früh wie möglich und bieten dir einen Ersatztermin an. Bereits gezahlte Beträge erstatten wir in diesem Fall vollständig.` },
  { q: "6. Verspätung", a: `Kommst du zu spät, kann sich die Behandlungszeit verkürzen, damit nachfolgende Termine pünktlich beginnen. Der Preis bleibt gleich. Ab einer Verspätung von ${LEGAL_TERMS.lateArrivalMinutes} Minuten können wir den Termin als nicht wahrgenommen werten; dann gilt Punkt 5.` },
  { q: "7. Gesundheit und deine Mitwirkung", a: `Vor der ersten Behandlung füllen wir gemeinsam einen Anamnesebogen aus. Bitte informiere uns vollständig und wahrheitsgemäß über Allergien, Unverträglichkeiten, Medikamente, Schwangerschaft oder Stillzeit, Hauterkrankungen, frische Sonnenbräune und frühere Behandlungen. Änderungen teilst du uns vor jedem Termin mit.

Für Folgen, die entstehen, weil Angaben fehlen oder falsch sind, haften wir nicht. Pflegehinweise nach der Behandlung geben wir dir mit; bitte halte sie ein.` },
  { q: "8. Ergebnisse", a: `Jede Haut reagiert anders. Wir arbeiten sorgfältig und nach aktuellem Fachwissen, ein bestimmtes Ergebnis können wir aber nicht garantieren. Vorher-Nachher-Bilder zeigen Einzelfälle. Leichte Rötungen oder Schwellungen nach manchen Behandlungen sind normal und klingen meist von selbst ab. Bei Beschwerden melde dich bitte umgehend.` },
  { q: "9. Gutscheine", a: `Gekaufte Gutscheine sind ${LEGAL_TERMS.voucherValidityYears} Jahre gültig, gerechnet ab dem Ende des Jahres, in dem sie gekauft wurden. Sie können nicht bar ausgezahlt werden. Ein Restguthaben bleibt bis zum Ablauf erhalten. Für Termine mit Gutschein gelten dieselben Absageregeln wie unter Punkt 5. Kostenlose Aktions- und Member-Gutscheine gelten zu den jeweils mitgeteilten Bedingungen.` },
  { q: "10. The Golden Member Club", a: `Die Mitgliedschaft ist kostenlos und die Anmeldung offen. Ein Einladungscode ist nicht erforderlich. Nach deiner Anmeldung bestätigst du deine E-Mail-Adresse über den Link in der Bestätigungsmail. Erst danach wird dein persönlicher, einmalig einlösbarer Gutscheincode erstellt und per E-Mail versendet. Eine erneute Anmeldung mit derselben bereits bestätigten E-Mail-Adresse ist nicht möglich.

Member-Vorteile gelten nur im angegebenen Zeitraum, sind nicht übertragbar, nicht mit anderen Rabatten kombinierbar und nicht bar auszahlbar. Wir dürfen Vorteile ändern oder beenden; bereits ausgegebene Codes bleiben bis zu ihrem Ablaufdatum gültig.

Du kannst deine Mitgliedschaft jederzeit beenden. Den Newsletter kannst du unabhängig davon mit einem Klick abbestellen. Bei Missbrauch dürfen wir eine Mitgliedschaft beenden.` },
  { q: "11. Masterclasses und Mentorings", a: `Anmeldung: Vor jeder Masterclass führen wir ein Kennenlerngespräch. Danach erhältst du ein Angebot mit Inhalt, Termin und Preis. Der Vertrag kommt zustande, wenn du das Angebot annimmst und wir deine Anmeldung schriftlich (E-Mail oder WhatsApp) bestätigen.

Bezahlung: Der Kurspreis ist vor Beginn der Masterclass fällig, per Überweisung oder als Ratenkauf über Klarna. Die Ratenzahlung ist ein Vertrag zwischen dir und Klarna und hängt von deren Prüfung ab.

Absage durch dich: Bis ${LEGAL_TERMS.courseCancellationDays} Tage vor Beginn kostenlos, danach werden ${LEGAL_TERMS.cancellationFeePercent} % des Kurspreises als pauschaler Ausfall fällig. Du kannst nachweisen, dass uns kein oder ein deutlich geringerer Schaden entstanden ist. Statt abzusagen, kannst du einmalig auf einen anderen Termin umbuchen. Dein gesetzliches Widerrufsrecht bleibt davon unberührt.

Absage durch uns: Fällt eine Masterclass aus wichtigem Grund aus (z. B. Krankheit), bieten wir dir einen Ersatztermin an oder erstatten den gezahlten Betrag vollständig.

Unterlagen und Zertifikat: Kursunterlagen und Videos sind urheberrechtlich geschützt und nur für deinen persönlichen Gebrauch bestimmt. Weitergabe, Veröffentlichung oder eigene Schulungen auf Basis unserer Unterlagen sind nicht erlaubt. Das Zertifikat erhältst du nach vollständiger Teilnahme. Es ist ein Teilnahmenachweis unserer Academy und keine staatlich anerkannte Ausbildung.` },
  { q: "12. Fotos und Videos", a: `Fotos oder Videos von dir oder deinem Behandlungsergebnis veröffentlichen wir nur mit deiner ausdrücklichen Einwilligung. Du kannst diese Einwilligung jederzeit für die Zukunft widerrufen.` },
  { q: "13. Haftung", a: `Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit. Bei leichter Fahrlässigkeit haften wir nur bei Verletzung einer wesentlichen Vertragspflicht und begrenzt auf den typischerweise vorhersehbaren Schaden. Für mitgebrachte Gegenstände übernehmen wir keine Haftung, außer bei Vorsatz oder grober Fahrlässigkeit.` },
  { q: "14. Schlussbestimmungen", a: `Es gilt deutsches Recht. Zwingende Verbraucherschutzvorschriften des Landes, in dem du deinen gewöhnlichen Aufenthalt hast, bleiben unberührt. Sollte eine Bestimmung dieser AGB unwirksam sein, bleiben die übrigen Bestimmungen wirksam.

Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.` },
];

const WIDERRUF: { q: string; a: string }[] = [
  { q: "Widerrufsrecht", a: `Gilt für Verträge, die du als Verbraucherin ausschließlich über Fernkommunikationsmittel schließt, zum Beispiel per Online-Buchung, Telefon, E-Mail oder WhatsApp.

Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.

Um dein Widerrufsrecht auszuüben, musst du uns (The Golden Cosmetics & Academy, Inhaberin: Lorena Kovacevic, Austraße 26, 74336 Brackenheim, Telefon: 0162 9709213, E-Mail: info@thegoldencosmetics.com) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist. Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.` },
  { q: "Folgen des Widerrufs", a: `Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.

Hast du verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so hast du uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem du uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichtest, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.

Das Widerrufsrecht erlischt bei einem Vertrag über Dienstleistungen, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung erst begonnen haben, nachdem du dazu deine ausdrückliche Zustimmung gegeben und gleichzeitig bestätigt hast, dass du dein Widerrufsrecht bei vollständiger Vertragserfüllung verlierst.` },
  { q: "Muster-Widerrufsformular", a: `Wenn du den Vertrag widerrufen willst, fülle bitte dieses Formular aus und sende es zurück.

An: The Golden Cosmetics & Academy, Inhaberin: Lorena Kovacevic, Austraße 26, 74336 Brackenheim, Telefon: 0162 9709213, E-Mail: info@thegoldencosmetics.com

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung (*):
_______________

Bestellt am (*) / erhalten am (*):
Name des/der Verbraucher(s):
Anschrift des/der Verbraucher(s):
Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
Datum:

(*) Unzutreffendes streichen.` },
];

const DATENSCHUTZ: { q: string; a: string }[] = [
  { q: "1. Verantwortliche", a: `Verantwortlich für die Datenverarbeitung auf dieser Website ist:

The Golden Cosmetics & Academy
Inhaberin: Lorena Kovacevic
Austraße 26, 74336 Brackenheim
Telefon: 0162 9709213
E-Mail: info@thegoldencosmetics.com

Eine Datenschutzbeauftragte ist gesetzlich nicht vorgeschrieben und daher nicht benannt. Bei Fragen zum Datenschutz schreib uns einfach an die oben genannte E-Mail-Adresse.` },
  { q: "2. Überblick und Rechtsgrundlagen", a: `Wir verarbeiten personenbezogene Daten nur, soweit das für eine funktionierende Website, unsere Leistungen oder die Kommunikation mit dir nötig ist.

Rechtsgrundlagen sind: deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen (lit. b), rechtliche Pflichten wie Aufbewahrungsfristen (lit. c) und unser berechtigtes Interesse an einem sicheren, funktionierenden Angebot (lit. f).` },
  { q: "3. Website-Erstellung, Hosting und Server-Logfiles", a: `Die Website wurde von Promet.digital erstellt. Die Website und ihre technischen Dienste werden über Lovable betrieben. Promet.digital ist damit nicht die Anbieterin der kosmetischen Leistungen; verantwortlich bleibt Lorena Kovacevic.

Beim Aufruf werden technische Daten wie IP-Adresse, Zeitpunkt, aufgerufene Seite und Angaben zum Browser verarbeitet. Dies dient der Auslieferung der Website und dem Schutz vor Angriffen (Art. 6 Abs. 1 lit. f DSGVO). Für diese Daten besteht keine pauschale gesetzliche Mindestaufbewahrungsfrist. Sie werden nur so lange verarbeitet, wie dies für Betrieb, Sicherheit oder eine gesetzliche Verpflichtung erforderlich ist.

Informationen zur Datenverarbeitung und den eingesetzten Dienstleistern findest du unter https://lovable.dev/privacy und https://lovable.dev/data-processing-agreement.` },
  { q: "4. Verschlüsselung", a: `Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Du erkennst sie am Schloss-Symbol und an „https://" in der Adresszeile.` },
  { q: "5. Cookies und lokale Speicherung", a: `Optionale Statistik-Cookies von Google Analytics werden erst nach deiner ausdrücklichen Zustimmung gesetzt. Werbung und personalisierte Werbesignale sind nicht aktiviert. Ablehnen ist ebenso einfach wie Akzeptieren. Unter „Cookie-Einstellungen“ in der Fußzeile kannst du deine Einwilligung jederzeit für die Zukunft widerrufen. Die Auswahl wird mit Zeitpunkt und der angezeigten Information lokal in deinem Browser gespeichert; beim Widerruf bleibt der bisherige Nachweis erhalten. Ohne gespeicherte Zustimmung bleibt Google Analytics ausgeschaltet.

Die Website speichert einige wenige Einstellungen direkt in deinem Browser (Local Storage und Session Storage): ob du das Intro schon gesehen hast, welchen Bereich du zuletzt gewählt hast und den Verlauf des Chat-Assistenten. Diese Daten verlassen dein Gerät nicht und sind für die gewünschten Funktionen unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst sie jederzeit über die Einstellungen deines Browsers löschen.` },
  { q: "Google Analytics: Geräte- und Besucherstatistik", a: `Nach deiner Zustimmung verwenden wir Google Analytics 4 von Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Damit werten wir Gerätearten, Betriebssysteme, Browser und Seitenaufrufe aus, um unser Angebot zu verbessern. Google verarbeitet dabei technische Verbindungsdaten und Cookie-Kennungen. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG.

Wir übermitteln keine Formulareingaben, Chat-Inhalte, Hautauswahl, E-Mail-Adressen oder Gutscheincodes. Unsere Seitenaufrufmessung beschränkt sich auf Startseite, Behandlungsübersicht, Academy-Übersicht und Rechtliches, ohne URL-Parameter oder Bestätigungslinks. Verwaltungs-, Member- und einzelne Behandlungsseiten werden nicht gemessen. Google Signals und personalisierte Werbung sind deaktiviert.

Eine Verarbeitung durch Google in den USA ist möglich. Informationen zu Verarbeitung, Speicherdauer und Übermittlungsgarantien findest du unter https://policies.google.com/privacy und https://support.google.com/analytics/answer/6004245. Die konkrete Aufbewahrung der Ereignisdaten richtet sich nach den Einstellungen des verbundenen Google-Analytics-Kontos und ist hier noch nicht verifiziert.

Du kannst jederzeit über „Cookie-Einstellungen“ in der Fußzeile ablehnen oder eine frühere Zustimmung widerrufen. Danach werden keine weiteren Statistikereignisse gesendet und erreichbare Google-Analytics-Cookies gelöscht. Bereits rechtmäßig verarbeitete Daten bleiben vom Widerruf unberührt.` },
  { q: "6. Kontakt per E-Mail, Telefon und WhatsApp", a: `Wenn du uns kontaktierst, verarbeiten wir deine Angaben (z. B. Name, Telefonnummer, E-Mail-Adresse, Nachricht), um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b DSGVO, sonst lit. f). Wir löschen die Daten, wenn deine Anfrage erledigt ist und keine Aufbewahrungspflichten bestehen.

Schreibst du uns per WhatsApp, verarbeitet zusätzlich die WhatsApp Ireland Limited (Meta) Daten wie deine Telefonnummer und Metadaten. Die Inhalte sind Ende-zu-Ende-verschlüsselt. Wenn du das nicht möchtest, nutze bitte Telefon oder E-Mail. Mehr dazu: whatsapp.com/legal/privacy-policy-eea` },
  { q: "7. Rückruf- und Anmeldeformular der Academy", a: `Über das Formular „Jetzt Teilnahme sichern" und den Karriere-Check kannst du eine Rückrufanfrage vorbereiten. Die Angaben werden zunächst nur in deinem Browser verarbeitet. Erst wenn du die vorbereitete WhatsApp-Nachricht selbst sendest, erhalten wir deinen Vornamen, deine Handynummer, dein Interesse und gegebenenfalls deine Antworten, um dich zur passenden Masterclass zu beraten (Art. 6 Abs. 1 lit. b DSGVO).

Wir speichern deine Anfrage nur so lange, wie es zur Bearbeitung nötig ist oder gesetzliche Aufbewahrungspflichten bestehen.` },
  { q: "8. Terminbuchung über Beautinda", a: `Für Online-Termine verlinken wir auf Beautinda, einen Dienst der Beautinda GmbH, Deutschland. Auf unserer Website ist kein Beautinda-Buchungskalender eingebunden. Erst wenn du einen Buchungslink öffnest, wird eine Verbindung zu Beautinda hergestellt.

Beautinda verarbeitet die dort eingegebenen Buchungsdaten wie Name, Kontaktdaten, Behandlung und Termin. Wir verwenden die zur Terminabwicklung erforderlichen Angaben zur Erfüllung des Vertrags oder vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO). Für die Verarbeitung auf der Beautinda-Seite gilt ergänzend deren Datenschutzerklärung.` },
  { q: "9. Terminbuchung über Calendly", a: `Für Kennenlerngespräche der Academy kannst du einen externen Link zu Calendly öffnen, einem Dienst der Calendly LLC, USA. Dort werden dein Name, deine Kontaktdaten und der gewählte Termin verarbeitet. Wir verwenden die Buchungsdaten für das Kennenlerngespräch (Art. 6 Abs. 1 lit. b DSGVO). Es kann zu einer Verarbeitung in den USA kommen. Einzelheiten zur Datenverarbeitung und zu Übermittlungsgarantien findest du in der Datenschutzerklärung von Calendly. Auf unserer Website ist kein Calendly-Kalender eingebunden.` },
  { q: "10. Member Club", a: `Für den Member Club verarbeiten wir deinen Vornamen, deine E-Mail-Adresse, den Anmelde- und Bestätigungszeitpunkt, Bestätigungs- und Abmeldetokens sowie deinen Gutscheincode und dessen Einlösung. Für den Schutz vor missbräuchlichen Anmeldungen wird außerdem ein Hash der IP-Adresse mit dem Zeitpunkt des Anmeldeversuchs verarbeitet. Die Mitgliedschaft und Gutscheinverwaltung beruhen auf Art. 6 Abs. 1 lit. b DSGVO; der Missbrauchsschutz auf unserem berechtigten Interesse nach lit. f.

Die Daten werden in Lovable Cloud gespeichert. Zugriff auf die Mitgliederverwaltung erhält nur die autorisierte Studioverwaltung. Bei Beendigung der Mitgliedschaft werden Daten gelöscht, sobald sie für die genannten Zwecke nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Für Abmeldungen, den Nachweis deiner Einwilligung und bereits ausgegebene oder eingelöste Gutscheine können die jeweils erforderlichen Angaben weiter aufbewahrt werden.` },
  { q: "11. Member-Mails und Newsletter", a: `Bei der Anmeldung willigst du in Member-Mails zu Vorteilen, Aktionen und Neuigkeiten ein (Art. 6 Abs. 1 lit. a DSGVO). Wir nutzen das Double-Opt-in-Verfahren: Zuerst erhältst du eine Bestätigungsmail mit einem Link. Erst nach dem Öffnen dieses Links ist die Anmeldung bestätigt und dein einmalig einlösbarer Gutscheincode wird in einer separaten E-Mail versendet. Anmeldung und Bestätigung werden mit Zeitpunkt protokolliert.

Bestätigungs-, Gutschein- und weitere Member-Mails werden über den verwalteten E-Mail-Dienst von Lovable versendet, nicht über eine eigene Resend-Anbindung. Dafür werden die E-Mail-Adresse, gegebenenfalls dein Vorname und die für die jeweilige Mail erforderlichen Inhalte an den Versanddienst übergeben. Zur Zustellung und zum Umgang mit Versandfehlern und Abmeldungen werden Versand- und Statusinformationen verarbeitet.

Du kannst deine Einwilligung jederzeit für die Zukunft über den Abmeldelink in den E-Mails oder per Nachricht an uns widerrufen. Dann erhältst du keine weiteren Newsletter. Erforderliche Sperr- und Nachweisdaten können verbleiben, damit die Abmeldung beachtet und keine erneute ungewollte Zusendung ausgelöst wird.` },
  { q: "12. Chat-Assistent", a: `Der Chat-Assistent auf unserer Website beantwortet Fragen automatisch und direkt in deinem Browser. Deine Eingaben werden nicht an uns oder an Dritte übertragen. Der Verlauf wird nur lokal auf deinem Gerät gespeichert und lässt sich jederzeit über „Verlauf löschen" entfernen.` },
  { q: "13. Links zu Instagram, Google Maps und WhatsApp", a: `Auf unserer Website findest du einfache Links zu Instagram, Google Maps und WhatsApp. Es werden keine Plugins oder Inhalte dieser Dienste eingebunden. Daten werden erst übertragen, wenn du einen Link anklickst und die jeweilige Seite öffnest. Dort gilt dann die Datenschutzerklärung des jeweiligen Anbieters.` },
  { q: "14. Schriftarten", a: `Die verwendeten Schriftarten sind lokal auf unserem Server eingebunden. Beim Laden der Website wird keine Verbindung zu Servern von Google oder anderen Schriftanbietern aufgebaut.` },
  { q: "15. Ratenzahlung über Klarna", a: `Wählst du für eine Masterclass die Ratenzahlung, wirst du an die Klarna Bank AB (publ), Schweden, weitergeleitet. Klarna verarbeitet deine Daten für die Zahlungsabwicklung und gegebenenfalls eine Bonitätsprüfung in eigener Verantwortung. Mehr dazu in der Datenschutzerklärung von Klarna.` },
  { q: "16. Speicherdauer", a: `Wir speichern personenbezogene Daten nur so lange, wie sie für den jeweiligen Zweck erforderlich sind oder eine gesetzliche Aufbewahrungspflicht besteht. Ohne solchen Zweck oder eine rechtliche Pflicht werden sie gelöscht. Eine pauschale gesetzliche Frist für alle Website- und Member-Daten gibt es nicht.

Soweit die gesetzlichen Vorschriften auf die jeweiligen Unterlagen anwendbar sind, werden Rechnungen und Buchungsbelege grundsätzlich ${LEGAL_TERMS.accountingRetentionYears} Jahre und Handels- bzw. Geschäftsbriefe ${LEGAL_TERMS.businessLetterRetentionYears} Jahre aufbewahrt (§ 147 AO, § 257 HGB). Die Frist beginnt grundsätzlich am Ende des maßgeblichen Kalenderjahres. Längere gesetzliche Fristen oder eine erforderliche Aufbewahrung für laufende Verfahren bleiben unberührt.` },
  { q: "17. Deine Rechte", a: `Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen.

Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Für uns zuständig ist: Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart.

Für alle Anfragen genügt eine kurze Nachricht an info@thegoldencosmetics.com.` },
  { q: "18. Änderungen", a: `Wir passen diese Datenschutzerklärung an, wenn sich unsere Website oder die rechtlichen Vorgaben ändern. Es gilt die jeweils hier veröffentlichte Fassung.` },
];

function Legal() {
  return (
    <div>
      <FloatingNav back="/" links={[{ label: "Impressum", href: "#impressum" }, { label: "AGB", href: "#agb" }, { label: "Datenschutz", href: "#datenschutz" }]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
      <Section id="impressum" className="max-w-3xl">
        <h1 className="text-5xl">Impressum</h1>
         <p className="mt-6 text-muted-foreground">{CONTACT.name}<br />{CONTACT.owner}<br />Rechtsform: {CONTACT.legalForm}<br />{CONTACT.street}<br />{CONTACT.city}<br />Telefon: {CONTACT.phone}<br />E-Mail: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
         <p className="mt-4 text-muted-foreground">USt-IdNr. gemäß § 27a UStG: {CONTACT.vatId}<br />Berufsbezeichnung: {CONTACT.profession}</p>
         <h2 className="mt-8 text-2xl">Verbraucherstreitbeilegung</h2>
         <p className="mt-4 text-muted-foreground">{CONTACT.disputeResolution}</p>
         <h2 className="mt-8 text-2xl">Website-Erstellung</h2>
         <p className="mt-4 text-muted-foreground"><a href={CONTACT.websiteCreator.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{CONTACT.websiteCreator.name}</a><br />Anbieterin der Leistungen und Verantwortliche für diese Website bleibt {CONTACT.owner}.</p>
      </Section>
      <Section id="agb" className="max-w-3xl">
        <h2 className="text-4xl">AGB</h2>
        <p className="mt-3 text-sm text-muted-foreground">Stand: Oktober 2026</p>
        <LegalAccordion items={AGB} />
      </Section>
      <Section id="widerruf" className="max-w-3xl">
        <h2 className="text-4xl">Widerrufsbelehrung</h2>
        <LegalAccordion items={WIDERRUF} />
      </Section>
      <Section id="datenschutz" className="max-w-3xl">
        <h2 className="text-4xl">Datenschutz</h2>
        <p className="mt-3 text-sm text-muted-foreground">Stand: Oktober 2026</p>
        <LegalAccordion items={DATENSCHUTZ} />
      </Section>
      <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    </div>
  );
}
