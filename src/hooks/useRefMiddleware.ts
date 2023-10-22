import { useCallback, useRef } from "react";

export const useRefMiddleware = <T>(ref: React.ForwardedRef<T>) => {
  const innerRef = useRef<T>();
  const refMapper = useCallback(
    (instance: T) => {
      innerRef.current = instance;
      if (ref && typeof ref === "function") {
        ref(innerRef.current);
      } else if (ref) {
        ref.current = innerRef.current;
      }
    },
    [ref]
  );
  return [innerRef, refMapper] as const;
};
