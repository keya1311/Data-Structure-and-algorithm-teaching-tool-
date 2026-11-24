import type { BinarySearchStep } from "./types";

export default function BinarySearchArray({
  values,
  target,
  step,
}: {
  values: number[];
  target: number;
  step: BinarySearchStep;
}) {
  return (
    <div>
      <p>
        Target: <strong>{target}</strong> · Low: {step.low} · High: {step.high}{" "}
        · Mid: {step.mid ?? "not chosen"}
      </p>
      <ol className="search-values" aria-label="Array values and indexes">
        {values.map((value, index) => {
          const excluded = index < step.low || index > step.high;
          const labels = [
            step.low === index && "LOW",
            step.high === index && "HIGH",
            step.mid === index && "MID",
            step.operation === "found" && step.mid === index && "FOUND",
            excluded && "EXCLUDED",
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <li
              key={index}
              className={`${excluded ? "excluded-value " : ""}${step.mid === index ? "mid-value" : ""}`}
            >
              <span>Index {index}</span>
              <strong>{value}</strong>
              <small>{labels || "Candidate"}</small>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
