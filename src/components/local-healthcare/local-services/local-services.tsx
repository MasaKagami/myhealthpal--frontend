"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import image1 from "@/assets/healthcare_images/hospital_1.jpg";
import image2 from "@/assets/healthcare_images/hospital_2.jpg";
import image3 from "@/assets/healthcare_images/hospital_3.jpg";
import image4 from "@/assets/healthcare_images/hospital_4.jpg";
import image5 from "@/assets/healthcare_images/hospital_5.jpg";
import image6 from "@/assets/healthcare_images/hospital_6.jpg";
import image7 from "@/assets/healthcare_images/hospital_7.jpg";
import image8 from "@/assets/healthcare_images/hospital_8.jpg";
import image10 from "@/assets/healthcare_images/hospital_10.jpg";

const imageMap: { [key: number]: StaticImageData } = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,
  6: image6,
  7: image7,
  8: image8,
  10: image10,
};

interface Location {
  latitude: number;
  longitude: number;
}

interface HealthCarePlace {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  link?: string;
  imageUrl?: string; 
}

export default function LocalHealthcareServices() {
  const [location, setLocation] = useState<Location | null>(null);
  const [nearbyHealthcarePlaces, setNearbyHealthcarePlaces] = useState<HealthCarePlace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(3); 

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          setLocation({ latitude: userLat, longitude: userLon });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyHealthcarePlaces(location.latitude, location.longitude, radius);
    }
  }, [location, radius]);

  const fetchNearbyHealthcarePlaces = async (latitude: number, longitude: number, maxDistance: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/healthcare-places/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch nearby healthcare places");
      }

      const data: HealthCarePlace[] = await response.json();
      setNearbyHealthcarePlaces(
        data.map((place) => ({
          ...place,
          link: `https://www.google.com/maps?q=${place.latitude},${place.longitude}`,
        }))
      );
    } catch (error) {
      setError("There was an error fetching nearby healthcare places");
    }
  };

  return (
    <div className="flex flex-col gap-5 my-5">
      <h1 className="text-3xl font-semibold text-myblue">Local Healthcare Services Near You</h1>
      <div className=" flex flex-col items-center">
        <label className="block text-base font-medium">Search Radius: {radius} km</label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.05"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="range range-primary w-1/3"
        />
      </div>
      {error ? (
      <p className="text-red-500">{error}</p>
      ) : location ? (
      <div className="overflow-x-auto">
        <ul className="flex space-x-4">
          {nearbyHealthcarePlaces.map((place, index) => (
            <li key={index} className="flex-none w-72">
              <div className="card bg-mylightblue shadow-xl h-full">
                {/* Card Image */}
                <div className="w-full h-40 relative">
                  {place.imageUrl ? (
                    <Image
                      src={imageMap[place.id]}
                      alt={place.name}
                      fill
                      className="rounded-t-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="card-body p-4 flex flex-col justify-between h-[calc(100%-10rem)]">
                  <h2 className="card-title text-base text-myblue">{place.name}</h2>
                  <p className="text-sm">Address: {place.address}</p>
                  <div className="card-actions justify-end">
                    {place.link ? (
                      <Link href={place.link} target="_blank" rel="noopener noreferrer">
                        <div className="btn bg-myblue text-xs hover:bg-gray-500 text-white border-none rounded-full px-4">
                          View On Map
                        </div>
                      </Link>
                    ) : (
                      <div className="btn btn-disabled px-4 py-1">Out of Range</div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      ) : (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
}