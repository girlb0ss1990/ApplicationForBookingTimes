import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tumara Hall | BookingTimes Interactive Sandbox & Portfolio",
  description: "Interactive portfolio demonstrating scheduling systems, AI integration, and backend engineering expertise for BookingTimes application.",
  authors: [{ name: "Tumara Hall", url: "https://www.techstep.nz/portfolio/tumara-hall-cb-tech-nz/" }],
  keywords: ["Software Developer", "BookingTimes", "Scheduling", "AI", "C#", "T-SQL", "Next.js", "Southland NZ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
