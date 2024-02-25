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
    counter: {
        enabled: true,
        x: 'center',
        y: 'bottom',
        animation: {
            enabled: true,
            duration: 600,
            keyframes: 'gv_counter_update-custom',
        },
    },
    display: {
        animation: {
            enabled: true,
            duration: 600,
            morph: {
                enabled: true,
                duration: 300,
            },
        },
    },
}).init();
