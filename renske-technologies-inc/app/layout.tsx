
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "FindScan – Bollinger Bands (KLineCharts)",
  description: "Production-ready Bollinger Bands indicator demo"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 antialiased">{children}</body>
    </html>
  );
}
