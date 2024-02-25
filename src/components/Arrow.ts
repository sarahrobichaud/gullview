import { GVModule } from '@components/GVModule';

export default class GVArrow extends GVModule<'button', 'core'> {
    public direction: 'prev' | 'next';
    private leftSVG =
        '<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
    private rightSVG =
        '<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

    constructor(direction: 'prev' | 'next') {
        super('arrow', 'button', 'core');
        this.element.innerHTML =
            direction === 'prev' ? this.leftSVG : this.rightSVG;
        this.element.classList.add('gv__arrow', direction);
        this.direction = direction;
    }
}
