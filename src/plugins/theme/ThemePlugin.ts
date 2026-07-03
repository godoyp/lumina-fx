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

                        this.toggle(event);

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
            event
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
                        () => this.applyTheme(theme)
                    );

                }
            );

    }

    private runThemeChange(
        action: () => void,
        event?: MouseEvent
    ): void {

        if (this.transition === "view") {

            this.runViewTransition(
                action,
                event
            );

            return;

        }

        action();

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


    private runViewTransition(
        action: () => void,
        event?: MouseEvent
    ): void {

        this.injectViewTransitionStyle();

        const point =
            event
                ? this.dom.pointerFromEvent(event)
                : this.getDefaultTransitionPoint();

        const radius =
            this.calculateTransitionRadius(point);

        const root =
            this.dom.root();

        const transitionClass =
            "lumina-theme-transitioning";

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