import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  className?: string;
  color?: 'indigo' | 'green' | 'yellow' | 'red';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showValue = true,
  className = '',
  color = 'indigo'
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  const colorClasses: Record<string, string> = {
    indigo: 'bg-primary-600',
    green: 'bg-success-600',
    yellow: 'bg-yellow-600',
    red: 'bg-destructive-600'
  };

  return (
    <div className={`${className} mb-4`}>
      {label && (
        <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
          <span>{label}</span>
          {showValue && <span>{clampedValue}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colorClasses[color]} h-2.5 rounded-full transition-width duration-500 ease-in-out`}
          style={{ width: `${clampedValue}%` }}
        ></div>
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';