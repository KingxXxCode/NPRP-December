import { useState } from "react";
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
import GuidedTourACL from "./SLACGuidedTour";
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
  let proceedtour = false;

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
          setTrainState(0);
        }}
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
          setTrainState(0);
          if (overviewIndex >= buttonLimit) {
            setButtonLimit((prevState) => prevState + 1);
          }
        }}
        // {pageread.push({ value: overviewStruct[overviewIndex].image })}
      >
        Next
      </button>
    </div>
  );

  const Finish = (
    <h3>
      Thankyou for reading the Research Study Overview. Please select GuidedTour
      to continue training.
    </h3>
  );

  const proceed = () => {
    setTrainState(1);
    progresspoints = false;
    lastslide = false;
  };

  const FinishButton = (
    <div>
      <button
        className="nextbutton"
        onClick={() => {
          // setOverviewIndex((prevoverviewIndex) => prevoverviewIndex + 1);
          setTrainState(2);
          setViewOptions((prevState) => {
            return {
              ...prevState,
              page: viewOptions.experimentGroup,
              visibleTabs: [
                ...viewOptions.visibleTabs,
                viewOptions.experimentGroup,
                "Training Questions",
              ],
            };
          });
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

  // };

  if (overviewStruct[overviewIndex].image === " ") displayimage = false;
  else displayimage = true;
  const pointsrange = overviewStruct.length - 1;

  if (overviewIndex <= pointsrange) {
    progresspoints = true;
  }

  //if (trainState === 1 && overviewIndex === pointsrange) progresspoints = false;

  // } else {
  //   progresspoints = false;
  // }
  if (overviewIndex === overviewStruct.length - 1) lastslide = true;
  else {
    if (overviewIndex === overviewStruct.length) lastslide = false;
  }

  if (overviewIndex === 0) firstslide = true;
  else firstslide = false;

  let grouppage = "";
  if (groupState === 0) grouppage = "SLACGuidedTour";
  if (groupState === 1) grouppage = "SLACGuidedTour";
  if (groupState === 2) grouppage = "DMACGuidedTour";
  if (groupState === 3) grouppage = "CDACGuidedTour";

  return (
    <div className="overview">
      <h3>
        CyberSecurity Visualisation : Collaborative Graphical Tools for Security
        Policies
      </h3>
      {progresspoints ? (
        <>
          <span className="index flex-row-5px mb-1">
            <DisplayIndex />
            {trainState === 1 && (
              <>
                <button
                  className="buttonoptions"
                  onClick={() =>
                    setViewOptions((prevState) => {
                      return { ...prevState, page: grouppage };
                    })
                  }
                >
                  {grouppage}
                </button>
              </>
            )}
          </span>
          <div className="progress-box flex-row-5px">
            {firstslide ? (
              <>
                <button className="backbutton" disabled={true}>
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
          {overviewStruct[overviewIndex].id === 7 && <OverviewEight />}
          {overviewStruct[overviewIndex].id === 8 && <OverviewNine />}

          {displayimage ? (
            <div className="image">
              {/* <img src={FolderLock} alt="org" /> */}
              <img
                src={images[overviewStruct[overviewIndex].image]}
                alt="org"
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
    <div className="points">
      <p>
        Thank you for participating in this study. We are researching methods of
        visualising the different permissions that Users have to Resources
        (Folders and Files) within a University setting. The University is
        organised as shown below. This Overview covers information that will
        assist you in learning how to use the Visualisation Tool.
      </p>
      <ul>
        <li>
          You will be taken to a Guided Tour of the Tool at points during the
          training.
        </li>
        <li>
          Some concepts will be introduced first, and described in more detail
          further on.{" "}
        </li>
        <li>
          You are welcome to ask your Research Assistant questions as you
          progress through.
        </li>
      </ul>
    </div>
  );
}

function OverviewTwo() {
  return (
    <div className="points">
      <p>
        All Users of the University Resources (Folder and Files) are allocated
        to Roles.
      </p>
      <ul>
        <li>A Role can be a group containing one or many Users. </li>
        <li>A User can have one or many Roles.</li>
      </ul>
      <p>
        A list of Rules define the access that Users and Roles can have to
        Folders and Files (Resources).
      </p>
    </div>
  );
}

function OverviewThree() {
  return (
    <div className="points">
      <p>
        In this experiment, there is a list of Rules that define what level of
        access the Users or Roles can have to the different Folders and Files.
      </p>
      <ul>
        <li>
          The levels of access (or Action Types allowed) are referred to as List
          (L), Get (G), Create (C), Update (U) and Delete (D). Each one will
          either be granted or denied.
        </li>
        <li>
          The Tool displays the final permissions that all Users and Roles have
          been granted or denied after the whole list of Rules is applied.
        </li>
        <li>
          The example below shows a Rule that sets Grant or Deny for five levels
          of access for the 'Student' Role on the '/usr/stu' Folder and the
          permissions outcome.
        </li>
      </ul>
      <p>
        You will be taken to a Guided Tour of the Tool when you click 'Next'.
      </p>
    </div>
  );
}
function OverviewFour() {
  return (
    <div className="points">
      <p>
        Users will be granted or denied access to different Folders and Files,
        depending on the Role or Roles allocated to them.
      </p>
      <p>
        Below, you can see Barry is a User with the Role of Tutor and is allowed
        access to the Exams Folder, whereas, Sally, a Student is denied access
        to the same Folder.
      </p>
      <p>
        There will be a Rule that grants the Tutor access, and another Rule that
        denies the Student access.
      </p>
    </div>
  );
}

function OverviewFive() {
  return (
    <div className="points">
      <p>
        Role names may relate to a generic group of users, such as 'Student' or
        'Employee', or may relate to a job role, such as 'Tutor'.{" "}
      </p>
      <p>
        Roles are used within Rules to define permissions for a group of Users.
      </p>
      <p>Every User also has their own UserId.</p>
      <p>
        Mostly, the Rules define access for all the different Roles, but can
        also define access for just one User (with UserId) when a particular
        exception is required.
      </p>
    </div>
  );
}

function OverviewSix() {
  return (
    <div className="points">
      <p>
        In this experiment, the University Resources are stored in a
        hierarchical File Tree of Folders, Sub-Folders and Files. There are four
        main Top Level Folders as described below.
      </p>
      <ul>
        <li>
          Folders and Files are identified by their Filepath, eg, '/usr/stu' and
          '/usr/stu/media.doc'.
        </li>
        <li>
          When a Rule sets permissions for a Folder, the permissions will be
          inherited by the Sub-Folders and Files underneath it in the File Tree.
        </li>
      </ul>
      <p>
        You will be taken back to the Guided Tour of the Tool when you click
        'Next'.
      </p>
    </div>
  );
}

function OverviewSeven() {
  return (
    <div className="points">
      The Tool can display information about the Rules and the final permissions
      given for a Role and Resource. For reference, the levels of access that
      can be granted or denied are as follows:
      <ul>
        <li>List : List allows the User to see if a Folder or File exists</li>
        <li>
          Get : Get allows the User to read the contents of a Folder or File
        </li>
        <li>Create : Create allows a User to Create a new Folder or File</li>
        <li>
          Update : Update allows a User to Update the contents of a Folder or
          File
        </li>
        <li>Delete : Delete allows a User to Delete a Folder or File</li>
      </ul>
      In the example below, there are two Rules that set access for the
      'Student' Role to the Folder '/usr/stu'. Rule 2 will override the settings
      of Rule 1, so the final permissions will give full access.
    </div>
  );
}

function OverviewEight() {
  return (
    <div className="points">
      A Rule defines the level of access that a User or Role has to a Folder or
      File. There are many Rules in the list to set access for a large number of
      Roles and Resources in the system. The Rule Information Panel can display
      final permissions for any combination of User or Role AND Folder or File
      on the Tool, and the Rule No. applied. In the example below :
      <ul>
        <li>
          The User selected is 'Arnold' who has two Roles, 'IT_Admin' and
          'Employee'
        </li>
        <li>The Folder selected is '/apps/LIB_SYS'</li>
        <li>
          Rule No. 19 granted 'List' access to this Folder for the 'IT_Admin'
          Role.
        </li>
        <li>
          Rule No. 13 granted 'Get' access to this Folder for the 'Employee'
          Role.
        </li>
        <li>
          Rule No. 0 is at the beginning of the Rule List, and will 'Deny'
          access to all Users for every Resource. This initial setting can be
          overriden by Rules later in the List. If there are no Rules set for a
          particular User and Resource, the default 'Deny' permission from Rule
          0 remains.
        </li>
        <li>
          The final permissions 'Arnold' is granted to the '/Apps/LIB_SYS'
          Folder is List and Get.
        </li>
      </ul>
    </div>
  );
}

function OverviewNine() {
  return (
    <div className="points">
      Take a few minutes now to familiarise yourself with the Scenario Data and
      Tool interactions you have been shown.
      <ul>
        <li>
          Select the Training Questions button when you are ready to progress.
          This provides some typical questions along with Training Tips on how
          to use the Tool to get to the correct answer.
        </li>
        <li>
          You are welcome to ask questions as you progress through the Training
          Questions.
        </li>
        <li>
          After the training questions, you can then select the Experiment
          Questions for which no assistance will be provided.
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
