import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* SAME HEADER FOR ALL WEBSITE PAGES */}
      <Navbar />

      <main className="min-h-screen">
        {children}
      </main>

      {/* SAME FOOTER FOR ALL WEBSITE PAGES */}
      <Footer />
    </>
  );
}