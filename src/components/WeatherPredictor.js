// src/components/WeatherPredictor.js

"use client";
import React, { useState } from 'react';
import { Cloud, Wind, Sun, CloudRain, Thermometer, Droplets, Eye, Loader2, Info } from 'lucide-react';

export default function WeatherPredictor() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [bmkgData, setBmkgData] = useState(null);
  
  const [weatherParams, setWeatherParams] = useState({
    suhu: '',
    kelembaban: '',
    angin: '',
    kondisiLangit: 'cerah',
    tekananUdara: '',
    visibility: '',
    lokasi: 'Jakarta'
  });

  const kondisiLangitOptions = [
    { value: 'cerah', label: 'Cerah' },
    { value: 'berawan', label: 'Berawan' },
    { value: 'mendung', label: 'Mendung' },
    { value: 'hujan-ringan', label: 'Hujan Ringan' },
    { value: 'hujan-lebat', label: 'Hujan Lebat' }
  ];

  const lokasiOptions = [
    'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang',
    'Makassar', 'Palembang', 'Denpasar', 'Yogyakarta', 'Malang'
  ];

  const getKelembabanCategory = (value) => {
    if (!value) return { text: '', color: '' };
    const val = parseFloat(value);
    if (val < 30) return { text: 'Sangat Kering', color: 'text-orange-600' };
    if (val < 50) return { text: 'Kering', color: 'text-yellow-600' };
    if (val < 70) return { text: 'Normal/Nyaman', color: 'text-green-600' };
    if (val < 85) return { text: 'Lembab', color: 'text-blue-600' };
    return { text: 'Sangat Lembab', color: 'text-blue-800' };
  };

  const getAnginCategory = (value) => {
    if (!value) return { text: '', color: '' };
    const val = parseFloat(value);
    if (val < 5) return { text: 'Tenang (Angin Sangat Lemah)', color: 'text-gray-500' };
    if (val < 12) return { text: 'Sepoi-sepoi (Angin Lemah)', color: 'text-green-600' };
    if (val < 20) return { text: 'Sedang (Angin Terasa)', color: 'text-blue-600' };
    if (val < 30) return { text: 'Kencang (Angin Kuat)', color: 'text-orange-600' };
    if (val < 50) return { text: 'Sangat Kencang', color: 'text-red-600' };
    return { text: 'Berbahaya (Badai)', color: 'text-red-800' };
  };

  const getTekananCategory = (value) => {
    if (!value) return { text: '', color: '' };
    const val = parseFloat(value);
    if (val < 1000) return { text: 'Rendah (Potensi Hujan)', color: 'text-blue-600' };
    if (val < 1013) return { text: 'Sedikit Rendah', color: 'text-green-600' };
    if (val < 1020) return { text: 'Normal', color: 'text-gray-600' };
    return { text: 'Tinggi (Cuaca Cerah)', color: 'text-orange-600' };
  };

  const getVisibilityCategory = (value) => {
    if (!value) return { text: '', color: '' };
    const val = parseFloat(value);
    if (val < 1) return { text: 'Sangat Buruk (Kabut Tebal)', color: 'text-gray-700' };
    if (val < 4) return { text: 'Buruk (Berkabut)', color: 'text-gray-600' };
    if (val < 10) return { text: 'Sedang', color: 'text-yellow-600' };
    if (val < 20) return { text: 'Baik', color: 'text-green-600' };
    return { text: 'Sangat Baik (Jernih)', color: 'text-blue-600' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWeatherParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getBMKGData = async () => {
    try {
      const mockBMKGData = {
        lokasi: weatherParams.lokasi,
        suhuRataRata: 28,
        kelembabanRataRata: 75,
        tekananUdara: 1013,
        kecepatanAngin: 15,
        curahHujan: 5,
        prakiraan24jam: 'Berawan dengan kemungkinan hujan ringan',
        peringatan: 'Waspadai cuaca ekstrem pada sore hari'
      };
      
      return mockBMKGData;
    } catch (error) {
      console.error('Error fetching BMKG data:', error);
      return null;
    }
  };

  const getPredictionFromGemini = async (userInput, bmkgInfo) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const analysis = generateWeatherAnalysis(userInput, bmkgInfo);
    return analysis;
  };

  const generateWeatherAnalysis = (params, bmkg) => {
    const suhu = parseFloat(params.suhu) || 0;
    const kelembaban = parseFloat(params.kelembaban) || 0;
    const angin = parseFloat(params.angin) || 0;
    
    let analysis = `ANALISIS CUACA - ${params.lokasi.toUpperCase()}\n\n`;
    
    analysis += `KONDISI SAAT INI:\n`;
    if (suhu > 32) {
      analysis += `- Suhu ${suhu} C - Sangat Panas! Disarankan menghindari aktivitas outdoor.\n`;
    } else if (suhu > 28) {
      analysis += `- Suhu ${suhu} C - Panas, gunakan perlindungan dari sinar matahari.\n`;
    } else if (suhu > 24) {
      analysis += `- Suhu ${suhu} C - Hangat dan nyaman.\n`;
    } else {
      analysis += `- Suhu ${suhu} C - Sejuk.\n`;
    }

    if (kelembaban > 80) {
      analysis += `- Kelembaban ${kelembaban}% - Sangat lembab, terasa gerah.\n`;
    } else if (kelembaban > 60) {
      analysis += `- Kelembaban ${kelembaban}% - Lembab normal.\n`;
    } else {
      analysis += `- Kelembaban ${kelembaban}% - Udara cenderung kering.\n`;
    }

    if (angin < 5) {
      analysis += `- Angin ${angin} km/h - Angin sangat lemah, udara terasa pengap.\n`;
    } else if (angin < 15) {
      analysis += `- Angin ${angin} km/h - Angin sepoi-sepoi.\n`;
    } else if (angin < 30) {
      analysis += `- Angin ${angin} km/h - Angin cukup kencang.\n`;
    } else {
      analysis += `- Angin ${angin} km/h - Angin sangat kencang, waspadai!\n`;
    }

    analysis += `- Kondisi Langit: ${params.kondisiLangit}\n\n`;

    analysis += `PREDIKSI 6-12 JAM KE DEPAN:\n`;
    
    if (params.kondisiLangit === 'mendung' && kelembaban > 75) {
      analysis += `- Potensi hujan TINGGI (80-90%)\n`;
      analysis += `- Kemungkinan hujan dalam 2-4 jam ke depan\n`;
      analysis += `- Intensitas: Sedang hingga lebat\n`;
    } else if (params.kondisiLangit === 'berawan' && kelembaban > 65) {
      analysis += `- Potensi hujan SEDANG (50-70%)\n`;
      analysis += `- Kemungkinan hujan ringan sore/malam\n`;
    } else if (suhu > 30 && angin < 10 && kelembaban > 70) {
      analysis += `- Cuaca panas dan lembab\n`;
      analysis += `- Potensi pembentukan awan hujan di sore hari\n`;
    } else {
      analysis += `- Cuaca relatif stabil\n`;
      analysis += `- Tidak ada tanda-tanda perubahan signifikan\n`;
    }

    analysis += `\nREKOMENDASI:\n`;
    if (suhu > 32) {
      analysis += `- Perbanyak minum air putih\n`;
      analysis += `- Gunakan tabir surya dan topi\n`;
    }
    if (kelembaban > 80 || params.kondisiLangit === 'mendung') {
      analysis += `- Bawa payung atau jas hujan\n`;
    }
    if (angin > 25) {
      analysis += `- Waspadai benda-benda yang mudah terbang\n`;
    }

    analysis += `\nDATA REFERENSI BMKG:\n`;
    analysis += `- Prakiraan Resmi: ${bmkg.prakiraan24jam}\n`;
    analysis += `- ${bmkg.peringatan}\n`;

    return analysis;
  };

  const handlePredict = async () => {
    if (!weatherParams.suhu || !weatherParams.kelembaban || !weatherParams.angin) {
      alert('Mohon lengkapi data suhu, kelembaban, dan kecepatan angin!');
      return;
    }

    setLoading(true);
    setPrediction('');

    try {
      const bmkgInfo = await getBMKGData();
      setBmkgData(bmkgInfo);

      const aiPrediction = await getPredictionFromGemini(weatherParams, bmkgInfo);
      setPrediction(aiPrediction);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat memproses prediksi');
    } finally {
      setLoading(false);
    }
  };

  const kelembabanCat = getKelembabanCategory(weatherParams.kelembaban);
  const anginCat = getAnginCategory(weatherParams.angin);
  const tekananCat = getTekananCategory(weatherParams.tekananUdara);
  const visibilityCat = getVisibilityCategory(weatherParams.visibility);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Cloud size={40} />
              <h1 className="text-3xl font-bold">Prediksi Cuaca AI</h1>
            </div>
            <p className="text-center text-blue-100">Powered by Gemini AI & BMKG Data</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lokasi
                </label>
                <select
                  name="lokasi"
                  value={weatherParams.lokasi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {lokasiOptions.map(kota => (
                    <option key={kota} value={kota}>{kota}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Thermometer size={18} className="text-red-500" />
                  Suhu (Celcius) *
                </label>
                <input
                  type="number"
                  name="suhu"
                  value={weatherParams.suhu}
                  onChange={handleInputChange}
                  placeholder="Contoh: 32"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Info size={12} /> Range: 15-40 (Indonesia)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Droplets size={18} className="text-blue-500" />
                  Kelembaban (%) *
                </label>
                <input
                  type="number"
                  name="kelembaban"
                  value={weatherParams.kelembaban}
                  onChange={handleInputChange}
                  placeholder="Contoh: 75"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                {kelembabanCat.text && (
                  <p className={`text-sm font-semibold mt-1 ${kelembabanCat.color}`}>
                    {kelembabanCat.text}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Info size={12} /> 0-30: Kering | 30-50: Rendah | 50-70: Normal | 70-85: Lembab | 85-100: Sangat Lembab
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Wind size={18} className="text-gray-600" />
                  Kecepatan Angin (km/h) *
                </label>
                <input
                  type="number"
                  name="angin"
                  value={weatherParams.angin}
                  onChange={handleInputChange}
                  placeholder="Contoh: 5"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                {anginCat.text && (
                  <p className={`text-sm font-semibold mt-1 ${anginCat.color}`}>
                    {anginCat.text}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Info size={12} /> 0-5: Tenang | 5-12: Sepoi | 12-20: Sedang | 20-30: Kencang | 30+: Sangat Kencang
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Sun size={18} className="text-yellow-500" />
                  Kondisi Langit
                </label>
                <select
                  name="kondisiLangit"
                  value={weatherParams.kondisiLangit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {kondisiLangitOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tekanan Udara (hPa)
                </label>
                <input
                  type="number"
                  name="tekananUdara"
                  value={weatherParams.tekananUdara}
                  onChange={handleInputChange}
                  placeholder="Contoh: 1013"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                {tekananCat.text && (
                  <p className={`text-sm font-semibold mt-1 ${tekananCat.color}`}>
                    {tekananCat.text}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Info size={12} /> Kurang dari 1000: Rendah | 1000-1013: Sedikit Rendah | 1013-1020: Normal | 1020+: Tinggi
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Eye size={18} className="text-purple-500" />
                  Jarak Pandang (km)
                </label>
                <input
                  type="number"
                  name="visibility"
                  value={weatherParams.visibility}
                  onChange={handleInputChange}
                  placeholder="Contoh: 10"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                {visibilityCat.text && (
                  <p className={`text-sm font-semibold mt-1 ${visibilityCat.color}`}>
                    {visibilityCat.text}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Info size={12} /> 0-1: Sangat Buruk | 1-4: Buruk | 4-10: Sedang | 10-20: Baik | 20+: Sangat Baik
                </p>
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Menganalisis...
                </>
              ) : (
                <>
                  <CloudRain size={20} />
                  Prediksi Cuaca
                </>
              )}
            </button>
          </div>

          {prediction && (
            <div className="p-6 bg-gray-50 border-t-4 border-blue-500">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                Hasil Analisis AI
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                  {prediction}
                </pre>
              </div>
            </div>
          )}

          <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
            <p>Disclaimer: Ini adalah demo aplikasi. Untuk implementasi produksi, gunakan API resmi Gemini dan BMKG.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
