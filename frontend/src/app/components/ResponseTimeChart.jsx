"use client";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ResponseTimeChart({ data }) {
  // Ensure data is an array and handle cases where it might not be
  const chartData = {
    labels: Array.isArray(data) ? data.map(item => item.intent) : [],
    datasets: [
      {
        label: 'Response Time (seconds)',
        data: Array.isArray(data) ? data.map(item => item.time) : [],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Response Time by Intent',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Seconds',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Intents',
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}