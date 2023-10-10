// create a partial object from a full object from a list of keys

import { useRef } from "react";

// and memoize it
function usePartialMemo<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
) {
  const prevObj = useRef<T>(obj);
  const prevKeys = useRef<(keyof T)[]>(keys);
  const result = useRef<Partial<T>>({});

  if (prevObj.current !== obj || prevKeys.current !== keys) {
    prevObj.current = obj;
    prevKeys.current = keys;
    result.current = {};
    for (const key of keys) {
      result.current[key] = obj[key];
    }
  }

  return result.current;
}
