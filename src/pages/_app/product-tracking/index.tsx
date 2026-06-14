import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import ProductTrackingPage from "./-components/product-tracking-page";

export const Route = createFileRoute(
  "/_app/product-tracking/"
)({
  component: ProductTrackingPage,

  validateSearch: z.object({
    productId: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),

  head: () => ({
    meta: [
      {
        title: "Rastreamento de Produto",
      },
    ],
  }),
});