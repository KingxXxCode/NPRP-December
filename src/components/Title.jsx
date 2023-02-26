import { Experiment } from "../logging/Experiment";
import { Questions } from "../logging/Questions";

export function Title({
  viewOptions,
  setViewOptions,
  qindexState,
  setQIndexState,
  trainState,
  setTrainState,
  eindexState,
  setEIndexState,
}) {
  function Key() {
    return (
      <div className="key">
        <div>
          <span>list, </span>
          <span>get, </span>
          <span>create, </span>
          <span>update, </span>
          <span>delete</span>
        </div>
        <div>🟢: Granted by a rule</div>
        <div>🔴: Denied by a rule</div>
        <div>⚪️: Denied by default</div>
      </div>
    );
  }

  return (
    <div className="title flex-row space-between nowrap" logsource="Title">
      {/* <Key /> */}
      {viewOptions.titlePage === "Title" && (
        <>
          <h1>Graphical Tools for Security Policies</h1>
        </>
      )}
      {viewOptions.titlePage === "Training" && (
        <Questions
          qindexState={qindexState}
          setQIndexState={setQIndexState}
          trainState={trainState}
          setTrainState={setTrainState}
          viewOptions={viewOptions}
          setViewOptions={setViewOptions}
        />
      )}
      {viewOptions.titlePage === "Experiment" && (
        <Experiment
          eindexState={eindexState}
          setEIndexState={setEIndexState}
          trainState={trainState}
          setTrainState={setTrainState}
          viewOptions={viewOptions}
          setViewOptions={setViewOptions}
        />
      )}
      {/* <div className="padding"></div> */}
    </div>
  );
}
