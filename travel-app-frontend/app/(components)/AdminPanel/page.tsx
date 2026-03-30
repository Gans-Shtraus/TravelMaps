// components/AdminPanel.tsx
"use client";

import { useState } from "react";
import CityManagement from "@/app/(B2Logic)/CityManagement/CityManagement";
import LandmarkManagement from "@/app/(B2Logic)/LandmarkManagement/LandmarkManagement";
import styles from "./style.module.css";

interface AdminPanelProps {
  initialTab?: "cities" | "landmarks";
}

export default function AdminPanel({ initialTab = "cities" }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"cities" | "landmarks">(initialTab);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tab: "cities" | "landmarks") => {
    if (activeTab === tab) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Админ‑панель</h1>

      {/* Вкладки */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === "cities" ? styles.active : ""}`}
          onClick={() => handleTabChange("cities")}
          aria-selected={activeTab === "cities"}
          disabled={isTransitioning}
        >
          Города
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "landmarks" ? styles.active : ""}`}
          onClick={() => handleTabChange("landmarks")}
          aria-selected={activeTab === "landmarks"}
          disabled={isTransitioning}
        >
          Достопримечательности
        </button>
      </div>

      {/* Контент вкладок */}
      <div
        className={`${styles.content} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
      >
        {activeTab === "cities" && <CityManagement />}
        {activeTab === "landmarks" && <LandmarkManagement />}
      </div>

      {/* Индикатор загрузки */}
      {isTransitioning && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Переключение вкладки...</p>
        </div>
      )}
    </div>
  );
}
