"use client";

import Navbar from "@/components/navbar/navbar";
import UserForm from "@/components/assessment-user/userForm";
import React, { useEffect } from "react";


export default function UserAssessment() {
  
  useEffect(() => {
    document.title = "myhealthpal - assessment";
}, []); // Runs once when the component mounts

  return (
    <div className="flex flex-col h-screen w-full max-w-[80%] m-auto">
      <Navbar />
      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl text-myblue font-semibold">Tell Us About Yourself</h1>
        <UserForm />
      </div>
    </div>
  );
}