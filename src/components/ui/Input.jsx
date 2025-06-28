// src/components/ui/Input.jsx
import React from 'react';

const Input = ({
  type = 'text',      // Default input type
  className = '',     // For external Tailwind classes
  placeholder = '',   // Standard placeholder text
  label,              // Label text for the input
  id,                 // Unique ID for linking label to input (Accessibility!)
  error,              // Error message string
  ...props            // Any other standard input attributes (e.g., value, onChange, required)
}) => {
  // Base styles applied to all inputs
  const baseStyles = `
    block w-full px-4 py-2 text-base rounded-lg border
    focus:outline-none focus:ring-2
    transition-all duration-200
  `;

  // Conditional border styles for error state
  const defaultBorder = 'border-vuka-light-grey focus:border-blue-900  focus:ring-blue-900 /50';
  const errorBorder = 'border-vuka-danger focus:border-vuka-danger focus:ring-vuka-danger/50';

  return (
    // Container for grouping label, input, and error message
    <div className="mb-4">
      {label && (
        // Accessibility Best Practice: Use <label> for form elements.
        // `htmlFor` links the label to the input via its `id`.
        <label htmlFor={id} className="block text-vuka-text text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id} // Link to label
        placeholder={placeholder}
        // Conditional class merging for error state and external classes
        className={`${baseStyles} ${error ? errorBorder : defaultBorder} ${className}`}
        {...props} // Pass through all other props (value, onChange, name, etc.)
      />
      {/* Error Message Display: Conditional rendering of error message. */}
      {error && (
        <p className="text-vuka-danger text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;