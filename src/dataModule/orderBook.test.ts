import { addOrders, defaultOrderBook, setTotals } from './orderBook';
import { OrderBook } from '../types/orderbook';

test('test the default orderbook is empty', () => {
  expect(Object.keys(defaultOrderBook.bids).length).toEqual(0);
});
test('test addOrders support empty bids/asks', () => {
  const orderBook: OrderBook = defaultOrderBook;
  const newOrders = { bids: [], asks: [] };
  expect(addOrders({ orderBook, newOrders })).toEqual(defaultOrderBook);
});

test('test addOrders adding bids/asks correctly', () => {
  const orderBook: OrderBook = defaultOrderBook;
  const newOrders = { bids: [[1, 2], [2, 3]], asks: [[1, 2]] };
  const newOrderbook = addOrders({ orderBook, newOrders });
  expect(newOrderbook.bids['1'].size).toEqual(2);
  expect(newOrderbook.bids['2'].size).toEqual(3);
  expect(newOrderbook.asks['1'].size).toEqual(2);
});
test('test addOrders adding bids/asks correctly and dont it overwrite existing orders', () => {
  const orderBook: OrderBook = defaultOrderBook;
  const newOrders = { bids: [], asks: [[1, 2], [1, 3]] };
  const newOrderbook = addOrders({ orderBook, newOrders });
  expect(newOrderbook.asks['1'].size).toEqual(3);
});
test('test addOrders removing bids/asks correctly ', () => {
  const orderBook: OrderBook = defaultOrderBook;
  const newOrders = { bids: [[1, 2], [2, 3]], asks: [[1, 2], [2, 3]] };
  const newOrders2 = { bids: [], asks: [[1, 0], [2, 0]] };
  const newOrderbook1 = addOrders({ orderBook, newOrders });
  const newOrderbook2 = addOrders({ orderBook: newOrderbook1, newOrders: newOrders2 });
  expect((newOrderbook2.bids)).toEqual({
    1: {
      price: 1,
      size: 2,
      total: 2,
    },
    2: {
      price: 2,
      size: 3,
      total: 3,
    },
  });
  expect((newOrderbook2.asks)).toEqual({});
});

test('test setTotals', () => {
  const orderBook = addOrders({
    orderBook: defaultOrderBook,
    newOrders: {
      bids: [[1, 2], [2, 3]],
      asks: [[1, 2], [2, 6]],
    },
  });
  const newOrderBook = setTotals(orderBook);
  expect(newOrderBook.bidsOrdersTotal).toEqual(5);
  expect(newOrderBook.asksOrdersTotal).toEqual(8);
});
