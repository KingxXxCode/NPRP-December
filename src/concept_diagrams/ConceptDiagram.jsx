import "./cd.css";

import * as d3 from "d3";

import { useD3 } from "./useD3";

const data = [];

import fileStruct from "../data/filestruct.json";
import ruleStruct from "../data/rulestruct.json";
import userStructCD from "../data/userStruct.json";
import React from "react";
import { index, reduce, variance } from "d3";
import { filterProperties } from "./cdFunctions";

//console.log(fileStruct);
//console.log(ruleStruct);
//console.log(userStructCD);

var filepath = [];
var fileslist = [];
var fpathlist = [];
var flist = [];

var properties = [];
var propertiesArr = [];
var filteredpropertiesArr = [];

for (var i = 0; i < fileStruct.length; i++) fileStruct[i].parent = "resources";

var fileStruct_mod = traverseRootFilepath(fileStruct, flist, "fs");
//console.log(fileStruct_mod);

//var personnel = transformPersonnel(userStructCD);
//createProperties(userStructCD, personnel, fileStruct_mod, ruleStruct);

function transformPersonnel(personnel) {
  for (var p = 0; p < personnel.length; p++) {
    if (!personnel[p].roles.includes("userid"))
      personnel[p].roles.push("userid");
  }

  var transformPersonnelArr = [
    {
      name: "users",
      type: "root",
      children: [],
    },
  ];

  var uniqueRoles = [];
  for (var p = 0; p < personnel.length; p++) {
    for (var r = 0; r < personnel[p].roles.length; r++) {
      if (!uniqueRoles.includes(personnel[p].roles[r])) {
        uniqueRoles.push(personnel[p].roles[r]);
      }
    }
  }

  for (var r = 0; r < uniqueRoles.length; r++) {
    if (uniqueRoles[r] != "userid")
      transformPersonnelArr[0].children.push({
        name: uniqueRoles[r],
        type: "class",
        children: [],
      });
  }

  for (var r = 0; r < transformPersonnelArr[0].children.length; r++) {
    for (var p = 0; p < personnel.length; p++) {
      if (
        personnel[p].roles.includes(transformPersonnelArr[0].children[r].name)
      ) {
        transformPersonnelArr[0].children[r].children.push({
          name: personnel[p].name,
          type: "object",
          size: 30,
        });
      }
    }
  }

  //console.log(transformPersonnelArr);
  return transformPersonnelArr;
}

function createProperties(personnelbyuser, personnel, resources, rules) {
  /* console.log(personnel);
  console.log(resources);
  console.log(rules); */
  //personnelbyuser = personnelbyuser;
  properties = [];
  propertiesArr = [];
  filteredpropertiesArr = [];

  //var rulenum = 0;
  //for (var r = rulenum; r < rulenum + 1; r++) {
  for (var r = 0; r < rules.length; r++) {
    //  console.log(rules[r].match + " " + r);
    //  console.log(rules[r].permissions);
    fpathlist = [];

    fileslist = [];
    //  console.log(rules[r]);
    var fpath = rules[r].match.replace(".", "resources");
    filepath = fpath.split("/");
    fpathlist.length = filepath.length;
    fpathlist[0] = "resources";
    traverseFilepath(rules[r], resources, personnel, filepath);
    // console.log(fpathlist);
  }

  //console.log(properties);
  properties = initialFilterProperties(properties, personnel);
  //console.log(properties);
  for (var i = 0; i < properties.length; i++) {
    properties[i].fpath = stringOperations(properties[i].fpath);
    properties[i].role = mergeRulelist(properties[i].rulelist);
  }
  // console.log(properties);

  //console.log(userStructCD);
  for (var u = 0; u < userStructCD.length; u++) {
    personnel[0].children.push({
      name: userStructCD[u].name,
      type: "object",
      size: 30,
    });
  }
  //console.log(personnel);
}

function mergeRulelist(rulelist) {
  var roles = [];
  for (var r = 0; r < rulelist.length; r++) {
    if (rulelist[r].status == "active")
      if (!roles.includes(stringOperations(rulelist[r].role)))
        roles.push(stringOperations(rulelist[r].role));
  }
  return roles.join("+");
}

function traverseFilepath(rules, resources, personnel, filepath) {
  //console.log("travfp");
  fileslist = [];

  if (filepath.length == 1) {
    flist = [];

    fileslist = traverseRootFilepath(resources, flist);
    //console.log(fileslist);
    pushProperties_fpath(rules, fileslist, personnel);
  } else {
    for (var f = 0; f < filepath.length; f++) {
      for (var r = 0; r < resources.length; r++) {
        if (filepath[f] == resources[r].name || filepath[f] == "*") {
          if (filepath[f] != "*") fpathlist[f] = filepath[f];

          if (f == filepath.length - 1) {
            fpathlist[f - 1] = resources[r].parent;
            fpathlist[f] = resources[r].name;

            fileslist = [];
            fileslist.push({
              name: resources[r].name,
              type: resources[r].type,
              object_parent: resources[r].parent,
              fpath: resources[r].fpath,
            });

            pushProperties(rules, fileslist, personnel, fpathlist);
            var fileslistarr = traverseRootFilepath(resources[r]);

            pushProperties(rules, fileslistarr, personnel, fpathlist);
            return;
          } else if (f < filepath.length - 1) {
            if (filepath[f] == resources[r].name) {
              fpathlist[f] == resources[r].name;
              traverseFilepath(
                rules,
                resources[r].children,
                personnel,
                filepath
              );
            } else if (filepath[f] == "*") {
              if (
                filepath[f - 1] != "*" &&
                filepath[f - 1] == resources[r].parent
              ) {
                for (var i = 0; i < resources[r].children.length; i++) {
                  fpathlist[f] = resources[r].name;
                  traverseFilepath(
                    rules,
                    resources[r].children[i],
                    personnel,
                    filepath
                  );
                  if (filepath[f + 1] == "*") {
                    traverseFilepath(
                      rules,
                      resources[r].children[i].children,
                      personnel,
                      filepath
                    );
                  }

                  if (filepath[f + 1] == "[name]") {
                    if (resources[r].parent == filepath[f - 1]) {
                      // console.log(fpathlist);
                      traverseUserIDFilePath(
                        rules,
                        personnel,
                        resources[r].children,
                        fpathlist
                      );
                    }
                    // ++f;
                  }
                }
              }
            }

            if (filepath[f + 1] == "[name]" && filepath[f] != "*") {
              if (resources[r].parent == filepath[f - 1]) {
                traverseUserIDFilePath(
                  rules,
                  personnel,
                  resources[r].children,
                  fpathlist
                );
              }
              ++f;
            }
          }
        }
      }
    }
  }
}

function traverseRootFilepath(resources, flist, flag) {
  //console.log("travrootfp");
  if (resources.length > 0) {
    if (!flist.includes(resources[0].parent)) {
      flist.push(resources[0].parent);
    }

    for (var r = 0; r < resources.length; r++) {
      if (!flist.includes(resources[r].name));
      {
        if (resources[r].parent != flist[flist.length - 1]) {
          flist.pop();
        }

        flist.push(resources[r].name);

        fileslist.push({
          name: resources[r].name,
          type: resources[r].type,
          object_parent: resources[r].parent,
          fpath: resources[r].fpath,
        });

        if (flag != undefined) {
          resources[r].fpath = flist.join("-");
        }
      }

      if (resources[r].children.length > 0)
        traverseRootFilepath(resources[r].children, flist, flag);
      else {
        flist.pop();
      }
    }

    flist.pop();
  } else if (typeof resources == "object") {
    fileslist.push({
      name: resources.name,
      type: resources.type,
      object_parent: resources.parent,
      fpath: resources.fpath,
    });
    if (resources.children.length > 0)
      for (var r = 0; r < resources.children.length; r++) {
        fileslist.push({
          name: resources.children[r].name,
          type: resources.children[r].type,
          object_parent: resources.children[r].parent,
          fpath: resources.children[r].fpath,
        });

        traverseRootFilepath(resources.children[r], flist, flag);
      }
  }

  flist = [];

  if (flag != undefined) {
    //console.log(resources);
    return resources;
  } else {
    //console.log(fileslist);
    return fileslist;
  }
}

function traverseRootFilepathwithSubject(resources, subject) {
  //console.log(resources.fpath);
  //console.log("travrootfpathwithsub");
  fileslist.push({
    name: resources.name,
    type: resources.type,
    subject: subject,
    role: "userid_" + subject,
    object_parent: resources.parent,
    fpath: resources.fpath,
  });
  for (var r = 0; r < resources.children.length; r++) {
    //console.log("r" + resources.children[r].fpath);
    fileslist.push({
      name: resources.children[r].name,
      type: resources.children[r].type,
      subject: subject,
      role: "userid_" + subject,
      object_parent: resources.children[r].parent,
      fpath: resources.children[r].fpath,
    });
    traverseRootFilepathwithSubject(resources.children[r], subject);
  }

  return fileslist;
}

function traverseUserIDFilePath(rules, personnel, resources, fpathlist) {
  fileslist = [];
  //console.log("travuidfpath");
  var userIDList = listofUserName(personnel);
  for (var r = 0; r < resources.length; r++) {
    if (userIDList.includes(resources[r].name)) {
      fileslist = traverseRootFilepathwithSubject(
        resources[r],
        resources[r].name
      );
    }
  }
  pushPropertieswithSubject(rules, fileslist, fpathlist);
}

function listofUserName(personnel) {
  var userIDList = [];
  for (var p = 0; p < personnel[0].children.length; p++) {
    for (var pp = 0; pp < personnel[0].children[p].children.length; pp++) {
      if (!userIDList.includes(personnel[0].children[p].children[pp].name))
        userIDList.push(personnel[0].children[p].children[pp].name);
    }
  }
  return userIDList;
}

function listofRoles(personnel) {
  var roleList = [];
  for (var p = 0; p < personnel[0].children.length; p++) {
    roleList.push(personnel[0].children[p].name);
  }
  return roleList;
}

function pushPropertieswithSubject(rules, fileslist, fpathlist) {
  var perms_read = ["get", "list"];
  var perms_write = ["create", "update", "delete"];
  //console.log("ppwithsub");

  for (var p = 0; p < Object.keys(rules.permissions).length; p++) {
    if (Object.keys(rules.permissions)[p] == "read") {
      for (var pr = 0; pr < perms_read.length; pr++)
        for (let f = 0; f < fileslist.length; f++) {
          properties.push({
            permissionBoolean: Object.values(rules.permissions)[p].permission,
            permissionType: perms_read[pr],
            subject: stringOperations(fileslist[f].subject),
            object: stringOperations(fileslist[f].name),
            object_parent: stringOperations(fileslist[f].object_parent),
            ruleID: rules.id,
            role: fileslist[f].role,
            fpath: fileslist[f].fpath,
            //fpath:fpathlist.join("-")
          });
        }
    } else if (Object.keys(rules.permissions)[p] == "write") {
      for (var pr = 0; pr < perms_write.length; pr++)
        for (let f = 0; f < fileslist.length; f++) {
          properties.push({
            permissionBoolean: Object.values(rules.permissions)[p].permission,
            permissionType: perms_write[pr],
            subject: stringOperations(fileslist[f].subject),
            object: stringOperations(fileslist[f].name),
            object_parent: stringOperations(fileslist[f].object_parent),
            ruleID: rules.id,
            role: fileslist[f].role,
            fpath: fileslist[f].fpath,
            //fpath:fpathlist.join("-")
          });
        }
    } else
      for (let f = 0; f < fileslist.length; f++) {
        properties.push({
          permissionBoolean: Object.values(rules.permissions)[p].permission,
          permissionType: Object.keys(rules.permissions)[p],
          subject: stringOperations(fileslist[f].subject),
          object: stringOperations(fileslist[f].name),
          object_parent: stringOperations(fileslist[f].object_parent),
          ruleID: rules.id,
          role: fileslist[f].role,
          fpath: fileslist[f].fpath,
          //fpath:fpathlist.join("-")
        });
      }
  }
}

function pushProperties_fpath(rules, resources, personnel) {
  var userlist = [];
  var permissionslist = [];
  //console.log("ppfpath");

  /* console.log(rules);
  console.log(resources);
  console.log(personnel);
  console.log(userStructCD); */

  for (var p = 0; p < Object.keys(rules.permissions).length; p++) {
    userlist = [];
    //console.log(Object.keys(rules.permissions)[p]);

    /* if (rules.condition == "true") {
      var role = listofRoles(personnel);
      //   condition = Object.values(rules.permissions)[p].condition;
      userlist = traverseUserList(role, personnel[0].children);
      console.log(userlist);
    } */

    if (rules.condition == "true") {
      var role = listofRoles(personnel);

      for (let u = 0; u < userStructCD.length; u++) {
        userlist.push({
          username: userStructCD[u].name.toLowerCase(),
          role: "userid" + userStructCD[u].name.toLowerCase(),
        });
      }
      //console.log(userlist);
      //console.log(properties);
    } else if (rules.condition.includes("role")) {
      var role = rules.condition.split(" ");
      userlist = traverseUserList(role[0], personnel[0].children);
    }

    if (Object.keys(rules.permissions)[p] == "read") {
      permissionslist = ["get", "list"];
      for (var i = 0; i < permissionslist.length; i++) {
        for (let u = 0; u < userlist.length; u++) {
          for (var r = 0; r < resources.length; r++) {
            properties.push({
              permissionBoolean: Object.values(rules.permissions)[p].permission,
              permissionType: permissionslist[i],
              subject: stringOperations(userlist[u].username),
              object: stringOperations(resources[r].name),
              object_parent: stringOperations(resources[r].object_parent),
              ruleID: rules.id,
              role: userlist[u].role,
              fpath: resources[r].fpath,
            });
          }
        }
      }
    } else if (Object.keys(rules.permissions)[p] == "write") {
      permissionslist = ["create", "update", "delete"];

      for (var i = 0; i < permissionslist.length; i++) {
        for (let u = 0; u < userlist.length; u++) {
          for (var r = 0; r < resources.length; r++) {
            properties.push({
              permissionBoolean: Object.values(rules.permissions)[p].permission,
              permissionType: permissionslist[i],
              subject: stringOperations(userlist[u].username),
              object: stringOperations(resources[r].name),
              object_parent: stringOperations(resources[r].object_parent),
              ruleID: rules.id,
              role: userlist[u].role,
              fpath: resources[r].fpath,
            });
          }
        }
      }
    } else {
      for (let u = 0; u < userlist.length; u++) {
        for (var r = 0; r < resources.length; r++) {
          //console.log("pushing" + userlist.length + " " + resources.length);
          properties.push({
            permissionBoolean: Object.values(rules.permissions)[p].permission,
            permissionType: Object.keys(rules.permissions)[p],
            subject: stringOperations(userlist[u].username),
            object: stringOperations(resources[r].name),
            object_parent: stringOperations(resources[r].object_parent),
            ruleID: rules.id,
            role: userlist[u].role,
            fpath: resources[r].fpath,
          });
        }
      }
    }
  }
}

function pushProperties(rules, resources, personnel, fpathlist) {
  var userlist = [];
  var permissionslist = [];
  //console.log("pp");

  for (var p = 0; p < Object.keys(rules.permissions).length; p++) {
    if (rules.condition == "true") {
      var role = listofRoles(personnel);
      userlist = traverseUserList(role, personnel[0].children);
    } else if (rules.condition.includes("role")) {
      var role = rules.condition.split(" ");
      userlist = traverseUserList(role[0], personnel[0].children);
    }

    if (Object.keys(rules.permissions)[p] == "read") {
      permissionslist = ["get", "list"];
      for (var i = 0; i < permissionslist.length; i++) {
        for (let u = 0; u < userlist.length; u++) {
          for (var r = 0; r < resources.length; r++) {
            properties.push({
              permissionBoolean: Object.values(rules.permissions)[p].permission,
              permissionType: permissionslist[i],
              subject: stringOperations(userlist[u].username),
              object: stringOperations(resources[r].name),
              object_parent: stringOperations(resources[r].object_parent),
              ruleID: rules.id,
              role: userlist[u].role,
              fpath: resources[r].fpath,
              //fpath:fpathlist.join("-")
            });
          }
        }
      }
    } else if (Object.keys(rules.permissions)[p] == "write") {
      permissionslist = ["create", "update", "delete"];

      for (var i = 0; i < permissionslist.length; i++) {
        for (let u = 0; u < userlist.length; u++) {
          for (var r = 0; r < resources.length; r++) {
            properties.push({
              permissionBoolean: Object.values(rules.permissions)[p].permission,
              permissionType: permissionslist[i],
              subject: stringOperations(userlist[u].username),
              object: stringOperations(resources[r].name),
              object_parent: stringOperations(resources[r].object_parent),
              ruleID: rules.id,
              role: userlist[u].role,
              fpath: resources[r].fpath,
              //fpath:fpathlist.join("-")
            });
          }
        }
      }
    } else {
      for (let u = 0; u < userlist.length; u++) {
        for (var r = 0; r < resources.length; r++) {
          properties.push({
            permissionBoolean: Object.values(rules.permissions)[p].permission,
            permissionType: Object.keys(rules.permissions)[p],
            subject: stringOperations(userlist[u].username),
            object: stringOperations(resources[r].name),
            object_parent: stringOperations(resources[r].object_parent),
            ruleID: rules.id,
            role: userlist[u].role,
            fpath: resources[r].fpath,
            //fpath:fpathlist.join("-")
          });
        }
      }
    }
  }
}

function traverseUserList(role, personnel) {
  //console.log("travul");
  var users = [];

  if (typeof role == "string") {
    for (var p = 0; p < personnel.length; p++) {
      if (personnel[p].name === role) {
        for (var pp = 0; pp < personnel[p].children.length; pp++) {
          users.push({ username: personnel[p].children[pp].name, role: role });
        }
      }
    }
  } else {
    for (var r = 0; r < role.length; r++) {
      for (var p = 0; p < personnel.length; p++) {
        if (personnel[p].name === role[r]) {
          for (var pp = 0; pp < personnel[p].children.length; pp++) {
            users.push({
              username: personnel[p].children[pp].name,
              role: role[r],
            }); //check here for role update
          }
        }
      }
    }
  }
  return users;
}

function delete_duplicates(properties) {
  var dup_props = JSON.parse(JSON.stringify(properties));

  for (var p = 0; p < properties.length; p++) {
    //console.log(properties[p]);

    for (var dp = dup_props.length - 1; dp > 0; dp--) {
      if (
        properties[p].fpath == dup_props[dp].fpath &&
        properties[p].permissionBoolean == dup_props[dp].permissionBoolean &&
        properties[p].permissionType == dup_props[dp].permissionType &&
        properties[p].role == dup_props[dp].role &&
        properties[p].ruleID == dup_props[dp].ruleID &&
        properties[p].subject == dup_props[dp].subject
      )
        dup_props.slice(dp, 1);
    }
  }
  console.log(dup_props);
}
function initialFilterProperties(properties, personnel) {
  propertiesArr = JSON.parse(JSON.stringify(properties));

  //delete_duplicates(properties);

  //console.log("start initial filter props");
  //console.log(properties);

  filteredpropertiesArr = [];

  for (var i = 0; i < propertiesArr.length; i++) {
    if (propertiesArr[i].fpath.includes(".-")) {
      propertiesArr[i].object_parent = "resources";
      propertiesArr[i].fpath = propertiesArr[i].fpath.replace(
        ".-",
        "resources-"
      );
    }

    //console.log(i);

    var result = filteredpropertiesArr.filter(function (element) {
      if (
        element.subject == propertiesArr[i].subject &&
        element.fpath == propertiesArr[i].fpath
      ) {
        var flag = 0; //flag to keep track of when the new rule should be added
        //if flag is 1, add the new rule element

        for (var j = 0; j < element.rulelist.length; j++) {
          if (element.rulelist[j].ruleID == propertiesArr[i].ruleID) {
            if (
              element.rulelist[j].permissionType !=
              propertiesArr[i].permissionType
            ) {
              if (flag != 2) flag = 1; //if you have not enountered a duplicate rule before, then write the rule
            } else flag = 2; //if ruleIDs are same and permission types are same , then its a duplicate rule so dont add it
          } else {
            //if ruleIDs are same then add the rule
            if (
              element.rulelist[j].permissionType ==
              propertiesArr[i].permissionType
            )
              element.rulelist[j].status = "inactive"; //make all previous rules "inactive"
            flag = 1; //and then add the new rule
          }
        }
        if (flag == 1)
          element.rulelist.push({
            ruleID: propertiesArr[i].ruleID,
            permissionType: propertiesArr[i].permissionType,
            permissionBoolean: propertiesArr[i].permissionBoolean,
            role: propertiesArr[i].role,
            status: "active",
          });
        return element;
      }
    });

    //if no array object was created for this object and subject, create a new array object
    if (result.length == 0) {
      //console.log(result);
      filteredpropertiesArr.push({
        subject: propertiesArr[i].subject,
        //permissionType: propertiesArr[i].permissionType,
        // permissionBoolean: propertiesArr[i].permissionBoolean,
        role: "",
        object: propertiesArr[i].object,
        object_parent: propertiesArr[i].object_parent,
        fpath: propertiesArr[i].fpath,
        //ruleID: propertiesArr[i].ruleID,
        rulelist: [
          {
            ruleID: propertiesArr[i].ruleID,
            permissionType: propertiesArr[i].permissionType,
            permissionBoolean: propertiesArr[i].permissionBoolean,
            role: propertiesArr[i].role,
            status: "active",
          },
        ],
      });
    }
  }

  //console.log(filteredpropertiesArr);
  //filteredpropertiesArr = fixFilePath(filteredpropertiesArr);

  //console.log("end initial filter props");
  return filteredpropertiesArr;
}

function stringOperations(str) {
  //console.log(str);
  str = str
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(".", "")
    .replaceAll("_", "");
  return str;
}

//END OF FILE AND RULE OPERATIONS

var personnelTranslateCoordx = 320;
var personnelTranslateCoordy = 350;
var resourcesTranslateCoordx = 2400;
var resourcesTranslateCoordy = 80;

var margin = { top: 100, right: 20, bottom: 30, left: 100 },
  width = 2000 - margin.left - margin.right,
  height = 1500 - margin.top - margin.bottom;

var objradius = 10;
var selectedelement_strokewidth = 8;
var arrowcircle_strokewidth = 4;

const d3Height = 1900;
const d3Width = 4200;

var filtered_properties = [];

export default function ConceptDiagram() {
  const ref = useD3(
    (svg) => {
      //START OF PERSONNEL SVG
      var root = "";
      var resources_root = "";
      var roles_arr = [];
      var users_arr = [];
      var resources_arr = [];

      for (var u = 0; u < userStructCD.length; u++) {
        for (var r = 0; r < userStructCD[u].roles.length; r++) {
          if (
            !roles_arr.includes(userStructCD[u].roles[r]) &&
            userStructCD[u].roles[r] != "userid"
          ) {
            roles_arr.push(userStructCD[u].roles[r]);
          }
        }
      }

      for (var u = 0; u < userStructCD.length; u++)
        users_arr.push(userStructCD[u].name);

      d3.select("#resourcesg")
        .selectAll("circle")
        .filter(function (d) {
          //console.log(d);
          if (d.data.name == ".") resources_arr.push("resources");
          else resources_arr.push(d.data.fpath.replaceAll("-", "/"));
          //else resources_arr.push(d.data.fpath);
        });

      /* console.log(roles_arr);
      console.log(users_arr);
      console.log(resources_arr);

      console.log("start of dropdown"); */

      var primaryDropdown_options = [];
      var secondaryDropdown_options = [];

      if (d3.select("#keyboard_tooltip").empty())
        var keyboard_tooltip = d3
          .select("#root")
          //.select("#svgdiv")
          .append("div")
          .attr("id", "keyboard_tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "3px")
          .style("border-radius", "15px")
          .style("width", "250px")
          .style("font-size", "15px")
          .style("left", 0)
          .style("top", 0)
          .style("padding", "5px");

      if (
        !d3.select(".highlighting-summary").empty() &&
        d3.select("#user").empty()
      ) {
        d3.select(".highlighting-summary")
          .append("h6")
          .text("Summary Panel")
          .style("text-decoration", "underline")
          .attr("font-weight", 700);

        /*
        d3.select(".highlighting-summary")
          .append("button")
          .classed("shortcut", true)
          .text("?")
          .on("mouseover", function (e) {
            var button_pos =
              document.getElementsByClassName("shortcut")[0].offsetLeft;

            var button_height = 33;
            console.log(button_pos);
            console.log(button_height);

            var text =
              "<b>To drill-down/up elements</b> </br>  <i class='fa fa-windows' aria-hidden='true'></i>:  <kbd class='keyboard'>Alt</kbd> key + <i class='fa-solid fa-computer-mouse'></i><kbd class='mouse'>left click </kbd> </br> <i class='fa fa-apple' aria-hidden='true'></i>: <kbd class='keyboard'>Option</kbd> key + <i class='fa-solid fa-computer-mouse'></i><kbd class='mouse'>left click </kbd></br></br> <b> To view the properties/permissions: </b> </br> <i class='fa fa-windows' aria-hidden='true'></i> <i class='fa fa-apple' aria-hidden='true'></i>: <i class='fa-solid fa-computer-mouse'></i><kbd class='mouse'>left click </kbd></br> ";
            d3.select("#keyboard_tooltip")
              .html(text)
              .style("font-size", "10px")
              .style("width", "250px")
              //.style("left", parseInt(button_pos - 100) + "px")
              //.style("top", parseInt(button_pos + button_height + 30) + "px")
              .style("left", e.pageX + "px")
              .style("top", e.pageY + "px")
              .style("opacity", 1);
          })
          .on("mouseout", function () {
            d3.select("#keyboard_tooltip")
              .style("opacity", 0)
              .style("width", "0px")
              //.style("height", "0px")
              .style("left", 0 + "px")
              .style("top", 0 + "px")
              .html("");
          });
          */

        d3.select(".highlighting-summary")
          //.append("div")
          //.classed("pdiv")
          //.style("display","flex")
          //.style("justify-content","space-between")
          .append("p")
          .attr("id", "user")
          .attr("logsource", "SummaryPanel")
          .text("personnel:");

        d3.select(".highlighting-summary")
          .append("input")
          .attr("logsource", "SummaryPanel")
          .attr("type", "checkbox")
          .attr("class", "form-check-input")
          .attr("id", "allperms");

        d3.select(".highlighting-summary")
          .append("label")
          .attr("class", "form-check-label")
          .attr("logsource", "SummaryPanel")
          .attr("for", "allperms")
          .style("font-size", "0.8em")
          .style("margin-left", "10px")
          .text("View all permissions of the selected user");

        d3.select(".highlighting-summary")
          //.select(".pdiv")
          .append("p")
          .attr("id", "file")
          .attr("logsource", "SummaryPanel")
          .style("margin-right", "200px")
          .text("file:");

        // d3.select(".highlighting-summary").append("</br>");
      }

      var primaryDropdown = d3
        .select("#root")
        .select(".highlighting-summary")
        .select("#primary-dropdown");

      if (primaryDropdown.empty())
        primaryDropdown = d3
          .select("#root")
          .select(".highlighting-summary")
          .append("select")
          .classed("selection bootstrap-select", true)
          .style("width", "150px")
          .attr("class", "primary-dropdown")
          .attr("logsource", "SummaryPanel")
          .attr("id", "primary-dropdown");

      for (var i = 0; i < userStructCD.length; i++) {
        primaryDropdown_options.push(userStructCD[i].name);
      }

      primaryDropdown_options.unshift("Select an option");

      var primaryoptions = primaryDropdown
        .selectAll("option")
        .data(primaryDropdown_options)
        .enter()
        .append("option")
        .attr("logselect", "option");

      primaryoptions
        .text(function (d) {
          return d;
        })
        .each(function (d) {
          if (d === "Select an option") {
            d3.select(this).property("disabled", true);
          }
        });

      var secondaryDropdownDiv = d3
        .select("#root")
        .select(".highlighting-summary");

      if (d3.select(".secondary-dropdown").empty()) {
        secondaryDropdownDiv
          .append("input")
          .attr("type", "search")
          //.attr("placeholder", "resources")
          .attr("list", "secondary-dropdown")
          .classed("secondary-dropdown", true);

        var secondaryDropdown = secondaryDropdownDiv
          .append("datalist")
          .attr("id", "secondary-dropdown");

        d3.select(".highlighting-summary")
          .append("button")
          .on("click", function (e) {
            d3.select(".secondary-dropdown").node().value = "";
          })
          .classed("btn btn-warning", true)
          .text("Clear")
          .attr("logsource", "SummaryPanel")
          .attr("id", "clearbutton");

        /* d3.select(".highlighting-summary")
          .append("span")
          .on("click", function (e) {
            d3.select(".secondary-dropdown").node().value = "";
          })
          .classed("fa-sharp fa-solid fa-xmark", true)
          .attr("id", "clearbutton"); */
      }

      //secondaryDropdown_options.push("None");
      //secondaryDropdown_options.push("Overview");

      if (d3.select("#togglediv").empty()) {
        var togglediv = d3
          .select(".highlighting-summary")
          .append("div")
          .classed("form-check form-switch row", true)
          .attr("id", "togglediv");

        togglediv
          .append("label")
          //.attr("for", "personnel-toggle")
          .text("Users");

        togglediv
          .append("input")
          .classed("form-check-input", true)
          .attr("type", "checkbox")
          .attr("name", "personnel-toggle")
          .attr("id", "personnel-toggle")
          .attr("logsource", "SummaryPanel")
          //.attr("value", "users")
          .attr("role", "switch");

        togglediv
          .append("label")
          //.attr("for", "personnel-toggle")
          .text("Roles");
      }

      var fs = [{ name: ".", children: fileStruct }];
      var packLayout = d3.pack().padding(15).size([1200, 1200]);
      var rootNode = d3.hierarchy(fs[0]);
      var resources_root = packLayout(rootNode);

      for (var i = 0; i < rootNode.descendants().length; i++) {
        if (rootNode.descendants()[i].data.name != ".")
          secondaryDropdown_options.push(
            rootNode.descendants()[i].data.fpath.replaceAll("-", "/")
          );
        //console.log(rootNode.descendants()[i].data.fpath);
      }

      if (d3.select("#secondary-dropdown").selectAll("option").empty()) {
        secondaryDropdown
          .selectAll("option")
          .data(secondaryDropdown_options)
          .enter()
          .append("option")
          .attr("value", function (d) {
            return d;
          })
          .text(function (d) {
            return d;
          });
      }

      if (d3.select(".intellibot").empty())
        d3.select(".highlighting-summary")
          .append("div")
          //.attr("style", "margin-top:20px")
          .classed("intellibot", true);

      /*  d3.select(".highlighting-summary")
        .selectAll("p")
        .each(function (di, d, i) {
          if (d3.select(this)._groups[0][0].outerText.includes("personnel:")) {
            d3.select(this).attr("id", "user");
          }

          if (d3.select(this)._groups[0][0].outerText.includes("file:")) {
            d3.select(this).attr("id", "file");
          }
        }); */

      d3.select("#allperms").on("change", function (d) {
        //console.log(d3.select("#user").text().includes("role"));
        if (
          d3.select("#allperms").property("checked") == true &&
          d3.select("#user").text().includes("Role")
        ) {
          if (d3.select(".alert-message").empty()) {
            d3.select("#root")
              .append("div")
              .attr(
                "class",
                "alert-message alert alert-warning alert-dismissible fade in"
              )
              .style("opacity", 1)
              .html(
                "<b>Warning!</b> You can't view all permissions associated with a role.  "
              );

            d3.select("#root")
              .select(".alert-message")
              .append("a")
              .attr("href", "#")
              .attr("class", "close")
              .attr("data-bs-dismiss", "alert")
              .attr("aria-label", "close")
              .html("&times;");
          } else d3.select(".alert-message").remove();

          document.getElementById("allperms").checked = false;
        } else if (
          d3.select("#allperms").property("checked") == true &&
          !d3.select("#filexmark").empty()
        ) {
          if (d3.select(".alert-message").empty()) {
            d3.select("#root")
              .append("div")
              .attr(
                "class",
                "alert-message alert alert-warning alert-dismissible fade in"
              )
              .style("opacity", 1)
              .html(
                "<b>Warning!</b> You can't view all permissions associated with a user while filtering by resources.  "
              );

            d3.select("#root")
              .select(".alert-message")
              .append("a")
              .attr("href", "#")
              .attr("class", "close")
              .attr("data-bs-dismiss", "alert")
              .attr("aria-label", "close")
              .html("&times;");
          } else d3.select(".alert-message").remove();

          document.getElementById("allperms").checked = false;
        } else if (
          d3.select("#allperms").property("checked") == true &&
          d3.select("#filexmark").empty()
        ) {
          if (!d3.select("#user").text().includes("role")) {
            console.log(properties);
            var unmerged_filtered_properties = [];
            var roles = [];
            var unmerged_prop = [];

            var propertiesArr = JSON.parse(JSON.stringify(properties));

            var filtered_properties = [];
            propertiesArr.filter(function (d) {
              if (
                d.subject ==
                d3.select(".selecteduserelement").attr("id").split("_")[1]
              ) {
                filtered_properties.push(d);
              }
            });

            console.log(filtered_properties);

            for (var i = 0; i < filtered_properties.length; i++) {
              //console.log(filtered_properties[i]);
              if (!filtered_properties[i].role.includes("+")) {
                //console.log("+");
                unmerged_filtered_properties.push(filtered_properties[i]);
                if (!roles.includes(filtered_properties[i].role))
                  roles.push(filtered_properties[i].role);
              } else {
                var lor = filtered_properties[i].role.split("+");

                for (var r = 0; r < lor.length; r++) {
                  if (!roles.includes(lor[r])) roles.push(lor[r]);
                }
                unmerged_prop = unmergeRulelist(filtered_properties[i]);
                //console.log(unmerged_prop);
                for (var up = 0; up < unmerged_prop.length; up++)
                  unmerged_filtered_properties.push(
                    JSON.parse(JSON.stringify(unmerged_prop[up]))
                  );
              }
            }
            console.log(roles);
            var text = "personnel: (";
            for (var r = 0; r < roles.length; r++) {
              if (r == 0) text = text + "UserID";
              else text = text + capitalCase(roles[r]);
              if (r != roles.length - 1) text = text + ",";
              else text = text + ") ";
            }
            text = text + capitalCase(roles[0].replace("userid", "") + " ");

            d3.select("#user").text(text);
            d3.select("#user")
              .insert("span")
              .classed("fa-sharp fa-solid fa-xmark", true)
              .attr("id", "userxmark")
              .on("click", function (d) {
                d3.select(this.parentNode).text("personnel: ");

                d3.selectAll(".ties").remove();

                //console.log(d3.selectAll(".tiescircle"));

                /* d3.selectAll(".tiescircle")
                          .style("stroke", "black")
                          .style("stroke-width", "2")
                          .style("opacity", 0.1)
                          .classed("tiescircle", false); */

                d3.select("#root")
                  .select("#treesvg")
                  .selectAll(".selecteduserelement")
                  .style("stroke", "black")
                  .style("stroke-width", "2")
                  .classed("selecteduserelement", false);

                d3.select(".propertyarrow").remove();

                if (d3.select("#filexmark").empty()) {
                  initial_drawArrows();
                } else filterProperties(properties);
              });

            var aggregate_props = aggregateProperties(
              unmerged_filtered_properties
            );
            drawArrows(aggregate_props, properties);
          }
        } else if (
          d3.select("#allperms").property("checked") == false &&
          d3.select("#filexmark").empty()
        ) {
          var element = d3.select(".selecteduserelement").attr("id");
          d3.select("#user").text(
            "personnel: (" +
              capitalCase(element.split("_")[0]) +
              ") " +
              capitalCase(element.split("_")[1]) +
              " "
          );
          d3.select("#user")
            .insert("span")
            .classed("fa-sharp fa-solid fa-xmark", true)
            .attr("id", "userxmark")
            .on("click", function (d) {
              d3.select(this.parentNode).text("personnel: ");

              d3.selectAll(".ties").remove();

              //console.log(d3.selectAll(".tiescircle"));

              /* d3.selectAll(".tiescircle")
                          .style("stroke", "black")
                          .style("stroke-width", "2")
                          .style("opacity", 0.1)
                          .classed("tiescircle", false); */

              d3.select("#root")
                .select("#treesvg")
                .selectAll(".selecteduserelement")
                .style("stroke", "black")
                .style("stroke-width", "2")
                .classed("selecteduserelement", false);

              d3.select(".propertyarrow").remove();

              if (d3.select("#filexmark").empty()) {
                initial_drawArrows();
              } else filterProperties(properties);
            });
          filterProperties(properties);
        } else filterProperties(properties);
      });

      d3.select("#personnel-toggle").on("change", function (d) {
        //d3.select("#personnel-toggle").property("checked");
        //console.log("toggle changed");

        var flag_checked = "";
        if (this.checked == true) {
          document.getElementById("allperms").checked = false;
          //document.getElementById("allperms").disabled = true;
          flag_checked = "roles";
        } else {
          document.getElementById("allperms").disabled = false;
          flag_checked = "users";
        }

        console.log(flag_checked);
        d3.select("#primary-dropdown").selectAll("option").remove();

        primaryDropdown_options = [];

        //console.log(userStructCD);

        var uniqueRoles = [];
        for (var u = 0; u < userStructCD.length; u++) {
          for (var r = 0; r < userStructCD[u].roles.length; r++) {
            if (
              !uniqueRoles.includes(userStructCD[u].roles[r]) &&
              userStructCD[u].roles[r] != "userid"
            ) {
              uniqueRoles.push(userStructCD[u].roles[r]);
            }
          }
        }

        primaryDropdown_options.sort(d3.ascending);

        //secondaryDropdown_options.unshift("Overview");
        //secondaryDropdown_options.unshift("None");

        uniqueRoles.sort();

        // console.log(uniqueRoles);

        if (flag_checked == "users")
          for (var u = 0; u < userStructCD.length; u++)
            primaryDropdown_options.push(userStructCD[u].name);
        else
          for (var u = 0; u < uniqueRoles.length; u++)
            primaryDropdown_options.push(uniqueRoles[u]);

        console.log(primaryDropdown_options);

        primaryDropdown_options.unshift("Select an option");

        d3.select("#primary-dropdown")
          .selectAll("option")
          .data(primaryDropdown_options)
          .enter()
          .append("option")
          .text(function (d) {
            return d;
          })
          .each(function (d) {
            if (d === "Select an option") {
              d3.select(this).property("disabled", true);
            }
          });
      });

      //secondary dropdown
      d3.select(".secondary-dropdown").on("change", function (d) {
        if (
          d3.select("#allperms").property("checked") == false ||
          document.getElementById("allperms").disabled == true
        )
          if (d3.select(".secondary-dropdown").node().value != "") {
            console.log("you clicked on resources");
            console.log(resources_arr);
            //d3.selectAll(".propertyarrow").remove();
            //d3.selectAll(".reversepropertyarrow").remove();
            //document.getElementById("allperms").disabled = true;

            d3.selectAll(".arrowcircle")
              .style("stroke-width", 2)
              .classed("arrowcircle", false);

            /*  d3.select("#root")
          .selectAll(".arrowcircletext")
          .classed("arrowcircletext", false)
          .style("opacity", 0)
          .text(""); */

            d3.select("#resources_tooltip")
              .style("opacity", "0")
              .style("left", 0)
              .style("top", 0)
              .html("");

            d3.select("#resourcesg").selectAll("circle").style("opacity", 0.1);
            d3.select("#resourcesg").selectAll("text").style("opacity", 0.1);

            d3.select("#root")
              .select("#resourcesg")
              .selectAll("text")
              .style("opacity", 0);

            d3.select("#root")
              .select("#resourcesg")
              .select("#resources")
              .style("opacity", 1);

            /*  if (
              resources_arr.includes(
                d3.select(".secondary-dropdown").node().value
              )
            ) { */
            console.log("res click");
            d3.select("#root")
              .selectAll(".selectedresourceelement")
              .classed("selectedresourceelement", false)
              .style("stroke", "black")
              .style("stroke-width", "2");

            d3.select("#root")
              .select("#resourcesg")
              .selectAll("circle")
              .filter(function (d) {
                if (
                  this.getAttribute("id").includes(
                    stringOperations(
                      d3
                        .select(".secondary-dropdown")
                        .node()
                        .value.replaceAll("/", "-")
                    )
                  )
                ) {
                  if (
                    this.getAttribute("id") ==
                    stringOperations(
                      d3
                        .select(".secondary-dropdown")
                        .node()
                        .value.replaceAll("/", "-")
                    )
                  ) {
                    d3.select(this)
                      .classed("selectedresourceelement", true)
                      .style("stroke", "orange")
                      .style("stroke-width", selectedelement_strokewidth)
                      .style("opacity", 1);
                  }

                  // console.log("MATCH");
                  d3.select(this).style("opacity", 1);
                  if (d.depth <= 2)
                    document.getElementById(
                      this.getAttribute("id")
                    ).previousSibling.style.opacity = 1;

                  //filterProperties(properties);
                }

                d3.select(".highlighting-summary")
                  .selectAll("p")
                  .each(function (di) {
                    if (
                      d3.select(this)._groups[0][0].outerText.includes("file:")
                    ) {
                      d3.select(this).text(
                        "file: " +
                          d3.select(".secondary-dropdown").node().value +
                          " "
                      );

                      d3.select(this)
                        .insert("span")
                        .classed("fa-sharp fa-solid fa-xmark", true)
                        .attr("id", "filexmark")
                        .on("click", function (d) {
                          d3.select(this.parentNode).text("file: ");

                          var element = d3
                            .select("#root")
                            .select("#treesvg")
                            .selectAll(".selectedresourceelement")
                            .style("stroke", "black")
                            .style("stroke-width", "2")
                            .classed("selectedresourceelement", false);

                          d3.selectAll(".reversepropertyarrow").remove();

                          if (d3.select("#userxmark").empty()) {
                            initial_drawArrows();
                          } else filterProperties(properties);
                        });
                    }
                  });
              });
            filterProperties(properties);
            //}
          }
      });

      //primary Dropdown
      d3.select("#primary-dropdown").on("change", function (d) {
        if (d3.select("#primary-dropdown").node().value != "") {
          console.log("primary dropdown");
          var flag_role = 0;

          //document.getElementById("allperms").disabled = false;
          //d3.selectAll(".tiescircle").classed("tiescircle", false);
          ///////
          d3.selectAll(".tiescircle").filter(function (d) {
            d3.select(this.nextSibling).style("opacity", 0.1);

            var element_id = d3.select(this).attr("id");

            if (!element_id.includes("userid")) {
              d3.select("#users_" + element_id.split("_")[0]).style(
                "opacity",
                1
              );

              document.getElementById(
                "users_" + element_id.split("_")[0]
              ).nextSibling.style.opacity = 0.1;
            }

            return this.nextSibling;
          });

          ///////

          d3.select("#personnel_tooltip")
            .style("opacity", "0")
            .style("left", 0)
            .style("top", 0)
            .attr("logsource", "Circles")
            .attr("logtype", "UsersSelect")
            .html("");
          d3.select("#personnel_tooltip").html("");

          if (
            users_arr.includes(d3.select("#primary-dropdown").node().value) ||
            roles_arr.includes(d3.select("#primary-dropdown").node().value)
          ) {
            removeTies();

            d3.select("#root")
              .selectAll(".selecteduserelement")
              .classed("selecteduserelement", false)
              .style("stroke", "black")
              .style("stroke-width", "2");

            d3.select("#root")
              .select("#personnel")
              .selectAll("circle")
              .filter(function (d) {
                if (
                  this.getAttribute("id").includes(
                    stringOperations(
                      d3.select("#primary-dropdown").node().value
                    )
                  )
                ) {
                  /* console.log(this.getAttribute("id"));
                    console.log(roles_arr);
                    console.log(users_arr); 
                    
                    if (
                      roles_arr.includes(
                        d3.select(".secondary-dropdown").node().value
                      )
                    )

                    */

                  var index = findIndex(
                    roles_arr,
                    d3.select("#primary-dropdown").node().value
                  );

                  console.log("INDEX" + index);

                  if (index >= 0) {
                    if (this.getAttribute("id").includes("users_")) {
                      if (
                        this.getAttribute("id").split("_")[1] ==
                        stringOperations(
                          d3.select("#primary-dropdown").node().value
                        )
                      ) {
                        console.log(this.getAttribute("id"));
                        flag_role = 1;
                        d3.select(this)
                          .classed("selecteduserelement", true)
                          .style("stroke", "orange")
                          .style("stroke-width", selectedelement_strokewidth)
                          .style("opacity", 1);

                        d3.select(this.parentNode)
                          .selectAll("text")
                          .style("opacity", 1);
                      }
                    } else if (
                      this.getAttribute("id").split("_")[0] ==
                      stringOperations(
                        d3.select("#primary-dropdown").node().value
                      )
                    ) {
                      //console.log(this.getAttribute("id"));
                      d3.select(this).style("opacity", 1);

                      d3.select(this.parentNode)
                        .selectAll("text")
                        .style("opacity", 1);
                    }
                  } else if (
                    users_arr.includes(
                      d3.select("#primary-dropdown").node().value
                    ) &&
                    !this.getAttribute("id").includes("users_")
                  ) {
                    //console.log("users");
                    d3.select(this)
                      //.classed("selecteduserelement", true)
                      //.style("stroke", "orange")
                      //.style("stroke-width", selectedelement_strokewidth)
                      .style("opacity", 1);

                    d3.select(this.parentNode)
                      .selectAll("text")
                      .style("opacity", 1);
                  }

                  if (this.getAttribute("id").includes("userid")) {
                    //console.log(this.getAttribute("id"));
                    d3.select(this)
                      .classed("selecteduserelement", true)
                      .classed("tiescircle", true)
                      .style("stroke", "orange")
                      .style("stroke-width", selectedelement_strokewidth)
                      .style("opacity", 1);

                    d3.select(this.parentNode)
                      .selectAll("text")
                      .style("opacity", 1);
                    addTies(d3.select("#" + this.getAttribute("id")));

                    for (var u = 0; u < userStructCD.length; u++) {
                      if (
                        stringOperations(userStructCD[u].name) ==
                        this.getAttribute("id").split("_")[1]
                      )
                        for (var r = 0; r < userStructCD[u].roles.length; r++) {
                          if (userStructCD[u].roles[r] != "userid") {
                            var id =
                              "users_" +
                              stringOperations(userStructCD[u].roles[r]);

                            //console.log(id);

                            d3.select("#" + id).style("opacity", 1);

                            var node = document.getElementById(id).nextSibling;

                            node.style.opacity = 1;

                            //console.log(node);
                          }
                        }
                    }

                    // console.log(d);
                  }

                  //filterProperties(properties);
                }
              });

            console.log(d3.select("#primary-dropdown").node().value);

            d3.select(".highlighting-summary")
              .selectAll("p")
              .each(function (di) {
                if (
                  d3.select(this)._groups[0][0].outerText.includes("personnel:")
                ) {
                  if (flag_role == 1)
                    d3.select(this).text(
                      "personnel: (Role) " +
                        d3.select("#primary-dropdown").node().value +
                        " "
                    );
                  else {
                    d3.select(this).text(
                      "personnel: (UserID) " +
                        d3.select("#primary-dropdown").node().value +
                        " "
                    );
                    document.getElementById("allperms").checked = false;
                  }

                  d3.select(this)
                    .insert("span")
                    .classed("fa-sharp fa-solid fa-xmark", true)
                    .attr("id", "userxmark")
                    .on("click", function (d) {
                      d3.select(this.parentNode).text("personnel: ");

                      d3.selectAll(".ties").remove();

                      //console.log(d3.selectAll(".tiescircle"));

                      /* d3.selectAll(".tiescircle")
                          .style("stroke", "black")
                          .style("stroke-width", "2")
                          .style("opacity", 0.1)
                          .classed("tiescircle", false); */

                      d3.select("#root")
                        .select("#treesvg")
                        .selectAll(".selecteduserelement")
                        .style("stroke", "black")
                        .style("stroke-width", "2")
                        .classed("selecteduserelement", false);

                      d3.select(".propertyarrow").remove();

                      if (d3.select("#filexmark").empty()) {
                        initial_drawArrows();
                      } else filterProperties(properties);
                    });
                }
              });
            filterProperties(properties);
          }
        }
      }); // end of dropdown

      function findIndex(arr, value) {
        var index = -1;

        for (var a = 0; a < arr.length; a++) {
          //console.log(arr[a]);
          if (stringOperations(arr[a]) == stringOperations(value)) {
            //console.log(arr[a]);
            //console.log(value);
            index = a;
          }
        }
        return index;
      }

      function treelistpersonnel(personnel, properties) {
        //console.log("treelist personnel");
        /*  console.log(personnel[0]);
                 console.log(properties); */

        //if (d3.select("#file").node().nextSibling.outerText.includes("rule"))
        //d3.select("#file").node().nextSibling.remove();

        d3.select("#root").select("#treesvg").select("#personnel").remove();

        //Create SVG element
        var svg = d3
          .select("#treesvg")
          .style("background-color", "white")
          .style("cursor", "pointer")
          // .attr("overflow", "auto")
          .append("g")
          .attr("id", "personnel")
          .attr("logsource", "userscircle")
          .attr(
            "transform",
            "translate(" +
              personnelTranslateCoordx +
              "," +
              personnelTranslateCoordy +
              ")"
          );

        if (d3.select("#root").select("#personnel_tooltip").empty())
          d3.select("#root")
            //.select("#svgdiv")
            .append("div")
            .attr("id", "personnel_tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("left", 0)
            .style("top", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "3px")
            .style("border-radius", "15px")
            .style("width", "200px")
            .style("font-size", "15px")
            .style("padding", "5px");

        if (d3.select("#root").select("#personnel_tooltip_title").empty())
          d3.select("#root")
            //.select("#svgdiv")
            .append("div")
            .attr("id", "personnel_tooltip_title")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("left", 0)
            .style("top", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "5px")
            .style("border-radius", "15px")
            .style("padding", "5px");

        var diameter = Math.min(width * 0.9, height * 0.9);

        var colorCircle = d3
          .scaleOrdinal()
          .domain(["create", "read", "update", "delete", "noaccess"])
          .range(["#EDFBD2", "#E3F9BC", "#DAF7A6", "#BFE37F", "#F7A6B2"]);

        //var sizeScale = d3.scaleSqrt().range([25, 35]);
        var sizeScale = d3.scaleLinear().range([40, 30]);

        var packLayout = d3
          .pack()
          .padding(27)
          .size([1200, 1200])
          .radius(function (d) {
            // console.log(sizeScale(d.value));
            //console.log(d);
            return sizeScale(d.value);
          });

        //console.log(personnel);

        var rootNode = d3.hierarchy(personnel[0]);

        rootNode.sum(function (d) {
          // if (d.children) return d.children.length;
          //else
          return 1;
        });

        /* rootNode.count()
        .sort(function(a, b) { return b.height - a.height }); */

        const root = packLayout(rootNode);

        var focus = root;

        //  console.log(rootNode.descendants());

        var nodes = d3
          .select("#personnel")
          .selectAll("g")
          .data(rootNode.descendants())
          .enter()
          .append("g")
          .attr("transform", function (d, i) {
            //  console.log(i+" "+d.data.name);
            return "translate(" + 0 + "," + 0 + ")";
          });

        nodes
          .append("circle")
          .attr("id", function (d) {
            //console.log(d);
            if (d.parent == null) return stringOperations(d.data.name);
            //if (d.parent == null) return stringOperations("personnel");
            else if (d.parent.data.name == "users" && d.data.type == "object")
              return "userid_" + stringOperations(d.data.name);
            else
              return (
                stringOperations(d.parent.data.name) +
                "_" +
                stringOperations(d.data.name)
              );
          })
          .attr("r", function (d) {
            if (d.data.type == "object") {
              d.r = objradius;
              //console.log(d);
              return objradius;
            } else return d.r;
          })
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          })
          .style("opacity", 1)
          .style("stroke", "black")
          .style("stroke-width", "2")
          .style("fill", function (d) {
            if (d.data.type == "object") return "red";
            else return "none";
          })
          .on("click", function (event, d, i) {
            //console.log(d);
            document.getElementById("allperms").checked = false;
            /* if (event.altKey && d3.select(this).style("opacity") > 0.1) {
              personnel_showElement(
                d3.select(this),
                d,
                d3.select(this.parentNode)
              );
            } else */ if (
              d.data.type != "root" &&
              d3.select(this).style("opacity") > 0.1
            ) {
              d3.select("#root")
                .select("#treesvg")
                .selectAll(".selecteduserelement")
                .classed("selecteduserelement", false)
                .style("stroke", "black")
                .style("stroke-width", "2");

              //console.log(d3.selectAll(".tiescircle"));

              removeTies();

              d3.select(this)
                .style("stroke", "orange")
                .style("stroke-width", selectedelement_strokewidth)
                .classed("selecteduserelement", true);

              if (d.data.name != "users") {
                d3.select("#personnel").selectAll(".ties").remove();
                if (d.data.type != "class") addTies(d3.select(this));

                //console.log(d);
                if (d.data.type == "class") {
                  rootNode.descendants().filter(function (element) {
                    if (element.data.type != "root") {
                      var matching_ids = [];
                      matching_ids = document.querySelectorAll(
                        '[id^="' + stringOperations(d.data.name) + '_"]'
                      );
                      //console.log(matching_ids);

                      for (var mi = 0; mi < matching_ids.length; mi++) {
                        d3.select(
                          "#" + matching_ids[mi].getAttribute("id")
                        ).style("opacity", 1);

                        document.getElementById(
                          matching_ids[mi].getAttribute("id")
                        ).nextSibling.style.opacity = 1;
                      }
                    }
                  });
                }

                d3.select(".highlighting-summary")
                  .selectAll("p")
                  .each(function (di) {
                    if (
                      d3
                        .select(this)
                        ._groups[0][0].outerText.includes("personnel:")
                    ) {
                      if (d.data.type == "class")
                        d3.select(this).text(
                          "personnel: (Role) " + d.data.name + " "
                        );
                      else {
                        if (d.parent.data.name == "users")
                          d3.select(this).text(
                            "personnel: (UserID) " + d.data.name + " "
                          );
                        else
                          d3.select(this).text(
                            "personnel: (" +
                              d.parent.data.name +
                              ") " +
                              d.data.name +
                              " "
                          );
                      }

                      //console.log(d);

                      d3.select(this)
                        .insert("span")
                        .classed("fa-sharp fa-solid fa-xmark", true)
                        .attr("id", "userxmark")
                        .on("click", function (d) {
                          d3.select(this.parentNode).text("personnel: ");
                          d3.select("#root")
                            .select("#treesvg")
                            .selectAll(".selecteduserelement")
                            .style("stroke", "black")
                            .style("stroke-width", "2")
                            .classed("selecteduserelement", false);

                          d3.select("#personnel").selectAll(".ties").remove();

                          removeTies();

                          //console.log(fileStruct_mod);

                          //d3.selectAll(".propertyarrow").remove();

                          var file_element =
                            d3.select("#file")._groups[0][0].outerText;
                          file_element = file_element.replace("file: ", "");

                          d3.select("#root")
                            .select("#resourcesg")
                            .selectAll("circle")
                            .filter(function (d) {
                              if (
                                this.getAttribute("id") ==
                                stringOperations(file_element)
                              ) {
                                //   console.log("MATCH");
                                d3.select(this)
                                  .classed("selectedresourceelement", true)
                                  //.attr("id", null)
                                  .style("stroke", "orange")
                                  .style(
                                    "stroke-width",
                                    selectedelement_strokewidth
                                  );

                                //filterProperties(properties);
                              }
                            });

                          d3.select(".propertyarrow").remove();

                          if (d3.select("#filexmark").empty()) {
                            initial_drawArrows();
                          } else
                            setTimeout(function () {
                              filterProperties(properties);
                            }, 350);
                          // }
                        });
                    }
                  });

                d3.select("#personnel_tooltip")
                  .style("opacity", "0")
                  .style("left", 0)
                  .style("top", 0);
                d3.select("#personnel_tooltip").html(" ");

                d3.select(this.parentNode).select("text").style("fill", "blue");

                filterProperties(properties);
                //} else console.log(d);
              }
            }
          })

          .on("mouseover", function (e, d) {
            if (d3.select(this).style("opacity") == 1) {
              var role = "";
              var flag_userid = 0;
              // console.log(e);
              //console.log(d);

              if (d3.select(this)._groups[0][0].__data__.data.type != "root") {
                if (
                  d3.select(this)._groups[0][0].__data__.parent.data.name !=
                  "users"
                )
                  role =
                    d3.select(this)._groups[0][0].__data__.parent.data.name;
                else {
                  flag_userid = 1;
                }
              }

              var name = "";
              name = d3.select(this)._groups[0][0].__data__.data.name;

              var type = d3.select(this)._groups[0][0].__data__.data.type;

              if (type == "class")
                d3.select("#personnel_tooltip_title")
                  .html(" <b>Role name: </b>" + name)
                  .style("font-size", "10px")
                  .style("left", e.pageX + "px")
                  .style("top", e.pageY + "px")
                  .style("opacity", 1);
              else if (type == "object" && flag_userid == 0)
                d3.select("#personnel_tooltip_title")
                  .html(
                    " <b>Name: </b>" + name + "<br/><br/><b>Role:</b> " + role
                  )
                  .style("font-size", "10px")
                  .style("left", e.pageX + "px")
                  .style("top", e.pageY + "px")
                  .style("opacity", 1);
              else if (type == "object" && flag_userid == 1)
                d3.select("#personnel_tooltip_title")
                  .html(" <b>UserID: </b>" + name + "<br/> ")
                  .style("font-size", "10px")
                  .style("left", e.pageX + "px")
                  .style("top", e.pageY + "px")
                  .style("opacity", 1);
              else
                d3.select("#personnel_tooltip_title")
                  .html(" <i>Personnel</i> containing <b>users and roles</b>")
                  .style("font-size", "10px")
                  .style("left", e.pageX + "px")
                  .style("top", e.pageY + "px")
                  .style("opacity", 1);

              //greynow

              d3.select(this)
                .style("fill", "grey")
                .style("stroke", "red")
                .style("stroke-width", "4")
                .style("opacity", 0.2);

              d3.select(this.parentNode)
                .select("text")
                // .style("font-size","30px")
                .style("fill", "darkOrange");
            }
          })
          .on("mouseout", function (d) {
            if (d3.select(this).style("opacity") > 0.1) {
              d3.select("#personnel_tooltip_title")
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html("");

              d3.select(this)
                .style("fill", function (d) {
                  if (d.data.type == "object")
                    //  return "#6378D3";
                    return "red";
                  else return "none";
                })
                .style("stroke", "black")
                .style("stroke-width", "2")
                .style("opacity", 1);

              d3.select(".selecteduserelement")
                .style("stroke", "orange")
                .style("stroke-width", selectedelement_strokewidth);

              d3.select(this.parentNode)
                .select("text")
                //.style("font-size","20px")
                .style("fill", function (d) {
                  if (d.data.type == "object")
                    //  return "#6378D3";
                    return "red";
                  else return "black";
                });

              d3.select("#treesvg").selectAll(".mouse").style("fill", "none");
            }
          });

        var bounding_box = [];
        nodes
          .append("text")
          //.style("font-size", "25px")
          .style("opacity", 1)
          .attr("x", function (d) {
            //   console.log(d);
            //return d.x - 60;
            return d.x - 40;
          })
          .attr("y", function (d) {
            //if (d.data.type == "object") return d.y - objradius;
            if (d.data.type == "object") return d.y + 4 * objradius;
            //else return d.y - d.r + 50;
            else return d.y - d.r;
          })

          //.attr("dx", -40)
          .attr("dy", function (d) {
            return -10;
            //return -(d.r * 2);
          })
          .style("fill", function (d) {
            if (d.data.type == "object") return "red";
            else return "black";
          })
          .text(function (d) {
            if (d.data.type != "root") return d.data.name;
            else return "personnel";
          });

        /*
        nodes
          .append("rect", "text")
          .attr("x", function (d) {
            //   console.log(d);
            return d.x - 40;
          })
          .attr("y", function (d) {
            //if (d.data.type == "object") return d.y - objradius;
            if (d.data.type == "object") return d.y + 4 * objradius - 33;
            else return d.y - d.r - 33;
          })

          .attr("id", function (d) {
            var id = "";
            if (d.parent == null) id = stringOperations(d.data.name);
            else if (d.parent.data.name == "users" && d.data.type == "object")
              id = "userid_" + stringOperations(d.data.name);
            else
              id =
                stringOperations(d.parent.data.name) +
                "_" +
                stringOperations(d.data.name);

            var bbox = document.getElementById(id).nextSibling.getBBox();
            bounding_box.push(bbox);
          })
          .attr("width", function (d, i) {
            console.log(bounding_box[i].width);
            return bounding_box[i].width;
          })
          .attr("height", function (d, i) {
            return bounding_box[i].height;
          })
          .style("fill", "white")
          .style("opacity", 0.5);
*/
        // zoomTo([root.x, root.y, root.r * 2]);
      }

      function resources_showElement(node, d, parent) {
        console.log(d);
        var matching_ids = [];

        var node_id = "";
        var node_depth = d.depth;

        var element_id = "";
        var element_opacity = 0;
        var element_depth = 0;

        var check_opacity = 0;

        node_id = node.attr("id");
        //console.log(node_id);

        matching_ids = document.querySelectorAll('[id^="' + node_id + '-"]');

        //console.log(matching_ids);

        for (var i = 0; i < matching_ids.length; i++) {
          element_depth = matching_ids[i].__data__.depth;

          if (element_depth >= node_depth + 1) {
            element_id = matching_ids[i].getAttribute("id");
            element_opacity = d3.select("#" + element_id).style("opacity");

            if (element_opacity == 1) check_opacity = 1;

            // console.log(element_id + " " + element_depth);
          }
        }

        for (var i = 0; i < matching_ids.length; i++) {
          element_depth = matching_ids[i].__data__.depth;

          if (check_opacity == 1) {
            element_id = matching_ids[i].getAttribute("id");

            //new
            /* document.getElementById(element_id).previousSibling.innerHTML =
              element_id;
            document.getElementById(element_id).previousSibling.style.opacity =
              Math.abs(1 - check_opacity); */

            d3.select("#" + element_id).style(
              "opacity",
              Math.abs(1 - check_opacity)
            );
          } else if (
            node_depth >= 2 ||
            (node_depth == 1 &&
              (node_id == "resources-sch" ||
                node_id == "resources-db" ||
                node_id == "resources-apps"))
          ) {
            element_id = matching_ids[i].getAttribute("id");

            //new
            /* document.getElementById(element_id).previousSibling.innerHTML =
              element_id;
            document.getElementById(element_id).previousSibling.style.opacity =
              Math.abs(1 - element_opacity); */

            d3.select("#" + element_id).style(
              "opacity",
              Math.abs(1 - element_opacity)
            );
          } else if (node_depth <= 1)
            if (node_depth + 1 == element_depth) {
              element_id = matching_ids[i].getAttribute("id");

              //new
              /* document.getElementById(element_id).previousSibling.innerHTML =
                element_id;
              document.getElementById(
                element_id
              ).previousSibling.style.opacity = Math.abs(1 - element_opacity);
 */
              d3.select("#" + element_id).style(
                "opacity",
                Math.abs(1 - element_opacity)
              );
            }
        }
      }

      function personnel_showElement(element, d, parent) {
        d3.selectAll(".propertyarrow").remove();
        d3.selectAll(".reversepropertyarrow").remove();
        d3.selectAll(".ties").remove();

        d3.select("#user").text("personnel: ");
        d3.select("#file").text("file: ");

        d3.select("#root")
          .selectAll(".selecteduserelement")
          .classed("selecteduserelement", false)
          .style("stroke", "black")
          .style("stroke-width", "2");

        d3.select("#root")
          .selectAll(".selectedresourcelement")
          .classed("selectedresourceelement", false)
          .style("stroke", "black")
          .style("stroke-width", "2");

        d3.select("#root")
          .selectAll(".arrowcircle")
          .classed("arrowcircle", false)
          .style("stroke", "black")
          .style("stroke-width", "2");

        /* d3.select("#root")
          .selectAll(".arrowcircletext")
          .classed("arrowcircletext", false)
          .style("opacity", 0)
          .text(""); */

        d3.select("#root")
          .selectAll(".tiescircle")
          .classed("tiescircle", false)
          .style("stroke", "black")
          .style("opacity", 0.1)
          .style("stroke-width", "2");

        d3.select("#resourcesg").selectAll("circle").style("opacity", 0.1);
        d3.select("#resourcesg").selectAll("text").style("opacity", 0.1);

        //d3.select("#personnel").selectAll("circle").style("opacity", 0.1);
        //d3.select("#personnel").selectAll("text").style("opacity", 0.1);

        var matching_ids = [];
        var userid_arr = [];

        //console.log(element);
        //console.log(d);
        //console.log(parent);
        //console.log(element.style("opacity"));
        //console.log(element.style("fill"));
        var element_opacity = 0;
        var flag_opacity = 0;

        var node_id = "";

        var element_id = "";

        node_id = element.attr("id");
        //console.log(node_id);

        if (node_id == "users") {
          matching_ids = document.querySelectorAll('[id^="users_"]');

          userid_arr = document.querySelectorAll('[id^="userid_"]');
        } else {
          matching_ids = document.querySelectorAll(
            '[id^="' + node_id.split("_")[1] + '_"]'
          );
        }

        //console.log(matching_ids);
        //console.log(userid_arr);

        flag_opacity = 0;
        for (var i = 0; i < matching_ids.length; i++) {
          element_id = matching_ids[i].getAttribute("id");

          element_opacity = d3.select("#" + element_id).style("opacity");

          if (element_opacity == 1) flag_opacity = 1;
        }

        for (var i = 0; i < matching_ids.length; i++) {
          element_id = matching_ids[i].getAttribute("id");

          d3.select("#" + element_id).style(
            "opacity",
            Math.abs(1 - flag_opacity)
          );

          document.getElementById(element_id).nextSibling.style.opacity =
            Math.abs(1 - flag_opacity);
        }

        if (userid_arr.length != 0)
          for (var i = 0; i < userid_arr.length; i++) {
            element_id = userid_arr[i].getAttribute("id");

            element_opacity = d3.select("#" + element_id).style("opacity");

            d3.select("#" + element_id).style(
              "opacity",
              Math.abs(1 - element_opacity)
            );

            document.getElementById(element_id).nextSibling.style.opacity =
              Math.abs(1 - flag_opacity);
          }

        if (node_id == "users" && flag_opacity == 1) {
          d3.selectAll(".ties").remove();
          d3.select("#personnel").selectAll("circle").style("opacity", 0);
          d3.select("#personnel").selectAll("text").style("opacity", 0);
          d3.select("#users").style("opacity", 1);
        }

        /*  if (node_id != "users")
          d3.select("#" + node_id).style(
            "opacity",
            Math.abs(1 - element_opacity)
          ); */

        d3.select(node_id).style("opacity", 1);
        document.getElementById(node_id).style.opacity = 1;

        d3.select("#resources").style("opacity", 1);
        document.getElementById("resources").previousSibling.style.opacity = 1;

        d3.select("#users").style("opacity", 1);
        document.getElementById("users").nextSibling.style.opacity = 1;
      }

      function removeTies() {
        var previous_nodes = d3.selectAll(".tiescircle")._groups[0];

        var node_id;
        var matching_ids = [];
        var flag = 0;

        for (var pn = 0; pn < previous_nodes.length; pn++) {
          node_id = previous_nodes[pn].getAttribute("id");
          if (node_id.includes("userid")) {
            flag = 0;
            matching_ids = document.querySelectorAll('[id^="users_"]');
            for (var mi = 0; mi < 2; mi++) {
              flag =
                flag +
                parseInt(
                  d3
                    .select("#" + matching_ids[mi].getAttribute("id"))
                    .style("opacity")
                );
            }

            //console.log(flag);
            if (flag >= 2) {
              d3.select("#" + node_id).style("opacity", 1);
              document.getElementById(node_id).nextSibling.style.opacity = 1;
            } else if (flag < 1) {
              d3.select("#" + node_id).style("opacity", 0);
              document.getElementById(node_id).nextSibling.style.opacity = 0;
            }
          } else {
            flag = 0;
            matching_ids = document.querySelectorAll(
              '[id^="' + node_id.split("_")[0] + '_"]'
            );
            var len;
            if (matching_ids.length < 2) len = matching_ids.length;
            else len = 2;
            for (var mi = 0; mi < len; mi++) {
              flag =
                flag +
                parseInt(
                  d3
                    .select("#" + matching_ids[0].getAttribute("id"))
                    .style("opacity")
                );
            }
            //console.log(matching_ids[0].getAttribute("id").split("_")[0]);
            //console.log(flag);
            if (flag >= len) {
              d3.select("#" + node_id).style("opacity", 1);
              document.getElementById(node_id).nextSibling.style.opacity = 1;
            } else if (flag < 0.5) {
              d3.select("#" + node_id).style("opacity", 0);
              document.getElementById(node_id).nextSibling.style.opacity = 0;
            }
          }
        }

        d3.selectAll(".tiescircle")
          .classed("tiescircle", false)
          .style("opacity", 0.1);

        d3.selectAll(".ties").remove();
      }

      //start of function addties
      function addTies(clickednode) {
        var similar_nodes = [];
        var element_id = "";

        d3.selectAll(".ties").remove();

        d3.selectAll(".tiescircle").filter(function (d) {
          d3.select(this.nextSibling).style("opacity", 0.1);

          var element_id = d3.select(this).attr("id");

          d3.select(this).classed("tiescircle", false);

          if (!element_id.includes("userid")) {
            d3.select("#users_" + element_id.split("_")[0]).style("opacity", 1);

            document.getElementById(
              "users_" + element_id.split("_")[0]
            ).nextSibling.style.opacity = 0.1;
          }

          return this.nextSibling;
        });

        //var previous_ties = d3.selectAll(".tiescircle");

        //console.log(previous_ties);

        //previous_ties.classed("tiescircle", false).style("opacity", 0.1);

        //console.log(previous_ties);

        var node_id = clickednode._groups[0][0].getAttribute("id").split("_");
        //console.log(node_id);

        //console.log(node_id);

        var matching_ids = document.querySelectorAll(
          '[id$="' + node_id[1] + '"]'
        );

        //console.log(matching_ids);

        for (var i = 0; i < matching_ids.length; i++) {
          element_id = matching_ids[i].getAttribute("id");
          if (element_id.includes("userid")) {
            similar_nodes.push({
              x: parseInt(matching_ids[i].getAttribute("cx")),
              y: parseInt(matching_ids[i].getAttribute("cy")),
            });
            d3.select("#" + element_id)
              .classed("tiescircle", true)
              .style("opacity", 1);
            document.getElementById(element_id).nextSibling.style.opacity = 1;
          }
        }

        for (var i = 0; i < matching_ids.length; i++) {
          element_id = matching_ids[i].getAttribute("id");
          if (
            !element_id.includes("userid") &&
            !element_id.includes("resources")
          ) {
            similar_nodes.push({
              x: parseInt(matching_ids[i].getAttribute("cx")),
              y: parseInt(matching_ids[i].getAttribute("cy")),
            });
            d3.select("#" + element_id)
              .classed("tiescircle", true)
              .style("opacity", 1);
            document.getElementById(element_id).nextSibling.style.opacity = 1;
          }
        }

        //d3.selectAll(".tiescircle").style("opacity", 1);
        //document.getElementById(element_id).nextSibling.style.opacity = 1;

        //console.log(similar_nodes);

        for (let i = 1; i < similar_nodes.length; i++) {
          //for (let j = 1; j < similar_nodes.length; j++) {
          //if (i != j) {

          d3.select("#treesvg")
            .select("#personnel")
            .append("line")
            .classed("ties", true)
            .style("stroke", "white")
            .style("stroke-width", 4)
            .attr("x1", similar_nodes[0].x)
            .attr("y1", similar_nodes[0].y)
            .attr("x2", similar_nodes[i].x)
            .attr("y2", similar_nodes[i].y);

          d3.select("#treesvg")
            .select("#personnel")
            .append("line")
            .classed("ties", true)
            .style("stroke", "black")
            .style("stroke-width", 10)
            .attr("x1", similar_nodes[0].x)
            .attr("y1", similar_nodes[0].y)
            .attr("x2", similar_nodes[i].x)
            .attr("y2", similar_nodes[i].y);
          //}
          //}
        }
        d3.selectAll(".ties").lower();
      }
      //end of function addties

      function filterProperties(properties) {
        //console.log(filterProperties);
        d3.select(".intellibot").selectAll("p").remove();
        d3.select(".initialpropertyarrow").remove();

        d3.selectAll(".arrowcircle")
          .style("stroke-width", 2)
          .classed("arrowcircle", false);

        /* d3.select("#root")
          .selectAll(".arrowcircletext")
          .classed("arrowcircletext", false)
          .style("opacity", 0)
          .text(""); */

        var fs = [
          {
            name: "resources",
            fpath: "resources",
            type: "root",
            children: fileStruct_mod,
          },
        ];

        // console.log("entering filter");
        //console.log(properties.length);

        //if (!d3.selectAll(".selecteduserelement").empty())
        //if (!d3.selectAll(".selectedresourceelement").empty())
        // console.log(d3.select(".selecteduserelement"));

        //console.log(d3.select(".selectedresourceelement"));

        var rootNode = d3.hierarchy(fs[0]);
        //console.log(rootNode.descendants());

        var node_name = "";
        var node_role = "";
        var node_ancestors = [];

        var node = "";
        var node_children = [];

        var svg = d3.select("#treesvg");

        var filtered_properties = [];
        var filtered_path = [];
        var flag_role = "";

        var dup_filtered_properties = [];
        var roles = [];

        var unmerged_prop = [];

        //console.log(properties);

        filtered_properties = JSON.parse(JSON.stringify(properties));

        for (var i = 0; i < filtered_properties.length; i++) {
          //console.log(filtered_properties[i]);
          if (!filtered_properties[i].role.includes("+")) {
            //console.log("+");
            dup_filtered_properties.push(filtered_properties[i]);
            if (!roles.includes(filtered_properties[i].role))
              roles.push(filtered_properties[i].role);
          } else {
            var lor = filtered_properties[i].role.split("+");

            for (var r = 0; r < lor.length; r++) {
              if (!roles.includes(lor[r])) roles.push(lor[r]);
            }
            unmerged_prop = unmergeRulelist(filtered_properties[i]);
            //console.log(unmerged_prop);
            for (var up = 0; up < unmerged_prop.length; up++)
              dup_filtered_properties.push(
                JSON.parse(JSON.stringify(unmerged_prop[up]))
              );
          }
        }

        var propertiesArr = JSON.parse(JSON.stringify(dup_filtered_properties));
        var original_propertiesArr = JSON.parse(
          JSON.stringify(dup_filtered_properties)
        );

        //for (var p = 0; p < propertiesArr.length; p++)
        //console.log(propertiesArr[p]);

        //console.log(propertiesArr);

        filtered_properties = [];
        dup_filtered_properties = [];

        ////////////////////

        if (
          (d3.select("#filexmark").empty() &&
            !d3.select("#userxmark").empty()) ||
          !svg.selectAll(".propertyarrow").empty()
        ) {
          svg.selectAll(".propertyarrow").remove();

          if (!d3.selectAll(".selecteduserelement").empty()) {
            node = d3.selectAll(".selecteduserelement");
            //console.log(node._groups);
            node_children = node._groups[0];
            //console.log(node_children);
            node_name = stringOperations(node_children[0].__data__.data.name);
            for (var i = 0; i < node_children.length; i++) {
              node_role = node_children[i].getAttribute("id").split("_")[0];
              //console.log(node_role);

              if (node_role == "users") {
                flag_role = "role";
                node_role = node_children[i].getAttribute("id").split("_")[1];
              } else if (node_role == "userid") flag_role = "userid";
            }

            //console.log(personnel);
            //console.log(node_role);
            //console.log(node_name);
            //console.log(properties);
            if (flag_role == "role") {
              //console.log("clicked on a role");
              //console.log(node_name);
              //console.log(node_role);
              var users = [];
              var filtered_properties_role = [];
              var filtered_properties_fpath = [];

              // console.log(properties);

              //find all users belonging to a role
              users = checkUsers(personnel, node_role);

              //console.log(users);
              //console.log(filtered_properties.length);
              //console.log(filtered_properties_role.length);

              propertiesArr.filter(function (element) {
                if (element.role == stringOperations(node_role)) {
                  //console.log(element);
                  filtered_properties.push(element);
                }
              });

              /* 
              //filter those properties which contain the role
              propertiesArr.filter(function (element) {
                if (element.role.includes(stringOperations(node_role))) {
                  //console.log(element);
                  filtered_properties_role.push(element);
                }
              });

              //filter again based on the resource for each role to check if the
              for (var i = 0; i < filtered_properties_role.length; i++) {
                filtered_properties_fpath = [];

                filtered_properties_role.filter(function (element) {
                  if (element.fpath == filtered_properties_role[i].fpath) {
                    //console.log(element);
                    filtered_properties_fpath.push(element);
                  }
                });

                //console.log(filtered_properties_fpath);
                //console.log(filtered_properties_fpath.length);

                //add properties to final array
                if (filtered_properties_fpath.length == users.length) {
                  if (
                    !filtered_path.includes(
                      stringOperations(filtered_properties_fpath[0].fpath)
                    )
                  ) {
                    filtered_path.push(
                      stringOperations(filtered_properties_fpath[0].fpath)
                    );

                    filtered_properties.push(filtered_properties_fpath[0]);
                  }
                }

              }
              */

              //for (var i = 0; i < filtered_properties.length; i++)
              //console.log(filtered_properties[i]);

              //change made now
              //filtered_properties[i].subject = node_role;
            } else if (flag_role == "userid") {
              //console.log("clicked userid");
              //console.log(node_name);
              propertiesArr.filter(function (element) {
                //if (element.role.includes("userid")) console.log(element);
                //console.log(element);
                if (
                  element.role.includes("userid") &&
                  element.subject == node_name
                ) {
                  //console.log(element);

                  //filtered_path.push(element.object_parent);
                  filtered_path.push(stringOperations(element.fpath));
                  //console.log(element);
                  filtered_properties.push(element);
                }
              });
            } else {
              //console.log("clicked on a user belonging to a role");
              //console.log(node_name);
              //console.log(node_role);

              propertiesArr.filter(function (element) {
                //console.log(element.role);
                //console.log(node_role);
                if (
                  element.subject == node_name &&
                  stringOperations(element.role) == stringOperations(node_role)
                ) {
                  //console.log(element);

                  //filtered_path.push(element.object_parent);
                  filtered_path.push(stringOperations(element.fpath));
                  //console.log(element);
                  filtered_properties.push(element);
                }
              });
            }
          }

          if (!d3.selectAll(".selectedresourceelement").empty()) {
            //console.log(d3.selectAll(".selectedresourceelement"));

            d3.selectAll(".selectedresourceelement")
              .style("stroke", "orange")
              .style("stroke-width", selectedelement_strokewidth);

            var resource_node_name = d3
              .selectAll(".selectedresourceelement")
              .attr("id");

            //console.log(resource_node_name);
            //console.log(d3.select(".selectedresourceelement"));
            filtered_properties = filtered_properties.filter(function (
              element
            ) {
              //if (stringOperations(element.fpath) == resource_node_name) {
              if (
                stringOperations(element.fpath).includes(resource_node_name)
              ) {
                //filtered_path.push(element.object_parent);
                //console.log(stringOperations(element.fpath));
                //console.log(element);

                filtered_path.push(stringOperations(element.fpath));
                return element;
              }
            });
          }

          //console.log(filtered_properties);
          //for (var fp = 0; fp < filtered_properties.length; fp++)
          //console.log(filtered_properties[fp]);
          //console.log(filtered_path);

          //console.log(rootNode.descendants());

          if (filtered_properties.length == 0) {
            d3.select("#resourcesg").selectAll("circle").style("opacity", 0.1);
            //d3.select("#resourcesg").selectAll("text").style("opacity", 0.1);

            ///////
            d3.select("#resources").style("opacity", 1);
            document.getElementById(
              "resources"
            ).previousSibling.style.opacity = 1;
          } else {
            rootNode.descendants().filter(function (element) {
              if (
                filtered_path.includes(stringOperations(element.data.fpath))
              ) {
                for (let i = 0; i < element.ancestors().length; i++) {
                  if (
                    !node_ancestors.includes(
                      stringOperations(element.ancestors()[i].data.fpath)
                    )
                  )
                    node_ancestors.push(
                      stringOperations(element.ancestors()[i].data.fpath)
                    );
                }
              }
            });

            //treelistresources(fileStruct_mod, properties);
            //svg.append("g").classed("propertyarrow", true);
          }
          svg.append("g").classed("propertyarrow", true);

          var node_role = "";
          var sel_node_role = d3
            .select(".selecteduserelement")
            .attr("id")
            .split("_");
          if (sel_node_role[0] == "users") node_role = sel_node_role[1];
          else node_role = sel_node_role[0];

          d3.select("#resourcesg").selectAll("circle").style("opacity", 0.1);
          //d3.select("#resourcesg").selectAll("text").style("opacity", 0.1);

          d3.selectAll(".tiescircle").style("opacity", 1);

          for (var na = 0; na < node_ancestors.length; na++) {
            d3.select("#" + node_ancestors[na]).style("opacity", 1);
            //document.getElementById(node_ancestors[na]).previousSibling.style.opacity = 1;
          }
        }

        //////////////////// reverse start
        //console.log(filtered_path);
        //console.log(filtered_properties);

        if (
          (d3.select("#userxmark").empty() &&
            !d3.select("#filexmark").empty()) ||
          !svg.selectAll(".reversepropertyarrow").empty()
        ) {
          //console.log("drawing reverse arrows");
          svg.selectAll(".reversepropertyarrow").remove();

          if (!d3.selectAll(".selectedresourceelement").empty()) {
            //console.log(d3.selectAll(".selectedresourceelement"));

            d3.selectAll(".selectedresourceelement")
              .style("stroke", "orange")
              .style("stroke-width", selectedelement_strokewidth)
              .style("opacity", 1);

            var resource_node_name = d3
              .selectAll(".selectedresourceelement")
              .attr("id");

            //console.log(resource_node_name);
            //console.log(propertiesArr.length);
            //console.log(d3.select(".selectedresourceelement"));
            propertiesArr.filter(function (element) {
              //console.log(element.fpath);
              //change made now
              //if (stringOperations(element.fpath) == resource_node_name) {
              //console.log(element.fpath + " " + resource_node_name);
              if (
                stringOperations(element.fpath).includes(
                  stringOperations(resource_node_name)
                )
              ) {
                //filtered_path.push(element.object_parent);

                if (!filtered_path.includes(stringOperations(element.fpath)))
                  filtered_path.push(stringOperations(element.fpath));

                filtered_properties.push(element);
                //return element;
              }
            });
          }

          // for (var i = 0; i < filtered_properties.length; i++)
          //console.log(filtered_properties[i]);

          if (!d3.selectAll(".selecteduserelement").empty()) {
            filtered_path = [];
            node = d3.selectAll(".selecteduserelement");
            //console.log(node._groups);
            node_children = node._groups[0];
            //console.log(node_children);
            node_name = stringOperations(node_children[0].__data__.data.name);
            for (var i = 0; i < node_children.length; i++) {
              node_role = node_children[i].getAttribute("id").split("_")[0];
              //console.log(node_role);

              if (node_role == "users") {
                flag_role = "role";
                node_role = node_children[i].getAttribute("id").split("_")[1];
              } else if (node_role == "userid") flag_role = "userid";
            }

            //console.log("2nd round of filtering based on user");
            //console.log(node_name);
            //console.log(node_role);

            if (flag_role == "role") {
              //console.log("clicked on a role");
              filtered_properties = filtered_properties.filter(function (
                element
              ) {
                //console.log(element.role + " " + node_role);
                if (
                  stringOperations(element.role) == stringOperations(node_role)
                ) {
                  if (!filtered_path.includes(stringOperations(element.fpath)))
                    filtered_path.push(stringOperations(element.fpath));
                  //console.log(element);
                  //filtered_properties.push(element);
                  return element;
                }
              });
            } else if (flag_role == "userid") {
              //console.log("clicked on userid");
              filtered_properties = filtered_properties.filter(function (
                element
              ) {
                if (
                  stringOperations(element.role).includes(node_name) &&
                  stringOperations(element.role).includes(node_role)
                ) {
                  //console.log(element);
                  //filtered_path.push(element.object_parent);
                  if (!filtered_path.includes(stringOperations(element.fpath)))
                    filtered_path.push(stringOperations(element.fpath));
                  //console.log(element.fpath);
                  //filtered_properties.push(element);
                  return element;
                }
              });
            } else {
              //console.log("clicked on a user belonging to a role");
              filtered_properties = filtered_properties.filter(function (
                element
              ) {
                if (
                  stringOperations(element.role).includes(node_role) &&
                  stringOperations(element.subject).includes(node_name)
                ) {
                  //filtered_path.push(element.object_parent);
                  if (!filtered_path.includes(stringOperations(element.fpath)))
                    filtered_path.push(stringOperations(element.fpath));
                  //console.log(element.fpath);
                  //filtered_properties.push(element);
                  return element;
                }
              });
            }
          }

          //for (var i = 0; i < filtered_properties.length; i++)
          //console.log(filtered_properties[i]);

          /*  var roles = [];
          var users = [];
          var unmerged_prop = [];
          var dup_filtered_properties = [];

          for (var i = 0; i < filtered_properties.length; i++) {
            //console.log(filtered_properties[i]);
            if (!filtered_properties[i].role.includes("+")) {
              //console.log("+");
              dup_filtered_properties.push(filtered_properties[i]);
              if (!roles.includes(filtered_properties[i].role))
                roles.push(filtered_properties[i].role);
            } else {
              var lor = filtered_properties[i].role.split("+");
              for (var r = 0; r < lor.length; r++) {
                if (!roles.includes(lor[r])) roles.push(lor[r]);
              }
              unmerged_prop = unmergeRulelist(filtered_properties[i]);
              //console.log(unmerged_prop);
              for (var up = 0; up < unmerged_prop.length; up++)
                dup_filtered_properties.push(
                  JSON.parse(JSON.stringify(unmerged_prop[up]))
                );
            }
          } */

          //filtered_properties = dup_filtered_properties.slice(0);

          d3.selectAll(".tiescircle").style("opacity", 1);
          svg.append("g").classed("reversepropertyarrow", true);
        }

        ///////////////////////////end of reverse

        d3.select("#" + resource_node_name)
          .classed("selectedresourceelement", true)
          .style("stroke", "orange")
          .style("stroke-width", selectedelement_strokewidth)
          .style("opacity", 1);

        //console.log(filtered_properties);

        filtered_properties = aggregateProperties(filtered_properties);

        //for (var i = 0; i < filtered_properties.length; i++)
        //console.log(filtered_properties[i]);

        if (
          !d3.selectAll(".propertyarrow").empty() &&
          filtered_properties.length > 0
        )
          drawArrows(filtered_properties, original_propertiesArr);
        else if (
          !d3.selectAll(".reversepropertyarrow").empty() &&
          filtered_properties.length > 0
        )
          reverse_drawArrows(filtered_properties, original_propertiesArr);

        /*
          setTimeout(function () {
          if (
            !d3.selectAll(".propertyarrow").empty() &&
            filtered_properties.length > 0
          )
            drawArrows(filtered_properties);
          else if (
            !d3.selectAll(".reversepropertyarrow").empty() &&
            filtered_properties.length > 0
          )
            reverse_drawArrows(filtered_properties);
        }, 150);
        */

        return filtered_properties;
      }

      function unmergeRulelist(prop) {
        var dup_prop = JSON.parse(JSON.stringify(prop));

        var filtered_prop = [];
        var roles = prop.role.split("+");
        var rulelist = [];
        //console.log(roles);
        for (var rol = 0; rol < roles.length; rol++) {
          rulelist = [];
          //console.log(roles[rol]);
          for (var i = 0; i < prop.rulelist.length; i++) {
            //console.log(prop.rulelist[i]);
            if (
              stringOperations(prop.rulelist[i].role) == roles[rol] &&
              prop.rulelist[i].status == "active"
            ) {
              //console.log(prop.rulelist[i]);
              rulelist.push(prop.rulelist[i]);
            }
          }
          //console.log(rulelist.length);
          if (rulelist.length > 0) {
            dup_prop.role = roles[rol];
            dup_prop.rulelist = rulelist;
            //console.log(dup_prop);
            filtered_prop.push(JSON.parse(JSON.stringify(dup_prop)));
          }
        }
        //console.log(filtered_prop);

        return filtered_prop;
      }

      function checkUsers(personnel, node_role) {
        var users = [];
        for (var pr = 0; pr < personnel[0].children.length; pr++) {
          if (
            stringOperations(personnel[0].children[pr].name) ==
            stringOperations(node_role)
          ) {
            for (
              var pr_child = 0;
              pr_child < personnel[0].children[pr].children.length;
              pr_child++
            )
              users.push(
                stringOperations(
                  personnel[0].children[pr].children[pr_child].name
                )
              );
          }
        }
        //console.log(users);
        return users;
      }

      function initial_drawArrows() {
        d3.selectAll(".initialpropertyarrow").remove();
        d3.select(".intellibot").selectAll("p").remove();
        removeTies();

        d3.select("#personnel").selectAll("circle").style("opacity", 1);
        d3.select("#personnel").selectAll("text").style("opacity", 1);
        d3.select("#resourcesg").selectAll("circle").style("opacity", 1);
        d3.select("#resourcesg").selectAll("text").style("opacity", 1);

        d3.select("#users").style("opacity", 1);
        document.getElementById("users").nextSibling.style.opacity = 1;
        d3.select("#resources").style("opacity", 1);
        document.getElementById("resources").previousSibling.style.opacity = 1;

        d3.selectAll(".arrowcircle")
          .classed("arrowcircle", false)
          .style("stroke-width", 2);

        /*  d3.select("#root")
          .selectAll(".arrowcircletext")
          .classed("arrowcircletext", false)
          .style("opacity", 0)
          .text(""); */

        var transcoords = d3
          .select("#treesvg")
          .select("#personnel")
          .attr("transform")
          .replace("translate(", "")
          .replace(")", "");
        var offsetx = transcoords.split(",")[0];
        var offsety = transcoords.split(",")[1];

        var x1 =
          parseInt(d3.select("#personnel").select("#users").attr("cx")) +
          parseInt(offsetx) +
          +parseInt(d3.select("#personnel").select("#users").attr("r"));

        var y1 =
          parseInt(d3.select("#personnel").select("#users").attr("cy")) +
          parseInt(offsety);

        var x2 =
          parseInt(d3.select("#resourcesg").select("#resources").attr("cx")) +
          parseInt(resourcesTranslateCoordx) -
          parseInt(d3.select("#resourcesg").select("#resources").attr("r"));

        var y2 =
          parseInt(d3.select("#resourcesg").select("#resources").attr("cy")) +
          parseInt(resourcesTranslateCoordy);

        var c1 = x1 + 100 + "," + (y1 - 100);
        var c2 = x2 - 100 + "," + (y2 - 100);

        var pathvar =
          "M" + x1 + "," + y1 + " C" + c1 + " " + c2 + " " + x2 + "," + y2;

        //console.log("hi" + c1 + " " + c2);

        //if (d3.select(".path-propertyarrow-" + i).empty())
        if (d3.select(".initialpropertyarrow").empty())
          d3.select("#treesvg")
            .append("g")
            .classed("initialpropertyarrow", true)
            .append("path")
            .style("stroke", "green")
            .style("stroke-width", "8")
            .style("opacity", "1")
            .style("fill", "none")
            .attr("d", pathvar)
            .attr("marker-end", "url(#arrow)")
            .on("mouseover", function (e, d) {
              //console.log(rulelist);

              var perm_text =
                "<i>personnel</i> <b>canAccess</b> <i>resources</i> with 5 levels of permissions 1) List 2) Get 3) Create 4) Update and 5) Delete";

              //console.log(perm_text);
              console.log(window.innerWidth);

              d3.select("#personnel_tooltip")
                .html(perm_text)
                .style("font-size", "10px")
                .style("opacity", 1)
                .style("text-align", "left")
                .style("width", "250px")
                .style("left", window.innerWidth / 2 - 125 + "px")
                .style("top", e.pageY - 100 + "px");
              /* .attr(
                  "transform",
                  "translate(" + 1400 + "," + (y1 + y2) / 2 + ")"
                )
                .style("left", 450 + "px")
                .style("top", 400 + "px"); */

              d3.select(this).style("opacity", 1);
            })
            .on("mouseout", function (d) {
              //d3.select("#g-propertyarrow-" + i)
              //.selectAll("circle")
              //.style("opacity", 0.3);

              d3.select(this).style("opacity", 0.3);

              d3.select("#personnel_tooltip")
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html("");
            });

        d3.select(".initialpropertyarrow")
          .append("text")
          .style("font-size", "2em")
          .attr("x", parseInt(c1.split(",")[0]) + 100)
          .attr("y", c1.split(",")[1])
          .text("canAccess");
      }

      function drawArrows(filtered_properties, properties) {
        //console.log(filtered_properties);
        //treelistresources(fileStruct_mod);

        console.log("draw arrows");

        var node_name = "";
        var node_role = [];

        var node = d3.selectAll(".selecteduserelement");

        //console.log(node);
        var nodeType = node._groups[0][0].__data__.data.type;

        for (let i = 0; i < filtered_properties.length; i++) {
          //console.log(i);
          const rulelist = filtered_properties[i].rulelist;
          var element_id = "";
          if (filtered_properties[i].role == filtered_properties[i].subject)
            element_id = "users_" + filtered_properties[i].role;
          else if (filtered_properties[i].role.includes("userid"))
            element_id =
              "userid_" + filtered_properties[i].role.replace("userid", "");
          else
            element_id =
              filtered_properties[i].role +
              "_" +
              filtered_properties[i].subject;
          //console.log(rulelist);

          //console.log(element_id);
          //console.log(filtered_properties[i]);

          // if (flag_check_role == 1) {
          var transcoords = d3
            .select("#treesvg")
            .select("#personnel")
            .attr("transform")
            .replace("translate(", "")
            .replace(")", "");
          var offsetx = transcoords.split(",")[0];
          var offsety = transcoords.split(",")[1];

          var x1 =
            parseInt(
              d3
                .select("#personnel")
                .select("#" + element_id)
                .attr("cx")
            ) + parseInt(offsetx);

          if (nodeType == "class") {
            x1 =
              x1 +
              parseInt(
                d3
                  .select("#personnel")
                  .select("#" + element_id)
                  .attr("r")
              );
          }

          var y1 =
            parseInt(
              d3
                .select("#personnel")
                .select("#" + element_id)
                .attr("cy")
            ) + parseInt(offsety);

          var x2 =
            parseInt(
              d3
                .select("#resourcesg")
                .select("#" + stringOperations(filtered_properties[i].fpath))
                .attr("cx")
            ) +
            parseInt(resourcesTranslateCoordx) -
            parseInt(
              d3
                .select("#resourcesg")
                .select("#" + stringOperations(filtered_properties[i].fpath))
                .attr("r")
            );

          var y2 =
            parseInt(
              d3
                .select("#resourcesg")
                .select("#" + stringOperations(filtered_properties[i].fpath))
                .attr("cy")
            ) + parseInt(resourcesTranslateCoordy);

          d3.select("#resourcesg")
            .select("#" + stringOperations(filtered_properties[i].fpath))
            .classed("arrowcircle", true)
            .style("stroke-width", arrowcircle_strokewidth);

          d3.select("#personnel")
            .select("#" + element_id)
            .classed("arrowcircle", true)
            .style("stroke-width", arrowcircle_strokewidth);

          /*  document.getElementById(
            stringOperations(filtered_properties[i].fpath)
          ).class = "arrowcircletext";

          document.getElementById(
            stringOperations(filtered_properties[i].fpath)
          ).previousSibling.innerHTML = filtered_properties[i].object;

          document.getElementById(
            stringOperations(filtered_properties[i].fpath)
          ).previousSibling.style.opacity = 1; */

          var c1 = x1 + 100 + "," + (y1 - 100);
          var c2 = x2 - 100 + "," + (y2 - 100);

          var pathvar =
            "M" + x1 + "," + y1 + " C" + c1 + " " + c2 + " " + x2 + "," + y2;

          svg
            .select(".propertyarrow")
            .append("path")
            //.classed( "path")
            .classed("path-propertyarrow-" + i, true)
            .style("stroke", "green")
            .style("stroke-width", "8")
            .style("opacity", "0.3")
            .style("fill", "none")
            .attr("d", pathvar)
            .attr("marker-end", "url(#arrow)")
            .on("mouseover", function (e, d) {
              //console.log(rulelist);
              var perms = ["list", "get", "create", "update", "delete"];
              var rlist = [];
              for (var p = 0; p < perms.length; p++) {
                rlist.push({
                  permissions: perms[p],
                  settings: "",
                  ruleID: "",
                  role: "",
                  selectedrole: "",
                });
              }

              var filtered_rulelist = [];
              /*
              console.log(filtered_properties[i]);
              console.log(
                filtered_properties[i].role +
                  " " +
                  filtered_properties[i].subject
              );
              */

              //console.log(properties);
              if (
                filtered_properties[i].role == filtered_properties[i].subject
              ) {
                properties.filter(function (d) {
                  if (
                    filtered_properties[i].fpath == d.fpath &&
                    checkUsers(personnel, filtered_properties[i].role)[0] ==
                      d.subject &&
                    filtered_properties[i].role != d.role
                  ) {
                    //console.log(d);
                    for (var fr = 0; fr < d.rulelist.length; fr++) {
                      if (d.rulelist[fr].role.includes("userid"))
                        d.rulelist[fr].role =
                          "userid:" +
                          checkUsers(
                            personnel,
                            filtered_properties[i].role
                          ).join(",");
                      filtered_rulelist.push(d.rulelist[fr]);
                    }
                    //filtered_rulelist.push(d.rulelist);
                  }
                });
              } else
                properties.filter(function (d) {
                  if (
                    filtered_properties[i].fpath == d.fpath &&
                    filtered_properties[i].subject == d.subject &&
                    filtered_properties[i].role != d.role
                  ) {
                    console.log(d);

                    for (var fr = 0; fr < d.rulelist.length; fr++)
                      filtered_rulelist.push(d.rulelist[fr]);
                  }
                });

              //console.log(filtered_properties[i].fpath);
              //console.log(filtered_properties[i]);
              //console.log(filtered_rulelist);

              d3.select(this).style("opacity", 1);

              //console.log(element_id);

              //style='font-color:green;'
              var perm_text = "";

              element_id = "";
              if (filtered_properties[i].role == filtered_properties[i].subject)
                element_id = "users_" + filtered_properties[i].role;
              else if (filtered_properties[i].role.includes("userid"))
                element_id =
                  "userid_" + filtered_properties[i].role.replace("userid", "");
              else
                element_id =
                  filtered_properties[i].role +
                  "_" +
                  filtered_properties[i].subject;

              if (filtered_properties[i].role.includes("userid"))
                perm_text =
                  "<b>UserID: </b> " +
                  //capitalCase(element_id.split("_")[1]) +
                  capitalCase(
                    filtered_properties[i].role.replace("userid", "")
                  ) +
                  "</br><b> Resource: </b><tt>" +
                  filtered_properties[i].fpath.replaceAll("-", "/") +
                  " </tt></br></br>";
              else if (
                filtered_properties[i].role == filtered_properties[i].subject
              )
                perm_text =
                  "<b>Role: </b> " +
                  capitalCase(filtered_properties[i].role) +
                  "</br>(" +
                  checkUsers(personnel, filtered_properties[i].role) +
                  ")</br><b> Resource: </b><tt>" +
                  filtered_properties[i].fpath.replaceAll("-", "/") +
                  " </tt></br></br>";
              else
                perm_text =
                  "<b>User / Role: </b>" +
                  //capitalCase(element_id.split("_")[1]) +
                  capitalCase(filtered_properties[i].subject) +
                  " / " +
                  //capitalCase(element_id.split("_")[0]) +
                  capitalCase(filtered_properties[i].role) +
                  "</br><b> Resource: </b><tt>" +
                  filtered_properties[i].fpath.replaceAll("-", "/") +
                  " </tt></br></br>";

              perm_text =
                perm_text +
                "<table class='table table-bordered' style='width:100%'; >" +
                "<thead><tr>" +
                "<th>Permissions</th> " +
                "<th>Settings</th>" +
                "<th>RuleNo.</th>" +
                "<th>Role</th>" +
                "</tr></thead><tbody>";

              if (filtered_rulelist.length > 0)
                for (let j = 0; j < filtered_rulelist.length; j++) {
                  if (filtered_rulelist[j].status == "active") {
                    {
                      var index = perms.indexOf(
                        filtered_rulelist[j].permissionType
                      );

                      if (filtered_rulelist[j].permissionBoolean == "Set")
                        rlist[index].settings = "Granted";
                      else rlist[index].settings = "Denied";

                      rlist[index].ruleID = filtered_rulelist[j].ruleID;
                      rlist[index].role = filtered_rulelist[j].role;
                      rlist[index].currentrole = "no";
                    }
                  } //else perm_text = perm_text + " :Perms inactive";
                }

              //console.log(rulelist);
              for (let j = 0; j < rulelist.length; j++) {
                if (rulelist[j].status == "active") {
                  {
                    var index = perms.indexOf(rulelist[j].permissionType);

                    if (rulelist[j].permissionBoolean == "Set")
                      rlist[index].settings = "Granted";
                    else rlist[index].settings = "Denied";

                    rlist[index].ruleID = rulelist[j].ruleID;
                    rlist[index].role = rulelist[j].role;
                    rlist[index].currentrole = "yes";
                  }
                } //else perm_text = perm_text + " :Perms inactive";
              }

              //console.log(rlist);

              for (let r = 0; r < rlist.length; r++) {
                if (rlist[r].currentrole == "yes")
                  perm_text =
                    perm_text +
                    "<tr style='background-color:rgb(245, 231, 234,0.4)'>" +
                    "<td>" +
                    rlist[r].permissions +
                    " </td>";
                else
                  perm_text =
                    perm_text +
                    " <tr>" +
                    "<td>" +
                    rlist[r].permissions +
                    " </td>";
                if (rlist[r].settings == "Granted")
                  perm_text =
                    perm_text +
                    "<td><span style='color:green'> Granted </span></td>";
                else if (rlist[r].settings == "Denied")
                  perm_text =
                    perm_text +
                    "<td><span style='color:red'>Denied </span></td>";
                perm_text = perm_text + "<td>" + rlist[r].ruleID + "</td>";
                perm_text = perm_text + " <td>" + rlist[r].role + "</td></tr>";
              }

              //console.log(filtered_rulelist.length);

              perm_text = perm_text + "</tbody></table>";
              /*<td><span style='color:green'> Granted </span></td>*/
              //console.log(perm_text);

              d3.select("#personnel_tooltip")
                .html(perm_text)
                .style("font-size", "10px")
                .style("opacity", 1)
                .style("width", "300px")
                .attr(
                  "transform",
                  "translate(" + 1400 + "," + (y1 + y2) / 2 + ")"
                )
                .style("left", window.innerWidth / 2 - 150 + "px")
                .style("top", 400 + "px");
              hoverSideEffect(e, rlist, filtered_properties[i]);
            })
            .on("mouseout", function (d) {
              /*
              d3.select("#g-propertyarrow-" + i)
                .selectAll("circle")
                .style("opacity", 0.3);
                */
              d3.select(this).style("opacity", 0.3);

              d3.select("#personnel_tooltip")
                .style("opacity", 0)
                .style("left", "0px")
                .style("top", "0px")
                //.style("opacity", 1);
                .html("");
            });
          // }
        }

        //d3.selectAll("circle").classed("drawArrow", null);
      }

      function capitalCase(str) {
        var cap_str = str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
        return cap_str;
      }

      function aggregateProperties(properties) {
        console.log("aggregate properties");
        //console.log(properties.length);
        var deleted_files = [];

        var perms = ["get", "list", "create", "update", "delete"];

        var dup_properties = JSON.parse(JSON.stringify(properties));

        //for (var p = 0; p < properties.length; p++) console.log(properties[p]);

        var filterbysubj = [];
        var roles = [];
        var parent;
        var index = 0;
        var child;
        var parent_rulelist = [];
        var flag = 0;
        var parent_perms = new Array(5).fill(0);
        var child_perms = new Array(5).fill(0);
        var child_rulelist = [];
        var count = 0;

        var files = [];

        for (var p = 0; p < properties.length; p++) {
          if (properties[p].parent != "") {
            // console.log(p);
            // console.log(properties[p]);
            filterbysubj = [];
            roles = [];
            parent = properties[p];
            index = 0;

            //console.log("parent");
            //console.log(parent);

            child = child_desc(fileStruct_mod, parent);
            //console.log("child");
            //console.log(child);

            properties.filter(function (element) {
              //if (element.subject == properties[p].subject)
              if (element.subject == properties[p].subject) {
                filterbysubj.push(element);
                if (!roles.includes(element.role)) roles.push(element.role);
              }
            });

            //console.log(roles);

            //console.log(filterbysubj);

            parent_rulelist = [];
            parent_perms = new Array(5).fill(0);

            parent_rulelist.push(properties[p].rulelist);
            //console.log(parent_rulelist);

            //if (parent_rulelist.length > 0)
            for (var i = 0; i < parent_rulelist[0].length; i++) {
              if (
                parent_rulelist[0][i].status == "active" &&
                parent_rulelist[0][i].permissionBoolean == "Set"
              ) {
                index = perms.indexOf(parent_rulelist[0][i].permissionType);
                parent_perms[index] = 1;
              } else if (
                parent_rulelist[0][i].status == "active" &&
                parent_rulelist[0][i].permissionBoolean == "Clear"
              ) {
                index = perms.indexOf(parent_rulelist[0][i].permissionType);
                parent_perms[index] = -1;
              }
            }

            for (var r = 0; r < roles.length; r++) {
              // for (var fs = 0; fs < filterbysubj.length; fs++) {
              files = [];

              filterbysubj.filter(function (el) {
                if (el.role == roles[r] && el.fpath.includes(parent.fpath))
                  files.push(el.fpath);
              });

              //console.log("files");
              //console.log(files);

              flag = 0;
              if (child.length == files.length - 1) {
                for (var f = 0; f < child.length; f++) {
                  child_rulelist = [];
                  child_perms = new Array(5).fill(0);

                  properties.filter(function (el) {
                    if (child[f] == el.fpath) {
                      child_rulelist.push(el.rulelist);
                    }
                  });

                  //child_rulelist.push(properties[f].rulelist);

                  //console.log(child_rulelist);
                  //console.log(count++);

                  for (var cr = 0; cr < child_rulelist[0].length; cr++) {
                    if (
                      child_rulelist[0][cr].permissionBoolean == "Set" &&
                      child_rulelist[0][cr].status == "active"
                    ) {
                      //console.log(child_rulelist[0][r]);
                      index = perms.indexOf(
                        child_rulelist[0][cr].permissionType
                      );
                      child_perms[index] = 1;
                    } else if (
                      child_rulelist[0][cr].status == "active" &&
                      child_rulelist[0][cr].permissionBoolean == "Clear"
                    ) {
                      index = perms.indexOf(
                        child_rulelist[0][cr].permissionType
                      );
                      child_perms[index] = -1;
                    }
                  }

                  if (
                    JSON.stringify(parent_perms) == JSON.stringify(child_perms)
                  ) {
                    //console.log("INCRMENTING FLAG");
                    flag++;
                  } //else console.log("no of file differ");
                }

                ///////insert bracket here

                if (flag == child.length) {
                  loop_child: for (var j = 0; j < child.length; j++) {
                    for (var i = dup_properties.length - 1; i >= 0; i--) {
                      //console.log(child[j]);
                      //console.log(i);
                      if (dup_properties[i].fpath == child[j]) {
                        //console.log("REMOVING PROPERTIES");
                        deleted_files.push(dup_properties[i]);
                        dup_properties.splice(i, 1);
                      }
                      //break loop_child;
                    }
                  }
                }
              }

              //else console.log("no of files differ");
              //}  // commenting it out
            }
            //console.log(filterbysubj);
            //console.log(roles);
          }
        }

        //console.log(dup_properties.length);
        //for (var dp = dup_properties.length - 1; dp >= 0; dp--)
        //console.log(dup_properties[dp]);

        /*************************************************** */
        //display only those arrows that fall exactly on the selected resource and not on sub-dirs or files within it
        /*
        console.log("filexmark");
        if (!d3.select("#filexmark").empty()) {
          //  if (
          //d3.select(".reversepropertyarrow").empty() &&
          //!d3.select("#filexmark").empty()
          //) {
          //console.log("entered check");
          var resource_name = d3
            .select("#file")
            ._groups[0][0].outerText.replace("file: ", "");
          //console.log(resource_name);
          for (var dp = dup_properties.length - 1; dp >= 0; dp--) {
            if (
              stringOperations(dup_properties[dp].fpath) !=
              stringOperations(resource_name)
            ) {
              //console.log("removing elements within directory");
              //console.log(dup_properties[dp]);

              dup_properties.splice(dp, 1);
              //--dp;
            } //else console.log(dup_properties[dp]);
          }
        }
        */

        //console.log("roleloop");
        var role = [];
        var filter_by_role = [];
        var users = [];
        var addRole = [];
        parent_perms = new Array(5).fill(0);
        child_perms = new Array(5).fill(0);
        var filter_by_obj = [];

        var properties = JSON.parse(JSON.stringify(dup_properties));

        dup_properties.filter(function (element) {
          if (!filter_by_obj.includes(element.fpath))
            filter_by_obj.push(element.fpath);
        });

        //console.log(filter_by_obj);

        for (var fo = 0; fo < filter_by_obj.length; fo++) {
          role = [];
          dup_properties.filter(function (element) {
            if (element.fpath == filter_by_obj[fo]) {
              if (!role.includes(element.role)) role.push(element.role);
              return element;
            }
          });

          //console.log(filter_by_obj[fo]);

          //console.log(role);

          for (r = 0; r < role.length; r++) {
            users = checkUsers(personnel, role[r]);

            var filter_by_role = dup_properties.filter(function (element) {
              if (
                element.role == role[r] &&
                element.fpath == filter_by_obj[fo]
              ) {
                return element;
              }
            });

            if (users.length == filter_by_role.length) {
              if (checkRulelist(users, role[r], filter_by_role)) {
                //console.log("adding role");
                //for (var d = 0; d < filter_by_role.length; d++)
                //console.log(filter_by_role[d]);
                filter_by_role[0].subject = filter_by_role[0].role;
                addRole.push(filter_by_role[0]);

                /*
                if (
                  !d3.select(".propertyarrow").empty() ||
                  !d3.select(".reversepropertyarrow").empty()
                ) {
                  d3.select(".intellibot")
                    .append("p")
                    .text(
                      " All users who are assigned the " +
                        role[r].toUpperCase() +
                        " role have the same permission settings for this resource "
                    );
                }
                */

                for (var ar = 0; ar < addRole.length; ar++) {
                  //console.log(addRole[ar]);
                  for (var dp = properties.length - 1; dp >= 0; dp--) {
                    if (addRole[ar].role == properties[dp].role) {
                      //console.log("removing");
                      //console.log(dup_properties[dp]);

                      properties.splice(dp, 1);
                      //break loop_role;
                    }
                  }
                }

                for (var ar = 0; ar < addRole.length; ar++)
                  properties.push(addRole[ar]);
              }
              /*
              else {
                //console.log("permission check failed");
                if (!d3.select(".reversepropertyarrow").empty())
                  d3.select(".intellibot")
                    .append("p")
                    .text(
                      "Permission settings for this resource differ between the users who are assigned the role of " +
                        role[r].toUpperCase() +
                        "S"
                    );
              }
              */
            }
            /* 
            else {
              if (
                d3.select(".reversepropertyarrow").empty() &&
                d3.select(".selecteduserelement").attr("id").split("_")[1] ==
                  role[r]
              ) {
                // for (var fr = 0; fr < filter_by_role.length; fr++)
                //  for (var dp = properties.length - 1; dp >= 0; dp--) {
                 //   if (properties[dp].fpath == filter_by_role[fr].fpath) {
                 //     properties.splice(dp, 1);
                 //   }
                 // } 

                if (!d3.select(".reversepropertyarrow").empty())
                  d3.select(".intellibot")
                    .append("p")
                    .text(
                      "Not all users who are assigned to " +
                        role[r].toUpperCase() +
                        " have access to this resource"
                    );
              }
            }
*/
            ////////////insert here
          }
        }

        /* for (var dp = 0; dp < dup_properties.length; dp++)
          console.log(dup_properties[dp]); */

        //for (var dp = 0; dp < properties.length; dp++)
        // console.log(properties[dp]);

        colorElements(properties, deleted_files);

        return properties;
      }

      function checkRulelist(users, role, properties) {
        //console.log("check rulelist");
        var perms = ["get", "list", "create", "update", "delete"];

        var parent_rulelist = [];
        var parent_perms = new Array(5).fill(0);
        var child_rulelist = [];
        var child_perms = new Array(5).fill(0);
        var index = 0,
          flag = 1;

        //console.log(properties);
        if (properties.length > 1) {
          parent_rulelist.push(properties[0].rulelist);
          //console.log(parent_rulelist);
          for (var i = 0; i < parent_rulelist[0].length; i++) {
            if (
              parent_rulelist[0][i].status == "active" &&
              parent_rulelist[0][i].permissionBoolean == "Set"
            ) {
              index = perms.indexOf(parent_rulelist[0][i].permissionType);
              parent_perms[index] = 1;
            } else if (
              parent_rulelist[0][i].status == "active" &&
              parent_rulelist[0][i].permissionBoolean == "Clear"
            ) {
              index = perms.indexOf(parent_rulelist[0][i].permissionType);
              parent_perms[index] = -1;
            }
          }

          for (var p = 1; p < properties.length; p++) {
            child_perms = new Array(5).fill(0);
            child_rulelist = [];

            child_rulelist.push(properties[p].rulelist);

            for (var i = 0; i < child_rulelist[0].length; i++) {
              if (
                child_rulelist[0][i].status == "active" &&
                child_rulelist[0][i].permissionBoolean == "Set"
              ) {
                index = perms.indexOf(child_rulelist[0][i].permissionType);
                child_perms[index] = 1;
              } else if (
                child_rulelist[0][i].status == "active" &&
                child_rulelist[0][i].permissionBoolean == "Clear"
              ) {
                index = perms.indexOf(child_rulelist[0][i].permissionType);
                child_perms[index] = -1;
              }
            }

            if (JSON.stringify(parent_perms) == JSON.stringify(child_perms)) {
              //console.log("INCRMENTING FLAG");
              flag++;
            }

            //////
          }
          //////////
        }
        if (flag == properties.length || properties.length == 1) {
          return true;
        } else {
        }
      }

      function colorElements(filtered_properties, deleted_files) {
        console.log("color elements");
        //console.log(filtered_properties);
        //console.log(deleted_files);
        //d3.select("#personnel").selectAll("circle").style("opacity", 0.1);
        d3.select("#resourcesg").selectAll("circle").style("opacity", 0.1);
        d3.select("#resourcesg").selectAll("text").style("opacity", 0.1);

        //d3.select(".selecteduserelement").style("fill", "none");

        if (filtered_properties.length == 0) {
          d3.select("#personnel").selectAll("circle").style("opacity", 0.1);
          d3.select("#personnel").selectAll("text").style("opacity", 0.1);

          d3.select("#users").style("opacity", 1);
          document.getElementById("users").nextSibling.style.opacity = 1;
        } else {
          d3.select("#personnel").selectAll("circle").style("opacity", 0.1);
          d3.select("#personnel").selectAll("text").style("opacity", 0.1);

          d3.select("#users").style("opacity", 1);
          document.getElementById("users").nextSibling.style.opacity = 1;

          console.log(filtered_properties.length);
          for (var i = filtered_properties.length - 1; i >= 0; i--) {
            //console.log(filtered_properties[i]);
            //console.log(i);

            if (checkDelete(filtered_properties[i].rulelist)) {
              //console.log("all delete confirmed");
              //console.log(filtered_properties[i].fpath);
              /* d3.select("#resourcesg")
                .select("#" + filtered_properties[i].fpath)
                .style("opacity", 0.1); */
              filtered_properties.splice(i, 1);
            } else {
              d3.select("#resourcesg")
                .select("#" + filtered_properties[i].fpath)
                .style("opacity", 1);

              document.getElementById(
                filtered_properties[i].fpath
              ).previousSibling.style.opacity = 1;

              if (!filtered_properties[i].role.includes("userid")) {
                d3.select("#users_" + filtered_properties[i].role).style(
                  "opacity",
                  "1"
                );
                document.getElementById(
                  "users_" + filtered_properties[i].role
                ).nextSibling.style.opacity = 1;

                //console.log("!userid");
              }
              /////
              if (
                filtered_properties[i].subject == filtered_properties[i].role
              ) {
                //console.log(filtered_properties[i]);

                var matching_ids = document.querySelectorAll(
                  '[id^="' + filtered_properties[i].role + '_"]'
                );
                for (var mi = 0; mi < matching_ids.length; mi++) {
                  ////
                  d3.select("#" + matching_ids[mi].getAttribute("id")).style(
                    "opacity",
                    "1"
                  );
                  document.getElementById(
                    matching_ids[mi].getAttribute("id")
                  ).nextSibling.style.opacity = 1;

                  /////
                }
              } else {
                if (filtered_properties[i].role.includes("userid")) {
                  ////
                  d3.select("#userid_" + filtered_properties[i].subject).style(
                    "opacity",
                    "1"
                  );
                  document.getElementById(
                    "userid_" + filtered_properties[i].subject
                  ).nextSibling.style.opacity = 1;
                  ///
                } else {
                  ////
                  d3.select(
                    "#" +
                      (filtered_properties[i].role +
                        "_" +
                        filtered_properties[i].subject)
                  ).style("opacity", "1");
                  document.getElementById(
                    filtered_properties[i].role +
                      "_" +
                      filtered_properties[i].subject
                  ).nextSibling.style.opacity = 1;
                  ////
                  d3.select("#users_" + filtered_properties[i].role).style(
                    "opacity",
                    "1"
                  );
                  /*  document.getElementById(
                  "users_" + filtered_properties[i].role
                ).nextSibling.style.opacity = 1; */
                  ////
                }
              }
            }
          }
        }

        //d3.selectAll(".tiescircle").style("opacity", 1);
        //console.log(deleted_files);
        for (var i = 0; i < 2; i++)
          for (var d = 0; d < deleted_files.length; d++) {
            //console.log(d.fpath);
            var lasthyphen = deleted_files[d].fpath.lastIndexOf("-");
            var parent = deleted_files[d].fpath.substring(0, lasthyphen);
            //console.log(parent);
            if (d3.select("#" + parent).style("opacity") == 1)
              d3.select("#" + deleted_files[d].fpath).style("opacity", 1);
          }

        d3.selectAll(".tiescircle")
          .filter(function (d) {
            d3.select(this.nextSibling).style("opacity", 1);

            var element_id = d3.select(this).attr("id");

            if (!element_id.includes("userid")) {
              d3.select("#users_" + element_id.split("_")[0]).style(
                "opacity",
                1
              );

              document.getElementById(
                "users_" + element_id.split("_")[0]
              ).nextSibling.style.opacity = 1;
            }

            return this.nextSibling;
          })
          .style("opacity", 1);

        d3.select("#resources").style("opacity", 1);
      }

      /*
       console.log(filtered_properties[i]);

            if (checkDelete(filtered_properties[i].rulelist)) {
              console.log(filtered_properties[i].fpath);
              d3.select("#resourcesg")
                .select("#" + filtered_properties[i].fpath)
                .style("opacity", 0.1);
            } 
            */
      function checkDelete(rulelist) {
        var counter = 5,
          del_flag = 0;

        for (var r = 0; r < rulelist.length; r++) {
          // console.log(rulelist[r]);
          if (rulelist[r].status == "active") {
            //counter++;
            if (rulelist[r].permissionBoolean == "Clear") del_flag++;
          }
        }
        //  console.log(counter + " " + del_flag);
        if (counter == del_flag) return true;
        else return false;
      }

      function parent_desc(fs, element) {
        //console.log(element);

        //console.log(fs);

        var rootNode = d3.hierarchy(fs[0]);

        var parent = [];

        rootNode.descendants().filter(function (d) {
          //console.log(d);
          if (
            stringOperations(element.fpath) == stringOperations(d.data.fpath)
          ) {
            //console.log(d.parent.data.fpath);
            parent.push(d.parent);
          }
        });

        //console.log(parent);
        return parent;
      }

      function child_desc(fs, element) {
        //console.log("CHILD DESC");
        //console.log(fs);
        //console.log(element);
        //console.log(element[0].data.fpath);

        var child = [];
        //console.log(rootNode.descendants());

        rootNode.descendants().filter(function (d) {
          //console.log(d);
          //console.log(d.descendants());
          //console.log(element.fpath + " " + d.data.fpath);
          if (d.data.name != ".")
            if (
              stringOperations(element.fpath) == stringOperations(d.data.fpath)
            ) {
              //console.log(d.descendants());
              for (var i = 1; i < d.descendants().length; i++)
                child.push(stringOperations(d.descendants()[i].data.fpath));
            }
          //find children of element
        });

        //console.log(child);
        //console.log(parent);
        return child;
      }

      function traverseFileSystem(fs, node_ancestors) {
        //console.log(fs);
        for (let i = fs.length - 1; i >= 0; i--) {
          for (let j = fs[i].children.length - 1; j >= 0; j--) {
            if (fs[i].children[j].children.length > 0)
              traverseFileSystem(fs[i].children[j].children, node_ancestors);
            else if (
              !node_ancestors.includes(
                stringOperations(fs[i].children[j].fpath)
              )
            ) {
              fs[i].children.splice(j, 1);
            }
          }

          if (fs[i].children.length == 0) {
            if (!node_ancestors.includes(stringOperations(fs[i].fpath))) {
              fs.splice(i, 1);
            }
          } else traverseFileSystem(fs[i].children, node_ancestors);
        }
        //console.log(fs);
        return fs;
      }

      function traverse(personnel, parentelement) {
        if (personnel.children)
          for (var i = 0; i < personnel.children.length; i++) {
            if (stringOperations(personnel.children[i].name) == parentelement) {
              //     console.log(personnel.children[i]);
              if (document.getElementById("newelementtype").value == "Object")
                personnel.children[i].children.push({
                  name: document.getElementById("newelement").value,
                  type: document.getElementById("newelementtype").value,
                  size: 100,
                });
              else
                personnel.children[i].children.push({
                  name: document.getElementById("newelement").value,
                  type: document.getElementById("newelementtype").value,
                  children: [],
                });
              //   console.log(personnel);
              return;
            }
            traverse(personnel.children[i], parentelement);
          }
      }

      function reverse_addTies(matching_ids) {
        //console.log("HIIIII");
        //console.log(matching_ids);
        var similar_nodes = [];
        //console.log(similar_nodes);

        for (var i = 0; i < matching_ids.length; i++) {
          if (matching_ids[i].getAttribute("id").includes("userid")) {
            similar_nodes.push({
              x: parseInt(matching_ids[i].getAttribute("cx")),
              y: parseInt(matching_ids[i].getAttribute("cy")),
            });
          }
        }

        for (var i = 0; i < matching_ids.length; i++) {
          if (
            !matching_ids[i].getAttribute("id").includes("userid") &&
            (matching_ids[i].__data__.data.type == "object" ||
              matching_ids[i].__data__.data.type == "class")
          ) {
            similar_nodes.push({
              x: parseInt(matching_ids[i].getAttribute("cx")),
              y: parseInt(matching_ids[i].getAttribute("cy")),
            });
          }
        }

        //console.log(similar_nodes);

        for (let j = 1; j < similar_nodes.length; j++) {
          //

          d3.select("#treesvg")
            .select("#personnel")
            .append("line")
            .classed("ties", true)
            .style("stroke", "black")
            .style("stroke-width", 10)
            .attr("x1", similar_nodes[0].x)
            .attr("y1", similar_nodes[0].y)
            .attr("x2", similar_nodes[j].x)
            .attr("y2", similar_nodes[j].y);

          d3.select("#treesvg")
            .select("#personnel")
            .append("line")
            .classed("ties", true)
            .style("stroke", "white")
            .style("stroke-width", 4)
            .attr("x1", similar_nodes[0].x)
            .attr("y1", similar_nodes[0].y)
            .attr("x2", similar_nodes[j].x)
            .attr("y2", similar_nodes[j].y);
        }
      }

      function reverse_drawArrows(properties, original_propertiesArr) {
        //treelistresources(fileStruct_mod);

        //console.log(properties);
        //console.log(nodeType);

        var node = d3.selectAll(".selectedresourceelement")._groups[0][0];

        //console.log(node);
        //console.log(node.attr("id"));

        var node_fpath = node.__data__.data.fpath;

        //console.log(stringOperations(node_fpath));

        var svg = d3.select("#treesvg");
        //svg.selectAll(".reverserpropertyarrow").remove();
        // svg.selectAll(".reversepropertyarrow").remove();

        //var filtered_properties = [];

        filtered_properties = properties.filter(function (d) {
          if (stringOperations(d.fpath).includes(stringOperations(node_fpath)))
            return d;
        });

        //console.log(filtered_properties);
        //svg.append("g").classed( "reversepropertyarrow");

        /*  for (let i = 0; i < filtered_properties.length; i++) {
          console.log(filtered_properties[i]);
        }
 */

        for (let i = 0; i < filtered_properties.length; i++) {
          var node_role = filtered_properties[i].role.split("+");
          var element_id = "";

          const rulelist = filtered_properties[i].rulelist;
          for (let r = 0; r < node_role.length; r++) {
            //console.log(rulelist);

            var matching_ids = [];

            if (node_role[r].includes("userid")) {
              element_id = "userid_" + filtered_properties[i].subject;
            } else if (
              filtered_properties[i].subject == filtered_properties[i].role
            ) {
              element_id = "users" + "_" + filtered_properties[i].role;
            } else {
              element_id = node_role[r] + "_" + filtered_properties[i].subject;
            }

            //console.log();

            //console.log(matching_ids);
            //console.log(element_id);

            //console.log(filtered_properties[i]);
            //console.log(stringOperations(filtered_properties[i].fpath));

            var transcoords = d3
              .select("#treesvg")
              .select("#personnel")
              .attr("transform")
              .replace("translate(", "")
              .replace(")", "");

            var offsetx = transcoords.split(",")[0];
            var offsety = transcoords.split(",")[1];

            var x1 =
              parseInt(
                d3
                  .select("#personnel")
                  .select("#" + element_id)
                  .attr("cx")
              ) +
              parseInt(offsetx) +
              parseInt(
                d3
                  .select("#personnel")
                  .select("#" + element_id)
                  .attr("r")
              );

            var y1 =
              parseInt(
                d3
                  .select("#personnel")
                  .select("#" + element_id)
                  .attr("cy")
              ) + parseInt(offsety);
            //var x2 = parseInt(d3.select("#resources").select("#" + filtered_properties[i].object_parent+"_"+filtered_properties[i].object).attr("cx")) + parseInt(resourcesTranslateCoordx);
            //var y2 = parseInt(d3.select("#resources").select("#" + filtered_properties[i].object_parent+"_"+filtered_properties[i].object).attr("cy"))+parseInt(resourcesTranslateCoordy);

            //console.log(stringOperations(filtered_properties[i].fpath));

            var x2 =
              parseInt(
                d3
                  .select("#resourcesg")
                  .select("#" + stringOperations(filtered_properties[i].fpath))
                  .attr("cx")
              ) +
              parseInt(resourcesTranslateCoordx) -
              parseInt(
                d3
                  .select("#resourcesg")
                  .select("#" + stringOperations(filtered_properties[i].fpath))
                  .attr("r")
              );
            var y2 =
              parseInt(
                d3
                  .select("#resourcesg")
                  .select("#" + stringOperations(filtered_properties[i].fpath))
                  .attr("cy")
              ) + parseInt(resourcesTranslateCoordy);

            d3.select("#resourcesg")
              .select("#" + stringOperations(filtered_properties[i].fpath))
              .classed("arrowcircle", true)
              .style("stroke-width", arrowcircle_strokewidth);

            /*  document.getElementById(
              stringOperations(filtered_properties[i].fpath)
            ).class = "arrowircletext";

            document.getElementById(
              stringOperations(filtered_properties[i].fpath)
            ).previousSibling.innerHTML = filtered_properties[i].object;

            document.getElementById(
              stringOperations(filtered_properties[i].fpath)
            ).previousSibling.style.opacity = 1; */

            d3.select("#personnel")
              .select("#" + element_id)
              .classed("arrowcircle", true)
              .style("stroke-width", arrowcircle_strokewidth);

            var c1 = x1 + 100 + "," + (y1 - 100);
            var c2 = x2 - 100 + "," + (y2 - 100);

            var pathvar =
              "M" + x1 + "," + y1 + " C" + c1 + " " + c2 + " " + x2 + "," + y2;

            //console.log(pathvar);

            var permissionslist = ["get", "list", "create", "update", "delete"];

            svg
              .select(".reversepropertyarrow")
              .append("path")
              //.classed( "path")
              .classed("path-propertyarrow-" + i, true)
              .style("stroke", "green")
              .style("stroke-width", "8")
              .style("opacity", "0.3")
              .style("fill", "none")
              .attr("d", pathvar)
              .attr("marker-end", "url(#arrow)")
              .on("mouseover", function (e) {
                //console.log(rulelist);
                //console.log(d);
                var perms = ["list", "get", "create", "update", "delete"];
                var rlist = [];
                for (var p = 0; p < perms.length; p++) {
                  rlist.push({
                    permissions: perms[p],
                    settings: "",
                    ruleID: "",
                    role: "",
                    selectedrole: "",
                  });
                }

                //console.log(filtered_properties[i]);

                var filtered_rulelist = [];

                if (
                  filtered_properties[i].role == filtered_properties[i].subject
                ) {
                  original_propertiesArr.filter(function (d) {
                    if (
                      filtered_properties[i].fpath == d.fpath &&
                      checkUsers(personnel, filtered_properties[i].role)[0] ==
                        d.subject &&
                      filtered_properties[i].role != d.role
                    ) {
                      for (var fr = 0; fr < d.rulelist.length; fr++) {
                        if (d.rulelist[fr].role.includes("userid"))
                          d.rulelist[fr].role =
                            "userid:" +
                            checkUsers(
                              personnel,
                              filtered_properties[i].role
                            ).join(",");
                        filtered_rulelist.push(d.rulelist[fr]);
                      }
                      //filtered_rulelist.push(d.rulelist);
                    }
                  });
                } else
                  original_propertiesArr.filter(function (d) {
                    //console.log(filtered_properties[i].fpath);
                    //console.log(d);
                    if (
                      filtered_properties[i].fpath == d.fpath &&
                      filtered_properties[i].subject == d.subject &&
                      filtered_properties[i].role != d.role
                    ) {
                      //console.log(d);
                      for (var fr = 0; fr < d.rulelist.length; fr++)
                        filtered_rulelist.push(d.rulelist[fr]);
                      //filtered_rulelist.push(d.rulelist);
                    }
                  });

                //console.log(filtered_properties[i].fpath);
                //console.log(filtered_rulelist);

                d3.select(this).style("opacity", 1);

                //style='font-color:green;'
                var perm_text = "";

                if (
                  filtered_properties[i].role == filtered_properties[i].subject
                )
                  perm_text =
                    "<b>Role: </b> " +
                    capitalCase(filtered_properties[i].role) +
                    "</br>(" +
                    checkUsers(personnel, filtered_properties[i].role) +
                    ")</br><b> Resource: </b><tt>" +
                    filtered_properties[i].fpath.replaceAll("-", "/") +
                    " </tt></br></br>";
                else if (filtered_properties[i].role.includes("userid"))
                  perm_text =
                    "<b>UserID: </b> " +
                    capitalCase(
                      filtered_properties[i].role.replace("userid", "")
                    ) +
                    "</br><b> Resource: </b><tt>" +
                    filtered_properties[i].fpath.replaceAll("-", "/") +
                    " </tt></br></br>";
                else
                  perm_text =
                    "<b>User / Role: </b>" +
                    capitalCase(filtered_properties[i].subject) +
                    " / " +
                    capitalCase(filtered_properties[i].role) +
                    "</br><b> Resource: </b><tt>" +
                    filtered_properties[i].fpath.replaceAll("-", "/") +
                    " </tt></br></br>";

                perm_text =
                  perm_text +
                  "<table class='table table-bordered'>" +
                  "<thead><tr height='50px'>" +
                  "<th>Permissions</th> " +
                  "<th>Settings</th>" +
                  "<th>RuleNo.</th>" +
                  "<th>Role</th>" +
                  "</tr></thead><tbody>";

                if (filtered_rulelist.length > 0)
                  for (let j = 0; j < filtered_rulelist.length; j++) {
                    if (filtered_rulelist[j].status == "active") {
                      {
                        var index = perms.indexOf(
                          filtered_rulelist[j].permissionType
                        );

                        if (filtered_rulelist[j].permissionBoolean == "Set")
                          rlist[index].settings = "Granted";
                        else rlist[index].settings = "Denied";

                        rlist[index].ruleID = filtered_rulelist[j].ruleID;
                        rlist[index].role = filtered_rulelist[j].role;
                        rlist[index].currentrole = "no";
                      }
                    } //else perm_text = perm_text + " :Perms inactive";
                  }

                //console.log(rulelist);
                for (let j = 0; j < rulelist.length; j++) {
                  if (rulelist[j].status == "active") {
                    {
                      var index = perms.indexOf(rulelist[j].permissionType);

                      if (rulelist[j].permissionBoolean == "Set")
                        rlist[index].settings = "Granted";
                      else rlist[index].settings = "Denied";

                      rlist[index].ruleID = rulelist[j].ruleID;
                      rlist[index].role = rulelist[j].role;
                      rlist[index].currentrole = "yes";
                    }
                  } //else perm_text = perm_text + " :Perms inactive";
                }

                //console.log(rlist);

                for (let r = 0; r < rlist.length; r++) {
                  if (rlist[r].currentrole == "yes")
                    perm_text =
                      perm_text +
                      "<tr style='height:10px; background-color:rgb(245, 231, 234,0.4)'>" +
                      "<td>" +
                      rlist[r].permissions +
                      " </td>";
                  else
                    perm_text =
                      perm_text +
                      " <tr>" +
                      "<td>" +
                      rlist[r].permissions +
                      " </td>";

                  if (rlist[r].settings == "Granted")
                    perm_text =
                      perm_text +
                      "<td><span style='color:green'> Granted </span></td>";
                  else if (rlist[r].settings == "Denied")
                    perm_text =
                      perm_text +
                      "<td><span style='color:red'>Denied </span></td>";
                  perm_text = perm_text + "<td>" + rlist[r].ruleID + "</td>";
                  perm_text =
                    perm_text + " <td>" + rlist[r].role + "</td></tr>";
                }

                //console.log(filtered_rulelist.length);

                perm_text = perm_text + "</tbody></table>";
                /*<td><span style='color:green'> Granted </span></td>*/
                //console.log(perm_text);

                d3.select("#personnel_tooltip")
                  .html(perm_text)
                  .style("font-size", "10px")
                  .style("opacity", 1)
                  .style("width", "300px")
                  .attr(
                    "transform",
                    "translate(" + 1400 + "," + (y1 + y2) / 2 + ")"
                  )
                  .style("left", window.innerWidth / 2 - 150 + "px")
                  .style("top", 400 + "px");
              })
              .on("mouseout", function (d) {
                //d3.select("#g-propertyarrow-" + i)
                //.selectAll("circle")
                //.style("opacity", 0.3);
                d3.selectAll(".ties").remove();
                d3.select(this).style("opacity", 0.3);

                d3.select("#personnel_tooltip")
                  .style("opacity", 0)
                  //.style("width", "0px")
                  // .style("height", "0px")
                  .style("left", "0px")
                  .style("top", "0px")
                  .html("");
              });
          }
        }

        d3.selectAll("circle").classed("drawArrow", false);
      }

      //START OF RESOURCES SVG

      function treelistresources(resources, properties) {
        //console.log("resources");
        //console.log(resources);
        //console.log(properties);

        //console.log("treelist resources");

        d3.select("#root").select("#treesvg").select("#resourcesg").remove();

        d3.select("#root")
          .select("#treesvg")
          .selectAll(".propertyarrow")
          .remove();

        d3.select("#root")
          .select("#treesvg")
          .selectAll(".reversepropertyarrow")
          .remove();

        var margin = { top: 130, right: 120, bottom: 130, left: 150 },
          width = 1000 - margin.left - margin.right,
          height = resourcesTranslateCoordx - margin.top - margin.bottom;

        //Create SVG element
        var svg = d3
          .select("#root")
          .select("#treesvg")
          .style("border-width", "1px")
          .style("border-style", "solid")
          .style("border-color", "black")
          //.attr("overflow", "auto")
          .style("background-color", "white")
          .on("click", function (event) {
            /*
                                 console.log(" RESOURCES CLICK");
                             //    console.log(root);
                                 resources_zoom(event, resources_root);})  */
            // console.log(event);
            //console.log(d3.event.keycode);
            /*   if (event.altKey) {
              console.log(" RESOURCES CLICK");
              resources_zoom(event, resources_root);
            } */
          })
          .append("g")
          .attr("id", "resourcesg")
          .attr(
            "transform",
            "translate(" +
              resourcesTranslateCoordx +
              "," +
              resourcesTranslateCoordy +
              ")"
          );

        //console.log(width+" "+height);

        if (d3.select("#root").select("#resources_tooltip").empty())
          d3.select("#root")
            .append("div")
            .attr("id", "resources_tooltip")
            .style("left", 0)
            .style("top", 0)
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("opacity", 0);

        if (d3.select("#root").select("#resources_tooltip_title").empty())
          d3.select("#root")
            //.select("#svgdiv")
            .append("div")
            .attr("id", "resources_tooltip_title")
            .style("opacity", 0)
            .style("left", 0)
            .style("top", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "5px")
            .style("border-radius", "15px")
            .style("padding", "5px");

        //var sizeScale = d3.scaleLinear().range([25, 35]);

        //   console.log(resources);
        var fs = [{ name: ".", children: resources, type: "root" }];

        //console.log(fs);

        var packLayout = d3.pack().padding(20).size([1790, 1790]);

        //var rootNode = d3.hierarchy(resources[0]);
        var rootNode = d3.hierarchy(fs[0]);
        var resources_rootNode = rootNode;

        // console.log(rootNode);

        rootNode.sum(function (d) {
          //console.log(d);
          //if (d.children) return d.children.length + 5;
          //else return 1;
          return 1;
        });

        resources_root = packLayout(rootNode);

        var resources_focus = resources_root;

        //console.log(rootNode);
        //console.log(resources_root);
        //console.log(resources_root)

        //   console.log(resources);
        // console.log("ROOTNODE DESC");
        //console.log(rootNode.descendants());

        var nodes = d3
          .select("#treesvg #resourcesg")
          .selectAll("g")
          .data(rootNode.descendants())
          .enter()
          .append("g")
          .attr("transform", function (d, i) {
            //  console.log(i+" "+d.data.name);
            return "translate(" + 0 + "," + 0 + ")";
          });

        nodes
          .append("text")
          .style("opacity", function (d) {
            //console.log(d);
            //if (d.data.type == "root") return 1;
            //else return 0;

            if (d.depth <= 2) return 1;
            else return 0;
            /* else if (
              d.depth >= 2 ||
              (d.depth == 1 &&
                (node_id == "resources-sch" ||
                  node_id == "resources-db" ||
                  node_id == "resources-apps"))
            ) {
            } */
          })
          .style("fill", function (d) {
            if (d.data.type == "file") return "red";
            else return "none;";
          })
          .attr("x", function (d) {
            return d.x - 20;
          })
          .attr("y", function (d) {
            /* if (d.data.type == "object") return d.y - objradius;
            else return d.y - d.r; */

            if (d.data.type == "file") return d.y + 5 * objradius;
            else return d.y - d.r + 10;
          })
          .attr("dx", -40)
          .attr("dy", function (d) {
            if (d.data.name == "usr") return 20;
            else return -20;
          })
          .text(function (d) {
            // console.log(d.data);
            //return d.children === undefined ? d.data.name : '';
            if (d.data.name == ".") return "resources";
            else if (d.depth <= 1 || (d.depth == 2 && d.data.parent == "usr"))
              return d.data.name;
            else return "";
          });

        nodes
          .append("circle")
          .attr("id", function (d) {
            if (d.data.name == ".") return "resources";
            else return stringOperations(d.data.fpath);
          })
          .attr("r", function (d) {
            //  console.log(d.data.name + " " + d.r + " " + (d.r));
            if (d.data.type == "file") return objradius - 2;
            else return d.r;

            //if (d.data.type == "file") return objradius;
            //else return d.r + 4;
          })
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          })
          .style("stroke", "black")
          .style("stroke-width", "2")
          .style("opacity", 1)
          .style("fill", function (d) {
            //  console.log(d.data.type);
            if (d.data.type == "file")
              //  return "#6378D3";
              return "red";
            else return "none";
          })
          .on("click", function (event, d, i) {
            //console.log(document.getElementById("allperms").checked);
            if (document.getElementById("allperms").checked == false) {
              /*
              if (event.shiftKey) {
                console.log("shift click");

                var transform = d3.select(this.parentNode).style("transform");

                if (!transform.includes("1.4"))
                  d.descendants().forEach(function (d) {
                    document.getElementById(
                      stringOperations(d.data.fpath)
                    ).parentElement.style.transform =
                      "translate(0,0) scale(1.4)";

                    // d3.select("#" + stringOperations(d.data.fpath)).attr(
                //  "transform",
                //  "translate(0,0) scale(1.2)"
                ); 
                  });
                else
                  d.descendants().forEach(function (d) {
                    document.getElementById(
                      stringOperations(d.data.fpath)
                    ).parentElement.style.transform = "translate(0,0) scale(1)";

              //        d3.select("#" + stringOperations(d.data.fpath)).attr(
               //   "transform",
               //   "translate(0,0) scale(1.2)"
                ); 
                  });
              } else if (
                event.altKey &&
                d3.select(this).style("opacity") > 0.1
              ) {
                resources_showElement(
                  d3.select(this),
                  d,
                  d3.select(this.parentNode)
                );
                //d3.selectAll(".propertyarrow").remove();
                //d3.selectAll(".reversepropertyarrow").remove();
              } else */
              //console.log(d3.select(this).style("opacity"));
              if (
                d.data.type != "root" &&
                d3.select(this).style("opacity") > 0.1
              ) {
                var element = d3
                  .select("#root")
                  .select("#treesvg")
                  .selectAll(".selectedresourceelement")
                  .style("stroke", "black")
                  .style("stroke-width", "2");

                d3.select("#resources_tooltip")
                  .style("opacity", "0")
                  .style("left", 0)
                  .style("top", 0)
                  .html("");

                //selectElement(this);
                // console.log(d.data.fpath);
                if (d.data.name != ".")
                  element.classed("selectedresourceelement", false);

                if (d.data.type == "directory") {
                  resources_rootNode.descendants().filter(function (element) {
                    if (element.data.type != "root")
                      if (element.data.fpath.includes(d.data.fpath)) {
                        //console.log(element.data.fpath);
                        d3.select(
                          "#" + stringOperations(element.data.fpath)
                        ).style("opacity", 1);
                      }
                  });
                }

                //d3.select(this).classed( "selectedresourceelement");
                //console.log(d3.select(this));
                d3.select(".highlighting-summary")
                  .selectAll("p")
                  .each(function (di) {
                    if (
                      d3.select(this)._groups[0][0].outerText.includes("file:")
                    ) {
                      d3.select(this).text(
                        "file: " + d.data.fpath.replaceAll("-", "/") + " "
                      );
                      d3.select(this)
                        .insert("span")
                        .classed("fa-sharp fa-solid fa-xmark", true)
                        .attr("id", "filexmark")
                        .on("click", function (d) {
                          d3.select(this.parentNode).text("file: ");

                          var element = d3
                            .select("#root")
                            .select("#treesvg")
                            .selectAll(".selectedresourceelement")
                            .style("stroke", "black")
                            .style("stroke-width", "2")
                            .classed("selectedresourceelement", false);

                          //console.log(fileStruct_mod);

                          //if (d3.select("#userxmark").empty())
                          //  treelistresources(fileStruct_mod, properties);
                          //else {
                          d3.selectAll(".reversepropertyarrow").remove();
                          if (d3.select("#userxmark").empty()) {
                            initial_drawArrows();
                          } else filterProperties(properties);
                          //}
                        });
                    }
                  });

                d3.select(this)
                  .classed("selectedresourceelement", true)
                  .style("stroke", "orange")
                  .style("stroke-width", selectedelement_strokewidth);

                filterProperties(properties);
              }

              d3.select(this.parentNode)
                .select("text")
                .style("fill", "darkOrange")
                .text();
            } else {
              if (d3.select(".alert-message").empty()) {
                d3.select("#root")
                  .append("div")
                  .attr(
                    "class",
                    "alert-message alert alert-warning alert-dismissible fade in"
                  )
                  .style("opacity", 1)
                  .html(
                    "<b>Warning!</b> You can't filter by resources when you're viewing all permissions for a user.  "
                  );

                d3.select("#root")
                  .select(".alert-message")
                  .append("a")
                  .attr("href", "#")
                  .attr("class", "close")
                  .attr("data-bs-dismiss", "alert")
                  .attr("aria-label", "close")
                  .html("&times;");
              } else d3.select(".alert-message").remove();
            }
          })
          .on("mouseover", function (e, d) {
            if (d3.select(this).style("opacity") == 1) {
              var obj_details = d3.select(this)._groups[0][0].__data__.data;

              var children = [];
              if (d.data.type == "directory" || d.data.type == "root")
                for (var c = 0; c < d.children.length; c++) {
                  children.push({
                    name: d.children[c].data.name,
                    type: d.children[c].data.type,
                  });
                }

              //console.log(d);
              //console.log(children.join("+"));
              var text = "";

              if (d3.select(this).attr("id") == "resources") {
                text =
                  " <b>Resource name: </b> Root Folder <br/> <br/> <b>Sub-folders/files: </b></br>";
                for (var c = 0; c < children.length; c++) {
                  if (children[c].type == "directory")
                    text = text + "+--" + children[c].name + "</br>";
                  else text = text + "|--" + children[c].name + "</br>";
                }

                d3.select("#resources_tooltip_title")
                  .html(text)
                  .style("font-size", "10px")
                  .style("left", e.pageX + "px")
                  .style("top", e.pageY + "px")
                  .style("text-align", "left")
                  .style("opacity", 1);
              } else if (d.data.type == "directory") {
                text =
                  " <b>Resource: </b>" +
                  d.data.fpath.replaceAll("-", "/") +
                  "</br></br> <b>Sub-folders/files: </b></br>";
                for (var c = 0; c < children.length; c++) {
                  if (children[c].type == "directory")
                    text = text + "+--" + children[c].name + "</br>";
                  else text = text + "|--" + children[c].name + "</br>";
                }

                d3.select("#resources_tooltip_title")
                  .html(text)
                  .style("font-size", "10px")
                  .style("left", e.pageX + "px")
                  .style("top", e.pageY + "px")
                  .style("text-align", "left")
                  .style("opacity", 1);
              } else if (d.data.type == "file") {
                text =
                  " <b>Resource: </b>" +
                  d.data.fpath.replaceAll("-", "/") +
                  "</br>";
                d3.select("#resources_tooltip_title")
                  .html(text)
                  .style("font-size", "10px")
                  .style("left", e.pageX + "px")
                  .style("top", e.pageY + "px")
                  .style("text-align", "left")
                  .style("opacity", 1);
              }

              //greynow
              d3.select(this)
                //.classed( "hoveredelement")
                .style("fill", "grey")
                .style("stroke", "red")
                .style("stroke-width", "4")
                .style("opacity", 0.2);

              /*
              d3.select(this.parentNode)
                .select("text")
                //.style("font-size","30px")
                .style("fill", "darkOrange");
                */
            }
          })
          .on("mouseout", function (d) {
            if (d3.select(this).style("opacity") > 0.1) {
              d3.select("#resources_tooltip_title")
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html("");

              d3.select(this)
                .style("fill", function (d) {
                  //console.log(d.data.type);
                  if (d.data.type == "file") return "red";
                  else return "none";
                })
                .style("stroke", "black")
                .style("stroke-width", "2")
                .style("opacity", 1);

              d3.select("#root")
                .select("#treesvg")
                .selectAll(".selectedresourceelement")
                .style("stroke", "orange")
                .style("stroke-width", selectedelement_strokewidth);

              d3.select("#resources_tooltip_title").html("");

              /*
              d3.select(this.parentNode)
                .select("text")
                .style("opacity", 1)
                .style("fill", function (d) {
                  if (d.data.type == "file")
                    //  return "#6378D3";
                    return "red";
                  else return "black";
                });
                */
            }
          });
      }

      //console.log("start of cdac");
      var personnel = transformPersonnel(userStructCD);
      createProperties(userStructCD, personnel, fileStruct, ruleStruct);
      treelistpersonnel(personnel, properties);
      treelistresources(fileStruct, properties);
      initial_drawArrows();
    },
    [data.length]
  );

  return (
    <>
      <div className="highlighting-summary" logsource="SummaryPanel"></div>
      <div className="svg-wrapper" logsource="Tool">
        <svg
          ref={ref}
          className="d3-svg"
          id="treesvg"
          logsource="Tool"
          viewBox="0 0 4200 1900"
          style={{
            margin: "auto",
            border: "1px solid black",
            cursor: "pointer",
          }}
        >
          <defs>
            <marker
              id="arrow"
              refX={9}
              refY={6}
              markerWidth={8}
              markerHeight={8}
              orient="auto"
              //orient={0}
              viewBox={"0 0 12 12"}
            >
              <path d="M2,2 L10,6 L2,10 L2,2" fill="green" opacity="0.9" />
            </marker>
          </defs>
        </svg>
      </div>
    </>
  );
}
