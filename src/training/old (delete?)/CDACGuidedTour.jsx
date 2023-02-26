import Tour from "reactour";
import { useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { Overview } from "./Overview";
import { useEffect } from "react";

function CDACOne() {
  return (
    <div className="tourpoints">
      <p>
        This is the Concept Diagram Tool. The left circle displays Personnel
        (Users and Roles). The right circle displays Resources (Folders and
        Files). The green arrow link between Personnel and Resources circles
        indicates a relationship between the two.
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
      <p>
        <strong>Displaying Users in the Personnel circle :</strong> Users are
        displayed with red dots, and are contained within Black Circles which
        represent the different Roles. The Summary Panel provides some display
        options.
      </p>
      <ul>
        <li>
          'Click' the Users-Roles switch to 'Users' to select 'Users' View Mode.
        </li>
        <li>
          'Click' on the 'personnel' drop down menu to display an Option List of
          User Names.
        </li>
        <li>
          'Click' on a User name from the Option List to display the User in the
          Personnel circle below.
        </li>
      </ul>
      <p>
        All the Roles that the selected User belongs to are displayed, with the
        User (red dot) inside. The Double lines linking them indicates they all
        the same User (with different Roles). There is also the UserId (for
        every User) which does not belong to a Role. The Selected User name
        appears alongside 'personnel' in the Summary Panel.
      </p>
    </div>
  );
}

function CDACThree() {
  return (
    <div className="tourpoints">
      <p>
        <strong>In 'Users' View Mode:</strong> Once the User and their Roles are
        displayed, you can find out more about them from inside the personnel
        circle.
      </p>
      <ul>
        <li>
          'Hover' over a User (red dot) within a Role circle, to display a
          label.
        </li>
        <li>
          'Click' on the User (red dot) within a Role to display green arrow
          links to the Resources that they have access to.
        </li>
        <li>
          'Click' on the User within a different Role to see the arrow links
          update to the Resources they have access to within that Role.
        </li>
      </ul>
    </div>
  );
}

function CDACFour() {
  return (
    <div className="tourpoints">
      <strong>In 'Users' View Mode:</strong> You can display ALL the arrow links
      from ALL of the Users Roles.
      <ul>
        <li>
          'Click' on the 'View All Permissions of selected user' checkbox in the
          Summary Panel to display arrow links for ALL the other Roles the
          selected User has.
        </li>
        <li>
          If there are no arrow links from a User or Role to a Resource, then
          there are no Rules that have set any permissions for this.
        </li>
        <li>
          'Click' the 'View All Permissions of selected user' OFF again, to only
          see links for only one of the Users Role again.
        </li>
        <li>
          'Click' on the ❌ beside the selected User in the Summary Panel to
          deselect them from display.
        </li>
      </ul>
    </div>
  );
}

function CDACFive() {
  return (
    <div className="tourpoints">
      <p>
        <strong>Displaying Roles in the Personnel circle :</strong> When you
        switch to 'Roles' View Mode, you can find out more information about all
        the Users belonging to a Role.
      </p>
      <ul>
        <li>
          'Click' the Users-Roles switch to 'Roles' to select 'Roles' View Mode.
        </li>
        <li>
          'Click' on the 'personnel' drop down menu to display an Option List of
          Roles.
        </li>
        <li>
          'Click' on a Role from the Option List to display the Role in the
          Personnel circle and the links to Resources.
        </li>
        <li>
          'Click' on the ❌ beside the personnel:selected Role in the Summary
          Panel to deselect it from display.
        </li>
      </ul>
      <p>
        In 'Roles' View Mode, an arrow link is drawn from the Role Circle (edge)
        to Resources when all the Users in that Role share the same permissions
        to the Resource. Multiple arrow links are drawn to Users within the Role
        circle, when they have different permissions to each other.
      </p>
    </div>
  );
}

function CDACSix() {
  return (
    <div className="tourpoints">
      <p>
        <strong>Displaying Folders and Files in the Resources circle :</strong>
        The Resources circle on the right displays all the Folders and Files in
        the FileTree. Files are displayed as Red dots, and Folders are
        represented by black circles. The nested circles represent Folders
        within Folders.
      </p>
      <ul>
        <li>
          'Hover' over any Folder (circle) to display a label of contents.
        </li>
        <li>
          'Click' on Folder or File (circle or dot) to select, and display arrow
          links to Users and Roles.
        </li>
        <li>
          'Click' on 'Clear' button to clear any previous selection from the
          'Resources' input box.
        </li>
        <li>
          'Click' in the 'Resources' input box (on the right of Summary Panel)
          to display an Option List of Folders (Filepaths).
        </li>
        <li>
          'Click' on a Folder from the Option List to display that Folder and
          contents in the Resources circle.
        </li>
      </ul>
      <p>
        When you click on, or select a Folder for display, the arrow links are
        drawn from the Folder circle to any User or Role that has access to the
        Folder. They will have the same access to any Folder contents that is
        visible.
      </p>
    </div>
  );
}

function CDACSeven() {
  return (
    <div className="tourpoints">
      <p>
        <strong>Filtering Folders and Files in the Resources circle :</strong>{" "}
        You can enter a search term into the input box to filter the Option list
        shown.
      </p>
      <ul>
        <li>
          'Click' on the 'Clear' button to clear the 'Resources' input box.
        </li>

        <li>
          'Type' the term 'canvas' in the input box to filter the Option List to
          only display Filepaths with 'canvas' in.
        </li>
        <li>
          'Click' on the Folder 'resources-apps-CANVAS' from the
          <strong>filtered</strong> Option List to display this Folder in the
          Resources circle and arrow links to any Users and Roles that have
          access to it.
        </li>
      </ul>
    </div>
  );
}

function CDACEight() {
  return (
    <div className="tourpoints">
      <p>
        <strong>Displaying Permissions and Rules from arrow links:</strong> You
        can hover over any green arrow link to display the Rules Information
        Panel. The Rules information Panel shows you the Users and Role and the
        Resource that the link relates to, and settings for the five permissions
        (List, Get, Create, Update and Delete). You will also see the Rule No.
        that applied the permissions for the Role.
      </p>
      <ul>
        <li>
          'Click' on the <strong>'UG_student'</strong> Role within the personnel
          circle (or select from Option List) to display the arrow links from
          this Role to Resources.
        </li>
        <li>
          'Hover' over one of these arrow links from the Role circle to display
          the Rule Information Panel.
        </li>
      </ul>
      <p>
        An arrow link drawn from the Role circle indicates that all Users in
        that Role share the same permissions for the Folder it links to.
      </p>
    </div>
  );
}

function CDACNine() {
  return (
    <div className="tourpoints">
      <strong>Displaying Permissions and Rules from arrow links:</strong>When a
      Role is selected and arrow links are drawn to individual Users within a
      Role, it indicates that there are differences in User permissions in that
      Role group.
      <ul>
        <li>
          'Click' on <strong>MSC_Student</strong> Role circle to display the
          arrow links to Resources.
        </li>
        <li>
          'Hover' over the arrow links to display the Rule Information Panel.
        </li>
      </ul>
      Only two Users in this Role have links. The other three Users are not
      visible, so do not have permissions to resources from this Role.
    </div>
  );
}

function CDACTen() {
  return (
    <div className="tourpoints">
      <strong>Filtering Users/Roles and Resources:</strong>When a User or Role
      is selected, with many links to Resources, you can filter down to a
      particular Folder of interest.
      <ul>
        <li>'Click' the Users-Roles switch to 'Users' view mode.</li>
        <li>
          'Click' on the 'personnel' drop down menu to see an option list of
          User Names.
        </li>
        <li>
          'Click' on 'Arnold' in the Option List to display his Roles in the
          personnel circle.
        </li>
        <li>
          'Click' on 'Arnold' in the 'IT_Admin' Role to display the arrow links
          to Resources. 'Hover' over the links to display the Rules Information
          Panel.
        </li>
        <li>
          'Click' on the '/apps/IT_Ticket' Folder in Resources (or select from
          option list) to filter out arrow links to any other other Resources.
        </li>
        <li>
          'Click' on the ❌ beside the selected User or Folder in the Summary
          Panel to deselect it, and re-display all the links for 'Arnold' or
          '/apps/IT_TICKET' respectively.
        </li>
      </ul>
    </div>
  );
}

function CDACEleven() {
  return (
    <div className="tourpoints">
      <p>
        There are some Training Questions to go through next. These are to
        familiarise you with the type of questions you will be asked in the
        experiment, and get you used to interacting with the tool to.
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
    selector: "#root > div.App",
    content: <CDACOne />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 150],
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
    position: [600, 100],
  },
  {
    selector: "#root > div.App",
    content: <CDACFour />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [600, 100],
  },
  {
    selector: "#root > div.App",
    content: <CDACFive />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [700, 100],
  },
  {
    selector: "#root > div.App",
    content: <CDACSix />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [100, 300],
  },
  {
    selector: "#root > div.App",
    content: <CDACSeven />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [100, 300],
  },
  {
    selector: "#root > div.App",
    content: <CDACEight />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [800, 100],
  },
  {
    selector: "#root > div.App",
    content: <CDACNine />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [800, 100],
  },
  {
    selector: "#root > div.App",
    content: <CDACTen />,
    style: {
      backgroundColor: "#48D1CC",
    },
    position: [0, 300],
  },
  {
    selector: "#root > div.App",
    content: <CDACEleven />,
    style: {
      backgroundColor: "#48D1CC",
    },
  },
  {
    selector: "#treesvg",
    content: "Select Training Questions",
    style: {
      backgroundColor: "#48D1CC",
      opacity: 0.1,
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
  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  useEffect(() => {
    if (tourStep === tipsteps.length - 1) {
      setIsTourOpen(() => false);
      setTourStep(() => 0);
    }
  }, [tourStep]);

  return (
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
  );
}
