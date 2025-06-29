// SelectField.jsx
import React from 'react';

const SelectField = ({ label, id, name, value, onChange, options, error, required, ...props }) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={id || name} className="block text-vuka-text text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      id={id || name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-vuka-blue ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    >
      {options && options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-vuka-danger text-sm mt-1">{error}</p>}
  </div>
);

export default SelectField;
