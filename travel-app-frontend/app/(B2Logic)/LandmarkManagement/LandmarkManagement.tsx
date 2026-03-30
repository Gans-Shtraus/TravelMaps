// components/LandmarkManagement.tsx
"use client";

import { useState, useEffect } from "react";

// Типы данных
interface City {
  id: number;
  name: string;
  coordinates: string;
  zoomLevel: number;
  createdAt: string;
  updatedAt: string;
}

interface Landmark {
  id: number;
  name: string;
  description: string;
  cityId: number;
  coordinates: string;
  createdAt: string;
  updatedAt: string;
}

interface LandmarkFormData {
  name: string;
  description: string;
  coordinates: string;
}

export default function LandmarkManagement() {
  const [cities, setCities] = useState<City[]>([]);
  const [landmarksByCity, setLandmarksByCity] = useState<{ city: City; landmarks: Landmark[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLandmarkForm, setShowLandmarkForm] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState<Landmark | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  // Форма для достопримечательностей
  const [landmarkFormData, setLandmarkFormData] = useState<LandmarkFormData>({
    name: "",
    description: "",
    coordinates: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Загружаем города
      const citiesRes = await fetch("/api/cities");
      if (!citiesRes.ok) throw new Error("Ошибка загрузки городов");
      const citiesData: City[] = await citiesRes.json();
      setCities(citiesData);

      // Для каждого города загружаем его достопримечательности
      const landmarksByCityPromises = citiesData.map(async (city) => {
        const landmarksRes = await fetch(`/api/landmarks/city/${city.id}`);
        if (!landmarksRes.ok) {
          console.warn(`Не удалось загрузить достопримечательности для города ${city.id}`);
          return { city, landmarks: [] as Landmark[] };
        }
        const landmarksData: Landmark[] = await landmarksRes.json();
        return { city, landmarks: landmarksData };
      });

      const landmarksByCityData = await Promise.all(landmarksByCityPromises);
      setLandmarksByCity(landmarksByCityData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLandmarkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId) return;

    try {
      const url = editingLandmark
        ? `/api/landmarks/${editingLandmark.id}`
        : "/api/landmarks";
      const method = editingLandmark ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...landmarkFormData,
          cityId: selectedCityId,
        }),
      });

      if (response.ok) {
        setShowLandmarkForm(false);
        setEditingLandmark(null);
        setLandmarkFormData({ name: "", description: "", coordinates: "" });
        fetchData(); // Обновляем все данные
      }
    } catch (error) {
      console.error("Ошибка сохранения достопримечательности:", error);
    }
  };

  const handleEditLandmark = (landmark: Landmark) => {
    setEditingLandmark(landmark);
    setLandmarkFormData({
      name: landmark.name,
      description: landmark.description,
      coordinates: landmark.coordinates,
    });
    setSelectedCityId(landmark.cityId);
    setShowLandmarkForm(true);
  };

  const handleDeleteLandmark = async (id: number) => {
    if (confirm("Удалить достопримечательность?")) {
      try {
        await fetch(`/api/landmarks/${id}`, { method: "DELETE" });
        fetchData();
      } catch (error) {
        console.error("Ошибка удаления достопримечательности:", error);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Управление достопримечательностями</h2>

      {/* Форма добавления/редактирования достопримечательности */}
      {showLandmarkForm && (
        <form onSubmit={handleLandmarkSubmit} className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-4">
            {editingLandmark ? "Редактировать достопримечательность" : "Добавить достопримечательность"}
          </h3>
          <div className="space-y-4">
            <select
              value={selectedCityId || ""}
              onChange={(e) => setSelectedCityId(Number(e.target.value))}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Выберите город</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Название"
              value={landmarkFormData.name}
              onChange={(e) =>
                setLandmarkFormData({ ...landmarkFormData, name: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Описание"
              value={landmarkFormData.description}
              onChange={(e) =>
                setLandmarkFormData({ ...landmarkFormData, description: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
              rows={3}
            />
            <input
              type="text"
              placeholder="Координаты (широта,долгота)"
              value={landmarkFormData.coordinates}
              onChange={(e) =>
                setLandmarkFormData({ ...landmarkFormData, coordinates: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                {editingLandmark ? "Обновить" : "Создать"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLandmarkForm(false);
                  setEditingLandmark(null);
                  setLandmarkFormData({ name: "", description: "", coordinates: "" });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Кнопка добавления достопримечательности */}
      <button
        onClick={() => setShowLandmarkForm(true)}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Добавить достопримечательность
      </button>

      {/* Список городов с достопримечательностями */}
      <div className="space-y-6">
        {landmarksByCity.map(({ city, landmarks }) => (
          <div key={city.id} className="border rounded p-4">
            <h3 className="text-xl font-bold mb-4">{city.name}</h3>
            <p className="text-gray-600 mb-3">
              Координаты: {city.coordinates} | Уровень зума: {city.zoomLevel}
            </p>

                        {/* Список достопримечательностей для города */}
            {landmarks.length > 0 ? (
              <div className="grid gap-3">
                {landmarks.map((landmark) => (
                  <div
                    key={landmark.id}
                    className="p-3 border rounded flex justify-between items-center bg-gray-50"
                  >
                    <div>
              <h4 className="font-semibold">{landmark.name}</h4>
              <p className="text-sm text-gray-700">{landmark.description}</p>
              <p className="text-sm text-gray-600">Координаты: {landmark.coordinates}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditLandmark(landmark)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                aria-label={`Редактировать достопримечательность ${landmark.name}`}
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDeleteLandmark(landmark.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                aria-label={`Удалить достопримечательность ${landmark.name}`}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 italic">В этом городе пока нет достопримечательностей</p>
    )}
  </div>
))}
</div>
</div>
  );
}
