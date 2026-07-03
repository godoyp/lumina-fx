// src/theme/ThemePlugin.ts

import { BasePlugin } from "../../core";
import type { LuminaTheme } from "../../core";

export type ThemePreference =
    | LuminaTheme
    | "system";

export type ThemeTransition =
    | "none"
    | "view";

export interface ThemePluginOptions {

    defaultTheme?: ThemePreference;

    storageKey?: string;

    attributeName?: string;

    darkClassName?: string;

    transition?: ThemeTransition;

    toggleSelector?: string;

}

export class ThemePlugin extends BasePlugin {

    readonly metadata = {
        name: "theme",
        version: "1.0.0",
        description: "Gerencia tema claro, escuro e preferência do sistema."
    };

    private readonly defaultTheme: ThemePreference;

    private readonly storageKey: string;

    private readonly attributeName: string;

    private readonly darkClassName: string;

    private readonly transition: ThemeTransition;

    private readonly toggleSelector?: string;

    private readonly unsubscribeToggleListeners: Array<() => void> = [];

    private currentTheme: LuminaTheme | null = null;

    private currentPreference: ThemePreference | null = null;

    private unsubscribeSystemTheme?: () => void;

    constructor(options: ThemePluginOptions = {}) {

        super();

        this.defaultTheme =
            options.defaultTheme ?? "system";

        this.storageKey =
            options.storageKey ?? "lumina:theme";

        this.attributeName =
            options.attributeName ?? "theme";

        this.darkClassName =
            options.darkClassName ?? "dark";

        this.transition =
            options.transition ?? "none";

        this.toggleSelector =
            options.toggleSelector;

    }

    protected onInitialize(): void {

        const preference =
            this.loadPreference();

        this.currentPreference =
            preference;

        const theme =
            this.resolveTheme(preference);

        this.applyTheme(theme);

        this.setupSystemThemeListener();

        this.setupToggleListeners();

        this.logger.info(
            `[Lumina Theme] Initialized with "${theme}" theme.`
        );

    }

    protected onDestroy(): void {

        this.unsubscribeSystemTheme?.();

        this.unsubscribeSystemTheme =
            undefined;

        for (const unsubscribe of this.unsubscribeToggleListeners) {

            unsubscribe();

        }

        this.unsubscribeToggleListeners.length =
            0;

        this.clearTransitionState();

    }

    private setupToggleListeners(): void {

        if (!this.toggleSelector) {
            return;
        }

        const elements =
            this.dom.findAll<HTMLElement>(
                this.toggleSelector
            );

        for (const element of elements) {

            const unsubscribe =
                this.dom.listen(
                    element,
                    "click",
                    event => {

                        this.toggle(
                            event instanceof MouseEvent
                                ? event
                                : undefined
                        );

                    }
                );

            this.unsubscribeToggleListeners.push(
                unsubscribe
            );

        }

        this.logger.debug(
            `[Lumina Theme] Bound ${elements.length} toggle element(s).`
        );

    }

    setTheme(
        preference: ThemePreference,
        event?: MouseEvent
    ): void {

        this.currentPreference =
            preference;

        this.storage.set(
            this.storageKey,
            preference
        );

        const theme =
            this.resolveTheme(preference);

        this.runThemeChange(
            () => this.applyTheme(theme),
            event,
            theme
        );

    }

    getTheme(): LuminaTheme | null {

        return this.currentTheme;

    }

    getPreference(): ThemePreference | null {

        return this.currentPreference;

    }

    toggle(event?: MouseEvent): void {

        const nextTheme =
            this.currentTheme === "dark"
                ? "light"
                : "dark";

        this.setTheme(
            nextTheme,
            event
        );

    }

    private loadPreference(): ThemePreference {

        const saved =
            this.storage.get<ThemePreference>(
                this.storageKey
            );

        return saved ?? this.defaultTheme;

    }

    private resolveTheme(
        preference: ThemePreference
    ): LuminaTheme {

        if (preference !== "system") {
            return preference;
        }

        return this.dom.prefersDarkColorScheme()
            ? "dark"
            : "light";

    }

    private setupSystemThemeListener(): void {

        this.unsubscribeSystemTheme?.();

        this.unsubscribeSystemTheme =
            this.dom.onSystemColorSchemeChange(
                () => {

                    if (this.currentPreference !== "system") {
                        return;
                    }

                    const theme =
                        this.resolveTheme("system");

                    this.runThemeChange(
                        () => this.applyTheme(theme),
                        undefined,
                        theme
                    );

                }
            );

    }

    private runThemeChange(
        action: () => void,
        event?: MouseEvent,
        nextTheme?: LuminaTheme
    ): void {

        if (this.transition !== "view") {

            action();

            return;

        }

        if (this.prefersReducedMotion()) {

            action();

            return;

        }

        if (
            !this.isFirefox() &&
            "startViewTransition" in document
        ) {

            this.runViewTransition(
                action,
                event
            );

            return;

        }

        this.runFallbackRadialTransition(
            action,
            event,
            nextTheme
        );

    }

    private prefersReducedMotion(): boolean {

        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    }

    private isFirefox(): boolean {

        return navigator.userAgent.includes("Firefox/");

    }

    private getDefaultTransitionPoint(): {
        x: number;
        y: number;
    } {

        const viewport =
            this.dom.viewport();

        return {
            x: viewport.width,
            y: viewport.height
        };

    }

    private clearTransitionState(): void {

        this.dom.removeCss(
            "--lumina-theme-x"
        );

        this.dom.removeCss(
            "--lumina-theme-y"
        );

        this.dom.removeCss(
            "--lumina-theme-radius"
        );

        this.dom.removeCss(
            "--lumina-theme-feather"
        );

        this.dom.removeCss(
            "--lumina-theme-fallback-radius"
        );

    }

    private calculateTransitionRadius(
        point: {
            x: number;
            y: number;
        }
    ): number {

        const viewport =
            this.dom.viewport();

        return Math.hypot(
            Math.max(
                point.x,
                viewport.width - point.x
            ),
            Math.max(
                point.y,
                viewport.height - point.y
            )
        );

    }

    private resolveTransitionPoint(
        event?: MouseEvent,
        extraRadius = 0
    ): {
        x: number;
        y: number;
        radius: number;
    } {

        const point =
            event
                ? this.dom.pointerFromEvent(event)
                : this.getDefaultTransitionPoint();

        const radius =
            this.calculateTransitionRadius(point) + extraRadius;

        this.dom.css(
            "--lumina-theme-x",
            `${point.x}px`
        );

        this.dom.css(
            "--lumina-theme-y",
            `${point.y}px`
        );

        this.dom.css(
            "--lumina-theme-radius",
            `${radius}px`
        );

        return {
            x: point.x,
            y: point.y,
            radius
        };

    }

    private runViewTransition(
        action: () => void,
        event?: MouseEvent
    ): void {

        this.injectViewTransitionStyle();

        this.resolveTransitionPoint(event);

        const root =
            this.dom.root();

        const transitionClass =
            "lumina-theme-transitioning";

        this.dom.css(
            "--lumina-theme-feather",
            "140px"
        );

        this.dom.addClass(
            root,
            transitionClass
        );

        const transition =
            this.dom.startViewTransition(() => {

                action();

            });

        if (!transition) {

            action();

            this.dom.removeClass(
                root,
                transitionClass
            );

            this.clearTransitionState();

            return;

        }

        transition.finished.finally(() => {

            this.dom.removeClass(
                root,
                transitionClass
            );

            this.clearTransitionState();

        });

    }

    private runFallbackRadialTransition(
        action: () => void,
        event?: MouseEvent,
        nextTheme?: LuminaTheme
    ): void {

        this.injectFallbackTransitionStyle();

        const transition =
            this.resolveTransitionPoint(
                event,
                48
            );

        const overlay =
            this.createFallbackOverlay(
                transition.x,
                transition.y,
                nextTheme
            );

        document.body.appendChild(
            overlay
        );

        this.animateFallbackOverlay(
            overlay,
            transition.radius,
            action
        );

    }

    private createFallbackOverlay(
        x: number,
        y: number,
        nextTheme?: LuminaTheme
    ): HTMLElement {

        const overlay =
            document.createElement("div");

        overlay.className =
            "lumina-theme-fallback-overlay";

        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

        overlay.style.setProperty(
            "--lumina-theme-x",
            `${x}px`
        );

        overlay.style.setProperty(
            "--lumina-theme-y",
            `${y}px`
        );

        overlay.style.setProperty(
            "--lumina-theme-fallback-scroll-y",
            `${window.scrollY}px`
        );

        if (nextTheme) {

            overlay.setAttribute(
                `data-${this.attributeName}`,
                nextTheme
            );

            if (nextTheme === "dark") {

                overlay.classList.add(
                    this.darkClassName
                );

            } else {

                overlay.classList.remove(
                    this.darkClassName
                );

            }

            this.copyThemeCssVariables(
                overlay,
                nextTheme
            );

        } else {

            this.copyCurrentCssVariables(
                overlay
            );

        }

        this.cloneBodyContent(
            overlay
        );

        return overlay;

    }

    private copyThemeCssVariables(
        target: HTMLElement,
        theme: LuminaTheme
    ): void {

        const root =
            this.dom.root();

        const previousTheme =
            root.getAttribute(
                `data-${this.attributeName}`
            );

        const hadDarkClass =
            root.classList.contains(
                this.darkClassName
            );

        this.dom.data(
            root,
            this.attributeName,
            theme
        );

        root.classList.toggle(
            this.darkClassName,
            theme === "dark"
        );

        this.copyCurrentCssVariables(
            target
        );

        if (previousTheme) {

            this.dom.data(
                root,
                this.attributeName,
                previousTheme
            );

        } else {

            root.removeAttribute(
                `data-${this.attributeName}`
            );

        }

        root.classList.toggle(
            this.darkClassName,
            hadDarkClass
        );

    }

    private copyCurrentCssVariables(
        target: HTMLElement
    ): void {

        const rootStyles =
            getComputedStyle(
                document.documentElement
            );

        for (let index = 0; index < rootStyles.length; index += 1) {

            const property =
                rootStyles.item(index);

            if (!property.startsWith("--")) {
                continue;
            }

            target.style.setProperty(
                property,
                rootStyles.getPropertyValue(property)
            );

        }

    }

    private cloneBodyContent(
        overlay: HTMLElement
    ): void {

        const content =
            document.createElement("div");

        content.className =
            "lumina-theme-fallback-content";

        const children =
            [...document.body.children];

        for (const child of children) {

            if (!(child instanceof HTMLElement)) {
                continue;
            }

            if (
                child.classList.contains(
                    "lumina-theme-fallback-overlay"
                )
            ) {
                continue;
            }

            if (
                child.tagName === "SCRIPT" ||
                child.tagName === "STYLE"
            ) {
                continue;
            }

            const clone =
                child.cloneNode(true) as HTMLElement;

            this.sanitizeSnapshotClone(
                clone
            );

            content.appendChild(
                clone
            );

        }

        overlay.appendChild(
            content
        );

    }

    private sanitizeSnapshotClone(
        element: HTMLElement
    ): void {

        element.removeAttribute(
            "id"
        );

        element.removeAttribute(
            "data-lumina-spotlight"
        );

        element.removeAttribute(
            "data-lumina-shimmer-layer"
        );

        element.removeAttribute(
            "data-lumina-constellation"
        );

        element.removeAttribute(
            "data-lumina-storm"
        );

        element.classList.remove(
            "lumina-spotlight"
        );

        element.classList.remove(
            "lumina-shimmer-active"
        );

        element.classList.remove(
            "lumina-theme-transitioning"
        );

        const descendants =
            element.querySelectorAll<HTMLElement>(
                "*"
            );

        for (const descendant of descendants) {

            descendant.removeAttribute(
                "id"
            );

            descendant.removeAttribute(
                "data-lumina-spotlight"
            );

            descendant.removeAttribute(
                "data-lumina-shimmer-layer"
            );

            descendant.removeAttribute(
                "data-lumina-constellation"
            );

            descendant.removeAttribute(
                "data-lumina-storm"
            );

            descendant.classList.remove(
                "lumina-spotlight"
            );

            descendant.classList.remove(
                "lumina-shimmer-active"
            );

            descendant.classList.remove(
                "lumina-theme-transitioning"
            );

        }

        const dynamicElements =
            element.querySelectorAll<HTMLElement>(
                [
                    "canvas",
                    ".ambient-background",
                    ".refresh-overlay",
                    "[data-lumina-background]",
                    "[data-lumina-shimmer-layer]",
                    "[data-lumina-constellation]",
                    "[data-lumina-storm]"
                ].join(",")
            );

        for (const dynamicElement of dynamicElements) {

            dynamicElement.remove();

        }

    }

    private animateFallbackOverlay(
        overlay: HTMLElement,
        radius: number,
        action: () => void
    ): void {

        const duration =
            900;

        const startTime =
            performance.now();

        const animate =
            (time: number): void => {

                const elapsed =
                    time - startTime;

                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );

                const easedProgress =
                    this.easeInOut(progress);

                const currentRadius =
                    radius * easedProgress;

                overlay.style.setProperty(
                    "--lumina-theme-fallback-radius",
                    `${currentRadius}px`
                );

                if (progress < 1) {

                    requestAnimationFrame(
                        animate
                    );

                    return;

                }

                action();

                requestAnimationFrame(
                    () => {

                        overlay.remove();

                        this.clearTransitionState();

                    }
                );

            };

        requestAnimationFrame(
            animate
        );

    }

    private easeInOut(
        progress: number
    ): number {

        if (progress < 0.5) {

            return 2 * progress * progress;

        }

        return 1 - Math.pow(
            -2 * progress + 2,
            2
        ) / 2;

    }

    private injectViewTransitionStyle(): void {

        this.dom.injectStyle(
            "lumina-theme-change-style",
            `
                @property --lumina-theme-reveal {
                    syntax: "<length>";
                    inherits: true;
                    initial-value: 0px;
                }

                ::view-transition-old(root),
                ::view-transition-new(root) {
                    animation: none;
                    mix-blend-mode: normal;
                }

                ::view-transition-old(root) {
                    z-index: 1;
                }

                ::view-transition-new(root) {
                    z-index: 2;
                }

                :root,
                body,
                .card,
                .hero-card,
                .nav,
                .dropdown-menu,
                .plugin-item,
                .status-card,
                .switch-demo-panel {
                    transition:
                        background-color 220ms ease,
                        color 220ms ease,
                        border-color 220ms ease,
                        box-shadow 220ms ease;
                }

                .lumina-theme-transitioning::view-transition-new(root) {
                    --lumina-theme-reveal: 0px;

                    -webkit-mask-image:
                        radial-gradient(
                            circle at
                            var(--lumina-theme-x)
                            var(--lumina-theme-y),
                            black 0,
                            black max(
                                0px,
                                calc(
                                    var(--lumina-theme-reveal)
                                    - var(--lumina-theme-feather)
                                )
                            ),
                            transparent var(--lumina-theme-reveal)
                        );

                    mask-image:
                        radial-gradient(
                            circle at
                            var(--lumina-theme-x)
                            var(--lumina-theme-y),
                            black 0,
                            black max(
                                0px,
                                calc(
                                    var(--lumina-theme-reveal)
                                    - var(--lumina-theme-feather)
                                )
                            ),
                            transparent var(--lumina-theme-reveal)
                        );

                    -webkit-mask-repeat: no-repeat;
                    mask-repeat: no-repeat;

                    -webkit-mask-size: 100% 100%;
                    mask-size: 100% 100%;

                    animation:
                        lumina-theme-reveal
                        900ms
                        ease-in-out
                        forwards;
                }

                @keyframes lumina-theme-reveal {
                    from {
                        --lumina-theme-reveal: 0px;
                    }

                    to {
                        --lumina-theme-reveal:
                            var(--lumina-theme-radius);
                    }
                }
            `
        );

    }

    private injectFallbackTransitionStyle(): void {

        this.dom.injectStyle(
            "lumina-theme-fallback-transition-style",
            `
                .lumina-theme-fallback-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 2147483647;
                    pointer-events: none;
                    overflow: hidden;

                    --lumina-theme-fallback-radius: 0px;

                    color: var(--fg);
                    background: var(--bg);

                    clip-path:
                        circle(
                            var(--lumina-theme-fallback-radius)
                            at
                            var(--lumina-theme-x, 50vw)
                            var(--lumina-theme-y, 50vh)
                        );

                    will-change:
                        clip-path;
                }

                .lumina-theme-fallback-content {
                    transform:
                        translate3d(
                            0,
                            calc(
                                var(--lumina-theme-fallback-scroll-y, 0px)
                                * -1
                            ),
                            0
                        );
                }

                .lumina-theme-fallback-overlay,
                .lumina-theme-fallback-overlay * {
                    pointer-events: none !important;
                    animation: none !important;
                    transition: none !important;
                    caret-color: transparent !important;
                }

                .lumina-theme-fallback-overlay canvas,
                .lumina-theme-fallback-overlay .ambient-background,
                .lumina-theme-fallback-overlay .refresh-overlay,
                .lumina-theme-fallback-overlay [data-lumina-background],
                .lumina-theme-fallback-overlay [data-lumina-shimmer-layer],
                .lumina-theme-fallback-overlay [data-lumina-constellation],
                .lumina-theme-fallback-overlay [data-lumina-storm] {
                    display: none !important;
                }

                .lumina-theme-fallback-overlay .lumina-spotlight::before,
                .lumina-theme-fallback-overlay .hero-card.lumina-spotlight::before,
                .lumina-theme-fallback-overlay .card.lumina-spotlight::before,
                .lumina-theme-fallback-overlay .terminal.lumina-spotlight::before {
                    display: none !important;
                    opacity: 0 !important;
                }
            `
        );

    }

    private applyTheme(
        theme: LuminaTheme
    ): void {

        if (this.currentTheme === theme) {
            return;
        }

        const previousTheme =
            this.currentTheme;

        this.currentTheme =
            theme;

        const root =
            this.dom.root();

        this.dom.data(
            root,
            this.attributeName,
            theme
        );

        if (theme === "dark") {

            this.dom.addClass(
                root,
                this.darkClassName
            );

        } else {

            this.dom.removeClass(
                root,
                this.darkClassName
            );

        }

        this.emit(
            "theme:changed",
            {
                theme,
                previousTheme
            }
        );

    }

}