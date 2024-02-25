import { DisplayAnimationHandler } from '../animation/Display';
import { DisplayConfig, LightboxConfig } from '../types/Config';
import { UIElement } from './Dock';

const defaultDisplay = {
    rounded: true,
    animation: {
        enabled: true,
        duration: 600,
    },
} as DisplayConfig;

export default class GVDisplay extends UIElement<'img', 'base'> {
    public animation: DisplayAnimationHandler;
    public config = {} as DisplayConfig;

    constructor(config: LightboxConfig['display']) {
        super('display', 'img', 'base');
        this.element.classList.add('gv__display');
        this.element.setAttribute('alt', 'Gullview display');

        this.config = { ...defaultDisplay, ...config };

        this.animation = new DisplayAnimationHandler(
            this.element,
            config?.animation
        );
    }
}
