export function handleCDLogging(
  uniqueID,
  client,
  topic,
  e,
  logobject,
  qid,
  eid,
  viewOptions,
  trainState,
  UserResource
) {
  let classname = " ";
  let category = " ";
  let region = " ";
  let content = " ";
  let type = " ";
  let outerhtml = " ";
  let innerhtml = " ";
  let element = " ";
  let innertext = " ";
  let log = " ";
  let id = " ";
  const viewby = viewOptions.userViewOptions[viewOptions.userViewIndex];
  let xaxis = "single";

  //const [xaxisExpand, setXaxisExpand] = useState(0);

  const downarrow = String.fromCharCode(9660);
  const rightarrow = String.fromCharCode(9654);

  const index = Object.keys(logobject).length;

  console.log(e);

  classname = e.target.className;
  outerhtml = e.target.outerHTML;
  innerhtml = e.target.parentNode.innerText;
  innertext = e.target.innerText;
  element = e.target.innerText;
  id = e.target.getAttribute("id");
  region = e.target.getAttribute("logsource");
  type = e.target.getAttribute("logtype");
  //value = e.target.value;

  //style = e.target.style;
  // console.log("style", e.target.style);
  // console.log("closest", e.target.closest);
  // console.log("outerhtml", e.target.outerhtml);
  // console.log("innertext", e.target.innerText);
  // console.log("classname", e.target.className);
  // console.log("parentnode-innertext", e.target.parentNode.innerText);

  // Check if user selects anywhere in Title Bar area

  console.log("CD region, type, id", region, type, id);

  if (region === "Title") {
    type = "space";
  }
  if (region === "NavBar") {
    innertext = e.target.innerText;
    if (
      innertext ===
      "Overview\nCDAC Guided Tour\nTraining Questions\nExperiment Questions\nDownload Log"
    ) {
      type = "space";
      innertext = "Navbar";
    }
  }

  if (region === "SummaryPanel") {
    if (id === "allperms") {
      innertext = id;
      type = "checkbox";
    }
    if (id === "user") {
      innertext = id;
      type = "space";
    }
    if (id === "file") {
      innertext = id;
      type = space;
    }
    if (id === "primary-dropdown") {
      innertext = e.target.value;
      type = "UsersRoleSelect";
    }
    if (id === "secondary-dropdown") {
      innertext = e.target.innerText;
      type = "FileSelect";
    }
    if (id === "userxmark") {
      innertext = e.target.innerText;
      type = "deselect";
    }
    if (id === "filexmark") {
      innertext = e.target.innerText;
      type = "deselect";
    }
    if (id === "personnel-toggle") {
      type = "switch";
      content = e.target.value;
      innertext = e.target.innerHTML;
    }
    if (id === "clearbutton") {
      innertext = id;
      type = "button";
    }
  }

  if (region != "SummaryPanel") {
    // output whatever id comes back from tool
    type = "Select";
    innertext = id;
    if (id.includes("resources")) {
      region = "resource-circle";
    } else {
      region = "users-circle";
    }
  }

  /* if (region === "circles") {
    if (id === "personnel_tooltip") {
      console.log("personnel_tooltip_title");
      innertext = e.target.innerText;
    }
    if (id === "personnel_tooltip_title") {
      innertext = e.target.innerText;
    }
  }

  if (e.target.parentNode.className === "userscircle") {
    innertext = id;
    type = "UsersClick";
  }
  if (region === "userscircle") {
    innertext = id;
    type = "UsersClick";
  }
  if (e.target.id.includes("resourcesg")) {
    innertext = id;
    type = "ResourcesClick";
  }

  if (e.target.id === "blur") {
    // console.log("clicked on");
    innertext = e.target.id;
    if (innertext.includes("users")) {
      region = "UserRoleList";
      type = "RoleSelect";
    } else {
      region = "UserRoleList";
      type = "UserSelect";
    }
    if (innertext.includes("resources")) {
      region = "FileList";
      if (
        innertext.includes("xlsx") ||
        innertext.includes("doc") ||
        innertext.includes("mp3")
      ) {
        type = "File";
      } else type = "Folder";
    }
  } */

  if (UserResource != null) {
    // Call from hover function
    console.log("CDH - UserResource", UserResource);
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
    questionid: qid,
    answer: innertext,
  };
  client.publish(topic, JSON.stringify(logobject[index + 1]), 2);
}
