"use client";

import Navbar from "@/components/navbar/navbar"
import { useRouter } from "next/navigation";
import React from "react";

export default function UserAssessment(){
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // To prevent default form submission behavior
        const form = e.target as HTMLFormElement;

        if (form.checkValidity()) { // navigate if form is valid.
            router.push("/assessment-medical");
        } else {
            form.reportValidity(); // if form isn't valid.
        }
    };

    return(
        <div className="flex flex-col h-screen w-full max-w-[80%] m-auto">
            <Navbar/>
            <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-semibold">Tell Us About Yourself</h1>
                <form 
                    onSubmit={handleSubmit}  
                    className="flex flex-col gap-2"
                >
                    <label className="input input-bordered flex items-center gap-2">
                        Email
                        <input required type="text" className="grow" placeholder="john.doe@gmail.com" />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        First Name
                        <input required type="text" className="grow" placeholder="John" />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        Last Name
                        <input required type="text" className="grow" placeholder="Doe" />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        Age
                        <input required type="number" className="grow" placeholder="27" />
                    </label>
                    <select 
                        className="select select-bordered w-full max-w-xs"
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <button 
                        type="submit"
                        className="btn btn-success mt-2 text-white"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}