import { useEffect, useRef } from "react";

function useScrollDirection(handler: (direction: "up" | "down") => void, element: any = window) {
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = element?.scrollTop;

      if (currentY < lastScrollY.current) {
        handler("up");
      } else if (currentY > lastScrollY.current) {
        handler("down");
      }

      lastScrollY.current = currentY;
    }

    element?.addEventListener("scroll", handleScroll);
    return () => element?.removeEventListener("scroll", handleScroll);
  }, [handler]);
}

export function useHorizontalScrollDirection(
  handler: (direction: "left" | "right") => void,
  element: any = window,
  onScrollEnd?: () => void, // optional scroll end callback
  scrollEndDelay = 100 // ms
) {
  const lastScrollX = useRef(0);
  const scrollTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    function handleScroll() {
      const currentX = element.scrollLeft;

      if (currentX < lastScrollX.current) {
        handler("left");
      } else if (currentX > lastScrollX.current) {
        handler("right");
      }

      lastScrollX.current = currentX;

      // Clear previous timeout
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      // Set a new timeout for scroll end
      if (onScrollEnd) {
        scrollTimeout.current = window.setTimeout(() => {
          onScrollEnd();
        }, scrollEndDelay);
      }
    }

    element?.addEventListener("scroll", handleScroll);
    return () => {
      element?.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [handler, element, onScrollEnd, scrollEndDelay]);
}

export default useScrollDirection;
