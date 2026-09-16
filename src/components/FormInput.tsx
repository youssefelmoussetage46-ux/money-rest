import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  multiline = false,
  rows = 4
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="block text-sm font-medium text-gray-500 mb-1">
        {label}{required && ' *'}
      </label>
      {multiline ? (
        <textarea
          id={label.toLowerCase().replace(/\s+/g, '-')}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`mt-1 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${error ? 'border-destructive-500' : ''}`}
        />
      ) : (
        <input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`mt-1 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${error ? 'border-destructive-500' : ''}`}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-destructive-600">{error}</p>
      )}
    </div>
  );
};

FormInput.displayName = 'FormInput';