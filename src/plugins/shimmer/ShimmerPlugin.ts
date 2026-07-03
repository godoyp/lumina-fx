import { BasePlugin } from "../../core";

export type ShimmerIntensity =
    | "soft"
    | "medium"
    | "strong";

export type ShimmerTarget =
    | HTMLElement
    | string;

export interface ShimmerPluginOptions {

    className?: string;

    duration?: number;

    intensity?: ShimmerIntensity;

}

export class ShimmerPlugin extends BasePlugin {

    readonly metadata = {
        name: "shimmer",
        version: "1.0.0",
        description: "Executa feedback visual de atualização em elementos."
    };

    private readonly className: string;

    private readonly duration: number;

    private readonly intensity: ShimmerIntensity;

    private readonly timers =
        new Map<HTMLElement, number>();

    constructor(options: ShimmerPluginOptions = {}) {

        super();

        this.className =
            options.className ??
            "lumina-shimmer";

        this.duration =
            options.duration ??
            900;

        this.intensity =
            options.intensity ??
            "medium";

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.logger.info(
            "[Lumina Shimmer] Initialized."
        );

    }

    protected onDestroy(): void {

        for (const timer of this.timers.values()) {

            clearTimeout(timer);

        }

        for (const element of this.timers.keys()) {

            this.cleanup(element);

        }

        this.timers.clear();

    }

    pulse(target: ShimmerTarget): void {

        const element =
            this.resolveTarget(target);

        if (!element) {
            return;
        }

        this.start(element);

    }

    pulseAll(selector: string): void {

        const elements =
            this.dom.findAll<HTMLElement>(
                selector
            );

        for (const element of elements) {

            this.start(element);

        }

    }

    private start(element: HTMLElement): void {

        this.restartIfRunning(element);

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
            "--lumina-shimmer-duration",
            `${this.duration}ms`
        );

        this.emit(
            "shimmer:start",
            {
                element
            }
        );

        const timer =
            window.setTimeout(
                () => {

                    this.cleanup(element);

                    this.emit(
                        "shimmer:end",
                        {
                            element
                        }
                    );

                },
                this.duration
            );

        this.timers.set(
            element,
            timer
        );

    }

    private restartIfRunning(
        element: HTMLElement
    ): void {

        const currentTimer =
            this.timers.get(element);

        if (currentTimer) {

            clearTimeout(currentTimer);

            this.timers.delete(element);

        }

        this.cleanup(element);

        // Força restart da animação caso o shimmer seja chamado
        // várias vezes seguidas no mesmo elemento.
        element.offsetHeight;

    }

    private cleanup(
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

        this.dom.style(
            element,
            "--lumina-shimmer-duration",
            ""
        );

        this.timers.delete(element);

    }

    private resolveTarget(
        target: ShimmerTarget
    ): HTMLElement | null {

        if (typeof target === "string") {

            return this.dom.find<HTMLElement>(
                target
            );

        }

        return target;

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-shimmer-style",
            `
                .${this.className} {
                    overflow: hidden;
                    isolation: isolate;
                }

                .${this.className}:not([data-lumina-shimmer-layer]) {
                    position: relative;
                }

                .${this.className}[data-lumina-shimmer-layer] {
                    position: absolute;
                    inset: 0;
                }

                .${this.className}::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 1;

                    background:
                        linear-gradient(
                            115deg,
                            transparent 0%,
                            transparent 32%,
                            var(--lumina-shimmer-color, rgba(255, 255, 255, 0.28)) 50%,
                            transparent 68%,
                            transparent 100%
                        );

                    transform: translateX(-130%);
                    animation:
                        lumina-shimmer-sweep
                        var(--lumina-shimmer-duration, 900ms)
                        ease-in-out
                        1;
                }

                .${this.className}-soft {
                    --lumina-shimmer-color: rgba(255, 255, 255, 0.16);
                }

                .${this.className}-medium {
                    --lumina-shimmer-color: rgba(255, 255, 255, 0.30);
                }

                .${this.className}-strong {
                    --lumina-shimmer-color: rgba(255, 255, 255, 0.46);
                }

                @keyframes lumina-shimmer-sweep {
                    from {
                        transform: translateX(-130%);
                    }

                    to {
                        transform: translateX(130%);
                    }
                }
            `
        );

    }

}