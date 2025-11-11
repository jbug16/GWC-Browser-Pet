import React, { useState, useRef, useEffect, useMemo } from 'react';

// Pet sprites
import Happy from '../assets/happysprite.png';
import Mad from '../assets/happysprite.png';
import Sleepy from '../assets/sleepingsprite.png';
import Dragged from '../assets/dragsprite.png';

function DraggablePet({
  starting_x = 100,
  starting_y = 100,
  emotion = "happy",
  draggableEnabled = true
}) {
    // track position
    const [pos, setPos] = useState({ x: starting_x, y: starting_y });
    // are we currently dragging?
    const [dragging, setDragging] = useState(false);
    // mouse offset so it doesn't "jump"
    const offsetRef = useRef({ x: 0, y: 0 });

    // get each sprite
    const SPRITES = useMemo(
        () => ({
            happy: Happy,
            mad: Mad,
            sleepy: Sleepy
        }),
        []
    );

    // choose sprite (force the drag sprite if dragging, else set based on emotion)
    const petSprite = dragging ? Dragged : (SPRITES[emotion] ?? SPRITES.happy);

    // runs when we left-click
    const handleMouseDown = (e) => {
        // PETTING CODE

        // DRAGGING CODE
        if (!draggableEnabled) return; // we are not allowed to drag
        setDragging(true);

        // get mouse position vs element position
        const rect = e.currentTarget.getBoundingClientRect();
        offsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        // prevent text highlight while dragging
        e.preventDefault();
    };

    useEffect(() => {
        // only run if we are currently dragging the pet icon
        if (!dragging) return;

        // runs when we are moving the mouse while clicking (so dragging)
        const handleMouseMove = (e) => {
            // defines the new x and y position for the icon based on our mouse position
            const newX = e.clientX - offsetRef.current.x;
            const newY = e.clientY - offsetRef.current.y;

            setPos({ x: newX, y: newY }); // updates the position values
        };

        // runs when we let go of the left-click button (stop the dragging)
        const handleMouseUp = () => {
            setDragging(false);
        };

        // connect our functions to the actual mouse event so the extension knows when to run it
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        // clean up - remove listeners once drag ends
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    }, [dragging]);

    return (
        // this defines an 80x80 pixel container for the pet image
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                width: 80,
                height: 80,
                cursor: draggableEnabled ? (dragging ? "grabbing" : "grab") : "default",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999999999, // sit on top of ALL page content
            }}
        >
            {/* this sets the actual image and alt text in case the image cannot load for whatever reason */}
            <img
                src={petSprite}
                alt={`${emotion} pet${dragging ? " (dragging)" : ""}`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none', // so clicking image still drags
                }}
            />
        </div>
    );
}

export default DraggablePet;