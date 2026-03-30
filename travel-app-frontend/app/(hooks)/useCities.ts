"use client";

import { useState, useEffect } from "react";

interface Attraction {
  id: number;
  name: string;
  coordinates: string;
  cityId: number;
  description?: string;
}

interface City {
  id: number;
  name: string;
  coordinates: string;
  attractions?: Attraction[];
}

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCitiesWithAttractions = async () => {
      try {
        setLoading(true);

        // Загружаем города
        const citiesResponse = await fetch("http://localhost:3001/api/cities");
        if (!citiesResponse.ok) {
          throw new Error(`Ошибка загрузки городов: ${citiesResponse.status}`);
        }
        const citiesData: City[] = await citiesResponse.json();

        // Для каждого города загружаем его достопримечательности
        const citiesWithAttractions: City[] = await Promise.all(
          citiesData.map(async (city) => {
            try {
              const landmarksResponse = await fetch(
                `http://localhost:3001/api/landmarks/city/${city.id}`
              );
              if (!landmarksResponse.ok) {
                console.warn(`Не удалось загрузить достопримечательности для города ${city.name} (ID: ${city.id})`);
                return { ...city, attractions: [] };
              }
              const attractions: Attraction[] = await landmarksResponse.json();
              return { ...city, attractions };
            } catch (err) {
              console.error(`Ошибка загрузки достопримечательностей для города ${city.name}:`, err);
              return { ...city, attractions: [] };
            }
          })
        );

        setCities(citiesWithAttractions);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesWithAttractions();
  }, []);

  return { cities, loading, error };
};
