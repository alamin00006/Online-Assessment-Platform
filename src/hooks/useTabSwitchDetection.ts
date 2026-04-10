import { useEffect, useCallback } from 'react';

export function useTabSwitchDetection(onSwitch: () => void) {
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) onSwitch();
  }, [onSwitch]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleVisibilityChange]);
}
