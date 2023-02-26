import Tour from "reactour";
import { useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

function SLACOne() {
  return (
    <div className="tourpoints">
      <p>
        This is the Visualisation Tool you will be using for the training
        scenario and experiment. There are three panels that display User/Role,
        Folders and Files, and the Rules that set the permissions.
      </p>
      <ul>
        <li>
          Use the → arrow to step through the Tour until you are taken back to
          the training for more information.{" "}
        </li>
        <li>
          Please follow any 'Click' instructions to see what effect the
          interactions have with the Tool.
        </li>
      </ul>
    </div>
  );
}

function SLACTwo() {
  return (
    <div className="tourpoints">
      <p>
        This is a list of names of the Users (in Bold) and any Roles they have
        assigned to them. You can use the mouse wheel to scroll up and down the
        list.
      </p>
      <ul>
        <li>
          'Click' on the 'User' or 'Role' buttons to arrange the List by User or
          Role.
        </li>
        <li>'Click' on the Username 'Arnold'.</li>
        <li>
          Permissions that 'Arnold' or any of his Roles has to Folders and Files
          are displayed.
        </li>
        <li>The Rules that apply to any of his Roles are displayed.</li>
      </ul>
    </div>
  );
}

function SLACThree() {
  return (
    <div className="tourpoints">
      <p>
        The Rules that determine what permissions are granted or denied for the
        User or Role that you selected will be listed here.
      </p>
      <ul>
        <li>Each Rule in the List is identified with a Rule Number.</li>
        <li>
          Each Rule shows the permissions granted to a User or Role for a Folder
          or File.
        </li>
        <li>
          There may be more than one Rule that affects permissions for a Role
          and a specific Folder or File.
        </li>
        <li>
          If there are no Rules that apply to your selection, a message is
          displayed here instead.
        </li>
      </ul>
    </div>
  );
}
function SLACFour() {
  return (
    <div className="tourpoints">
      <p>
        The File Tree is listed here in a hierarchical tree of Folders,
        Sub-Folders and Files. You can use the mouse wheel to scroll up and down
        the list.
      </p>
      <ul>
        <li>
          'Click' on the Folder name 'CANVAS' in the list. Permissions are
          displayed for Users and Roles that have access to this Folder.
        </li>
        <li>
          As you have already selected the User 'Arnold', only the Rules
          applicable to his Roles AND the Folder selected will be displayed.
        </li>
      </ul>
    </div>
  );
}

function SLACFive() {
  return (
    <div className="tourpoints">
      <p>
        You can select combinations of User and Roles with Folders and Files to
        filter the list of Rules displayed.
      </p>
      <ul>
        <li>
          'Click' the Red Cross alongside the currently selected file, to
          deselect the Folder. The Rules will update to those relevant to
          'Arnold' and his Roles.
        </li>
        <li>
          'Click' the Red Cross alongside the currently selected user, to
          deselect the User and switch off all Rules and permissions displayed.
        </li>
        <li>
          You will be returned to the Overview when you 'Click' -{">"} arrow.
        </li>
      </ul>
    </div>
  );
}

function SLACSix() {
  return (
    <div className="tourpoints">
      <p>You can use the following features to help navigate the File Tree.</p>
      <ul>
        <li>
          'Click' 'Collapse All Folders' to collapse the Filetree to display the
          top level folders only.{" "}
        </li>
        <li>
          'Click' 'Expand All Folders' to see all Folders, Sub-Folders and Files
          in the list are displayed again.
        </li>
        <li>
          'Click' on the black arrow to the left of any Folder name to just
          collapse and expand that Folder only.
        </li>
      </ul>
    </div>
  );
}

function SLACSeven() {
  return (
    <div className="tourpoints">
      <p>
        You can use the browser search function to search for any term
        (Username, Folder) on the Tool.
      </p>
      <ul>
        <li>
          'Hold down the 'Command' Key and press the 'F' key to bring up a
          Search box at the top right of the browser.
        </li>
        <li>Enter 'Ursula' in the search input box.</li>
        <li>
          Use the 'Up/Down arrows' to the right of search box to go to each
          instance of your search term.
        </li>
        <li>
          Folders need to be expanded first for the Search Function to find the
          name of a Sub-Folder.
        </li>
        <li>
          'Click' the 'X' in the search box (or ESC key) to close the search and
          switch off the highlighted search terms.
        </li>
        <li>
          You will be returned to the Overview when you 'Click' -{">"} arrow.
        </li>
      </ul>
    </div>
  );
}

function SLACEight() {
  return (
    <div className="tourpoints">
      <p></p>
      <ul>
        <li>'Click' on the Arrange users by 'Role' button.</li>
        <li>'Click' on the Role of 'Engineering'</li>
        <li>
          Rule 5 is displayed and grants this Role 'List' and 'Get' access to
          the Folder 'sch/eng'
        </li>
        <li>Rule 0 denies 'Create', 'Update' and 'Delete' by default</li>
        <li>
          'Click' on the User 'Barry' inside the Role of 'Engineering' instead.
        </li>
        <li>
          The Rules Panel updates to show any Rules that apply to any of the
          Roles that 'Barry' the User has.
        </li>
        <li>
          'Click' the 'Red Cross' alongside 'Barry' (currently selected user) to
          deselect him.
        </li>
      </ul>
    </div>
  );
}

function SLACNine() {
  return (
    <div className="tourpoints">
      <p></p>
      <ul>
        <li>'Click' on the Arrange users by 'Role' button.</li>
        <li>'Click' on the Role of 'Engineering'</li>
        <li>
          Rule 5 is displayed and grants this Role 'List' and 'Get' access to
          the Folder 'sch/eng'
        </li>
        <li>Rule 0 denies 'Create', 'Update' and 'Delete' by default</li>
        <li>
          'Click' on the User 'Barry' inside the Role of 'Engineering' instead.
        </li>
        <li>
          The Rules Panel updates to show any Rules that apply to any of the
          Roles that 'Barry' the User has.
        </li>
      </ul>
    </div>
  );
}

const tipsteps = [
  {
    selector: "#root > div > div",
    content: <SLACOne />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#usersColumn",
    content: <SLACTwo />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#rulesColumn",
    content: <SLACThree />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#filesColumn",
    content: <SLACFour />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [0, 300],
  },
  {
    selector: "#root > div",
    content: <SLACFive />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [650, 200],
  },
  {
    selector: "#filesColumn",
    content: <SLACSix />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [650, 200],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACSeven />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [650, 200],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACEight />,
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [650, 400],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "'Click' the Role of 'Engineering' alongside 'Wilfred's' name. Only the Rules and Filepaths that are applicable to this Role have permissions displayed. 'Engineering' Role has List and Get access to the /sch/eng folder granted by Rule 4.",
    style: {
      backgroundColor: "#33DDFF",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "'Click' the Role of 'Employee' instead. A different set of Rules will be displayed that are applicable to this Role, alongside different Filepaths and permissions highlighted. You will be returned to the Overview when you 'Click' the -> arrow.",
    style: {
      backgroundColor: "#33DDFF",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "'Click' the User 'Debbie'. The Rules displayed are applicable to any of the Roles she has allocated, namely, Employee, Business and Tutor. ",
    style: {
      backgroundColor: "#33DDFF",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "Now 'Click' the Filepath apps/HR_SYS in the Filetree. Only Rule 25 is displayed because it grants the 'Employee' Role access to '/apps/HR_SYS', and Debbie has this Role. ",
    style: {
      backgroundColor: "#33DDFF",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "'Click' on the <Red Cross> alongside 'Debbie' in Selected User Area. Permissions are now displayed for all Users with 'Employee' Role as they have access to the '/apps/HR_SYS' Folder granted by Rule 25.",
    style: {
      backgroundColor: "#33DDFF",
    },
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "Scroll down the User List and 'Click' User name 'Paul' instead. No permissions are displayed now because there are No Rules that apply to this combination or User/Roles AND Filepath.",
    style: {
      backgroundColor: "#33DDFF",
    },
  },
  {
    selector: "body",
    content: "End.",
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
        //className="guidedtour"
        maskClassName="guidedtour"
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
        //        onRequestClose={() => setIsTourOpen(false)}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
      />

      {/* <Overview /> */}
    </>
  );
}
