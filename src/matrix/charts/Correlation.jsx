import "../../../styles/Correlation.css";

export default function Correlation({ x1, max1, x2, max2 }) {
  if (typeof x1 === "number" && typeof x2 === "string") {
    return <span>No Auth</span>;
  }

  if (typeof x1 === "string" && typeof x2 === "string") {
    return <span>0</span>;
  }
  const percent1 = (x1 / max1) * 100;
  const percent2 = (x2 / max2) * 100;

  let diff = Math.abs(percent1 - percent2);
  diff = Math.round(diff);

  return (
    <div
      className="correlation-result"
      style={{
        backgroundColor: `hsl(${percent1}, 100%, 50%)`,
        color: `hsl(${diff}, 100%, 50%)`,
      }}
    >
      {diff}
    </div>
  );
}
