import Markdown from "../../components/Markdown";

export default function DocsPage() {
  return (
    <section className="py-10">
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      <Markdown src="/content/README.md" />
    </section>
  );
}
