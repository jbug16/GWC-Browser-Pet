import '../styles/AddPopUp.css';
import { useState } from "react";

function AddPopup({ onClose, onAddTask }) {
    const [taskText, setTaskText] = useState("");

    const handleAdd = () => {
        if (taskText.trim() === "") return;
        onAddTask(taskText);
        setTaskText("");
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