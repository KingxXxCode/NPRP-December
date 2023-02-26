import Tour from "reactour";
import { useState } from "react";
import { useEffect } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

function DMACOne() {
  return (
    <div className="tourpoints">
      <p>
        This is the Visualisation Tool. It is a Matrix that displays User and
        Roles (X-Axis) and Folders and Files (Y-Axis). The permissions for each
        combination are displayed in the Grid.
      </p>
      <ul>
        <li>Use the → arrow to step through the Tour.</li>
        <li>
          Please follow any 'Click' instructions to see what effect the
          interactions have with the Tool.
        </li>
      </ul>
    </div>
  );
}

function DMACTwo() {
  return (
    <div className="tourpoints">
      <p>
        The X-Axis initially displays the User names. You can use the horizontal
        scroll bar to move across.
      </p>
      <ul>
        <li>
          'Click' on 'Expand X Axis' button to display the Users and their Roles
          along the X-Axis.
        </li>
        <li>
          'Click' on Arrange users by 'User' buttons to switch User names to the
          top line of the X-Axis. In this mode, you will see a User name with
          all their allocated Roles underneath. The X-Axis shading alternates
          between white and grey for each User.
        </li>
        <li>
          Scroll down the grid to see all Permissions in the Cells that the User
          and their Roles has for each Folder and Files. The shaded crosshairs
          provide a guide for navigating around the Grid.
        </li>
      </ul>
    </div>
  );
}

function DMACThree() {
  return (
    <div className="tourpoints">
      <p>
        The Y-Axis displays the File Tree in a hierarchical tree of Folders and
        Files. You can use the mouse wheel to scroll up and down the list.
      </p>
      <ul>
        <li>
          'Click' on the 'Collapse All Folders' button to display only the top
          level Folders.
        </li>
        <li>
          'Click' on the 'Expand All Folders' button to display the whole
          FileTree again.
        </li>
        <li>'Click' on ▶ to expand and ▼ to collapse one Folder only.</li>
      </ul>
    </div>
  );
}

function DMACFour() {
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

function DMACFive() {
  return (
    <div className="tourpoints">
      <p>
        Each cell in the grid displays permissions in a row of five bullets that
        correspond to <strong>List, Get, Create, Update and Delete</strong>.
        Red=Denied by a Rule. Green=Granted by a Rule. White=No Rule applies (so
        permission denied by default).
      </p>
      <ul>
        <li>
          A User can have more than one Role (columns), so there may be one or
          more Rules that has set permissions for each Role.
        </li>
        <li>
          'Click' in a Cell that has coloured bullets to display the Permissions
          for the combination of User (X-Axis) and Folder or File(Y-Axis) that
          you have selected.
        </li>
        <li>
          In Arrange by 'User' Mode, the Rule Information Panel shows a summary
          of permissions for the User and all their Roles, and any applicable
          Rules.
        </li>
      </ul>
    </div>
  );
}

function DMACSix() {
  return (
    <div className="tourpoints">
      <p>Lets look at Arranging the Users by 'Role' mode.</p>
      <ul>
        <li>
          'Click' the ❌ at the top of the Rules Information Panel to close it.
        </li>
        <li>
          'Click' on Arrange users by 'Role' button to switch Roles to the top
          line of the X-Axis. In this mode, you will see all the User names
          (columns) that belong to each Role.
        </li>
        <li>
          Scroll horizontally to see the X-Axis shading alternates between white
          and grey for the different Roles and Users belonging to the Role
          (underneath).
        </li>
        <li>
          'Click' in a cell to display the Rule Information Panel, which will
          display the permissions set for the User. In this mode, there will
          only be one Rule No. that applies to the selected Role for that User.
        </li>
      </ul>
    </div>
  );
}

function DMACSeven() {
  return (
    <div className="tourpoints">
      <p>
        To recap, when you Arrange by 'User' you will see a summary of the
        permissions set for all of their Roles in the Rule Information Panel.
        When you Arrange by 'Role', you will see the permissions set for the
        User in one Role.
      </p>
      <ul>
        <li>
          Switch between the User and Role modes with the 'User' and 'Role'
          buttons.
        </li>
        <li>
          'Click' on any cell in each mode to familiarise yourself with the Rule
          Panel Information.
        </li>
      </ul>
    </div>
  );
}

function DMACEight() {
  return (
    <div className="tourpoints">
      <p>
        There is a third mode for viewing permissions on the Matrix. This mode
        can be used when you want to see permission settings for multiple Users
        that are allocated to a Role.
      </p>
      <ul>
        <li>'Click' the Arrange by 'Role' button to select Role Mode.</li>
        <li>
          'Click' on the 'Collapse X Axis' button to ONLY view Roles on the
          X-Axis. The display in each Cell now changes to five rows of
          permissions bullets within each Cell.
        </li>
        <li>
          The Y-Axis of the five rows (bottom to top) in each cell corresponds
          to 1, 2+, 4+, 8+ and 16+ Users. (Refer to key in top left screen)
        </li>
      </ul>
    </div>
  );
}

function DMACNine() {
  return (
    <div className="tourpoints">
      <p>
        Scroll to one of the Cells under 'IT_Admin' Role. There is only one row
        of permissions displayed on the '2+ Users' position of the Cell Y-Axis,
        and they have the same permissions set for the Folder on the Grid
        Y-Axis.
      </p>
      <ul>
        <li>
          'Click' on a Cell in the 'IT_Admin' Role column to display the Rule
          Information Panel.
        </li>
      </ul>
      <p>
        This displays the permissions for both of the Users in the 'IT_Admin'
        Role ('Arnold' and 'Adele'), and the Rule No. that applies.
      </p>
      <ul>
        <li>
          'Click' on the ❌ at the top of the Rules Information Panel to close
          it.
        </li>
      </ul>
    </div>
  );
}

function DMACTen() {
  return (
    <div className="tourpoints">
      <p>
        Lets now look at the Cell for 'Employee' and '/apps/CANVAS'. Note that
        on the 2+ Users row, the 'Create' and 'Delete' bullet is an outlined
        darker green. This tells us there are atleast two groups of 2+ Users
        with different permission settings, and 8+ Users with the same
        permissions as each other.
      </p>
      <ul>
        <li>
          'Click' on the Cell 'Employee' and '/apps/CANVAS' to display the Rule
          Information Panel.
        </li>
      </ul>
      <p>
        Scroll down the information. There are two Users with 'Tutor' Role that
        have all permissions granted. There are two Users with 'Coordinator'
        Role with 'Create' and 'Delete' denied. There are three Users with the
        'Student' Role who have 'Delete' denied. There are 10 Users with all
        permissions denied. The 'Create' and 'Delete' bullets are outlined in
        the Cell to indicate the difference in settings.
      </p>
    </div>
  );
}

function DMACEleven() {
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
    selector: "#root > div > div",
    content: <DMACOne />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
  },
  {
    selector: "#root > div",
    content: <DMACTwo />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [300, 300],
  },
  {
    selector: "#root > div",
    content: <DMACThree />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [300, 300],
  },
  {
    selector: "#root > div",
    content: <DMACFour />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [200, 300],
  },
  {
    selector: "#root > div",
    content: <DMACFive />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [200, 300],
  },
  {
    selector: "#root > div",
    content: <DMACSix />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [200, 300],
  },
  {
    selector: "#root > div",
    content: <DMACSeven />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [200, 300],
  },
  {
    selector: "#root > div",
    content: <DMACEight />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [200, 300],
  },
  {
    selector: "#root > div",
    content: <DMACNine />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [510, 300],
  },
  {
    selector: "#root > div",
    content: <DMACTen />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [500, 300],
  },
  {
    selector: "#root > div",
    content: <DMACEleven />,
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
    },
    position: [500, 300],
  },
  {
    selector: "#root > div",
    content: "Go to Training Questions",
    style: {
      backgroundColor: "#40E0D0",
      borderRadius: "1rem",
      opacity: 0.1,
    },
    position: [500, 300],
  },
];

export default function DMACGuidedTour({
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
    <>
      {/* s<button onClick={setIsTourOpen(true)} title={'Tour'}></button> */}
      <Tour
        maskClassName="guidedtour"
        closeWithMask={false}
        startAt={tourStep}
        getCurrentStep={(currentStep) => setTourStep(currentStep)}
        inViewThreshold={0}
        scrollOffset={0}
        scrollDuration={400}
        steps={tipsteps}
        isOpen={isTourOpen}
        showCloseButton={true}
        onRequestClose={() => setIsTourOpen(false)}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
      />
    </>
  );
}
