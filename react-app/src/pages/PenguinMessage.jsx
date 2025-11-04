import { useState, useEffect } from "react";
import penguinImg from "../assets/penguinSub.png";
import speechBubble from "../assets/madSpeech.png";
import "../styles/PenguinMessage.css";

function Penguin() {
  const [showSpeech, setShowSpeech] = useState(false);
  const [message, setMessage] = useState("");

  const messages = [
    "Go back to studying!",
    "Stop procrastinating!",
    "💢",
    "Your work isn’t gonna finish itself!"
  ];

  // Shows a random message when penguin is clicked
  const handlePenguinClick = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
    setShowSpeech(true);
  };

  // Hide bubble after 3 seconds
  useEffect(() => {
    if (showSpeech) {
      const timer = setTimeout(() => setShowSpeech(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSpeech]);

  return (
    <div className="penguin-wrapper" onClick={handlePenguinClick}>
      {showSpeech && (
        <div className="speech-bubble">
          <img src={speechBubble} alt="speech bubble" className="speech-bubble-img" />
          <p className="speech-text">{message}</p>
        </div>
      )}
      <img src={penguinImg} alt="penguin" className="penguin-img" />
    </div>
  );
}

export default Penguin;