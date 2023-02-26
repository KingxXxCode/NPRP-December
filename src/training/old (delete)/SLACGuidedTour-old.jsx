import Tour from "reactour";
import { useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const tipsteps = [
  {
    selector: "#root > div > div",
    content:
      "This is the Visualisation Tool you will be using for the training scenario and experiment. Please step through the tour with the -> arrow until you are taken back to the Overview for further information. Follow any 'select' or 'click' instructions to see what effect the interactions have.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#usersColumn",
    content:
      "Users: This lists the users of the system by their name (in Bold) and any roles they have assigned to them. You can use the mouse wheel to scroll up and down the list.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#filesColumn",
    content:
      "Files: The file system is listed here in a hierarchical tree of folders, sub folders and files. You can use the mouse wheel to scroll up and down the list.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn",
    content:
      "Rules : The Rules that determine what permissions are granted for user or roles with different resources are listed here. You can use the mouse wheel to scroll up and down the list. You will be returned to the Overview when you click -> arrow.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#usersColumn > div.sticky > div > div",
    content:
      "You can 'select' the User and Role buttons to sort the User List by Username or by Roles.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#usersColumn",
    content:
      "Users: When you 'click' on a Username or Role, the permissions for any resource or rules that are applicable to the user/role will be highlighted with five bullets. These permissions represent List, Get, Create, Update and Delete, where green is permission granted and red is denied. If there are no Rules that apply to the selected User/Role nothing will be highlighted.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#usersColumn > div.sticky > p",
    content:
      "The User or Role you have selected will appear here. 'Select' the red cross by the username or role to switch the highlighting feature off again. You will be returned to the Overview when you click -> arrow.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },

  {
    selector: "#filesColumn > div.sticky > button",
    content:
      "Files: You can collapse and expand the filetree using this toggle button. 'Select' Collapse All to display the top level folders only. And then 'select' Expand All to see all folders, sub-folders and files in the list are displayed. ",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#apps-files",
    content:
      "You can also expand or collapse just one folder in the tree by clicking on the arrow to the left of the folder name. 'Click' on the down arrow to collapse the apps folder. And then 'click' on the right arrow to expand the folder again.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#filesColumn",
    content:
      "Files: When you 'click' on a filepath in the list, permissions are displayed for any user/role and rules that are applicable to the filepath selected. If nothing is highlighted, no Rules apply to that filepath.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#filesColumn > div.sticky > p",
    content:
      "The Filepath you have selected will appear here. 'Click' on the red cross to switch the highlighting feature off again. You will be returned to the Overview when you click -> arrow.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn",
    content:
      "Rules : The Rules that determine what permissions are granted for user/roles and resources are listed here, and are applied in the order shown in the list (top down). This means that a later rule in the list can override an earlier rule. ",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn",
    content:
      "Rules : When you 'click' on a Rule, permissions will be displayed for any users or roles and filepaths affected by that Rule. Scroll down the list and 'click' on Rule 17 to see the permissions applied to the apps/CANVAS folder for the Coordinator Role.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn > div.sticky > p",
    content:
      "The Rule you have selected will appear here. 'Select' the red cross to switch the highlighting feature off again. You will be returned to the Overview when you click -> arrow.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn > div > div:nth-child(2)",
    content:
      "Each Rule defines what permissions will be set for a particular Filepath and User or Role. This Rule gives access to all users with the Student Role to the /usr/stu folder. List and Get is granted (green), and Create, Update and Delete are explicitly denied (red). These permissions will also be inherited by any sub-folders/files under the filepath specified.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn > div > div:nth-child(6)",
    content:
      "This Rule grants all permissions to the Resources at /sch/eng for any user with the Role of Eng_Coordinator.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn > div.rules-container > div:nth-child(19)",
    content:
      "This Rule grants List access to all Folders and Files for any user with the Role of IT_Admin. The white bullets indicate that the other permissions have not been explicitly denied. By default, access is denied if grant or deny has not been specified.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn > div > div:nth-child(4)",
    content:
      "All users have their own named folder for storage, and this Rule is applied when there is a username that matches a folder name at the {all} location in the filepath. For example, there is a user called Barry, and his own folder is at /usr/emp/acc/Barry so this grants him full access to his own folder.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "'Select' the User 'Arnold'. The permissions that he or his Roles have to different filepaths are displayed. If you scroll down the Rules List, you will see permissions displayed for all the Rules that apply to him or his roles. Rules with a red border have been overriden by another rule later in the list.",
    style: {
      backgroundColor: "#33DDFF",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "With 'Arnold' selected, scroll down and 'select' the filepath apps/IT_TICKET. Permissions are only displayed now for the user AND filepath selected. If you scroll down the Rules List, you will see Rule 19 is granting the IT_Admin Role full access to this filepath. Rule 18 above that gives the same Role List access to all resources has a red border, indicating it has been overidden. ",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "Deselect the filepath apps/IT_TICKET but leave 'Arnold' selected. Now 'select' Rule 18. Permissions are now only displayed for the user (and their roles) selected, and any resources effected by this Rule.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "Take a couple minutes to familiarise yourself with this feature of the Tool. By clicking on different combinations of users and roles, filepaths and Rules you will see the filtering effects it has for displaying permissions. Clicking the -> arrow will return you to the overview.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "You can now close the Guided Tour and take a few minutes to familiarise with the scenario data and features of the Tool, before moving onto the training scenario.",
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
];

export default function SLACGuidedTour({
  trainState,
  setTrainState,
  tourStep,
  setTourStep,
}) {
  const [isTourOpen, setIsTourOpen] = useState(true);
  // setTrainState(3);

  const updateTrainState = () => {
    if (trainState === 2 && isTourOpen === false) setTrainState(3);
  };
  // console.log("GT trainState", trainState, "isTourOpen", isTourOpen);

  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  return (
    <>
      {/* s<button onClick={setIsTourOpen(true)} title={'Tour'}></button> */}
      <Tour
        // className="guidedtour"
        // maskClassName="red"
        closeWithMask={false}
        startAt={tourStep}
        // getCurrentStep={(curr) =>
        //   setTutorialProgress((prevState) => {
        //     return { ...prevState, tourStep: curr };
        //   })
        // }
        getCurrentStep={(currentStep) => setTourStep(currentStep)}
        inViewThreshold={0}
        scrollOffset={0}
        scrollDuration={400}
        steps={tipsteps}
        isOpen={isTourOpen}
        //onBeforeClose={enableBody}
        onRequestClose={() => setIsTourOpen(false)}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
      />

      {/* <Overview /> */}
    </>
  );
}
