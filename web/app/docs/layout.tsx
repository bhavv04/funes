import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DocsSidebar from "@/components/layout/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="flex xl:gap-12">
          <DocsSidebar />
          <main className="flex-1 min-w-0">
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              {children}
            </article>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}