export default function Violin({ permissions }) {
  permissions.forEach((permission, index) => {
    if (permission === undefined) permissions[index] = 0;
  });

  return (
    <div className="violin-container">
      <svg width="100%" height="100%" viewBox="0 0 220 120">
        <g className="labels x-labels">
          <text x="5" y="95">
            L
          </text>
          <circle
            className="dotplot-circle"
            cx="10"
            cy="50"
            r={permissions[0] ? 10 : 0}
          />

          <text x="52.5" y="95">
            G
          </text>
          <circle
            className="dotplot-circle"
            cx="57.5"
            cy="50"
            r={permissions[1] ? 10 : 0}
          />

          <text x="100" y="95">
            C
          </text>
          <circle
            className="dotplot-circle"
            cx="105"
            cy="50"
            r={permissions[2] ? 10 : 0}
          />

          <text x="147.5" y="95">
            U
          </text>
          <circle
            className="dotplot-circle"
            cx="152.5"
            cy="50"
            r={permissions[3] ? 10 : 0}
          />

          <text x="195" y="95">
            D
          </text>
          <circle
            className="dotplot-circle"
            cx="200"
            cy="50"
            r={permissions[4] ? 10 : 0}
          />
        </g>
      </svg>
    </div>
  );
}
