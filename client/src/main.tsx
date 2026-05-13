import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/clerk-react";

import "./index.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const CLERK_PUB_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

const rootElement = document.getElementById("root")!;

const App = () =>
  CLERK_PUB_KEY ? (
    <ClerkProvider publishableKey={CLERK_PUB_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  ) : (
    // No Clerk key — the credentials flow still works; the Clerk button
    // on the auth pages renders a friendly disabled state.
    <RouterProvider router={router} />
  );

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
