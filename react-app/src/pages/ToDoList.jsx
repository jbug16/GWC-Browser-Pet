import '../styles/ToDoList.css'; 
import igloo from '../assets/Igloo.png';
import PopupPage from './AddPopUp.jsx';
import { useState } from "react";

function TodoList() {
    const dots = [
        { left: 11, color: '#FF0000' },
        { left: 39, color: '#FFE100' },
        { left: 67, color: '#00FF11' }
    ];

    const lines = [
        { top: 10}, 
        { top: 17},
        { top: 24}
    ];

    const [showAddPopup, setShowAddPopup] = useState(false);

    return (
        <div className="todo-container">
            <div className="todo-header-bar" />
            <img src={igloo} alt="Igloo" className="todo-igloo" />
            <div className="todo-footer-bar" />

            {dots.map((d, i) => (
                <div key={i} className="dot" style={{ top: 12, left: d.left, backgroundColor: d.color }} />
            ))}

            {lines.map((l, i) => (
                <div key={i} className="line" style={{ top: l.top, left: 738 }} />
            ))}

            <div className="todo-title-bg" />
            <div className="todo-title">TO-DO</div>

            <div className="todo-card" />
            <div className="todo-card-inner" />

            <ul className="todo-list">
                <li>Sample Task 1</li>
            </ul>

            <button className="btn-back" onClick={() => alert('Going to Home Page')}>
                <span>&lt;</span>
                <span>BACK</span>
            </button>

            <button className="btn-add" onClick={() => setShowAddPopup(true)}>
                ADD
            </button>

            {showAddPopup && <PopupPage onClose={() => setShowAddPopup(false)} />}
        </div>
    );
}

export default TodoList;