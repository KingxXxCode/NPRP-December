import "./Highlighting.css";

import update from "immutability-helper";
import { useState, useEffect, useCallback, Fragment } from "react";
import { RuleCard } from "./dnd/RuleCard";

//   __  __
//  / / / /__ ___ _______
// / /_/ (_-</ -_) __(_-<
// \____/___/\__/_/ /___/

export const UserViewToggle = ({ viewOptions, setViewOptions, flexAlign }) => {
  const handleToggle = (index) => {
    setViewOptions((prevOptions) => {
      return { ...prevOptions, userViewIndex: index };
    });
  };
  return (
    <div className={"flex-col " + flexAlign} logsource="UsersRoleSelect">
      <p className="nomargin" logsource="UsersRoleSelect">
        Arrange users by:
      </p>
      <div className="flex-row toggle-buttons" logsource="UsersRoleSelect">
        {viewOptions.userViewOptions.map((viewOption, index) => (
          <button
            key={viewOption}
            logsource="UsersRoleSelect"
            logtype="button"
            onClick={() => handleToggle(index)}
            className={index === viewOptions.userViewIndex ? "active" : ""}
          >
            {viewOption}
          </button>
        ))}
      </div>
    </div>
  );
};
export const Users = ({
  viewOptions,
  setViewOptions,
  userState,
  selectedItems,
  setSelectedItems,
}) => {
  const userView = viewOptions.userViewOptions[viewOptions.userViewIndex];
  const allRoles = Array.from(new Set(userState.flatMap((user) => user.roles)));
  allRoles.sort();

  const RoleView = () => {
    return allRoles.map((role) => {
      const usersWithThisRole = userState.filter((user) =>
        user.roles.includes(role)
      );
      const usersElement = usersWithThisRole.map((user) => (
        <div
          className={"role-userlist flex-row " + user.cssArray.join(` `)}
          key={user.name}
          logsource="UsersRoleList"
        >
          <span
            className="role-view-username"
            logsource="UsersRoleList"
            logtype="UserSelect"
            logmode="RoleView"
          >
            {user.name}
          </span>
          <span className="results-box nomargin">
            {user.cssArray.length ? (
              <>
                <span className="list-box">
                  {user.cssArray.includes("hl-list")
                    ? "🟢"
                    : user.cssArray.includes("hl-list-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
                <span className="get-box">
                  {user.cssArray.includes("hl-get")
                    ? "🟢"
                    : user.cssArray.includes("hl-get-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
                <span className="create-box">
                  {user.cssArray.includes("hl-create")
                    ? "🟢"
                    : user.cssArray.includes("hl-create-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
                <span className="update-box">
                  {user.cssArray.includes("hl-update")
                    ? "🟢"
                    : user.cssArray.includes("hl-update-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
                <span className="delete-box">
                  {user.cssArray.includes("hl-delete")
                    ? "🟢"
                    : user.cssArray.includes("hl-delete-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
              </>
            ) : null}
          </span>
        </div>
      ));

      return (
        <div key={role}>
          <p
            className="heading role-heading"
            logsource="UsersRoleList"
            logtype="RoleSelect"
          >
            {role}
          </p>
          {usersElement}
        </div>
      );
    });
  };
  // User view (display user list with roles beside each user)
  const UserView = () => {
    return userState.map((user) => {
      const usersRoles = user.roles.sort().map((role) => {
        // console.log(role);
        return (
          <span
            className="user-rolelist"
            key={role}
            logsource="UsersRoleList"
            logtype="RoleSelect"
          >
            {role}
          </span>
        );
      });

      return (
        <div
          className={"userview flex-row " + user.cssArray.join(` `)}
          key={user.name}
        >
          <span
            className="heading role-userlist"
            logsource="UsersRoleList"
            logtype="UserSelect"
            logmode="Userview"
          >
            {user.name}
          </span>
          {usersRoles}
          <div className="results-box">
            {user.cssArray.length ? (
              <>
                <span className="list-box">
                  {user.cssArray.includes("hl-list")
                    ? "🟢"
                    : user.cssArray.includes("hl-list-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
                <span className="get-box">
                  {user.cssArray.includes("hl-get")
                    ? "🟢"
                    : user.cssArray.includes("hl-get-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
                <span className="create-box">
                  {user.cssArray.includes("hl-create")
                    ? "🟢"
                    : user.cssArray.includes("hl-create-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
                <span className="update-box">
                  {user.cssArray.includes("hl-update")
                    ? "🟢"
                    : user.cssArray.includes("hl-update-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
                <span className="delete-box">
                  {user.cssArray.includes("hl-delete")
                    ? "🟢"
                    : user.cssArray.includes("hl-delete-false")
                    ? "🔴"
                    : "⚪️"}
                </span>
              </>
            ) : null}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="user-column data-container" id="usersColumn">
      <div className="sticky" logsource="UsersPanel">
        <h3>Users</h3>
        {selectedItems ? (
          <p className="nomargin" logsource="UsersPanel">
            Currently selected{" "}
            {selectedItems.user &&
              !selectedItems.user.includes("Role:") &&
              "User: "}{" "}
            {selectedItems.user}&nbsp;
            {selectedItems.user ? (
              <span
                className="deselect-item"
                logsource="UsersPanel"
                logtype="deselect"
                onClick={() => setSelectedItems({ ...selectedItems, user: "" })}
              >
                ❌
              </span>
            ) : (
              <></>
            )}
          </p>
        ) : null}
        {setViewOptions ? (
          <UserViewToggle
            viewOptions={viewOptions}
            setViewOptions={setViewOptions}
            flexAlign="flex-start"
          />
        ) : null}
      </div>
      {userView === "User" && <UserView />}
      {userView === "Role" && <RoleView />}
    </div>
  );
};

//     _____ __
//    / __(_) /__ ___
//   / _// / / -_|_-<
//  /_/ /_/_/\__/___/

const PrintFileState = ({ fileState, setFileState }) => {
  const toggleCollapse = (e) => {
    const htmlElementID = e.target.parentElement.id.split("-files")[0];

    const isTargetFilepath = (toTest) => {
      return toTest.pathArray.join("/") === htmlElementID;
    };
    const targetIndex = fileState.findIndex(isTargetFilepath);
    const folderToCollapse = fileState[targetIndex].pathArray;

    switch (e.target.innerText) {
      case "▼":
        // HIDE FOLDER CONTENTS:
        const tohide = fileState.map((stateElement) => {
          for (let i = 0; i < folderToCollapse.length; i++) {
            const folder = folderToCollapse[i];
            if (
              stateElement.pathArray[i] !== folder ||
              stateElement.pathArray.length === folderToCollapse.length
            ) {
              return null;
            }
          }
          return htmlElementID;
        });
        setFileState(
          fileState.map((stateElement, index) => {
            return tohide[index]
              ? {
                  ...stateElement,
                  hiddenBy: [...stateElement.hiddenBy, tohide[index]],
                }
              : stateElement;
          })
        );
        break;

      case "▶":
        // SHOW FOLDER CONTENTS:
        const unhide = fileState.map((stateElement) => {
          for (let i = 0; i < folderToCollapse.length; i++) {
            const folder = folderToCollapse[i];
            if (
              stateElement.pathArray[i] !== folder ||
              stateElement.pathArray.length === folderToCollapse.length
            ) {
              return false;
            }
          }
          return true;
        });
        setFileState(
          fileState.map((stateElement, index) => {
            const hiddenByArrayCopy = [...stateElement.hiddenBy];

            const filteredToUnhide = hiddenByArrayCopy.filter(
              (folder) => folder !== htmlElementID
            );

            // if (unhide[index]) {
            //   const indexToRemove = hiddenByArrayCopy.indexOf(htmlElementID);
            //   hiddenByArrayCopy.splice(indexToRemove, 1);
            // }
            return {
              ...stateElement,
              hiddenBy: filteredToUnhide,
            };
          })
        );
        break;
      default:
        break;
    }
  };

  return fileState.map((file, i) => {
    const pathArray = file.pathArray;
    const thisFilepath = pathArray.join("/");
    // const thisFilepathElement = (
    //   <>
    //     {pathArray.map((pathFrag, i) => {
    //       return (
    //         <Fragment key={pathFrag}>
    //           {pathFrag + (i === pathArray.length - 1 ? "" : "/")}
    //           <wbr />
    //         </Fragment>
    //       );
    //     })}
    //   </>
    // );
    const thisFilepathElement = <>{pathArray[pathArray.length - 1]}</>;
    const fileDepth = file.pathArray.length - 1;
    const isFile = file.pathArray[fileDepth].includes(".");

    if (file.hiddenBy.length) return;

    return (
      <div
        key={i}
        style={{ marginLeft: fileDepth + "rem" }}
        id={`${thisFilepath}${isFile ? "-file" : "-files"}`}
        className={`selection-helper ${file.cssArray.join(` `)} ${
          isFile ? "file" : "folder"
        }`}
      >
        {isFile ? (
          thisFilepathElement
        ) : (
          <>
            <span
              onClick={toggleCollapse}
              className="file-toggle"
              logsource="FileList"
              logtype="folder-toggle"
            >
              {fileState[i + 1].hiddenBy.length ? "▶" : "▼"}
            </span>
            {thisFilepathElement}
          </>
        )}
        <div className="results-box" logsource="FileList">
          {file.cssArray.length ? (
            <>
              <span className="list-box">
                {file.cssArray.includes("hl-list")
                  ? "🟢"
                  : file.cssArray.includes("hl-list-false")
                  ? "🔴"
                  : "⚪️"}
              </span>
              <span className="get-box">
                {file.cssArray.includes("hl-get")
                  ? "🟢"
                  : file.cssArray.includes("hl-get-false")
                  ? "🔴"
                  : "⚪️"}
              </span>
              <span className="create-box">
                {file.cssArray.includes("hl-create")
                  ? "🟢"
                  : file.cssArray.includes("hl-create-false")
                  ? "🔴"
                  : "⚪️"}
              </span>
              <span className="update-box">
                {file.cssArray.includes("hl-update")
                  ? "🟢"
                  : file.cssArray.includes("hl-update-false")
                  ? "🔴"
                  : "⚪️"}
              </span>
              <span className="delete-box">
                {file.cssArray.includes("hl-delete")
                  ? "🟢"
                  : file.cssArray.includes("hl-delete-false")
                  ? "🔴"
                  : "⚪️"}
              </span>
            </>
          ) : null}
        </div>
      </div>
    );
  });
};

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const Files = ({
  fileState,
  setFileState,
  selectedItems,
  setSelectedItems,
}) => {
  const [collapsedAll, setCollapsedAll] = useState(false);

  useEffect(() => {
    let outcome = true;
    fileState.forEach((file) => {
      if (!(file.pathArray.length === 1) && file.hiddenBy.length === 0)
        outcome = false;
    });
    setCollapsedAll(() => outcome);
  }, [fileState]);

  function collapseAll() {
    let hiddenBy = [];
    const hiddenByArray = new Array(fileState.length);
    let newFiles = [];
    fileState.forEach((file, index) => {
      const thisPath = file.pathArray;

      // if (file.hiddenBy[0]) {
      //   console.log(file.hiddenBy);
      // }

      hiddenBy = [...thisPath].splice(0, thisPath.length - 1);

      if (hiddenBy.length > 1 && hiddenBy[hiddenBy.length - 1].split(".")[1]) {
        hiddenBy.pop();
      }

      hiddenByArray[index] = hiddenBy.join("/");
      // console.log("This:", thisPath);
      // console.log("Hidden by:", hiddenBy);
    });
    setFileState((prevState) => {
      return prevState.map((file, index) => {
        return {
          ...file,
          hiddenBy:
            hiddenByArray[index] && !file.hiddenBy[0]
              ? [...file.hiddenBy, hiddenByArray[index]]
              : file.hiddenBy,
        };
      });
    });
  }

  function expandAll() {
    const filesCopy = [...fileState];
    filesCopy.forEach((file) => (file.hiddenBy = []));
    setFileState(() => filesCopy);
  }

  return (
    <div
      className="files-column data-container"
      id="filesColumn"
      logsource="FilePanel"
    >
      <div className="sticky" logsource="FilePanel">
        <h3>Files</h3>
        {selectedItems ? (
          <>
            <p className="nomargin" logsource="FilePanel">
              Currently selected file: {selectedItems.file}&nbsp;
              {selectedItems.file ? (
                <span
                  className="deselect-item"
                  logsource="FilePanel"
                  logtype="deselect"
                  onClick={() =>
                    setSelectedItems({ ...selectedItems, file: "" })
                  }
                >
                  ❌
                </span>
              ) : (
                <></>
              )}
            </p>
            <button
              onClick={collapsedAll ? expandAll : collapseAll}
              logsource="FilePanel"
              logtype="button-toggle"
            >
              {collapsedAll ? "Expand All Folders" : "Collapse All Folders"}
            </button>
          </>
        ) : null}
      </div>
      <PrintFileState fileState={fileState} setFileState={setFileState} />
    </div>
  );
};

//     ___       __
//    / _ \__ __/ /__ ___
//   / , _/ // / / -_|_-<
//  /_/|_|\_,_/_/\__/___/

export const Rules = ({
  ruleState,
  setRuleState,
  selectedItems,
  setSelectedItems,
}) => {
  // RULES
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards(ruleState.filter((rule) => rule.cssArray.length));
  }, [ruleState]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);
  const renderCard = useCallback((card, index) => {
    return (
      <RuleCard
        key={card.id}
        index={index}
        id={card.id}
        match={card.match}
        condition={card.condition}
        permissions={card.permissions}
        moveCard={moveCard}
        styleVar={card.cssArray}
      />
    );
  }, []);

  return (
    <div
      className="rules-column data-container"
      id="rulesColumn"
      logsource="RulesPanel"
    >
      <div className="sticky" logsource="RulesPanel">
        <h3>Rules</h3>
        {/* <p className="nomargin">
          Currently selected rule:
          {selectedItems.ruleId
            ? `(id=${selectedItems.ruleId}) ${selectedItems.rule} `
            : ""}
          {selectedItems.rule ? (
            <span
              className="deselect-item"
              onClick={() =>
                setSelectedItems({ ...selectedItems, rule: "", ruleId: "" })
              }
            >
              ❌
            </span>
          ) : (
            <></>
          )}
        </p> */}
      </div>
      <div className="rules-container" logsource="RulesPanel">
        {cards.map((card, i) => renderCard(card, i))}

        {cards.length === 0 && (
          <p className="placeholder-rule" logsource="RulesPanel">
            If any rules apply to your selection, they will show up here...
          </p>
        )}
      </div>
    </div>
  );
};

export function Highlighting({
  viewOptions,
  setViewOptions,
  userState,
  fileState,
  setFileState,
  ruleState,
  setRuleState,
  selectedItems,
  setSelectedItems,
  visible,
}) {
  // useEffect(() => {
  //   console.log(fileState);
  // }, [fileState]);

  function handleClick(e) {
    let selectedItemCategory;
    try {
      selectedItemCategory = e.target
        .closest(".data-container")
        .id.replace("Column", "");
    } catch {
      selectedItemCategory = false;
    }

    const target = e.target;

    if (target.classList.contains("file-toggle")) return;

    switch (selectedItemCategory) {
      case "users":
        if (target.classList.contains("role-userlist")) {
          setSelectedItems({ ...selectedItems, user: target.innerText });
        }
        if (
          target.classList.contains("role-heading") ||
          target.classList.contains("user-rolelist")
        ) {
          setSelectedItems({
            ...selectedItems,
            user: "Role: " + target.innerText,
          });
        }
        if (target.classList.contains("role-view-username")) {
          setSelectedItems({
            ...selectedItems,
            user: target.innerText,
          });
        }
        break;

      case "files":
        const fileSelect = e.target.closest(".selection-helper");
        if (fileSelect && fileSelect.id) {
          setSelectedItems({
            ...selectedItems,
            file: fileSelect.id.replace("-files", "").replace("-file", ""),
          });
        }
        break;

      // case "rules":
      //   const ruleCard = e.target.closest(".rule-card");

      //   if (ruleCard) {
      //     setSelectedItems({
      //       ...selectedItems,
      //       rule: ruleCard.querySelector(".match-statement").innerText,
      //       ruleId: ruleCard.querySelector(".rule-id").innerText,
      //     });
      //   }
      //   break;

      default:
        break;
    }
  }
  return (
    <div
      className="fullwidth flex-row highlighting-container"
      onClick={(e) => handleClick(e)}
      uniqueidentifier="highlightingContainer"
      logsource="Tool"
      style={{
        display: visible ? "" : "none",
      }}
    >
      <Users
        viewOptions={viewOptions}
        setViewOptions={setViewOptions}
        userState={userState}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <Files
        fileState={fileState}
        setFileState={setFileState}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <Rules
        ruleState={ruleState}
        setRuleState={setRuleState}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </div>
  );
}
