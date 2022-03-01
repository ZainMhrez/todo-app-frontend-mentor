const body = document.body;
const toggler = document.querySelector(".todo .top .theme-switcher");

// Set the default theme to light
localStorage.setItem("theme", "dark-theme");
body.classList.add(localStorage.getItem("theme"));

// Theme switcher function
let switchTheme = () => {
  toggler.addEventListener("click", () => {
    body.style.transition = "0.5s";
    body.classList.toggle("dark-theme");
  })
}
// trigger switch theme function
switchTheme();

// ***************************************************************

// To Do functions
const input = document.querySelector(".input .input-field");
const inputCheckbox = document.querySelector("#input-checkbox");
const checkbox = document.querySelector("input[type=checkbox]");
const itemsList = document.querySelector(".list-body .list-items");
const options = document.querySelectorAll(".show-options li");
const deleteBtn = document.querySelector(".delete-item");
const clearCompletedBtn = document.querySelector(".list-info .clear-completed");
const itemsLeft = document.querySelector(".list-info .items-left span");
// const dragListItems = document.querySelectorAll(".todo .list-body .list-items .item");
// const draggables = document.querySelectorAll(".todo .list-body .list-items .item div");
// create empty array to store tasks
let taskArray = [];

// check if the local storage has tasks
if(localStorage.getItem("tasks")) {
  taskArray = JSON.parse(localStorage.getItem("tasks"));
}

// trigger get Tasks From Local Storage
getTasksFromLocalStg();

input.addEventListener("keyup", function onEvent(e) {
  if(e.keyCode === 13) {
    if(input.value != "") {
      // add task to the array
      addTaskToArray(input.value);
      // clear the input field
      input.value = "";
      // unchecked the input checkbox
      inputCheckbox.checked = false;
    } 
  }
});

// Add Task to array function
function addTaskToArray(taskText) {
  const taskData = {
    id: `id${Date.now()}`,
    details: taskText,
    status: inputCheckbox.checked ? "completed" : "active"
  };
  // add task to array
  taskArray.push(taskData);
  // add tasks to the page
  addTasksToPage(taskArray);
  // add tasks to local storage
  addTasksToLocalStg(taskArray);
}

// add the task to the page from task array
function addTasksToPage(taskArray) {
  itemsList.innerHTML = "";
  taskArray.forEach( task => {
    let li = document.createElement("li");
    li.classList.add("item");
    // create the checkbox element
    let li_checkbox = document.createElement("input");
    li_checkbox.setAttribute("type", "checkbox");
    li_checkbox.setAttribute("id", task.id);
    // check task status
    task.status === "completed" ? li_checkbox.checked = true : li_checkbox.checked = false;
    // insert checkbox inside li
    li.appendChild(li_checkbox);
    // create the label element 
    let li_label = document.createElement("label");
    li_label.setAttribute("for", task.id);
    li_label.classList.add("item-label");
    li_label.appendChild(document.createTextNode(task.details));
    // insert label inside li
    li.appendChild(li_label);
    // create the delete img
    let li_delete =document.createElement("img");
    li_delete.src= "assets/images/icon-cross.svg";
    li_delete.classList.add("delete-item");
    li_delete.alt= "delete item";
    li_delete.style.cssText = "width: 18px; height: 18px";
    // insert img inside li
    li.appendChild(li_delete);
    // add checked class if the task is checked
    if(li_checkbox.checked) {
      li.classList.add("checked");
    }
    // add li to the items list
    itemsList.prepend(li);
    // update items left value
    updateItemsLeft(taskArray);
  });
}

// add tasks to the local storage from task array
function addTasksToLocalStg(taskArray) {
  localStorage.setItem("tasks", JSON.stringify(taskArray));
}

// get task from local storage
function getTasksFromLocalStg() {
  let data = localStorage.getItem("tasks");
  if(data) {
    let tasks = JSON.parse(data);
    addTasksToPage(tasks);
  }
}

// update items left value
function updateItemsLeft(taskArray) {
  itemsLeft.innerHTML = taskArray.filter(e => e.status === "active").length;
}

// delete task and update task status
itemsList.addEventListener("click", (e) => {
  if(e.target.classList.contains("delete-item")) {
    // remove task from local storage
    removeTaskfromLS(e.target.parentElement.firstChild.id);
    // remove item from the page
    e.target.parentElement.remove();
  }
  // update task status
  if(e.target.getAttribute("type") === "checkbox") {
    updateTaskStatus(e.target.id);
  }
});

// remove task from local storage
function removeTaskfromLS(taskId) {
  taskArray = taskArray.filter((e) => e.id != taskId);
  addTasksToLocalStg(taskArray);
  // update items left value
  updateItemsLeft(taskArray);
}

// update task status
function updateTaskStatus(taskId) {
  for(let i= 0; i < taskArray.length; i++) {
    if(taskArray[i].id === taskId) {
      taskArray[i].status === "completed" ? taskArray[i].status = "active" : taskArray[i].status = "completed";
      // add checked class to the task or remove it
      [...itemsList.children].forEach(e => {
        if(e.firstChild.id === taskId) {
          (e.firstChild.checked) ? e.classList.add("checked") : e.classList.remove("checked");
        }
      });
      // filter tasks after update status
      options.forEach(opt=> {
        if(opt.className === "checked") {
          filterTasks(opt.dataset.option);
        }
      })
      addTasksToLocalStg(taskArray);
      // update items left value
      updateItemsLeft(taskArray);
    }
  }
}

// Clear Completed tasks
clearCompletedBtn.addEventListener("click", () => {
  taskArray = taskArray.filter((e) => e.status != "completed");
  addTasksToLocalStg(taskArray);
  getTasksFromLocalStg();
});

// filter items based on the selected option
options.forEach((opt) => {
  opt.addEventListener("click", () => {
    options.forEach(e => e.classList.remove("checked"));
    opt.classList.add("checked");

    filterTasks(opt.dataset.option);
  })
});

// function to filter items based on the selected option
function filterTasks(option) {
  switch (option) {
    case "active":
      [...itemsList.children].forEach(e => {
        e.classList.contains("checked") ? e.classList.add("hidden") : e.classList.remove("hidden");
      })
      break;
    case "completed":
      [...itemsList.children].forEach(e => {
        !e.classList.contains("checked") ? e.classList.add("hidden") : e.classList.remove("hidden");
      })
      break;
    case "all":
      [...itemsList.children].forEach(e => {
        e.classList.remove("hidden");
      })
    default:
      break;
  }
}

