
// Test
console.log("Background script loaded");

let timer = {
    running: false,
    timeLeft: 0,
    intervalId: null,
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        if (!timer.running) {
            timer.running = true;
            timer.intervalId = setInterval(() => {
                if (timer.timeLeft > 0) {
                    timer.timeLeft--;
                } else {
                    clearInterval(timer.intervalId);
                    timer.running = false;
                }
            }, 1000);
        }
    } else if (message.action === "stopTimer") {
        clearInterval(timer.intervalId);
        timer.running = false;
    } else if (message.action === "resetTimer") {
        clearInterval(timer.intervalId);
        timer.running = false;
        timer.timeLeft = 0;
    }
});

const STORAGE_KEYS = {
    TODOS: 'todos'
};

chrome.runtime.onInstalled.addListener(async()=> {
    const result = await chrome.storage.local.get([STORAGE_KEYS.TODOS]);
    if(!result[STORAGE_KEYS.TODOS]) {
        await chrome.storage.local.set({
            [STORAGE_KEYS.TODOS]: []
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request)
        .then(sendResponse)
        .catch(error => sendResponse({error: error.message}));
    return true;
});

async function handleMessage(request) {
    const { action, data } = request;

    switch (action) {
        case 'GET_ALL_TODOS':
            return await getAllTodos();
        case 'GET_TODO_BY_ID':
            return await getTodoById(data.id);
        case 'CREATE_TODO':
            return await createTodo(data.title, data.description, data.dueDate);
        case 'UPDATE_TODO':
            return await updateTodo(data.id, data.updates);
        case 'DELETE_TODO':
            return await deleteTodo(data.id);
        case 'TOGGLE_TODO_COMPLETE':
            return await startTimer(data.id);
        case "START_TIMER":
            startTimer();
            break;
        case "STOP_TIMER":
            stopTimer();
            break;
        case "RESET_TIMER":
            resetTimer();
            break;
        case "INCREASE_MINUTE":
            // adds 10 minutes
            elapsedTime += 600;
            sendTimeToPopup();
            break;
        case "INCREASE_SECOND":
            // adds 10 seconds
            elapsedTime += 10;
            sendTimeToPopup();
            break;
        case "INCREASE_HOUR":
            // add 1 hour
            elapsedTime += 3600;
            sendTimeToPopup();
            break;
        default:
            throw new Error(`Unkownn action: ${action}`);
    }
}

// Storage functions
async function getAllTodos() {
    console.log("getting To Do List");
    const result = await chrome.storage.local.get([STORAGE_KEYS.TODOS]);
    return result[STORAGE_KEYS.TODOS] || [];
}

async function getTodoById(id) {
    console.log("finding task");
    const todos = await getAllTodos();
    return todos.find(todo => todo.id === id);
}

function sortTodos(todos) {
    console.log("Sorting tasks by due date");
    return todos.sort((a,b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
}

async function createTodo(title, description = '') {
    console.log("Creating task");
    // Get existing todo array
    const todos = await getAllTodos();

    // Create the New todo object
    const newTodo = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
        dueDate: dueDate,
    };
    
    // Add newTodo to the array
    todos.push(newTodo);
    sortTodos(todos);   // Sort the list
    
    // Save the updated list
    await chrome.storage.local.set({ [STORAGE_KEYS.TODOS]: todos });
    
    return newTodo;
}

async function updateTodo(id, updates) {
    console.log("Making changes to existing tasks");
    const todos = await getAllTodos();
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index === -1) {
        throw new Error(`Todo with id ${id} not found`);
    }
    
    // expands and updates necessary components while maintaining unchanged data
    todos[index] = {
        ...todos[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    // re-sort list if due date is changed
    if(updates.dueDate !== undefined) {
        sortTodos(todos);
    }
    
    await chrome.storage.local.set({ [STORAGE_KEYS.TODOS]: todos });
    return todos[index];
}

// task completed, delete from list
async function deleteTodo(id) {
    console.log("Removing task from list");
    const todos = await getAllTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    await chrome.storage.local.set({ [STORAGE_KEYS.TODOS]: filteredTodos });
    return { id, success: true };
}

async function toggleTodoComplete(id) {
    console.log("Marking task complete")
    const todo = await getTodoById(id);

    if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
    }
    
    return await updateTodo(id, { completed: !todo.completed });
}

let elapsedTime = 0;
let timerRunning = false;

// to load saved time
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(["elapsedTime"], (result) => {
        elapsedTime = result.elapsedTime || 0;
    });
});

// to start the timer
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        chrome.alarms.create("tick", { periodInMinutes: 1 / 60 });
    }
}

// to stop the timer
function stopTimer() {
    timerRunning = false;
    chrome.alarms.clear("tick");
}

// to reset the timer
function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    sendTimeToPopup();
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "tick" && timerRunning) {
        if (elapsedTime > 0) {
            elapsedTime -= 1;
            sendTimeToPopup();
        } else {
            stopTimer();
        }
    }
});

function sendTimeToPopup() {
    chrome.storage.local.set({ elapsedTime });
    chrome.runtime.sendMessage({ action: "updateTime", data: elapsedTime });
}






















