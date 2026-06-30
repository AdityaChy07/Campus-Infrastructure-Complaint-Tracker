import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function DashboardChart({ title, stats }) {
  const data = {
    labels: [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ],
    datasets: [
      {
        data: [
          stats?.pending || 0,
          stats?.inProgress || 0,
          stats?.resolved || 0,
          stats?.rejected || 0,
        ],
        backgroundColor: [
          "#facc15", // Pending - yellow
          "#38bdf8", // In Progress - blue
          "#22c55e", // Resolved - green
          "#ef4444", // Rejected - red
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div
        style={{
          height: "300px",
          marginTop: "20px",
        }}
      >
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default DashboardChart;