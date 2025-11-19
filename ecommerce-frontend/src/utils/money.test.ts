import {it, expect, describe} from 'vitest';
import {formatMoney} from './money';

describe('formatMoney', () => {
    it('formats 1999 cents as $19.99', () => {
        expect(formatMoney(1999)).toBe('$19.99');
    })

    it ('display two decimals', ()=> {
        expect (formatMoney (2000)).toBe ('$20.00');
        expect (formatMoney (900)).toBe ('$9.00');

    })
});
