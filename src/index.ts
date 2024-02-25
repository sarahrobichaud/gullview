import Gullview from './Gullview';
import { LightboxConfig } from './types/Config';

export const build = (config: LightboxConfig) => {
    return Gullview.build(config);
};

// Sandbox
build({
    targetClass: 'gv_src',
    zoom: {
        enabled: false,
        level: 1.5,
    },
    display: {
        animation: {
            enabled: true,
            duration: 400,
            morph: {
                enabled: true,
                duration: 200,
            },
        },
    },
}).init();
