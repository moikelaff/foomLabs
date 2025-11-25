import { clsx } from 'clsx';
import React from 'react';

interface StatusBadgeProps {
  status: 'DRAFT' | 'PENDING' | 'COMPLETED';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
        {
          'bg-gray-100 text-gray-800': status === 'DRAFT',
          'bg-yellow-100 text-yellow-800': status === 'PENDING',
          'bg-green-100 text-green-800': status === 'COMPLETED',
        }
      )}
    >
      {status}
    </span>
  );
}
