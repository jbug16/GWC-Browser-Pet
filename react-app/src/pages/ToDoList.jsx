import '../styles/ToDoList.css'; 
import igloo from '../assets/Igloo.png';
import PopupPage from './AddPopUp.jsx';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TodoList() {
    const navigate = useNavigate();

    // Button functions
    const handleHomeClick = () => {
        navigate('/');
    };

    const handleTimerClick = () => {
        navigate('/timer');
    };

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

    // Get time put into timer page and display it on To Do List page
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [seconds, setSeconds] = useState(()=> {
        const saved = localStorage.getItem("timeLeft");
        if(saved) {
            return parseInt(saved, 10);
        } else {
            return 0;
        }
    });

    const [isRunning, setIsRunning] = useState(false);
    const [tasks, setTasks] = useState([]);

    // Keeps track of timer and alerts user when timer runs out
    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => {
                    let newTime = prevSeconds - 1;

                    if (newTime <= 0) {
                        clearInterval(interval);
                        newTime = 0;
                        setIsRunning(false);
                        alert("Time’s up!");
                    }

                    localStorage.setItem("timeLeft", newTime);
                    return newTime;
                });
            }, 1000);
        }

        // Clear timer 
        return () => {
            if (interval) {
               clearInterval(interval); 
            }
        };
    }, [isRunning]);

    // Timer format
    const formatTime = (secs) => {
        let h = Math.floor(secs / 3600);
        let m = Math.floor((secs % 3600) / 60);
        let s = secs % 60;

        if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;

        return `${h}:${m}:${s}`;
    };

    // Add Task to todo list
    const addTask = (taskText) => {
        const newTask = { id: Date.now(), text: taskText, completed:false};
        setTasks([...tasks, newTask]);
    };

    // Checks off if the task is completed or not
    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        // Background, igloo, and extra details being displayed on page 
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

            {/* ToDo title and display for tasks */}
            <div className="todo-title-bg" />
            <div className="todo-title">TO-DO</div>

            <div className="todo-card" />
            <div className="todo-card-inner" />

            {/* Display tasks in todo list with check boxes to show if tasks are completed or not */}
            <ul className="todo-list">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className={task.completed ? "completed-task" : ""}
                    >
                        {/* Check boxes when completed */}
                        <input 
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>toggleTask(task.id)}
                            className="todo-checkbox"
                        />
                        {task.text}
                    </li>
                ))}
            </ul>

            {/* Button to go back to home page */}
            <button className="btn-back" onClick={handleHomeClick}>
                <span>&lt;</span>
                <span>BACK</span>
            </button>

            {/* Displays timer */}
            <div className="timer-card">
                <p className="timer-display">{formatTime(seconds)}</p>
            </div>

            {/* Button to go to timer page */}
            <button className="btn-timer" onClick={handleTimerClick}>
                TIMER
            </button>
            
            {/* Button to show popup to add new tasks */}
            <button className="btn-add" onClick={() => setShowAddPopup(true)}>
                ADD
            </button>

            {showAddPopup && (
                <PopupPage 
                    onClose={() => setShowAddPopup(false)} 
                    onAddTask={addTask}
                />
            )}
        </div>
    );
}

export default TodoList;

