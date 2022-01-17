import { Market, OrderBook } from '../types/orderbook';

// TODO can improved with service web worker
export const NUM_LEVEL = 25;
export const defaultOrderBook: OrderBook = {
  numLevels: NUM_LEVEL,
  market: Market.PI_XBTUSD,
  bids: {},
  asks: {},
  bidsOrdersTotal: 0,
  asksOrdersTotal: 0,

};
// I've decided to go on mutable approach instead of redux/flux/mobx for a bit saving boilerplating
interface AddOrders{
    orderBook: OrderBook;
    newOrders : {bids: number[][], asks: number[][]};
}
// TODO use immutable js on orderBook
export const addOrders = ({ orderBook, newOrders }: AddOrders) => {
  const orderBookShallowCopy = { ...orderBook };
  const iterateOrders = (key: 'asks'| 'bids') => {
    newOrders[key].forEach((order) => {
      if (order[1] === 0) {
        delete orderBookShallowCopy[key][order[0].toString()];
      } else {
        orderBookShallowCopy[key][order[0].toString()] = {
          price: order[0],
          size: order[1],
          total: order[1],
        };
      }
    });
  };
  iterateOrders('asks');
  iterateOrders('bids');
  return orderBookShallowCopy;
};
interface ChangeMarket{
    market: Market;
    numLevels : number;
}
// TODO a nicer way is to use an object generate function
//  instead (the return value should call to another function)
export const changeMarket = ({ market, numLevels }: ChangeMarket) => ({
  numLevels,
  market,
  bids: {},
  asks: {},
  asksOrdersTotal: 0,
  bidsOrdersTotal: 0,
});

export const setTotals = (orderBook: OrderBook) => {
  const orderBookCopy = { ...orderBook };
  const bidsSorted = Object.keys(orderBookCopy.bids)
    .map((price) => parseFloat(price))
    .sort();
  bidsSorted.forEach((price, index) => {
    orderBookCopy.bids[price].total = (orderBookCopy.bids[bidsSorted[index - 1]]?.total || 0)
           + orderBookCopy.bids[price].size;
  });
  const asksSorted = Object.keys(orderBookCopy.asks)
    .map((price) => parseFloat(price))
    .sort().reverse();
  asksSorted.forEach((price, index) => {
    orderBookCopy.asks[price].total = (orderBookCopy.asks[bidsSorted[index - 1]]?.total || 0)
            + orderBookCopy.asks[price].size;
  });
  // set total of all book together
  orderBookCopy.asksOrdersTotal = Object.keys(orderBookCopy.asks)
    .reduce((previousTotal, price) => orderBookCopy.asks[price].size + previousTotal, 0);
  orderBookCopy.bidsOrdersTotal = Object.keys(orderBookCopy.bids)
    .reduce((previousTotal, price) => orderBookCopy.bids[price].size + previousTotal, 0);
  return orderBookCopy;
};
