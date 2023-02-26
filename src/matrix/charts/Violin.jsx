import "../../../styles/Violin.css";

export default function Violin({ sparkData }) {
  return (
    <div className="violin-container">
      <svg width="100%" height="100%" viewBox="0 0 200 120">
        <g className="labels x-labels">
          <text x="5" y="95">
            G
          </text>
          <circle
            className="dotplot-circle"
            cx="10"
            cy="50"
            r={sparkData[0] > 2 ? 10 : 0}
          />

          <text x="52.5" y="95">
            L
          </text>
          <circle
            className="dotplot-circle"
            cx="57.5"
            cy="50"
            r={sparkData[1] > 2 ? 10 : 0}
          />

          <text x="100" y="95">
            C
          </text>
          <circle
            className="dotplot-circle"
            cx="105"
            cy="50"
            r={sparkData[2] > 2 ? 10 : 0}
          />

          <text x="147.5" y="95">
            U
          </text>
          <circle
            className="dotplot-circle"
            cx="152.5"
            cy="50"
            r={sparkData[3] > 2 ? 10 : 0}
          />

          <text x="195" y="95">
            D
          </text>
          <circle
            className="dotplot-circle"
            cx="200"
            cy="50"
            r={sparkData[4] > 2 ? 10 : 0}
          />
        </g>
      </svg>
    </div>
  );
}
