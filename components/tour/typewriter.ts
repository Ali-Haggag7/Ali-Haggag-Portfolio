import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed: number = 20) {
    const [displayedText, setDisplayedText] = useState("");
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        setDisplayedText("");
        setIsDone(false);
        if (!text) return;

        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                setIsDone(true);
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return { displayedText, isDone };
}
