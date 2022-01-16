import {useFetchSocket} from "../hooks/useFetchSocket";
import {Market} from "../types/orderbook";
import {OrderRow} from "./orderRow";
import {NUM_LEVEL} from "../dataModule/OrderBook";
import {useMemo} from "react";


export const OrderBookTable = ()=>{
    const {isSubscribed, orderBookState, message, isAscending, setIsAscending} = useFetchSocket(Market.PI_ETHUSD);

    const generateTable =(orderType: 'asks' | 'bids')=>{
        const totals: number[] = [];
        const ordersSorted = Object.keys(orderBookState.bids)
            .map((key)=>orderBookState.bids[key as unknown as number])
            .sort((order1,order2)=>{
                if (order1.price > order2.price) {
                    return isAscending? 1:-1;
                }
                return isAscending? -1:1;
            });
        return <tbody>
        {ordersSorted
            .map((order,index)=>{
                // easy way to calculate the total faster than in the order book module.
                // more readable code can be in the module and not in the component, but it is performance vs readability
                const prevIndexTotal = isAscending ?index-1 : index+1;
                const lastTotal = totals[prevIndexTotal];
                const total = isNaN(lastTotal) ? order.total : lastTotal + order.total;
                totals.push(total);
                return <OrderRow
                    key={index}
                    order={{...order, total}} orderType={orderType}
                ordersTotal={orderType === 'asks' ? orderBookState.asksOrdersTotal : orderBookState.bidsOrdersTotal}/>
            }) || <></>}
    </tbody>};
    return <div>
        <a href="#" className="myButton" onClick={()=>
            setIsAscending(!isAscending)
        }>Change Direction</a>
        <div className='order-tables'>
        <table>
            <thead>
            <tr><th>TOTAL</th><th>size</th><th>PRICE</th></tr>
            </thead>

            {generateTable('bids')}
    </table>
        <table>
            <thead>
            <tr><th>TOTAL</th><th>size</th><th>PRICE</th></tr>
            </thead>
            {generateTable('asks')}
        </table>
    </div>
    </div>
}