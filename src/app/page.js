// page.js — ini adalah Server Component (default) — boleh memanggil Client Component
import WeatherPredictor from "@/components/WeatherPredictor";

export default function HomePage() {
  return (
    <main>
      <h1>Weather Predictor</h1>
      <WeatherPredictor />
    </main>
  );
}
