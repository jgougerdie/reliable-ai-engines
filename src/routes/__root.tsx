import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "../components/site/SiteNav";
import { SiteFooter } from "../components/site/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md px-4 py-2 text-sm font-medium btn-primary"
          >
            Try again
          </button>
          <a href="/" className="rounded-md px-4 py-2 text-sm font-medium btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI Architect — Production-Grade LLM, RAG & Agent Systems" },
      {
        name: "description",
        content:
          "AI Architect specializing in production-grade LLM systems, RAG pipelines, AI agents, and workflow automation. 14+ years in software and AI architecture.",
      },
      { name: "author", content: "AI Architect" },
      { property: "og:title", content: "AI Architect — Production-Grade LLM, RAG & Agent Systems" },
      {
        property: "og:description",
        content: "Designing reliable AI systems using LLMs, RAG, agents, and scalable infrastructure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Architect — Production-Grade LLM, RAG & Agent Systems" },
      { name: "twitter:description", content: "Designing reliable AI systems using LLMs, RAG, agents, and scalable infrastructure." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9bcda996-9f26-4a0b-bd3c-14be96828650/id-preview-61768e3c--bbf7eee5-b3b1-44de-9d5c-639ced578f2a.lovable.app-1780130236354.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9bcda996-9f26-4a0b-bd3c-14be96828650/id-preview-61768e3c--bbf7eee5-b3b1-44de-9d5c-639ced578f2a.lovable.app-1780130236354.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Architect.systems",
          url: SITE_URL,
          description:
            "AI architecture consultancy for production-grade LLM systems, RAG pipelines, AI agents, and workflow automation.",
          sameAs: ["https://github.com/", "https://linkedin.com/", "https://upwork.com/"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Architect.systems",
          url: SITE_URL,
          description:
            "Field notes, case studies, and consulting on production-grade LLM, RAG, and agent systems.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
      <SiteNav />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
