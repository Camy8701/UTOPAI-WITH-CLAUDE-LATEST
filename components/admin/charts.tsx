"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Line, Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

// Line Chart Component
export function LineChart() {
  const { theme } = useTheme()
  const chartRef = useRef<ChartJS>(null)

  const isDark = theme === "dark"
  const textColor = isDark ? "#CBD5E1" : "#475569"
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

  const data: ChartData<"line"> = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].slice(0, 7),
    datasets: [
      {
        label: "Page Views",
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Unique Visitors",
        data: [8000, 12000, 10000, 15000, 14000, 18000, 16000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  }

  useEffect(() => {
    // Update chart when theme changes
    const chart = chartRef.current
    if (chart) {
      chart.update()
    }
  }, [theme])

  return (
    <div className="h-[300px]">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}

// Bar Chart Component
export function BarChart() {
  const { theme } = useTheme()
  const chartRef = useRef<ChartJS>(null)

  const isDark = theme === "dark"
  const textColor = isDark ? "#CBD5E1" : "#475569"
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

  const data: ChartData<"bar"> = {
    labels: ["Articles", "Stories", "News", "Tutorials", "Reviews"],
    datasets: [
      {
        label: "Views",
        data: [4500, 3200, 2800, 1900, 2200],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  }

  useEffect(() => {
    // Update chart when theme changes
    const chart = chartRef.current
    if (chart) {
      chart.update()
    }
  }, [theme])

  return (
    <div className="h-[300px]">
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  )
}

// Pie Chart Component
export function PieChart() {
  const { theme } = useTheme()
  const chartRef = useRef<ChartJS>(null)

  const isDark = theme === "dark"
  const textColor = isDark ? "#CBD5E1" : "#475569"

  const data: ChartData<"pie"> = {
    labels: ["New Users", "Returning Users", "Premium Users", "Trial Users"],
    datasets: [
      {
        data: [35, 45, 15, 5],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(139, 92, 246, 0.7)",
        ],
        borderColor: isDark ? "#1E293B" : "#FFFFFF",
        borderWidth: 2,
      },
    ],
  }

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: textColor,
        },
      },
    },
  }

  useEffect(() => {
    // Update chart when theme changes
    const chart = chartRef.current
    if (chart) {
      chart.update()
    }
  }, [theme])

  return (
    <div className="h-[300px]">
      <Pie ref={chartRef} data={data} options={options} />
    </div>
  )
}
