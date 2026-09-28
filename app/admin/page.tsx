import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Area Pemilik",
  description: "Kelola karya portofolio: unggah, susun, dan hapus.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
