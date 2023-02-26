import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const ruleSelect = (e) => {
  // console.log(e.current.querySelector(".rule-match"));
};

export const RuleCard = ({
  id,
  match,
  condition,
  permissions,
  index,
  moveCard,
  styleVar,
}) => {
  return (
    <div
      // ref={ref}
      className={"rule-card " + styleVar.join(" ")}
      // data-handler-id={handlerId}
      // onClick={() => ruleSelect(ref)}
    >
      <span className="rule-id-container">
        RUL<span className="rule-id">{id}</span>
      </span>
      <div className="rule-match">
        {/* Resource: <span className="match-statement">{match}</span> */}
        Resource:{maskMatch(match)}
      </div>
      <div className="rule-condition">
        {/* Condition: <span className="condition-statement">{condition}</span> */}
        Users: {maskCondition(condition)}
      </div>
      {/* <div className="rule-permissions" key={index}>
        {Object.keys(permissions).map((permission) => {
          return (
            <div key={permission}>
              <span>{permission}:&nbsp;</span>
              {permissions[permission].permission === "Set" ? (
                <span>Allow</span>
              ) : null}
              {permissions[permission].permission === "Clear" ? (
                <span>Deny</span>
              ) : null}
            </div>
          );
        })}
      </div> */}
      <div className="results-box">
        {styleVar.length ? (
          <>
            <span className="list-box">
              {styleVar.includes("hl-list")
                ? "🟢"
                : styleVar.includes("hl-list-false")
                ? "🔴"
                : "⚪️"}
            </span>
            <span className="get-box">
              {styleVar.includes("hl-get")
                ? "🟢"
                : styleVar.includes("hl-get-false")
                ? "🔴"
                : "⚪️"}
            </span>
            <span className="create-box">
              {styleVar.includes("hl-create")
                ? "🟢"
                : styleVar.includes("hl-create-false")
                ? "🔴"
                : "⚪️"}
            </span>
            <span className="update-box">
              {styleVar.includes("hl-update")
                ? "🟢"
                : styleVar.includes("hl-update-false")
                ? "🔴"
                : "⚪️"}
            </span>
            <span className="delete-box">
              {styleVar.includes("hl-delete")
                ? "🟢"
                : styleVar.includes("hl-delete-false")
                ? "🔴"
                : "⚪️"}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};

function maskCondition(condition) {
  let outcome = condition;
  if (condition.includes("[name")) outcome = "All users";
  return <span className="condition-statement">{outcome}</span>;
}
function maskMatch(condition) {
  let outcome = condition;
  outcome = outcome.replaceAll("[name]", "*");
  outcome = outcome.replaceAll("*", "{all}");
  return <span className="match-statement">{outcome}</span>;
}
