/* eslint-disable react-refresh/only-export-components */

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FloatingNavbar } from "../components/floating-navbar";
import { Footer } from "../components/footer";

const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-app text-fg">
    <FloatingNavbar />
    {/* Top padding  */}
    <main className="flex-1 pt-24">
      <Outlet />
    </main>
    <Footer />
    {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
  </div>
);

export const Route = createRootRoute({
  component: RootLayout,
});
