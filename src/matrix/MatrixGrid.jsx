// Import react hooks
import { useState, useEffect } from "react";

function lowerNoSpace(string) {
  return string.toLowerCase().replaceAll(" ", "");
}

import Punchcard from "./charts/Punchcard";

// import DataTable from "./DataTable";

let cellInteractivityButton;

// Cartesian product is every possible combination
// e.g for a coin: hh, ht, th, tt
const cartesian = (axisHeaders) =>
  axisHeaders.reduce((axisHeaders, b) =>
    axisHeaders.flatMap((d) => b.map((e) => [d, e].flat()))
  );

export default function MatrixGrid(props) {
  // Create a variable for the headers in each matrix axis
  function dimensionNames(headers, axis) {
    let names2dArray = [];
    axis.forEach((element) => {
      names2dArray.push(headers[element]);
    });
    let result = cartesian(names2dArray);
    for (let i = 0; i < result.length; i++) {
      result[i] = Array.isArray(result[i]) ? result[i].join("-") : result[i];
    }
    return result;
  }

  let modalData;

  const sanitiseDirectoryString = (stringVar) => {
    stringVar = stringVar.replaceAll("./", "root");
    stringVar = stringVar.replaceAll("/", "");
    stringVar = stringVar.replaceAll(".", "");

    return stringVar;
  };

  function updateXDirection(state, headingsArray, setHeaderXState) {
    let headerTitlesVar = [];

    state.forEach((element, index) => {
      headingsArray[element].forEach((entry) => {
        // Work out how many times a subheading will be repeated
        const iterateOver = state.slice(0, index);
        const iterationDepth = iterateOver.map((x) => headingsArray[x].length);
        let iterations = 1;
        if (iterationDepth.length) {
          iterations = iterationDepth.reduce((a, b) => a * b);
        }

        // Work out how wide parent headers have to span
        const spanAcross = state.slice(index + 1, state.length);
        const spanDepth = spanAcross.map((x) => headingsArray[x].length);
        let spans = 1;
        if (spanDepth.length) {
          spans = spanDepth.reduce((a, b) => a * b);
        }

        // Get the named grid position for this cell's location
        const startPosition = iterateOver.map((x) => headingsArray[x]);
        let startPositionString = "";
        if (startPosition.length) {
          startPositionString = cartesian(startPosition).map((element) =>
            Array.isArray(element)
              ? lowerNoSpace(element.join("-"))
              : lowerNoSpace(element)
          );
        }

        for (let i = 0; i < iterations; i++) {
          let gcsString = lowerNoSpace(entry);
          if (startPositionString) {
            gcsString = startPositionString[i].concat("-", gcsString);
            if (index < state.length - 1) {
              spanAcross.forEach((y) => {
                gcsString = gcsString.concat(
                  "-",
                  lowerNoSpace(headingsArray[y][0])
                );
              });
            }
          } else {
            spanAcross.forEach((y) => {
              gcsString = gcsString.concat(
                "-",
                lowerNoSpace(headingsArray[y][0])
              );
            });
          }

          gcsString = sanitiseDirectoryString(gcsString);

          headerTitlesVar.push(
            <span
              key={element + entry + i}
              className={
                index
                  ? "grid-header x-grid-header"
                  : "grid-header x-grid-header top-level"
              }
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
                gridColumn: gcsString + " / span " + spans,
                gridRow: state[index] + " / span 1",
              }}
            >
              {entry}
            </span>
          );
        }
      });
    });
    setHeaderXState(headerTitlesVar);
  }

  function handleRowCollapse(e, pathName) {
    // console.log(e.target, pathName);

    if (e.target.innerText.startsWith("▼")) {
      e.target.innerText = "▶︎ ";
    } else {
      e.target.innerText = "▼ ";
    }

    // console.log(props.headersObject, props.xState, props.yState);

    const comparisonElement = lowerNoSpace(pathName);

    let gtrStringToRemove = "";
    let valueRowNames = dimensionNames(props.headersObject, props.yState);
    let gridRowNames = props.xState.concat(valueRowNames);

    // console.log(gridRowNames);

    for (let i = 0; i < gridRowNames.length; i++) {
      // if (gridRowNames[i] !== comparisonElement) console.log(gridRowNames[i]);
      if (
        gridRowNames[i] !== comparisonElement &&
        gridRowNames[i].startsWith(comparisonElement)
      ) {
        gtrStringToRemove =
          gtrStringToRemove + "[" + gridRowNames[i] + "] auto ";
        if (rowDivider && rowDivider.includes(gridRowNames[i])) {
          gtrStringToRemove = gtrStringToRemove + "[rowseparator] 1px ";
        }
      }
    }

    gtrStringToRemove = sanitiseDirectoryString(gtrStringToRemove);

    let originalGTR =
      document.querySelector(".grid-container").style.gridTemplateRows;

    if (originalGTR.includes(gtrStringToRemove)) {
      originalGTR = originalGTR.replace(gtrStringToRemove, "");
    } else {
      // Go line by line
      console.log("To implement!");
    }

    setGtrString(originalGTR);
  }

  function updateYDirection(state, headingsArray, setHeaderYState) {
    let headerTitlesVar = [];

    state.forEach((element, index) => {
      headingsArray[element].forEach((entry) => {
        const pathArray = entry.split("/");
        const spacing = pathArray.map((e, i) => {
          if (
            i < pathArray.length - 1 ||
            pathArray[pathArray.length - 1].includes(".")
          ) {
            return (
              <span key={i} className="mono">
                &nbsp;&nbsp;
              </span>
            );
          }
          return (
            <span
              key={i}
              className="mono"
              // onClick={(e) => handleRowCollapse(e, entry)}
            >
              ▼&nbsp;
            </span>
          );
        });

        // Work out how many times a subheading will be repeated
        const iterateOver = state.slice(0, index);
        const iterationDepth = iterateOver.map((x) => headingsArray[x].length);
        let iterations = 1;
        if (iterationDepth.length) {
          iterations = iterationDepth.reduce((a, b) => a * b);
        }

        // Work out how high parent headers have to span
        const spanAcross = state.slice(index + 1, state.length);
        const spanDepth = spanAcross.map((x) => headingsArray[x].length);
        let spans = 1;
        if (spanDepth.length) {
          spans = spanDepth.reduce((a, b) => a * b);
        }

        // Get the named grid position for this cell's location
        const startPosition = iterateOver.map((x) => headingsArray[x]);
        let startPositionString = "";
        if (startPosition.length) {
          startPositionString = cartesian(startPosition).map((element) =>
            Array.isArray(element)
              ? lowerNoSpace(element.join("-"))
              : lowerNoSpace(element)
          );
        }

        for (let i = 0; i < iterations; i++) {
          let grsString = lowerNoSpace(entry);

          if (startPositionString) {
            grsString = startPositionString[i].concat("-", grsString);
            if (index < state.length - 1) {
              spanAcross.forEach((y) => {
                grsString = grsString.concat(
                  "-",
                  lowerNoSpace(headingsArray[y][0])
                );
              });
            }
          } else {
            spanAcross.forEach((y) => {
              grsString = grsString.concat(
                "-",
                lowerNoSpace(headingsArray[y][0])
              );
            });
          }

          grsString = sanitiseDirectoryString(grsString);

          headerTitlesVar.push(
            <span
              key={element + entry}
              className={
                index
                  ? "grid-header y-grid-header"
                  : "grid-header y-grid-header top-level"
              }
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
                gridColumn: state[index] + " / span 1",
                gridRow: grsString + " / span " + spans,
              }}
            >
              {spacing}
              {pathArray[pathArray.length - 1]}
            </span>
          );
        }
      });
    });
    // console.log(headerTitlesVar);
    setHeaderYState(headerTitlesVar);
  }
  // const Actions = props.data.map((value) => value.Action);
  // const Authorisations = props.data.map((value) => value.Authorisation);

  const Permissions = [];
  props.data.forEach((value) => {
    if ("permissions" in value) Permissions.push(value.permissions);
  });

  const PermissionsArray = [];

  if (Permissions.length) {
    Permissions.map((obj) =>
      PermissionsArray.push([
        obj.list,
        obj.get,
        obj.create,
        obj.update,
        obj.delete,
      ])
    );
  }

  // props.data.forEach((entry, index) => {
  //   entry["arr"] = PermissionsArray[index];
  // });

  // Get the upper limits so the visualisations can scale to their max values
  // const maxActions = Math.max(...Actions);
  // const maxAuthorisations = Math.max(...Authorisations);
  let maxValue = 0;
  if (Permissions.length) {
    maxValue = Math.max(...PermissionsArray.flat());
  }
  // GTC and GTR are the css names for the grid layout
  // Saving these in a state means the grid container is
  // redrawn whenever the layout changes
  const [gtcString, setGtcString] = useState("");
  const [gtrString, setGtrString] = useState("");

  // These are the cell states, their position is based on the
  // data table keys and will be redefined when the grid container changes
  // the content comes from the table content
  const [cellState, setCellState] = useState();
  const [headerXState, setHeaderXState] = useState();
  const [headerYState, setHeaderYState] = useState();

  const [matrixModal, setMatrixModal] = useState({
    open: false,
    xRef: "",
    yRef: "",
  });

  // Which visualisation is currently active
  const [visOpt, setVisOpt] = useState("Punchcard");

  // Table separator locations
  const [columnDivider, setColumnDivider] = useState([]);
  const [rowDivider, setRowDivider] = useState([]);

  function Comma(props) {
    const isAuth = props.isAuth;
    if (isAuth > 0) {
      return ", ";
    }
    return "";
  }

  const createCell = (dataEntry, cellCol, cellRow, visOpt) => {
    return (
      <span
        key={Object.values(dataEntry)}
        className={"matrix-cell " + cellRow + "-row " + cellCol + "-col"}
        style={{
          gridColumn: cellCol + " / span 1",
          gridRow: cellRow + " / span 1",
        }}
      >
        {visOpt === "Numbers" ? (
          <>
            {dataEntry.list ? 1 : 0}&nbsp;
            {dataEntry.get ? 1 : 0}&nbsp;
            {dataEntry.create ? 1 : 0}&nbsp;
            {dataEntry.update ? 1 : 0}&nbsp;
            {dataEntry.delete ? 1 : 0}
          </>
        ) : (
          ""
        )}
        {visOpt === "Punchcard" ? (
          dataEntry ? (
            <Punchcard
              permissions={[
                dataEntry.list,
                dataEntry.get,
                dataEntry.create,
                dataEntry.update,
                dataEntry.delete,
              ]}
            />
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </span>
    );
  };

  // useEffect is called whenever any of the variables in the array at
  // the end of the effect change

  // This runs twice when matrix dimensions states change, maybe fix?
  useEffect(() => {
    const cellClickHandler = (colTitle, rowTitle) => {
      setMatrixModal({
        open: true,
        xRef: colTitle,
        yRef: rowTitle,
      });
    };

    const createCellOverlay = (colTitles, rowTitles) => {
      const cellMap = cartesian([colTitles, rowTitles]);

      cellInteractivityButton = cellMap.map((element) => (
        <span
          key={element}
          onClick={() => cellClickHandler(element[0], element[1])}
          style={{
            gridColumn: element[0] + " / span 1",
            gridRow: element[1] + " / span 1",
          }}
          className="interactive-cell-overlay"
        ></span>
      ));

      let xCellRef = new Array(props.xState.length);
      let yCellRef = new Array(props.yState.length);

      if (matrixModal.xRef) {
        xCellRef = matrixModal.xRef.split("-");
      }

      if (matrixModal.yRef) {
        yCellRef = matrixModal.yRef.split("-");
      }

      let keyList = props.xState.concat(props.yState);
      let filterList = xCellRef.concat(yCellRef);

      modalData = props.data.filter(checkFilterList);

      function checkFilterList(str) {
        let boolResult = new Array(keyList.length);
        for (let i = 0; i < keyList.length; i++) {
          boolResult[i] = lowerNoSpace(str[keyList[i]]) === filterList[i];
        }
        let result = true;
        for (let i = 0; i < boolResult.length; i++) {
          result &= boolResult[i];
        }
        return result;
      }

      // modalData = props.data.filter(
      //   (word) =>
      //     lowerNoSpace(word[props.xState[0]]) === "office" &&
      //     lowerNoSpace(word[props.yState[0]]) === "grade1a"
      // );
    };

    function recalcMatrixSize(headers, xLayout, yLayout) {
      let gtcStringVar = "";
      let gtrStringVar = "";
      // TODO:  Catch x/y Layout having no length

      // These are separate because the css style uses gridColumn and gridRow
      let valueColumnNames = dimensionNames(headers, xLayout);
      let valueRowNames = dimensionNames(headers, yLayout);
      let gridColumnNames = yLayout.concat(valueColumnNames);
      let gridRowNames = xLayout.concat(valueRowNames);

      // create a big string to use for the css declaration
      for (let i = 0; i < gridColumnNames.length; i++) {
        gtcStringVar = gtcStringVar + "[" + gridColumnNames[i] + "] auto ";
        // Add colum separators after each parent heading
        if (columnDivider && columnDivider.includes(gridColumnNames[i])) {
          gtcStringVar = gtcStringVar + "[columnseparator] 1px ";
        }
      }
      gtcStringVar = sanitiseDirectoryString(gtcStringVar);
      setGtcString(gtcStringVar);

      for (let i = 0; i < gridRowNames.length; i++) {
        gtrStringVar = gtrStringVar + "[" + gridRowNames[i] + "] auto ";
        if (rowDivider && rowDivider.includes(gridRowNames[i])) {
          gtrStringVar = gtrStringVar + "[rowseparator] 1px ";
        }
      }
      gtrStringVar = sanitiseDirectoryString(gtrStringVar);
      setGtrString(gtrStringVar);

      // createCellOverlay(valueColumnNames, valueRowNames);
    }

    // only rerender the matrix if it has both dimensions
    if (props.xState.length && props.yState.length) {
      recalcMatrixSize(props.headersObject, props.xState, props.yState);

      updateXDirection(props.xState, props.headerTitlesObject, setHeaderXState);
      updateYDirection(props.yState, props.headerTitlesObject, setHeaderYState);

      // redefine data cell locations (grid col/row names)
      let matrixCells = props.data.map((dataEntry) => {
        let cellCol = grsLocation(props.xState, dataEntry);
        let cellRow = grsLocation(props.yState, dataEntry);

        let cell = createCell(dataEntry, cellCol, cellRow, visOpt);
        return cell;
      });
      setCellState(matrixCells);
    }
  }, [
    props.data,
    props.headerTitlesObject,
    props.headersObject,
    props.xState,
    props.yState,
    visOpt,
    columnDivider,
    rowDivider,
    matrixModal,
  ]);

  // An effect of changing the header layout is recalculating
  // the separator lines
  useEffect(() => {
    let lastXSubHeading = "";
    let lastYSubHeading = "";

    if (props.xState) {
      for (let i = 1; i < props.xState.length; i++) {
        lastXSubHeading += lowerNoSpace(
          props.headerTitlesObject[props.xState[i]][
            props.headerTitlesObject[props.xState[i]].length - 1
          ]
        );
      }
    }

    if (props.yState) {
      for (let i = 1; i < props.yState.length; i++) {
        lastYSubHeading += lowerNoSpace(
          props.headerTitlesObject[props.yState[i]][
            props.headerTitlesObject[props.yState[i]].length - 1
          ]
        );
      }
    }

    let innerXHeadings = [];

    let innerYHeadings = [];

    if (props.xState[0]) {
      innerXHeadings.push.apply(
        innerXHeadings,
        props.headerTitlesObject[props.xState[0]].slice(
          0,
          props.headerTitlesObject[props.xState[0]].length - 1
        )
      );
    }

    if (props.yState[0]) {
      innerYHeadings.push.apply(
        innerYHeadings,
        props.headerTitlesObject[props.yState[0]].slice(
          0,
          props.headerTitlesObject[props.yState[0]].length - 1
        )
      );
    }

    let separatorXHeadings;
    let separatorYHeadings;

    if (innerXHeadings) {
      separatorXHeadings = innerXHeadings.map(
        (element) =>
          lowerNoSpace(element) + (lastXSubHeading ? "-" + lastXSubHeading : "")
      );
    }
    if (innerYHeadings) {
      separatorYHeadings = innerYHeadings.map(
        (element) =>
          lowerNoSpace(element) + (lastYSubHeading ? "-" + lastYSubHeading : "")
      );
    }

    setColumnDivider(separatorXHeadings);
    setRowDivider(separatorYHeadings);
  }, [props.headerTitlesObject, props.xState, props.yState]);

  useEffect(() => {
    Array.from(document.querySelectorAll(".vo-active")).forEach((element) =>
      element.classList.remove("vo-active")
    );

    document
      .getElementById(`vo-${lowerNoSpace(visOpt)}`)
      .classList.add("vo-active");
  }, [visOpt]);

  function grsLocation(layout, sourceRow) {
    let cellCol = "";
    layout.forEach((element, index) => {
      const entry = element.charAt(0) + element.slice(1);
      // The first term does not need the hyphen
      if (!index) {
        cellCol += sourceRow[entry];
      } else {
        cellCol += "-" + sourceRow[entry];
      }
      if (element === "filepath") cellCol = sanitiseDirectoryString(cellCol);
    });

    if (cellCol.includes("file")) {
    }

    cellCol = cellCol.toLocaleLowerCase();

    cellCol = cellCol
      .replaceAll("./", "root")
      .replaceAll("/", "")
      .replaceAll(".", "")
      .replaceAll(" ", "");

    return cellCol;
  }

  const closeModal = () => {
    setMatrixModal({ open: false });
  };

  return (
    <div className="grid-wrapper">
      {/* {matrixModal.open ? (
        <>
          <div className="modal">
            {modalData.length ? <DataTable data={modalData} /> : ""}
          </div>
          <div className="modal-overlay" onClick={() => closeModal()}></div>
        </>
      ) : (
        ""
      )} */}
      <h3>Cell visualisation: </h3>
      <button
        onClick={() => setVisOpt("Numbers")}
        className="vis-opt-btn"
        id="vo-numbers"
      >
        Numbers
      </button>
      {/* <button
        onClick={() => setVisOpt("Sparkline")}
        className="vis-opt-btn"
        id="vo-sparkline"
      >
        Sparkline
      </button> */}
      <button
        onClick={() => setVisOpt("Punchcard")}
        className="vis-opt-btn"
        id="vo-punchcard"
      >
        Punchcard
      </button>

      <div style={{ marginTop: "3rem" }} />
      <div
        key="gridContainer"
        className="grid-container"
        style={{
          gridTemplateColumns: gtcString,
          gridTemplateRows: gtrString,
        }}
      >
        {cellInteractivityButton}

        {headerXState}
        {headerYState}
        {cellState}

        {columnDivider
          ? columnDivider.map((e, i) => (
              <span
                key={e + i}
                style={{
                  gridColumn: "columnseparator" + (i + 1),
                  gridRow: "1/-1",
                }}
                className="grid-separator"
              ></span>
            ))
          : ""}

        {rowDivider
          ? rowDivider.map((e, i) => (
              <span
                key={e + i}
                style={{
                  gridRow: "rowseparator" + (i + 1),
                  gridColumn: "1/-1",
                }}
                className="grid-separator"
              ></span>
            ))
          : ""}
      </div>
    </div>
  );
}
