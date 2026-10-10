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
import { Fragment, useEffect, type ReactNode } from "react";
import { initLang, t, useLangState } from "@/lib/i18n";
import { LanguagePicker } from "@/components/LangSwitch";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <>
    <meta name="robots" content="noindex" />
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("Pagina non trovata")}</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex h-12 items-center rounded-xl bg-navy px-6 font-semibold text-navy-foreground">
            {t("Torna alla home")}
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">{t("Qualcosa è andato storto")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("Riprova tra un istante.")}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-navy px-6 font-semibold text-navy-foreground"
        >
          {t("Riprova")}
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0f1a33" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { title: "QuickQuote — Preventivi professionali in 60 secondi" },
      { name: "description", content: "Crea preventivi professionali dal telefono in meno di un minuto." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "QuickQuote" },
      { property: "og:locale", content: "it_IT" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
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
  const router = useRouter();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      if (event === "SIGNED_OUT") queryClient.clear();
      router.invalidate();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);
  useEffect(() => { initLang(); }, []);
  const { lang, ready, chosen } = useLangState();

  return (
    <QueryClientProvider client={queryClient}>
      <Fragment key={lang}><Outlet /></Fragment>
      {ready && !chosen && <LanguagePicker />}
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}