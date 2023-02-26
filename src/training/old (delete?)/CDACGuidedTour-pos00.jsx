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
        or Roles (depending on the position of the 'Users-Roles' switch below).
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
          'Hover' over the top arrow that links to the largest circle
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
      To display information about Roles on the Tool, follow these steps:
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

function CDACNine() {
  return (
    <div className="tourpoints">
      <ul>
        <li>'Click' on 'Personnel' and 'Click' to 'clear(X)' the input box.</li>
        <li>'Click' in the input box to see an option list of User Names</li>
        <li>'Click' on 'Arnold' on the Option List to display his Roles</li>
        <li>
          'Click' on 'Arnold' in the 'Employee' Role to display arrow links to
          the Resources.
        </li>
        <li>Arrow links are displayed from the Role circle to Resources.</li>
      </ul>
    </div>
  );
}

function CDACTen() {
  return (
    <div className="tourpoints">
      <ul>
        <li>'Click' on 'Resources' and 'Click' to 'clear(X)' the input box.</li>
        <li>'Click' in the input box to see an option list of Folders.</li>
        <li>
          'Click' on the Folder 'resources-apps-LIB_SYS' to display only this
          Folder and links to it.
        </li>
        <li>
          'Hover' over the arrow to display the Rule Panel to see permissions
          and the Rule No./s that granted them.
        </li>
        <li>
          If no arrow links appear when you 'Click' on a User or Role, there is
          no Rule in the list that applies.
        </li>
      </ul>
      You will be taken back to the Overview when you 'Click' → arrow.
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
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACThree />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACFour />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACFive />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
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
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACEight />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACNine />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACTen />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
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
