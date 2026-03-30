"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

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

type SearchResult =
  | { type: 'city'; city: City }
  | { type: 'attraction'; attraction: Attraction; cityName: string };

function SearchComponent({
  cities,
  onAttractionSelect,
  onCitySelect,
}: {
  cities: City[];
  onAttractionSelect: (attraction: Attraction, cityName: string) => void;
  onCitySelect: (city: City) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const map = useMap();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 1) {
      const results: SearchResult[] = [];

      // Поиск городов
      const cityResults = cities.filter(city =>
        city.name.toLowerCase().includes(term.toLowerCase())
      ).map(city => ({ type: 'city', city } as SearchResult));
      results.push(...cityResults);

      // Поиск достопримечательностей
      const attractionResults = cities.flatMap(city =>
        (city.attractions || []).map(attraction => ({ attraction, cityName: city.name }))
      ).filter(({ attraction }) =>
        attraction.name.toLowerCase().includes(term.toLowerCase()) ||
        (attraction.description || "").toLowerCase().includes(term.toLowerCase())
      ).map(({ attraction, cityName }) => ({
        type: 'attraction',
        attraction,
        cityName
      }) as SearchResult);
      results.push(...attractionResults);

      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchTerm(result.type === 'city' ? result.city.name : result.attraction.name);
    setFilteredResults([]);

    if (result.type === 'attraction') {
      onAttractionSelect(result.attraction, result.cityName);
      const [lat, lng] = result.attraction.coordinates.split(",").map(Number);
      map.setView([lat, lng], 15);
    } else {
      onCitySelect(result.city);
      const [latStr, lngStr] = result.city.coordinates.split(",");
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 10);
      }
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "300px",
      }}
    >
      <input
        type="text"
        placeholder="Поиск городов и достопримечательностей..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      />
      {filteredResults.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {filteredResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleResultClick(result)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                {result.type === 'city' ? result.city.name : result.attraction.name}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {result.type === 'city'
                  ? "Город"
                  : `Город: ${result.cityName}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const RussiaMap = ({ cities }: { cities: City[] }) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  const russiaBounds = [
    [30.0, -20.0],
    [85.0, 190.0],
  ];

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSelectedAttraction(null);
  };

  const handleAttractionSelect = (attraction: Attraction, cityName: string) => {
    setSelectedAttraction(attraction);
    setSelectedCity(null);
  };

  return (
    <MapContainer
      center={[60, 100]}
      zoom={3}
      style={{ height: "100vh", width: "100%" }}
      maxBounds={russiaBounds}
      maxBoundsViscosity={1.0}
      minZoom={2}
      maxZoom={18}
      crs={L.CRS.EPSG3857}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        noWrap={true}
        bounds={russiaBounds}
      />

      <SearchComponent
        cities={cities}
        onAttractionSelect={handleAttractionSelect}
        onCitySelect={handleCitySelect}
      />

      {/* Отображение городов */}
      {cities.map((city) => {
        const [latStr, lngStr] = city.coordinates.split(",");
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Некорректные координаты для города ${city.name}: ${city.coordinates}`);
          return null;
        }

        return (
          <Marker
            key={`city-${city.id}`}
            position={[lat, lng]}
            eventHandlers={{
              click: () => {
                setSelectedCity(city);
                setSelectedAttraction(null); // сбрасываем выбранную достопримечательность
              },
            }}
          >
            <Popup>
              <div>
                <h4>{city.name}</h4>
                {city.attractions && city.attractions.length > 0 && (
                  <p>Достопримечательностей: {city.attractions.length}</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

            {/* Отображение достопримечательностей */}
      {cities.map((city) =>
        city.attractions?.map((attraction) => {
          const [latStr, lngStr] = attraction.coordinates.split(",");
          const lat = parseFloat(latStr);
          const lng = parseFloat(lngStr);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Некорректные координаты для достопримечательности ${attraction.name}: ${attraction.coordinates}`);
            return null;
          }

          return (
            <Marker
              key={`attraction-${attraction.id}`}
              position={[lat, lng]}
              icon={L.divIcon({
                html: `<div style="background: #ff6b6b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">A</div>`,
                className: 'custom-marker'
              })}
              eventHandlers={{
                click: () => setSelectedAttraction(attraction)
              }}
            >
              <Popup>
                <div>
                  <h4>{attraction.name}</h4>
                  {attraction.description ? (
                    <p>{attraction.description}</p>
                  ) : (
                    <p><i>Описание отсутствует</i></p>
                  )}
                  <p><small>Город: {city.name}</small></p>
                </div>
              </Popup>
            </Marker>
          );
        })
      )}

      {/* Информация о выбранной достопримечательности */}
      {selectedAttraction && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <h3>Выбрана достопримечательность: {selectedAttraction.name}</h3>
          {selectedAttraction.description ? (
            <p>{selectedAttraction.description}</p>
          ) : (
            <p><i>Описание отсутствует</i></p>
          )}
          <p>
            <small>
              Город: {cities.find(c => c.id === selectedAttraction.cityId)?.name || 'Неизвестный город'}
            </small>
          </p>
          <button
            onClick={() => setSelectedAttraction(null)}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Закрыть
          </button>
        </div>
      )}

      {/* Информация о выбранном городе (если нет выбранной достопримечательности) */}
      {!selectedAttraction && selectedCity && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <h3>Выбран город: {selectedCity.name}</h3>
          {selectedCity.attractions && selectedCity.attractions.length > 0 ? (
            <div>
              <p>Достопримечательностей в городе: {selectedCity.attractions.length}</p>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {selectedCity.attractions.map(attraction => (
                  <li key={attraction.id}>
                    <strong>{attraction.name}</strong>
                    {attraction.description && (
              <span> — {attraction.description}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>В этом городе пока нет достопримечательностей</p>
  )}
  <button
    onClick={() => setSelectedCity(null)}
    style={{
      marginTop: "10px",
      padding: "5px 10px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Закрыть
  </button>
</div>
)}
</MapContainer>
);
};

export default RussiaMap;
