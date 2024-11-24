"use client";

import Navbar from "@/components/navbar/navbar";
import DoctorChat from "@/components/doctor/doctor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import spigniv from "@/assets/face/spigniv.png";
import Image from "next/image";

export default function AIDoctorPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<number | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionIdParam = query.get("sessionId");
    if (sessionIdParam) {
      setSessionId(Number(sessionIdParam));
    } else {
      console.error("Session ID is missing in the URL.");
      router.push("/");
    }
  }, [router]);

  // Handler to send the visionResult to the message endpoint
  // This will be moved to DoctorChat, so remove it from here.

  return (
    <div className="flex flex-col h-screen w-full max-w-[80%] m-auto relative">
      <Navbar />
      <div className="w-full h-full mx-auto">
        <div className="flex flex-col h-full justify-center items-center gap-8">
          <div className="flex flex-col gap-2 items-center">
            <Image
              src={spigniv}
              alt="photo of spigniv"
              className="h-24 w-24 object-contain rounded-full border-4 border-mylightblue"
            />
            <h1 className="text-xl font-medium text-myblue text-center">
              Hello! I&apos;m Spigniv, your Doctor trained by AI!
            </h1>
            <p className="text-center text-base text-gray-600">
              Start by typing your symptoms below, and our AI Doctor will provide you with guidance and an assessment.
            </p>
          </div>
          {sessionId ? (
            <div className="relative w-full h-full">
              <DoctorChat sessionId={sessionId} />
              {/* Camera logic removed from here */}
            </div>
          ) : (
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>
    </div>
  );
}
