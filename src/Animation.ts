import { ImageObject, LightboxConfig } from "./Lightbox";
import { UIConfig } from "./UI";

export type AnimationDisplayConfig = {
  enabled: boolean;
  duration: number;
  next: string;
  prev: string;
};

export type AnimationConfig = {
  display: AnimationDisplayConfig;
};

const displayDefaults = {
  enabled: false,
  duration: 600,
  next: "gv_next",
  prev: "gv_prev",
} satisfies AnimationDisplayConfig;

export class DisplayAnimationHandler {
  public config = {} as UIConfig["animation"]["display"];
  private animationQueue: Array<ReturnType<typeof setTimeout>> = [];
  private element: HTMLElement;

  constructor(elem: HTMLElement, config?: Partial<AnimationDisplayConfig>) {
    this.element = elem;
    this.config = { ...displayDefaults, ...config };
    this.injectCSSClasses();
  }

  public clearQueue = () => {
    this.animationQueue.forEach((id) => clearTimeout(id));
    this.animationQueue = [];
  };

  public swapTo = (
    source: ImageObject,
    direction: "prev" | "next" = "next"
  ) => {
    const inClasses = ["slideIn", direction];
    const outClasses = ["slideOut", direction];

    const fullDuration = this.config.duration;
    const halfDuration = fullDuration / 2;

    this.element.classList.add(...outClasses);
    this.animationQueue.push(
      setTimeout(() => {
        this.element.classList.remove(...outClasses);
        this.element.classList.add(...inClasses);
      }, halfDuration)
    );

    this.animationQueue.push(
      setTimeout(() => {
        this.element.classList.remove(...inClasses);
      }, fullDuration)
    );

    // Conditionally delay the source swap
    this.animationQueue.push(
      setTimeout(
        () => {
          this.element.setAttribute("src", source.image.src);
          this.element.setAttribute("alt", source.image.alt);
        },
        this.config.enabled ? halfDuration : 0
      )
    );
  };

  private injectCSSClasses() {
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");

    const nextKF = this.config?.next || displayDefaults.next;
    const prevKF = this.config?.prev || displayDefaults.prev;
    const duration = (this.config?.duration || displayDefaults.duration) / 2;

    const css = `
			.lightbox__display.slideIn.next {
    			animation: ${nextKF} ${duration}ms normal forwards;
				animation-timing-function: ease-out;
			}

			.lightbox__display.slideOut.next {
    			animation: ${prevKF} ${duration}ms normal forwards;
				animation-timing-function: ease-in;
			}

			.lightbox__display.slideIn.prev {
    			animation: ${prevKF} ${duration}ms reverse forwards;
				animation-timing-function: ease-out;
			}

			.lightbox__display.slideOut.prev {
				animation-timing-function: ease-in;
    			animation: ${nextKF} ${duration}ms reverse forwards;
			}
			`;
    head.appendChild(style);
    style.appendChild(document.createTextNode(css));
  }
}
