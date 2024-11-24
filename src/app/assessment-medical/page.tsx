"use client";

import Navbar from "@/components/navbar/navbar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MedicalAssessment() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const userId = query.get("userId");
    if (userId) {
      setUserId(userId);
    } else {
      router.push("/assessment-user");
    }
  }, [router]);

  const [formData, setFormData] = useState({
    condition: "",
    activity: "",
    diet: "",
    smoking: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (form.checkValidity()) {
      setLoading(true);
      setError(null);

      const medicalHistory = `
        Pre-existing Conditions: ${formData.condition}
        Physical Activity Level: ${formData.activity}
        Dietary Habits: ${formData.diet}
        Smoking/Alcohol Use: ${formData.smoking}
      `;

      try {
        if (!userId) throw new Error("User ID not found");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/medical-history`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ medicalHistory }),
        });

        if (!response.ok) {
          throw new Error("Failed to update medical history");
        }

        const data = await response.json();
        console.log("Medical history updated:", data);

        const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sessions?userId=${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: false,
            sessionType: "DOCTOR",
          }),
        });

        if (!sessionResponse.ok) {
          throw new Error("Failed to create session");
        }

        const sessionData = await sessionResponse.json();
        console.log("Session created:", sessionData);

        router.push(`/doctor?sessionId=${sessionData.id}`);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      form.reportValidity();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-[80%] m-auto">
      <Navbar />
      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl text-myblue font-semibold">Your Health and Lifestyle</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Pre-existing Conditions</span>
            </div>
            <textarea
              name="condition"
              className="textarea textarea-bordered textarea-ghost focus:bg-white focus:outline-none"
              placeholder="Enter your pre-existing conditions"
              required
              value={formData.condition}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Physical Activity Level</span>
            </div>
            <select
              name="activity"
              className="select select-bordered select-ghost w-full max-w-xs focus:bg-white focus:outline-none"
              value={formData.activity}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Physical Activity Level
              </option>
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
              value={formData.diet}
              onChange={handleChange}
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
              value={formData.smoking}
              onChange={handleChange}
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

          <button type="submit" className="w-full max-w-xs btn bg-myblue hover:bg-gray-500 border-none rounded-full mt-2 text-white" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}