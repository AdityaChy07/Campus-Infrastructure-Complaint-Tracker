import {
  Pie,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ComplaintChart({
  stats,
}) {
  const data = {
    labels: [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ],
    datasets: [
      {
        label:
          "Complaint Status",
        data: [
          stats.pending,
          stats.inProgress,
          stats.resolved,
          stats.rejected,
        ],
        backgroundColor: [
          "#facc15",
          "#3b82f6",
          "#22c55e",
          "#ef4444",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      style={{
        width: "350px",
        marginTop: "20px",
      }}
    >
      <Pie data={data} />
    </div>
  );
}

export default ComplaintChart;