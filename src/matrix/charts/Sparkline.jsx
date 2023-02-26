export default function Sparkline({ sparkData = [1, 2, 5, 3, 3], maxValue }) {
  if (typeof sparkData === "object") {
    sparkData = Object.values(sparkData);
  }

  const interval = 300 / (sparkData.length - 1);

  let xData = Array(sparkData.length);

  for (let i = 0; i < sparkData.length; i++) {
    xData[i] = i * interval + 5;
  }

  const yData = sparkData.map((x) => (-120 / maxValue) * x + 125);

  let dVar = `M ${xData[0]} ${yData[0]} L `;

  for (let i = 1; i < sparkData.length; i++) {
    dVar += `${xData[i]} ${yData[i]} `;
  }

  return (
    <div className="sparkline-container">
      <svg width="100%" height="100%" viewBox="0 0 310 130">
        <path
          d={dVar}
          style={{ fill: "none", stroke: "#0d79f2", strokeWidth: "5px" }}
        />
      </svg>
    </div>
  );
}
