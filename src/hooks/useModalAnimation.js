import { useState, useEffect } from 'react';

/**
 * Custom hook for modal animations and ESC key handling
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Callback when modal should close
 * @returns {object} - { isVisible, isClosing }
 */
export const useModalAnimation = (isOpen, onClose) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Handle open/close changes
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else if (isVisible) {
      // If parent closes it (e.g. after submit), animate out
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle closing with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Match animation duration
  };

  return { isVisible, isClosing, handleClose };
};
