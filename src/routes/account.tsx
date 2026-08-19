import { createFileRoute } from "@tanstack/react-router";
import RailApp from "@/components/RailApp.jsx";

const title = "My Account — RailYatra | Profile, Passengers, KYC & Preferences";
const description =
  "Manage your passenger master list, linked payment methods, Aadhaar KYC verification, and booking preferences on RailYatra.";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <RailApp initialScreen="account" />,
});
