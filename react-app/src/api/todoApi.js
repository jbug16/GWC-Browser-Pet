// API helper for React

/* global chrome */

// eslint-disable-next-line no-undef
const sendMessage = (action, data = {}) => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({action, data}, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else if (response?.error) {
                reject(new Error(response.error));
            } else {
                // eslint-disable-next-line no-undef
                resolve(response);
            }
        });
    });
};

export const getAllTodos = async () => {
    return await sendMessage('GET_ALL_TODOS');
};

export const createTodo = async (title, dueDate) => {
  return await sendMessage('CREATE_TODO', { title, dueDate });
};

export const toggleTodoComplete = async (id) => {
  return await sendMessage('TOGGLE_TODO_COMPLETE', { id });
};

export const clearCompletedTodos = async () => {
  return await sendMessage('CLEAR_COMPLETED_TODOS');
};