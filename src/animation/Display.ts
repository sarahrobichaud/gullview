import { AnimationDisplayConfig } from '../types/Animation';
import { UIConfig } from '../types/Config';
import { ImageObject } from '../types/Gullview';

const displayDefaults = {
    enabled: false,
    duration: 600,
    next: 'gv_next',
    prev: 'gv_prev',
    morph: {
        enabled: false,
        duration: 600,
    },
} satisfies AnimationDisplayConfig;

export class DisplayAnimationHandler {
    public config = {} as UIConfig['animation']['display'];
    private animationQueue: Array<ReturnType<typeof setTimeout>> = [];
    private element: HTMLElement;

    constructor(elem: HTMLElement, config?: Partial<AnimationDisplayConfig>) {
        this.element = elem;

        const baseConfig = { ...displayDefaults, ...config };
        const morphConfig = { ...displayDefaults.morph, ...config?.morph };
        this.config = { ...baseConfig, morph: morphConfig };

        this.injectCSSClasses();
    }

    private injectCSSClasses() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

        const nextKF = this.config?.next || displayDefaults.next;
        const prevKF = this.config?.prev || displayDefaults.prev;
        const transitionDuration =
            (this.config?.duration || displayDefaults.duration) / 2;

        const morphDuration = this.config.morph!.duration;

        const css = `
			.gv__display.slideIn.next {
    			animation: ${nextKF} ${transitionDuration}ms normal forwards;
				animation-timing-function: ease-out;
			}

			.gv__display.slideOut.next {
    			animation: ${prevKF} ${transitionDuration}ms normal forwards;
				animation-timing-function: ease-in;
			}

			.gv__display.slideIn.prev {
    			animation: ${prevKF} ${transitionDuration}ms reverse forwards;
				animation-timing-function: ease-out;
			}

			.gv__display.slideOut.prev {
				animation-timing-function: ease-in;
    			animation: ${nextKF} ${transitionDuration}ms reverse forwards;
			}
            .gv__display.morph {
                -webkit-animation: display-fade-in ${morphDuration}ms cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
                animation: display-fade-in ${morphDuration}ms cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
            }
            .gullview.show {
                -webkit-animation: background-fade-in ${morphDuration}ms cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
                animation: background-fade-in ${morphDuration}ms cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
            }
			`;
        head.appendChild(style);
        style.appendChild(document.createTextNode(css));
    }

    public morphFrom = (target: EventTarget) => {
        this.clearQueue();
        if (!(target instanceof HTMLElement))
            throw new Error('Morph target is not an HTMLElement');

        // calculate offset from target position to center of screen
        const bounds = target.getBoundingClientRect();

        // get center of screen

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // calculate offset from center of target to center of screen
        const offsetX = centerX - bounds.left - bounds.width / 2;
        const offsetY = centerY - bounds.top - bounds.height / 2;

        // translate the display
        this.element.style.translate = `${-offsetX}px ${-offsetY}px`;
        this.element.classList.add('morph');

        this.animationQueue.push(
            setTimeout(() => {
                this.element.style.translate = '0 0';
                this.element.classList.remove('morph');
            }, this.config.morph!.duration) // This is getting a default value from displayDefaults
        );
    };

    public clearQueue = () => {
        this.animationQueue.forEach((id) => clearTimeout(id));
        this.animationQueue = [];
    };

    public swapTo = (
        source: ImageObject,
        direction: 'prev' | 'next' = 'next'
    ) => {
        const inClasses = ['slideIn', direction];
        const outClasses = ['slideOut', direction];

        const fullDuration = this.config.duration;
        const halfDuration = fullDuration / 2;

        this.element.classList.add(...outClasses, 'moving');
        this.animationQueue.push(
            setTimeout(() => {
                this.element.classList.remove(...outClasses);
                this.element.classList.add(...inClasses);
            }, halfDuration)
        );

        this.animationQueue.push(
            setTimeout(() => {
                this.element.classList.remove(...inClasses, 'moving');
            }, fullDuration)
        );

        // Conditionally delay the source swap
        this.animationQueue.push(
            setTimeout(
                () => {
                    this.element.setAttribute('src', source.image.src);
                    this.element.setAttribute('alt', source.image.alt);
                },
                this.config.enabled ? halfDuration : 0
            )
        );
    };
}
export { AnimationDisplayConfig };
