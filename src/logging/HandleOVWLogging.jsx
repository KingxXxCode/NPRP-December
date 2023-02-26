export function handleOVWLogging(
  uniqueID,
  client,
  topic,
  e,
  logobject,
  viewOptions,
  trainState,
  overviewIndex
) {
  let type = " ";
  let innertext = " ";
  let region = " ";
  let content = " ";
  let consentno = " ";
  const index = Object.keys(logobject).length;

  // type is button, pageselect, or clicking on space
  type = e.target.getAttribute("logtype");
  region = e.target.getAttribute("logsource");
  consentno = e.target.getAttribute("id");
  innertext = e.target.innerText;

  if (type === null) {
    //clear innertext
    type = "space";
    innertext = " ";
  }
  if (type === "PageSelect") {
    content = innertext;
  } else {
    content = "Index-No-" + overviewIndex;
  }

  if (type === "checkbox") {
    innertext = consentno;
    content = "Consent and Group Selection";
  }

  logobject[index + 1] = {
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
