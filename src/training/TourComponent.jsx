import { useEffect, useState } from "react";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const slacSteps = [
  {
    selector: "#root > div > div",
    content: <SLACOne />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [400, 100],
  },
  {
    selector: "#usersColumn",
    content: <SLACTwo />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [400, 100],
  },
  {
    selector: "#filesColumn",
    content: <SLACThree />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [900, 100],
  },
  {
    selector: "#rulesColumn",
    content: <SLACFour />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [650, 100],
  },
  {
    selector: "#root > div",
    content: <SLACFive />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [750, 200],
  },
  {
    selector: "#filesColumn",
    content: <SLACSix />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [150, 100],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACSeven />,
    style: {
      backgroundColor: "#33DDFF",
      borderRadius: "1rem",
    },
    position: [900, 200],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACEight />,
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [650, 100],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACNine />,
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [650, 100],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACTen />,
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [1000, 300],
  },
  {
    selector: '[uniqueidentifier="highlightingContainer"]',
    content: <SLACEleven />,
    style: {
      backgroundColor: "#33DDFF",
    },
    position: [500, 200],
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

const dmacSteps = [
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

const cdacSteps = [
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
    position: [800, 100],
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

export default function TourComponent({
  trainState,
  setTrainState,
  tourStep,
  setTourStep,
  viewOptions,
  setViewOptions,
}) {
  const [isTourOpen, setIsTourOpen] = useState(true);

  const [tourSteps, setTourSteps] = useState(() => {
    if (viewOptions.page.includes("SLAC")) return slacSteps;
    if (viewOptions.page.includes("DMAC")) return dmacSteps;
    if (viewOptions.page.includes("CDAC")) return cdacSteps;
  });

  useEffect(() => {
    setTourSteps(() => {
      if (viewOptions.page.includes("SLAC")) return slacSteps;
      if (viewOptions.page.includes("DMAC")) return dmacSteps;
      if (viewOptions.page.includes("CDAC")) return cdacSteps;
    });
  }, [viewOptions]);

  useEffect(() => {
    if (tourStep === tourSteps.length - 1) {
      setIsTourOpen(() => false);
      setViewOptions((prevState) => {
        return {
          ...prevState,
          page: prevState.page.split(" Guided Tour")[0],
        };
      });
      // setTourStep(0);
    }
  }, [tourStep]);

  useEffect(() => {
    setTourStep(() => 0);
  }, []);

  useTourEnd(tourStep, tourSteps.length - 1, viewOptions, setViewOptions);

  useEffect(() => {
    setTrainState(2);
  }, []);
  console.log("GT-trainState", trainState);
  if (trainState === 2 && isTourOpen === false) {
    setTrainState = 3;
  }

  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  return (
    <Tour
      maskClassName="guidedtour"
      closeWithMask={false}
      getCurrentStep={(currentStep) => setTourStep(currentStep)}
      inViewThreshold={0}
      scrollOffset={0}
      scrollDuration={400}
      steps={tourSteps}
      isOpen={isTourOpen}
      // showCloseButton={true}
      onRequestClose={() => setIsTourOpen(false)}
    />
  );
}

function useTourEnd(tourStep, endIndex, viewOptions, setViewOptions) {
  useEffect(() => {
    // if (viewOptions.experimentGroup === "SLAC" && tourStep === 0) {
    //   setViewOptions((prevState) => {
    //     return {
    //       ...prevState,
    //       page: viewOptions.experimentGroup + " Guided Tour",
    //     };
    //   });
    // }
    if (viewOptions.experimentGroup === "SLAC" && tourStep === endIndex) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          group: viewOptions.experimentGroup,
          page: "SLAC",
          visibleTabs: [
            ...viewOptions.visibleTabs,
            viewOptions.experimentGroup,
            "Training Questions",
          ],
        };
      });
      console.log("endTourIndex", endIndex, viewOptions.experimentGroup);
    }
    // if (viewOptions.experimentGroup === "DMAC" && tourStep === 0) {
    //   setViewOptions((prevState) => {
    //     return {
    //       ...prevState,
    //       page: viewOptions.experimentGroup + " Guided Tour",
    //     };
    //   });
    // }
    if (viewOptions.experimentGroup === "DMAC" && tourStep === endIndex) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          group: viewOptions.experimentGroup,
          page: "DMAC",
          visibleTabs: [
            ...viewOptions.visibleTabs,
            viewOptions.experimentGroup,
            "Training Questions",
          ],
        };
      });
    }
    // if (viewOptions.experimentGroup === "CDAC" && tourStep === 0) {
    //   setViewOptions((prevState) => {
    //     return {
    //       ...prevState,
    //       page: viewOptions.experimentGroup + " Guided Tour",
    //     };
    //   });
    // }
    if (viewOptions.experimentGroup === "CDAC" && tourStep === endIndex) {
      setViewOptions((prevState) => {
        return {
          ...prevState,
          group: viewOptions.experimentGroup,
          page: "CDAC",
          visibleTabs: [
            ...viewOptions.visibleTabs,
            viewOptions.experimentGroup,
            "Training Questions",
          ],
        };
      });
    }
  }, [tourStep]);
}

function SLACOne() {
  return (
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>This is the Visualisation Tool.</strong> There are three panels
        that display User/Role, Folders and Files, and the Rules that set the
        permissions.
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
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Users and Roles List:</strong> This is a list of names of the
        Users (in Bold) and any Roles they have. You can use the mouse wheel to
        scroll up and down the list.
      </p>
      <ul>
        <li>
          'Click' on the 'User' and 'Role' buttons to arrange the List by User
          or Role.
        </li>
        <li>'Click' on a Username or a Role in the list.</li>
        <li>
          Permissions for the selected User/Role to Folders and Files are
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
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Files List:</strong> The File Tree is listed here in a
        hierarchical tree of Folders and Files. You can use the mouse wheel to
        scroll up and down the list.
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
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>RulesPanel:</strong> Only Rules that apply to the User/Role or
        Folder that you selected will be listed here.
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
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Filtering display:</strong>You can select combinations of User
        and Roles with Folders and Files to filter the list of Rules and
        Permissions displayed.
      </p>
      <ul>
        <li>
          'Click' the ❌ alongside the 'Currently selected file' to deselect the
          Folder.
        </li>
        <li>
          'Click' on a Role name in the Users list (e.g. 'Employee') to see
          Rules and permissions for that Role.
        </li>
        <li>
          Now 'Click' on a Folder. Only Rules and Permissions applicable to this
          combination of Role and Folder will be displayed.
        </li>
        <li>
          Now 'Click' the ❌ alongside the 'Currently selected' in the Users
          Panel to deselect the Role. Now only the Rules and Permissions for the
          selected Folder are displayed.
        </li>
      </ul>
    </div>
  );
}

function SLACSix() {
  return (
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Navigating FileTree:</strong> You can use the following features
        to help navigate the File Tree.
      </p>
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
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Search Function:</strong> You can use the browser search
        function to search for any term (Username, Folder) on the Tool.
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
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Displaying Role permissions and Rules :</strong>
      </p>
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
          '/db/db_emp'.
        </li>
        <li>
          Rule 31 grants 'Engineering' Role the 'List' and 'Get', and also
          explicitly denies 'Create', 'Update' and 'Delete' permissions on
          '/usr/stu/msc_stu/Wilfred'.
        </li>
      </ul>
    </div>
  );
}

function SLACNine() {
  return (
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Displaying User permissions and Rules</strong>
        When you select a User, then the Tool displays Rules and Permissions
        that apply to ALL of the Roles allocated to the User, or their UserId.
      </p>
      <ul>
        <li>'Click' on the Arrange users by 'User' button.</li>
        <li>'Click' on the User 'Barry'.</li>
        <li>
          Each Rule has a Number Id, and specifies a Folder (Filepath), the User
          or Role it applies to, and the permissions that has been set.
        </li>
        <li>
          Rule 4 grants 'Barry' (as a User) full permissions to his own named
          Folder. The wildcard [all] is '/usr/emp/aca/Barry'. The other Rules
          listed apply to 'Barry's' different Roles.
        </li>
        <li>
          If a Rule in the List has a red border (Rule 9) it indicates that a
          later Rule has overwritten these permissions (Rule 27).
        </li>
      </ul>
    </div>
  );
}

function SLACTen() {
  return (
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Filtering Display:</strong> With 'Barry' selected, select a
        Folder in the Files Panel to filter the Rules and permissions displayed.
      </p>
      <ul>
        <li>
          'Click' on the Folder 'eng' at '/apps/CANVAS/eng' in the Filetree.
        </li>
        <li>
          Rule 17 grants the Tutor Role full permissions to the Folder
          '/apps/CANVAS'. These permissions will be inherited by the '/eng'
          Folder below.
        </li>
        <li>
          'Barry' is granted full permissions to 'eng' under the '/apps/CANVAS'
          Folder because of his 'Tutor' Role.
        </li>
        <li>'Click' the ❌ to deselect both the User and Folder.</li>
      </ul>
    </div>
  );
}

function SLACEleven() {
  return (
    <div className="tourpoints" logsource="Tour">
      <p>
        <strong>Training Questions:</strong> There are some Training Questions
        to go through next. These are to familiarise you with the type of
        questions you will be asked in the experiment, and get you used to
        interacting with the tool.
      </p>
      <ul>
        <li>
          Use the → arrow to end the Tour, and take a few minutes to familiarise
          with the Tool.
        </li>
        <li>
          'Click' the 'Training Questions' button when you are ready to
          progress.
        </li>
      </ul>
    </div>
  );
}

function DMACOne() {
  return (
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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

function CDACOne() {
  return (
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
          'Click' on the drop down menu on the left of the Summary Panel to
          display an Option List of User Names.
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
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
    <div className="tourpoints" logsource="Tour">
      <strong>Displaying Permissions and Rules from arrow links:</strong> When a
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
    <div className="tourpoints" logsource="Tour">
      <strong>Filtering Users/Roles and Resources:</strong> When a User or Role
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
    <div className="tourpoints" logsource="Tour">
      <p>
        There are some Training Questions to go through next. These are to
        familiarise you with the type of questions you will be asked in the
        experiment, and get you used to interacting with the tool.
      </p>
      <ul>
        <li>
          Use the → arrow to end the Tour, and then 'Click' the 'Training
          Questions' button when you are ready to progress.
        </li>
      </ul>
    </div>
  );
}
