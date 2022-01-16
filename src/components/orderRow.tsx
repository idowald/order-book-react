import {memo} from 'react';
import {Order} from "../types/orderbook";
// a nice way to use pure component with functional components. (we're still waiting for React.pure function
// see https://github.com/reactjs/rfcs/pull/63
interface Props{
    order: Order;
    orderType: 'asks'| 'bids';
    ordersTotal: number; //the total of all the orders in the orderBook for the same orderType
}
export const OrderRow = memo(({order, orderType, ordersTotal}:Props)=>{
    const calculateColorAndSize = ()=>{
        const sizePercentage = (100 * order.total) / ordersTotal;
        const backgroundColor = orderType ==='asks' ? 'rgba(255, 0, 0, 0.2)': 'rgba(0, 255, 0, 0.2)';
        return {
            background: `linear-gradient(${orderType === 'bids' ?'270deg': '90deg'}, ${backgroundColor} 0%,  ${backgroundColor}  ${sizePercentage}%, rgba(0,0,0,0) ${sizePercentage+0.1}%, rgba(0,212,255,0) 100%)`
        }
    }
return <tr style={calculateColorAndSize()}>
    <td>{order.total.toLocaleString()}</td>
    <td>{order.size.toLocaleString()}</td>
    <td className={`price-${orderType}`}>{order.price.toLocaleString()}</td>
</tr>
});