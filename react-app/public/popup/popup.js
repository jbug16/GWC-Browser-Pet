
// Remove this file

// Creating timer

// To-Do List

/* global chrome */

console.log(chrome.storage);

document.addEventListener("DOMContentLoaded", ()=>{
    console.log("in document event listener");
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addButton");
    const taskList = document.getElementById("taskList");

    console.log("1");
    chrome.storage.sync.get(["tasks"]).then((result)=> {
        console.log("getting input for a task");
        const tasks = result.tasks || [];
        tasks.forEach((task)=> addTaskToDOM(task));
    });

    console.log("2");
    addButton.addEventListener("click", () => {
        console.log("adding a button");
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        addTaskToDOM(taskText);
        saveTask(taskText);

        taskInput.value = "";
    })

    console.log("3");
    function addTaskToDOM(taskText) {
        console.log("add task to DOM");

        const li = document.createElement("li");
        li.textContent = taskText;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", ()=> {
            li.remove();
            removeTask(taskText);

        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }


    function saveTask(taskText) {
        console.log("In save task");
        chrome.storage.sync.get(["tasks"], (result)=> {
            const tasks = result.tasks || [];
            tasks.push(taskText);
            chrome.storage.sync.set({ tasks });
        });
    }

    function removeTask(taskText) {
        console.log("Remove task");
        chrome.storage.sync.remove(taskText);
        // chrome.storage.sync.get(["tasks"], (result)=> {
        //     let tasks = result.tasks || [];
        //     tasks = tasks.filter((t)=> t != taskText);
        //     // const updatedTasks = tasks.filter((t) => t !== taskText);
        //     // chrome.storage.local.set({tasks: updatedTasks});
        // });
    }
});