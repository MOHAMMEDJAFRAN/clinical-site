
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-image h-screen flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Navbar/>
        <Header/>
        <Footer/>
      </main>
      
  );
}
