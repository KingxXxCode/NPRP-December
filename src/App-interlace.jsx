import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation } from "react-router-dom";
import "./App.css";

import { Title } from "./components/Title";
import { NavBar } from "./components/NavBar";

import { Highlighting } from "./highlighting/Highlighting";
import { Table, tableDataCreator, updateDisplayTable } from "./table/Table";
import LawEncodingDiagram from "./matrix/LawEncodingDiagram";
import ConceptDiagram from "./concept_diagrams/ConceptDiagram";
import { Overview } from "./training/Overview";
import SLACGuidedTour from "./training/SLACGuidedTour";
import DMACGuidedTour from "./training/DMACGuidedTour";
import CDACGuidedTour from "./training/CDACGuidedTour";
import { DownloadLog } from "./logging/DownloadLog";
import { handleACLLogging } from "./logging/HandleACLLogging";
import { handleDMLogging } from "./logging/HandleDMLogging";
import { handleCDLogging } from "./logging/HandleCDLogging";

import userStruct from "./data/userstruct.json";
import fileStruct from "./data/filestruct.json";
import ruleStruct from "./data/rulestruct.json";
import overviewStruct from "./data/overviewstruct.json";
import { benLogging } from "./logging/BenLogging";

const loggingObject = {
  1: {
    page: "NA",
    region: "NA",
    type: "NA",
    target: "start of logging",
    timestamp: new Date(),
    scenario: 0,
    questionid: 0,
    answer: 0,
  },
};

let qid = 0;

const rulesWithId = ruleStruct.flatMap((rule, i) => [
  {
    id: i,
    match: rule.match,
    condition: rule.condition,
    permissions: rule.permissions,
    cssArray: rule.cssArray,
  },
]);

const pages = {
  Overview: { title: "Overview", color: "orange" },
  // ["SLAC Guided Tour"]: { title: "SLAC Guided Tour", color: "darkturquoise" },
  SLAC: { title: "SLAC", color: "gold" },
  // Table: { title: "Table", color: "mediumseagreen" },
  // ["DMAC Guided Tour"]: { title: "DMAC Guided Tour", color: "turquoise" },
  DMAC: { title: "DMAC", color: "coral" },
  // ["CDAC Guided Tour"]: { title: "CDAC Guided Tour", color: "turquoise" },
  CDAC: {
    title: "CDAC",
    color: "deepskyblue",
  },
  ["Training Questions"]: { title: "Training Questions", color: "crimson" },
  ["Experiment Questions"]: { title: "Experiment Questions", color: "crimson" },
  ["Download Log"]: { title: "Download Log", color: "crimson" },
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

function App() {
  const [viewOptions, setViewOptions] = useState({
    // Default to Highlighting tab
    page: pages.Overview.title,
    titlePage: "Title",
    displayTitle: true,
    mode: "play",
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
    visibleTabs: ["Overview", "Download Log"],
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
  const [ruleState, setRuleState] = useState(rulesWithId);
  const [referenceTableState, setReferenceTableState] = useState();
  const [displayTableState, setDisplayTableState] = useState();
  const [forceEffect, setForceEffect] = useState();
  const [selectedItems, setSelectedItems] = useState({
    file: "",
    user: "",
    rule: "",
    ruleId: null,
  });

  useEffect(() => {
    // let activePages = Object.keys(pages).map((pageKey) => pages[pageKey]);

    let activePages = Object.keys(pages).map((pageKey) => {
      if (
        pages[pageKey].title === "Overview" ||
        pages[pageKey].title.includes("Questions") ||
        pages[pageKey].title === "Download Log" ||
        viewOptions.experimentGroup === "Dev" ||
        pages[pageKey].title.includes(viewOptions.experimentGroup)
      ) {
        return {
          title: pages[pageKey].title,
          active:
            viewOptions.visibleTabs.includes(pages[pageKey].title) ||
            viewOptions.experimentGroup === "Dev",
        };
      }
      return;
    });
    activePages = activePages.filter((page) => page);

    setActivePages(() => activePages);
  }, [viewOptions]);

  const [tourStep, setTourStep] = useState(0);

  useOverviewTourInterlaced(
    overviewIndex,
    tourStep,
    setTourStep,
    viewOptions,
    setViewOptions
  );

  //useQuestionTourInterlaced(qindexState, tourStep, viewOptions, setViewOptions);

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

  return (
    <div
      className="App"
      onClick={(e) =>
        clickHandler(
          e,
          loggingObject,
          qid,
          viewOptions,
          trainState,
          overviewIndex
        )
      }
    >
      {viewOptions.experimentGroup !== "" ? (
        <>
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
          />

          <div
            className={`App-Body ${viewOptions.page !== "CDAC" ? "oyh" : ""}`}
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
            {viewOptions.page === "SLAC Guided Tour" && (
              <>
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
                />
                <SLACGuidedTour
                  trainState={setTrainState}
                  setTrainState={setTrainState}
                  tourStep={tourStep}
                  setTourStep={setTourStep}
                />
              </>
            )}
            {viewOptions.page === "SLAC" && (
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
              />
            )}
            {viewOptions.page === "Table" && (
              <Table
                resultsTable={displayTableState}
                setForceEffect={setForceEffect}
              />
            )}
            {viewOptions.page === "DMAC" && (
              <LawEncodingDiagram
                resultsTableState={displayTableState}
                fileState={fileState}
                setFileState={setFileState}
                userState={userState}
                viewOptions={viewOptions}
                setViewOptions={setViewOptions}
              />
            )}
            {viewOptions.page === "DMAC Guided Tour" && (
              <>
                <DMACGuidedTour
                  trainState={setTrainState}
                  setTrainState={setTrainState}
                  tourStep={tourStep}
                  setTourStep={setTourStep}
                />
                <LawEncodingDiagram
                  resultsTableState={displayTableState}
                  fileState={fileState}
                  setFileState={setFileState}
                  userState={userState}
                  viewOptions={viewOptions}
                  setViewOptions={setViewOptions}
                />
              </>
            )}
            {viewOptions.page === "CDAC" && (
              <div className="CDContainer">
                <ConceptDiagram fileState={fileState} />
              </div>
            )}
            {viewOptions.page === "CDAC Guided Tour" && (
              <>
                <div className="CDContainer">
                  <ConceptDiagram fileState={fileState} />
                </div>
                <CDACGuidedTour
                  trainState={setTrainState}
                  setTrainState={setTrainState}
                  tourStep={tourStep}
                  setTourStep={setTourStep}
                />
              </>
            )}
            {viewOptions.page === "Download Log" && (
              <DownloadLog objtodownload={loggingObject} />
            )}
          </div>
        </>
      ) : (
        <ChooseExperiment setViewOptions={setViewOptions} />
      )}
    </div>
  );
}

export default App;

function ChooseExperiment({ setViewOptions }) {
  return (
    <div className="chooseRoute">
      <div className="flex-row">
        <button
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

      <button
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
      </button>
    </div>
  );
}

function clickHandler(
  e,
  logobject,
  qid,
  viewOptions,
  trainState,
  overviewIndex
) {
  // console.log("viewOptions", viewOptions.page === "Highlighting");
  if (viewOptions.page === "SLAC") {
    handleACLLogging(e, logobject, qid, viewOptions, trainState, overviewIndex);
  }
  if (viewOptions.page === "DMAC") {
    handleDMLogging(e, logobject, qid, viewOptions, trainState);
  }
  if (viewOptions.page === "CDAC") {
    handleCDLogging(e, logobject, qid, viewOptions, trainState);
  }
  if (viewOptions.page === "Overview") {
    // console.log("overview");
    handleACLLogging(e, logobject, qid, viewOptions, trainState, overviewIndex);
  }
  console.log("clickhandler", logobject);
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
}) {
  return (
    <div className="title-container">
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
      />
    </div>
  );
}

function useQuestionTourInterlaced(
  qindexState,
  tourStep,
  viewOptions,
  setViewOptions
) {
  console.log("qindex", qindexState, "tourStep", tourStep);
  useEffect(() => {
    if (
      qindexState === 1 &&
      viewOptions.experimentGroup === "SLAC" &&
      tourStep === 0
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      qindexState === 2 &&
      viewOptions.experimentGroup === "SLAC" &&
      tourStep === 1
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "SLAC" };
      });
    }
  }, [qindexState, tourStep]);

  //DMAC
  useEffect(() => {
    if (
      qindexState === 1 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 0
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      qindexState === 1 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 4
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
  }, [qindexState, tourStep]);

  //CDAC
  useEffect(() => {
    if (
      qindexState === 1 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 10
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      qindexState === 2 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 11
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
  }, [qindexState, tourStep]);
}

function useOverviewTourInterlaced(
  overviewIndex,
  tourStep,
  setTourStep,
  viewOptions,
  setViewOptions
) {
  useEffect(() => {
    if (
      overviewIndex === 3 &&
      viewOptions.experimentGroup === "SLAC" &&
      tourStep === 0
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 3 &&
      viewOptions.experimentGroup === "SLAC" &&
      tourStep === 5
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 6 &&
      viewOptions.experimentGroup === "SLAC" &&
      tourStep === 5
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 6 &&
      viewOptions.experimentGroup === "SLAC" &&
      tourStep === 7
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 8 &&
      viewOptions.experimentGroup === "SLAC" &&
      tourStep === 7
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 8 &&
      viewOptions.experimentGroup === "SLAC" &&
      tourStep === 10
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
  }, [overviewIndex, tourStep]);

  //DMAC
  useEffect(() => {
    if (
      overviewIndex === 3 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 0
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 3 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 4
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 5 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 4
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 5 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 7
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 6 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 7
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 6 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 12
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 7 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 12
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 7 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 20
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 8 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 20
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 8 &&
      viewOptions.experimentGroup === "DMAC" &&
      tourStep === 24
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
  }, [overviewIndex, tourStep]);

  //CDAC
  useEffect(() => {
    if (
      overviewIndex === 3 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 0
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 3 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 7
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 5 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 7
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 5 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 10
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 6 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 10
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 6 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 14
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
    if (
      overviewIndex === 8 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 14
    ) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: viewOptions.experimentGroup + " Guided Tour",
        };
      });
    }
    if (
      overviewIndex === 8 &&
      viewOptions.experimentGroup === "CDAC" &&
      tourStep === 16
    ) {
      setViewOptions((prevState) => {
        return { ...prevState, page: "Overview" };
      });
    }
  }, [overviewIndex, tourStep]);
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
