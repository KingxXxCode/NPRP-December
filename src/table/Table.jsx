import "./Table.css";
import { useState, useEffect } from "react";

const checkEquivalence = (expression, filepath, matchStatement, user) => {
  if (expression[0] !== "§") {
    if (expression[0] === user.uid) {
      return true;
    }
    return false;
  }

  let trPath = filepath.split("/"); // Table Row filepath
  let matchPath = matchStatement.split("/");

  if (trPath.length !== matchPath.length) {
    console.log("error, different filepath and match statement lengths");
  }

  // Filter to correct filepath depth
  let permission = false;

  // Assuming equivalence statement is "§ = user.id"
  for (let i = 1; i < trPath.length; i++) {
    const pathFrag = trPath[i];
    const matchFrag = matchPath[i];
    if (matchFrag === "§") {
      if (pathFrag === user.uid) {
        permission = true;
      }
    }
  }

  return permission;
};

const evaluatePermission = (
  condition,
  permission,
  filepath,
  matchStatement,
  user,
  role
) => {
  // console.log(matchStatement);

  if (condition === "true") return true;
  if (condition === "false") return false;

  const expression = condition.split(" ");
  if (expression[1] === "=") {
    return checkEquivalence(expression, filepath, matchStatement, user);
  }

  if (expression[1] === "role") {
    // console.log(expression);
    if (expression[0] === role) return true;
  }

  return false;
};

const returnUsersFromCondition = (
  condition,
  users,
  squareBracketOptions,
  roleObj
) => {
  // true
  if (condition === "true") {
    return users.map((user) => user.name);
  }

  // false
  if (condition === "false") return [];

  // role
  if (condition.endsWith("role")) {
    const role = condition.split(" role")[0];
    const filteredUsers = users.filter((user) => user.roles.includes(role));
    const usersArray = filteredUsers.map((user) => user.name);
    usersArray.forEach((user) => (roleObj[user] = role));

    return usersArray;
  }

  // username
  const equivalence = condition.split(" = ");
  if (equivalence[1]) {
    // console.log(condition, new Set(squareBracketOptions));
    const filteredUsers = users.filter((user) =>
      squareBracketOptions.includes(user.name)
    );
    return filteredUsers.map((user) => user.name);
  }

  return "Unknown condition";
};

export const updateDisplayTable = (
  fileState,
  userState,
  referenceTableState,
  setDisplayTableState
) => {
  if (!referenceTableState || referenceTableState.length === 0) return;
  // Evaluate permission outcomes:
  // Prioritise last occurrence of resource/user pairs
  // Actual table will be each combination of resource and user
  let finalPermissions = [];
  let index = 0;
  fileState.forEach((resource) =>
    userState.forEach((user) => {
      index += 1;
      finalPermissions.push({
        resource: resource.pathArray.join("/"),
        user: user.name,
        id: index,
      });
    })
  );

  finalPermissions = finalPermissions.map((tableRow) => {
    const tableEntries = referenceTableState.filter((entry) => {
      return (
        tableRow.resource === entry.resource && tableRow.user === entry.user
      );
    });

    let outcomes = {};

    tableEntries.forEach((entry) => {
      // console.log(entry);
      if ("list" in entry) {
        outcomes.list = entry.list;
        outcomes.listRule = entry.ruleId;
        outcomes.listRole = entry.role;
      }
      if ("get" in entry) {
        outcomes.get = entry.get;
        outcomes.getRule = entry.ruleId;
        outcomes.getRole = entry.role;
      }
      if ("create" in entry) {
        outcomes.create = entry.create;
        outcomes.createRule = entry.ruleId;
        outcomes.createRole = entry.role;
      }
      if ("update" in entry) {
        outcomes.update = entry.update;
        outcomes.updateRule = entry.ruleId;
        outcomes.updateRole = entry.role;
      }
      if ("delete" in entry) {
        outcomes.delete = entry.delete;
        outcomes.deleteRule = entry.ruleId;
        outcomes.deleteRole = entry.role;
      }
    });

    return {
      ...outcomes,
      ...tableRow,
    };
  });

  // console.log(finalPermissions);
  setDisplayTableState(() => finalPermissions);
};

const checkOutcomes = (rulePath, resource, user, condition) => {
  if (condition === "true") return true;
  if (condition === "false") return false;

  if (condition.endsWith("role")) {
    const ruleRole = condition.split(" role")[0];
    const userRoles = user.roles;

    return userRoles.includes(ruleRole);
  }

  const equivalence = condition.split(" = ");
  if (equivalence[1]) {
    const variable = equivalence[0];
    const parameter = equivalence[1];
    const index = rulePath.indexOf(variable);

    if (parameter === "user.name") {
      return resource[index] === user.name;
    }
  }

  return false;
};

export function tableDataCreator(
  setResultsTableState,
  fileState,
  ruleState,
  userState
) {
  const updateTable = [];
  let id = 0;

  ruleState.forEach((rule) => {
    // Get all the possible resources the rule can apply to:
    let filterableResourcesTree = fileState.map((file) => file.pathArray);

    // Variable for [variable] filepaths
    let squareBracketOptions = [];

    const rulePath = rule.match.split("/");
    rulePath.shift();

    const ruleId = rule.id;

    let skipResource = false;
    for (const index in fileState) {
      const resource = fileState[index].pathArray;

      if (skipResource && skipResource[0] === resource[skipResource[1]]) {
        filterableResourcesTree[index] = undefined;
        continue;
      } else {
        skipResource = false;
      }

      // remove if resource path shorter than rule match
      if (resource.length < rulePath.length) {
        // console.log("Resource is shorter: ", resource, rulePath);
        filterableResourcesTree[index] = undefined;
        continue;
      }

      for (let i = 0; i < rulePath.length; i++) {
        const element = rulePath[i];

        // Allow all if wildcard
        if (element === "*") {
          continue;
        }
        // Allow all if variable
        if (element.startsWith("[") && element.endsWith("]")) {
          squareBracketOptions.push(resource[i]);
          continue;
        }
        // Otherwise, remove if filepath segments do not match
        if (resource[i] !== element) {
          // TODO: Keep iterating through resources
          //       until you reach a new branch
          filterableResourcesTree[index] = undefined;
          skipResource = [resource[i], i];
          continue;
        }
      }
    }
    filterableResourcesTree = filterableResourcesTree.filter(Boolean);

    // // Cartesian product to get each resource/user combination:
    filterableResourcesTree.forEach((resource) => {
      // For each user, push their outcome
      userState.forEach((user) => {
        const granularPermissions = {};

        const booleanOperationOutcome = checkOutcomes(
          rulePath,
          resource,
          user,
          rule.condition
        );

        Object.keys(rule.permissions).forEach((permission) => {
          let outcome = null;
          let grantedByRole = false;

          if (rule.permissions[permission].permission === "Set") {
            outcome = booleanOperationOutcome ? true : null;
          }
          if (rule.permissions[permission].permission === "Clear") {
            outcome = booleanOperationOutcome ? false : null;
          }

          if (rule.condition.endsWith("role")) {
            grantedByRole = rule.condition.split(" role")[0];
          }

          switch (permission) {
            case "read":
              granularPermissions.list = outcome;
              granularPermissions.get = outcome;
              break;
            case "write":
              granularPermissions.create = outcome;
              granularPermissions.update = outcome;
              granularPermissions.delete = outcome;
              break;
            default:
              granularPermissions[permission] = outcome;
              break;
          }

          outcome === null
            ? null
            : updateTable.push({
                resource: resource.join("/"),
                user: user.name,
                id: id,
                rule: rule.match,
                ruleId: ruleId,
                role: grantedByRole,
                ...granularPermissions,
              });
          id += 1;
        });
      });
    });
  });
  setResultsTableState(() => updateTable);
}

function TableHeaders({
  matrixAxes,
  matrixDatapoints,
  sortHeader,
  setSortHeader,
}) {
  return matrixAxes.concat(matrixDatapoints).map((heading) => {
    if (heading.endsWith("Role")) return;
    if (heading.endsWith("Rule")) return;
    return (
      <th key={heading}>
        <button
          id={"headingbutton" + heading.toLowerCase().replaceAll(" ", "")}
          // CSS pseudo-element arrow to indicate sort direction
          className={
            sortHeader.headerName === heading
              ? sortHeader.sortDirection
                ? "heading-button active-sort"
                : "heading-button active-sort-reverse"
              : "heading-button"
          }
          onClick={() => {
            if (heading !== sortHeader.headerName) {
              setSortHeader(() => ({
                headerName: heading,
                sortDirection: true,
              }));
            } else {
              setSortHeader({
                ...sortHeader,
                sortDirection: !sortHeader.sortDirection,
              });
            }
          }}
        >
          {heading}
        </button>
      </th>
    );
  });
}

// Allows sorting function to sort on custom argument
function sortByHeader(headerName, direction) {
  if (direction) {
    // Sort ascending
    return (a, b) => {
      const valueA = a[headerName] === undefined ? false : a[headerName];
      const valueB = b[headerName] === undefined ? false : b[headerName];

      return valueA === valueB ? 0 : valueA < valueB ? -1 : 1;
    };
  } else {
    // Sort descending
    return (a, b) => {
      const valueA = a[headerName] === undefined ? false : a[headerName];
      const valueB = b[headerName] === undefined ? false : b[headerName];

      return valueA === valueB ? 0 : valueA < valueB ? 1 : -1;
    };
  }
}

function TableRows({
  matrixAxes,
  matrixDatapoints,
  sortHeader,
  resultsTableState,
}) {
  // Read props, copy for sorting (so we are rearranging a copy)
  let sortedData = [...resultsTableState];
  let filteredData = sortedData.filter(
    (data) =>
      data.list === 1 ||
      data.list === "1" ||
      data.list === true ||
      data.get === 1 ||
      data.get === "1" ||
      data.get === true ||
      data.create === 1 ||
      data.create === "1" ||
      data.create === true ||
      data.update === 1 ||
      data.update === "1" ||
      data.update === true ||
      data.delete === 1 ||
      data.delete === "1" ||
      data.delete === true
  );

  // Only call the sort function once the state has been set
  if (sortHeader.headerName) {
    // console.log(sortHeader);
    filteredData.sort(
      sortByHeader(sortHeader.headerName, sortHeader.sortDirection)
    );
  }

  return filteredData.map(function cbFn(row) {
    // console.log(row);
    let key = [];
    for (let i = 0; i < matrixAxes.length; i++) {
      key.push(row[matrixAxes[i]]);
    }

    //   map through the keys of each json entry, add a class to the matrix values
    const tdHeads = matrixAxes.map(function (td, index) {
      return <td key={index}>{row[td]}</td>;
    });

    const tdDatas = matrixDatapoints.map((td, index) => {
      if (td.endsWith("Role")) return;
      if (td.endsWith("Rule")) return;

      if (
        typeof row[td] === "object" &&
        !Array.isArray(row[td]) &&
        row[td] !== null
      ) {
        row[td] = Object.values(row[td]);
      }
      if (row[td] === false) row[td] = 0;
      if (row[td] === true) row[td] = 1;
      return (
        <td className="td-numeric" key={index}>
          {row[td]}
        </td>
      );
    });

    return (
      // <tr key={lowerNoSpace(key.join(""))}>
      <tr key={Math.random()}>
        {tdHeads}
        {tdDatas}
      </tr>
    );
  });
}

function uniqueKeys(object) {
  const keys = new Set();
  object.forEach((entry) => Object.keys(entry).forEach((key) => keys.add(key)));

  return Array.from(keys);
}

export function Table({ resultsTable, setForceEffect }) {
  useEffect(() => {
    if (resultsTable === undefined) {
      setForceEffect((prevState) => !prevState);
    }
  }, []);

  // state to determine which table column is sorted by
  const [sortHeader, setSortHeader] = useState({
    headerName: "",
    sortDirection: true,
  });

  if (resultsTable === undefined) {
    return;
  }

  // returns a set or array of unique keys
  const uniques = uniqueKeys(resultsTable);

  // Getting value datatypes for each key - needs to handle undefined
  const keyTypes = [];
  uniques.forEach(() => keyTypes.push(new Set()));
  for (let i = 0; i < uniques.length; i++) {
    for (let ii = 0; ii < resultsTable.length; ii++) {
      keyTypes[i].add(typeof resultsTable[ii][uniques[i]]);
    }
  }
  // Construct an object with the key/type pairings:
  const keyTypesObject = Object.assign.apply(
    {},
    uniques.map((v, i) => ({ [v]: Array.from(keyTypes[i]) }))
  );

  // Function to create table rows
  // based on datatypes, the matrixAxes set will be matrix headers
  const matrixAxes = [];
  // ...and the matrixDatapoints contain the matrix cell values
  const matrixDatapoints = [];
  for (let i = 0; i < Object.values(keyTypesObject).length; i++) {
    if (
      JSON.stringify(Object.values(keyTypesObject)[i]) ===
      JSON.stringify(["string"])
    ) {
      matrixAxes.push(Object.keys(keyTypesObject)[i]);
    } else {
      if (Object.keys(keyTypesObject)[i] !== "id") {
        matrixDatapoints.push(Object.keys(keyTypesObject)[i]);
      }
    }
  }
  return (
    <>
      <h3>Table</h3>
      <table>
        <tbody>
          <tr>
            <TableHeaders
              matrixAxes={matrixAxes}
              matrixDatapoints={matrixDatapoints}
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
            />
          </tr>
          {/* Table rows */}
          <TableRows
            matrixAxes={matrixAxes}
            matrixDatapoints={matrixDatapoints}
            sortHeader={sortHeader}
            resultsTableState={resultsTable}
          />
        </tbody>
      </table>
    </>
  );
}
