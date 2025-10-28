import React, { useEffect, useState } from "react";
import igloo from "../assets/Igloo.png";
import flag from "../assets/Flag.svg";
import "../styles/HomePage.css";
import {useNavigate} from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const [streak, setStreak] = useState(0);

    // Button functions
    const handleToDoClick = () => {
        navigate('/todo');
    };

    const handleTimerClick = () => {
        navigate('/timer');
    };

    // Extra details on top 
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

    // Update the date presented on home page 
    const [date, setDate] = useState("");

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const formatted = now.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            setDate(formatted);
        };

        updateDate();
        const interval = setInterval(updateDate, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        // Add Background, igloo, flag, and extra details on home page
        <div className="home-container">
            <div className="home-header-bar" />
            <img src={flag} alt="Flag" className="home-flag" />
            <img src={igloo} alt="Igloo" className="home-igloo" />
            <div className="home-footer-bar" />

            {dots.map((d, i) => (
                <div key={i} className="dot" style={{ top: 12, left: d.left, backgroundColor: d.color }} />
            ))}

            {lines.map((l, i) => (
                <div key={i} className="line" style={{ top: l.top, left: 738 }} />
            ))}

            {/* Add title and date */}
            <div className="title-bg" />
            <div className="title-text">Penguin Browser Pet!</div>
            <div className="date-text">Date: {date}</div>

            {/* Buttons to go to timer */}
            <button className="btn btn-time" onClick={handleTimerClick}>
                Timer
            </button>

            {/* Buttons to go to To-Do list */}
            <button className="btn btn-todo" onClick={handleToDoClick}>
                To-Do List
            </button>

            {/* Daily Streak */}
            <div className="streak-text">
                <span>Daily Streak:</span>
                <span>{streak} days!</span>
            </div>


        </div>
    );
}

export default HomePage;
