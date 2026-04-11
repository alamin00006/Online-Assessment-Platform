import { useEffect, useCallback } from 'react';

// Provides use Tab Switch Detection behavior for reusable component logic.
export const useTabSwitchDetection = (onSwitch: () => void) => {
  // Detects tab switches by observing document visibility changes.
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) onSwitch();
  }, [onSwitch]);

  // Registers visibility listeners for tab-switch behavior tracking.
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleVisibilityChange]);
};

