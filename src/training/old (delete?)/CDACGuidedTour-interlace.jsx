import Tour from "reactour";
import { useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { Overview } from "./Overview";
import { useEffect } from "react";

function CDACOne() {
  return (
    <div className="tourpoints">
      <p>
        This is the Concept Diagram Tool. The left circle displays Users and
        Roles (Personnel). The right circle displays Folders and Files
        (Resources). The green arrow link between the Personnel and Resources
        circles indicates a relationship between the two.
      </p>
      <ul>
        <li>
          Please follow any 'Click' and 'Hover' instructions during the Guided
          Tour.
        </li>
        <li>Use the → arrow to step through the Tour.</li>
      </ul>
    </div>
  );
}

function CDACTwo() {
  return (
    <div className="tourpoints">
      <p>This is the Summary Panel.</p>
      <ul>
        <li>
          The drop down menu on the left allows you to select objects in the
          'Users' or the 'Resources' Circle.{" "}
        </li>
        <li>
          The input box to the right of the drop down menu can display an Option
          List of Users OR Roles, OR Resources.
        </li>
        <li>
          The Option list displayed depends on the Users-Roles switch position
          when 'Users' circle is selected.
        </li>
        <li>
          When you select a User, Role or Resource from the Option List, the
          name will appear as 'currently selected' with a Red Cross(deselect)
          beside it.
        </li>
        <li>
          You can clear the input box with the 'Clear' button, which you will
          need to do before making any new selection.
        </li>
      </ul>
    </div>
  );
}

function CDACThree() {
  return (
    <div className="tourpoints">
      <p>
        We will firstly look at how to display User information in the Users
        Circle. Users are displayed with red dots, and the Roles they have are
        displayed with Black circles.
      </p>
      <ul>
        <li>
          'Select' 'Users' from the drop down menu and 'Click' the Users-Roles
          switch to 'Users'.
        </li>
        <li>
          'Click' in the input box to display the Option List of User Names.
        </li>
        <li>
          'Click' on 'Arnold' in the Option List to display the Roles he has in
          the Users circle.
        </li>
      </ul>
      <p>
        'Arnold' has two Roles, 'Employee' and 'IT_Admin' and also a UserId
        (which is not associated to a Role). The Double lines (equivalence) link
        between all the Roles of the selected User, and the name appears as
        'currently selected' (with Red Cross beside it) in the Summary Panel.
      </p>
    </div>
  );
}

function CDACFour() {
  return (
    <div className="tourpoints">
      <p>
        When you 'Hover' over any Role (circle) or User (object) in the Users
        circle, a label is displayed. Once the label appears you can 'Click' to
        display the green arrow links to the Resources circle.
      </p>
      <ul>
        <li>'Click' on 'Arnold' within the 'IT_Admin' Role circle.</li>
      </ul>
      <p>
        The arrow links displayed are to the Resources that 'Arnold' within his
        'IT_Admin' Role has access to.
      </p>
      <ul>
        <li>Now 'Click' on 'Arnold' within the 'Employee' Role circle.</li>
      </ul>
      <p>
        The arrow links update to show what 'Arnold' has access to within his
        'Employee' Role. The links are different because 'Arnold' has different
        permissions to Resources from these two Roles.
      </p>
    </div>
  );
}

function CDACFive() {
  return (
    <div className="tourpoints">
      <p>
        'Hover' over any of the arrow links from one of 'Arnolds' Roles, to
        display an Information Panel that shows you details on the User and
        Role, and which Resource (Filepath) it links to. You can view the
        permissions that 'Arnold' in his 'Employee' Role has. It also shows
        which Rule No. granted or denied these permissions, for this Role or
        other Roles he has.
      </p>
      <ul>
        <li>
          'Hover' over all of the arrow links from 'Arnold' in his 'Employee'
          Role to the Resources to display the Information panel and note the
          differences in permissions on Resources.
        </li>
      </ul>
    </div>
  );
}

function CDACSix() {
  return (
    <div className="tourpoints">
      You can switch on the display of ALL the arrow links from ALL of 'Arnold'
      Roles.
      <ul>
        <li>
          'Click' on the 'View All Permissions' checkbox in the Summary Panel to
          display arrow links for ALL the other Roles 'Arnold' has.
        </li>
        <li>
          If there are no arrow links from a User or Role to a Resource (as in
          the case of 'Arnolds' UserId here), then there are no Rules that have
          granted any permissions for this.
        </li>
        <li>
          'Click' the 'View All Permissions' OFF again, to only see 'Arnold's
          'Employee' Role links displayed.
        </li>
      </ul>
    </div>
  );
}

function CDACSeven() {
  return (
    <div className="tourpoints">
      <p>
        You can filter down the Resources and links that are displayed, by
        selecting the Resource circle of interest. It will appear as currently
        selected in the Summary Panel.
      </p>
      <ul>
        <li>
          'Click' on the 'resources-usr-emp' circle in resources to ONLY display
          links from 'Arnold' in 'Employee' Role to this Folder and it contents.
        </li>
      </ul>
      <p>
        Note that the arrow ONLY links to the outer circle. This means all the
        VISIBLE Resources within the circle will have the same permissions.
      </p>
      <ul>
        <li>
          In the summary panel, 'Click' on the 'Red Cross' beside the selected
          User and Resource Folder names to 'deselect' them from display.
        </li>
        <li>
          You will be taken back to the Overview when you 'Click' → arrow.
        </li>
      </ul>
    </div>
  );
}

function CDACEight() {
  return (
    <div className="tourpoints">
      To display information about Roles on the Concept Diagram, follow these
      steps:
      <ul>
        <li>
          'Click' on 'Roles' on the Users-Roles switch in the Summary Panel.
        </li>
        <li>
          'Click' on 'Users' on the drop down menu and 'Clear' the input box.
        </li>
        <li>'Click' in the input box to see an Option List of Role names.</li>
        <li>
          'Click' on the Role 'Employee' to display all the Users in this Role.
        </li>
      </ul>
      There is ONLY one arrow link from the 'Employee' circle to a Resource
      circle. This means that all Users VISIBLE in the 'Employee' circle share
      the same permissions to the Resource that the arrow links to.
    </div>
  );
}

function CDACNine() {
  return (
    <div className="tourpoints">
      It is possible that individual Users in this Role Group have access to
      other Resources as well. These will only be displayed when you select a
      User inside the Role circle.
      <ul>
        <li>'Click' on 'Donald' in the 'Employee' circle.</li>
      </ul>
      This will display all of 'Donalds' other Roles, and additional links to
      any resources he has access to within is 'Employee' Role.
      <ul>
        <li>
          Now 'Click' on the 'Employee' Circle to re-display the all the Users
          within this Role again, with their shared common link to one Resource.
        </li>
      </ul>
    </div>
  );
}

function CDACTen() {
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
          User information from display.
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

function CDACEleven() {
  return (
    <div className="tourpoints">
      <p>
        The Resources circle contains the hierarchical File Tree. The largest
        circles are the top level Folders, and nested circles within are
        Sub-Folders. Files are represented by the red dots.
      </p>
      <ul>
        <li>
          'Click' on 'Resources' from the drop down menu, and 'Click' the
          'Clear' button to clear any previous selection in the input box.
        </li>
        <li>
          'Click' in the input box to display Folders and Files in the Option
          List.
        </li>
        <li>
          'Click' on the Folder 'resources-sch' in the Option List to display
          all arrow links to different Users and Roles who have access to it.
        </li>
        <li>
          'Hover' over the selected Folder to display a label of the contents.
        </li>
      </ul>
    </div>
  );
}

function CDACTwelve() {
  return (
    <div className="tourpoints">
      <p>
        Note that the links from the IT_Admin Role are drawn from the Role
        Circle, indicating that the two Users within this Role share the same
        permissions to these Resources.
      </p>
      <p>
        The links from the Engineering Role are drawn from the Users within the
        Role, indicating that not all Users in this Role Group have the same
        permissions.
      </p>
      <p>
        Cassie is not VISIBLE in the Engineering Role, and therefore has no
        permissions granted to the resource from this Role. Her Role as
        'Eng_Coordinator' grants her different permissions to 'resources-sch'.
        'Hover' over the links to display Information Panels.
      </p>
    </div>
  );
}

function CDACThirteen() {
  return (
    <div className="tourpoints">
      <p>
        You can enter a search term into the input box to filter the option list
        shown.
      </p>
      <ul>
        <li>
          'Click' on 'Resources' from the drop down menu and 'Click' on the
          'Clear' button to clear the input box.
        </li>

        <li>
          'Type' the term 'canvas' in the input box to filter the Option List to
          only display Folders and Files with 'stu' within.
        </li>
        <li>
          'Click' on the Folder 'resources-apps-CANVAS' from the filtered Option
          List to display this Sub-Folder in the Resources circle.
        </li>
      </ul>
    </div>
  );
}

function CDACFourteen() {
  return (
    <div className="tourpoints">
      <p>
        There are three Roles that have the same permissions to the Sub-Folder
        'resources-apps-CANVAS', and some of the Users in the Student Role also
        have permissions to this Resource. (Except 'Ronald' who is greyed out
        here).
      </p>
      <ul>
        <li>
          'Click' on 'Ronald' within the 'Tutor' Role to filter on this User.
          This displays the Users link to 'resources-apps-CANVAS'.
        </li>

        <li>
          Now 'Click' on the 'Tutor' Role circle to filter on this Role. This
          displays one arrow link to 'resources-apps-CANVAS', indicating all
          three Users in the Role share the same permissions here.
        </li>
        <li>
          'Click' on the 'Red Cross' beside the User and Sub-Folder name
          selected in the Summary Panel to clear the display.
        </li>
        <li>
          You will be taken back to the Overview when you 'Click' → arrow.
        </li>
      </ul>
    </div>
  );
}

function CDACFifteen() {
  return (
    <div className="tourpoints">
      To recap on the example given in the last slide:
      <ul>
        <li>
          'Click' on 'Users' and 'Click' the 'Clear' button to clear the input
          box.
        </li>
        <li>'Click' in the input box to see an option list of User Names.</li>
        <li>
          'Click' on 'Arnold' on the Option List to display his Roles in the
          Users circle.
        </li>
        <li>
          'Click' on 'Arnold' in the 'Employee' Role to display the arrow links
          to Resources.
        </li>
      </ul>
    </div>
  );
}

function CDACSixteen() {
  return (
    <div className="tourpoints">
      <ul>
        <li>'Hover' over the arrow link to display the Information Panel.</li>
        <li>
          'Arnold' has List and Get access to 'apps/LIB_SYS', however, they are
          granted by two different Rules applied to his two Roles.
        </li>
        <li>
          'Hover' over the other resources 'Arnold' has links to display labels
          about the Folders.
        </li>
        <li>
          'Click' on the 'resources-usr-emp' circle to filter on this Folder,
          and 'Hover' over the arrow link. You will see he has List access
          granted by Rule 19 for his 'IT_Admin' Role.
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
    position: [600, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACTwo />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 100],
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
    position: [700, 0],
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
    position: [700, 0],
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
    position: [700, 100],
  },
  {
    selector: "#root > div.App",
    content: <CDACNine />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACTen />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 100],
  },
  {
    selector: "#root > div.App",
    content: <CDACEleven />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [0, 250],
  },
  {
    selector: "#root > div.App",
    content: <CDACTwelve />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACThirteen />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [700, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACFourteen />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [700, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACFifteen />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [500, 0],
  },
  {
    selector: "#root > div.App",
    content: <CDACSixteen />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [0, 250],
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
