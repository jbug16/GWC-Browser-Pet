import HomePage from '../pages/HomePage';
import TodoPage from '../pages/ToDoList';
import TimerPage from '../pages/TimerPage';
import Popup from '../pages/AddPopUp';
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/timer" element={<TimerPage />} />
            </Routes>
        </Router>
    );
}

export default App;