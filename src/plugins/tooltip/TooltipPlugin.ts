import { BasePlugin } from "../../core";

export type TooltipPlacement =
    | "top"
    | "right"
    | "bottom"
    | "left";

export type TooltipEffect =
    | "none"
    | "glow";

export interface TooltipPluginOptions {

    selector?: string;

    className?: string;

    placement?: TooltipPlacement;

    offset?: number;

    effect?: TooltipEffect;

}

interface TooltipListener {

    element: HTMLElement;

    type: keyof HTMLElementEventMap;

    listener: EventListener;

}

export class TooltipPlugin extends BasePlugin {

    readonly metadata = {
        name: "tooltip",
        version: "1.0.0",
        description: "Exibe tooltips com posicionamento automático e efeito visual."
    };

    private readonly selector: string;

    private readonly className: string;

    private readonly placement: TooltipPlacement;

    private readonly offset: number;

    private readonly effect: TooltipEffect;

    private tooltip: HTMLElement | null =
        null;

    private activeTrigger: HTMLElement | null =
        null;

    private readonly listeners: TooltipListener[] =
        [];

    constructor(options: TooltipPluginOptions = {}) {

        super();

        this.selector =
            options.selector ??
            "[data-lumina-tooltip]";

        this.className =
            options.className ??
            "lumina-tooltip";

        this.placement =
            options.placement ??
            "top";

        this.offset =
            options.offset ??
            12;

        this.effect =
            options.effect ??
            "glow";

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.createTooltip();

        this.bindTriggers();

        window.addEventListener(
            "scroll",
            this.handleViewportChange,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            this.handleViewportChange
        );

        this.logger.info(
            "[Lumina Tooltip] Initialized."
        );

    }

    protected async onDestroy(): Promise<void> {

        for (const item of this.listeners) {

            item.element.removeEventListener(
                item.type,
                item.listener
            );

        }

        this.listeners.length =
            0;

        window.removeEventListener(
            "scroll",
            this.handleViewportChange
        );

        window.removeEventListener(
            "resize",
            this.handleViewportChange
        );

        this.tooltip?.remove();

        this.tooltip =
            null;

        this.activeTrigger =
            null;

    }

    refresh(): void {

        for (const item of this.listeners) {

            item.element.removeEventListener(
                item.type,
                item.listener
            );

        }

        this.listeners.length =
            0;

        this.bindTriggers();

    }

    private bindTriggers(): void {

        const triggers =
            this.dom.findAll<HTMLElement>(
                this.selector
            );

        for (const trigger of triggers) {

            this.bindTrigger(trigger);

        }

    }

    private bindTrigger(
        trigger: HTMLElement
    ): void {

        const show =
            (): void => {

                this.show(trigger);

            };

        const hide =
            (): void => {

                this.hide();

            };

        const move =
            (): void => {

                if (this.activeTrigger === trigger) {

                    this.positionTooltip(trigger);

                }

            };

        trigger.addEventListener(
            "pointerenter",
            show
        );

        trigger.addEventListener(
            "focus",
            show
        );

        trigger.addEventListener(
            "pointerleave",
            hide
        );

        trigger.addEventListener(
            "blur",
            hide
        );

        trigger.addEventListener(
            "pointermove",
            move
        );

        this.listeners.push(
            {
                element: trigger,
                type: "pointerenter",
                listener: show
            },
            {
                element: trigger,
                type: "focus",
                listener: show
            },
            {
                element: trigger,
                type: "pointerleave",
                listener: hide
            },
            {
                element: trigger,
                type: "blur",
                listener: hide
            },
            {
                element: trigger,
                type: "pointermove",
                listener: move
            }
        );

    }

    private show(
        trigger: HTMLElement
    ): void {

        const text =
            trigger.dataset.luminaTooltip;

        if (!text || !this.tooltip) {
            return;
        }

        this.activeTrigger =
            trigger;

        this.tooltip.textContent =
            text;

        this.dom.addClass(
            this.tooltip,
            "is-visible"
        );

        this.positionTooltip(trigger);

        this.emit(
            "tooltip:show",
            {
                trigger,
                tooltip: this.tooltip,
                text
            }
        );

    }

    private hide(): void {

        if (!this.tooltip || !this.activeTrigger) {
            return;
        }

        const trigger =
            this.activeTrigger;

        const text =
            this.tooltip.textContent ??
            "";

        this.dom.removeClass(
            this.tooltip,
            "is-visible"
        );

        this.emit(
            "tooltip:hide",
            {
                trigger,
                tooltip: this.tooltip,
                text
            }
        );

        this.activeTrigger =
            null;

    }

    private positionTooltip(
        trigger: HTMLElement
    ): void {

        if (!this.tooltip) {
            return;
        }

        const placement =
            this.resolvePlacement(trigger);

        const triggerRect =
            trigger.getBoundingClientRect();

        const tooltipRect =
            this.tooltip.getBoundingClientRect();

        const position =
            this.calculatePosition(
                placement,
                triggerRect,
                tooltipRect
            );

        this.dom.style(
            this.tooltip,
            "left",
            `${position.left}px`
        );

        this.dom.style(
            this.tooltip,
            "top",
            `${position.top}px`
        );

        this.tooltip.dataset.placement =
            placement;

    }

    private calculatePosition(
        placement: TooltipPlacement,
        triggerRect: DOMRect,
        tooltipRect: DOMRect
    ): {
        left: number;
        top: number;
    } {

        if (placement === "bottom") {

            return {
                left:
                    triggerRect.left +
                    triggerRect.width / 2 -
                    tooltipRect.width / 2,
                top:
                    triggerRect.bottom +
                    this.offset
            };

        }

        if (placement === "left") {

            return {
                left:
                    triggerRect.left -
                    tooltipRect.width -
                    this.offset,
                top:
                    triggerRect.top +
                    triggerRect.height / 2 -
                    tooltipRect.height / 2
            };

        }

        if (placement === "right") {

            return {
                left:
                    triggerRect.right +
                    this.offset,
                top:
                    triggerRect.top +
                    triggerRect.height / 2 -
                    tooltipRect.height / 2
            };

        }

        return {
            left:
                triggerRect.left +
                triggerRect.width / 2 -
                tooltipRect.width / 2,
            top:
                triggerRect.top -
                tooltipRect.height -
                this.offset
        };

    }

    private resolvePlacement(
        trigger: HTMLElement
    ): TooltipPlacement {

        const placement =
            trigger.dataset.luminaTooltipPlacement;

        if (
            placement === "top" ||
            placement === "right" ||
            placement === "bottom" ||
            placement === "left"
        ) {
            return placement;
        }

        return this.placement;

    }

    private createTooltip(): void {

        const tooltip =
            document.createElement("div");

        this.dom.addClass(
            tooltip,
            this.className
        );

        if (this.effect === "glow") {

            this.dom.addClass(
                tooltip,
                `${this.className}-glow`
            );

        }

        tooltip.setAttribute(
            "role",
            "tooltip"
        );

        document.body.appendChild(
            tooltip
        );

        this.tooltip =
            tooltip;

    }

    private readonly handleViewportChange =
        (): void => {

            if (this.activeTrigger) {

                this.positionTooltip(
                    this.activeTrigger
                );

            }

        };

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-tooltip-style",
            `
                .${this.className} {
                    position: fixed;
                    z-index: 2147483647;
                    left: 0;
                    top: 0;
                    max-width: min(260px, calc(100vw - 32px));
                    padding: 10px 12px;
                    border-radius: 14px;
                    border: 1px solid var(--lumina-tooltip-border, rgba(148, 163, 184, .24));
                    pointer-events: none;

                    color: var(--lumina-tooltip-fg, var(--fg, #e2e8f0));
                    background:
                        var(
                            --lumina-tooltip-bg,
                            linear-gradient(
                                180deg,
                                color-mix(in srgb, var(--card, #0f172a) 94%, transparent),
                                color-mix(in srgb, var(--card-soft, #111827) 94%, transparent)
                            )
                        );

                    box-shadow:
                        var(
                            --lumina-tooltip-shadow,
                            0 16px 44px rgba(0, 0, 0, .22)
                        );

                    font-size: 13px;
                    line-height: 1.45;
                    font-weight: 750;

                    opacity: 0;
                    transform: translate3d(0, 4px, 0) scale(.98);
                    transition:
                        opacity 160ms ease,
                        transform 160ms cubic-bezier(.2, .8, .2, 1);
                    isolation: isolate;
                    overflow: hidden;
                }

                .${this.className}.is-visible {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                .${this.className}-glow::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    pointer-events: none;

                    background:
                        radial-gradient(
                            circle at 18% 20%,
                            var(--lumina-tooltip-glow, rgba(167, 139, 250, .28)),
                            transparent 34%
                        ),
                        radial-gradient(
                            circle at 88% 80%,
                            var(--lumina-tooltip-glow-secondary, rgba(34, 211, 238, .18)),
                            transparent 34%
                        );

                    opacity: .95;
                }

                .${this.className}-glow::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    pointer-events: none;
                    opacity: .12;

                    background-image:
                        linear-gradient(
                            rgba(148, 163, 184, .32) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(148, 163, 184, .32) 1px,
                            transparent 1px
                        );

                    background-size: 22px 22px;
                }

                @media (prefers-reduced-motion: reduce) {
                    .${this.className} {
                        transition: none;
                        transform: none;
                    }
                }
            `
        );

    }

}