import React from 'react';

const Text = ({ variant = 'p', className = '', children, ...restProps }) => {
    // Determine the appropriate HTML tag based on the 'variant' prop
    const Tag = variant;

    // Define the base class for the text component
    const baseClass = `${className}`;

    // Tailwind CSS classes based on variants
    const tailwindClasses = {
        'h1': 'text-4xl font-bold',
        'h2': 'text-3xl font-semibold',
        'h3': 'text-2xl font-medium',
        'h4': 'text-xl font-medium',
        'h5': 'text-lg font-medium',
        'h6': 'text-base font-medium',
        'p': 'text-base',
    };

    // Combine base class and Tailwind classes
    const combinedClass = `${baseClass} ${tailwindClasses[variant]}`;

    return <Tag className={combinedClass} {...restProps}>{children}</Tag>;
};

export default Text;
