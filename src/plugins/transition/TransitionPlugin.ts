import { BasePlugin } from "../../core";

export type TransitionEffect =
    | "flash"
    | "fade"
    | "zoom"
    | "glow";

export interface TransitionPluginOptions {

    selector?: string;

    className?: string;

    effect?: TransitionEffect;

    duration?: number;

    enterDuration?: number;

    navigateDelay?: number;

    disabledClassName?: string;

    enterOnLoad?: boolean;

    storageKey?: string;

}

export interface TransitionNavigateOptions {

    effect?: TransitionEffect;

    duration?: number;

    enterDuration?: number;

    navigateDelay?: number;

    trigger?: HTMLElement | null;

}

interface TransitionListener {

    element: HTMLElement;

    type: keyof HTMLElementEventMap;

    listener: EventListener;

}

interface StoredTransitionState {

    effect: TransitionEffect;

    duration: number;

    enterDuration: number;

}

export class TransitionPlugin extends BasePlugin {

    readonly metadata = {
        name: "transition",
        version: "1.0.0",
        description: "Executa transições visuais antes de navegar entre páginas."
    };

    private readonly selector: string;

    private readonly className: string;

    private readonly effect: TransitionEffect;

    private readonly duration: number;

    private readonly enterDuration: number;

    private readonly navigateDelay: number;

    private readonly disabledClassName: string;

    private readonly enterOnLoad: boolean;

    private readonly storageKey: string;

    private overlay: HTMLElement | null =
        null;

    private isTransitioning =
        false;

    private readonly listeners: TransitionListener[] =
        [];

    constructor(options: TransitionPluginOptions = {}) {

        super();

        this.selector =
            options.selector ??
            "[data-lumina-transition]";

        this.className =
            options.className ??
            "lumina-transition";

        this.effect =
            options.effect ??
            "glow";

        this.duration =
            options.duration ??
            520;

        this.enterDuration =
            options.enterDuration ??
            260;

        this.navigateDelay =
            options.navigateDelay ??
            360;

        this.disabledClassName =
            options.disabledClassName ??
            "is-transitioning";

        this.enterOnLoad =
            options.enterOnLoad ??
            true;

        this.storageKey =
            options.storageKey ??
            "lumina-transition-state";

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.createOverlay();

        if (this.enterOnLoad) {

            this.playEnterTransition();

        }

        this.bindTriggers();

        this.logger.info(
            "[Lumina Transition] Initialized."
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

        this.overlay?.remove();

        this.overlay =
            null;

        this.isTransitioning =
            false;

        this.dom.removeClass(
            document.body,
            this.disabledClassName
        );

        this.dom.removeClass(
            document.body,
            `${this.className}-body-active`
        );

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

    async navigate(
        url: string,
        options: TransitionNavigateOptions = {}
    ): Promise<void> {

        if (this.isTransitioning) {
            return;
        }

        if (!url) {
            return;
        }

        const effect =
            options.effect ??
            this.effect;

        const duration =
            options.duration ??
            this.duration;

        const enterDuration =
            options.enterDuration ??
            this.enterDuration;

        const navigateDelay =
            options.navigateDelay ??
            this.navigateDelay;

        this.isTransitioning =
            true;

        this.emit(
            "transition:start",
            {
                url,
                trigger: options.trigger ?? null
            }
        );

        this.storeTransitionState(
            effect,
            duration,
            enterDuration
        );

        this.play(
            effect,
            duration
        );

        await this.wait(
            navigateDelay
        );

        this.emit(
            "transition:end",
            {
                url,
                trigger: options.trigger ?? null
            }
        );

        window.location.href =
            url;

    }

    private bindTriggers(): void {

        const triggers =
            this.dom.findAll<HTMLElement>(
                this.selector
            );

        for (const trigger of triggers) {

            const listener =
                (event: Event): void => {

                    this.handleTriggerClick(
                        event,
                        trigger
                    );

                };

            trigger.addEventListener(
                "click",
                listener
            );

            this.listeners.push({
                element: trigger,
                type: "click",
                listener
            });

        }

    }

    private handleTriggerClick(
        event: Event,
        trigger: HTMLElement
    ): void {

        if (this.shouldIgnoreClick(event, trigger)) {
            return;
        }

        const url =
            this.resolveUrl(trigger);

        if (!url) {
            return;
        }

        event.preventDefault();

        void this.navigate(
            url,
            {
                trigger,
                effect: this.resolveEffect(trigger),
                duration: this.resolveDuration(trigger),
                enterDuration: this.resolveEnterDuration(trigger),
                navigateDelay: this.resolveNavigateDelay(trigger)
            }
        );

    }

    private shouldIgnoreClick(
        event: Event,
        trigger: HTMLElement
    ): boolean {

        if (!(event instanceof MouseEvent)) {
            return false;
        }

        if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
        ) {
            return true;
        }

        if (
            trigger instanceof HTMLAnchorElement &&
            trigger.target &&
            trigger.target !== "_self"
        ) {
            return true;
        }

        if (
            this.dom.hasClass(
                trigger,
                this.disabledClassName
            )
        ) {
            return true;
        }

        return false;

    }

    private resolveUrl(
        trigger: HTMLElement
    ): string | null {

        const explicitUrl =
            trigger.dataset.luminaTransitionUrl;

        if (explicitUrl) {
            return explicitUrl;
        }

        if (trigger instanceof HTMLAnchorElement) {
            return trigger.href;
        }

        return null;

    }

    private resolveEffect(
        trigger: HTMLElement
    ): TransitionEffect {

        const effect =
            trigger.dataset.luminaTransitionEffect;

        if (this.isEffect(effect)) {
            return effect;
        }

        return this.effect;

    }

    private resolveDuration(
        trigger: HTMLElement
    ): number {

        const value =
            trigger.dataset.luminaTransitionDuration;

        if (!value) {
            return this.duration;
        }

        const parsed =
            Number(value);

        if (Number.isNaN(parsed)) {
            return this.duration;
        }

        return parsed;

    }

    private resolveEnterDuration(
        trigger: HTMLElement
    ): number {

        const value =
            trigger.dataset.luminaTransitionEnterDuration;

        if (!value) {
            return this.enterDuration;
        }

        const parsed =
            Number(value);

        if (Number.isNaN(parsed)) {
            return this.enterDuration;
        }

        return parsed;

    }

    private resolveNavigateDelay(
        trigger: HTMLElement
    ): number {

        const value =
            trigger.dataset.luminaTransitionDelay;

        if (!value) {
            return this.navigateDelay;
        }

        const parsed =
            Number(value);

        if (Number.isNaN(parsed)) {
            return this.navigateDelay;
        }

        return parsed;

    }

    private isEffect(
        value: string | undefined
    ): value is TransitionEffect {

        return (
            value === "flash" ||
            value === "fade" ||
            value === "zoom" ||
            value === "glow"
        );

    }

    private createOverlay(): void {

        const overlay =
            document.createElement("div");

        this.dom.addClass(
            overlay,
            this.className
        );

        document.body.appendChild(
            overlay
        );

        this.overlay =
            overlay;

    }

    private storeTransitionState(
        effect: TransitionEffect,
        duration: number,
        enterDuration: number
    ): void {

        try {

            sessionStorage.setItem(
                this.storageKey,
                JSON.stringify({
                    effect,
                    duration,
                    enterDuration
                })
            );

        } catch {

            // sessionStorage pode falhar em alguns contextos privados.
            // A transição de saída ainda funciona normalmente.

        }

    }

    private consumeTransitionState(): StoredTransitionState | null {

        try {

            const raw =
                sessionStorage.getItem(
                    this.storageKey
                );

            if (!raw) {
                return null;
            }

            sessionStorage.removeItem(
                this.storageKey
            );

            const parsed =
                JSON.parse(raw) as {
                    effect?: string;
                    duration?: number;
                    enterDuration?: number;
                };

            if (!this.isEffect(parsed.effect)) {
                return null;
            }

            return {
                effect: parsed.effect,
                duration:
                    typeof parsed.duration === "number"
                        ? parsed.duration
                        : this.duration,
                enterDuration:
                    typeof parsed.enterDuration === "number"
                        ? parsed.enterDuration
                        : this.enterDuration
            };

        } catch {

            return null;

        }

    }

    private playEnterTransition(): void {

        if (!this.overlay) {
            return;
        }

        const state =
            this.consumeTransitionState();

        if (!state) {
            return;
        }

        this.dom.style(
            this.overlay,
            "--lumina-transition-duration",
            `${state.enterDuration}ms`
        );

        this.overlay.dataset.effect =
            state.effect;

        this.dom.addClass(
            this.overlay,
            "is-active"
        );

        this.dom.addClass(
            this.overlay,
            "is-entering"
        );

        this.overlay.getBoundingClientRect();

        requestAnimationFrame(
            () => {

                if (!this.overlay) {
                    return;
                }

                this.dom.removeClass(
                    this.overlay,
                    "is-active"
                );

                window.setTimeout(
                    () => {

                        if (!this.overlay) {
                            return;
                        }

                        this.dom.removeClass(
                            this.overlay,
                            "is-entering"
                        );

                    },
                    state.enterDuration
                );

            }
        );

    }

    private play(
        effect: TransitionEffect,
        duration: number
    ): void {

        if (!this.overlay) {
            return;
        }

        this.dom.style(
            this.overlay,
            "--lumina-transition-duration",
            `${duration}ms`
        );

        this.overlay.dataset.effect =
            effect;

        this.dom.addClass(
            document.body,
            this.disabledClassName
        );

        this.dom.addClass(
            this.overlay,
            "is-active"
        );

        this.dom.addClass(
            document.body,
            `${this.className}-body-active`
        );

    }

    private wait(
        duration: number
    ): Promise<void> {

        return new Promise(
            resolve => {

                window.setTimeout(
                    resolve,
                    duration
                );

            }
        );

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-transition-style",
            `
                .${this.className} {
                    position: fixed;
                    inset: 0;
                    z-index: 2147483647;
                    pointer-events: none;
                    opacity: 0;
                    background:
                        var(
                            --lumina-transition-bg,
                            var(--bg, #020617)
                        );
                    transition:
                        opacity var(--lumina-transition-duration, 520ms) cubic-bezier(.16, 1, .3, 1);
                    overflow: hidden;
                    isolation: isolate;
                }

                .${this.className}::before,
                .${this.className}::after {
                    content: "";
                    position: absolute;
                    inset: -20%;
                    pointer-events: none;
                    opacity: 0;
                    transition:
                        opacity var(--lumina-transition-duration, 520ms) cubic-bezier(.16, 1, .3, 1),
                        transform var(--lumina-transition-duration, 520ms) cubic-bezier(.16, 1, .3, 1);
                }

                .${this.className}::before {
                    background:
                        radial-gradient(
                            circle at 25% 30%,
                            var(--lumina-transition-glow, rgba(167, 139, 250, .36)),
                            transparent 28rem
                        ),
                        radial-gradient(
                            circle at 78% 70%,
                            var(--lumina-transition-glow-secondary, rgba(34, 211, 238, .28)),
                            transparent 30rem
                        );
                    transform: scale(.92);
                }

                .${this.className}::after {
                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            var(--lumina-transition-sheen, rgba(255, 255, 255, .22)) 42%,
                            var(--lumina-transition-sheen, rgba(255, 255, 255, .22)) 50%,
                            var(--lumina-transition-sheen, rgba(255, 255, 255, .22)) 58%,
                            transparent
                        );
                    transform: translateX(-100%);
                }

                .${this.className}.is-active {
                    opacity: 1;
                }

                .${this.className}.is-entering {
                    opacity: 1;
                }

                .${this.className}.is-active::before {
                    opacity: 1;
                    transform: scale(1);
                }

                .${this.className}.is-entering::before {
                    opacity: 1;
                    transform: scale(1);
                }

                .${this.className}[data-effect="glow"].is-active::after,
                .${this.className}[data-effect="flash"].is-active::after {
                    opacity: .85;
                    animation:
                        lumina-transition-sheen
                        var(--lumina-transition-duration, 520ms)
                        ease
                        both;
                }

                .${this.className}[data-effect="fade"] {
                    background:
                        var(--lumina-transition-bg, #020617);
                }

                .${this.className}[data-effect="zoom"]::before {
                    opacity: .85;
                    transform: scale(.85);
                }

                .${this.className}[data-effect="zoom"].is-active::before {
                    transform: scale(1.08);
                }

                .${this.className}-body-active > :not(.${this.className}) {
                    transition:
                        filter var(--lumina-transition-duration, 520ms) ease,
                        transform var(--lumina-transition-duration, 520ms) cubic-bezier(.16, 1, .3, 1),
                        opacity var(--lumina-transition-duration, 520ms) ease;
                    filter:
                        var(
                            --lumina-transition-page-filter,
                            brightness(1.04) contrast(1.04) saturate(1.08)
                        );
                    transform: scale(1.01);
                }

                @keyframes lumina-transition-sheen {
                    from {
                        transform: translateX(-100%);
                    }

                    to {
                        transform: translateX(100%);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .${this.className},
                    .${this.className}::before,
                    .${this.className}::after,
                    .${this.className}-body-active {
                        transition: none;
                        animation: none;
                        transform: none;
                        filter: none;
                    }
                }
            `
        );

    }

}