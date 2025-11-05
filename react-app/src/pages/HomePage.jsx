/* global chrome */

import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { Switch, FormControlLabel, Box } from "@mui/material";

// Sprites/Objects
import igloo from "../assets/Igloo.png";
import flag from "../assets/Flag.svg";
import Pet from "../components/Pet.jsx";

// Styles
import "../styles/HomePage.css";

function HomePage() {
    const navigate = useNavigate();
    const [enabled, setEnabled] = useState(false);

    // Button functions
    const handleToDoClick = () => {
        navigate('/todo');
    };

    const handleTimerClick = () => {
        navigate('/timer');
    };

    // runs when the user wants to have the pet in their browser instead of the window (when they toggle that btn)
    const sendToActiveTab = async (msg) => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) chrome.tabs.sendMessage(tab.id, msg);
    };

    // handles toggle button logic
    const handleToggle = async (e) => {
        const next = e.target.checked;
        setEnabled(next);
        chrome.storage.local.set({ petEnabled: next });
        await sendToActiveTab({ type: "SET_PET_ENABLED", enabled: next });


    };

    // Top navbar (unusable)
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

    // Date
    const [date, setDate] = useState("");

    useEffect(() => {
        const updateDate = () => {
            // load saved state
            chrome.storage.local.get(["petEnabled"], ({ petEnabled }) => {
                setEnabled(!!petEnabled);
            });

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

    // push state to current tab + save
    const setPetEnabled = async (next) => {
        setEnabled(next);
        chrome.storage.local.set({ petEnabled: next });
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: "SET_PET_ENABLED", enabled: next });
    };

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

            <button className="btn btn-time" onClick={handleTimerClick}>
                Timer
            </button>

            <button className="btn btn-todo" onClick={handleToDoClick}>
                To-Do List
            </button>

            {/* toggle button is pinned to the navbar */}
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 56,
                    zIndex: 99999,
                    pointerEvents: "auto",
                }}
            >
                <FormControlLabel
                    control={<Switch checked={enabled} onChange={handleToggle} color="primary" size="small" />}
                    label={enabled ? "In page" : "In popup"}
                    sx={{ m: 0, ".MuiFormControlLabel-label": { fontSize: 12, ml: 0.5 } }}
                />
            </Box>

            {/* hide the pet in the extension window if we do not have it enabled */}
            {!enabled && (
                <Box sx={{ position: "absolute", left: 360, bottom: 40, width: 120, height: 120, zIndex: 10 }}>
                    <Pet
                        starting_x={390}
                        starting_y={510}
                        emotion="happy"
                        draggableEnabled={false}  // remove this once dragging outside the extension works
                    />
                </Box>
            )}

        </div>
    );
}

export default HomePage;