import '../styles/AddPopUp.css';
import { useState } from "react";

function AddPopup({ onClose, onAddTask }) {
    const [taskText, setTaskText] = useState("");
    const [dueDate, setDueDate] = useState("");


    // Add Task to the todo list 
    const handleAdd = () => {
        if (taskText.trim() === "") return;

        const dueDateString = dueDate ? dueDate : null;

        onAddTask(taskText, dueDate || null);
        setTaskText("");
        setDueDate(""); // Reset due date
        onClose();
    };

    return (
        <div className="add-popup-container">
            <div className="popup-bg" />
            <div className="popup-card" />

            {/* Text inputted gets put into todo list */}
            <input
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Add task..."
                className="popup-input"
            />

            {/* Popup to add due date */}
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="popup-date-input"
                // className='date-button'
            />
            
            {/* Display date selected in calendar */}
            <span 
                className={`popup-due-date ${dueDate ? "" : "placeholder"}`}
            >
                {dueDate ? dueDate.slice(5).replace("-", "/") : "mm/dd"}
            </span>

            {/* Popup to add task shows */}
            <button
                onClick={handleAdd}
                className="popup-add-btn"
            >
                <span>ADD</span>
                <span>TASK</span>
            </button>

            {/* Close Popup */}
            <button
                onClick={onClose}
                className="popup-close-btn"
            >
                ✖
            </button>
        </div>
    );
}

export default AddPopup;