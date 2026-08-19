import { createFileRoute } from "@tanstack/react-router";
import RailApp from "@/components/RailApp.jsx";

const title = "Help & Support — RailYatra | 24x7 Helpline, Grievances & FAQs";
const description =
  "Get 24x7 railway helpline support, track grievance status, and find answers for refunds, Tatkal rules, and booking queries on RailYatra.";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <RailApp initialScreen="help" />,
});
