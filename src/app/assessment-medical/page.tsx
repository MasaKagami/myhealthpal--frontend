"use client"

import Navbar from "@/components/navbar/navbar";
import React from "react";
import { useRouter } from "next/navigation";

export default function MedicalAssement(){
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        if (form.checkValidity()) {
            router.push("/assessment");
        } else {
            form.reportValidity();
        }
    };

    return(
        <div className="flex flex-col h-screen w-full">
            <Navbar/>
            <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-semibold">Your Health and Lifestyle</h1>
                <form 
                    onSubmit={handleSubmit}  
                    className="flex flex-col gap-2"
                >
                    <textarea className="textarea textarea-bordered" placeholder="Pre-existing Conditions"></textarea>
                    <select 
                        className="select select-bordered w-full max-w-xs"
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>Physical Acitivty Level</option>
                        <option value="Sedentary">Sedentary (Little to no activity)</option>
                        <option value="Lightly Active">Light (1-3 days/week)</option>
                        <option value="Moderately Active">Moderate (3-5 days/week)</option>
                        <option value="Very Active">Very Active (6-7 days/week)</option>
                        <option value="Intense">Intense (High intensity or physical job)</option>
                    </select>
                    <select 
                        className="select select-bordered w-full max-w-xs"
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>Dietary Habits</option>
                        <option value="Very Healthy">Very Healthy</option>
                        <option value="Healthy">Healthy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Unhealthy">Unhealthy</option>
                        <option value="Very Unhealthy">Very Unhealthy</option>
                    </select>
                    <select 
                        className="select select-bordered w-full max-w-xs"
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>Smoking/Alcohol Use</option>
                        <option value="None">None</option>
                        <option value="Occasional">Occasional</option>
                        <option value="Regular">Regular</option>
                        <option value="Heavy">Heavy</option>
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