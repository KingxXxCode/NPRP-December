export function handleACLLogging(
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
  let element = " ";
  let innertext = " ";
  let region = " ";
  let questionid = " ";
  let content = " ";
  let view = " ";
  const downarrow = String.fromCharCode(9660);
  const rightarrow = String.fromCharCode(9654);
  //  const viewby = viewOptions.userViewOptions[viewOptions.userViewIndex];

  const index = Object.keys(logobject).length;

  classname = e.target.className;
  outerhtml = e.target.outerHTML;
  innerhtml = e.target.parentNode.innerText;
  //innertext = e.target.innerText;
  element = e.target.innerText;
  region = e.target.getAttribute("logsource");
  type = e.target.getAttribute("logtype");
  view = e.target.getAttribute("logmode");

  // console.log("ACLogging", viewby, viewOptions.userViewIndex);
  // console.log("log", log);
  //console.log("inner", innerhtml);
  // Check if user selects anywhere in Title Bar area
  if (region === "Title") {
    console.log("Title");
    type = "space";
    innertext = "space";
  }
  if (region === "Tool") {
    console.log("Tool");
    type = "space";
    innertext = "space";
  }
  if (region === "NavBar") {
    console.log("NavBar");
    if (type === "button") {
      innertext = e.target.innerText;
    }
  }
  if (region === "UsersPanel") {
    console.log("UsersPanel");
    innertext = e.target.innerText;
    if (innertext === "User" || innertext === "Role") {
      type = "button";
    }
    if (type === "deselect") {
      innertext = e.target.parentNode.innerText;
    } else {
      type = "space";
    }
  }
  if (region === "UsersRoleList") {
    console.log("UsersRoleList");
    if (type === "RoleSelect") {
      innertext = e.target.innerText;
      content = view;
    }
    if (type === "UserSelect") {
      innertext = e.target.innerText;
      content = view;
    }
  }
  // FilePanel has Collapse/Expand All Folders and Deselect File
  if (region === "FilePanel") {
    console.log("FilePanel type", type, e.target.innerText);
    if (type === "button-toggle") {
      innertext = e.target.innerText;
    }
    if (type === "deselect") {
      innertext = e.target.parentNode.innerText;
    }
  }
  // Clicked on File or Folder
  //console.log("e.target.className", e.target.className);
  if (e.target.className.includes("selection-helper")) {
    region = "FileList";
    type = e.target.classList[1];
    innertext = e.target.id;
  }
  // Clicked on folder arrow to collapse / expand
  if (e.target.className.includes("file-toggle")) {
    region = "FileList";
    if (e.target.innerText === downarrow) type = "Collapse Folder";
    if (e.target.innerText === rightarrow) type = "Expand Folder";
    innertext = e.target.parentNode.innerText;
  }

  if (region === "RulesList") {
    console.log("RulesList");
  }

  // Check if user has clicked in space around Rules List
  if (
    e.target.closest(".rules-container") ||
    e.target.closest(".rules-column")
  ) {
    region = "Rules List";
    type = "space";
    innertext = e.target.innerText;
  }
  // Check if user has clicked anywhere within a Rule Card - if so, record whole Rule
  if (e.target.closest(".rule-card")) {
    region = "Rules List";
    type = "space";
    innertext = e.target.closest(".rule-card").innerText;
  }

  // Clear out target inner text if not clicked on valid object
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

  // Store user activity to log object
  // scenario will be 1=overview, 2=guided tour, 3=training questions 4=experiment questions
  // question ID is qid or eid, depending on mode
  // region is what area of page user has clicked in, or item in nav bar
  // type indicates whether they've clicked on button, space, pageselect, deselect, etc
  // target is text content of what the user has clicked on
  // answer will be right/wrong for option selected for question
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
