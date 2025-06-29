// InputField.jsx
import React from 'react';

const InputField = ({ label, id, name, type = 'text', value, onChange, placeholder, error, required, ...props }) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={id || name} className="block text-vuka-text text-sm font-medium mb-1">
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
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-vuka-blue ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    />
    {error && <p className="text-vuka-danger text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;
