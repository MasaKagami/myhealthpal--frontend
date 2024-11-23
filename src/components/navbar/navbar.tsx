"use client"

import Link from "next/link";
// import { usePathname } from "next/navigation";
export default function Navbar() {
  // const pathname = usePathname();

  return (
    <div className="flex py-4 w-full justify-between items-center bg-myblue rounded-full mt-4 px-8">
      {/* <Link href="/"> */}
      <p className="font-bold text-white">myhealthpal</p>
      {/* </Link> */}
      <div className="flex items-center gap-6">
        <Link href="/">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
        </Link>

        <Link href="/local-healthcare" target="_blank" rel="noopener noreferrer">
          <div className="btn rounded-full hover:bg-myblue flex justify-center items-center gap-2 text-white border-white bg-myblue">
            Local Healthcare Services
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  height="24px" width="24px" fill="#e8eaed"><path d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H160Zm0-80h640v-480H160v480Zm240-560h160v-80H400v80ZM160-160v-480 480Zm280-200v120h80v-120h120v-80H520v-120h-80v120H320v80h120Z"/></svg>
          </div>
        </Link>
      </div>
    </div>
  );
}