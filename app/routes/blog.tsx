import type { Route } from "./+types/blog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Not Hacker News" },
    { name: "description", content: "Howdy, this is my tech blog" },
  ];
}

export default function Blog() {
  return (
    <>
      <header className="mx-auto max-w-2xl py-6 flex flex-col items-center justify-center gap-2">
        <a href="/blog" className="font-satoshi text-center">
          <h1 className="text-lg font-bold tracking-tighter">
            Not Hacker News
          </h1>
          <h2 className="text-xs">Không Phải Hacker News Đâu :)</h2>
        </a>
      </header>
    </>
  );
}
