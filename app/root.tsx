import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kha Quang Trần" },
    {
      name: "description",
      content: "Howdy, this is my tech blog and this's not Hacker News lol",
    },
    {
      property: "og:title",
      content: "Kha Quang Trần",
    },
    {
      property: "og:description",
      content: "Howdy, this is my tech blog and this's not Hacker News lol",
    },
    {
      property: "og:image",
      content:
        "https://raw.githubusercontent.com/khaquangtran/not-hacker-news/refs/heads/main/app/images/avatar.jpg",
    },
    {
      property: "og:url",
      content: "https://not-hacker-news-three.vercel.app/",
    },
    {
      property: "og:type",
      content: "website",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Lato:ital@0;1&family=Merriweather:ital,opsz@0,18..144;1,18..144&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
