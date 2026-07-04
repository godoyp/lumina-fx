import { BasePlugin } from "../../core";

export type AccessibilityColorFilter =
    | "none"
    | "protanopia"
    | "deuteranopia"
    | "tritanopia"
    | "achromatopsia";

export type AccessibilityAction =
    | "toggle-filter-protanopia"
    | "toggle-filter-deuteranopia"
    | "toggle-filter-tritanopia"
    | "toggle-filter-achromatopsia"
    | "clear-color-filter"
    | "toggle-reduced-motion"
    | "toggle-inverted-colors"
    | "toggle-high-contrast"
    | "toggle-focus-highlight"
    | "toggle-large-font"
    | "toggle-dyslexia-mode";

export interface AccessibilityState {

    colorFilter: AccessibilityColorFilter;

    reducedMotion: boolean;

    invertedColors: boolean;

    highContrast: boolean;

    focusHighlight: boolean;

    largeFont: boolean;

    dyslexiaMode: boolean;

}

export interface AccessibilityPluginOptions {

    selector?: string;

    activeClassName?: string;

    persist?: boolean;

    storageKey?: string;

    target?: HTMLElement;

}

interface AccessibilityListener {

    element: HTMLElement;

    type: keyof HTMLElementEventMap;

    listener: EventListener;

}

const defaultState: AccessibilityState = {
    colorFilter: "none",
    reducedMotion: false,
    invertedColors: false,
    highContrast: false,
    focusHighlight: false,
    largeFont: false,
    dyslexiaMode: false
};

export class AccessibilityPlugin extends BasePlugin {

    readonly metadata = {
        name: "accessibility",
        version: "1.0.0",
        description: "Provides reusable visual accessibility and reading controls."
    };

    private readonly selector: string;

    private readonly activeClassName: string;

    private readonly persist: boolean;

    private readonly storageKey: string;

    private readonly target: HTMLElement;

    private isFirefox(): boolean {

        return navigator.userAgent.includes("Firefox/");

    }

    private state: AccessibilityState = {
        ...defaultState
    };

    private readonly listeners: AccessibilityListener[] =
        [];

    constructor(options: AccessibilityPluginOptions = {}) {

        super();

        this.selector =
            options.selector ??
            "[data-lumina-accessibility-action]";

        this.activeClassName =
            options.activeClassName ??
            "is-accessibility-active";

        this.persist =
            options.persist ??
            true;

        this.storageKey =
            options.storageKey ??
            "lumina-accessibility-state";

        this.target =
            options.target ??
            document.documentElement;

    }

    protected onInitialize(): void {

        this.injectSvgFilters();

        this.injectStyles();

        this.state =
            this.persist
                ? this.loadState()
                : {
                    ...defaultState
                };

        this.applyState();

        this.bindActions();

        this.syncActionStates();

        this.logger.info(
            "[Lumina Accessibility] Initialized."
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

        this.clearAttributes();

        document
            .getElementById("lumina-accessibility-svg-filters")
            ?.remove();

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

        this.bindActions();

        this.syncActionStates();

    }

    getState(): AccessibilityState {

        return {
            ...this.state
        };

    }

    setColorFilter(
        filter: AccessibilityColorFilter
    ): void {

        this.state.colorFilter =
            filter;

        this.commit();

    }

    toggleColorFilter(
        filter: Exclude<AccessibilityColorFilter, "none">
    ): void {

        this.state.colorFilter =
            this.state.colorFilter === filter
                ? "none"
                : filter;

        this.commit();

    }

    clearColorFilter(): void {

        this.state.colorFilter =
            "none";

        this.commit();

    }

    toggleReducedMotion(): void {

        this.state.reducedMotion =
            !this.state.reducedMotion;

        this.commit();

    }

    toggleInvertedColors(): void {

        this.state.invertedColors =
            !this.state.invertedColors;

        this.commit();

    }

    toggleHighContrast(): void {

        this.state.highContrast =
            !this.state.highContrast;

        this.commit();

    }

    toggleFocusHighlight(): void {

        this.state.focusHighlight =
            !this.state.focusHighlight;

        this.commit();

    }

    toggleLargeFont(): void {

        this.state.largeFont =
            !this.state.largeFont;

        this.commit();

    }

    toggleDyslexiaMode(): void {

        this.state.dyslexiaMode =
            !this.state.dyslexiaMode;

        this.commit();

    }

    private bindActions(): void {

        const triggers =
            this.dom.findAll<HTMLElement>(
                this.selector
            );

        for (const trigger of triggers) {

            const listener =
                (event: Event): void => {

                    this.handleAction(
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

    private handleAction(
        event: Event,
        trigger: HTMLElement
    ): void {

        const action =
            trigger.dataset.luminaAccessibilityAction;

        if (!this.isAction(action)) {
            return;
        }

        event.preventDefault();

        this.runAction(action);

    }

    private runAction(
        action: AccessibilityAction
    ): void {

        if (action === "toggle-filter-protanopia") {
            this.toggleColorFilter("protanopia");
            return;
        }

        if (action === "toggle-filter-deuteranopia") {
            this.toggleColorFilter("deuteranopia");
            return;
        }

        if (action === "toggle-filter-tritanopia") {
            this.toggleColorFilter("tritanopia");
            return;
        }

        if (action === "toggle-filter-achromatopsia") {
            this.toggleColorFilter("achromatopsia");
            return;
        }

        if (action === "clear-color-filter") {
            this.clearColorFilter();
            return;
        }

        if (action === "toggle-reduced-motion") {
            this.toggleReducedMotion();
            return;
        }

        if (action === "toggle-inverted-colors") {
            this.toggleInvertedColors();
            return;
        }

        if (action === "toggle-high-contrast") {
            this.toggleHighContrast();
            return;
        }

        if (action === "toggle-focus-highlight") {
            this.toggleFocusHighlight();
            return;
        }

        if (action === "toggle-large-font") {
            this.toggleLargeFont();
            return;
        }

        if (action === "toggle-dyslexia-mode") {
            this.toggleDyslexiaMode();
        }

    }

    private commit(): void {

        this.applyState();

        if (this.persist) {

            this.saveState();

        }

        this.syncActionStates();

    }

    private applyState(): void {

        this.target.dataset.luminaColorFilter =
            this.state.colorFilter;

        this.target.dataset.luminaReducedMotion =
            String(this.state.reducedMotion);

        this.target.dataset.luminaInvertedColors =
            String(this.state.invertedColors);

        this.target.dataset.luminaHighContrast =
            String(this.state.highContrast);

        this.target.dataset.luminaFocusHighlight =
            String(this.state.focusHighlight);

        this.target.dataset.luminaLargeFont =
            String(this.state.largeFont);

        this.target.dataset.luminaDyslexiaMode =
            String(this.state.dyslexiaMode);

        document.body.style.setProperty(
            "--lumina-accessibility-filter",
            this.createFilterValue()
        );

    }
    
    private resolveColorFilter(
        filter: Exclude<AccessibilityColorFilter, "none">
    ): string {

        if (!this.isFirefox()) {

            return `url("#lumina-filter-${filter}")`;

        }

        if (filter === "protanopia") {

            return [
                "sepia(.22)",
                "saturate(.82)",
                "hue-rotate(-12deg)"
            ].join(" ");

        }

        if (filter === "deuteranopia") {

            return [
                "sepia(.18)",
                "saturate(.78)",
                "hue-rotate(8deg)"
            ].join(" ");

        }

        if (filter === "tritanopia") {

            return [
                "sepia(.16)",
                "saturate(.72)",
                "hue-rotate(42deg)"
            ].join(" ");

        }

        return [
            "grayscale(1)",
            "contrast(1.06)"
        ].join(" ");

    }

    private createFilterValue(): string {

        const filters: string[] =
            [];

        if (this.state.colorFilter !== "none") {

            filters.push(
                this.resolveColorFilter(
                    this.state.colorFilter
                )
            );

        }

        if (this.state.invertedColors) {

            filters.push(
                "invert(1)",
                "hue-rotate(180deg)"
            );

        }

        if (this.state.highContrast) {

            filters.push(
                "contrast(1.22)",
                "saturate(1.16)"
            );

        }

        if (filters.length === 0) {
            return "none";
        }

        return filters.join(" ");

    }

    private syncActionStates(): void {

        const triggers =
            this.dom.findAll<HTMLElement>(
                this.selector
            );

        for (const trigger of triggers) {

            const action =
                trigger.dataset.luminaAccessibilityAction;

            if (!this.isAction(action)) {
                continue;
            }

            const active =
                this.isActionActive(action);

            trigger.classList.toggle(
                this.activeClassName,
                active
            );

            trigger.setAttribute(
                "aria-pressed",
                String(active)
            );

        }

    }

    private isActionActive(
        action: AccessibilityAction
    ): boolean {

        if (action === "toggle-filter-protanopia") {
            return this.state.colorFilter === "protanopia";
        }

        if (action === "toggle-filter-deuteranopia") {
            return this.state.colorFilter === "deuteranopia";
        }

        if (action === "toggle-filter-tritanopia") {
            return this.state.colorFilter === "tritanopia";
        }

        if (action === "toggle-filter-achromatopsia") {
            return this.state.colorFilter === "achromatopsia";
        }

        if (action === "clear-color-filter") {
            return this.state.colorFilter === "none";
        }

        if (action === "toggle-reduced-motion") {
            return this.state.reducedMotion;
        }

        if (action === "toggle-inverted-colors") {
            return this.state.invertedColors;
        }

        if (action === "toggle-high-contrast") {
            return this.state.highContrast;
        }

        if (action === "toggle-focus-highlight") {
            return this.state.focusHighlight;
        }

        if (action === "toggle-large-font") {
            return this.state.largeFont;
        }

        if (action === "toggle-dyslexia-mode") {
            return this.state.dyslexiaMode;
        }

        return false;

    }

    private saveState(): void {

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(this.state)
            );

        } catch {

            // localStorage pode falhar em contexto privado.
            // O plugin continua funcionando sem persistência.

        }

    }

    private loadState(): AccessibilityState {

        try {

            const raw =
                localStorage.getItem(
                    this.storageKey
                );

            if (!raw) {
                return {
                    ...defaultState
                };
            }

            const parsed =
                JSON.parse(raw) as Partial<AccessibilityState>;

            return {
                colorFilter:
                    this.isColorFilter(parsed.colorFilter)
                        ? parsed.colorFilter
                        : defaultState.colorFilter,

                reducedMotion:
                    typeof parsed.reducedMotion === "boolean"
                        ? parsed.reducedMotion
                        : defaultState.reducedMotion,

                invertedColors:
                    typeof parsed.invertedColors === "boolean"
                        ? parsed.invertedColors
                        : defaultState.invertedColors,

                highContrast:
                    typeof parsed.highContrast === "boolean"
                        ? parsed.highContrast
                        : defaultState.highContrast,

                focusHighlight:
                    typeof parsed.focusHighlight === "boolean"
                        ? parsed.focusHighlight
                        : defaultState.focusHighlight,

                largeFont:
                    typeof parsed.largeFont === "boolean"
                        ? parsed.largeFont
                        : defaultState.largeFont,

                dyslexiaMode:
                    typeof parsed.dyslexiaMode === "boolean"
                        ? parsed.dyslexiaMode
                        : defaultState.dyslexiaMode
            };

        } catch {

            return {
                ...defaultState
            };

        }

    }

    private clearAttributes(): void {

        delete this.target.dataset.luminaColorFilter;

        delete this.target.dataset.luminaReducedMotion;

        delete this.target.dataset.luminaInvertedColors;

        delete this.target.dataset.luminaHighContrast;

        delete this.target.dataset.luminaFocusHighlight;

        delete this.target.dataset.luminaLargeFont;

        delete this.target.dataset.luminaDyslexiaMode;

        document.body.style.removeProperty(
            "--lumina-accessibility-filter"
        );

    }

    private isAction(
        value: string | undefined
    ): value is AccessibilityAction {

        return (
            value === "toggle-filter-protanopia" ||
            value === "toggle-filter-deuteranopia" ||
            value === "toggle-filter-tritanopia" ||
            value === "toggle-filter-achromatopsia" ||
            value === "clear-color-filter" ||
            value === "toggle-reduced-motion" ||
            value === "toggle-inverted-colors" ||
            value === "toggle-high-contrast" ||
            value === "toggle-focus-highlight" ||
            value === "toggle-large-font" ||
            value === "toggle-dyslexia-mode"
        );

    }

    private isColorFilter(
        value: unknown
    ): value is AccessibilityColorFilter {

        return (
            value === "none" ||
            value === "protanopia" ||
            value === "deuteranopia" ||
            value === "tritanopia" ||
            value === "achromatopsia"
        );

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-accessibility-style",
            `
                body {
                    filter:
                        var(--lumina-accessibility-filter, none);
                }

                :root[data-lumina-large-font="true"] {
                    font-size: 112.5%;
                }

                :root[data-lumina-dyslexia-mode="true"] body {
                    font-family:
                        var(
                            --lumina-dyslexia-font-family,
                            Arial,
                            Verdana,
                            Tahoma,
                            sans-serif
                        );
                    letter-spacing: .035em;
                    word-spacing: .08em;
                    line-height: 1.72;
                }

                :root[data-lumina-reduced-motion="true"] *,
                :root[data-lumina-reduced-motion="true"] *::before,
                :root[data-lumina-reduced-motion="true"] *::after {
                    scroll-behavior: auto !important;
                    animation-duration: .001ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: .001ms !important;
                }

                :root[data-lumina-reduced-motion="true"] .lumina-spotlight::before {
                    display: none !important;
                    opacity: 0 !important;
                }

                :root[data-lumina-reduced-motion="true"] .lumina-spotlight {
                    --lumina-spotlight-opacity: 0 !important;
                }

                :root[data-lumina-focus-highlight="true"] :focus-visible {
                    outline:
                        4px solid
                        color-mix(
                            in srgb,
                            var(--accent, #22d3ee) 74%,
                            #ffffff
                        ) !important;
                    outline-offset: 4px !important;
                    box-shadow:
                        0 0 0 8px
                        color-mix(
                            in srgb,
                            var(--accent, #22d3ee) 28%,
                            transparent
                        ) !important;
                }

                .${this.activeClassName} {
                    border-color:
                        color-mix(
                            in srgb,
                            var(--accent, #22d3ee) 56%,
                            transparent
                        ) !important;
                    color: #ffffff !important;
                    background:
                        linear-gradient(
                            135deg,
                            var(--accent, #7c3aed),
                            var(--accent-2, #06b6d4)
                        ) !important;
                    box-shadow:
                        0 16px 40px
                        color-mix(
                            in srgb,
                            var(--accent, #7c3aed) 24%,
                            transparent
                        ) !important;
                }
            `
        );

    }

    private injectSvgFilters(): void {

        const existing =
            document.getElementById(
                "lumina-accessibility-svg-filters"
            );

        if (existing) {
            return;
        }

        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );

        svg.id =
            "lumina-accessibility-svg-filters";

        svg.setAttribute(
            "aria-hidden",
            "true"
        );

        svg.setAttribute(
            "focusable",
            "false"
        );

        svg.style.position =
            "absolute";

        svg.style.width =
            "0";

        svg.style.height =
            "0";

        svg.style.overflow =
            "hidden";

        svg.innerHTML = `
            <filter id="lumina-filter-protanopia">
                <feColorMatrix
                    type="matrix"
                    values="
                        0.567 0.433 0     0 0
                        0.558 0.442 0     0 0
                        0     0.242 0.758 0 0
                        0     0     0     1 0
                    "
                />
            </filter>

            <filter id="lumina-filter-deuteranopia">
                <feColorMatrix
                    type="matrix"
                    values="
                        0.625 0.375 0   0 0
                        0.700 0.300 0   0 0
                        0     0.300 0.7 0 0
                        0     0     0   1 0
                    "
                />
            </filter>

            <filter id="lumina-filter-tritanopia">
                <feColorMatrix
                    type="matrix"
                    values="
                        0.950 0.050 0     0 0
                        0     0.433 0.567 0 0
                        0     0.475 0.525 0 0
                        0     0     0     1 0
                    "
                />
            </filter>

            <filter id="lumina-filter-achromatopsia">
                <feColorMatrix
                    type="matrix"
                    values="
                        0.299 0.587 0.114 0 0
                        0.299 0.587 0.114 0 0
                        0.299 0.587 0.114 0 0
                        0     0     0     1 0
                    "
                />
            </filter>
        `;

        document.body.prepend(svg);

    }

}