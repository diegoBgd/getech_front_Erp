import { useEffect, useState } from 'react';

/** Retourne la Date courante, rafraîchie chaque seconde (utilisé par la BottomBar). */
export function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
}
