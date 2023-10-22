import { useEffect, useRef } from "react";

export const useUpdateEffect = (effect: React.EffectCallback) => {
  const isMounted = useRef(false);

  useEffect(() => {
    let destructor: ReturnType<React.EffectCallback> = () => {};
    if (isMounted.current) {
      destructor = effect();
    }
    isMounted.current = true;
    return destructor;
  }, [effect]);
};
