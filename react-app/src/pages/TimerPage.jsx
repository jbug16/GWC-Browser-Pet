import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TimerPage.css";

function TimerPage() {
    const navigate = useNavigate();

    // Button functions
    const handleToDoClick = () => {
        navigate('/todo');
    };

    return (
        <div className="timer-container">
            <label id="enterTime">TIMER</label>
            <br/> <br/>
            <h1 id="Time">0:0:00</h1>
            <br/>
            <button id="increaseMin" className="buttons">+10 Minutes</button>
            <button id="increaseSec" className="buttons">+10 Seconds</button>
            <button id="increaseHr" className="buttons">+1 Hour</button>
            <br/><br/>
            <button id="startTimer" className="buttons">Start</button>
            <button id="pauseReset" className="buttons">Pause/Reset</button>
            <button id="Stop" className="buttons">Stop</button>
            <br/><br/>
            <button id="toDo" onClick={handleToDoClick}>ToDo</button>
        </div>
    );
}

export default TimerPage;