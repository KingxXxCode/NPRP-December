import Tour from "reactour";
import { useEffect, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

function SLACOne() {
  return (
    <div className="tourpoints">
      <p>
        This is the Visualisation Tool. There are three panels that display
        User/Role, Folders and Files, and the Rules that set the permissions.
      </p>
      <ul>
        <li>Use the → arrow to step through the Tour.</li>
        <li>
          Please follow any 'Click' instructions in the Tour to see what effect
          the interactions.
        </li>
      </ul>
    </div>
  );
}

function SLACTwo() {
  return (
    <div className="tourpoints">
      <p>
        This is a list of names of the Users (in Bold) and any Roles they have.
        You can use the mouse wheel to scroll up and down the list.
      </p>
      <ul>
        <li>
          'Click' on the 'User' and 'Role' buttons to arrange the List by User
          or Role.
        </li>
        <li>'Click' on a Username or a Role in the list.</li>
        <li>
          Permissions that the selected User/Role has to Folders and Files are
          displayed with five bullets coloured red (deny) and green (granted).
        </li>
        <li>
          'Click' on the ❌ beside 'Currently selected user' to deselect and
          switch off permissions display
        </li>
      </ul>
    </div>
  );
}
function SLACThree() {
  return (
    <div className="tourpoints">
      <p>
        The File Tree is listed here in a hierarchical tree of Folders and
        Files. You can use the mouse wheel to scroll up and down the list.
      </p>
      <ul>
        <li>
          'Click' on a Folder name in the list. Permissions are displayed for
          Users and Roles that have access to this Folder.
        </li>
      </ul>
    </div>
  );
}

function SLACFour() {
  return (
    <div className="tourpoints">
      <p>
        Only Rules that apply to the User/Role or Folder that you selected will
        be listed here.
      </p>
      <ul>
        <li>Each Rule in the List is identified with a Rule Number.</li>
        <li>
          Each Rule sets the permissions for a User or Role to a Folder or File.
        </li>
        <li>
          More than one Rule may apply to a Role or a specific Folder or File.
          In this case, the later Rule in the list is applied.
        </li>
        <li>
          If there are no Rules that apply to your selection, a message is
          displayed here instead.
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
        filter the list of Rules and Permissions displayed.
      </p>
      <ul>
        <li>
          'Click' the ❌ alongside the 'Currently selected file' to deselect the
          Folder.
        </li>
        <li>
          'Click' on a Role name in the Users list (ie, 'Employee') to see Rules
          and permissions for that Role.
        </li>
        <li>
          Now 'Click' on a Folder. This will filter, to only display Rules and
          Permissions applicable to this combination of Role and Folder.
        </li>
        <li>
          Now 'Click' the ❌ alongside the 'Currently selected user', to only
          see Rules and Permissions for the selected Folder.
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
          top level Folders only.{" "}
        </li>
        <li>
          'Click' 'Expand All Folders' to see all Folders and Files in the list
          are displayed again.
        </li>
        <li>'Click' on ▶ to expand and ▼ to collapse one Folder only.</li>
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
          'Click' on 'Up/Down arrows' to the right of the search box to go to
          each instance of your search term.
        </li>
        <li>
          NOTE : All Folders need to be expanded for the Search Function to find
          the name of a Folder.
        </li>
        <li>
          NOTE : Search will only find a Folder name, not a Filepath, so avoid
          using '/apps/BOX'
        </li>
        <li>
          'Click' the 'X' in the search box (or ESC key) to close the search and
          switch off the highlighted search terms.
        </li>
      </ul>
    </div>
  );
}

function SLACEight() {
  return (
    <div className="tourpoints">
      <p>Please step through the following example:</p>
      <ul>
        <li>'Click' on the Arrange users by 'Role' button.</li>
        <li>'Click' on the Role of 'Engineering'</li>
        <li>
          Rule 0 denies all permissions to all users for every resource as
          default. This is then overriden by all the later Rules in the list.
        </li>
        <li>
          Rule 5 grants 'Engineering' Role the 'List' and 'Get' permissions on
          the Folder 'sch/eng'.
        </li>
        <li>
          Rule 27 grants 'Engineering' Role the 'List' and 'Get', and also
          explicitly denies 'Create', 'Update' and 'Delete' permissions on
          '/db/db_emp'
        </li>
      </ul>
    </div>
  );
}

function SLACNine() {
  return (
    <div className="tourpoints">
      <p>
        {" "}
        When you select a User, then the Tool displays Rules and Permissions
        that apply to all of the Roles allocated to the User, or their UserId.
      </p>
      <ul>
        <li>'Click' on the Arrange users by 'User' button.</li>
        <li>'Click' on the User 'Barry'.</li>
        <li>
          Rule 4 grants 'Barry' (as a User) full permissions to his own named
          Folder. The wildcard [all] is '/usr/emp/aca/Barry'
        </li>
        <li>The syntax of the Rules is not a concern for this experiment.</li>
        <li>
          Just note that each Rule has a Number Id, and specifies a Folder
          (Filepath), the User or Role it applies to, and the permissions that
          has been set.
        </li>
      </ul>
    </div>
  );
}

function SLACTen() {
  return (
    <div className="tourpoints">
      <p>
        To filter down the Rules and permissions displayed, you can select a
        Folder of interest.
      </p>
      <ul>
        <li>
          'Click' on the Folder 'eng' at '/apps/CANVAS/eng' in the Filetree.
        </li>
        <li>
          We now only see Rule 17, which is applicable to 'Barry' because he has
          a 'Tutor' Role.
        </li>
        <li>
          'Barry' (as a Tutor) is granted full permissions to 'eng' as it is
          under the '/apps/CANVAS' Folder.
        </li>
        <li>'Click' the ❌ to deselect both the user and file.</li>
      </ul>
    </div>
  );
}

function SLACEleven() {
  return (
    <div className="tourpoints">
      <p>
        There are some Training Questions to go through next. These are to
        familiarise you with the type of questions you will be asked in the
        experiment, and get you used to interacting with the tool.
      </p>
      <ul>
        <li>
          Use the → arrow to end the Tour, and then 'Click' the 'Training
          Questions' button to progress.
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
    selector: "#filesColumn",
    content: <SLACThree />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [0, 300],
  },
  {
    selector: "#rulesColumn",
    content: <SLACFour />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#root > div",
    content: <SLACFive />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [750, 400],
  },
  {
    selector: "#filesColumn",
    content: <SLACSix />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [50, 200],
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
    position: [800, 450],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACNine />,
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [400, 350],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACTen />,
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [0, 500],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACEleven />,
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [400, 200],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content:
      "You have completed the Tour - Please select Training Questions button",
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [400, 200],
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

  if (trainState === 2 && isTourOpen === false) setTrainState(3);
  // console.log("tourstep", tourStep);
  // console.log("GT trainState", trainState, "isTourOpen", isTourOpen);
  let endtour = tipsteps.length - 1;
  useEffect(() => {
    if (tourStep === endtour) {
      setIsTourOpen(() => false);
    }
  }, [tourStep]);

  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  return (
    <>
      {/* s<button onClick={setIsTourOpen(true)} title={'Tour'}></button> */}
      <Tour
        //className="guidedtour"
        maskClassName="guidedtour"
        closeWithMask={false}
        //startAt={tourStep}
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
        showCloseButton={true}
        onRequestClose={() => setIsTourOpen(false)}
        //onAfterOpen={disableBody}
      />

      {/* <Overview /> */}
    </>
  );
}
