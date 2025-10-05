// src/components/WeatherPredictor.js

"use client";
import React, { useState } from "react";

export default function WeatherPredictor() {
  const [val, setVal] = useState(null);

  const getHumidityCategory = (val) => {
    if (val < 50) return { text: "Kering", color: "text-yellow-600" };
    if (val < 70) return { text: "Normal/Nyaman", color: "text-green-600" };
    if (val < 85) return { text: "Lembab", color: "text-blue-600" };
    return { text: "Sangat Lembab", color: "text-blue-800" };
  };

  const getAnginCategory = (value) => {
    if (!value) return { text: "", color: "" };
    if (value < 10) return { text: "Tenang", color: "text-gray-500" };
    if (value < 20) return { text: "Sejuk", color: "text-green-500" };
    if (value < 30) return { text: "Berangin", color: "text-blue-500" };
    return { text: "Kencang", color: "text-red-500" };
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Prediksi Cuaca</h1>
      {/* contoh tampilan */}
      {val !== null && (
        <p className={getHumidityCategory(val).color}>
          {getHumidityCategory(val).text}
        </p>
      )}
    </div>
  );
}
