// src/plugins/spotlight/SpotlightPlugin.ts

import { BasePlugin } from "../../core";

export type SpotlightIntensity =
    | "soft"
    | "medium"
    | "strong";

interface SpotlightInstance {

    element: HTMLElement;

}

export interface SpotlightPluginOptions {

    selector?: string;

    className?: string;

    size?: number;

    color?: string;

    intensity?: SpotlightIntensity;

}

export class SpotlightPlugin extends BasePlugin {

    readonly metadata = {
        name: "spotlight",
        version: "1.0.0",
        description: "Applies a radial glow that follows the cursor."
    };

    private readonly selector: string;

    private readonly className: string;

    private readonly size: number;

    private readonly color: string;

    private readonly intensity: SpotlightIntensity;

    private readonly instances: SpotlightInstance[] = [];

    private readonly unsubscribeListeners: Array<() => void> = [];

    constructor(options: SpotlightPluginOptions = {}) {

        super();

        this.selector =
            options.selector ??
            "[data-lumina-spotlight]";

        this.className =
            options.className ??
            "lumina-spotlight";

        this.size =
            options.size ??
            260;

        this.color =
            options.color ??
            "var(--lumina-spotlight-color-default)";

        this.intensity =
            options.intensity ??
            "medium";

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.collectInstances();

        this.setupListeners();

        this.logger.info(
            `[Lumina Spotlight] Initialized ${this.instances.length} element(s).`
        );

    }

    protected onDestroy(): void {

        for (const unsubscribe of this.unsubscribeListeners) {

            unsubscribe();

        }

        this.unsubscribeListeners.length =
            0;

        for (const instance of this.instances) {

            this.cleanupElement(
                instance.element
            );

        }

        this.instances.length =
            0;

    }

    private collectInstances(): void {

        const elements =
            this.dom.findAll<HTMLElement>(
                this.selector
            );

        for (const element of elements) {

            this.prepareElement(element);

            this.instances.push({
                element
            });

        }

    }

    private prepareElement(
        element: HTMLElement
    ): void {

        this.dom.addClass(
            element,
            this.className
        );

        this.dom.addClass(
            element,
            `${this.className}-${this.intensity}`
        );

        this.dom.style(
            element,
            "--lumina-spotlight-size",
            `${this.size}px`
        );

        this.dom.style(
            element,
            "--lumina-spotlight-color",
            this.color
        );

    }

    private setupListeners(): void {

        for (const instance of this.instances) {

            const unsubscribeMouseEnter =
                this.dom.listen(
                    instance.element,
                    "mouseenter",
                    () => {

                        this.dom.addClass(
                            instance.element,
                            "is-spotlight-active"
                        );

                        this.emit(
                            "spotlight:enter",
                            {
                                element: instance.element
                            }
                        );

                    }
                );

            const unsubscribeMouseMove =
                this.dom.listen(
                    instance.element,
                    "mousemove",
                    event => {

                        const position =
                            this.dom.pointerWithinElement(
                                instance.element,
                                event
                            );

                        this.dom.style(
                            instance.element,
                            "--lumina-spotlight-x",
                            `${position.x}px`
                        );

                        this.dom.style(
                            instance.element,
                            "--lumina-spotlight-y",
                            `${position.y}px`
                        );

                        this.emit(
                            "spotlight:move",
                            {
                                element: instance.element
                            }
                        );

                    }
                );

            const unsubscribeMouseLeave =
                this.dom.listen(
                    instance.element,
                    "mouseleave",
                    () => {

                        this.dom.removeClass(
                            instance.element,
                            "is-spotlight-active"
                        );

                        this.emit(
                            "spotlight:leave",
                            {
                                element: instance.element
                            }
                        );

                    }
                );

            this.unsubscribeListeners.push(
                unsubscribeMouseEnter,
                unsubscribeMouseMove,
                unsubscribeMouseLeave
            );

        }

    }

    private cleanupElement(
        element: HTMLElement
    ): void {

        this.dom.removeClass(
            element,
            this.className
        );

        this.dom.removeClass(
            element,
            `${this.className}-${this.intensity}`
        );

        this.dom.removeClass(
            element,
            "is-spotlight-active"
        );

        this.dom.style(
            element,
            "--lumina-spotlight-x",
            ""
        );

        this.dom.style(
            element,
            "--lumina-spotlight-y",
            ""
        );

        this.dom.style(
            element,
            "--lumina-spotlight-size",
            ""
        );

        this.dom.style(
            element,
            "--lumina-spotlight-color",
            ""
        );

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-spotlight-style",
            `
                :root {
                    --lumina-spotlight-color-light: rgba(15, 23, 42, .14);
                    --lumina-spotlight-color-dark: rgba(255, 255, 255, .22);
                    --lumina-spotlight-color-default: var(--lumina-spotlight-color-light);
                }

                :root[data-theme="light"] {
                    --lumina-spotlight-color-default: var(--lumina-spotlight-color-light);
                }

                :root[data-theme="dark"] {
                    --lumina-spotlight-color-default: var(--lumina-spotlight-color-dark);
                }

                @media (prefers-color-scheme: dark) {
                    :root:not([data-theme]) {
                        --lumina-spotlight-color-default: var(--lumina-spotlight-color-dark);
                    }
                }

                .${this.className} {
                    position: relative;
                    isolation: isolate;
                }

                .${this.className}:not([data-lumina-spotlight-no-clip]) {
                    overflow: hidden;
                }

                .${this.className}[data-lumina-spotlight-no-clip] {
                    overflow: visible;
                }

                .${this.className} > * {
                    position: relative;
                    z-index: 2;
                }

                .${this.className}::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 220ms ease;

                    background:
                        radial-gradient(
                            circle
                            var(--lumina-spotlight-size, 260px)
                            at
                            var(--lumina-spotlight-x, 50%)
                            var(--lumina-spotlight-y, 50%),
                            var(--lumina-spotlight-color, var(--lumina-spotlight-color-default)),
                            transparent 70%
                        );
                }

                .${this.className}.is-spotlight-active::before {
                    opacity: var(--lumina-spotlight-opacity, .75);
                }

                .${this.className}-soft {
                    --lumina-spotlight-opacity: .45;
                }

                .${this.className}-medium {
                    --lumina-spotlight-opacity: .75;
                }

                .${this.className}-strong {
                    --lumina-spotlight-opacity: 1;
                }
            `
        );

    }

}