// src/components/ui/Button.jsx
import React from 'react';

// Functional Component: Clean and reusable.
// Props Destructuring: Makes prop usage clear.
// Default Props: Provides sensible defaults for optional props.
const Button = ({
  children,
  variant = 'primary', // 'primary', 'success', 'warning', 'danger', 'outline', 'ghost'
  size = 'md',        // 'sm', 'md', 'lg'
  className = '',     // Allow custom classes to be passed and merged
  ...props            // Rest props: Allows passing any native button attributes (onClick, type, disabled etc.)
}) => {
  // Base Styles: Encapsulate common button styles.
  let baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Size Styles: Conditional styling based on `size` prop.
  switch (size) {
    case 'sm':
      baseStyles += ' px-3 py-1.5 text-sm';
      break;
    case 'lg':
      baseStyles += ' px-8 py-3 text-lg';
      break;
    case 'md':
    default: // Explicit default case for clarity
      baseStyles += ' px-6 py-2.5 text-base';
      break;
  }

  // Variant Styles: Conditional styling based on `variant` prop.
  // Consistent Hover/Focus States: Enhances user experience.
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
      // Best Practice: Ensure accessible color contrast for outlines.
      baseStyles += ' border-2 border-blue-900  text-blue-900  hover:bg-blue-900  hover:text-vuka-white focus:ring-blue-900 ';
      break;
    case 'ghost':
      baseStyles += ' text-blue-900  hover:bg-blue-900 -lightest focus:ring-blue-900 ';
      break;
    case 'primary':
    default:
      baseStyles += ' bg-blue-900  text-vuka-white hover:bg-vuka-bold  focus:ring-blue-900 ';
      break;
  }

  return (
    // Merge Custom Classes: Allows consumer of Button to add their own Tailwind classes.
    // Spread Props: Ensures all native <button> attributes (like `onClick`, `type`, `disabled`) are passed.
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;