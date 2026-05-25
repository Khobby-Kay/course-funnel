import CatalogNavbar from "@/components/CatalogNavbar";
import CourseCatalog from "@/components/CourseCatalog";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <CatalogNavbar />
      <main>
        <CourseCatalog />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
