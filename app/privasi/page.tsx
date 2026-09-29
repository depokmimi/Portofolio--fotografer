import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Muhamad Ramdhani Rachmansyah",
  description:
    "Kebijakan privasi situs portofolio Muhamad Ramdhani Rachmansyah.",
};

const SECTIONS = [
  {
    title: "Data yang kami kumpulkan",
    body: "Saat pemilik masuk ke situs ini, kami menerima alamat email dari akun Google yang digunakan untuk login. Karya foto dan video yang diunggah pemilik disimpan di Google Drive pribadi pemilik.",
  },
  {
    title: "Cara data digunakan",
    body: "Alamat email hanya dipakai untuk memverifikasi bahwa yang masuk adalah pemilik situs, sehingga halaman admin dan fitur upload tidak bisa diakses orang lain. File karya dipakai semata-mata untuk ditampilkan di galeri portofolio ini.",
  },
  {
    title: "Berbagi data",
    body: "Kami tidak menjual, menyewakan, atau membagikan data pribadi kepada pihak ketiga mana pun.",
  },
  {
    title: "Keamanan",
    body: "Akses ke Google Drive dilakukan lewat koneksi resmi dan aman (OAuth 2.0). Token akses tidak pernah ditampilkan di browser pengunjung.",
  },
  {
    title: "Kontak",
    body: "Pertanyaan soal kebijakan ini bisa disampaikan lewat halaman Kontak di situs ini.",
  },
];

export default function PrivasiPage() {
  return (
    <>
      <Nav />
      <main className="px-5 pt-24 pb-16 md:px-10 md:pt-28 md:pb-24">
        <PageHeader eyebrow="Legal" title="Kebijakan Privasi" />
        <div className="mx-auto mt-12 max-w-3xl space-y-10">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <section>
                <h2 className="text-lg font-bold tracking-wide uppercase">
                  {s.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {s.body}
                </p>
              </section>
            </Reveal>
          ))}
          <Reveal>
            <p className="text-sm text-muted">
              Terakhir diperbarui: 29 September 2026.
            </p>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
