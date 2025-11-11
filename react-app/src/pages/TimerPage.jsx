/* global chrome */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TimerPage.css";

function TimerPage() {
    const navigate = useNavigate();
    const [time, setTime] = useState(0);
    
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

    const sendMessage = (action) => {
        chrome.runtime.sendMessage({ action });
    };

    const handleStart = () => sendMessage("START_TIMER");
    const handleStop = () => sendMessage("STOP_TIMER");
    const handlePauseReset = () => sendMessage("RESET_TIMER");
    const handleIncreaseMin = () => sendMessage("INCREASE_MINUTE");
    const handleIncreaseSec = () => sendMessage("INCREASE_SECOND");
    const handleIncreaseHr = () => sendMessage("INCREASE_HOUR");

    // Button functions
    const handleToDoClick = () => {
        navigate('/todo');
    };

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

