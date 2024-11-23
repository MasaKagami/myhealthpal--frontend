"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
// import Loading from "@mui/material/CircularProgress";

interface Location {
  latitude: number;
  longitude: number;
}

interface HealthCarePlace {
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
  const [radius, setRadius] = useState<number>(10); // Default radius in kilometers

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
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Local Healthcare Services Near You</h1>
      <div className="mb-4 flex flex-col items-center">
        <label className="block text-lg font-medium mb-2">Search Radius: {radius} km</label>
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
              <li key={index} className="flex-none w-80">
                <div className="card bg-base-100 shadow-xl">
                  {place.imageUrl ? (
                    <div className="w-full h-40 relative">
                      <Image
                        src={place.imageUrl}
                        alt={place.name}
                        fill
                        className="rounded-t-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image</span>
                    </div>
                  )}
                  <div className="card-body">
                    <h2 className="card-title">{place.name}</h2>
                    <p>Address: {place.address}</p>
                    <div className="card-actions justify-end">
                      {place.link ? (
                        <Link href={place.link} target="_blank" rel="noopener noreferrer">
                          <div className="btn btn-primary">View On Map</div>
                        </Link>
                      ) : (
                        <div className="btn btn-disabled">Out of Range</div>
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
          {/* <Loading /> */}
        </div>
      )}
    </div>
  );
}