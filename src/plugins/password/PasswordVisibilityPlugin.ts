// src/password/PasswordVisibilityPlugin.ts

import { BasePlugin } from "../../core";

interface PasswordToggleInstance {

    input: HTMLInputElement;

    trigger: HTMLElement;

}

export interface PasswordVisibilityPluginOptions {

    toggleSelector?: string;

    activeClassName?: string;

    visibleLabel?: string;

    hiddenLabel?: string;

    updateText?: boolean;

}

export class PasswordVisibilityPlugin extends BasePlugin {

    readonly metadata = {
        name: "password-visibility",
        version: "1.0.0",
        description: "Alterna a visibilidade de campos de senha."
    };

    private readonly toggleSelector: string;

    private readonly activeClassName: string;

    private readonly visibleLabel: string;

    private readonly hiddenLabel: string;

    private readonly updateText: boolean;

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

        this.visibleLabel =
            options.visibleLabel ??
            "Ocultar senha";

        this.hiddenLabel =
            options.hiddenLabel ??
            "Mostrar senha";

        this.updateText =
            options.updateText ??
            true;

    }

    protected onInitialize(): void {

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

}