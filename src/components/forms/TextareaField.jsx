// TextareaField.jsx
import React from 'react';

const TextareaField = ({ label, id, name, value, onChange, placeholder, error, required, rows = 4, ...props }) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={id || name} className="block text-grey-600 -700 text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      id={id || name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default TextareaField;
