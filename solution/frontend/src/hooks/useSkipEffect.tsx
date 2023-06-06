/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, EffectCallback, DependencyList } from "react";

function useSkipEffect(effect: EffectCallback, deps?: DependencyList, skipCount = 1) {
  const runCount = useRef(0);

  useEffect(() => {
    if (runCount.current < skipCount) {
      runCount.current += 1;
      return;
    }

    effect();

    const cleanup = effect(); // Running the effect and storing the returned cleanup function
    return cleanup; // Returning the cleanup function to be called by React
  }, deps);
}

export default useSkipEffect;
