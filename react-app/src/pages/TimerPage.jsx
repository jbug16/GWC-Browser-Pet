/* global chrome */
import igloo from '../assets/Igloo.png';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TimerPage.css";

function TimerPage() {

    const handleHomeClick = () => {
        navigate('/');
    };

    const navigate = useNavigate();

    // for tracking time
    const [time, setTime] = useState(0); // time in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    // Navbar
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

    // Time
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}:${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        // load initial timer
        chrome.storage.local.get(["currentTimer"], (result) => {
            setTime(result.currentTimer || 0);
        });

        // listen to timer updates
        const handleStorageChange = (changes, area) => {
            if (area === "local" && changes.currentTimer) {
                setTime(changes.currentTimer.newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

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

            {dots.map((d, i) => (
                <div key={i} className="dot" style={{ top: 12, left: d.left, backgroundColor: d.color }} />
            ))}

            {lines.map((l, i) => (
                <div key={i} className="line" style={{ top: l.top, left: 738 }} />
            ))}

            <button className="btn-back" onClick={handleHomeClick}>
                <span>&lt;</span>
                <span>BACK</span>
            </button>

            <div className="timer-title-bg"/>
            <div id="enterTime" className="timer-title">TIMER</div>
            <br/>
            <div id="Time" className="time">{formatTime(time)}</div>

            <div className="add-time"/>
            <button id="increaseMin" className="btn" onClick={handleIncreaseMin}>+10 Minutes</button>
            <button id="increaseSec" className="btn" onClick={handleIncreaseSec}>+10 Seconds</button>
            <button id="increaseHr"  className="btn" onClick={handleIncreaseHr}>+1 Hour</button>
            
            <div className="edit"/>
            <button id="startTimer" className="btn" onClick={handleStart}>Start</button>
            <button id="pauseReset" className="btn" onClick={handlePauseReset}>Pause/Reset</button>
            <button id="Stop" className="btn" onClick={handleStop}>Stop</button>

            <button id="toDo" className="btn" onClick={handleToDoClick}>ToDo</button>
        </div>
    );
}

export default TimerPage;