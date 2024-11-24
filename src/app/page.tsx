import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import Landing from "@/components/landing/landing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "myhealthpal - home",
};

export default function Home() {

  return (
    <>
      <div className="flex flex-col h-screen w-full max-w-[80%] m-auto">
         <Navbar />
         <Landing />
       </div>
      <Footer />
    </>
  );
}
