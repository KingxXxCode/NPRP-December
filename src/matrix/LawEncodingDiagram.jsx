import MatrixLayout from "./MatrixLayout";
import MatrixGrid from "./MatrixGrid";

import Plot45 from "./charts/Plot45";

import {
  Files,
  Rules,
  Users,
  UserViewToggle,
} from "../highlighting/Highlighting";

import "./Matrix.css";

import { useState, useRef, useEffect } from "react";

function uniqueKeys(object) {
  const keys = new Set();
  object.forEach((entry) => Object.keys(entry).forEach((key) => keys.add(key)));

  return Array.from(keys);
}

const PrintFileState = ({
  fileState,
  setFileState,
  setTemplateNames,
  xAxisExpanded,
  viewOptions,
}) => {
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

  let gridYNames = [];

  return fileState.map((file, i) => {
    const pathArray = file.pathArray;
    const thisFilepath = pathArray.join("/");
    // const thisFilepathElement = (
    //   <>
    //     {pathArray.map((pathFrag, i) => {
    //       return (
    //         <span key={pathFrag}>
    //           {/* {pathFrag + (i === pathArray.length - 1 ? "" : "/")} */}
    //           {/* <wbr /> */}
    //         </span>
    //       );
    //     })}
    //   </>
    // );
    const thisFilepathElement = (
      <span>{file.pathArray[file.pathArray.length - 1]}</span>
    );
    const fileDepth = file.pathArray.length - 1;
    const isFile = file.pathArray[fileDepth].includes(".");

    if (!file.hiddenBy.length) {
      gridYNames.push(
        thisFilepath
          .replaceAll("/", "-")
          .replaceAll(".", "-")
          .replaceAll(" ", "-")
      );
    }

    useEffect(() => {
      setTemplateNames((prevNames) => {
        return { ...prevNames, row: gridYNames };
      });
    }, [fileState]);

    if (file.hiddenBy.length) return;

    return (
      <div
        key={i}
        logsource="FileList"
        style={{ marginLeft: fileDepth + "rem" }}
        id={`${thisFilepath}${isFile ? "-file" : "-files"}`}
        className={`fixed-height ${isFile ? "file" : "folder"} ${
          xAxisExpanded === false &&
          viewOptions.userViewOptions[viewOptions.userViewIndex] === "Role"
            ? "tall"
            : ""
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
      </div>
    );
  });
};

const PrintUserState = ({
  userState,
  viewOptions,
  xAxisExpanded,
  setTemplateNames,
}) => {
  const allRolesSet = new Set([]);
  userState.map((user) => user.roles.forEach((role) => allRolesSet.add(role)));
  const allRoles = Array.from(allRolesSet);

  let gridXNames = [];
  let headingCells;

  switch (viewOptions.userViewOptions[viewOptions.userViewIndex]) {
    case "User":
      headingCells = userState.map((user) => {
        if (xAxisExpanded) {
          return (
            <div
              className="heading-grid flex-element"
              key={user.name}
              logsource="grid"
            >
              <span
                className="x-axis-fixed-width-cell top-row"
                logsource="X-Axis"
              >
                {user.name}
              </span>
              {user.roles.map((role) => {
                gridXNames.push(user.name + "_" + role.replaceAll(" ", "-"));
                return (
                  <span
                    key={role}
                    className="x-axis-fixed-width-cell bottom-row"
                    logsource="X-Axis"
                  >
                    {role}
                  </span>
                );
              })}
              {[0].map(() => {
                gridXNames.push(user.name + "_" + "username");
                return (
                  <span
                    key={"Other"}
                    className="x-axis-fixed-width-cell bottom-row"
                    logsource="X-Axis"
                  >
                    User ID
                  </span>
                );
              })}
            </div>
          );
        } else {
          gridXNames.push(user.name);
          return (
            <div
              className="x-axis-fixed-width-cell flex-element"
              logsource="X-Axis"
              key={user.name}
            >
              {user.name}
            </div>
          );
        }
      });
      break;
    case "Role":
      headingCells = allRoles.sort().map((role) => {
        if (xAxisExpanded) {
          const tempVar = (
            <div
              className="heading-grid flex-element"
              logsource="X-Axis"
              key={role}
            >
              <span
                className="x-axis-fixed-width-cell top-row"
                logsource="X-Axis"
              >
                {role}
              </span>
              {userState.map((user) => {
                if (user.roles.includes(role)) {
                  gridXNames.push(role.replaceAll(" ", "-") + "_" + user.name);
                  return (
                    <span
                      key={user.name}
                      className="x-axis-fixed-width-cell bottom-row"
                      logsource="X-Axis"
                    >
                      {user.name}
                    </span>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          );
          return tempVar;
        } else {
          gridXNames.push(role.replaceAll(" ", "-"));
          return (
            <div
              className="x-axis-fixed-width-cell flex-element"
              logsource="X-Axis"
              logmode="RoleResPlot"
              key={role}
            >
              {role}
            </div>
          );
        }
      });
      if (xAxisExpanded) {
        headingCells.push(
          <div
            className="heading-grid flex-element"
            logsource="X-Axis"
            key={"Other"}
          >
            <span
              className="x-axis-fixed-width-cell top-row"
              logsource="X-Axis"
            >
              (Other)
            </span>
            {userState.map((user) => {
              gridXNames.push("username" + "_" + user.name);
              return (
                <span
                  key={user.name}
                  className="x-axis-fixed-width-cell bottom-row"
                  logsource="X-Axis"
                  logmode="X-AxisExpanded"
                >
                  {user.name}
                </span>
              );
            })}
          </div>
        );
      }
      break;

    default:
      break;
  }

  useEffect(() => {
    setTemplateNames((prevNames) => {
      return { ...prevNames, col: gridXNames };
    });
  }, [xAxisExpanded, viewOptions]);

  return (
    <div className="x-heading-container" logsource="grid">
      {headingCells}{" "}
    </div>
  );
};

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function Cells({ resultsTableState, viewOptions, xAxisExpanded, fileState }) {
  const xParent = viewOptions.userViewOptions[viewOptions.userViewIndex];
  const elements = resultsTableState.map((row, index) => {
    const showResource = fileState.filter(
      (file) =>
        !file.hiddenBy.length &&
        arrayEquals(file.pathArray, row.resource.split("/"))
    );

    const listIcon =
      row.list === undefined ? "⚪️" : row.list === true ? "🟢" : "🔴";
    const getIcon =
      row.get === undefined ? "⚪️" : row.get === true ? "🟢" : "🔴";
    const createIcon =
      row.create === undefined ? "⚪️" : row.create === true ? "🟢" : "🔴";
    const updateIcon =
      row.update === undefined ? "⚪️" : row.update === true ? "🟢" : "🔴";
    const deleteIcon =
      row.delete === undefined ? "⚪️" : row.delete === true ? "🟢" : "🔴";
    // const cellContents =
    //   listIcon + getIcon + createIcon + updateIcon + deleteIcon;

    let gridColValue = "";
    let roleString =
      (row.listRole !== undefined && row.listRole) ||
      (row.getRole !== undefined && row.getRole) ||
      (row.createRole !== undefined && row.createRole) ||
      (row.updateRole !== undefined && row.updateRole) ||
      (row.deleteRole !== undefined && row.deleteRole);

    if (!xAxisExpanded && xParent === "User") gridColValue = row.user;
    if (!xAxisExpanded && xParent === "Role") {
      gridColValue = roleString;
    }
    if (roleString) {
      if (xAxisExpanded && xParent === "User")
        gridColValue = row.user + "_" + roleString;
      if (xAxisExpanded && xParent === "Role") {
        gridColValue = roleString + "_" + row.user;
      }
    }

    // console.log(row);
    const cellContents = <Plot45 sparkData={[0, 1, 0, 1, 1]} maxValue={2} />;

    if (showResource.length && gridColValue) {
      return (
        <div
          // key={row.resource + row.user}
          style={{
            gridRow: row.resource
              .replaceAll("/", "-")
              .replaceAll(".", "-")
              .replaceAll(" ", "-"),
            gridColumn: gridColValue,
          }}
          className="grid-cell"
          logsource="grid"
        >
          {cellContents}
        </div>
      );
    } else {
      return null;
    }
  });
  return elements;
}

function getUsernameCellContents(cellData) {
  // const listIcon =
  //   cellData[0].list === undefined ||
  //   (cellData[0].listRole !== undefined && cellData[0].listRole !== false)
  //     ? "⚪️"
  //     : cellData[0].list === true
  //     ? "🟢"
  //     : "🔴";
  // const getIcon =
  //   cellData[0].get === undefined ||
  //   (cellData[0].getRole !== undefined && cellData[0].getRole !== false)
  //     ? "⚪️"
  //     : cellData[0].get === true
  //     ? "🟢"
  //     : "🔴";
  // const createIcon =
  //   cellData[0].create === undefined ||
  //   (cellData[0].createRole !== undefined && cellData[0].createRole !== false)
  //     ? "⚪️"
  //     : cellData[0].create === true
  //     ? "🟢"
  //     : "🔴";
  // const updateIcon =
  //   cellData[0].update === undefined ||
  //   (cellData[0].updateRole !== undefined && cellData[0].updateRole !== false)
  //     ? "⚪️"
  //     : cellData[0].update === true
  //     ? "🟢"
  //     : "🔴";
  // const deleteIcon =
  //   cellData[0].delete === undefined ||
  //   (cellData[0].deleteRole !== undefined && cellData[0].deleteRole !== false)
  //     ? "⚪️"
  //     : cellData[0].delete === true
  //     ? "🟢"
  //     : "🔴";

  // const cellContents =
  //   listIcon + getIcon + createIcon + updateIcon + deleteIcon;

  const listIcon =
    cellData[0].list === undefined ||
    (cellData[0].listRole !== undefined && cellData[0].listRole !== false) ? (
      <span className="noPermission"></span>
    ) : cellData[0].list === true ? (
      <span className="truePermission"></span>
    ) : (
      <span className="falsePermission"></span>
    );
  const getIcon =
    cellData[0].get === undefined ||
    (cellData[0].getRole !== undefined && cellData[0].getRole !== false) ? (
      <span className="noPermission"></span>
    ) : cellData[0].get === true ? (
      <span className="truePermission"></span>
    ) : (
      <span className="falsePermission"></span>
    );
  const createIcon =
    cellData[0].create === undefined ||
    (cellData[0].createRole !== undefined &&
      cellData[0].createRole !== false) ? (
      <span className="noPermission"></span>
    ) : cellData[0].create === true ? (
      <span className="truePermission"></span>
    ) : (
      <span className="falsePermission"></span>
    );
  const updateIcon =
    cellData[0].update === undefined ||
    (cellData[0].updateRole !== undefined &&
      cellData[0].updateRole !== false) ? (
      <span className="noPermission"></span>
    ) : cellData[0].update === true ? (
      <span className="truePermission"></span>
    ) : (
      <span className="falsePermission"></span>
    );
  const deleteIcon =
    cellData[0].delete === undefined ||
    (cellData[0].deleteRole !== undefined &&
      cellData[0].deleteRole !== false) ? (
      <span className="noPermission"></span>
    ) : cellData[0].delete === true ? (
      <span className="truePermission"></span>
    ) : (
      <span className="falsePermission"></span>
    );

  const cellContents = (
    <>
      {listIcon} {getIcon} {createIcon} {updateIcon} {deleteIcon}
    </>
  );

  return cellContents;
}

function Cells2({
  resultsTableState,
  viewOptions,
  xAxisExpanded,
  fileState,
  userState,
  setOverlayData,
  hoverState,
  setHoverState,
  overlayData,
}) {
  const allRolesSet = new Set([]);
  userState.map((user) => user.roles.forEach((role) => allRolesSet.add(role)));
  const allRoles = Array.from(allRolesSet);

  return fileState.map((file, index) => {
    if (file.hiddenBy.length) return null;
    // if (index > 1) return;
    const viewBy = viewOptions.userViewOptions[viewOptions.userViewIndex];
    // xAxisExpanded;
    const resource = file.pathArray.join("/");

    const filteredByResource = resultsTableState.filter((row) => {
      // console.log(row);
      return row.resource === resource;
    });
    // console.log(filteredByResource);

    let dataToPlot;
    switch (viewBy) {
      case "User":
        dataToPlot = userState.map((user) => {
          const cellData = filteredByResource.filter(
            (row) => row.user === user.name
          );
          if (xAxisExpanded) {
            const userCellContents = getUsernameCellContents(cellData);
            const cells = [
              <div
                key={user.name + "username"}
                style={{
                  gridRowStart: cellData[0].resource
                    .replaceAll("/", "-")
                    .replaceAll(".", "-")
                    .replaceAll(" ", "-"),
                  gridColumnStart: user.name + "_" + "username",
                }}
                className={`cell ${cellData[0].resource
                  .replaceAll("/", "-")
                  .replaceAll(".", "-")
                  .replaceAll(" ", "-")}-row ${user.name}_username-col ${
                  hoverState.row ===
                    cellData[0].resource
                      .replaceAll("/", "-")
                      .replaceAll(".", "-")
                      .replaceAll(" ", "-") && "hl-row"
                } ${
                  hoverState.col === user.name + "_" + "username" && "hl-col"
                }`}
                // onClick={() =>
                //   openOverlay(
                //     "user, role",
                //     user.name,
                //     "username",
                //     cellData[0].resource,
                //     setOverlayData
                //   )
                // }
                onMouseEnter={() => {
                  if (overlayData.visible) return;
                  setHoverState(() => {
                    return {
                      row: cellData[0].resource
                        .replaceAll("/", "-")
                        .replaceAll(".", "-")
                        .replaceAll(" ", "-"),
                      col: user.name + "_" + "username",
                    };
                  });
                }}
                onClick={() => {
                  clickedCell(
                    setOverlayData,
                    setHoverState,
                    cellData[0].resource,
                    "username",
                    user.name,
                    cellData,
                    user.name + "_" + "username"
                  );
                }}
              >
                {userCellContents}
              </div>,
            ];

            user.roles.forEach((role) => {
              // const listIcon =
              //   cellData[0].listRole === undefined
              //     ? "⚪️"
              //     : cellData[0].listRole === role && cellData[0].list === true
              //     ? "🟢"
              //     : cellData[0].listRole === role && cellData[0].list === false
              //     ? "🔴"
              //     : "⚪️";
              // const getIcon =
              //   cellData[0].getRole === undefined
              //     ? "⚪️"
              //     : cellData[0].getRole === role && cellData[0].get === true
              //     ? "🟢"
              //     : cellData[0].getRole === role && cellData[0].get === false
              //     ? "🔴"
              //     : "⚪️";
              // const createIcon =
              //   cellData[0].createRole === undefined
              //     ? "⚪️"
              //     : cellData[0].createRole === role &&
              //       cellData[0].create === true
              //     ? "🟢"
              //     : cellData[0].createRole === role &&
              //       cellData[0].create === false
              //     ? "🔴"
              //     : "⚪️";
              // const updateIcon =
              //   cellData[0].updateRole === undefined
              //     ? "⚪️"
              //     : cellData[0].updateRole === role &&
              //       cellData[0].update === true
              //     ? "🟢"
              //     : cellData[0].updateRole === role &&
              //       cellData[0].update === false
              //     ? "🔴"
              //     : "⚪️";
              // const deleteIcon =
              //   cellData[0].deleteRole === undefined
              //     ? "⚪️"
              //     : cellData[0].deleteRole === role &&
              //       cellData[0].delete === true
              //     ? "🟢"
              //     : cellData[0].deleteRole === role &&
              //       cellData[0].delete === false
              //     ? "🔴"
              //     : "⚪️";

              // const cellContents =
              //   listIcon + getIcon + createIcon + updateIcon + deleteIcon;

              const listIcon =
                cellData[0].listRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].listRole === role &&
                  cellData[0].list === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].listRole === role &&
                  cellData[0].list === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );
              const getIcon =
                cellData[0].getRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].getRole === role && cellData[0].get === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].getRole === role &&
                  cellData[0].get === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );
              const createIcon =
                cellData[0].createRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].createRole === role &&
                  cellData[0].create === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].createRole === role &&
                  cellData[0].create === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );
              const updateIcon =
                cellData[0].updateRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].updateRole === role &&
                  cellData[0].update === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].updateRole === role &&
                  cellData[0].update === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );
              const deleteIcon =
                cellData[0].deleteRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].deleteRole === role &&
                  cellData[0].delete === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].deleteRole === role &&
                  cellData[0].delete === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );

              const cellContents = (
                <>
                  {listIcon}
                  {getIcon}
                  {createIcon}
                  {updateIcon}
                  {deleteIcon}
                </>
              );

              cells.push(
                <div
                  key={user.name + role}
                  style={{
                    gridRowStart: cellData[0].resource
                      .replaceAll("/", "-")
                      .replaceAll(".", "-")
                      .replaceAll(" ", "-"),
                    gridColumnStart:
                      user.name + "_" + role.replaceAll(" ", "_"),
                  }}
                  className={`cell ${cellData[0].resource
                    .replaceAll("/", "-")
                    .replaceAll(".", "-")
                    .replaceAll(" ", "-")}-row ${user.name}_${role.replaceAll(
                    " ",
                    "_"
                  )}-col ${
                    hoverState.row ===
                      cellData[0].resource
                        .replaceAll("/", "-")
                        .replaceAll(".", "-")
                        .replaceAll(" ", "-") && "hl-row"
                  } ${
                    hoverState.col ===
                      user.name + "_" + role.replaceAll(" ", "_") && "hl-col"
                  }`}
                  // onClick={() =>
                  //   openOverlay(
                  //     "user, role",
                  //     user.name,
                  //     role,
                  //     cellData[0].resource,
                  //     setOverlayData
                  //   )
                  // }
                  onMouseEnter={() => {
                    if (overlayData.visible) return;
                    setHoverState(() => {
                      return {
                        row: cellData[0].resource
                          .replaceAll("/", "-")
                          .replaceAll(".", "-")
                          .replaceAll(" ", "-"),
                        col: user.name + "_" + role.replaceAll(" ", "_"),
                      };
                    });
                  }}
                  onClick={() =>
                    clickedCell(
                      setOverlayData,
                      setHoverState,
                      cellData[0].resource,
                      role,
                      user.name,
                      cellData,
                      user.name + "_" + role.replaceAll(" ", "_")
                    )
                  }
                >
                  {cellContents}
                </div>
              );
            });

            return cells;
          } else {
            // const listIcon =
            //   cellData[0].list === undefined
            //     ? "⚪️"
            //     : cellData[0].list === true
            //     ? "🟢"
            //     : "🔴";
            // const getIcon =
            //   cellData[0].get === undefined
            //     ? "⚪️"
            //     : cellData[0].get === true
            //     ? "🟢"
            //     : "🔴";
            // const createIcon =
            //   cellData[0].create === undefined
            //     ? "⚪️"
            //     : cellData[0].create === true
            //     ? "🟢"
            //     : "🔴";
            // const updateIcon =
            //   cellData[0].update === undefined
            //     ? "⚪️"
            //     : cellData[0].update === true
            //     ? "🟢"
            //     : "🔴";
            // const deleteIcon =
            //   cellData[0].delete === undefined
            //     ? "⚪️"
            //     : cellData[0].delete === true
            //     ? "🟢"
            //     : "🔴";

            // const cellContents =
            //   listIcon + getIcon + createIcon + updateIcon + deleteIcon;
            const listIcon =
              cellData[0].list === undefined ? (
                <span className="noPermission"></span>
              ) : cellData[0].list === true ? (
                <span className="truePermission"></span>
              ) : (
                <span className="falsePermission"></span>
              );
            const getIcon =
              cellData[0].get === undefined ? (
                <span className="noPermission"></span>
              ) : cellData[0].get === true ? (
                <span className="truePermission"></span>
              ) : (
                <span className="falsePermission"></span>
              );
            const createIcon =
              cellData[0].create === undefined ? (
                <span className="noPermission"></span>
              ) : cellData[0].create === true ? (
                <span className="truePermission"></span>
              ) : (
                <span className="falsePermission"></span>
              );
            const updateIcon =
              cellData[0].update === undefined ? (
                <span className="noPermission"></span>
              ) : cellData[0].update === true ? (
                <span className="truePermission"></span>
              ) : (
                <span className="falsePermission"></span>
              );
            const deleteIcon =
              cellData[0].delete === undefined ? (
                <span className="noPermission"></span>
              ) : cellData[0].delete === true ? (
                <span className="truePermission"></span>
              ) : (
                <span className="falsePermission"></span>
              );

            const cellContents = (
              <>
                {listIcon}
                {getIcon}
                {createIcon}
                {updateIcon}
                {deleteIcon}
              </>
            );

            return (
              <div
                key={user.name}
                style={{
                  gridRowStart: cellData[0].resource
                    .replaceAll("/", "-")
                    .replaceAll(".", "-")
                    .replaceAll(" ", "-"),
                  gridColumnStart: user.name,
                }}
                className={`cell ${cellData[0].resource
                  .replaceAll("/", "-")
                  .replaceAll(".", "-")
                  .replaceAll(" ", "-")}-row ${user.name}-col ${
                  hoverState.row ===
                    cellData[0].resource
                      .replaceAll("/", "-")
                      .replaceAll(".", "-")
                      .replaceAll(" ", "-") && "hl-row"
                }  ${hoverState.col === user.name && "hl-col"}`}
                // onClick={() =>
                //   openOverlay(
                //     "user",
                //     user.name,
                //     "",
                //     cellData[0].resource,
                //     setOverlayData
                //   )
                // }
                onMouseEnter={() => {
                  if (overlayData.visible) return;

                  setHoverState(() => {
                    return {
                      row: cellData[0].resource
                        .replaceAll("/", "-")
                        .replaceAll(".", "-")
                        .replaceAll(" ", "-"),
                      col: user.name,
                    };
                  });
                }}
                onClick={() =>
                  clickedCell(
                    setOverlayData,
                    setHoverState,
                    cellData[0].resource,
                    "",
                    user.name,
                    cellData,
                    user.name
                  )
                }
              >
                {cellContents}
              </div>
            );
          }
        });

        break;

      case "Role":
        if (xAxisExpanded) {
          dataToPlot = userState.map((user) => {
            const cellData = filteredByResource.filter(
              (row) => row.user === user.name
            );
            const userCellContents = getUsernameCellContents(cellData);
            const cells = [
              <div
                key={user.name + "username"}
                style={{
                  gridRowStart: cellData[0].resource
                    .replaceAll("/", "-")
                    .replaceAll(".", "-")
                    .replaceAll(" ", "-"),
                  gridColumnStart: "username" + "_" + user.name,
                }}
                className={`cell ${cellData[0].resource
                  .replaceAll("/", "-")
                  .replaceAll(".", "-")
                  .replaceAll(" ", "-")}-row username_${user.name}-col ${
                  hoverState.row ===
                    cellData[0].resource
                      .replaceAll("/", "-")
                      .replaceAll(".", "-")
                      .replaceAll(" ", "-") && "hl-row"
                }  ${
                  hoverState.col === "username" + "_" + user.name && "hl-col"
                }`}
                // onClick={() =>
                //   openOverlay(
                //     "user",
                //     "username",
                //     "",
                //     cellData[0].resource,
                //     setOverlayData
                //   )
                // }
                onMouseEnter={() => {
                  if (overlayData.visible) return;

                  setHoverState(() => {
                    return {
                      row: cellData[0].resource
                        .replaceAll("/", "-")
                        .replaceAll(".", "-")
                        .replaceAll(" ", "-"),
                      col: "username" + "_" + user.name,
                    };
                  });
                }}
                onClick={() =>
                  clickedCell(
                    setOverlayData,
                    setHoverState,
                    cellData[0].resource,
                    "username",
                    user.name,
                    cellData,
                    "username" + "_" + user.name
                  )
                }
              >
                {userCellContents}
              </div>,
            ];

            user.roles.forEach((role) => {
              // const listIcon =
              //   cellData[0].listRole === undefined
              //     ? "⚪️"
              //     : cellData[0].listRole === role && cellData[0].list === true
              //     ? "🟢"
              //     : cellData[0].listRole === role && cellData[0].list === false
              //     ? "🔴"
              //     : "⚪️";
              // const getIcon =
              //   cellData[0].getRole === undefined
              //     ? "⚪️"
              //     : cellData[0].getRole === role && cellData[0].get === true
              //     ? "🟢"
              //     : cellData[0].getRole === role && cellData[0].get === false
              //     ? "🔴"
              //     : "⚪️";
              // const createIcon =
              //   cellData[0].createRole === undefined
              //     ? "⚪️"
              //     : cellData[0].createRole === role &&
              //       cellData[0].create === true
              //     ? "🟢"
              //     : cellData[0].createRole === role &&
              //       cellData[0].create === false
              //     ? "🔴"
              //     : "⚪️";
              // const updateIcon =
              //   cellData[0].updateRole === undefined
              //     ? "⚪️"
              //     : cellData[0].updateRole === role &&
              //       cellData[0].update === true
              //     ? "🟢"
              //     : cellData[0].updateRole === role &&
              //       cellData[0].update === false
              //     ? "🔴"
              //     : "⚪️";
              // const deleteIcon =
              //   cellData[0].deleteRole === undefined
              //     ? "⚪️"
              //     : cellData[0].deleteRole === role &&
              //       cellData[0].delete === true
              //     ? "🟢"
              //     : cellData[0].deleteRole === role &&
              //       cellData[0].delete === false
              //     ? "🔴"
              //     : "⚪️";

              // const cellContents =
              //   listIcon + getIcon + createIcon + updateIcon + deleteIcon;

              const listIcon =
                cellData[0].listRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].listRole === role &&
                  cellData[0].list === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].listRole === role &&
                  cellData[0].list === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );
              const getIcon =
                cellData[0].getRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].getRole === role && cellData[0].get === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].getRole === role &&
                  cellData[0].get === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );
              const createIcon =
                cellData[0].createRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].createRole === role &&
                  cellData[0].create === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].createRole === role &&
                  cellData[0].create === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );
              const updateIcon =
                cellData[0].updateRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].updateRole === role &&
                  cellData[0].update === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].updateRole === role &&
                  cellData[0].update === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );
              const deleteIcon =
                cellData[0].deleteRole === undefined ? (
                  <span className="noPermission"></span>
                ) : cellData[0].deleteRole === role &&
                  cellData[0].delete === true ? (
                  <span className="truePermission"></span>
                ) : cellData[0].deleteRole === role &&
                  cellData[0].delete === false ? (
                  <span className="falsePermission"></span>
                ) : (
                  <span className="noPermission"></span>
                );

              const cellContents = (
                <>
                  {listIcon}
                  {getIcon}
                  {createIcon}
                  {updateIcon}
                  {deleteIcon}
                </>
              );

              cells.push(
                <div
                  key={user.name + role}
                  style={{
                    gridRowStart: cellData[0].resource
                      .replaceAll("/", "-")
                      .replaceAll(".", "-")
                      .replaceAll(" ", "-"),
                    gridColumnStart:
                      role.replaceAll(" ", "_") + "_" + user.name,
                  }}
                  className={`cell ${cellData[0].resource
                    .replaceAll("/", "-")
                    .replaceAll(".", "-")
                    .replaceAll(" ", "-")}-row ${role.replaceAll(" ", "_")}_${
                    user.name
                  }-col ${
                    hoverState.row ===
                      cellData[0].resource
                        .replaceAll("/", "-")
                        .replaceAll(".", "-")
                        .replaceAll(" ", "-") && "hl-row"
                  }  ${
                    hoverState.col ===
                      role.replaceAll(" ", "_") + "_" + user.name && "hl-col"
                  }`}
                  // onClick={() =>
                  //   openOverlay(
                  //     "user, role",
                  //     user.name,
                  //     role,
                  //     cellData[0].resource,
                  //     setOverlayData
                  //   )
                  // }
                  onMouseEnter={() => {
                    if (overlayData.visible) return;

                    setHoverState(() => {
                      return {
                        row: cellData[0].resource
                          .replaceAll("/", "-")
                          .replaceAll(".", "-")
                          .replaceAll(" ", "-"),
                        col: role.replaceAll(" ", "_") + "_" + user.name,
                      };
                    });
                  }}
                  onClick={() =>
                    clickedCell(
                      setOverlayData,
                      setHoverState,
                      cellData[0].resource,
                      role,
                      user.name,
                      cellData,
                      role.replaceAll(" ", "_") + "_" + user.name
                    )
                  }
                >
                  {cellContents}
                </div>
              );
            });

            return cells;
          });
        } else {
          dataToPlot = allRoles.map((role) => {
            // if (role !== "IT_Admin") return null;
            const cellData = filteredByResource.filter((row) => {
              return true;
              return (
                typeof row.listRole === "string" ||
                typeof row.getRole === "string" ||
                typeof row.createRole === "string" ||
                typeof row.updateRole === "string" ||
                typeof row.deleteRole === "string" ||
                row.listRole === false ||
                row.getRole === false ||
                row.createRole === false ||
                row.updateRole === false ||
                row.deleteRole === false
              );
            });

            const plot = createSvg(cellData, resource, role, userState);

            return (
              <div
                key={role + cellData[0].resource}
                style={{
                  gridRowStart: cellData[0].resource
                    .replaceAll("/", "-")
                    .replaceAll(".", "-")
                    .replaceAll(" ", "-"),
                  gridColumnStart: role,
                }}
                className={`cell ${cellData[0].resource
                  .replaceAll("/", "-")
                  .replaceAll(".", "-")
                  .replaceAll(" ", "-")}-row ${role}-col ${
                  hoverState.row ===
                    cellData[0].resource
                      .replaceAll("/", "-")
                      .replaceAll(".", "-")
                      .replaceAll(" ", "-") && "hl-row"
                }  ${hoverState.col === role && "hl-col"}`}
                // onClick={() =>
                //   openOverlay(
                //     "role",
                //     "",
                //     role,
                //     cellData[0].resource,
                //     setOverlayData
                //   )
                // }
                onMouseEnter={() => {
                  if (overlayData.visible) return;

                  setHoverState(() => {
                    return {
                      row: cellData[0].resource
                        .replaceAll("/", "-")
                        .replaceAll(".", "-")
                        .replaceAll(" ", "-"),
                      col: role,
                    };
                  });
                }}
                onClick={() =>
                  clickedCell(
                    setOverlayData,
                    setHoverState,
                    cellData[0].resource,
                    role,
                    "",
                    cellData,
                    role
                  )
                }
              >
                {plot}
              </div>
            );
          });
        }
        break;
      default:
        break;
    }

    return dataToPlot;
  });
}

function Grid({
  resultsTableState,
  fileState,
  setFileState,
  userState,
  viewOptions,
  xAxisExpanded,
  setXAxisExpanded,
  templateNames,
  setTemplateNames,
  overlayData,
  setOverlayData,
  hoverState,
  setHoverState,
}) {
  const xRef = useRef(null);
  const yRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const childCells = xRef.current.getElementsByClassName(
      "x-axis-fixed-width-cell"
    );
    // get xScroll

    // get (top level) cell at xScroll
    // scroll to new coord of cell
  }, [xAxisExpanded]);

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
  // console.log(templateNames);

  const XHeader = (
    <div
      ref={xRef}
      onScroll={(e) => scrollCoupling(e)}
      id="xHeader"
      className="x-header-container"
      logsource="X-Axis"
    >
      <div className="x-header-content" logsource="X-Axis">
        <PrintUserState
          userState={userState}
          viewOptions={viewOptions}
          xAxisExpanded={xAxisExpanded}
          setXAxisExpanded={setXAxisExpanded}
          setTemplateNames={setTemplateNames}
        />
      </div>
    </div>
  );
  const YHeader = (
    <div
      ref={yRef}
      onScroll={(e) => scrollCoupling(e)}
      id="yHeader"
      className="y-header-container"
      logsource="Y-Axis"
    >
      <div className="y-header-content" logsource="Y-Axis">
        <PrintFileState
          fileState={fileState}
          setFileState={setFileState}
          setTemplateNames={setTemplateNames}
          xAxisExpanded={xAxisExpanded}
          viewOptions={viewOptions}
        />
      </div>
    </div>
  );

  const GridBody = (
    <div
      ref={gridRef}
      onScroll={(e) => scrollCoupling(e)}
      id="gridBody"
      className="grid-body"
      logsource="grid"
    >
      <div
        className="body-content"
        logsource="grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "[" + templateNames.col.join("] 100px [") + "] 100px",
          gridTemplateRows:
            "[" +
            templateNames.row.join(
              "] " +
                (xAxisExpanded === false &&
                viewOptions.userViewOptions[viewOptions.userViewIndex] ===
                  "Role"
                  ? "60px"
                  : "30px") +
                " ["
            ) +
            "] 30px",
        }}
      >
        {/* <Cells
          resultsTableState={resultsTableState}
          viewOptions={viewOptions}
          xAxisExpanded={xAxisExpanded}
          fileState={fileState}
        /> */}
        <Cells2
          resultsTableState={resultsTableState}
          viewOptions={viewOptions}
          xAxisExpanded={xAxisExpanded}
          fileState={fileState}
          userState={userState}
          setOverlayData={setOverlayData}
          hoverState={hoverState}
          setHoverState={setHoverState}
          overlayData={overlayData}
        />
      </div>
    </div>
  );

  function scrollCoupling(e) {
    switch (e.target.id) {
      case "xHeader":
        gridRef.current.scrollLeft = xRef.current.scrollLeft;
        break;
      case "yHeader":
        gridRef.current.scrollTop = yRef.current.scrollTop;
        break;
      case "gridBody":
        xRef.current.scrollLeft = gridRef.current.scrollLeft;
        yRef.current.scrollTop = gridRef.current.scrollTop;
        break;

      default:
        break;
    }
  }

  const xExpanderToggle = (
    <button
      type="button"
      logsource="X-Axis"
      onClick={() => setXAxisExpanded((prev) => !prev)}
      // className="x-hierarchy-button"
    >
      {xAxisExpanded ? "Collapse x axis" : "Expand x axis"}
    </button>
  );

  return (
    <div className="GridStickyHeaders" logsource="Y-Axis">
      <div>
        <button
          onClick={collapsedAll ? expandAll : collapseAll}
          logsource="Y-Axis"
        >
          {collapsedAll ? "Expand All Folders" : "Collapse All Folders"}
        </button>
        {xExpanderToggle}
      </div>

      {XHeader}
      {YHeader}
      {GridBody}
      {/* {overlayData.visible ? (
        <Overlay
          overlayData={overlayData}
          setOverlayData={setOverlayData}
          userState={userState}
          fileState={fileState}
          // ruleState={ruleState}
          viewOptions={viewOptions}
        />
      ) : null} */}
    </div>
  );
}

function PermissionsPopup({
  overlayData,
  setOverlayData,
  viewOptions,
  xAxisExpanded,
  userState,
}) {
  if (!overlayData.visible) return;

  const indexedOverlayData = overlayData.cellData.map((row, index) => {
    return {
      ...row,
      stringOutcome:
        "" +
        row.list +
        row.listRule +
        row.get +
        row.getRule +
        row.create +
        row.createRule +
        row.update +
        row.updateRule +
        row.delete +
        row.deleteRule,
    };
  });

  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];

      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
  }
  function groupFilter(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];

      if (
        userState
          .filter((user) => user.name === obj.user)[0]
          .roles.includes(overlayData.role)
      )
        return { ...acc, [key]: [...curGroup, obj] };

      return { ...acc };
    }, {});
  }

  const groupedData = groupFilter(indexedOverlayData, "stringOutcome");

  return (
    <div
      className={`${!overlayData.visible && "displaynone"} overlay`}
      logsource="RulesPanel"
    >
      <button
        className="topright"
        logsource="RulesPanel"
        logtype="deselect"
        onClick={() =>
          setOverlayData((prevState) => {
            return { ...prevState, visible: false };
          })
        }
      >
        ❌
      </button>

      {viewOptions.userViewOptions[viewOptions.userViewIndex] === "User" &&
        overlayData.cellData.map((data) => {
          return (
            <div key={data.id} className="popuptable" logsource="RulesPanel">
              {data.user && <div className="mb-1">User: {data.user}</div>}

              {data.resource && (
                <div className="mb-1">Resource: {data.resource}</div>
              )}

              <div className="popup-permissionsgrid">
                <span className="heading">Permission</span>
                <span className="heading">Access</span>
                <span className="heading">Rule no.</span>
                <span className="heading">Role</span>

                <span>List</span>
                <span className={data.list ? "green" : "red"}>
                  {data.list ? "Granted" : "Denied"}
                </span>
                <span>{data.listRule ? data.listRule : "-"}</span>
                <span>{data.listRole ? data.listRole : "-"}</span>

                <span>Get</span>
                <span className={data.get ? "green" : "red"}>
                  {data.get ? "Granted" : "Denied"}
                </span>
                <span>{data.getRule ? data.getRule : "-"}</span>
                <span>{data.getRole ? data.getRole : "-"}</span>

                <span>Create</span>
                <span className={data.create ? "green" : "red"}>
                  {data.create ? "Granted" : "Denied"}
                </span>
                <span>{data.createRule ? data.createRule : "-"}</span>
                <span>{data.createRole ? data.createRole : "-"}</span>

                <span>Update</span>
                <span className={data.update ? "green" : "red"}>
                  {data.update ? "Granted" : "Denied"}
                </span>
                <span>{data.updateRule ? data.updateRule : "-"}</span>
                <span>{data.updateRole ? data.updateRole : "-"}</span>

                <span>Delete</span>
                <span className={data.delete ? "green" : "red"}>
                  {data.delete ? "Granted" : "Denied"}
                </span>
                <span>{data.deleteRule ? data.deleteRule : "-"}</span>
                <span>{data.deleteRole ? data.deleteRole : "-"}</span>
              </div>
            </div>
          );
        })}

      {viewOptions.userViewOptions[viewOptions.userViewIndex] === "Role" &&
        Object.keys(groupedData).map((groupKey) => {
          const usersList = groupedData[groupKey].map((e) => e.user);

          return (
            <div
              key={groupedData[groupKey][0].id}
              className="popuptable"
              logsource="RulesPanel"
            >
              {groupedData[groupKey][0].user && (
                <div className="mb-1">
                  User{usersList.length > 1 && "s"}: {usersList.join(", ")}
                </div>
              )}

              {groupedData[groupKey][0].resource && (
                <div className="mb-1">
                  Resource: {groupedData[groupKey][0].resource}
                </div>
              )}

              <div className="popup-permissionsgrid">
                <span className="heading">Permission</span>
                <span className="heading">Access</span>
                <span className="heading">Rule no.</span>
                <span className="heading">Role</span>

                <span>List</span>
                <span
                  className={groupedData[groupKey][0].list ? "green" : "red"}
                >
                  {groupedData[groupKey][0].list ? "Granted" : "Denied"}
                </span>
                <span>
                  {groupedData[groupKey][0].listRule
                    ? groupedData[groupKey][0].listRule
                    : "-"}
                </span>
                <span>
                  {groupedData[groupKey][0].listRole
                    ? groupedData[groupKey][0].listRole
                    : "-"}
                </span>

                <span>Get</span>
                <span
                  className={groupedData[groupKey][0].get ? "green" : "red"}
                >
                  {groupedData[groupKey][0].get ? "Granted" : "Denied"}
                </span>
                <span>
                  {groupedData[groupKey][0].getRule
                    ? groupedData[groupKey][0].getRule
                    : "-"}
                </span>
                <span>
                  {groupedData[groupKey][0].getRole
                    ? groupedData[groupKey][0].getRole
                    : "-"}
                </span>

                <span>Create</span>
                <span
                  className={groupedData[groupKey][0].create ? "green" : "red"}
                >
                  {groupedData[groupKey][0].create ? "Granted" : "Denied"}
                </span>
                <span>
                  {groupedData[groupKey][0].createRule
                    ? groupedData[groupKey][0].createRule
                    : "-"}
                </span>
                <span>
                  {groupedData[groupKey][0].createRole
                    ? groupedData[groupKey][0].createRole
                    : "-"}
                </span>

                <span>Update</span>
                <span
                  className={groupedData[groupKey][0].update ? "green" : "red"}
                >
                  {groupedData[groupKey][0].update ? "Granted" : "Denied"}
                </span>
                <span>
                  {groupedData[groupKey][0].updateRule
                    ? groupedData[groupKey][0].updateRule
                    : "-"}
                </span>
                <span>
                  {groupedData[groupKey][0].updateRole
                    ? groupedData[groupKey][0].updateRole
                    : "-"}
                </span>

                <span>Delete</span>
                <span
                  className={groupedData[groupKey][0].delete ? "green" : "red"}
                >
                  {groupedData[groupKey][0].delete ? "Granted" : "Denied"}
                </span>
                <span>
                  {groupedData[groupKey][0].deleteRule
                    ? groupedData[groupKey][0].deleteRule
                    : "-"}
                </span>
                <span>
                  {groupedData[groupKey][0].deleteRole
                    ? groupedData[groupKey][0].deleteRole
                    : "-"}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default function LawEncodingDiagram({
  resultsTableState,
  fileState,
  setFileState,
  userState,
  viewOptions,
  setViewOptions,
  visible,
}) {
  const [xAxisExpanded, setXAxisExpanded] = useState(() => false);
  const [templateNames, setTemplateNames] = useState({ row: [], col: [] });
  const [overlayData, setOverlayData] = useState({
    visible: false,
    object: {},
    subject: {
      user: "",
      role: "",
    },
    resource: "",
    role: "",
    user: "",
    cellData: [],
  });

  const [hoverState, setHoverState] = useState({
    row: "",
    col: "",
  });

  if (resultsTableState === undefined) return null;

  return (
    <div
      className="matrix-page"
      logsource="Tool"
      style={{
        display: visible ? "" : "none",
      }}
    >
      <PermissionsPopup
        overlayData={overlayData}
        setOverlayData={setOverlayData}
        viewOptions={viewOptions}
        xAxisExpanded={xAxisExpanded}
        userState={userState}
      />
      <div className="flex-row justify-center" logsource="UsersRoleSelect">
        <UserViewToggle
          viewOptions={viewOptions}
          setViewOptions={setViewOptions}
          flexAlign="center"
        />
      </div>
      <Grid
        resultsTableState={resultsTableState}
        fileState={fileState}
        setFileState={setFileState}
        userState={userState}
        viewOptions={viewOptions}
        xAxisExpanded={xAxisExpanded}
        setXAxisExpanded={setXAxisExpanded}
        templateNames={templateNames}
        setTemplateNames={setTemplateNames}
        overlayData={overlayData}
        setOverlayData={setOverlayData}
        hoverState={hoverState}
        setHoverState={setHoverState}
      />
    </div>
  );
}

function openOverlay(xKeys, user, role, resource, setOverlayData) {
  setOverlayData((prevState) => {
    return {
      ...prevState,
      visible: true,
      subject: {
        user: user,
        role: role,
      },
      object: {
        resource: resource,
      },
    };
  });
}

function createSvg(cellData, resource, role, userState) {
  const usersWithRole = userState.filter((user) => {
    return user.roles.includes(role);
  });

  const usersArray = usersWithRole.map((userdetails) => userdetails.name);

  const outcomes = {};

  cellData.forEach((entry) => {
    if (usersArray.includes(entry.user)) {
      const combination = `${
        entry.list === undefined ? 2 : entry.list ? 1 : 0
      }${entry.get === undefined ? 2 : entry.get ? 1 : 0}${
        entry.create === undefined ? 2 : entry.create ? 1 : 0
      }${entry.update === undefined ? 2 : entry.update ? 1 : 0}${
        entry.delete === undefined ? 2 : entry.delete ? 1 : 0
      }`;
      if (outcomes.hasOwnProperty(combination)) {
        outcomes[combination] = outcomes[combination] + 1;
      } else {
        outcomes[combination] = 1;
      }
    }
  });

  const outcomesKeys = Object.keys(outcomes);

  return (
    <div className="flex-row" logsource="RoleResPlot">
      <svg width="100%" height="100%" viewBox="0 0 100 60" className="plot-svg">
        <g className="backgrounds">
          <rect width="100%" height={12} y="10" fill="ghostwhite" />
          <rect width="100%" height={12} y="22" fill="white" />
          <rect width="100%" height={12} y="34" fill="ghostwhite" />
          <rect width="100%" height={12} y="46" fill="white" />
          <line x1="10" x2="90" y1="52" y2="52" stroke="lightgrey" />
        </g>
        <g className="labels x-labels">
          {outcomesKeys.map((combination) => {
            const height = outcomes[combination];
            const group = plotRow(combination, height);
            // console.log(resource, role, combination, height);
            return <g key={combination}>{group}</g>;
          })}
        </g>
      </svg>
    </div>
  );
}

function plotRow(combination, height) {
  let displacement = 52;
  if (height > 7) {
    displacement = 16;
  } else if (height > 3) {
    displacement = 28;
  } else if (height > 1) {
    displacement = 40;
  }
  return (
    <>
      <circle
        className="dotplot-circle"
        cx="13"
        cy={displacement}
        r={5}
        fill={
          combination[0] === "1"
            ? "springgreen"
            : combination[0] === "2"
            ? "lightgrey"
            : "tomato"
        }
        opacity="0.75"
      />

      <circle
        className="dotplot-circle"
        cx="31"
        cy={displacement}
        r={5}
        fill={
          combination[1] === "1"
            ? "springgreen"
            : combination[1] === "2"
            ? "lightgrey"
            : "tomato"
        }
        opacity="0.75"
      />

      <circle
        className="dotplot-circle"
        cx="49"
        cy={displacement}
        r={5}
        fill={
          combination[2] === "1"
            ? "springgreen"
            : combination[2] === "2"
            ? "lightgrey"
            : "tomato"
        }
        opacity="0.75"
      />

      <circle
        className="dotplot-circle"
        cx="67"
        cy={displacement}
        r={5}
        fill={
          combination[3] === "1"
            ? "springgreen"
            : combination[3] === "2"
            ? "lightgrey"
            : "tomato"
        }
        opacity="0.75"
      />

      <circle
        className="dotplot-circle"
        cx="85"
        cy={displacement}
        r={5}
        fill={
          combination[4] === "1"
            ? "springgreen"
            : combination[4] === "2"
            ? "lightgrey"
            : "tomato"
        }
        opacity="0.75"
      />
    </>
  );
}

function handleHover(setHoverState, yEntry, xEntry) {
  console.log(yEntry);
  setHoverState((prevState) => {
    return { ...prevState, row: yEntry };
  });
}

function clickedCell(
  setOverlayData,
  setHoverState,
  resource,
  role,
  user,
  cellData,
  hoverCol
) {
  setOverlayData((prevState) => {
    return {
      ...prevState,
      visible: true,
      resource: resource,
      role: role,
      user: user,
      cellData: cellData,
    };
  });
  setHoverState(() => {
    return {
      row: cellData[0].resource
        .replaceAll("/", "-")
        .replaceAll(".", "-")
        .replaceAll(" ", "-"),
      col: hoverCol,
    };
  });
  // console.log(cellData);
}
