// import Image from "next/image";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import Landing from "@/components/landing/landing";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <Landing />
      <Footer />
    </div>
  );
}
