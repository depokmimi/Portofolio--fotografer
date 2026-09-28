import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import SelectedWorks from "./components/SelectedWorks";
import Quote from "./components/AboutTeaser";
import ContactCta from "./components/ContactCta";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Categories />
        <SelectedWorks />
        <Quote />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
