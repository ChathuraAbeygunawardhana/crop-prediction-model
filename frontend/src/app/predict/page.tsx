"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import CustomDropdown, { DropdownOption } from "@/components/CustomDropdown";
import InfoTooltip from "@/components/InfoTooltip";

const numericInputs = [
  { name: "N", label: "Nitrogen (N)", tooltip: "Soil Nitrogen content (0 - 150 kg/ha)", placeholder: "e.g. 90.0", step: 1 },
  { name: "P", label: "Phosphorus (P)", tooltip: "Soil Phosphorus content (5 - 145 kg/ha)", placeholder: "e.g. 42.0", step: 1 },
  { name: "K", label: "Potassium (K)", tooltip: "Soil Potassium content (5 - 205 kg/ha)", placeholder: "e.g. 43.0", step: 1 },
  { name: "pH", label: "pH Level", tooltip: "Soil acidity/alkalinity (3.5 - 9.0)", placeholder: "e.g. 6.5", step: 0.1 },
  { name: "EC", label: "EC", tooltip: "Electrical Conductivity / Salinity (0.1 - 2.5 dS/m)", placeholder: "e.g. 1.2", step: 0.1 },
  { name: "Temperature", label: "Temperature", tooltip: "Average temperature (10.0 - 45.0 °C)", placeholder: "e.g. 20.8", step: 0.1 },
  { name: "Humidity", label: "Humidity", tooltip: "Relative air humidity (20 - 100 %)", placeholder: "e.g. 82.0", step: 1 },
  { name: "Rainfall", label: "Rainfall", tooltip: "Annual rainfall (20 - 3000 mm)", placeholder: "e.g. 202.9", step: 0.1 },
  { name: "Elevation", label: "Elevation", tooltip: "Height above sea level (0 - 2500 m)", placeholder: "e.g. 400.0", step: 1 },
] as const;

const soilOptions: DropdownOption[] = [
  { value: "Low Humic Gley", label: "Low Humic Gley" },
  { value: "Non-Calcic Brown", label: "Non-Calcic Brown" },
  { value: "Latosols", label: "Latosols" },
  { value: "Alluvial", label: "Alluvial" },
  { value: "Red Básico", label: "Red Básico" },
  { value: "Red-Yellow Podzolic", label: "Red-Yellow Podzolic" },
  { value: "Immature Brown Loams", label: "Immature Brown Loams" },
];

const zoneOptions: DropdownOption[] = [
  { value: "Wet", label: "Wet" },
  { value: "Dry", label: "Dry" },
  { value: "Intermediate", label: "Intermediate" },
];

const waterSourceOptions: DropdownOption[] = [
  { value: "1", label: "Irrigated (1)" },
  { value: "0", label: "Rainfed (0)" },
];

export default function Home() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    pH: "",
    EC: "",
    Temperature: "",
    Humidity: "",
    Rainfall: "",
    Elevation: "",
    Soil_Type: "",
    Zone: "",
    Water_Source: "",
  });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    setResult(null);

    try {
      // Validate string fields and convert numbers
      const payload = {
        N: Number(formData.N),
        P: Number(formData.P),
        K: Number(formData.K),
        pH: Number(formData.pH),
        EC: Number(formData.EC),
        Temperature: Number(formData.Temperature),
        Humidity: Number(formData.Humidity),
        Rainfall: Number(formData.Rainfall),
        Elevation: Number(formData.Elevation),
        Soil_Type: formData.Soil_Type,
        Zone: formData.Zone,
        Water_Source: Number(formData.Water_Source),
      };

      // Use environment variable for the API URL, fallback to local URL for development
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Prediction failed");
      }

      const data = await res.json();
      setResult(`Optimal Crop: ${data.prediction}`);
    } catch (error) {
      console.error(error);
      setResult("Error: Could not retrieve prediction");
    } finally {
      setIsPredicting(false);
    }
  };

  const fillTemplate = (type: "paddy" | "kurakkan") => {
    if (type === "paddy") {
      setFormData({
        N: "90.0", P: "42.0", K: "43.0", pH: "6.5", EC: "1.2",
        Temperature: "20.8", Humidity: "82.0", Rainfall: "202.9",
        Elevation: "400.0", Soil_Type: "Low Humic Gley", Zone: "Wet", Water_Source: "1"
      });
    } else {
      setFormData({
        N: "40.0", P: "20.0", K: "20.0", pH: "6.0", EC: "0.8",
        Temperature: "28.5", Humidity: "60.0", Rainfall: "80.0",
        Elevation: "200.0", Soil_Type: "Non-Calcic Brown", Zone: "Dry", Water_Source: "0"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep = (name: string, stepAmount: number) => {
    setFormData((prev) => {
      const val = parseFloat(prev[name as keyof typeof prev]) || 0;
      let newVal = val + stepAmount;
      if (stepAmount < 1) {
        newVal = Math.round(newVal * 10) / 10;
      } else {
        newVal = Math.round(newVal);
      }
      return { ...prev, [name]: newVal.toString() };
    });
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 md:pt-24 items-center bg-neon-50 dark:bg-neon-950 transition-colors duration-500 font-sans selection:bg-neon-300 selection:text-neon-950 dark:selection:bg-neon-700 dark:selection:text-neon-50">

      {/* Background accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-300 dark:bg-neon-800 opacity-20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <main className="w-full max-w-4xl px-6 flex flex-col items-center animate-fade-in-up">
        {/* Header Section */}
        <div className="w-full max-w-xl mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-neon-800 dark:text-neon-400 hover:text-neon-950 dark:hover:text-neon-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Home
          </Link>
          <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold tracking-wide border rounded-full border-neon-400 dark:border-neon-800 bg-white/50 dark:bg-neon-900/50 backdrop-blur-sm text-neon-950 dark:text-neon-400 cursor-default">
            <span className="flex w-1.5 h-1.5 rounded-full bg-neon-900 dark:bg-neon-100 mr-2 animate-pulse" />
            V1.0 Online
          </div>
        </div>
        <div className="flex gap-3 mb-6 animate-fade-in-up">
          <button
            onClick={() => fillTemplate("paddy")}
            className="px-4 py-2 text-xs font-medium rounded-full bg-neon-200 dark:bg-neon-800 text-neon-950 dark:text-neon-200 hover:bg-neon-300 dark:hover:bg-neon-700 transition cursor-pointer"
          >
            Load Template: Paddy
          </button>
          <button
            onClick={() => fillTemplate("kurakkan")}
            className="px-4 py-2 text-xs font-medium rounded-full bg-neon-200 dark:bg-neon-800 text-neon-950 dark:text-neon-200 hover:bg-neon-300 dark:hover:bg-neon-700 transition cursor-pointer"
          >
            Load Template: Kurakkan
          </button>
        </div>

        {/* Prediction Form Section */}
        <div className="w-full max-w-xl glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neon-400/50 dark:border-neon-800/50 relative backdrop-blur-xl bg-white/60 dark:bg-neon-900/40">
          <form onSubmit={handlePredict} className="flex flex-col gap-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {numericInputs.map((input) => (
                <div key={input.name} className="space-y-1.5">
                  <label className="flex items-center text-xs font-semibold text-neon-950 dark:text-neon-400 uppercase tracking-wider">
                    {input.label}
                    <InfoTooltip content={input.tooltip} />
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      step="any"
                      name={input.name}
                      required
                      value={formData[input.name as keyof typeof formData]}
                      className="w-full h-11 pl-4 pr-10 rounded-lg bg-neon-100/50 dark:bg-neon-800/50 border border-neon-400 dark:border-neon-700/50 focus:outline-none focus:ring-2 focus:ring-neon-900 dark:focus:ring-neon-100 transition-all text-neon-950 dark:text-neon-200 placeholder-neon-400 disabled:opacity-50 no-spin-button"
                      placeholder={input.placeholder}
                      onChange={handleChange}
                      disabled={isPredicting}
                    />
                    <div className="absolute right-1 top-1 bottom-1 flex flex-col justify-center gap-[2px] opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => handleStep(input.name, input.step)}
                        disabled={isPredicting}
                        className="flex items-center justify-center w-6 h-[18px] text-neon-700 hover:text-neon-950 dark:text-neon-400 dark:hover:text-neon-100 bg-neon-200/50 hover:bg-neon-300 dark:bg-neon-700/50 dark:hover:bg-neon-600 rounded cursor-pointer transition-colors"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => handleStep(input.name, -input.step)}
                        disabled={isPredicting}
                        className="flex items-center justify-center w-6 h-[18px] text-neon-700 hover:text-neon-950 dark:text-neon-400 dark:hover:text-neon-100 bg-neon-200/50 hover:bg-neon-300 dark:bg-neon-700/50 dark:hover:bg-neon-600 rounded cursor-pointer transition-colors"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <CustomDropdown
                label="Soil Type"
                name="Soil_Type"
                value={formData.Soil_Type}
                options={soilOptions}
                onChange={handleChange as any}
                disabled={isPredicting}
                tooltip="Natural category of soil (e.g., Alluvial)"
              />
              <CustomDropdown
                label="Zone"
                name="Zone"
                value={formData.Zone}
                options={zoneOptions}
                onChange={handleChange as any}
                disabled={isPredicting}
                tooltip="Agro-ecological zone corresponding to climate"
              />
              <CustomDropdown
                label="Water Source"
                name="Water_Source"
                value={formData.Water_Source}
                options={waterSourceOptions}
                onChange={handleChange as any}
                disabled={isPredicting}
                tooltip="Primary source of water (1: Irrigated, 0: Rainfed)"
              />
            </div>

            <button
              type="submit"
              disabled={isPredicting}
              className="cursor-pointer mt-2 group relative w-full h-12 flex items-center justify-center rounded-lg bg-neon-900 dark:bg-neon-100 text-neon-50 dark:text-neon-900 font-medium hover:bg-neon-800 dark:hover:bg-neon-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-900 dark:focus:ring-offset-neon-950 dark:focus:ring-neon-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPredicting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-neon-400 border-t-neon-50 dark:border-neon-500 dark:border-t-neon-900 animate-spin" />
                  <span>Analyzing Data...</span>
                </div>
              ) : (
                <span>Generate Prediction</span>
              )}
            </button>
          </form>

          {/* Result Slide-down */}
          <div className={`mt-6 overflow-hidden transition-all duration-500 ease-in-out ${result ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="p-4 rounded-lg border border-neon-400 dark:border-neon-700/50 bg-white/80 dark:bg-neon-800/80 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-xs text-neon-950 dark:text-neon-400 uppercase font-semibold tracking-wider">Analysis Complete</p>
                <p className="text-lg font-medium text-neon-950 dark:text-neon-50">{result}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-neon-100 dark:bg-neon-900 flex items-center justify-center">
                <svg className="w-5 h-5 text-neon-950 dark:text-neon-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
