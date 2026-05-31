import Header from "@/components/Header";
import Editor from "@/components/Editor";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Editor />
      </main>
      <Footer />
    </div>
  );
}
