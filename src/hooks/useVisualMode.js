import { useState } from "react";

const useVisualMode = (initial) => {
    const [mode, setMode] = useState(initial);
    const [history, setHistory] = useState([initial]);


    const transition = (newMode, replace = false) => {

        if (replace) {
            setMode(newMode);
            let newHistory = [...history];
            newHistory[newHistory.length - 1] = newMode;
            setHistory(newHistory);
        } else {
            setMode(newMode);
            setHistory(prev => ([...prev, newMode]))
            // setHistory([...history, ]);
        }
    }
    const back = () => {
        if (history.length > 1) {
            setMode(history[history.length - 2]);
            let newHistory = [...history];
            newHistory.pop();
            setHistory(newHistory);
        }
    }

    return { mode, transition, back }
}

export default useVisualMode;
