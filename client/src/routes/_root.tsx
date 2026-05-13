import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-app text-fg">
    <FloatingNavbar />

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
