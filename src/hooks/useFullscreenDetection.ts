import { useEffect, useCallback } from 'react';

export function useFullscreenDetection(onExit: () => void) {
  const handleChange = useCallback(() => {
    if (!document.fullscreenElement) onExit();
  }, [onExit]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, [handleChange]);
}
