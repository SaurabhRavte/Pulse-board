import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create router
const router = createRouter({
  routeTree,
});

// Register router types
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Get root element
const rootElement = document.getElementById("root")!;

// Render app
ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
