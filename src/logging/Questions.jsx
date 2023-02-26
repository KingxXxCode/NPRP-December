import { useState } from "react";
import { useEffect } from "react";
import "./Logging.css";
import ReactMarkdown from "react-markdown";
const markdownTypesAllowed = [
  "text",
  "strong",
  "delete",
  "emphasis",
  "link",
  "em",
];

import questionStruct from "../data/questionstruct.json";

export function Questions({
  set,
  qindexState,
  setQIndexState,
  trainState,
  setTrainState,
  viewOptions,
  setViewOptions,
}) {
  // console.log(questionStruct);
  let option = " ";
  let progressquiz = true;
  let optionselected = " ";
  useEffect(() => {
    setTrainState(3);
  }, []);
  console.log("TQ-trainState", trainState);

  setViewOptions.trainState = 3;

  const DisplayOptions = ({ questionrange, progressquiz, optionselected }) => {
    const [answered, setAnswered] = useState({
      answered: false,
      answer: null,
    });
    optionselected = option;

    return questionStruct[qindexState].options?.map((option, index) => (
      <button
        key={option}
        logtype="OptionSelect"
        logsource="questions-box"
        className={`buttonoptions ${
          answered.answered &&
          questionStruct[qindexState].hasOwnProperty("correct") &&
          index === answered.answer &&
          (index === questionStruct[qindexState].correct
            ? "correctly"
            : "falsely")
        } ${
          answered.answered &&
          (index !== questionStruct[qindexState].correct ? "" : "correctly")
        }`}
        onClick={
          () =>
            handleAnswer(
              setAnswered,
              index,
              questionStruct[qindexState].correct
            )
          // setQIndexState((prevQIndexState) => prevQIndexState + 1)
        }
        //disabled={answered.answered}
      >
        {option}
      </button>
    ));
  };

  function handleBack() {
    if (qindexState > 0) {
      setQIndexState((prevQIndexState) => prevQIndexState - 1);
    }
  }

  function handleNext() {
    setQIndexState((prevQIndexState) => prevQIndexState + 1);
    if (qindexState === questionStruct.length - 1) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          visibleTabs: [...prevState.visibleTabs, "Experiment Questions"],
        };
      });
    }
  }

  const questionrange = questionStruct.length - 1;
  const tipsindex =
    viewOptions.experimentGroup === "SLAC"
      ? 0
      : viewOptions.experimentGroup === "DMAC"
      ? 1
      : viewOptions.experimentGroup === "CDAC"
      ? 2
      : 0;

  let firstslide = true;
  if (qindexState === 0) firstslide = true;
  else firstslide = false;

  if (qindexState <= questionrange && qindexState >= 0) {
    progressquiz = true;
  } else {
    progressquiz = false;
  }

  return (
    <div className="questions-box" logsource="questions-box">
      {progressquiz ? (
        <>
          <div className="questionid" logsource="questions-box">
            <h3
              className="question-h3 flex-row nowrap"
              logsource="questions-box"
            >
              <span>Q{questionStruct[qindexState].id}.</span>
              <span>
                {questionStruct[qindexState].markdown ? (
                  <ReactMarkdown
                    allowedElements={markdownTypesAllowed}
                    unwrapDisallowed={true}
                  >
                    {questionStruct[qindexState].markdown + "?"}
                  </ReactMarkdown>
                ) : (
                  questionStruct[qindexState].text + "?"
                )}
              </span>
            </h3>
            <div className="options-box flex-row" logsource="questions-box">
              <DisplayOptions
                questionrange={questionrange}
                progressquiz={progressquiz}
                optionselected={optionselected}
              />
            </div>
          </div>

          <div className="tiptext" logsource="questions-box">
            {questionStruct[qindexState].tips[tipsindex]}
          </div>

          <div
            className="flex-row center flex-center"
            logsource="questions-box"
          >
            <button
              onClick={handleBack}
              disabled={qindexState === 0}
              logtype="button"
              logsource="questions-box"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              logtype="button"
              logsource="questions-box"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>Congratulations. You've finished the training session.</h3>
        </>
      )}
    </div>
  );
}

function handleAnswer(setAnswered, index, correctIndex) {
  setAnswered(() => {
    return {
      answered: true,
      answer: index,
    };
  });
}
