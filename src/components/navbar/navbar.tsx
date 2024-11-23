import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex py-4 w-full justify-between items-center max-w-[80%] m-auto">
      <Link href="/">
        <p className="font-bold">myhealthpal</p>
      </Link>
      <Link href="/local-healthcare" target="_blank" rel="noopener noreferrer">
        <div className="btn hover:bg-gray-500 text-black border-none bg-white">
          Local Healthcare Services
        </div>
      </Link>
    </div>
  );
}