"use client";

import { useCities } from "./(hooks)/useCities";
import MapWrapper from "./(components)/MapWrapper/MapWrapper";

export default function Home() {
  const { cities, loading, error } = useCities();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "20px",
        }}
      >
        <p style={{ color: "red" }}>Ошибка загрузки данных: {error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MapWrapper cities={cities} />
    </div>
  );
}
