import { useEffect, useRef, useState } from 'react';
import { Market } from '../types/orderbook';
import { Message } from './configs/socketConfig';
import {
  addOrders, changeMarket, defaultOrderBook, setTotals,
} from '../dataModule/orderBook';
import { useRequestAnimationFrame } from './useRequestAnimationFrame';

// technically useFetchSocket is holding a ReactContext,
// but for the sake of the assignment we will keep it shorter for now.
// TODO convert to a React Context
export const useFetchSocket = (productId: Market) => {
  const newOrdersBuffered = useRef<{bids:number[][], asks:number[][]}>({ bids: [], asks: [] });
  const orderBookCached = useRef(defaultOrderBook);
  const socketRef = useRef<WebSocket>();
  const [market, setMarket] = useState(productId);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  useRequestAnimationFrame(() => {
    // improving performance by calculating totals only before re-render

    const { bids, asks } = newOrdersBuffered.current;
    addOrders({
      orderBook: orderBookCached.current,
      newOrders:
                {
                  bids,
                  asks,
                },
    });
    orderBookCached.current = setTotals(orderBookCached.current);
  });
  useEffect(() => {
    const url = 'wss://www.cryptofacilities.com/ws/v1';
    socketRef.current = new WebSocket(url);
    return () => {
      socketRef.current?.close();
    };
  }, []);
  useEffect(() => {
    if (socketRef.current) {
      if (isSubscribed) {
        socketRef.current?.send(JSON.stringify(
          {
            product_ids: [market === Market.PI_ETHUSD ? Market.PI_XBTUSD : Market.PI_ETHUSD],
            event: 'unsubscribe',
            feed: 'book_ui_1',
          },
        ));
        const configMessage: Message = {
          product_ids: [market],
          event: 'subscribe',
          feed: 'book_ui_1',
        };
        socketRef.current?.send(JSON.stringify(configMessage));
      }
      socketRef.current.onopen = () => {
        const configMessage: Message = {
          product_ids: [market],
          event: 'subscribe',
          feed: 'book_ui_1',
        };
        socketRef.current?.send(JSON.stringify(configMessage));
      };
      socketRef.current.onclose = () => {
        // TODO some handling
      };
      socketRef.current.onerror = () => {
        setErrorMessage("Couldn't connect");
      };
      socketRef.current.onmessage = (message) => {
        // TODO move types/interface to type file
        let data: {
          'event': string;
          'feed': string;
          'product_ids': Market[];
          message: string;
        } & {
          'numLevels'?: number;
          'feed': string;
          'bids'?: number[][];
          'asks'?: number[][];
          'product_id': Market;
        };
        try {
          data = JSON.parse(message.data);
          if (data.event === 'error') {
            setErrorMessage(data.message);
          }
          if (data.event === 'subscribed') {
            setIsSubscribed(true);
            return;
          }

          const { numLevels } = data;
          // reset market
          if (numLevels) {
            orderBookCached.current = changeMarket({ market: data.product_id, numLevels });
            // flush
            newOrdersBuffered.current.asks = [];
            newOrdersBuffered.current.bids = [];
          }
          const { bids, asks } = data;
          if (bids && asks) {
            newOrdersBuffered.current.bids = [...newOrdersBuffered.current.bids, ...bids];
            newOrdersBuffered.current.asks = [...newOrdersBuffered.current.asks, ...asks];
          } else {
            // TODO error handling
            setErrorMessage('Error wrong data');
          }
        } catch (e) {
          // TODO error handling
          setErrorMessage('error retrieving data');
        }
      };
    }
  }, [market]);

  return {
    isSubscribed,
    errorMessage,
    isAscending,
    setIsAscending,
    orderBookState: orderBookCached.current,
    market,
    setMarket,
  };
};
