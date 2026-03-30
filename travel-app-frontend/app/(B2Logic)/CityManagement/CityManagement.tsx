// components/CityManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Типы данных
interface City {
  id: number;
  name: string;
  coordinates: string; // формат 'lat,lng'
  zoomLevel: number;
  createdAt: string;
  updatedAt: string;
}

interface CityFormData {
  name: string;
  coordinates: string;
  zoomLevel: number;
}

export default function CityManagement() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const router = useRouter();

  // Форма данных
  const [formData, setFormData] = useState<CityFormData>({
    name: "",
    coordinates: "",
    zoomLevel: 12,
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cities");
      const data: City[] = await res.json();
      setCities(data);
    } catch (error) {
      console.error("Ошибка загрузки городов:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCity ? `/api/cities/${editingCity.id}` : "/api/cities";
      const method = editingCity ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingCity(null);
        setFormData({ name: "", coordinates: "", zoomLevel: 12 });
        fetchCities();
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      coordinates: city.coordinates,
      zoomLevel: city.zoomLevel,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Удалить город?")) {
      try {
        await fetch(`/api/cities/${id}`, { method: "DELETE" });
        fetchCities();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Добавить город
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-4">
            {editingCity ? "Редактировать город" : "Добавить город"}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Название"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Координаты (широта,долгота)"
              value={formData.coordinates}
              onChange={(e) =>
                setFormData({ ...formData, coordinates: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Уровень зума"
              value={formData.zoomLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  zoomLevel: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                {editingCity ? "Обновить" : "Создать"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCity(null);
                  setFormData({ name: "", coordinates: "", zoomLevel: 12 });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {cities.map((city) => (
          <div
            key={city.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{city.name}</h3>
              <p>Координаты: {city.coordinates}</p>
              <p>Уровень зума: {city.zoomLevel}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(city)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                aria-label={`Редактировать город ${city.name}`}
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(city.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                aria-label={`Удалить город ${city.name}`}
              >
                Удалить
              </button>
              <button
                onClick={() => router.push(`/api/landmarks/city/${city.id}`)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                aria-label={`Управление достопримечательностями города ${city.name}`}
              >
                Достопримечательности
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
