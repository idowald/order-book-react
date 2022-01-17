import { OrderRowProps } from '../orderRow';

export const calculateColorAndSize = ({ order, ordersTotal, orderType }:OrderRowProps) => {
  const sizePercentage = (100 * order.total) / ordersTotal;
  const backgroundColor = orderType === 'asks' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
  return {
    background: `linear-gradient(${orderType === 'bids' ? '270deg' : '90deg'}, ${backgroundColor} 0%,  ${backgroundColor}  ${sizePercentage}%, rgba(0,0,0,0) ${sizePercentage + 0.1}%, rgba(0,212,255,0) 100%)`,
  };
};
