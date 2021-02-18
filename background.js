// const chrome = require('sinon-chrome'); // for testing only
// window.chrome = chrome; // for testing only

var tFBool = true;
var treeArray = [];
var curr_parentId = null;
var allID = [];
var allNodes = [];

class TreeNode {
  constructor(value) {
    this.value = value;
    this.descendants = [];
  }
}
var node = new TreeNode();
document.addEventListener("DOMContentLoaded", function () {
  var checkbox = document.querySelector('input[type="checkbox"]');
  chrome.storage.local.get("enabled", function (result) {
    console.log("initial status: " + result.enabled);
    if (result.enabled !== null && checkbox !== null) {
      checkbox.checked = result.enabled;
    }
  });

  if (checkbox) {
    checkbox.addEventListener("click", function () {
      console.log("current status: " + checkbox.checked);
      chrome.storage.local.set({ enabled: checkbox.checked }, function () {
        console.log("confirmed");
      });
    });
  }
});

// need to fiugure out how to save the previos state
chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    chrome.storage.local.get({ enabled: !checkbox }, function () {
      saveProject(checkbox, allNodes);
      getProject("tree1"); //****  need to make this work for a user-input project name ***
    });
    var checkbox = document.querySelector('input[type="checkbox"]');
    chrome.storage.local.get("enabled", function (result) {
      console.log("initial status: " + result.enabled);
      if (result.enabled) {
        console.log(current_tab_info.url);
        var newdata = {
          id: tab.tabId,
          parentId: curr_parentId,
          url: current_tab_info.url,
        };

        console.log(allID + " array");
        if (allID !== null) {
          if (allID.includes(tab.tabId)) {
            for (i in allNodes) {
              if (allNodes[i].value === current_tab_info.url) {
                node = allNodes[i];
                break;
              }
            }
            //console.log(node);
            console.log("already there");
            curr_parentId = tab.tabId;
            var tempchild = [];
            for (i in treeArray) {
              //console.log(treeArray[i].parentId);
              if (treeArray[i].parentId === tab.tabId) {
                tempchild.push(treeArray[i].url);
              }
            }
            console.log("tempchild" + tempchild);
            node.descendants.push(tempchild);
            console.log(node);
          } else {
            node = new TreeNode(current_tab_info.url);
            curr_parentId = tab.tabId;
            console.log(newdata);
            treeArray.push(newdata);
            console.log(treeArray);
            allID.push(tab.tabId);
            allNodes.push(node);

            console.log(node);
          }
        } else {
          node = new TreeNode(current_tab_info.url);
          curr_parentId = tab.tabId;
          console.log(newdata);
          treeArray.push(newdata);
          console.log(treeArray);
          allID.push(tab.tabId);
          allNodes.push(node);
          //node.descendants.push(newdata.url);
          console.log(node);
        }
      }
    });
  });
});


function saveProject(onOff, allNodes) {
  if (!onOff) {
    chrome.storage.local.set({ tree1: allNodes });
    var tFBool = true; // reset all values
    var treeArray = [];
    var curr_parentId = null;
    var allID = [];
    var allNodes = [];
  }
  return;
}

function getProject(project) {
  chrome.storage.local.get(project, function (data) {
    console.log(data);
    var mySet = new Array(data);
    console.log(mySet);
  });
}

var makeNode = (urlName) => {
  var node1 = new TreeNode();
  node1.value = urlName;
  return node1;
};

var addDesc = (node2, desc) => {
  if (node2.descendants !== undefined) {
    var tempDesc = node2.descendants;
    tempDesc.push(desc);
    node2.descendants = tempDesc;
  } else node2.descendants.push(desc);
  return node2;
};