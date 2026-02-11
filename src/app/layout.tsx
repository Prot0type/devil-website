import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Piggie's Pages",
  description: "A very important legal document for Piggies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-pink-50">{children}</body>
    </html>
  );
}
