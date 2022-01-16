import {
    Market
} from "../types/orderbook";
import {
    Message
} from "./configs/socketConfig";
import {
    useEffect, useRef,
    useState
} from "react";
import {
    addOrders,
    changeMarket,
    defaultOrderBook
} from "../dataModule/OrderBook";
import {useRequestAnimationFrame} from "./useRequestAnimationFrame";


// technically useFetchSocket is holding a ReactContext, but for the sake of the assignment we will keep it shorter for now.
//TODO convert to a React Context
//TODO the useFetch has a lot of business logic- nice to have to move it to another module
export const useFetchSocket = (productId: Market) => {
    let orderBookCached = useRef(defaultOrderBook);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isAscending, setIsAscending] = useState(true);
    const [message, setMessage] = useState('');
    useRequestAnimationFrame();

    useEffect(() => {
        if (WebSocket) {
            // TODO error handling
            const url = "wss://www.cryptofacilities.com/ws/v1";
            const socket = new WebSocket(url);
            socket.onopen = ()=>{
                const configMessage: Message = {
                    product_ids: [productId],
                    event: 'subscribe',
                    feed: 'book_ui_1'
                }
                socket.send(JSON.stringify(configMessage));
            }
            socket.onclose = () => {
                // TODO
            };
            socket.onerror = () => {
                // TODO error handling
                setMessage("Couldn't connect")
            }
            socket.onmessage = (message) => {
                //TODO move types/interface to type file
                let data: {
                    "event": string;
                    "feed": string;
                    "product_ids": Market[];
                    message: string;
                } & {
                    "numLevels" ? : number;
                    "feed": string;
                    "bids" ? : number[][];
                    "asks" ? : number[][];
                    "product_id": Market;
                };
                try {
                    data = JSON.parse(message.data);
                    if (data.event === 'error') {
                        // TODO error from data.message
                        setMessage(data.message);

                    }
                    if (data.event === "subscribed") {
                        setIsSubscribed(true);
                        return;
                    }

                    const {numLevels, product_id} = data;
                    // reset market
                    if (numLevels) {
                        orderBookCached.current = changeMarket( {market :product_id, numLevels});
                    }
                    if (data.bids && data.asks){
                        orderBookCached.current = addOrders({orderBook: orderBookCached.current,
                            newOrders:
                                { bids: data.bids,
                                    asks : data.asks}});
                    }else{
                        //TODO error handling
                        setMessage('Error wrong data');
                    }


                } catch (e) {
                    //TODO error handling
                    setMessage('error retrieving data');
                }

            }
            return ()=>{
                socket.close();
            }
        } else {
            setMessage('Browser do not support web sockets');
        }

    }, []);

    return {
        isSubscribed,
        message,
        isAscending,
        setIsAscending,
        orderBookState: orderBookCached.current
    };
}