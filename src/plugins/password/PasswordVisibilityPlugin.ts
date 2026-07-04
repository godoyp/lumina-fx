// src/password/PasswordVisibilityPlugin.ts

import { BasePlugin } from "../../core";

interface PasswordToggleInstance {

    input: HTMLInputElement;

    trigger: HTMLElement;

}

export interface PasswordVisibilityPluginOptions {

    toggleSelector?: string;

    activeClassName?: string;

    glowClassName?: string;

    visibleLabel?: string;

    hiddenLabel?: string;

    updateText?: boolean;

    glowDuration?: number;

}

export class PasswordVisibilityPlugin extends BasePlugin {

    readonly metadata = {
        name: "password-visibility",
        version: "1.0.0",
        description: "Alterna a visibilidade de campos de senha."
    };

    private readonly toggleSelector: string;

    private readonly activeClassName: string;

    private readonly glowClassName: string;

    private readonly visibleLabel: string;

    private readonly hiddenLabel: string;

    private readonly updateText: boolean;

    private readonly glowDuration: number;

    private readonly instances: PasswordToggleInstance[] = [];

    private readonly unsubscribeListeners: Array<() => void> = [];

    constructor(options: PasswordVisibilityPluginOptions = {}) {

        super();

        this.toggleSelector =
            options.toggleSelector ??
            "[data-lumina-password-toggle]";

        this.activeClassName =
            options.activeClassName ??
            "is-visible";

        this.glowClassName =
            options.glowClassName ??
            "lumina-password-glow-active";

        this.visibleLabel =
            options.visibleLabel ??
            "Hide Password";

        this.hiddenLabel =
            options.hiddenLabel ??
            "Show Password";

        this.updateText =
            options.updateText ??
            true;

        this.glowDuration =
            options.glowDuration ??
            720;

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.collectInstances();

        this.setupListeners();

        this.logger.info(
            `[Lumina Password] Initialized ${this.instances.length} password toggle(s).`
        );

    }

    protected onDestroy(): void {

        for (const unsubscribe of this.unsubscribeListeners) {

            unsubscribe();

        }

        this.unsubscribeListeners.length =
            0;

        for (const instance of this.instances) {

            this.dom.removeClass(
                instance.input,
                this.glowClassName
            );

        }

        this.instances.length =
            0;

    }

    show(input: HTMLInputElement, trigger: HTMLElement): void {

        input.type =
            "text";

        this.dom.addClass(
            trigger,
            this.activeClassName
        );

        this.dom.attr(
            trigger,
            "aria-pressed",
            "true"
        );

        this.updateTriggerLabel(
            trigger,
            true
        );

        this.pulseInput(
            input
        );

        this.emit(
            "password:show",
            {
                input,
                trigger,
                visible: true
            }
        );

        this.emit(
            "password:toggle",
            {
                input,
                trigger,
                visible: true
            }
        );

    }

    hide(input: HTMLInputElement, trigger: HTMLElement): void {

        input.type =
            "password";

        this.dom.removeClass(
            trigger,
            this.activeClassName
        );

        this.dom.attr(
            trigger,
            "aria-pressed",
            "false"
        );

        this.updateTriggerLabel(
            trigger,
            false
        );

        this.pulseInput(
            input
        );

        this.emit(
            "password:hide",
            {
                input,
                trigger,
                visible: false
            }
        );

        this.emit(
            "password:toggle",
            {
                input,
                trigger,
                visible: false
            }
        );

    }

    toggle(input: HTMLInputElement, trigger: HTMLElement): void {

        if (input.type === "password") {

            this.show(
                input,
                trigger
            );

            return;

        }

        this.hide(
            input,
            trigger
        );

    }

    private collectInstances(): void {

        const triggers =
            this.dom.findAll<HTMLElement>(
                this.toggleSelector
            );

        for (const trigger of triggers) {

            const selector =
                this.dom.data(
                    trigger,
                    "luminaPasswordToggle"
                );

            if (!selector) {

                this.logger.warn(
                    "[Lumina Password] Toggle without target selector."
                );

                continue;

            }

            const input =
                this.dom.find<HTMLInputElement>(
                    selector
                );

            if (!input) {

                this.logger.warn(
                    `[Lumina Password] Input "${selector}" not found.`
                );

                continue;

            }

            if (input.type !== "password") {

                this.logger.warn(
                    `[Lumina Password] Input "${selector}" is not a password field.`
                );

                continue;

            }

            this.prepareInstance(
                input,
                trigger
            );

            this.instances.push({
                input,
                trigger
            });

        }

    }

    private prepareInstance(
        input: HTMLInputElement,
        trigger: HTMLElement
    ): void {

        this.dom.attr(
            trigger,
            "type",
            "button"
        );

        this.dom.attr(
            trigger,
            "aria-pressed",
            "false"
        );

        if (!this.dom.attr(trigger, "aria-label")) {

            this.dom.attr(
                trigger,
                "aria-label",
                this.hiddenLabel
            );

        }

        this.updateTriggerLabel(
            trigger,
            false
        );

        if (!this.dom.attr(input, "autocomplete")) {

            this.dom.attr(
                input,
                "autocomplete",
                "current-password"
            );

        }

    }

    private setupListeners(): void {

        for (const instance of this.instances) {

            const unsubscribe =
                this.dom.listen(
                    instance.trigger,
                    "click",
                    event => {

                        event.preventDefault();

                        this.toggle(
                            instance.input,
                            instance.trigger
                        );

                    }
                );

            this.unsubscribeListeners.push(
                unsubscribe
            );

        }

    }

    private updateTriggerLabel(
        trigger: HTMLElement,
        visible: boolean
    ): void {

        const label =
            visible
                ? this.visibleLabel
                : this.hiddenLabel;

        this.dom.attr(
            trigger,
            "aria-label",
            label
        );

        if (!this.updateText) {
            return;
        }

        trigger.textContent =
            label;

    }

    private pulseInput(
        input: HTMLInputElement
    ): void {

        this.dom.removeClass(
            input,
            this.glowClassName
        );

        input.getBoundingClientRect();

        this.dom.addClass(
            input,
            this.glowClassName
        );

        window.setTimeout(
            () => {

                this.dom.removeClass(
                    input,
                    this.glowClassName
                );

            },
            this.glowDuration
        );

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-password-visibility-style",
            `
                .${this.glowClassName} {
                    animation:
                        lumina-password-glow
                        var(--lumina-password-glow-duration, ${this.glowDuration}ms)
                        cubic-bezier(.16, 1, .3, 1);
                }

                @keyframes lumina-password-glow {
                    0% {
                        border-color:
                            var(--border, rgba(148, 163, 184, .24));

                        box-shadow:
                            0 0 0 0
                            color-mix(
                                in srgb,
                                var(--accent, #7c3aed) 0%,
                                transparent
                            );
                    }

                    30% {
                        border-color:
                            color-mix(
                                in srgb,
                                var(--accent, #7c3aed) 72%,
                                transparent
                            );

                        box-shadow:
                            0 0 0 4px
                            color-mix(
                                in srgb,
                                var(--accent, #7c3aed) 22%,
                                transparent
                            ),
                            0 0 34px
                            color-mix(
                                in srgb,
                                var(--accent-2, #06b6d4) 38%,
                                transparent
                            );
                    }

                    100% {
                        border-color:
                            var(--border, rgba(148, 163, 184, .24));

                        box-shadow:
                            0 0 0 0
                            color-mix(
                                in srgb,
                                var(--accent, #7c3aed) 0%,
                                transparent
                            );
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .${this.glowClassName} {
                        animation: none !important;
                    }
                }
            `
        );

    }

}