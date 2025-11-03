import '../styles/ToDoList.css'; 
import igloo from '../assets/Igloo.png';
import PopupPage from './AddPopUp.jsx';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTodos, createTodo, toggleTodoComplete, clearCompletedTodos } from '../api/todoApi.js';

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

    const loadTasks = async () => {
        try {
            const todos = await getAllTodos();
            setTasks(todos);
            console.log("Loaded tasks:", todos)
        } catch (error) {
            console.error('Failed to lload tasks:', error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

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

        return () => {
            if (interval) {
               clearInterval(interval); 
            }
        };
    }, [isRunning]);

    const formatTime = (secs) => {
        let h = Math.floor(secs / 3600);
        let m = Math.floor((secs % 3600) / 60);
        let s = secs % 60;

        if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;

        return `${h}:${m}:${s}`;
    };

    const addTask = async(taskText) => {

        try {
            const newTask = await createTodo(taskText);
            console.log("Created task:", newTask);

            setTasks(prevTasks => [...prevTasks, newTask]);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
        // const newTask = { id: Date.now(), text: taskText, completed:false};
        // setTasks([...tasks, newTask]);
    };

    const toggleTask = async (id) => {
        
        try {
            await toggleTodoComplete(id);
            await loadTasks();
        } catch(error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleClearCompleted = async () => {
        try {
            const result = await clearCompletedTodos();
            console.log(`Cleared ${result.deletedCount} completed tasks`);
            const todos = await loadTasks();
        } catch(error) {
            console.error('Failed to clear completed tasks', error);
        }
    }

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
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className={task.completed ? "completed-task" : ""}
                    >
                        <input 
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>toggleTask(task.id)}
                            className="todo-checkbox"
                        />
                        {task.title}
                    </li>
                ))}
            </ul>

            <button className="btn-back" onClick={handleHomeClick}>
                <span>&lt;</span>
                <span>BACK</span>
            </button>

            <div className="timer-card">
                <p className="timer-display">{formatTime(seconds)}</p>
            </div>

            <button className="btn-timer" onClick={handleTimerClick}>
                TIMER
            </button>
            
            <button className="btn-add" onClick={() => setShowAddPopup(true)}>
                ADD
            </button>

            <button className="btn-clear-completed" onClick={handleClearCompleted}>
                CLEAR
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

