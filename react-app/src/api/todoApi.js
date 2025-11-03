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

// export const getTodoById = async (id) => {
//     return await sendMessage('GET_TODO_BY_ID', { id });
// };

export const createTodo = async (title, description = '', dueDate = null) => {
  return await sendMessage('CREATE_TODO', { title, description, dueDate });
};

// export const updateTodo = async (id, updates) => {
//     return await sendMessage('UPDATE_TODO', {id, updates})
// };

// export const deleteTodo = async (id) => {
//   return await sendMessage('DELETE_TODO', { id });
// };

export const toggleTodoComplete = async (id) => {
  return await sendMessage('TOGGLE_TODO_COMPLETE', { id });
};

export const clearCompletedTodos = async () => {
  return await sendMessage('CLEAR_COMPLETED_TODOS');
};