import { useState } from "react";

export function handleDMLogging(
  uniqueID,
  client,
  topic,
  e,
  logobject,
  qid,
  eid,
  viewOptions,
  trainState
) {
  let classname = " ";
  let category = " ";
  let type = " ";
  let outerhtml = " ";
  let innerhtml = " ";
  let innertext = " ";
  let log = " ";
  let region = " ";
  let content = " ";
  let datauser = " ";
  let dataresource = " ";
  let id = " ";
  let questionid = " ";
  let viewmode = " ";
  const viewby = viewOptions.userViewOptions[viewOptions.userViewIndex];

  //log = e.target.getAttribute("logging");

  //const [xaxisExpand, setXaxisExpand] = useState(0);

  const downarrow = String.fromCharCode(9660);
  const rightarrow = String.fromCharCode(9654);

  const index = Object.keys(logobject).length;

  classname = e.target.className;
  outerhtml = e.target.outerHTML;
  innerhtml = e.target.parentNode.innerText;
  innertext = e.target.innerText;

  log = e.target.getAttribute("style");
  type = e.target.getAttribute("logtype");
  region = e.target.getAttribute("logsource");
  viewmode = e.target.getAttribute("RoleResPlot");
  datauser = e.target.getAttribute("logdatauser");
  dataresource = e.target.getAttribute("logdataresource");
  id = e.target.getAttribute("id", id);

  console.log("type-logtype", type);
  console.log("region-logsource", region);
  console.log("datauser", datauser);
  console.log("dataresource", dataresource);
  console.log("id", id);

  if (region === "UserRoleSelect") {
    console.log("UserRoleSelect");
    if (innertext === "User") {
      type = "button";
    }
    if (innertext === "Role") {
      type = "button";
    }
  }

  /*  if (e.target.closest(".toggle-buttons")) {
    region = "UserRoleSelect";
    if (innertext === "User") {
      type = "button";
    }
    if (innertext === "Role") {
      type = "button";
    }
  } */

  // X Axis Expand / collapse
  if (region === "X-Axis") {
    content = viewmode;
    if (innertext === "Collapse x axis" || innertext === "Expand x axis") {
      type = "button";
    } else {
      type = "UserRoleClick";
    }
  }

  if (region === "Y-Axis") {
    if (
      innertext === "Collapse All Folders" ||
      innertext === "Expand All Folders"
    ) {
      type = "button";
    }
  }

  // Get Mode -
  if (e.target.closest(".heading-grid")) {
    // console.log("xaxis double");
    if (e.target.className.includes("bottom-row") && viewby === "User") {
      // console.log("in double");
      content = "UserView-Xexpanded";
      //type = "UserSelect";
    }
    if (e.target.className.includes("bottom-row") && viewby === "Role") {
      content = "RoleView-Xexpanded";
      //type = "RoleSelect";
    }
    if (e.target.className.includes("top-row") && viewby === "User") {
      content = "UserView-Xcollapsed";
    }
    if (viewmode === "RoleResPlot") {
      content = "RoleResPlot-View";
    }
  }

  // Check if user is selecting anything in filelist
  if (e.target.parentNode.closest(".y-header-content")) {
    //if (region === "FileList") {
    region = "FileList";

    type = e.target.parentNode.classList[1] + "select";
    // console.log("e.target.id", e.target.id);
    //innertext = e.target.parentNode.id;

    //if (type === "folder-toggle") {
    if (e.target.className.includes("file-toggle")) {
      if (e.target.innerText === downarrow) type = "Collapse Folder";
      if (e.target.innerText === rightarrow) type = "Expand Folder";
      innertext = e.target.parentNode.innerText;
    }
  }

  if (e.target.classList.contains("cell")) {
    region = "GridCell";
    type = "CellSelect";
    innertext = e.target.getAttribute("style");
  }

  if (type === null) {
    type = "space";
    innertext = " ";
  }

  if (viewOptions.titlePage === "Training") {
    questionid = qid;
  }
  if (viewOptions.titlePage === "Experiment") {
    questionid = eid;
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
    questionid: questionid,
    answer: -1,
  };
  client.publish(topic, JSON.stringify(logobject[index + 1]), 2);
}
