
// Test
console.log("Background script loaded");

let timer = {
    running: false,
    timeLeft: 0,
    intervalId: null,
};

function startTimer(initialTime) {
    if (!timer.running) {
        timer.running = true;
        if (initialTime !== undefined) timer.timeLeft = initialTime;
        chrome.storage.local.set({ timerRunning: true });

        timer.intervalId = setInterval(() => {
            if (timer.timeLeft > 0) {
                timer.timeLeft--;
                chrome.storage.local.set({ currentTimer: timer.timeLeft });
            } else {
                clearInterval(timer.intervalId);
                timer.running = false;
                chrome.storage.local.set({ currentTimer: 0, timerRunning: false });
            }
        }, 1000);
    }
}

// stop timer
function stopTimer() {
    clearInterval(timer.intervalId);
    timer.running = false;
    chrome.storage.local.set({ timerRunning: false });
}

// reset timer
function resetTimer() {
    stopTimer();
    timer.timeLeft = 0;
    chrome.storage.local.set({ currentTimer: 0 });
}

// increase timer
function increaseTimer(seconds) {
    timer.timeLeft += seconds;
    chrome.storage.local.set({ currentTimer: timer.timeLeft });
}

// initialize timer storage
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ currentTimer: 0, timerRunning: false });
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
        // Timer actions
        case "START_TIMER":
            startTimer(data?.time || request.time);
            return { status: "ok" };
        case "STOP_TIMER":
            stopTimer();
            return { status: "ok" };
        case "RESET_TIMER":
            resetTimer();
            return { status: "ok" };
        case "INCREASE_MINUTE":
            increaseTimer(600);
            return { status: "ok" };
        case "INCREASE_SECOND":
            increaseTimer(10);
            return { status: "ok" };
        case "INCREASE_HOUR":
            increaseTimer(3600);
            return { status: "ok" };
        // Todo actions
        case 'GET_ALL_TODOS':
            return await getAllTodos();
        case 'CREATE_TODO':
            return await createTodo(data.title, data.dueDate);
        case 'TOGGLE_TODO_COMPLETE':
            return await toggleTodoComplete(data.id);
        case 'CLEAR_COMPLETED_TODOS':
            return await clearCompletedTodos();
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}

function sortTodos(todos) {
    console.log("Sorting tasks by due date");
    return todos.sort((a,b) => {
        // Completed tasks go to the bottom
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        if (a.completed && b.completed) return 0;  // Keep completed tasks in order
        
        // Incomplete tasks sorted by due date
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
}

// Storage functions
async function getAllTodos() {
    console.log("Getting todo list");
    const result = await chrome.storage.local.get([STORAGE_KEYS.TODOS]);
    return result[STORAGE_KEYS.TODOS] || [];
}

async function getTodoById(id) {
    console.log("finding task id:", id);
    const todos = await getAllTodos();
    return todos.find(todo => todo.id === id);
}

async function createTodo(title, dueDate = null) {
    console.log("Creating new task");
    // get existing array
    const todos = await getAllTodos();

    // Create a new todo object
    const newTodo = {
        id: Date.now().toString(),
        title,
        completed: false,
        completedAt: null,
        dueDate: dueDate || null,
        timeSpent: 0
    };
    
    // Add newTodo to the array
    todos.push(newTodo);
    sortTodos(todos);   // Sort the list
    
    // Save the updated list
    await chrome.storage.local.set({ [STORAGE_KEYS.TODOS]: todos });
    
    return newTodo;
}

async function toggleTodoComplete(id) {
    console.log("Marking task complete:", id)
    const todo = await getTodoById(id);

    if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
    }

    const willBeCompleted = !todo.completed;
    const updates = {
        completed: willBeCompleted
    }

    if (willBeCompleted) {
        updates.completedAt = new Date().toISOString();
    } else {
        updates.completedAt = null
    }

    const todos = await getAllTodos();
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        throw new Error(`Todo with id ${id} not found`);
    }

    todos[index] = {
        ...todos[index],
        ...updates
    };

    sortTodos(todos);
    
    await chrome.storage.local.set({ [STORAGE_KEYS.TODOS]: todos});
    return todos.find(t => t.id === id);
}

async function clearCompletedTodos() {
    console.log("Clearing completed tasks");
    const todos = await getAllTodos();
    const activeTodos = todos.filter(todo => !todo.completed);
    await chrome.storage.local.set({[STORAGE_KEYS.TODOS]: activeTodos});
    return { success: true, deletedCount: todos.length - activeTodos.length };
}


















