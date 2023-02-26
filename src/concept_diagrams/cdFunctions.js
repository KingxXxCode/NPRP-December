var numslashes = 0;
var filepath = [];
var properties = [];
var propertiesArr = [];
var filteredpropertiesArr = [];
var personnelstruct = [];
var starfpath = [];
var fileslist = [];
var folder;
var personnelbyuser = [];

function createProperties(personnelbyuser, personnel, resources, rules) {
  /*  console.log(personnel);
     console.log(resources);
     console.log(rules); */
  personnelbyuser = personnelbyuser;
  properties = [];
  propertiesArr = [];
  filteredpropertiesArr = [];

  var rulenum = 6;
  for (var r = 0; r < rules.length; r++) {
    // for (var r = rulenum - 3; r < rulenum; r++) {
    //console.log(rules[r].match + " " + r);
    //console.log(rules[r].permissions);
    fileslist = [];
    //  console.log(rules[r]);
    var fpath = rules[r].match.replace(".", "resources");
    filepath = fpath.split("/");
    //console.log(filepath);
    // if (!filepath.includes("*"))
    traverseFilepath(rules[r], resources, personnel, filepath);
    //else
    //  traverseStarFilepath(rules[r], resources, personnel, filepath);
  }

  properties = filterProperties(properties, personnel);

  d3.select("#table").selectAll("div").remove();

  new gridjs.Grid({
    columns: ["subject", "permission level", "object"],
    data: propertiesArr,
    search: true,
    sort: true,
    pagination: {
      limit: 20,
      previous: "⬅️",
      next: "➡️",
      showing: "👓 Displaying",
      results: () => "Records",
    },
    style: {
      td: {
        border: "1px solid #ccc",
      },
      table: {
        "font-size": "15px",
        "margin-left": "20px",
      },
    },
  }).render(document.getElementById("table"));

  treelistpersonnel(personnel, properties);
  treelistresources(resources, properties);
}

function traverseFilepath(rules, resources, personnel, filepath) {
  fileslist = [];
  // console.log("traversefilepath");
  //console.log(rules);
  // console.log(filepath);
  //console.log(resources);
  // console.log(personnel);

  if (filepath.length == 1) {
    fileslist = traverseRootFilepath(resources);
    //console.log(fileslist);
    pushProperties(rules, fileslist, personnel);
  } else {
    for (var f = 0; f < filepath.length; f++) {
      // console.log(filepath[f]);
      //console.log("F" + f);
      for (var r = 0; r < resources.children.length; r++) {
        //console.log("R" + r);
        if (filepath[f] == resources.name) {
          // console.log(resources.name);
          if (f == filepath.length - 1) {
            //   console.log("end of file");
            //if (filepath[f] != "[name]") {
            fileslist = [];
            // console.log("end of file " + filepath[f]);

            /*  console.log(resources);
                         console.log(resources.name + " " + resources.type);
                         console.log(fileslist); */
            // console.log(fileslist.push("hello"));

            fileslist.push({ name: resources.name, type: resources.type });

            // console.log(resources.children[r]);

            // console.log(traverseRootFilepath(resources));
            var fileslistarr = traverseRootFilepath(resources);
            //console.log(fileslistarr.length);

            // console.log(fileslistarr[0]);

            //  for (var m = 0; m < fileslistarr.length; m++)
            //     fileslist.push(fileslistarr[m]);

            //        console.log(fileslist);
            pushProperties(rules, fileslist, personnel);
            pushProperties(rules, fileslistarr, personnel);
            // }
          } else if (f < filepath.length - 1) {
            //  console.log("not the end of filepath " + filepath[f]);
            //  console.log(resources);
            traverseFilepath(rules, resources.children[r], personnel, filepath);

            if (filepath[f + 1] == "[name]") {
              //console.log(filepath[f]);
              // console.log("[[name]] " + filepath[f]);
              // console.log(f);
              // console.log(resources.name);
              if (resources.parent == filepath[f - 1]) {
                //console.log("MATCH");
                //  console.log(resources);
                traverseUserIDFilePath(rules, personnel, resources);
              }
              // break;
              ++f;
            }

            /*  if (filepath[f + 1] == "*") {
                             // console.log(filepath[f]);
                             //console.log("* " + filepath[f]);
 
                             traverseFilepath(rules, resources.children[r], personnel, filepath);
 
                               if (filepath[f + 1] == "[name]") {
                                  console.log("else [name]");
                                  traverseUserIDFilePath(rules, personnel, resources);
          
                              } 
                             ++f;
                         } */
          }
        } else if (filepath[f] == "*") {
          // console.log(filepath[f]);
          //  console.log("* " + filepath[f]);
          //console.log(resources.children[r]);
          fileslist = traverseFilepath(
            rules,
            resources.children[r],
            personnel,
            filepath
          );

          if (filepath[f + 1] == "[name]") {
            //console.log(filepath[f]);
            // console.log("[[name]] " + filepath[f]);
            // console.log(f);
            // console.log(resources.name);
            if (resources.parent == filepath[f - 1]) {
              //console.log("MATCH");
              //  console.log(resources);
              traverseUserIDFilePath(rules, personnel, resources);
            }
            // break;
            ++f;
          }
        }
      }
    }
  }
  //console.log(fileslist);

  // console.log("end");
  //  return files;
}

function traverseRootFilepath(resources) {
  //  console.log("traverse root filepath")
  // fileslist = [];

  for (var r = 0; r < resources.children.length; r++) {
    //  console.log(resources.children.length);

    fileslist.push({
      name: resources.children[r].name,
      type: resources.children[r].type,
    });

    // console.log("calling traverse");
    traverseRootFilepath(resources.children[r]);
  }

  return fileslist;
}

function traverseRootFilepathwithSubject(resources, subject) {
  // fileslist = [];

  fileslist.push({
    name: resources.name,
    type: resources.type,
    subject: subject,
    role: "userid:" + subject,
  });
  for (var r = 0; r < resources.children.length; r++) {
    //  console.log(resources.children.length);

    fileslist.push({
      name: resources.children[r].name,
      type: resources.children[r].type,
      subject: subject,
      role: "userid:" + subject,
    });

    // console.log("calling traverse");
    traverseRootFilepathwithSubject(resources.children[r], subject);
  }

  return fileslist;
}

function traverseUserIDFilePath(rules, personnel, resources) {
  // console.log("traverse userid filepath");
  // console.log(rules);
  // console.log(personnel);
  // console.log(resources);
  fileslist = [];

  var userIDList = listofUserName(personnel);
  // console.log(userIDList);

  //console.log(fileslist);

  for (var r = 0; r < resources.children.length; r++) {
    // console.log(r);
    // console.log(resources.children[r]);
    if (userIDList.includes(resources.children[r].name)) {
      //console.log(resources.children[r].name);
      // console.log(resources.children[r]);
      fileslist = traverseRootFilepathwithSubject(
        resources.children[r],
        resources.children[r].name
      );

      //fileslist.push({ "name": resources.children[r].name, "type": resources.children[r].type, "subject": resources.name });

      // fileslist = traverseRootFilepathwithSubject(resources.children[r], resources.children[r].name);

      //  console.log(fileslist);
    }
  }

  pushPropertieswithSubject(rules, fileslist);
}

function listofUserName(personnel) {
  var userIDList = [];

  for (var p = 0; p < personnel[0].children.length; p++) {
    // console.log(personnel[0].children[p].name);

    for (var pp = 0; pp < personnel[0].children[p].children.length; pp++) {
      //console.log(personnel[0].children[p].children[pp].name);
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

function pushPropertieswithSubject(rules, fileslist) {
  // console.log(fileslist);
  // console.log("pushproperties");
  //console.log(rules);
  var userlist = [];

  /*
    console.log(resources);
    console.log(personnel); */

  //  console.log(Object.keys(rules.permissions).length);

  for (var p = 0; p < Object.keys(rules.permissions).length; p++) {
    //  console.log("p" + p);
    // console.log(Object.keys(rules.permissions)[p]);

    for (let f = 0; f < fileslist.length; f++) {
      // console.log(userlist.length + " " + resources.length);
      properties.push({
        permissionType: Object.keys(rules.permissions)[p],
        subject: stringOperations(fileslist[f].subject),
        object: stringOperations(fileslist[f].name),
        ruleID: rules.id,
        role: fileslist[f].role,
      });
    }
  }
  // console.log(properties);
}

function pushProperties(rules, resources, personnel) {
  // console.log("pushproperties");
  //   console.log(rules);
  var userlist = [];
  var permissionslist = [];

  // var condition = "";
  // console.log(resources.length);
  // console.log(personnel.length);

  //  console.log(Object.keys(rules.permissions).length);

  for (var p = 0; p < Object.keys(rules.permissions).length; p++) {
    //  console.log("p" + p);
    // console.log(Object.keys(rules.permissions)[p]);

    if (Object.values(rules.permissions)[p].condition == "true") {
      var role = listofRoles(personnel);
      //   condition = Object.values(rules.permissions)[p].condition;
      // console.log("one condition");
      //console.log(condition);
      userlist = traverseUserList(role, personnel[0].children);
      //  console.log(userlist);
    } else if (Object.values(rules.permissions)[p].condition.includes("role")) {
      var role = Object.values(rules.permissions)[p].condition.split(" ");
      // condition = Object.values(rules.permissions)[p].condition;
      // console.log("two condition");
      // console.log(condition);
      userlist = traverseUserList(role[0], personnel[0].children);
      /*   console.log(role);
              console.log(userlist); */
    }

    //console.log(role);
    //  console.log(userlist);
    // console.log(resources.length);

    //  console.log(Object.keys(rules.permissions)[p]);
    if (Object.keys(rules.permissions)[p] == "read") {
      permissionslist = ["get", "list"];
      for (var i = 0; i < permissionslist.length; i++) {
        for (let u = 0; u < userlist.length; u++) {
          for (var r = 0; r < resources.length; r++) {
            //    console.log(userlist.length + " " + resources.length);
            properties.push({
              permissionType: permissionslist[i],
              subject: stringOperations(userlist[u].username),
              object: stringOperations(resources[r].name),
              ruleID: rules.id,
              role: userlist[u].role,
            });
          }
        }
      }
    } else if (Object.keys(rules.permissions)[p] == "write") {
      permissionslist = ["create", "update", "delete"];

      for (var i = 0; i < permissionslist.length; i++) {
        for (let u = 0; u < userlist.length; u++) {
          for (var r = 0; r < resources.length; r++) {
            //    console.log(userlist.length + " " + resources.length);
            properties.push({
              permissionType: permissionslist[i],
              subject: stringOperations(userlist[u].username),
              object: stringOperations(resources[r].name),
              ruleID: rules.id,
              role: userlist[u].role,
            });
          }
        }
      }
    } else {
      for (let u = 0; u < userlist.length; u++) {
        for (var r = 0; r < resources.length; r++) {
          //    console.log(userlist.length + " " + resources.length);
          properties.push({
            permissionType: Object.keys(rules.permissions)[p],
            subject: stringOperations(userlist[u].username),
            object: stringOperations(resources[r].name),
            ruleID: rules.id,
            role: userlist[u].role,
          });
        }
      }
    }
  }
  //  console.log(properties);
}

function traverseUserList(role, personnel) {
  // console.log("traverse user list");
  var users = [];

  if (typeof role == "string") {
    for (var p = 0; p < personnel.length; p++) {
      //  console.log(personnel[p].name + " " + role);
      //  console.log(personnel[p].name);
      //console.log(role);

      if (personnel[p].name === role) {
        //  console.log("MATCH");
        for (var pp = 0; pp < personnel[p].children.length; pp++) {
          //console.log(personnel[p].children[pp].name);
          users.push({ username: personnel[p].children[pp].name, role: role });
        }
      }
    }
  } else {
    for (var r = 0; r < role.length; r++) {
      for (var p = 0; p < personnel.length; p++) {
        // console.log(personnel[p].name + " " + role);
        //console.log(role);

        if (personnel[p].name === role[r]) {
          //console.log("MATCH");
          for (var pp = 0; pp < personnel[p].children.length; pp++) {
            //console.log(personnel[p].children[pp].name);
            // users.push({ "username": personnel[p].children[pp].name, "role": role[r] });
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

function traverseUserIDlist(rules, personnel) {
  var rlen = rules.match.split("/").length;
  // console.log(rlen);
  var rolename = rules.match.split("/")[rlen - 3];
  // console.log(rolename);
  var users = [];

  for (var p = 0; p < personnel.children.length; p++) {
    if (personnel.children[p].name == rules.match.split("/")[rlen - 3]) {
      for (var pp = 0; pp < personnel.children[p].children.length; pp++) {
        users.push(personnel.children[p].children[pp].name);
      }
    }
  }
  // console.log(users);
  return users;
}

/* function traverseDirectoryStructure(foldername, filename) {
    // console.log("dollar");
} */

export function filterProperties(properties, personnel) {
  propertiesArr = properties;
  // console.log(personnel[0].children);

  console.log(propertiesArr);

  filteredpropertiesArr = [];

  for (var i = 0; i < propertiesArr.length; i++) {
    //for (var i = 0; i < 1; i++) {

    //  console.log(propertiesArr[i].subject + " " + properties[i].object);
    var result = filteredpropertiesArr.filter(function (element) {
      if (
        element.subject == propertiesArr[i].subject &&
        element.object == propertiesArr[i].object
      ) {
        // console.log(propertiesArr[i]);
        // console.log(element);
        element.permissionType = propertiesArr[i].permissionType;
        // element.ruleID = propertiesArr[i].ruleID;

        var flag = 0; //flag to keep track of when the new rule should be added
        //if flag is 1, add the new rule element

        // console.log(element.rulelist.length);
        for (var j = 0; j < element.rulelist.length; j++) {
          //  console.log(element.rulelist[j].ruleID + " " + element.rulelist[j].permissionType + " " + propertiesArr[i].permissionType);

          if (element.rulelist[j].ruleID == propertiesArr[i].ruleID) {
            if (
              element.rulelist[j].permissionType !=
              propertiesArr[i].permissionType
            ) {
              /*  console.log(propertiesArr[i].ruleID + " " + propertiesArr[i].permissionType + " " + propertiesArr[i].subject + " " + propertiesArr[i].object);
                             console.log(element.rulelist[j].ruleID + " " + element.rulelist[j].permissionType);
                             console.log("FLAG ON"); */
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
            role: propertiesArr[i].role,
            status: "active",
          });

        return element;
      }
    });

    //if no array object was created for this object and subject, create a new array object
    if (result.length == 0) {
      //console.log(result);
      /*
            var flag = 0;
             for (var role = 0; role < personnel[0].children.length; role++) {
                console.log(personnel[0].children[role].name);
                if (propertiesArr[i].subject == personnel[0].children[role].name.toLowerCase())
                    flag = 1;
            } 
            if (flag == 0)
            */
      filteredpropertiesArr.push({
        subject: propertiesArr[i].subject,
        permissionType: propertiesArr[i].permissionType,
        object: propertiesArr[i].object,
        ruleID: propertiesArr[i].ruleID,
        rulelist: [
          {
            ruleID: propertiesArr[i].ruleID,
            permissionType: propertiesArr[i].permissionType,
            role: propertiesArr[i].role,
            status: "active",
          },
        ],
      });
    }
  }

  console.log(filteredpropertiesArr);
  return filteredpropertiesArr;
}

function transformPersonnel(personnel) {
  // console.log(personnel);
  var transformPersonnelArr = [
    {
      name: "users",
      type: "root",
      children: [],
    },
  ];

  var uniqueRoles = [];
  for (var p = 0; p < personnel.children.length; p++) {
    //  console.log(personnel.children[p]);
    for (var r = 0; r < personnel.children[p].roles.length; r++) {
      if (!uniqueRoles.includes(personnel.children[p].roles[r])) {
        uniqueRoles.push(personnel.children[p].roles[r]);
        //   console.log(personnel.children[p].roles[r]);
      }
    }
  }

  for (var r = 0; r < uniqueRoles.length; r++) {
    transformPersonnelArr[0].children.push({
      name: uniqueRoles[r],
      type: "class",
      children: [],
    });
  }

  // console.log(transformPersonnelArr);

  for (var r = 0; r < transformPersonnelArr[0].children.length; r++) {
    //   console.log(transformPersonnelArr[0].children[r].name);
    for (var p = 0; p < personnel.children.length; p++) {
      //  console.log(personnel.children[p].roles);
      //   console.log(transformPersonnelArr[0].children[r].name);
      if (
        personnel.children[p].roles.includes(
          transformPersonnelArr[0].children[r].name
        )
      ) {
        transformPersonnelArr[0].children[r].children.push({
          name: personnel.children[p].name,
          type: "object",
          size: 30,
        });
      }
    }
  }

  //  console.log(transformPersonnelArr);
  return transformPersonnelArr;
}
