import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "MYnyak Engsel Web",
  description: "Web UI for OTP login, balance, packages, and payment checkout",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <nav className="nav">
            <a className="link" href="/">{process.env.NEXT_PUBLIC_APP_NAME || "ME Web"}</a>
            <div className="row">
              <a className="link" href="/dashboard">Dashboard</a>
              <a className="link" href="/login">Login</a>
            </div>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
