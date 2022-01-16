export const enum Market {
    PI_XBTUSD = 'PI_XBTUSD',
    PI_ETHUSD = 'PI_ETHUSD',
}
export type Order = { price: number, size: number, total: number}
export type OrderBook ={
    market: Market.PI_XBTUSD | Market.PI_ETHUSD,
    numLevels: number,
    // price is a string because object don't support fully properties as numbers (for example Object.keys function)
    bids:  {[price : string]: Order},
    asks : {[price : string]: Order},
    asksOrdersTotal : number;
    bidsOrdersTotal : number;
} 