import Link from "next/link";

export const metadata = {
  title: "About — AI Dev Work Copilot",
  description: "About AI Dev Work Copilot — Coral-powered engineering intelligence",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">AI Dev Work Copilot</h1>
        <p className="text-muted-foreground">A Coral-powered agent unifying GitHub and Slack.</p>
      </header>

      <section className="space-y-6">
        <p>
          AI Dev Work Copilot is a Coral-powered intelligent agent that unifies GitHub and Slack to help
          developers decide what to work on next, detect issues faster, and understand engineering context
          in one place.
        </p>

        <h2 className="text-2xl font-semibold">Problem</h2>
        <p>
          Modern development workflows are fragmented across multiple tools — GitHub for code, PRs and issues;
          Slack for discussions; and CI/CD for build status. Developers lose context switching and miss critical
          issues.
        </p>

        <h2 className="text-2xl font-semibold">Solution</h2>
        <p>
          The Copilot aggregates data from GitHub and Slack, correlates PRs/issues/discussions, detects blockers
          and failures, and suggests prioritized work for developers.
        </p>

        <p>
          <Link href="/docs" className="text-primary underline">Read the docs →</Link>
        </p>
      </section>
    </div>
  );
}
