import Link from "next/link";

export const metadata = {
  title: "Docs — AI Dev Work Copilot",
  description: "Technical overview and how it works for AI Dev Work Copilot",
};

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Docs</h1>
        <p className="text-muted-foreground">How AI Dev Work Copilot collects and correlates signals.</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Fetch data from GitHub (PRs, issues, commits).</li>
          <li>Fetch relevant Slack discussions.</li>
          <li>Correlate related signals and surface context.</li>
          <li>Rank tasks by urgency and impact.</li>
          <li>Output actionable recommendations to developers.</li>
        </ol>

        <h2 className="text-2xl font-semibold">Tech stack</h2>
        <ul className="list-disc list-inside">
          <li>Coral — cross-source SQL query engine</li>
          <li>GitHub API — PRs, issues, commits</li>
          <li>Slack API — messages and channels</li>
          <li>Node.js / Python — agent logic</li>
        </ul>

        <p>
          <Link href="/" className="text-primary underline">Back to home →</Link>
        </p>
      </section>
    </div>
  );
}
