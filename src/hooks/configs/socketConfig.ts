import { Market } from '../../types/orderbook';

export interface Message{
    'event': 'subscribe' | 'unsubscribe',
    'feed': 'book_ui_1',
    'product_ids': Market[]
}
