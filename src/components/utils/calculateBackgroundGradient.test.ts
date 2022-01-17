import { calculateColorAndSize } from './calculateBackgroundGradient';
import { Order } from '../../types/orderbook';

test('test gradient is correct ratio to the total', () => {
  const order: Order = { price: 222, size: 2, total: 5 };
  const ordersTotal = 10;
  const orderType = 'asks';
  expect(calculateColorAndSize({ order, orderType, ordersTotal }).background).toEqual(`linear-gradient(90deg, rgba(255, 0, 0, 0.2) 0%,  rgba(255, 0, 0, 0.2)  ${(order.total / ordersTotal) * 100}%, rgba(0,0,0,0) 50.1%, rgba(0,212,255,0) 100%)`);
});
