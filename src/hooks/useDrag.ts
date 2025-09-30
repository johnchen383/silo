import { useState, useRef, useEffect } from "react";

type UseHorizontalDragOptions = {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    swipeThreshold?: number; // default 50px
    onDrag?: (dx: number) => void; // called during drag
};

export function useHorizontalDrag(options: UseHorizontalDragOptions = {}) {
    const { onSwipeLeft, onSwipeRight, onDrag, swipeThreshold = 10 } = options;

    const startX = useRef<number | null>(null);
    const [dx, setDx] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleStart = (clientX: number) => {
        startX.current = clientX;
        setDx(0);
        setIsDragging(true);
    };

    const handleMove = (clientX: number) => {
        if (!isDragging) return;
        if (startX.current == null) return;
        const delta = clientX - startX.current;
        setDx(delta);
        if (onDrag) onDrag(delta);
    };

    const handleEnd = () => {
        console.log("END", dx, swipeThreshold)
        if (startX.current == null) return;
        if (dx > swipeThreshold && onSwipeRight) onSwipeRight();
        else if (dx < -swipeThreshold && onSwipeLeft) onSwipeLeft();

        setDx(0);
        setIsDragging(false);
        startX.current = null;
    };

    useEffect(() => {
        // window.addEventListener("mouseup", handleEnd);
        window.addEventListener("touchend", handleEnd);
        // window.addEventListener("mousemove", (e) => handleMove(e.clientX));
        window.addEventListener("touchmove", (e) => handleMove(e.touches[0].clientX));
        // window.addEventListener("mousedown", (e) => handleStart(e.clientX));
        window.addEventListener("touchstart", (e) => handleStart(e.touches[0].clientX));

        return () => {
            // window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchend", handleEnd);
            // window.removeEventListener("mousemove", (e) => handleMove(e.clientX));
            window.removeEventListener("touchmove", (e) => handleMove(e.touches[0].clientX));
            // window.removeEventListener("mousedown", (e) => handleStart(e.clientX));
            window.removeEventListener("touchstart", (e) => handleStart(e.touches[0].clientX));
        }
    }, [dx, isDragging]);

    return { dx, isDragging };
}
