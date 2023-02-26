import { useState, useEffect, Fragment } from "react";
import "./App.css";

import { Title } from "./components/Title";
import { NavBar } from "./components/NavBar";

import { Highlighting } from "./highlighting/Highlighting";
import { Table, tableDataCreator, updateDisplayTable } from "./table/Table";
import LawEncodingDiagram from "./matrix/LawEncodingDiagram";
import ConceptDiagram from "./concept_diagrams/ConceptDiagram";
import { Overview } from "./training/Overview";
import { DownloadLog } from "./logging/DownloadLog";
import { handleACLLogging } from "./logging/HandleACLLogging";
import { handleDMLogging } from "./logging/HandleDMLogging";
import { handleCDLogging } from "./logging/HandleCDLogging";
import { handleOVWLogging } from "./logging/HandleOVWLogging";
import { handleGTLogging } from "./logging/HandleGTLogging";
import { handleQuestionLogging } from "./logging/HandleQuestionLogging";

import userStruct from "./data/userstruct.json";
import fileStruct from "./data/filestruct.json";
import ruleStruct from "./data/rulestruct.json";
import overviewStruct from "./data/overviewstruct.json";
import questionStruct from "./data/questionstruct.json";
import experimentStruct from "./data/experimentstruct.json";
import { benLogging } from "./logging/BenLogging";
import TourComponent from "./training/TourComponent";
import { v4 as uuidv4 } from "uuid";
import { Client } from "paho-mqtt";

//import getMAC from 'https://unpkg.com/getmac@^5.20.0/edition-deno/index.ts'

const myUuid = uuidv4();
console.log(myUuid);

const ipAddress = window.location.hostname;
console.log(ipAddress);
const timestamp = Date.now();
console.log(timestamp);
const strings = [timestamp, ipAddress, myUuid];

// Combine the strings into a single array of characters
const characters = strings.join("").split("");

// Shuffle the characters array
for (let i = characters.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [characters[i], characters[j]] = [characters[j], characters[i]];
}

// Combine the shuffled characters into a single string
const uniqueID = characters.join("");
console.log(uniqueID);

const topic = "NPRP/US/QU";

const client = new Client("broker.hivemq.com", 8000, uniqueID); // replace 1002 with a uniqe #

// connect the client to the broker
client.connect({
  //useSSL: true,
  onSuccess: () => {
    console.log("Connected to MQTT broker");
    // subscribe to a topic
    client.subscribe(topic, { qos: 2 }); // to be deleted in production
  },
  onFailure: (errorMessage) => {
    console.error("Failed to connect to MQTT broker:", errorMessage);
  },
});

const loggingObject = {
  1: {
    userid: " ",
    group: "NA",
    page: "NA",
    region: "NA",
    type: "NA",
    target: "start of logging",
    content: "NA",
    timestamp: new Date(),
    scenario: 0,
    questionid: -1,
    answer: -1,
  },
};

let qid = 0;
let qaid = 0;
let eid = 0;
let eaid = 0;
let questionid = 0;
let mac = 0;

// const rulesWithId = ruleStruct.flatMap((rule, i) => [
//   {
//     id: i,
//     match: rule.match,
//     condition: rule.condition,
//     permissions: rule.permissions,
//     cssArray: rule.cssArray,
//   },
// ]);

const pages = {
  Overview: { title: "Overview", color: "orange" },
  ["SLAC Guided Tour"]: { title: "SLAC Guided Tour", color: "darkturquoise" },
  SLAC: { title: "SLAC", color: "gold" },
  // Table: { title: "Table", color: "mediumseagreen" },
  ["DMAC Guided Tour"]: { title: "DMAC Guided Tour", color: "turquoise" },
  DMAC: { title: "DMAC", color: "coral" },
  ["CDAC Guided Tour"]: { title: "CDAC Guided Tour", color: "turquoise" },
  CDAC: {
    title: "CDAC",
    color: "deepskyblue",
  },
  ["Training Questions"]: { title: "Training Questions", color: "crimson" },
  ["Experiment Questions"]: { title: "Experiment Questions", color: "crimson" },
};

function resourceTree(folder, pathToFolder = [], resources = []) {
  folder.forEach((resource) => {
    // Add all endpoints to tree, including directories
    resources.push([...pathToFolder, resource.name]);
    if (resource.children && resource.children.length) {
      const pathToSubFolder = [...pathToFolder];
      pathToSubFolder.push(resource.name);
      resourceTree(resource.children, pathToSubFolder, resources);
    }
  });
  return resources;
}

const uuid = uuidv4();

function App() {
  const [viewOptions, setViewOptions] = useState({
    // Default to Highlighting tab
    page: pages.Overview.title,
    titlePage: "Title",
    displayTitle: true,
    trainState: 0,
    group: 0,
    buttonEnable: false,
    // user/role view
    userViewOptions: ["User", "Role"],
    userViewIndex: 0,
    selected: {
      user: "",
      file: "",
      role: "",
    },
    experimentGroup: "",
    visibleTabs: ["Overview"],
  });

  const [activePagesState, setActivePages] = useState([]);
  // Data as states
  const [groupState, setGroupState] = useState(0);
  const [trainState, setTrainState] = useState(0);
  const [qindexState, setQIndexState] = useState(0);
  const [eindexState, setEIndexState] = useState(0);
  const [overviewIndex, setOverviewIndex] = useState(0);
  const [userState, setUserState] = useState(userStruct);
  const [fileState, setFileState] = useState(
    resourceTree(fileStruct).map((resource) => {
      return {
        pathArray: resource,
        hiddenBy: [],
        cssArray: [],
      };
    })
  );
  const [ruleState, setRuleState] = useState(ruleStruct);
  const [referenceTableState, setReferenceTableState] = useState();
  const [displayTableState, setDisplayTableState] = useState();
  const [forceEffect, setForceEffect] = useState();
  const [selectedItems, setSelectedItems] = useState({
    file: "",
    user: "",
    rule: "",
    ruleId: null,
  });
  const [tourStep, setTourStep] = useState(0);

  //var macaddress = require("macaddress");
  //macaddress.one(function (err, mac) {
  //  console.log("Mac address for this host: %s", mac);
  //});
  //console.log(getMAC());
  //console.log("macaddress");
  //const macAddr = macaddress.one((err, mac) => {
  //  console.log("Mac Addressd: ", mac);
  //});

  useEffect(() => {
    // let activePages = Object.keys(pages).map((pageKey) => pages[pageKey]);

    let activePages = Object.keys(pages).map((pageKey) => {
      if (
        pages[pageKey].title === "Overview" ||
        pages[pageKey].title.includes("Questions") ||
        // pages[pageKey].title === "Download Log" ||
        viewOptions.experimentGroup === "Dev" ||
        (pages[pageKey].title.includes(viewOptions.experimentGroup) &&
          pages[pageKey].title.includes("Guided Tour"))
      ) {
        return {
          title: pages[pageKey].title,
          active:
            viewOptions.visibleTabs.includes(pages[pageKey].title) ||
            pages[pageKey].title === "Download Log" ||
            viewOptions.experimentGroup === "Dev",
        };
      }
      return;
    });
    activePages = activePages.filter((page) => page);

    setActivePages(() => activePages);

    if (!viewOptions.page.includes("Guided Tour")) {
      setTourStep(0);
    }
  }, [viewOptions]);

  //useQuestionTourInterlaced(qindexState, tourStep, viewOptions, setViewOptions);

  qid = qindexState;
  if (qindexState < questionStruct.length) {
    let answerindex = questionStruct[qindexState].correct;
    qaid = questionStruct[qindexState].options[answerindex];
  }
  //console.log("qaid", qaid);
  eid = eindexState;
  if (eindexState < experimentStruct.length) {
    let answerindex = experimentStruct[eindexState].correct;
    eaid = experimentStruct[eindexState].options[answerindex];
  }

  useEffect(() => {
    setReferenceTableState(() => {});
    setDisplayTableState(() => {});
    tableDataCreator(setReferenceTableState, fileState, ruleState, userState);
    updateDisplayTable(
      fileState,
      userState,
      referenceTableState,
      setDisplayTableState
    );
    // console.log(displayTableState);
  }, [fileState, ruleState, userState, forceEffect]);

  useSelectionUpdate(
    displayTableState,
    selectedItems,
    userState,
    fileState,
    ruleState,
    setUserState,
    setFileState,
    setRuleState,
    referenceTableState
  );

  useEffect(() => {
    const index = Object.keys(loggingObject).length;
    function onKeyDown(e) {
      if (e.altKey && e.code === "KeyD") {
        setViewOptions((prevState) => {
          return {
            ...prevState,
            experimentGroup: "Dev",
          };
        });
      }
      if (viewOptions.titlePage === "Training") {
        questionid = qid;
      }
      if (viewOptions.titlePage === "Experiment") {
        questionid = eid;
      }
      if (viewOptions.page === "SLAC Guided Tour") {
        if (e.code === "ArrowRight") {
          console.log("arrowright");

          loggingObject[Object.keys(loggingObject).length + 1] = {
            userid: " ",
            group: viewOptions.experimentGroup,
            page: viewOptions.page,
            region: "Guided Tour ",
            type: "KeyClick",
            target: "Inc.TourStep",
            content: "ArrowRight",
            timestamp: new Date(),
            scenario: trainState,
            questionid: -1,
            answer: -1,
          };
          client.publish(
            topic,
            JSON.stringify({
              userid: uniqueID,
              group: viewOptions.experimentGroup,
              page: viewOptions.page,
              region: "Guided Tour ",
              type: "KeyClick",
              target: "Inc.TourStep",
              content: "ArrowRight",
              timestamp: new Date(),
              scenario: trainState,
              questionid: -1,
              answer: -1,
            }),
            2
          );
        }
      }
      if (e.altKey && e.code === "KeyH") {
        loggingObject[Object.keys(loggingObject).length + 1] = {
          userid: uniqueID,
          group: viewOptions.experimentGroup,
          page: viewOptions.page,
          region: " ",
          type: "Research assistant provided help",
          target: "Research assistant provided help",
          content: " ",
          timestamp: new Date(),
          scenario: trainState,
          questionid: questionid,
          answer: "help req",
        };
        client.publish(
          topic,
          JSON.stringify({
            userid: uniqueID,
            group: viewOptions.experimentGroup,
            page: viewOptions.page,
            region: "",
            type: "Research assistant provided help",
            target: "Research assistant provided help",
            content: "Research assistant provided help",
            timestamp: new Date(),
            scenario: trainState,
            questionid: questionid,
            answer: -1,
          }),
          2
        );
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      className="App"
      onClick={(e) => {
        clickHandler(
          uniqueID,
          client,
          topic,
          e,
          loggingObject,
          qid,
          qaid,
          eid,
          eaid,
          viewOptions,
          trainState,
          overviewIndex,
          tourStep
        );
      }}
    >
      <Header
        activePages={activePagesState}
        viewOptions={viewOptions}
        setViewOptions={setViewOptions}
        trainState={trainState}
        qindexState={qindexState}
        setQIndexState={setQIndexState}
        setTrainState={setTrainState}
        eindexState={eindexState}
        setEIndexState={setEIndexState}
        visible={viewOptions.experimentGroup !== ""}
      />

      <div
        className={`App-Body ${viewOptions.page.includes("CDAC") ? "" : "oyh"}`}
        style={{
          display: viewOptions.experimentGroup !== "" ? "" : "none",
        }}
      >
        {viewOptions.page === "Overview" && (
          <Overview
            overviewStruct={overviewStruct}
            overviewIndex={overviewIndex}
            setOverviewIndex={setOverviewIndex}
            trainState={trainState}
            setTrainState={setTrainState}
            viewOptions={viewOptions}
            setViewOptions={setViewOptions}
            groupState={groupState}
            setActivePages={setActivePages}
          />
        )}
        <Highlighting
          viewOptions={viewOptions}
          setViewOptions={setViewOptions}
          userState={userState}
          fileState={fileState}
          setFileState={setFileState}
          ruleState={ruleState}
          setRuleState={setRuleState}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          visible={viewOptions.page.includes("SLAC")}
        />
        <LawEncodingDiagram
          resultsTableState={displayTableState}
          fileState={fileState}
          setFileState={setFileState}
          userState={userState}
          viewOptions={viewOptions}
          setViewOptions={setViewOptions}
          visible={viewOptions.page.includes("DMAC")}
        />
        <div
          className="CDContainer"
          style={{
            display: viewOptions.page.includes("CDAC") ? "" : "none",
          }}
        >
          <ConceptDiagram fileState={fileState} />
        </div>
        {viewOptions.page.includes("Guided Tour") && (
          <TourComponent
            trainState={trainState}
            setTrainState={setTrainState}
            tourStep={tourStep}
            setTourStep={setTourStep}
            viewOptions={viewOptions}
            setViewOptions={setViewOptions}
          />
        )}
        {viewOptions.page === "Download Log" && (
          <DownloadLog objtodownload={loggingObject} />
        )}
      </div>

      {viewOptions.experimentGroup === "" && (
        <ChooseExperiment setViewOptions={setViewOptions} />
      )}
    </div>
  );
}

export default App;

function ChooseExperiment({ setViewOptions }) {
  const [consent, setConsent] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  return (
    <div className="chooseRoute" logsource="LandingPage">
      <div className="flex-row" logsource="LandingPage">
        <label htmlFor="part1">
          I understand that my participation is entirely voluntary, that I can
          choose not to participate in part or allofthe study, and that I can
          withdraw at any stage of the user studywithout having to give a reason
          and without being penalised in any way (e.g., if I am a student, my
          decision whether or not to take part will not affect my grades).
        </label>
        <input
          type="checkbox"
          name="part1"
          id="part1"
          logsource="LandingPage"
          logtype="checkbox"
          onChange={(e) =>
            setConsent((prev) => {
              prev[0] = e.target.checked;
              return [...prev];
            })
          }
        />
      </div>
      <div className="flex-row" logsource="LandingPage">
        <label htmlFor="part2">
          I understand I can request that my data be withdrawn and deleted even
          after the user studyis complete, any time up until the analysis of my
          databegins, specificallytwo weeks after my participation.
        </label>
        <input
          type="checkbox"
          name="part2"
          id="part2"
          logsource="LandingPage"
          logtype="checkbox"
          onChange={(e) =>
            setConsent((prev) => {
              prev[1] = e.target.checked;
              return [...prev];
            })
          }
        />
      </div>
      <div className="flex-row" logsource="LandingPage">
        <label htmlFor="part3">
          I understand that any information I provide is confidential, and that
          no information that I disclose will lead to the identification of any
          individual in the reports on the project, either by the researcher or
          by any other party.
        </label>
        <input
          type="checkbox"
          name="part3"
          id="part3"
          logsource="LandingPage"
          logtype="checkbox"
          onChange={(e) =>
            setConsent((prev) => {
              prev[2] = e.target.checked;
              return [...prev];
            })
          }
        />
      </div>
      <div className="flex-row" logsource="LandingPage">
        <label htmlFor="part4">
          I have read the information sheet, had the opportunity to ask
          questions and I understand the principles, procedures and possible
          risks involved.
        </label>
        <input
          type="checkbox"
          name="part4"
          id="part4"
          logsource="LandingPage"
          logtype="checkbox"
          onChange={(e) =>
            setConsent((prev) => {
              prev[3] = e.target.checked;
              return [...prev];
            })
          }
        />
      </div>
      <div className="flex-row" logsource="LandingPage">
        <label htmlFor="part5">
          I understand that de-identified data may be made publicly available,
          for example through Open Science Framework online data repositories,
          journal publication or at the request of other researchers.
        </label>
        <input
          type="checkbox"
          name="part5"
          id="part5"
          logsource="LandingPage"
          logtype="checkbox"
          onChange={(e) =>
            setConsent((prev) => {
              prev[4] = e.target.checked;
              return [...prev];
            })
          }
        />
      </div>
      <div className="flex-row" logsource="LandingPage">
        <label htmlFor="part6">
          I have read and understood the information above and confirm that I
          consent to take part in the University of Sussex research project.
        </label>
        <input
          type="checkbox"
          name="part6"
          id="part6"
          logsource="LandingPage"
          logtype="checkbox"
          onChange={(e) =>
            setConsent((prev) => {
              prev[5] = e.target.checked;
              return [...prev];
            })
          }
        />
      </div>

      <div className="flex-row" logsource="LandingPage">
        <button
          disabled={!consent.every((entry) => entry === true)}
          logsource="LandingPage"
          logtype="button"
          onClick={() =>
            setViewOptions((prevState) => {
              return {
                ...prevState,
                experimentGroup: "SLAC",
              };
            })
          }
        >
          SLAC
        </button>
        <button
          disabled={!consent.every((entry) => entry === true)}
          logsource="LandingPage"
          logtype="button"
          onClick={() =>
            setViewOptions((prevState) => {
              return {
                ...prevState,
                experimentGroup: "DMAC",
              };
            })
          }
        >
          DMAC
        </button>
        <button
          disabled={!consent.every((entry) => entry === true)}
          logsource="LandingPage"
          logtype="button"
          onClick={() =>
            setViewOptions((prevState) => {
              return {
                ...prevState,
                experimentGroup: "CDAC",
              };
            })
          }
        >
          CDAC
        </button>
      </div>

      {/* <button
        onClick={() =>
          setViewOptions((prevState) => {
            return {
              ...prevState,
              experimentGroup: "Dev",
            };
          })
        }
      >
        Dev
      </button> */}
    </div>
  );
}

/*export function hoverSideEffect(e, rlist, filtered_properties) {
  let userResource = " ";

  console.log("function called ithargs", e, rlist, filtered_properties);
  UserResource = rlist;
  // call to CDLogging on hover
  handleCDLogging(
    e,
    logobject,
    qid,
    qaid,
    viewOptions,
    trainState,
    userResource
  );
} */

function clickHandler(
  uniqueID,
  client,
  topic,
  e,
  logobject,
  qid,
  qaid,
  eid,
  eaid,
  viewOptions,
  trainState,
  overviewIndex,
  tourStep
) {
  let region = " ";
  let userResource = " ";
  region = e.target.getAttribute("logsource");
  console.log("ClickHandler region", region);

  if (viewOptions.page === "Overview") {
    //if (region === "OverviewPanel") {
    console.log("CH-Call-OVW", viewOptions.page);
    handleOVWLogging(
      uniqueID,
      client,
      topic,
      e,
      logobject,
      viewOptions,
      trainState,
      overviewIndex
    );
  }
  if (viewOptions.page === viewOptions.experimentGroup + " Guided Tour") {
    console.log("CH-Call-GT", viewOptions.page);
    handleGTLogging(
      uniqueID,
      client,
      topic,
      e,
      logobject,
      viewOptions,
      trainState,
      tourStep
    );
  }
  if (viewOptions.page === "SLAC" && region != "questions-box") {
    console.log("CH-Call-SLAC", viewOptions.page);
    handleACLLogging(
      uniqueID,
      client,
      topic,
      e,
      logobject,
      qid,
      eid,
      viewOptions,
      trainState
    );
  }
  if (viewOptions.page === "DMAC" && region != "questions-box") {
    console.log("CH-Call-DMAC", viewOptions.page);
    handleDMLogging(
      uniqueID,
      client,
      topic,
      e,
      logobject,
      qid,
      eid,
      viewOptions,
      trainState
    );
  }
  if (viewOptions.page === "CDAC" && region != "questions-box") {
    userResource = null;
    handleCDLogging(
      uniqueID,
      client,
      topic,
      e,
      logobject,
      qid,
      eid,
      viewOptions,
      trainState,
      userResource
    );
  }

  if (
    viewOptions.titlePage === "Training" ||
    viewOptions.titlePage === "Experiment"
  ) {
    if (region === "questions-box") {
      console.log("CH-QuestionHandling");
      handleQuestionLogging(
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
      );
    }
  }
  console.log("clickhandler", logobject, uniqueID, client, topic);
}

function Header({
  activePages,
  viewOptions,
  setViewOptions,
  trainState,
  setTrainState,
  qindexState,
  setQIndexState,
  eindexState,
  setEIndexState,
  visible,
}) {
  return (
    <div
      className="title-container"
      logsource="Title"
      style={{
        display: visible ? "" : "none",
      }}
    >
      <Title
        viewOptions={viewOptions}
        setViewOptions={setViewOptions}
        qindexState={qindexState}
        setQIndexState={setQIndexState}
        trainState={trainState}
        setTrainState={setTrainState}
        eindexState={eindexState}
        setEIndexState={setEIndexState}
      />
      <NavBar
        activePages={activePages}
        viewOptions={viewOptions}
        setViewOptions={setViewOptions}
        loggingObject={loggingObject}
      />
    </div>
  );
}

// Function to clear all styles
function unstyleAll(
  userState,
  fileState,
  ruleState,
  setUserState,
  setFileState,
  setRuleState
) {
  const unsyleObj = (obj) => {
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value === "object") unsyleObj(value);
      if (key === "cssArray") {
        obj[key] = [];
      }
    }
  };

  const objects = [userState, fileState, ruleState];

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    for (let i = 0; i < obj.length; i++) {
      const element = obj[i];
      unsyleObj(element);
    }
  }
  setUserState([...objects[0]]);
  setFileState([...objects[1]]);
  setRuleState([...objects[2]]);
}

function useSelectionUpdate(
  displayTableState,
  selectedItems,
  userState,
  fileState,
  ruleState,
  setUserState,
  setFileState,
  setRuleState,
  referenceTableState
) {
  useEffect(() => {
    unstyleAll(
      userState,
      fileState,
      ruleState,
      setUserState,
      setFileState,
      setRuleState
    );

    if (displayTableState === undefined) return;

    if (!selectedItems.user && !selectedItems.file && !selectedItems.rule)
      return;

    const relevantRows = displayTableState.filter((row) => {
      let outcome = true;
      if (selectedItems.user) {
        if (selectedItems.user.startsWith("Role: ")) {
          let rolesArray = [];

          if (row.listRole) rolesArray.push(row.listRole.split(" "));
          if (row.getRole) rolesArray.push(row.getRole.split(" "));
          if (row.createRole) rolesArray.push(row.createRole.split(" "));
          if (row.updateRole) rolesArray.push(row.updateRole.split(" "));
          if (row.deleteRole) rolesArray.push(row.deleteRole.split(" "));
          rolesArray = rolesArray.flat();

          outcome =
            outcome &&
            rolesArray.includes(selectedItems.user.split("Role: ")[1]);
        } else {
          outcome = outcome && row.user === selectedItems.user;
        }
      }
      if (selectedItems.file) {
        outcome = outcome && row.resource === selectedItems.file;
      }
      if (selectedItems.rule) {
        const rules = [
          row.listRule,
          row.getRule,
          row.createRule,
          row.updateRule,
          row.deleteRule,
        ];
        outcome = outcome && rules.includes(parseInt(selectedItems.ruleId));
      }

      return outcome;
    });

    const recursivelyGetFile = (files, path, classname, depth = 0) => {
      if (depth === path.length || depth > path.length) return;

      // console.log(files);
      const subDirectory = files.filter((file) => {
        // console.log(file.pathArray[depth], path[depth]);
        return file.pathArray[depth] === path[depth];
      });
      // console.log(subDirectory);

      if (depth + 1 === path.length) {
        subDirectory[0].cssArray.push(classname);
        // setFilesState([...filesRef.current]);
        return;
      }

      recursivelyGetFile(subDirectory[0].children, path, classname, depth + 1);
    };

    const linearlyGetFile = (files, path, classname) => {
      const filteredFiles = files.filter((file) => {
        let outcome = true;
        path.forEach((frag, index) => {
          outcome = outcome && file.pathArray[index] === frag;
        });
        return outcome;
      });

      filteredFiles.forEach((file) => file.cssArray.push(classname));
    };

    const permissionOptions = ["list", "get", "create", "update", "delete"];

    relevantRows.forEach((row) => {
      const highlightUser = [...userState];
      const highlightFile = [...fileState];
      let highlightRule = [...ruleState];
      const resourcePath = row.resource.split("/");

      permissionOptions.forEach((option) => {
        if (typeof row[option] !== "undefined") {
          // Highlight user(s) that match
          highlightUser.map((user) => {
            if (row.user === user.name) {
              if (row[option]) {
                user.cssArray.indexOf(`hl-${option}`) === -1
                  ? user.cssArray.push(`hl-${option}`)
                  : null;
              }
              if (!row[option]) {
                user.cssArray.indexOf(`hl-${option}-false`) === -1
                  ? user.cssArray.push(`hl-${option}-false`)
                  : null;
              }
            }
          });
          // Highlight file(s) that match
          highlightFile.map((file) => {
            if (row.resource === file.pathArray.join("/")) {
              if (row[option]) {
                file.cssArray.indexOf(`hl-${option}`) === -1
                  ? file.cssArray.push(`hl-${option}`)
                  : null;
              }
              if (!row[option]) {
                file.cssArray.indexOf(`hl-${option}-false`) === -1
                  ? file.cssArray.push(`hl-${option}-false`)
                  : null;
              }
            }
          });

          // Highlight rule(s) that match
          if (
            row.hasOwnProperty("listRule") ||
            row.hasOwnProperty("getRule") ||
            row.hasOwnProperty("createRule") ||
            row.hasOwnProperty("updateRule") ||
            row.hasOwnProperty("deleteRule")
          ) {
            if (!selectedItems.ruleId) {
              highlightRule.map((rule) => {
                if (rule.id === row[`${option}Rule`]) {
                  if (row[option]) {
                    rule.cssArray.indexOf(`hl-${option}`) === -1
                      ? rule.cssArray.push(`hl-${option}`)
                      : null;
                  }
                  if (!row[option]) {
                    rule.cssArray.indexOf(`hl-${option}-false`) === -1
                      ? rule.cssArray.push(`hl-${option}-false`)
                      : null;
                  }
                }
              });
            }
            if (
              parseInt(selectedItems.ruleId) === parseInt(row[`${option}Rule`])
            ) {
              highlightRule.map((rule) => {
                if (rule.id === row[`${option}Rule`]) {
                  if (row[option]) {
                    rule.cssArray.indexOf(`hl-${option}`) === -1
                      ? rule.cssArray.push(`hl-${option}`)
                      : null;
                  }
                  if (!row[option]) {
                    rule.cssArray.indexOf(`hl-${option}-false`) === -1
                      ? rule.cssArray.push(`hl-${option}-false`)
                      : null;
                  }
                }
              });
            }
          }
        }
      });
    });

    // Rule HL
    const relevantRule = ruleState.filter(
      (rule) => rule.match === selectedItems.rule
    );

    if (relevantRule.length) relevantRule[0].cssArray.push("selected");

    // Highlight inactive but previously set rules
    const irrelevantRows = referenceTableState.filter((row) => {
      let outcome = true;
      if (selectedItems.user) {
        if (selectedItems.user.startsWith("Role: ")) {
          let rolesArray = [];

          if (row.listRole) rolesArray.push(row.listRole.split(" "));
          if (row.getRole) rolesArray.push(row.getRole.split(" "));
          if (row.createRole) rolesArray.push(row.createRole.split(" "));
          if (row.updateRole) rolesArray.push(row.updateRole.split(" "));
          if (row.deleteRole) rolesArray.push(row.deleteRole.split(" "));
          rolesArray = rolesArray.flat();

          outcome =
            outcome &&
            rolesArray.includes(selectedItems.user.split("Role: ")[1]);
        } else {
          outcome = outcome && row.user === selectedItems.user;
        }
      }
      if (selectedItems.file) {
        outcome = outcome && row.resource === selectedItems.file;
      }
      if (selectedItems.rule) {
        const rules = [
          row.listRule,
          row.getRule,
          row.createRule,
          row.updateRule,
          row.deleteRule,
        ];
        outcome = outcome && rules.includes(parseInt(selectedItems.ruleId));
      }

      return outcome;
    });

    irrelevantRows.forEach((row) => {
      const highlightUser = [...userState];
      const highlightFile = [...fileState];
      let highlightRule = [...ruleState];
      const resourcePath = row.resource.split("/");

      permissionOptions.forEach((option) => {
        if (typeof row[option] !== "undefined") {
          // Highlight user(s) that match
          highlightUser.map((user) => {
            if (row.user === user.name) {
              if (row[option]) {
                user.cssArray.indexOf(`hl-faded-${option}`) === -1
                  ? user.cssArray.push(`hl-faded-${option}`)
                  : null;
              }
              if (!row[option]) {
                user.cssArray.indexOf(`hl-faded-${option}-false`) === -1
                  ? user.cssArray.push(`hl-faded-${option}-false`)
                  : null;
              }
            }
          });

          // Highlight file(s) that match
          highlightFile.map((file) => {
            if (row.resource === file.pathArray.join("/")) {
              if (row[option]) {
                file.cssArray.indexOf(`hl-faded-${option}`) === -1
                  ? file.cssArray.push(`hl-faded-${option}`)
                  : null;
              }
              if (!row[option]) {
                file.cssArray.indexOf(`hl-faded-${option}-false`) === -1
                  ? file.cssArray.push(`hl-faded-${option}-false`)
                  : null;
              }
            }
          });

          // Highlight rule(s) that match
          highlightRule.map((rule) => {
            if (row.ruleId === rule.id) {
              if (row[option]) {
                rule.cssArray.indexOf(`hl-faded-${option}`) === -1
                  ? rule.cssArray.push(`hl-faded-${option}`)
                  : null;
              }
              if (!row[option]) {
                rule.cssArray.indexOf(`hl-faded-${option}-false`) === -1
                  ? rule.cssArray.push(`hl-faded-${option}-false`)
                  : null;
              }
            }
          });
        }
      });
    });

    // console.log(irrelevantRows);
  }, [selectedItems]);
}
