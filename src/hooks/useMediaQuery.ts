import { useEffect, useState } from 'react';

const readMatch = (query: string): boolean =>
  typeof window !== 'undefined' && window.matchMedia(query).matches;

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => readMatch(query));

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
