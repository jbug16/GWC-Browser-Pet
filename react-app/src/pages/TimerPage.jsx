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
            <label id="enterTime">TIMER</label>
            <br/> <br/>
            <h1 id="Time">{formatTime(time)}</h1>
            <br/>
            <button className="buttons" onClick={handleIncreaseMin}>+10 Minutes</button>
            <button className="buttons" onClick={handleIncreaseSec}>+10 Seconds</button>
            <button className="buttons" onClick={handleIncreaseHr}>+1 Hour</button>
            <br/><br/>
            <button className="buttons" onClick={handleStart}>Start</button>
            <button className="buttons" onClick={handlePauseReset}>Pause/Reset</button>
            <button className="buttons" onClick={handleStop}>Stop</button>
            <br/><br/>
            <button onClick={handleToDoClick}>ToDo</button>
        </div>
    );
}

export default TimerPage;