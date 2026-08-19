import { createFileRoute } from "@tanstack/react-router";
import RailApp from "@/components/RailApp.jsx";

const title = "My Trips — RailYatra | E-Tickets, PNR Status & Live Tracking";
const description =
  "Access upcoming journeys, digital QR e-tickets, live train running status, and track TDR refunds on RailYatra.";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <RailApp initialScreen="trips" />,
});
