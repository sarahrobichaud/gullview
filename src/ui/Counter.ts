import { CounterAnimationHandler } from '../animation/Counter';
import { CounterConfig } from '../types/Animation';
import { UIElement } from './Dock';

const defaultCounter = {
    enabled: false,
    y: 'top',
    x: 'left',
    animation: {
        enabled: false,
        duration: 0,
        keyframes: 'gv_counter_update',
    },
} satisfies CounterConfig;

export default class GVCounter extends UIElement<'span', 'extra'> {
    private animation: CounterAnimationHandler;
    private config = {} as CounterConfig;

    private totalSpan = document.createElement('span');
    private currentSpan = document.createElement('span');

    private pendingTimeout: number | null = null;

    //State

    constructor(config?: Partial<CounterConfig>) {
        super('counter', 'span', 'extra');
        this.config = { ...defaultCounter, ...config };

        this.element.appendChild(this.currentSpan);

        this.currentSpan.classList.add('gv__counter', 'current');
        this.totalSpan.classList.add('gv__counter', 'total');

        this.setPosition(this.config);

        this.element.appendChild(this.totalSpan);

        console.log(this.config);

        this.animation = new CounterAnimationHandler(
            this.currentSpan,
            this.config.animation
        );
    }

    private setPosition = ({ x, y }: CounterConfig) => {
        switch (x) {
            case 'left':
                this.element.classList.add('x-left');
                break;
            case 'center':
                this.element.classList.add('x-center');
                break;
            case 'right':
                this.element.classList.add('x-right');
                break;
            default:
                break;
        }

        switch (y) {
            case 'top':
                this.element.classList.add('y-top');
                break;

            case 'bottom':
                this.element.classList.add('y-bottom');
                break;
            default:
                break;
        }
    };

    public set total(total: number) {
        this.updateTotal(total);
    }

    public set count(count: number) {
        if (this.animation.config.enabled) this.animation.popIn();
        this.updateCurrent(count);
    }

    private updateTotal = (value: number) => {
        this.totalSpan.innerHTML = `/${value} `;
    };

    private updateCurrent = (value: number) => {
        this.currentSpan.innerText = ` ${value} `;
    };
}
