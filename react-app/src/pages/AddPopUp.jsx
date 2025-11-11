import '../styles/AddPopUp.css';
import { useState } from "react";

function AddPopup({ onClose, onAddTask }) {
    const [taskText, setTaskText] = useState("");
    const [dueDate, setDueDate] = useState("");

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

            <input
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Add task..."
                className="popup-input"
            />

            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="popup-date-input"
            />

            <button
                onClick={handleAdd}
                className="popup-add-btn"
            >
                <span>ADD</span>
                <span>TASK</span>
            </button>

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