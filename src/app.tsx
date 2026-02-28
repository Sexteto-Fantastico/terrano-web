import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { TooltipProvider } from "./components/ui/tooltip";

const router = createRouter({
  routeTree,
});

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TooltipProvider />
    </>
  );
}
