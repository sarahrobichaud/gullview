import { CounterConfig } from '../types/Animation';
import { LightboxConfig } from '../types/Config';

const defaultCounter = {
    enabled: false,
    y: 'top',
    x: 'left',
} satisfies CounterConfig;

export default class Counter {
    private config = {} as LightboxConfig['counter'];
    constructor(config?: Partial<CounterConfig>) {
        this.config = { ...defaultCounter, ...config };
    }
}
