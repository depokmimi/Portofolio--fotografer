export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-8 md:px-10">
      <div className="flex flex-col gap-3 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
        <p>© 2026 Muhamad Ramdhani Rachmansyah</p>
        <p>
          Instagram{" "}
          <a href="https://instagram.com/muramsyah" target="_blank" rel="noopener" className="underline underline-offset-2">
            @muramsyah
          </a>{" "}
          · WA 085811053787
        </p>
      </div>
    </footer>
  );
}
