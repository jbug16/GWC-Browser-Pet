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
        // load initial timer and running state
        chrome.storage.local.get(["currentTimer", "timerRunning"], (result) => {
            setTime(result.currentTimer || 0);
            setIsRunning(result.timerRunning || false);
        });

        // listen to timer updates
        const handleStorageChange = (changes, area) => {
            if (area === "local") {
                if (changes.currentTimer) {
                    setTime(changes.currentTimer.newValue);
                }
                if (changes.timerRunning) {
                    setIsRunning(changes.timerRunning.newValue);
                }
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
            chrome.runtime.sendMessage({ action: "START_TIMER", time: time });
        }
    };

    // for pausing/resetting the timer
    const handlePauseReset = () => {
        chrome.runtime.sendMessage({ action: "RESET_TIMER" });
    };

    // for stopping the timer
    const handleStop = () => {
        chrome.runtime.sendMessage({ action: "STOP_TIMER" });
    };

    // time buttons
    const handleIncreaseMin = () => {
        chrome.runtime.sendMessage({ action: "INCREASE_MINUTE" });
    };
    const handleIncreaseSec = () => {
        chrome.runtime.sendMessage({ action: "INCREASE_SECOND" });
    };
    const handleIncreaseHr = () => {
        chrome.runtime.sendMessage({ action: "INCREASE_HOUR" });
    };

    // Button functions
    const handleToDoClick = () => {
        navigate('/todo');
    };

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

            
            <button id="increaseMin" className="btn-plus-center" onClick={handleIncreaseMin}>
                +10 MINUTES
            </button>
            <br/>
            <button id="increaseSec" className="btn-plus-right" onClick={handleIncreaseSec}>
                +10 SECONDS
            </button>
            <br/>
            <button id="increaseHr"  className="btn-plus-left" onClick={handleIncreaseHr}>
                +1 HOUR
            </button>
            
            
            <button id="startTimer" className="start-btn" onClick={handleStart}>
                START
            </button>
            <br/>
            <button id="pauseReset" className="pause-btn" onClick={handlePauseReset}>
                RESET
            </button>
            <br/>
            <button id="Stop" className="stop-btn" onClick={handleStop}>
                PAUSE
            </button>
            <br/>
            <button id="toDo" className="todo-btn" onClick={handleToDoClick}>
                TO-DO LIST
            </button>
            
        </div>
    );
}

export default TimerPage;