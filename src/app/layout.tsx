import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dinevora",
  description: "Multi-tenant restaurant ordering platform"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

