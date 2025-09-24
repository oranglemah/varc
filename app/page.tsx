
import Link from "next/link";

export default function Page() {
  return (
    <section className="py-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          me-cli — Project Website
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          A simple, fast, and easy-to-deploy website documenting the me-cli project.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/docs" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20">
            Read the docs
          </Link>
          <a href="https://github.com/" target="_blank" className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/5">
            View on GitHub
          </a>
        </div>
      </div>
      <div className="mt-14 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-[var(--card)] border border-white/10">
          <h3 className="font-semibold mb-2">What is it?</h3>
          <p className="text-sm text-white/70">A simple, fast, and deploy-ready site to present your project on Vercel.</p>
        </div>
        <div className="rounded-2xl p-6 bg-[var(--card)] border border-white/10">
          <h3 className="font-semibold mb-2">Instant deploy</h3>
          <p className="text-sm text-white/70">Push to GitHub and import in Vercel. Done.</p>
        </div>
        <div className="rounded-2xl p-6 bg-[var(--card)] border border-white/10">
          <h3 className="font-semibold mb-2">Customizable</h3>
          <p className="text-sm text-white/70">Edit the hero, docs, and styles to match your branding.</p>
        </div>
      </div>
    </section>
  );
}
