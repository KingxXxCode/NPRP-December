export function handleGTLogging(
  uniqueID,
  client,
  topic,
  e,
  logobject,
  viewOptions,
  trainState,
  tourStep
) {
  let type = " ";
  let innertext = " ";
  let region = " ";
  let content = " ";
  const index = Object.keys(logobject).length;

  type = e.target.getAttribute("logtype");
  region = e.target.getAttribute("logsource");

  if (type != null) {
    console.log("type not null");
    innertext = e.target.innerText;
  } else {
    innertext = "TourStepNo-" + tourStep;
  }

  type = logobject[index + 1] = {
    userid: uniqueID,
    group: viewOptions.experimentGroup,
    page: viewOptions.page,
    region: region,
    type: type,
    target: innertext,
    content: content,
    timestamp: new Date(),
    scenario: trainState,
    questionid: -1,
    answer: -1,
  };
  client.publish(topic, JSON.stringify(logobject[index + 1]), 2);
}
