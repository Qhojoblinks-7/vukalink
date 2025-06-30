// InputField.jsx
import React from 'react';

const InputField = ({ label, id, name, type = 'text', value, onChange, placeholder, error, required, ...props }) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={id || name} className="block text-grey-600 -700 text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      id={id || name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;
