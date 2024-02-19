import Gullview from './Gullview';
import { LightboxConfig } from './types/Config';

export const build = (config: LightboxConfig) => {
    return Gullview.build(config);
};

// Sandbox
build({
    targetClass: 'lightbox__src',
    animation: {
        display: { enabled: true },
    },
    dock: {
        enabled: true,
        zoom: true,
    },
}).init();
