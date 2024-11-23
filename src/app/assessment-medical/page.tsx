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
        <div className="flex flex-col h-screen w-full max-w-[80%] m-auto">
            <Navbar/>
            <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl text-myblue font-semibold">Your Health and Lifestyle</h1>
                <form 
                    onSubmit={handleSubmit}  
                    className="flex flex-col gap-2"
                >
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Pre-existing Conditions</span>
                        </div>
                        <textarea 
                            name="condition"
                            className="textarea textarea-bordered textarea-ghost focus:bg-white focus:outline-none" 
                            placeholder="enter your pre-existing conditions"
                            required
                            // value={user.condition}
                            // onChange={handleChange}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Physical Activity Level</span>
                        </div>
                        <select
                            name="activity"
                            className="select select-bordered select-ghost w-full max-w-xs focus:bg-white focus:outline-none"
                            // value={user.activity}  
                            // onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Physical Acitivty Level</option>
                            <option value="Sedentary">Sedentary (Little to no activity)</option>
                            <option value="Lightly Active">Light (1-3 days/week)</option>
                            <option value="Moderately Active">Moderate (3-5 days/week)</option>
                            <option value="Very Active">Very Active (6-7 days/week)</option>
                            <option value="Intense">Intense (High intensity or physical job)</option>
                        </select>
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Dietary Habits</span>
                        </div>
                        <select 
                            name="diet"
                            className="select select-bordered select-ghost w-full max-w-xs focus:bg-white focus:outline-none"
                            // value={user.diet}
                            // onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Select your dietary habits
                            </option>
                            <option value="Very Healthy">Very Healthy</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Unhealthy">Unhealthy</option>
                            <option value="Very Unhealthy">Very Unhealthy</option>
                        </select>
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Smoking/Alcohol Use</span>
                        </div>
                        <select 
                            name="smoking"
                            className="select select-bordered select-ghost w-full max-w-xs focus:bg-white focus:outline-none"
                            // value={user.smoking}
                            // onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Select your smoking/alcohol use
                            </option>
                            <option value="None">None</option>
                            <option value="Occasional">Occasional</option>
                            <option value="Regular">Regular</option>
                            <option value="Heavy">Heavy</option>
                        </select>
                    </label>

                    <button type="submit" className="w-full max-w-xs btn bg-myblue hover:bg-gray-500 border-none rounded-full mt-2 text-white"> {/* disabled={loading} */}
                        Submit
                        {/* {loading ? "Submitting..." : "Submit"} */}
                    </button>
                    {/* {error && <p className="text-red-500">{error}</p>} */}
                </form>
            </div>
        </div>
    )
}