import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Network Board",
  description: "BoLD test app for LinkedIn-style BOLA, IDOR, and BFLA workflows."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
