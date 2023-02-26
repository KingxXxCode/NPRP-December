import { useState } from "react";
import { useEffect } from "react";
import "./Training.css";
import AccessControl from "../images/AccessControl.jpg";
import Policies from "../images/Policies.jpg";
import RulesToPerm from "../images/RulesToPerm.jpg";
import UserRoleRel from "../images/UserRoleRel.jpg";
import Users from "../images/Users.jpg";
import Roles from "../images/Roles.jpg";
import Rules from "../images/Rules.jpg";
import FileTree from "../images/FileTree.jpg";
import ActionTypes from "../images/ActionTypes.jpg";
import Permissions from "../images/Permissions.jpg";
import Roles_Files from "../images/Roles_Files.jpg";
import Departments from "../images/Departments.jpg";
import Visualisations from "../images/Visualisations.jpg";
import GuidedTour from "../images/GuidedTour.jpg";
import Scenario from "../images/Scenario.jpg";
import { fireEvent, screen } from "react";
//import userEvent from "@testing-library/user-event";

const images = {
  UserRoleRel: UserRoleRel,
  RulesToPerm: RulesToPerm,
  Users: Users,
  Roles: Roles,
  Rules: Rules,
  FileTree: FileTree,
  ActionTypes: ActionTypes,
  Permissions: Permissions,
  Roles_Files: Roles_Files,
  Departments: Departments,
  Visualisations: Visualisations,
  GuidedTour: GuidedTour,
  Scenario: Scenario,
};

export function Overview({
  overviewStruct,
  overviewIndex,
  setOverviewIndex,
  trainState,
  setTrainState,
  viewOptions,
  setViewOptions,
  groupState,
  setActivePages,
}) {
  const [buttonLimit, setButtonLimit] = useState(overviewIndex);
  let progresspoints = true;
  let displayimage = false;
  let lastslide = false;
  let firstslide = true;

  //const [pageState, setPageState] = useState(0);

  const DisplayIndex = () => {
    return overviewStruct.map((point, index) => {
      //if (index <= buttonLimit && index >= 0) {
      return (
        <span key={index}>
          <button
            className={`buttonoptions ${
              index === overviewIndex ? "active" : ""
            }`}
            onClick={() => setOverviewIndex(index)}
            disabled={!(index <= buttonLimit && index >= 0)}
            logsource="OverviewPanel"
            logtype="PageSelect"
          >
            {point.pagename}
          </button>
        </span>
      );

      //}

      return null;
    });
  };

  const BackButton = (
    <div>
      <button
        className="backbutton"
        onClick={() => {
          setOverviewIndex((prevoverviewIndex) => prevoverviewIndex - 1);
          setTrainState(1);
        }}
        logsource="OverviewPanel"
        logtype="button"
      >
        Back
      </button>
    </div>
  );

  const NextButton = (
    <div>
      <button
        className="nextbutton"
        onClick={() => {
          setOverviewIndex((prevoverviewIndex) => prevoverviewIndex + 1);
          setTrainState(1);
          if (overviewIndex >= buttonLimit) {
            setButtonLimit((prevState) => prevState + 1);
          }
        }}
        logsource="OverviewPanel"
        logtype="button"
        // {pageread.push({ value: overviewStruct[overviewIndex].image })}
      >
        Next
      </button>
    </div>
  );

  /*const proceed = () => {
    setTrainState(1);
    progresspoints = false;
    lastslide = false;
  };*/

  const FinishButton = (
    <div>
      <button
        className="nextbutton"
        logsource="OverviewPanel"
        logtype="button"
        onClick={() => {
          // setOverviewIndex((prevoverviewIndex) => prevoverviewIndex + 1);
          //setTrainState(2);
          setViewOptions((prevState) => {
            return {
              ...prevState,
              page: viewOptions.experimentGroup + " Guided Tour",
              visibleTabs: [
                ...viewOptions.visibleTabs,
                viewOptions.experimentGroup,
                viewOptions.experimentGroup + " Guided Tour",
              ],
            };
          });
          setTrainState = 2;
        }}
      >
        Finish
      </button>
    </div>
  );

  const startTour = () => {
    setTrainState(2);
    //return <GuidedTourACL />;
    //simulateMouseClick(tourelement);
    // document.getElementById("GuidedTourACL").click();
    // fireEvent.click(screen.getByText("GuidedTourACL"));
  };
  const mouseClickEvents = ["mousedown", "click", "mouseup"];
  function simulateMouseClick(tourelement) {
    mouseClickEvents.forEach((mouseEventType) =>
      tourelement.dispatchEvent(
        new MouseEvent(mouseEventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1,
        })
      )
    );
  }
  var tourelement = document.querySelector(
    "#root > div > div > div.app-container > header > button:nth-child(2)"
  );

  // #root > div > div >
  //               div.app-container > header > button:nth-child(2)
  //               <button class="">GuidedTourACL</button>

  var imagevar = eval(overviewStruct[overviewIndex].image);
  let grouppage = "";
  if (groupState === 0) grouppage = "SLACGuidedTour";
  if (groupState === 1) grouppage = "SLACGuidedTour";
  if (groupState === 2) grouppage = "DMACGuidedTour";
  if (groupState === 3) grouppage = "CDACGuidedTour";

  useEffect(() => {
    setTrainState(1);
  }, []);
  console.log("OVW-trainState", trainState);

  if (overviewStruct[overviewIndex].image === " ") displayimage = false;
  else displayimage = true;
  const pointsrange = overviewStruct.length - 1;

  if (overviewIndex <= pointsrange) {
    progresspoints = true;
  }

  // Display Next button or finish
  if (overviewIndex === overviewStruct.length - 1) lastslide = true;
  else {
    if (overviewIndex === overviewStruct.length) lastslide = false;
  }
  // Display Back button
  if (overviewIndex === 0) firstslide = true;
  else firstslide = false;

  return (
    <div className="overview" logsource="OverviewPanel">
      <h3>
        CyberSecurity Visualisation : Collaborative Graphical Tools for Security
        Policies
      </h3>
      {progresspoints ? (
        <>
          <span className="index flex-row-5px mb-1" logsource="OverviewPanel">
            <DisplayIndex />
          </span>
          <div className="progress-box flex-row-5px" logsource="OverviewPanel">
            {firstslide ? (
              <>
                <button className="backbutton" disabled={true} logtype="button">
                  Back
                </button>
              </>
            ) : (
              <>{BackButton}</>
            )}
            {lastslide ? <>{FinishButton}</> : <> {NextButton}</>}
          </div>
          {/* <div className="points">
            {firstslide ? (
              <>{overviewStruct[overviewIndex].text}</>
            ) : (
              <>
                {overviewStruct[overviewIndex].id}.{" "}
                {overviewStruct[overviewIndex].text}
              </>
            )}
          </div> */}

          {overviewStruct[overviewIndex].id === 0 && <OverviewOne />}
          {overviewStruct[overviewIndex].id === 1 && <OverviewTwo />}
          {overviewStruct[overviewIndex].id === 2 && <OverviewThree />}
          {overviewStruct[overviewIndex].id === 3 && <OverviewFour />}
          {overviewStruct[overviewIndex].id === 4 && <OverviewFive />}
          {overviewStruct[overviewIndex].id === 5 && <OverviewSix />}
          {overviewStruct[overviewIndex].id === 6 && <OverviewSeven />}

          {displayimage ? (
            <div className="image" logsource="OverviewPanel">
              {/* <img src={FolderLock} alt="org" /> */}
              <img
                src={images[overviewStruct[overviewIndex].image]}
                alt="org"
                logsource="OverviewPanel"
              />
            </div>
          ) : (
            <p></p>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

function OverviewOne() {
  return (
    <div className="points" logsource="OverviewPanel">
      <p>
        Thank you for participating in this study. We are researching methods of
        visualising the different permissions that Users have to Resources
        (Folders and Files) within a University setting. The University is
        organised as shown below.
      </p>
      <ul>
        <li>
          This Overview covers information that will assist your learning of the
          Visualisation Tool.
        </li>
        <li>
          You are welcome to ask your Research Assistant questions as you
          progress through the training.
        </li>
      </ul>
    </div>
  );
}

function OverviewTwo() {
  return (
    <div className="points" logsource="OverviewPanel">
      <p>
        All Users of the University Resources (Folder and Files) have their own
        UserId.
      </p>
      <ul>
        <li>Users are allocated Roles.</li>
        <li>A User can have one or many Roles.</li>
        <li>A Role is a group containing one or many Users. </li>
      </ul>
    </div>
  );
}

function OverviewThree() {
  return (
    <div className="points" logsource="OverviewPanel">
      <p>
        Role names may relate to a generic group of users, such as 'Student' or
        'Employee', or may relate to a job role, such as 'Tutor'.{" "}
      </p>
      <p>Roles are used to define access for a group of Users.</p>
      <p>
        Below, you can see Barry is a User with the Role of Tutor and is allowed
        access to the Exams Folder, whereas Sally, without the Role of Tutor, is
        denied access to the same Folder.
      </p>
    </div>
  );
}

function OverviewFour() {
  return (
    <div className="points" logsource="OverviewPanel">
      <p>
        In this experiment the University Resources are stored in a hierarchical
        File Tree of Folders and Files. There are four main Top Level Folders as
        described below.
      </p>
      <ul>
        <li>
          Folders and Files are identified by their Filepath, eg, '/usr/stu' and
          '/usr/stu/media.doc'.
        </li>
        <li>
          Access to lower level Folders and Files are inherited from permission
          settings of the parent Folder.
        </li>
      </ul>
    </div>
  );
}

function OverviewFive() {
  return (
    <div className="points" logsource="OverviewPanel">
      <p>
        Rules define what the different Users and Roles can access in the
        FileTree.
      </p>
      <ul>
        <li>
          Each Rule defines which permissions a Role or User has to a Resource.
        </li>
        <li>There are many Rules and each one has a Rule No.</li>
        <li>
          The permissions are referred to as List (L), Get (G), Create (C),
          Update (U) and Delete (D), and each permission can be granted or
          denied by a Rule.
        </li>
        <li>
          The Tool displays the final permissions given to Users or Roles after
          the whole list of Rules is applied.
        </li>
        <li>
          The example below shows the User 'Arnold' and his permissions to the
          '/Apps/LIB_SYS' Folder.
          <div style={{ marginLeft: "1rem", lineHeight: 1.8 }}>
            <i>
              Rule No. 19 grants List permission for the 'IT_Admin' Role to this
              Folder.
              <br />
              Rule No. 13 grants Get permission for the 'Employee' Role to this
              Folder.
              <br />
              Because 'Arnold' is assigned both these Roles, his final
              permissions are as shown here.
            </i>
          </div>
        </li>
      </ul>
    </div>
  );
}

function OverviewSix() {
  return (
    <div className="points" logsource="OverviewPanel">
      For reference, the permissions that can be granted or denied are as
      follows:
      <ul>
        <li>List: allows the User to see if a Folder or File exists.</li>
        <li>Get: allows the User to read the contents of a Folder or File.</li>
        <li>Create: allows a User to Create a new Folder or File.</li>
        <li>
          Update: allows a User to Update the contents of a Folder or File.
        </li>
        <li>Delete: allows a User to Delete a Folder or File.</li>
      </ul>
    </div>
  );
}

function OverviewSeven() {
  return (
    <div className="points" logsource="OverviewPanel">
      You will next be taken to a Guided Tour of the Tool. This is to
      familiarise you with the User interactions and the Scenario data used for
      the study.
      <ul>
        <li>
          When you have completed the Guided Tour there are some Training
          Questions with tips provided. These are of similar style to questions
          in the Experiment.
        </li>
        <li>
          You are welcome to ask questions as you progress through the Training
          Questions.
        </li>
        <li>
          After the training questions, you can move onto the Experiment
          Questions. During the experiment no assistance will be provided with
          the Questions.
        </li>
        <li>
          In the experiment, you will be checking that Users and Roles have the
          right permissions to access what they require in the File Tree.
        </li>
      </ul>
      Select Finish to go to the Tool.
    </div>
  );
}
