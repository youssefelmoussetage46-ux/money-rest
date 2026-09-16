import React from 'react';

interface SimpleTableProps<T> {
  columns: Array<{
    key: keyof T;
    label: string;
    format?: (value: T[keyof T], row?: T) => React.ReactNode;
  }>;
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export const SimpleTable: React.FC<SimpleTableProps<any>> = ({
  columns,
  data,
  emptyMessage = 'No data available',
  className = ''
}) => {
  if (data.length === 0) {
    return (
      <div className={`${className} text-center py-8 text-gray-500`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`${className} overflow-x-auto max-w-full`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={`${index}-${String(row.id || index)}`} className="hover:bg-gray-50">
              {columns.map(column => (
                <td
                  key={`${index}-${String(column.key)}`}
                  className="px-6 py-4 text-sm text-gray-800 whitespace-normal"
                >
                  {column.format ? column.format(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

SimpleTable.displayName = 'SimpleTable';