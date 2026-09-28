import type { Metadata } from "next";
import { Anton, Bodoni_Moda, Manrope, Pinyon_Script } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhamad Ramdhani Rachmansyah — Fotografer",
  description:
    "Portofolio fotografi Muhamad Ramdhani Rachmansyah: wedding, prewedding, wisuda, dan portrait. Mengabadikan momen berharga Anda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${anton.variable} ${bodoni.variable} ${pinyon.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
