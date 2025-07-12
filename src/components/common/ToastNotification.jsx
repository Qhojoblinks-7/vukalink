// src/components/common/ToastNotification.jsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // To clear toast on route change

const ToastNotification = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsVisible(true); // Show when message/type changes
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Give time for exit animation before calling onDismiss
        setTimeout(onDismiss, 300);
      }, 5000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, type, onDismiss]);

  // Dismiss toast on route change
  useEffect(() => {
    if (message) { // Only dismiss if there's an active message
      setIsVisible(false);
      const timer = setTimeout(onDismiss, 300); // Allow animation
      return () => clearTimeout(timer);
    }
  }, [location.pathname, onDismiss, message]);


  if (!message || !isVisible) return null;

  const backgroundColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const textColor = 'text-white';
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex items-center z-50 ${backgroundColor} ${textColor}`}
          role="alert"
        >
          <i className={`fas ${icon} mr-3`}></i>
          <span>{message}</span>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 300); // Allow exit animation
            }}
            className="ml-auto p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
          >
            <i className="fas fa-times text-white text-opacity-75"></i>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;