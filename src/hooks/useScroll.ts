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

export default useScrollDirection;
