import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";

import ExerciseSelect from "./Components/ExerciseSelect";
import DateRangePicker from "./Components/DateRangePicker";
import ResetZoomButton from "./Components/ResetZoomButton";

import styles from "./App.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  TimeScale,
  Filler
);

function parseTopSetWeight(topSetStr) {
  if (!topSetStr) return null;
  const parts = topSetStr.split("×");
  if (parts.length !== 2) return null;
  const weight = parseFloat(parts[1]);
  return isNaN(weight) ? null : weight;
}

function parseDate(dateStr) {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [year, month, day] = parts;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export default function App() {
  const [data, setData] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const chartRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUnCxkoLIN27KGkhcOlsuJysQkibnjMoP8p_pF1Ik3gpLihKyGQQEIZ8gHqAVtsug37172EiTemRui/pub?gid=1438255772&single=true&output=csv"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load workouts.csv");
        return res.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data;
            const filtered = rows.filter(
              (row) =>
                row["Body Weight (LB)"] &&
                row["Top Set (Reps×LB)"] &&
                row["Exercise"] &&
                row["Date (yyyy/mm/dd)"]
            );
            const uniqueExercises = [
              ...new Set(filtered.map((r) => r["Exercise"])),
            ].sort();
            setExercises(uniqueExercises);
            setData(filtered);

            const dates = filtered
              .map((r) => parseDate(r["Date (yyyy/mm/dd)"]))
              .filter((d) => d !== null)
              .sort((a, b) => a - b);

            if (dates.length) {
              setDateRange({
                from: dates[0].toISOString().slice(0, 10),
                to: dates[dates.length - 1].toISOString().slice(0, 10),
              });
            }
          },
          error: (err) => {
            setError(err.message);
          },
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  // Filter data by selected exercise and date range
  const filteredData = selectedExercise
    ? data.filter((row) => {
        if (row["Exercise"] !== selectedExercise) return false;
        const date = parseDate(row["Date (yyyy/mm/dd)"]);
        if (!date) return false;
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      })
    : [];

  filteredData.sort(
    (a, b) =>
      parseDate(a["Date (yyyy/mm/dd)"]) - parseDate(b["Date (yyyy/mm/dd)"])
  );

  const chartData = {
    labels: filteredData.map((row) => parseDate(row["Date (yyyy/mm/dd)"])),
    datasets: [
      {
        label: "Body Weight (LB)",
        data: filteredData.map((row) => parseFloat(row["Body Weight (LB)"])),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        tension: 0.3,
        yAxisID: "y",
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
      },
      {
        label: "Top Set Weight (LB)",
        data: filteredData.map((row) =>
          parseTopSetWeight(row["Top Set (Reps×LB)"])
        ),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        tension: 0.3,
        yAxisID: "y",
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    interaction: { mode: "nearest", intersect: false },
    stacked: false,
    plugins: {
      legend: {
        labels: { color: "#1f2937", font: { weight: "700", size: 14 } },
      },
      title: {
        display: true,
        text: selectedExercise
          ? `Body Weight vs Top Set Weight: ${selectedExercise}`
          : "Select an exercise to view chart",
        color: "#1f2937",
        font: { size: 20, weight: "700" },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        titleColor: "#3b82f6",
        bodyColor: "#f9fafb",
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: "#3b82f6",
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(1)} lb`;
          },
          title: (contexts) => {
            if (!contexts.length) return "";
            const date = contexts[0].label;
            return new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
          modifierKey: "ctrl",
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: "ctrl",
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "MMM dd yyyy",
          unit: "day",
          displayFormats: {
            day: "MMM dd",
          },
        },
        ticks: { color: "#6b7280", font: { weight: "600", size: 13 } },
        grid: { color: "#e5e7eb", borderColor: "#e5e7eb" },
      },
      y: {
        type: "linear",
        position: "left",
        ticks: { color: "#6b7280", font: { weight: "600", size: 13 } },
        grid: { color: "#e5e7eb", borderColor: "#e5e7eb" },
        title: {
          display: true,
          text: "Weight (LB)",
          color: "#6b7280",
          font: { weight: "700" },
        },
      },
    },
  };

  const resetZoom = () => {
    if (!chartRef.current) return;
    chartRef.current.resetZoom();
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1>Fitness Tracker</h1>
      </header>

      {error && <p className={styles.errorMessage}>Error: {error}</p>}

      {data.length > 0 ? (
        <>
          <div className={styles.controlsRow}>
            <ExerciseSelect
              exercises={exercises}
              selectedExercise={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            />

            <DateRangePicker
              dateRange={dateRange}
              onFromChange={(e) =>
                setDateRange((dr) => ({ ...dr, from: e.target.value }))
              }
              onToChange={(e) =>
                setDateRange((dr) => ({ ...dr, to: e.target.value }))
              }
            />

            <ResetZoomButton onClick={resetZoom} />
          </div>

          {selectedExercise && filteredData.length > 0 ? (
            <div className={styles.chartContainer}>
              <Line ref={chartRef} data={chartData} options={options} />
            </div>
          ) : selectedExercise ? (
            <p className={styles.placeholderText}>
              No data available for this exercise in the selected date range.
            </p>
          ) : (
            <p className={styles.placeholderText}>
              Please select an exercise above to display the chart.
            </p>
          )}
        </>
      ) : (
        <p className={styles.loadingText}>Loading workout data...</p>
      )}

      <footer className={styles.footer}>
        {" "}
        &copy; Diego Renzo Sariol. <br />
        All rights reserved
      </footer>
    </div>
  );
}
