import { useEffect, useState } from 'react';

export const useRequestAnimationFrame = (batchCallback? : Function) => {
  const [lastUpdateUI, setLastUpdateUI] = useState(Date.now());

  useEffect(() => {
    let animationNumber = 0;
    const animate = () => {
      const delta = Date.now() - lastUpdateUI;
      if (delta >= 1000 / 60) {
        // call UPDATE UI with the batched data (setState)
        if (batchCallback) {
          batchCallback();
        }
        setLastUpdateUI(Date.now);
      }
      animationNumber = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animationNumber);
    };
  }, []);
  return lastUpdateUI;
};
