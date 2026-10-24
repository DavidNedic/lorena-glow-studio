export const CONSENT_KEY = "golden-analytics-consent";
export const CONSENT_VERSION = "2026-10-24";
export const CONSENT_NOTICE = "Mit deiner Zustimmung nutzt Google Analytics Angaben zu Gerät, Betriebssystem, Browser und Seitenaufrufen für Besucherstatistiken. Anbieter ist Google Ireland Limited; eine Verarbeitung in den USA ist möglich. Keine Werbung. Du kannst ablehnen und deine Auswahl jederzeit unter Cookie-Einstellungen ändern.";
type Decision = { accepted: boolean; at: string; version: string; notice: string };
export type Consent = { accepted: boolean; history: Decision[] };
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };

export function parseConsent(raw: string | null): Consent | null {
  try {
    const value = JSON.parse(raw ?? "null");
    if (typeof value?.accepted !== "boolean" || !Array.isArray(value.history)) return null;
    if (!value.history.length || value.history.some((d: Decision) => typeof d.accepted !== "boolean" || typeof d.at !== "string" || d.version !== CONSENT_VERSION || d.notice !== CONSENT_NOTICE)) return null;
    if (value.history.at(-1).accepted !== value.accepted) return null;
    return value;
  } catch { return null; }
}

export function analyticsPath(path: string): string | null {
  const clean = path.replace(/\/$/, "") || "/";
  return ["/", "/behandlungen", "/academy", "/rechtliches"].includes(clean) ? clean : null;
}

export function readConsent(): Consent | null {
  try { return parseConsent(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
}

export function saveConsent(accepted: boolean): Consent | null {
  const previous = readConsent();
  const next: Consent = { accepted, history: [...(previous?.history ?? []), { accepted, at: new Date().toISOString(), version: CONSENT_VERSION, notice: CONSENT_NOTICE }] };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(next)); return next; } catch { return null; }
}

export function updateAnalytics(id: string, path: string) {
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  const win = window as AnalyticsWindow;
  const safePath = analyticsPath(path);
  const allowed = readConsent()?.accepted === true && safePath !== null;
  win[`ga-disable-${id}`] = !allowed;
  if (!allowed) {
    win.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    if (readConsent()?.accepted !== true) {
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (name === "_ga" || name.startsWith("_ga_")) {
          const parts = location.hostname.split(".");
          document.cookie = `${name}=; Max-Age=0; path=/`;
          for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join(".")}`;
        }
      }
    }
    return;
  }
  if (!win.gtag) {
    win.dataLayer = win.dataLayer ?? [];
    win.gtag = function () { win.dataLayer?.push(arguments); };
    win.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    win.gtag("set", "developer_id.dZjgwMW", true);
    win.gtag("js", new Date());
    win.gtag("config", id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: `${location.origin}${safePath}`, page_referrer: "" });
    const script = document.createElement("script");
    script.id = "golden-google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  } else {
    win.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  }
  win.gtag("event", "page_view", { page_location: `${location.origin}${safePath}`, page_path: safePath, page_referrer: "", page_title: safePath === "/academy" ? "The Golden Academy" : "The Golden Cosmetics" });
}

export function openCookieSettings() { window.dispatchEvent(new Event("golden-cookie-settings")); }