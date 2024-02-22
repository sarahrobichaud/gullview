import Gullview from './Gullview';
import { LightboxConfig } from './types/Config';

export const build = (config: LightboxConfig) => {
    return Gullview.build(config);
};

// Sandbox
build({
    targetClass: 'gv_src',
    zoom: {
        enabled: true,
        level: 3,
    },
    animation: {
        display: {
            enabled: true,
            duration: 600,
            morph: {
                enabled: true,
                duration: 400,
            },
        },
    },
}).init();
