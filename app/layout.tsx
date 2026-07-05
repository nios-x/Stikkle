import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import Header from "../components/shadcn-space/blocks/hero-01/header";
import { getServerSession } from "next-auth";
import Providers from "./providers";
import { authOptions } from "./api/auth/[...nextauth]/route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stiklle - Build the Open Source Way",
  description: "Stiklle is a platform for open source collaboration and project management.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const navigationData = [
    { title: "Home", href: "/", isActive: false },
    { title: "About the Product", href: "/about", isActive: false },
    { title: "Documentation", href: "/docs", isActive: false },
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <Providers session={session}>
          <Header navigationData={navigationData} />
          {children}
        </Providers>
      </body>
    </html>
  );
}