import { useEffect, useState } from 'react';

export const useScreenReaderDetection = () => {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    // Method 1: Check for screen reader specific classes/styles
    const checkScreenReader = () => {
      const hasScreenReaderClass = document.body.classList.contains('screen-reader-active');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasAriaLive = document.querySelector('[aria-live]') !== null;
      
      // Method 2: Check localStorage for user preference
      const userPreference = localStorage.getItem('accessibility_screenReader') === 'true';
      
      // Method 3: Check if speech was triggered by voice command
      const voiceTriggered = localStorage.getItem('voice_navigation_active') === 'true';
      
      return userPreference || voiceTriggered || prefersReducedMotion || hasScreenReaderClass || hasAriaLive;
    };

    setIsScreenReaderActive(checkScreenReader());

    // Observe DOM changes for accessibility attributes
    const observer = new MutationObserver(() => {
      setIsScreenReaderActive(checkScreenReader());
    });

    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'aria-live'] 
    });

    return () => observer.disconnect();
  }, []);

  return isScreenReaderActive;
};