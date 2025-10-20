import '../styles/AddPopUp.css';

function AddPopup({ onClose }) {
    return (
        <div className="add-popup-container">
            <div className="popup-bg" />
            <div className="popup-card" />

            <input
                placeholder="Add task..."
                className="popup-input"
            />

            <button
                onClick={() => alert('Adding task to list')}
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