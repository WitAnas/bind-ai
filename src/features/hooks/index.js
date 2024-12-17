import { useState,useEffect } from 'react';

export const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (
                !ref.current ||
                ref.current.contains(event.target) ||
                window.outerWidth - 15 <= event.clientX
            ) {
                // 15px is the scroller's width.
                // hence when user clicks on scroller, we would ignore that click.
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler]);
};

export function useClientMediaQuery(query) {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleMatchChange = (e) => {
      setMatches(e.matches);
    };

    mediaQueryList.addEventListener('change', handleMatchChange);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener('change', handleMatchChange);
    };
  }, [query]);

  return matches;
}
