import { createFileRoute } from "@tanstack/react-router";
import RailApp from "@/components/RailApp.jsx";

const title = "Train Search Results — RailYatra | Availability & Multi-Class Fares";
const description =
  "Compare train schedules, real-time seat availability, confirmation probabilities, and book tickets on RailYatra.";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <RailApp initialScreen="results" />,
});
