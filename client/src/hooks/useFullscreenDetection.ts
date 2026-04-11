import { useEffect, useCallback } from 'react';

// Provides use Fullscreen Detection behavior for reusable component logic.
export const useFullscreenDetection = (onExit: () => void) => {
  // Detects fullscreen exits during an active candidate exam.
  const handleChange = useCallback(() => {
    if (!document.fullscreenElement) onExit();
  }, [onExit]);

  // Registers fullscreen change listeners for exam behavior tracking.
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, [handleChange]);
};

