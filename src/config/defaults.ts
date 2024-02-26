import { DisplayConfig, ZoomConfig, CounterConfig } from '@/types/Config';

export default {
    targetClass: 'gv_src',
    counter: {
        enabled: true,
        y: 'top',
        x: 'left',
        animation: {
            enabled: false,
            duration: 400,
            keyframes_updateCurrent: 'gv_counter_update',
        },
    },
    display: {
        rounded: true,
        animation: {
            keyframes_prev: 'gv_display_prev',
            keyframes_next: 'gv_display_next',
            enabled: false,
            duration: 400,
            morph: {
                enabled: false,
                duration: 450,
            },
        },
    },
    zoom: {
        enabled: false,
        level: 3,
        blockNative: true,
    },
} satisfies GlobalConfig;

type GlobalConfig = {
    targetClass: string;
    counter: CounterConfig;
    display: DisplayConfig;
    zoom: ZoomConfig;
};
