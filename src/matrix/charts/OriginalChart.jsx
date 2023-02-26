import "../../../styles/BarChart.css";

export default function BarChart({ x1, max1, x2, max2 }) {
  return (
    <div
      className="barchart-container"
      style={{ backgroundColor: `hsl(0, 0%, ${-x1 * 10 + 100}%` }}
    >
      <svg width="100%" height="100%" viewBox="0 0 130 130">
        <circle
          cx="65"
          cy="65"
          r={x2 * 10}
          stroke="black"
          strokeWidth="4"
          fill="black"
        />
      </svg>
    </div>
  );
}
