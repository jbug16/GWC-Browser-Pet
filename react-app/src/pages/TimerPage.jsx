import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TimerPage.css";

function TimerPage() {
    const navigate = useNavigate();

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
            <label id="enterTime">TIMER</label>
            <h1 id="Time">{formatTime(time)}</h1>
            <divider/>
            
            <buttongroup variant="contained" orientation="horizontal">
            <button id="increaseMin" className="buttons" onClick={handleIncreaseMin}>+10 Minutes</button>
            <button id="increaseSec" className="buttons" onClick={handleIncreaseSec}>+10 Seconds</button>
            <button id="increaseHr"  className="buttons" onClick={handleIncreaseHr}>+1 Hour</button>
            </buttongroup>

            <divider/>
            <button id="startTimer" className="buttons" onClick={handleStart}>Start</button>
            <button id="pauseReset" className="buttons" onClick={handlePauseReset}>Pause/Reset</button>
            <button id="Stop" className="buttons" onClick={handleStop}>Stop</button>
            <divider/>
            <button id="toDo" onClick={handleToDoClick}>ToDo</button>
        </div>
    );
}

export default TimerPage;

