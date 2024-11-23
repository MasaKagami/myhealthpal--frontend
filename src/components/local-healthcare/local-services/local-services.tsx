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
  link?: string; // Made optional
}

const healthcareDatabase: HealthCarePlace[] = [
  {
    name: "Montreal General Hospital",
    address: "1650 Cedar Ave, Montreal, QC",
    latitude: 45.4971,
    longitude: -73.5862,
  },
  {
    name: "Jewish General Hospital",
    address: "3755 Côte-Sainte-Catherine Rd, Montreal, QC",
    latitude: 45.4965,
    longitude: -73.6278,
  },
  {
    name: "Saint Mary's Hospital",
    address: "3830 Lacombe Ave, Montreal, QC",
    latitude: 45.4916,
    longitude: -73.6228,
  },
];

export default function LocalHealthcareServices() {
  const [location, setLocation] = useState<Location | null>(null);
  const [nearbyHealthcarePlaces, setNearbyHealthcarePlaces] = useState<HealthCarePlace[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculateDistance = (
    userLat: number,
    userLon: number,
    listingLat: number,
    listingLon: number
  ): number => {
    const R = 6371;
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const dLat = toRadians(listingLat - userLat);
    const dLon = toRadians(listingLon - userLon);
    const lat1 = toRadians(userLat);
    const lat2 = toRadians(listingLat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

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
      const maxDistance = 10;

      const filteredPlaces = healthcareDatabase
        .map((place) => {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            place.latitude,
            place.longitude
          );

          if (distance <= maxDistance) {
            return {
              ...place,
              link: `https://www.google.com/maps?q=${place.latitude},${place.longitude}`, 
            };
          }

          return null; 
        })
        .filter((place) => place !== null) as HealthCarePlace[]; 

      setNearbyHealthcarePlaces(filteredPlaces);
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
                    <Link href={place.link}>
                      <div className="btn btn-primary">View Details</div>
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
