import { createFileRoute } from "@tanstack/react-router";
import RailApp from "@/components/RailApp.jsx";

const title = "Seat Availability — RailYatra | Real-Time Train Berth & Quota Availability";
const description =
  "Check real-time train seat availability, RAC confirmation probability, Tatkal quota status, and 6-day availability forecast across 13,000+ trains on RailYatra.";

export const Route = createFileRoute("/seat-availability")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <RailApp initialScreen="seat-availability" />,
});
