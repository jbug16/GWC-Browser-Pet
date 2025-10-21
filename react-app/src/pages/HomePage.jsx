import React, { useEffect, useState } from "react";
import igloo from "../assets/Igloo.png";
import flag from "../assets/Flag.svg";
import "../styles/HomePage.css"; 

function HomePage() {
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

            <div className="title-bg" />
            <div className="title-text">Penguin Browser Pet!</div>
            <div className="date-text">Date: {date}</div>

            <button className="btn btn-time" onClick={() => alert('Going to Timer Page')}>
                Timer
            </button>

            <button className="btn btn-todo" onClick={() => alert('Open to-do page')}>
                To-Do List
            </button>
        </div>
    );
}

export default HomePage;
