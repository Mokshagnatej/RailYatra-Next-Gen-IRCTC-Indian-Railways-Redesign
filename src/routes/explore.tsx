import { createFileRoute } from "@tanstack/react-router";
import RailApp from "@/components/RailApp.jsx";

const title = "Explore — RailYatra | Tourism Packages & Interactive Rail Tools";
const description =
  "Discover curated IRCTC Tourism packages, luxury train circuits, and interactive rail tools on RailYatra.";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <RailApp initialScreen="explore" />,
});
