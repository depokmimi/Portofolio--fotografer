import type { Metadata } from "next";
import GaleriClient from "./GaleriClient";

export const metadata: Metadata = {
  title: "Galeri — Muhamad Ramdhani Rachmansyah",
  description:
    "Galeri karya fotografi hitam putih: wedding, prewedding, portrait, dan wisuda.",
};

export default function GaleriPage() {
  return <GaleriClient />;
}
