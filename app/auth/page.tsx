import AuthClient from "@/components/auth-client";

interface PageProps {
  searchParams: Promise<{ error?: string; vars?: string }>;
}

export default async function AuthPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorParam = params.error || null;
  const varsParam = params.vars || null;

  let missingVars: string[] = [];
  if (errorParam === "ConfigurationMissing" && varsParam) {
    missingVars = varsParam.split(",");
  } else {
    if (!process.env.GITHUB_ID) missingVars.push("GITHUB_ID");
    if (!process.env.GITHUB_SECRET) missingVars.push("GITHUB_SECRET");
    if (!process.env.NEXTAUTH_SECRET) missingVars.push("NEXTAUTH_SECRET");
    if (!process.env.NEXTAUTH_URL) missingVars.push("NEXTAUTH_URL");
  }

  const nextAuthError = errorParam !== "ConfigurationMissing" ? errorParam : null;

  return (
    <AuthClient 
      missingVars={missingVars} 
      nextAuthError={nextAuthError} 
    />
  );
}
