import Gullview from './Gullview';
import { LightboxConfig } from './types/Config';

export const build = (config: LightboxConfig) => {
    return Gullview.build(config);
};

build({
    targetClass: 'lightbox__src',
    animation: {
        display: {
            enabled: true,
            duration: 600,
            morph: {
                duration: 600,
            },
        },
    },
    dock: {
        enabled: true,
        download: true,
    },
}).init();
