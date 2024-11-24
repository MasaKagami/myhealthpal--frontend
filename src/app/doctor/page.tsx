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
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-primary">
            AI Doctor
          </h1>
          <p className="text-center text-lg text-gray-600 mb-8">
            Describe your symptoms below, and our AI Doctor will provide you with guidance.
          </p>
          {sessionId !== null ? (
            <DoctorChat sessionId={sessionId} />
          ) : (
            <p className="text-center text-red-500">Session ID not found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}