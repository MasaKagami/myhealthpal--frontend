"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
}

export default function LocalHealthcareServices() {
  const [location, setLocation] = useState<Location | null>(null);
  const [nearbyHealthcarePlaces, setNearbyHealthcarePlaces] = useState<HealthCarePlace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(10);

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
      const fetchNearbyHealthcarePlaces = async () => {
        try {
          const maxDistance = 10; 
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/healthcare-places/nearby?latitude=${location.latitude}&longitude=${location.longitude}&maxDistance=${maxDistance}`
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

      fetchNearbyHealthcarePlaces();
    }
  }, [location]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Local Healthcare Services Near You</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : location ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {nearbyHealthcarePlaces.map((place, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
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
          ))}
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </>
  );
}
