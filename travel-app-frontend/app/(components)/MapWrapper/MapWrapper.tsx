"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const RussiaMapNoSSR = dynamic(() => import("../RussiaMap/RussiaMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <p>Загрузка карты...</p>
    </div>
  ),
});

interface MapWrapperProps {
  cities: {
    id: number;
    name: string;
    coordinates: string;
    attractions?: {
      id: number;
      name: string;
      coordinates: string;
      cityId: number;
      description?: string;
    }[];
  }[];
}

export default function MapWrapper({ cities }: MapWrapperProps) {
  return <RussiaMapNoSSR cities={cities} />;
}
