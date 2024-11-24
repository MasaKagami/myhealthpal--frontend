"use client";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import DoctorChat from "@/components/doctor/doctor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        <div className="flex flex-col h-full justify-center items-center gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-myblue text-center">AI Doctor</h1>
            <p className="text-center text-lg text-gray-600">
              Describe your symptoms below, and our AI Doctor will provide you with guidance.
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