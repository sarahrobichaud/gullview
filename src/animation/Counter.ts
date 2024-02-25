import { AnimationCounterConfig } from '../types/Animation';
import defaults from '@config/defaults';

export class CounterAnimationHandler {
    public config = {} as AnimationCounterConfig;
    private element: HTMLElement;
    private pendingTimeout: number | null = null;

    constructor(elem: HTMLElement, config?: Partial<AnimationCounterConfig>) {
        this.element = elem;

        this.config = { ...defaults.counter.animation, ...config };

        this.injectCSSClasses();
    }

    private injectCSSClasses() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

        const keyFrames = this.config.keyframes;
        const duration = this.config.duration;

        const css = `
            .gv__counter.current.updated {
                animation: ${keyFrames} ${duration}ms ease-in-out forwards;
                -webkit-animation: ${keyFrames} ${duration}ms ease-in-out forwards;
            }
        `;
        head.appendChild(style);
        style.appendChild(document.createTextNode(css));
    }

    public popIn = () => {
        if (this.pendingTimeout) clearTimeout(this.pendingTimeout);
        this.element.classList.add('updated');
        this.pendingTimeout = setTimeout(() => {
            this.element.classList.remove('updated');
        }, this.config.duration);
    };
}
