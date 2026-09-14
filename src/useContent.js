import { useEffect, useState } from 'react';

export function useContent(section, seed) {
  const [data, setData] = useState(seed);

  useEffect(() => {
    let cancelled = false;
    fetch(`/.netlify/functions/content?section=${section}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((fresh) => {
        if (fresh && !cancelled) setData(fresh);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [section]);

  return data;
}
