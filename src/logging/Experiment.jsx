import { useState } from "react";
import { useEffect } from "react";
import "./Logging.css";
import experimentStruct from "../data/experimentstruct.json";

export function Experiment({
  eindexState,
  setEIndexState,
  trainState,
  setTrainState,
  viewOptions,
  setViewOptions,
}) {
  console.log(experimentStruct);
  let option = " ";
  let progressquiz = true;
  let progressoptions = true;
  let optionselected = " ";

  useEffect(() => {
    setTrainState(4);
  }, []);

  setViewOptions.trainState = 4;

  const DisplayEOptions = ({ questionrange, progressquiz, optionselected }) => {
    optionselected = option;
    console.log("optionselected", optionselected, option);

    return experimentStruct[eindexState].options?.map((option) => (
      <button
        key={option}
        className="buttonoptions"
        logtype="option-select"
        logsource="questions-box"
        onClick={() => setEIndexState((prevEIndexState) => prevEIndexState + 1)}
      >
        {option}
      </button>
    ));
  };
  // const DisplayOptions = experimentStruct[eindexState].options?.map(
  //   (option) => (
  //     <div key={option}>
  //       <button
  //         className="buttonoptions"
  //         onClick={() =>
  //           setEIndexState((prevEIndexState) => prevEIndexState + 1)
  //         }
  //       >
  //         {option}
  //       </button>
  //     </div>
  //   )
  // );

  const questionrange = experimentStruct.length - 1;

  if (eindexState <= questionrange && eindexState >= 0) {
    progressquiz = true;
  } else {
    progressquiz = false;
  }
  optionselected = option;
  console.log("progressquiz", progressquiz);

  return (
    <div className="questions-box" logsource="questions-box">
      {progressquiz ? (
        <>
          <div className="questionid" logsource="questions-box">
            <h3>
              Q{experimentStruct[eindexState].id}.{" "}
              {experimentStruct[eindexState].text}?
            </h3>
            <div className="options-box flex-row" logsource="questions-box">
              <DisplayEOptions
                questionrange={questionrange}
                progressquiz={progressquiz}
                optionselected={optionselected}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h3>
            Congratulations. You've finished the experiment. Thankyou for
            participating. Please 'Click' Finish, and then 'Click' Download Log
            and follow instructions on your sheet to email the Log to us.
          </h3>
          <button
            className="nextbutton"
            logtype="button"
            logsource="questions-box"
            onClick={() => {
              setViewOptions((prevState) => {
                return {
                  ...prevState,
                  page: viewOptions.experimentGroup,
                  visibleTabs: [
                    ...viewOptions.visibleTabs,
                    viewOptions.experimentGroup,
                    "Download Log",
                  ],
                };
              });
            }}
          >
            Finish
          </button>
        </>
      )}
    </div>
  );
}
