import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//#region src/styles.css?url
var styles_default = "/assets/styles-D7PMOdTF.css";
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		console.error("Root error:", error);
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "IRCTC — Indian Railway Catering & Tourism Corporation | Book Train Tickets Online" },
			{
				name: "description",
				content: "Book Indian Railways tickets online on IRCTC. Search trains, check PNR status, get live train running status, compare fares and manage your journeys — all in one place."
			},
			{
				name: "author",
				content: "IRCTC — Indian Railway Catering & Tourism Corporation Ltd."
			},
			{
				name: "keywords",
				content: "IRCTC, Indian Railways, train booking, PNR status, train tickets, Tatkal booking, rail tickets, live train status, train fare"
			},
			{
				property: "og:title",
				content: "IRCTC — Book Indian Train Tickets Online"
			},
			{
				property: "og:description",
				content: "Search trains, check real-time seat availability, book tickets with UPI/Cards/Net Banking, and track PNR status. 13,000+ trains across 7,000+ stations."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@IRCTCofficial"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsx(Outlet, {})
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$5 = () => import("./routes-D3WbT48J.js");
var title$5 = "RailYatra — Book Indian train tickets without the guesswork";
var description$5 = "Search trains, see honest seat availability, book with a payment flow that never dead-ends, and track PNR, refunds and live running status in one place.";
var Route$5 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: title$5 },
		{
			name: "description",
			content: description$5
		},
		{
			property: "og:title",
			content: title$5
		},
		{
			property: "og:description",
			content: description$5
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/account.tsx
var $$splitComponentImporter$4 = () => import("./account-BEQtLBCm.js");
var title$4 = "My Account — RailYatra | Profile, Passengers, KYC & Preferences";
var description$4 = "Manage your passenger master list, linked payment methods, Aadhaar KYC verification, and booking preferences on RailYatra.";
var Route$4 = createFileRoute("/account")({
	head: () => ({ meta: [
		{ title: title$4 },
		{
			name: "description",
			content: description$4
		},
		{
			property: "og:title",
			content: title$4
		},
		{
			property: "og:description",
			content: description$4
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/explore.tsx
var $$splitComponentImporter$3 = () => import("./explore-BGxlf4xH.js");
var title$3 = "Explore — RailYatra | Tourism Packages & Interactive Rail Tools";
var description$3 = "Discover curated IRCTC Tourism packages, luxury train circuits, and interactive rail tools on RailYatra.";
var Route$3 = createFileRoute("/explore")({
	head: () => ({ meta: [
		{ title: title$3 },
		{
			name: "description",
			content: description$3
		},
		{
			property: "og:title",
			content: title$3
		},
		{
			property: "og:description",
			content: description$3
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/help.tsx
var $$splitComponentImporter$2 = () => import("./help-uebu6rKx.js");
var title$2 = "Help & Support — RailYatra | 24x7 Helpline, Grievances & FAQs";
var description$2 = "Get 24x7 railway helpline support, track grievance status, and find answers for refunds, Tatkal rules, and booking queries on RailYatra.";
var Route$2 = createFileRoute("/help")({
	head: () => ({ meta: [
		{ title: title$2 },
		{
			name: "description",
			content: description$2
		},
		{
			property: "og:title",
			content: title$2
		},
		{
			property: "og:description",
			content: description$2
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/results.tsx
var $$splitComponentImporter$1 = () => import("./results-Dao6ikQp.js");
var title$1 = "Train Search Results — RailYatra | Availability & Multi-Class Fares";
var description$1 = "Compare train schedules, real-time seat availability, confirmation probabilities, and book tickets on RailYatra.";
var Route$1 = createFileRoute("/results")({
	head: () => ({ meta: [
		{ title: title$1 },
		{
			name: "description",
			content: description$1
		},
		{
			property: "og:title",
			content: title$1
		},
		{
			property: "og:description",
			content: description$1
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/trips.tsx
var $$splitComponentImporter = () => import("./trips-BwaZJOCH.js");
var title = "My Trips — RailYatra | E-Tickets, PNR Status & Live Tracking";
var description = "Access upcoming journeys, digital QR e-tickets, live train running status, and track TDR refunds on RailYatra.";
var Route = createFileRoute("/trips")({
	head: () => ({ meta: [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	AccountRoute: Route$4.update({
		id: "/account",
		path: "/account",
		getParentRoute: () => Route$6
	}),
	ExploreRoute: Route$3.update({
		id: "/explore",
		path: "/explore",
		getParentRoute: () => Route$6
	}),
	HelpRoute: Route$2.update({
		id: "/help",
		path: "/help",
		getParentRoute: () => Route$6
	}),
	ResultsRoute: Route$1.update({
		id: "/results",
		path: "/results",
		getParentRoute: () => Route$6
	}),
	TripsRoute: Route.update({
		id: "/trips",
		path: "/trips",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
