import { useState, useEffect } from 'react';

// Provides use Online Status behavior for reusable component logic.
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Registers browser connectivity listeners for offline mode awareness.
  useEffect(() => {
    // Marks the client as online when connectivity is restored.
    const handleOnline = () => setIsOnline(true);
    // Marks the client as offline when connectivity is lost.
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

