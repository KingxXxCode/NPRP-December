export function handleQuestionLogging(
  uniqueID,
  client,
  topic,
  e,
  logobject,
  viewOptions,
  trainState,
  qid,
  qaid,
  eid,
  eaid
) {
  let content = " ";
  let answer = " ";
  let region = " ";
  let questionid = " ";
  let type = " ";
  let innertext = e.target.innerText;
  const index = Object.keys(logobject).length;

  // Get log attr from Questions.jsx and Experiment.jsx
  type = e.target.getAttribute("logtype");
  region = e.target.getAttribute("logsource");

  console.log("QH qaid", qaid);
  console.log("QH page", viewOptions.page, viewOptions.Title);
  console.log("QH region", region);
  console.log("TrainState", trainState);
  // Are we in title or questions-box region. If so, log question id, option clicked, answer-right.wrong
  if (region === "questions-box" || region === "title") {
    // Training Questions
    if (trainState === 3) {
      questionid = qid;
      if (qaid === innertext) {
        answer = "right";
      } else {
        answer = "wrong";
      }

      // For training questions - user can click Next / Back inbetween question options, so set answer to " ";
      if (innertext === "Next" || innertext === "Back") {
        answer = "";
      }
    }
    // Experiment Questions
    if (trainState === 4) {
      questionid = eid;
      if (eaid === innertext) {
        answer = "right";
      } else {
        answer = "wrong";
      }
    }

    console.log("QH-answer", answer);
    if (type === null) {
      console.log("QH-type is null - clicked on space");
      innertext = " ";
      type = "space";
      answer = "space";
    }

    type = logobject[index + 1] = {
      userid: uniqueID,
      group: viewOptions.experimentGroup,
      page: viewOptions.titlePage,
      region: region,
      type: type,
      target: innertext,
      content: content,
      timestamp: new Date(),
      scenario: trainState,
      questionid: questionid,
      answer: answer,
    };
  }
  client.publish(topic, JSON.stringify(logobject[index + 1]), 2);
}
