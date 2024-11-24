"use client";

import Navbar from "@/components/navbar/navbar";
import DoctorChat from "@/components/doctor/doctor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import spigniv from "@/assets/face/spigniv.png"
import Image from "next/image";

export default function AIDoctorPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<number | null>(null);

  useEffect(() => {
    if (router) {
      const query = new URLSearchParams(window.location.search);
      const sessionId = query.get("sessionId");
      if (sessionId) {
        setSessionId(Number(sessionId));
      } else {
        router.push("/");
      }
    }
  }, [router]);

  return (
    <div className="flex flex-col h-screen w-full max-w-[80%] m-auto">
      <Navbar />
      <div className="w-full h-full mx-auto">
        <div className="flex flex-col h-full justify-center items-center gap-8">
          <div className="flex flex-col gap-2 items-center">
            <Image
              src={spigniv}
              alt="photo of spigniv"
              className="h-24 w-24 object-contain rounded-full border-4 border-mylightblue "
            />
            <h1 className="text-xl font-medium text-myblue text-center">Hello! I&apos;m Spigniv, your Doctor trained by AI!</h1>
            <p className="text-center text-base text-gray-600">
              Start by typing your symptoms below, and our AI Doctor will provide you with guidance and an assessment.
            </p>
          </div>
          {sessionId !== null ? (
            <DoctorChat sessionId={sessionId} />
          ) : (
            <p className="text-center text-red-500">Session ID not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}