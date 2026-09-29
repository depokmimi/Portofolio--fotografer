import type { Metadata } from "next";
import { Anton, Bodoni_Moda, Manrope, Pinyon_Script } from "next/font/google";
import "./globals.css";
import YoutubeAudioPlayer from "./components/YoutubeAudioPlayer";

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

const siteUrl = "https://portofolio.muramsyah.biz.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhamad Ramdhani Rachmansyah — Fotografer",
    template: "%s — MRR Fotografer",
  },
  description:
    "Portofolio fotografi Muhamad Ramdhani Rachmansyah: wedding, prewedding, wisuda, dan portrait. Mengabadikan momen berharga Anda.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "MRR Fotografer",
    title: "Muhamad Ramdhani Rachmansyah — Fotografer",
    description:
      "Portofolio fotografi: wedding, prewedding, wisuda, dan portrait dalam bingkai hitam-putih sinematik.",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 800, alt: "Karya fotografi MRR" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhamad Ramdhani Rachmansyah — Fotografer",
    description: "Portofolio fotografi wedding, prewedding, wisuda, dan portrait.",
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${anton.variable} ${bodoni.variable} ${pinyon.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/images/portrait.webp" as="image" fetchPriority="high" />
      </head>
      <body className="min-h-full bg-paper text-ink">
        {children}
        <YoutubeAudioPlayer />
      </body>
    </html>
  );
}
