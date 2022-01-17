import { useFetchSocket } from '../hooks/useFetchSocket';
import { Market } from '../types/orderbook';
import { OrderRow } from './orderRow';

export function OrderBookTable() {
  const {
    orderBookState, isAscending, setIsAscending, market, setMarket,
  } = useFetchSocket(Market.PI_ETHUSD);

  const generateTable = (orderType: 'asks' | 'bids') => {
    const ordersSorted = Object.keys(orderBookState.bids)
      .map((key) => orderBookState.bids[key as unknown as number])
      .sort((order1, order2) => {
        if (order1.price > order2.price) {
          return isAscending ? 1 : -1;
        }
        return isAscending ? -1 : 1;
      });
    return (
      <tbody>
        {ordersSorted
          .map((order) => (
            <OrderRow
              key={order.price}
              order={{ ...order }}
              orderType={orderType}
              ordersTotal={orderType === 'asks' ? orderBookState.asksOrdersTotal : orderBookState.bidsOrdersTotal}
            />
          ))}
      </tbody>
    );
  };
  return (
    <div>
      <div className="table-controls">
        <span>{market}</span>
        <button
          type="button"
          onClick={() => setIsAscending(!isAscending)}
        >
          Change Direction
        </button>
        <button
          type="button"
          onClick={() => setMarket(market === Market.PI_ETHUSD
            ? Market.PI_XBTUSD : Market.PI_ETHUSD)}
        >
          Toggle
        </button>
      </div>
      <div className="order-tables">
        <table>
          <thead>
            <tr>
              <th>TOTAL</th>
              <th>size</th>
              <th>PRICE</th>
            </tr>
          </thead>

          {generateTable('bids')}
        </table>
        <table>
          <thead>
            <tr>
              <th>TOTAL</th>
              <th>size</th>
              <th>PRICE</th>
            </tr>
          </thead>
          {generateTable('asks')}
        </table>
      </div>
    </div>
  );
}
