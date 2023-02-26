import "../../../styles/BarChart.css";

export default function BarChart({ x1, max1, x2, max2 }) {
  const abs1 = x1 / max1;
  const abs2 = x2 / max2;

  const scaled1 = abs1 * 80;
  const scaled2 = abs2 * 80;
  let exists1 = 10;
  if (x1 === "") exists1 = 0;
  let exists2 = 10;
  if (x2 === "") exists2 = 0;

  return (
    <div className="barchart-container">
      <svg width="100%" height="100%" viewBox="0 0 130 130">
        <circle
          cx="33"
          cy={100 - scaled1}
          r={exists1}
          stroke="green"
          strokeWidth="4"
          fill="yellow"
        />
        <circle
          cx="66"
          cy={100 - scaled2}
          r={exists2}
          stroke="blue"
          strokeWidth="4"
          fill="orange"
        />
      </svg>
    </div>
  );
}
