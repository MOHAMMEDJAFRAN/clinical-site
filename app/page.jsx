
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Advertisement from "./components/advertisment";
import SpecialityMenu from "./components/Specialitymenu";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-image flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Navbar/>
        <Advertisement/>
        <Header/>
        <SpecialityMenu/>
        <Footer/>
      </main>
      
  );
}
