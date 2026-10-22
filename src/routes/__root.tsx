import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function StatusPage({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <div className="max-w-md text-center">
        <img src="/images/logo.png" alt="The Golden Cosmetics Logo, ein Kolibri" className="mx-auto size-14 object-contain" />
        <h1 className="mt-6 text-3xl md:text-4xl">{title}</h1>
        <p className="mt-4 text-muted-foreground">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {children}
          <Link to="/behandlungen" className="btn btn-primary">Behandlungen</Link>
          <Link to="/academy" className="btn btn-ghost">Academy</Link>
        </div>
        <Link to="/" className="mt-6 inline-block text-sm text-muted-foreground">Zur Startseite</Link>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return <StatusPage title="Diese Seite gibt es nicht" text="Die Seite wurde verschoben oder existiert nicht mehr. Hier findest du alles Wichtige:" />;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <StatusPage title="Die Seite konnte nicht geladen werden" text="Da ist etwas schiefgelaufen. Versuch es bitte noch einmal oder wähle einen Bereich.">
      <button onClick={() => { router.invalidate(); reset(); }} className="btn btn-ghost">Erneut versuchen</button>
    </StatusPage>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Golden Cosmetics & Academy" },
      { name: "description", content: "Kosmetikstudio und Academy von Lorena Kovacevic in Brackenheim." },
      { property: "og:site_name", content: "The Golden Cosmetics" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/images/logo.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
