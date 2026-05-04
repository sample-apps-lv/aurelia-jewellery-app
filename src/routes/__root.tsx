import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

const APP_NAME = import.meta.env.VITE_APP_NAME || "Aurelia";
const APP_DESC = import.meta.env.VITE_APP_DESCRIPTION || "Timeless fine jewelry.";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl">404</h1>
        <h2 className="mt-4 font-serif text-xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page has wandered off.</p>
        <div className="mt-6">
          <Link to="/" className="text-xs tracking-luxe text-gold border-b border-gold pb-1">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} — Fine Jewelry` },
      { name: "description", content: APP_DESC },
      { property: "og:title", content: `${APP_NAME} — Fine Jewelry` },
      { property: "og:description", content: APP_DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </QueryClientProvider>
  );
}
