import Gullview from '@/Gullview';
import { LightboxConfig } from '@/types/Config';

export const build = (config?: LightboxConfig) => {
    return Gullview.build(config);
};

const gv = Gullview.build({
    zoom: {
        enabled: true,
    },
    counter: {
        x: 'left',
    },
    display: {
        animation: {
            enabled: true,
            morph: { enabled: true },
        },
    },
}).init();
