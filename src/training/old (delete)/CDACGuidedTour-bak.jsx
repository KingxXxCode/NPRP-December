import Tour from "reactour";
import { useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { Overview } from "./Overview";
import { useEffect } from "react";

function CDACOne() {
  return (
    <div className="tourpoints">
      <p>
        This is the Concept Diagram Tool you will be using for the training
        scenario and experiment. The circle on the left displays Users and
        Roles, and the circle on the right displays Folders and Files
        (Resources). Through interaction with the Tool, green arrows link
        between Users and Resources, and the Rules panel with permissions will
        be displayed when you Hover over an arrow link.
      </p>
      <ul>
        <li>
          Please follow any 'Click' and 'Hover' instructions during the Guided
          Tour.
        </li>
        <li>
          Use the → arrow to step through the Tour until you are taken back to
          the training for more information.
        </li>
      </ul>
    </div>
  );
}

function CDACTwo() {
  return (
    <div className="tourpoints">
      <p>
        This is the Summary Panel (pink). The drop down menu on the left allows
        you to select the Users Circle ('Personnel') or the 'Resources' Circle.
        The input box to the right of this can display an Option List of Users
        or Roles, depending on the position of the 'Users-Roles' switch below.
        You can clear the input box with the 'X' button.
      </p>
      <ul>
        <li>
          'Click' in the input box to display the option List of User Names.
        </li>
        <li>
          'Click' on 'Arnold' in the Option List to display the Roles he has in
          the Users circle.
        </li>
        <li>'Arnold' has two Roles, 'Employee' and 'IT_Admin' and a UserId.</li>
        <li>
          The Double lines (equivalence) link between all the Roles of a
          selected User.
        </li>
      </ul>
    </div>
  );
}

function CDACThree() {
  return (
    <div className="tourpoints">
      <p>
        When you 'Hover' over any Role (circle) or User (object) in the Users
        circle, a label is displayed. Once the label appears you can 'Click' to
        display the green arrow links to the Resources circle.
      </p>
      <ul>
        <li>'Click' on 'Arnold' within the 'IT_Admin' Role.</li>
        <li>
          This will display green arrow links to all the Resources that 'Arnold'
          with his 'IT_Admin' Role has access to.
        </li>
      </ul>
    </div>
  );
}

function CDACFour() {
  return (
    <div className="tourpoints">
      <ul>
        <li>
          'Hover' over the arrow (top) that links to the largest circle
          (resources-usr) within Resources to display the Rules panel.
        </li>
        <li>
          'Arnold' in his 'IT_Admin' Role has List access to the 'resources-usr'
          Folder granted by Rule 19.
        </li>
        <li>
          'Hover' over all the arrows to see what other Rules apply to the
          'IT_Admin' Role.
        </li>
        <li>
          'Click' on the 'resources-usr' circle in resources to only display
          this Folder and contents.
        </li>
        <li>
          In the summary panel, 'Click' on the 'Red Cross' beside the User and
          Folder names you selected to clear them from display.
        </li>
        <li>
          You will be taken back to the Overview when you 'Click' → arrow.
        </li>
      </ul>
    </div>
  );
}

function CDACFive() {
  return (
    <div className="tourpoints">
      <ul>
        <li>
          'Click' on 'Roles' on the Users-Roles switch in the Summary Panel.
        </li>
        <li>'Click' on 'Personnel' and 'Click' to 'clear(X)' the input box.</li>
        <li>'Click' in the input box to see an option list of Role names.</li>
        <li>
          'Click' on the Role 'Employee' to display all the Users in this Role.
        </li>
        <li>Arrow links are displayed from the Role circle to Resources.</li>
      </ul>
    </div>
  );
}

function CDACSix() {
  return (
    <div className="tourpoints">
      <ul>
        <li>
          'Hover' over the ? box in the top right of Summary Panel to see the
          Key guide to Drill-Up and Drill-Down on information displayed in
          Circles.
        </li>
        <li>
          'Hold' the Option Key (Mac) or Alt Key (Windows) down and then 'Click'
          on the 'Employee' circle.
        </li>
        <li>
          This will 'Drill-Up' on the contents of the Role circle, and clear the
          Users from display.
        </li>
        <li>
          Repeat this to 'Drill-Down' again, to re-display the Users in the
          'Employee' circle.
        </li>
        <li>
          You will be taken back to the Overview when you 'Click' → arrow.
        </li>
      </ul>
    </div>
  );
}

function CDACSeven() {
  return (
    <div className="tourpoints">
      <p>
        The Resources circle contains the hierarchical File Tree. The largest
        circles are the top level Folders, and nested circles within are
        Sub-Folders. Files are represented by the red dots.
      </p>
      <ul>
        <li>'Click' on 'Resources' from the drop down menu.</li>
        <li>
          'Click' the Clear(X) to clear any previous selection from the input
          box.
        </li>
        <li>
          'Click' in the input box to display Folders and Files in the Option
          List.
        </li>
        <li>
          'Click' on the Folder 'resources-sch' in the Option List to display
          this Folder in the Resources circle and the arrow links to Users and
          Roles with access to it.
        </li>
      </ul>
    </div>
  );
}

function CDACEight() {
  return (
    <div className="tourpoints">
      <p>
        You can enter a search term into the input box to filter the option list
        shown.
      </p>
      <ul>
        <li>
          'Click' on 'Resources' from the drop down menu and 'Clear(X)' the
          input box.
        </li>

        <li>
          'Type' the term 'eng' in the input box to filter the option list to
          only display Folders and Files with 'eng' within.
        </li>
        <li>
          'Click' on the Folder 'resources-sch-eng-inftc' from the filtered list
          to display this Sub-Folder in the Resources circle.
        </li>
        <li>
          'Click' on the 'Red Cross' beside the Sub-Folder name selected in the
          Summary Panel to clear the display.
        </li>
        <li>
          You will be taken back to the Overview when you 'Click' → arrow.
        </li>
      </ul>
    </div>
  );
}

function CDACSeven() {
  return (
    <div className="tourpoints">
      <p>
        The Resources circle contains the hierarchical File Tree. The largest
        circles are the top level Folders, and nested circles within are
        Sub-Folders. Files are represented by the red dots.
      </p>
      <ul>
        <li>'Click' on 'Resources' from the drop down menu.</li>
        <li>
          'Click' the Clear(X) to clear any previous selection from the input
          box.
        </li>
        <li>
          'Click' in the input box to display Folders and Files in the Option
          List.
        </li>
        <li>
          'Click' on the Folder 'resources-sch' in the Option List to display
          this Folder in the Resources circle and the arrow links to Users and
          Roles with access to it.
        </li>
      </ul>
    </div>
  );
}

function CDACTen() {
  return (
    <div className="tourpoints">
      <p>Use these steps to arrive the answer</p>
      <ul>
        <li>'Click' on 'Personnel'</li>
        <li>'Click' Clear(X) to clear previous selection from input Box</li>
        <li>'Click' input box and Select 'Barry' in the option List</li>
        <li>
          He is highlighted in the User Circle within his different Roles
          (linked)
        </li>
        <li>
          There is no circle labelled with Role of 'Eng_Tutor' so 'Barry' does
          not have this Role
        </li>
      </ul>
    </div>
  );
}
function CDACEleven() {
  return (
    <div className="tourpoints">
      <p>Use these steps to arrive the answer</p>
      <ul>
        <li>'Click' on 'Personnel'</li>
        <li>'Click' Clear(X) to clear previous selection from input Box</li>
        <li>'Click' input box and Select 'Barry' in the option List</li>
        <li>
          He is highlighted in the User Circle within his different Roles
          (linked)
        </li>
        <li>
          There is no circle labelled with Role of 'Eng_Tutor' so 'Barry' does
          not have this Role
        </li>
      </ul>
    </div>
  );
}

const tipsteps = [
  {
    selector: "#root > div.App",
    content: <CDACOne />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACTwo />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 200],
  },
  {
    selector: "#root > div.App",
    content: <CDACThree />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [700, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACFour />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [0, 300],
  },
  {
    selector: "#root > div.App",
    content: <CDACFive />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACSix />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACSeven />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [0, 250],
  },
  {
    selector: "#root > div.App",
    content: <CDACEight />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [0, 250],
  },
  {
    selector: "#root > div.App > div.App-Body > div > div.highlighting-summary",
    content:
      "With <Personnel> selected, 'Click' in the <input box> to display the option list of User names. 'Click' on 'Barry' to display information about this User and his Roles. 'Barry' (the User) is displayed outside the Roles aswell. Double line links indicate all five instances are the same User.",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 0],
  },
  {
    selector: "#root > div.App > div.App-Body ",
    content:
      "'Hover' over 'Barry' inside the 'Tutor' Role to display his Name and Role. Now 'Click' on 'Barry' to display the green arrow that links to any Resources he has access to.",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 0],
  },
  {
    selector: "#root > div.App",
    content:
      "'Hover' over the green arrows to display the permissions that have been granted or denied for 'Barry' in his 'Tutor' Role. 'Barry' (Tutor) has been granted all permissions (LGCUD) to the /apps/CANVAS folder by Rule No. 17. ",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 0],
  },
  {
    selector: "#root > div.App",
    content:
      "'Click' the <Users - Roles> switch to 'Roles' and 'Click' in the <input box>. The option list now displays Roles. 'Click' on the Role of 'Tutor' to display more information about the Role. There are two more Users with this Role ('Debbie' and 'Ronald') now displayed. ",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 0],
  },
  {
    selector: "#root > div.App",
    content:
      "'Hover' over the <?> in the summary box for a shortcut key guide on Windows or Mac. Drill-Up displays less detail, and Drill-Down displays more detail in Users or Resources. 'Click' on the 'Tutor' circle and 'Hold' down the <Option key(Mac)> or <Alt key(Windows)>. This clears the Users displayed inside this Role (Drill-Up). 'Click' on Tutor with <Option OR Alt key> again to view the Users again (Drill-Down).",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content:
      "'Click' on Ronald in the 'Tutor' Role to display links to his Roles and arrows to his Resources. His name appears alongside user: in the summary box. 'Click' the <Red Cross> alongside user:Ronald to clear the link information. You will be returned to the Overview when you click -> arrow. ",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content:
      "'Click' on the drop down menu above to select <Resources>, and then 'Click' on the 'resources-sch' from the option list. This will highlight the '/sch' Folder in the Resources circle, and display arrow links from any Roles that has access to this Folder. ",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content:
      "'Click' in the <input box> and type the search term for 'eng' to find Folders and Files with 'eng' in the option list. 'Click' on the 'sch-eng' option to highlight this Sub-Folder in the Resources circle. This will also display arrow links to any Users or Roles that have access to the Sub-Folder.",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 100],
  },
  {
    selector: "#root > div.App",
    content:
      "A notification is now displayed in the summary box, to indicate that there are Users with different permissions to the selected file.",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [700, 200],
  },
  {
    selector: "#root > div.App",
    content:
      "'Hover' over the green arrows from the 'Eng_Coordinator' Role which has the User 'Cassie' and the 'Engineering' Role to view the differences in permissions granted between the two Roles.",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [700, 200],
  },
  {
    selector: "#root > div.App",
    content:
      "'Click' the <Red Cross> alongside the selected file: 'resources-sch-eng' in the summary box to deselect this Folder and its links from view. You will be returned to the Overview when you click -> arrow.",
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [700, 200],
  },
  {
    selector: "#treesvg",
    content:
      "You can now close the Guided Tour and continue to familiarise with the page and functions yourself before moving onto the training session.",
    style: {
      backgroundColor: "#33DDFF",
    },
  },
];

export default function CDACGuidedTour({
  trainState,
  setTrainState,
  tourStep,
  setTourStep,
}) {
  const [isTourOpen, setIsTourOpen] = useState(true);
  useEffect(() => {
    setTrainState(3);
  }, []);

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
        maskClassName="guidedtour"
        closeWithMask={false}
        disableFocusLock={true}
        startAt={tourStep}
        // getCurrentStep={(curr) =>
        //   setTutorialProgress((prevState) => {
        //     return { ...prevState, tourStep: curr };
        //   })
        // }
        getCurrentStep={(currentStep) => setTourStep(currentStep)}
        //onAfterOpen={disableBody}
        inViewThreshold={0}
        scrollOffset={0}
        steps={tipsteps}
        isOpen={isTourOpen}
        //onBeforeClose={enableBody}
        onRequestClose={() => setIsTourOpen(false)}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
      />
      {/* {updateTrainState} */}

      {/* <Overview /> */}
    </>
  );
}
