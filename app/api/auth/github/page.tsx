import { redirect } from "next/navigation";
import GithubSignInClient from "@/components/github-signin-client";

export default async function Page() {
  const missingVars: string[] = [];
  if (!process.env.GITHUB_ID) missingVars.push("GITHUB_ID");
  if (!process.env.GITHUB_SECRET) missingVars.push("GITHUB_SECRET");
  if (!process.env.NEXTAUTH_SECRET) missingVars.push("NEXTAUTH_SECRET");
  if (!process.env.NEXTAUTH_URL) missingVars.push("NEXTAUTH_URL");

  if (missingVars.length > 0) {
    console.log(`[OAuth Block] Missing configuration: ${missingVars.join(", ")}. Redirecting to /auth`);
    redirect(`/auth?error=ConfigurationMissing&vars=${missingVars.join(",")}`);
  }

  return <GithubSignInClient />;
}
