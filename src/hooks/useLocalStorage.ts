import React, { useEffect, useRef, useState } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  onMutate?: (newValue: T) => void,
  overrideValue?: T | null,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getValue = (): T => {
    if (overrideValue) {
      window.localStorage.setItem(key, JSON.stringify(overrideValue));
      return overrideValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  };

  const [value, setValue] = useState<T>(getValue);
  const prevValueRef = useRef(value);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
    if (JSON.stringify(value) !== JSON.stringify(prevValueRef.current)) {
      onMutate?.(value);
      prevValueRef.current = value;
    }
  }, [key, value]);

  useEffect(() => {
    if (overrideValue !== undefined && overrideValue !== null) {
      setValue(overrideValue);
    }
  }, [overrideValue]);

  return [value, setValue];
}

export default useLocalStorage;
