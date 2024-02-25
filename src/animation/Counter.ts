import { AnimationCounterConfig } from '../types/Animation';

const counterDefaults = {
    enabled: false,
    duration: 300,
    keyframes: 'gv_counter_update',
} satisfies AnimationCounterConfig;

export class CounterAnimationHandler {
    public config = {} as AnimationCounterConfig;
    private element: HTMLElement;
    private pendingTimeout: number | null = null;

    constructor(elem: HTMLElement, config?: Partial<AnimationCounterConfig>) {
        this.element = elem;

        this.config = { ...counterDefaults, ...config };

        this.injectCSSClasses();
    }

    private injectCSSClasses() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

        const keyFrames = this.config.keyframes || counterDefaults.keyframes;
        const duration =
            (this.config?.duration || counterDefaults.duration) / 2;

        const css = `
            .gv__counter.current.updated {
                animation: ${keyFrames} ${duration}ms cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
                -webkit-animation: ${keyFrames} ${duration}ms cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
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
