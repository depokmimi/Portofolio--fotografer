import Nav from "./components/Nav";
import Hero from "./components/Hero";
import SelectedWorks from "./components/SelectedWorks";
import AboutTeaser from "./components/AboutTeaser";
import ContactCta from "./components/ContactCta";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SelectedWorks />
        <AboutTeaser />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
