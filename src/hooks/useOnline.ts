import { useState, useEffect } from "react";
import { onlineManager } from "@tanstack/react-query";

export function useOnline() {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(setIsOnline);
    return () => unsubscribe();
  }, []);

  return isOnline;
}
