import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  footer
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.displayName = 'Card';