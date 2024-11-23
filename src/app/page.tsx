// import Image from "next/image";
import Navbar from "@/components/navbar/navbar";
import Landing from "@/components/landing/landing";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full max-w-[80%] m-auto">
      <Navbar />
      <Landing />
    </div>
  );
}
