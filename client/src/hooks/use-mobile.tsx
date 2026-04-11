import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// Provides use Is Mobile behavior for reusable component logic.
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  // Subscribes to viewport changes to keep mobile detection current.
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // Keeps responsive state aligned with the current viewport width.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
};

