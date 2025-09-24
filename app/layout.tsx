import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "me-cli — Project Website — Website",
  description: "A simple, fast, and easy-to-deploy website documenting the me-cli project.",
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-white/10 sticky top-0 backdrop-blur bg-black/30">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="font-semibold tracking-wide">me-cli</Link>
            <div className="flex gap-5 text-sm">
              <Link href="/docs" className="hover:underline">Docs</Link>
              <a href="https://github.com/" target="_blank" className="hover:underline">GitHub</a>
            </div>
          </div>
        </nav>
        <main className="container">{children}</main>
        <footer className="container py-10 text-xs text-white/60">
          Built with Next.js • Deployed on Vercel
        </footer>
      </body>
    </html>
  );
}