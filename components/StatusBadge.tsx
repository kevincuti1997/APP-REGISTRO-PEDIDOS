
import React from 'react';
import { OrderStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  return (
    <span className={`${STATUS_COLORS[status]} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} font-medium rounded-full border shadow-sm`}>
      {status}
    </span>
  );
};
