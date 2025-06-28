// src/components/ui/Input.jsx
import React from 'react';

const Input = ({
  type = 'text',
  className = '',
  placeholder = '',
  label, // Added label prop for accessibility and UI
  id,    // Added id prop to link label and input
  error, // Added error prop for error messages
  ...props
}) => {
  const baseStyles = `
    block w-full px-4 py-2 text-base rounded-lg border
    focus:outline-none focus:ring-2
    transition-all duration-200
  `;

  const defaultBorder = 'border-vuka-light-grey focus:border-vuka-blue focus:ring-vuka-blue/50';
  const errorBorder = 'border-vuka-danger focus:border-vuka-danger focus:ring-vuka-danger/50';

  return (
    <div className="mb-4"> {/* Container for label, input, and error */}
      {label && (
        <label htmlFor={id} className="block text-vuka-text text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`${baseStyles} ${error ? errorBorder : defaultBorder} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-vuka-danger text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;