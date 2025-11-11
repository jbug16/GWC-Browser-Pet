import igloo from '../assets/Igloo.png';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TimerPage.css";

function TimerPage() {
    const navigate = useNavigate();

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

    // for tracking time
    const [time, setTime] = useState(0); // time in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    // formats time as hours, minutes, seconds
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}:${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // for starting the timer
    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true);
            const id = setInterval(() => {
                setTime((prev) => prev - 1);
            }, 1000);
            setIntervalId(id);
        }
    };

    // for pausing/resetting the timer
    const handlePauseReset = () => {
        clearInterval(intervalId);
        setIsRunning(false);
        setTime(0);
    };

    // for stopping the timer
    const handleStop = () => {
        clearInterval(intervalId);
        setIsRunning(false);
    };

    // time buttons
    const handleIncreaseMin = () => setTime((prev) => prev + 600);
    const handleIncreaseSec = () => setTime((prev) => prev + 10);
    const handleIncreaseHr = () => setTime((prev) => prev + 3600);

    // Button functions
    const handleToDoClick = () => {
        navigate('/todo');
    };

    // stops timer when it reaches 0
    useEffect(() => {
        if (time <= 0 && isRunning) {
            clearInterval(intervalId);
            setIsRunning(false);
        }
    }, [time, isRunning, intervalId]);

    return (
        <div className="timer-container">
            <div className="timer-header-bar" />
            <img src={igloo} alt="Igloo" className="timer-igloo" />
            <div className="timer-footer-bar" />

            <div className="timer-title-bg" />
            <div id="enterTime" className="timer-title">TIMER</div>
            <h1 id="Time">{formatTime(time)}</h1>
            
            <button id="increaseMin" className="btn" onClick={handleIncreaseMin}>+10 Minutes</button>
            <button id="increaseSec" className="btn" onClick={handleIncreaseSec}>+10 Seconds</button>
            <button id="increaseHr"  className="btn" onClick={handleIncreaseHr}>+1 Hour</button>
        
            <button id="startTimer" className="btn" onClick={handleStart}>Start</button>
            <button id="pauseReset" className="btn" onClick={handlePauseReset}>Pause/Reset</button>
            <button id="Stop" className="btn" onClick={handleStop}>Stop</button>
            
            <button id="toDo" className="btn" onClick={handleToDoClick}>ToDo</button>
        </div>
    );
}

export default TimerPage;

