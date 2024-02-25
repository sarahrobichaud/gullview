import { CounterConfig } from '../types/Animation';
import { LightboxConfig } from '../types/Config';
import { UIElement } from './Dock';

const defaultCounter = {
    enabled: false,
    y: 'top',
    x: 'left',
} satisfies CounterConfig;

export default class GVCounter extends UIElement<'span', 'extra'> {
    private config = {} as LightboxConfig['counter'];
    constructor(config?: Partial<CounterConfig>) {
        super('counter', 'span', 'extra');
        this.config = { ...defaultCounter, ...config };
    }
}
