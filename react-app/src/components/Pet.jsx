import Pet from '../assets/placeholder-pet.png';
import React, {useState, useRef, useEffect} from 'react';

function DraggablePet({starting_x = 100, starting_y = 100}) {
    // track position
    const [pos, setPos] = useState({ x: starting_x, y: starting_y });
    // are we currently dragging?
    const [dragging, setDragging] = useState(false);
    // mouse offset so it doesn't "jump"
    const offsetRef = useRef({ x: 0, y: 0 });

    // runs when we left-click
    const handleMouseDown = (e) => {
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
                cursor: "grab",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999999999, // sit on top of ALL page content
            }}
        >
            {/* this sets the actual image and alt text in case the image can not load for whatever reason */}
            <img
                src={Pet}
                alt="Pet"
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