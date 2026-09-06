import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tumara Hall | Software Developer & Founder — CB Tech Trust",
  description:
    "Portfolio of Tumara Hall — full-stack developer and founder of CB Tech Charitable Trust. Meaningful applications for Southland, NZ, including ACC Sensitive Claims support.",
  authors: [
    {
      name: "Tumara Hall",
      url: "https://www.techstep.nz/portfolio/tumara-hall-cb-tech-nz/",
    },
  ],
  keywords: [
    "Tumara Hall",
    "CB Tech Trust",
    "Software Developer",
    "Southland NZ",
    "ACC Sensitive Claims",
    "Full Stack",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
