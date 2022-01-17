import { memo } from 'react';
import { Order } from '../types/orderbook';
import { calculateColorAndSize } from './utils/calculateBackgroundGradient';
// a nice way to use pure component with functional components.
// (we're still waiting for React.pure function
// see https://github.com/reactjs/rfcs/pull/63
export interface OrderRowProps{
    order: Order;
    orderType: 'asks'| 'bids';
    ordersTotal: number; // the total of all the orders in the orderBook for the same orderType
}
export const OrderRow = memo(({ order, orderType, ordersTotal }:OrderRowProps) => (
  <tr style={calculateColorAndSize({ order, orderType, ordersTotal })}>
    <td>{order.total.toLocaleString()}</td>
    <td>{order.size.toLocaleString()}</td>
    <td className={`price-${orderType}`}>
      {order.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </td>
  </tr>
));
