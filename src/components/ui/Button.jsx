// src/components/ui/Button.jsx
import React from 'react';

const Button = ({
  children,
  variant = 'primary', // Can be 'primary', 'success', 'warning', 'danger', 'outline', 'ghost'
  size = 'md',        // Can be 'sm', 'md', 'lg'
  className = '',
  ...props
}) => {
  // Base styles for all buttons
  let baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Size styles
  switch (size) {
    case 'sm':
      baseStyles += ' px-3 py-1.5 text-sm';
      break;
    case 'lg':
      baseStyles += ' px-8 py-3 text-lg';
      break;
    case 'md':
    default:
      baseStyles += ' px-6 py-2.5 text-base';
      break;
  }

  // Variant styles
  switch (variant) {
    case 'success':
      baseStyles += ' bg-vuka-success text-vuka-white hover:bg-green-600 focus:ring-vuka-success';
      break;
    case 'warning':
      baseStyles += ' bg-vuka-warning text-vuka-white hover:bg-orange-600 focus:ring-vuka-warning';
      break;
    case 'danger':
      baseStyles += ' bg-vuka-danger text-vuka-white hover:bg-red-600 focus:ring-vuka-danger';
      break;
    case 'outline':
      baseStyles += ' border-2 border-vuka-blue text-vuka-blue hover:bg-vuka-blue hover:text-vuka-white focus:ring-vuka-blue';
      break;
    case 'ghost':
      baseStyles += ' text-vuka-blue hover:bg-vuka-blue-lightest focus:ring-vuka-blue';
      break;
    case 'primary':
    default:
      baseStyles += ' bg-vuka-blue text-vuka-white hover:bg-vuka-strong focus:ring-vuka-blue';
      break;
  }

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;