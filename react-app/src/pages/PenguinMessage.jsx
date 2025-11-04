import { useState, useEffect } from "react";
import penguinImg from "../assets/penguinSub.png";
import madSpeechBubble from "../assets/madSpeech.png";
import regularSpeechBubble from "../assets/regularSpeech.png";
import "../styles/PenguinMessage.css";

function PenguinMessage({ isTimerRunning }) {
  const [showSpeech, setShowSpeech] = useState(false);
  const [message, setMessage] = useState("");
  const [bubbleImg, setBubbleImg] = useState(regularSpeechBubble);

  const madMessages = [
    "Go back to studying!",
    "Stop procrastinating!",
    "💢",
    "Your work isn’t gonna finish itself!"
  ];

  const happyMessages = [
    "Time to relax a little!",
    "Take a short break",
    "You’re doing great!",
    "Keep up the good work!"
  ];

  const handlePenguinClick = () => {
    let chosenMessages;
    let chosenBubble;
    //isTimerRunning = true;

    if (isTimerRunning) {
      // Show mad messages when timer is running 
      chosenMessages = madMessages;
      chosenBubble = madSpeechBubble;
    } else if (!isTimerRunning) {
      // Show happy messages when timer is not running
      chosenMessages = happyMessages;
      chosenBubble = regularSpeechBubble;
    }

    const randomIndex = Math.floor(Math.random() * chosenMessages.length);
    const randomMessage = chosenMessages[randomIndex];

    setMessage(randomMessage);
    setBubbleImg(chosenBubble);
    setShowSpeech(true);
  };

  // Automatically show message based on timer
  useEffect(() => {
    let chosenMessages;
    let chosenBubble;

    if (isTimerRunning) {
      chosenMessages = madMessages;
      chosenBubble = madSpeechBubble;
    } else if (!isTimerRunning) {
      chosenMessages = happyMessages;
      chosenBubble = regularSpeechBubble;
    }

    const randomIndex = Math.floor(Math.random() * chosenMessages.length);
    const randomMessage = chosenMessages[randomIndex];

    setMessage(randomMessage);
    setBubbleImg(chosenBubble);
    setShowSpeech(true);
  }, [isTimerRunning]);

  // Hides bubble after 3 seconds
  useEffect(() => {
    if (showSpeech) {
      const timer = setTimeout(() => {
        setShowSpeech(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSpeech]);

  return (
    <div className="penguin-wrapper" onClick={handlePenguinClick}>
      {showSpeech && (
        <div
          className={`speech-bubble ${
            bubbleImg === regularSpeechBubble ? "regular-bubble" : "mad-bubble"
          }`}
        >
          <img src={bubbleImg} alt="speech bubble" className="speech-bubble-img" />
          <p className={`speech-text ${
            bubbleImg === regularSpeechBubble ? "regular-text" : "mad-text"
          }`}>
            {message}
          </p>
        </div>
      )}
      <img src={penguinImg} alt="penguin" className="penguin-img" />
    </div>
  );
}

export default PenguinMessage;
