// src/dropdown/DropdownPlugin.ts

import { BasePlugin } from "../../core";

interface DropdownInstance {

    id: string;

    trigger: HTMLElement;

    menu: HTMLElement;

    placement: DropdownPlacement;

}

export type DropdownEffect =
    | "none"
    | "glow";

export type DropdownPlacement =
    | "top"
    | "bottom"
    | "left"
    | "right";

export interface DropdownPluginOptions {

    triggerSelector?: string;

    menuSelector?: string;

    openClassName?: string;

    closeOnOutsideClick?: boolean;

    closeOnEscape?: boolean;

    effect?: DropdownEffect;

    placement?: DropdownPlacement;

}

export class DropdownPlugin extends BasePlugin {

    readonly metadata = {
        name: "dropdown",
        version: "1.0.0",
        description: "Manages reusable dropdowns using data attributes."
    };

    private readonly triggerSelector: string;

    private readonly openClassName: string;

    private readonly closeOnOutsideClick: boolean;

    private readonly closeOnEscape: boolean;

    private readonly effect: DropdownEffect;

    private readonly placement: DropdownPlacement;

    private readonly closeTimers =
        new Map<string, number>();

    private readonly instances =
        new Map<string, DropdownInstance>();

    private readonly unsubscribeListeners: Array<() => void> = [];

    constructor(options: DropdownPluginOptions = {}) {

        super();

        this.triggerSelector =
            options.triggerSelector ??
            "[data-lumina-dropdown-trigger]";

        this.openClassName =
            options.openClassName ??
            "is-open";

        this.closeOnOutsideClick =
            options.closeOnOutsideClick ??
            true;

        this.closeOnEscape =
            options.closeOnEscape ??
            true;

        this.effect =
            options.effect ?? "none";

        this.placement =
            options.placement ?? "bottom";

    }

    protected onInitialize(): void {

        this.injectPlacementStyles();

        this.injectEffectStyles();

        this.collectInstances();

        this.setupTriggerListeners();

        this.setupGlobalListeners();

        this.logger.info(
            `[Lumina Dropdown] Initialized ${this.instances.size} dropdown(s).`
        );

    }

    protected onDestroy(): void {

        for (const unsubscribe of this.unsubscribeListeners) {

            unsubscribe();

        }

        for (const timer of this.closeTimers.values()) {

            clearTimeout(timer);

        }

        this.unsubscribeListeners.length =
            0;

        this.closeTimers.clear();

        this.instances.clear();

    }

    open(id: string): void {

        const instance =
            this.instances.get(id);

        if (!instance) {
            return;
        }

        this.closeAllExcept(id);

        this.clearCloseTimer(id);

        this.dom.removeAttr(
            instance.menu,
            "hidden"
        );

        this.dom.removeClass(
            instance.menu,
            "is-closing"
        );

        this.dom.addClass(
            instance.menu,
            this.openClassName
        );

        this.dom.attr(
            instance.trigger,
            "aria-expanded",
            "true"
        );

        this.emit(
            "dropdown:open",
            instance
        );

    }

    close(id: string): void {

        const instance =
            this.instances.get(id);

        if (!instance) {
            return;
        }

        if (!this.isOpen(id)) {
            return;
        }

        this.dom.attr(
            instance.trigger,
            "aria-expanded",
            "false"
        );

        if (this.effect === "glow") {

            this.clearCloseTimer(id);

            this.dom.addClass(
                instance.menu,
                "is-closing"
            );

            requestAnimationFrame(() => {

                this.dom.removeClass(
                    instance.menu,
                    this.openClassName
                );

            });

            const timer =
                window.setTimeout(
                    () => {

                        this.dom.removeClass(
                            instance.menu,
                            "is-closing"
                        );

                        this.dom.attr(
                            instance.menu,
                            "hidden",
                            ""
                        );

                        this.closeTimers.delete(id);

                    },
                    220
                );

            this.closeTimers.set(
                id,
                timer
            );

        } else {

            this.dom.removeClass(
                instance.menu,
                this.openClassName
            );

            this.dom.attr(
                instance.menu,
                "hidden",
                ""
            );

        }

        this.emit(
            "dropdown:close",
            instance
        );

    }

    toggle(id: string): void {

        if (this.isOpen(id)) {

            this.close(id);

            return;

        }

        this.open(id);

    }

    closeAll(): void {

        for (const id of this.instances.keys()) {

            this.close(id);

        }

    }

    isOpen(id: string): boolean {

        const instance =
            this.instances.get(id);

        if (!instance) {
            return false;
        }

        return this.dom.hasClass(
            instance.menu,
            this.openClassName
        );

    }

    private collectInstances(): void {

        const triggers =
            this.dom.findAll<HTMLElement>(
                this.triggerSelector
            );

        for (const trigger of triggers) {

            const id =
                this.dom.data(
                    trigger,
                    "luminaDropdownTrigger"
                );

            if (!id) {
                continue;
            }

            const menu =
                this.dom.find<HTMLElement>(
                    `[data-lumina-dropdown-menu="${id}"]`
                );

            if (!menu) {

                this.logger.warn(
                    `[Lumina Dropdown] Menu "${id}" not found.`
                );

                continue;

            }

            const placement =
                this.resolvePlacement(menu);

            this.instances.set(
                id,
                {
                    id,
                    trigger,
                    menu,
                    placement
                }
            );

            this.prepareInstance(
                id,
                trigger,
                menu,
                placement
            );

            this.dom.data(
                menu,
                "luminaDropdownPlacement",
                placement
            );

        }

    }

    private prepareInstance(
        id: string,
        trigger: HTMLElement,
        menu: HTMLElement,
        placement: DropdownPlacement
    ): void {

        this.dom.attr(
            trigger,
            "aria-haspopup",
            "menu"
        );

        this.dom.attr(
            trigger,
            "aria-expanded",
            "false"
        );

        this.dom.attr(
            menu,
            "role",
            "menu"
        );

        this.dom.attr(
            menu,
            "hidden",
            ""
        );

        this.dom.addClass(
            menu,
            "lumina-dropdown-menu"
        );

        this.dom.addClass(
            menu,
            `lumina-dropdown-${placement}`
        );

        if (this.effect === "glow") {

            this.dom.addClass(
                menu,
                "lumina-dropdown-glow"
            );

        }

        if (!this.dom.attr(menu, "id")) {

            this.dom.attr(
                menu,
                "id",
                `lumina-dropdown-${id}`
            );

        }

        this.dom.attr(
            trigger,
            "aria-controls",
            this.dom.attr(menu, "id") ?? ""
        );

    }

    private setupTriggerListeners(): void {

        for (const instance of this.instances.values()) {

            const unsubscribe =
                this.dom.listen(
                    instance.trigger,
                    "click",
                    event => {

                        event.preventDefault();

                        this.toggle(
                            instance.id
                        );

                    }
                );

            this.unsubscribeListeners.push(
                unsubscribe
            );

        }

    }

    private setupGlobalListeners(): void {

        if (this.closeOnOutsideClick) {

            const unsubscribeClick =
                this.dom.listenDocument(
                    "click",
                    event => {

                        this.handleOutsideClick(
                            event
                        );

                    }
                );

            this.unsubscribeListeners.push(
                unsubscribeClick
            );

        }

        if (this.closeOnEscape) {

            const unsubscribeKeydown =
                this.dom.listenDocument(
                    "keydown",
                    event => {

                        if (event.key !== "Escape") {
                            return;
                        }

                        this.closeAll();

                    }
                );

            this.unsubscribeListeners.push(
                unsubscribeKeydown
            );

        }

    }

    private handleOutsideClick(
        event: MouseEvent
    ): void {

        for (const instance of this.instances.values()) {

            const clickedTrigger =
                this.dom.contains(
                    instance.trigger,
                    event.target
                );

            const clickedMenu =
                this.dom.contains(
                    instance.menu,
                    event.target
                );

            if (
                clickedTrigger ||
                clickedMenu
            ) {
                continue;
            }

            this.close(
                instance.id
            );

        }

    }

    private closeAllExcept(
        activeId: string
    ): void {

        for (const id of this.instances.keys()) {

            if (id === activeId) {
                continue;
            }

            this.close(id);

        }

    }

    private clearCloseTimer(
        id: string
    ): void {

        const timer =
            this.closeTimers.get(id);

        if (!timer) {
            return;
        }

        clearTimeout(timer);

        this.closeTimers.delete(id);

    }

    private injectEffectStyles(): void {

        if (this.effect !== "glow") {
            return;
        }

        this.dom.injectStyle(
            "lumina-dropdown-glow-style",
            `
                .lumina-dropdown-glow {
                    opacity: 0;
                    translate: 0 -10px;
                    scale: 0.95;
                    filter: brightness(0.5);
                    box-shadow: none;
                    transform-origin: top center;
                    will-change: opacity, translate, scale, filter, box-shadow;
                }

                .lumina-dropdown-glow.is-open {
                    opacity: 1;
                    translate: 0 0;
                    scale: 1;
                    filter: brightness(1);
                    animation:
                        lumina-dropdown-glow-in
                        300ms
                        cubic-bezier(0.16, 1, 0.3, 1)
                        forwards;
                }

                .lumina-dropdown-glow.is-closing,
                .lumina-dropdown-glow.is-open.is-closing {
                    opacity: 0;
                    translate: 0 -8px;
                    scale: 0.97;
                    filter: brightness(0.9);
                    animation: none;
                    transition:
                        opacity 220ms ease-in,
                        translate 220ms ease-in,
                        scale 220ms ease-in,
                        filter 180ms ease;
                }

                @keyframes lumina-dropdown-glow-in {
                    0% {
                        opacity: 0;
                        translate: 0 -10px;
                        scale: 0.95;
                        filter: brightness(0.5);
                        box-shadow: none;
                    }

                    70% {
                        opacity: 1;
                        translate: 0 0;
                        scale: 1;
                        filter: brightness(1.2);
                        box-shadow:
                            0 0 25px rgba(255, 255, 255, 0.2),
                            0 10px 25px -5px rgba(0, 0, 0, 0.3);
                    }

                    100% {
                        opacity: 1;
                        translate: 0 0;
                        scale: 1;
                        filter: brightness(1);
                        box-shadow: inherit;
                    }
                }
            `
        );

    }

    private resolvePlacement(
        menu: HTMLElement
    ): DropdownPlacement {

        const placement =
            this.dom.data(
                menu,
                "luminaDropdownPlacement"
            );

        if (this.isDropdownPlacement(placement)) {
            return placement;
        }

        return this.placement;

    }

    private isDropdownPlacement(
        value: string | null | void
    ): value is DropdownPlacement {

        return (
            value === "top" ||
            value === "bottom" ||
            value === "left" ||
            value === "right"
        );

    }

    private injectPlacementStyles(): void {

        this.dom.injectStyle(
            "lumina-dropdown-placement-style",
            `
                .lumina-dropdown-menu {
                    position: absolute;
                    z-index: 50;
                }

                .lumina-dropdown-bottom {
                    top: calc(100% + 12px);
                    left: 50%;
                    transform: translateX(-50%);
                    transform-origin: top center;
                }

                .lumina-dropdown-top {
                    bottom: calc(100% + 12px);
                    left: 50%;
                    transform: translateX(-50%);
                    transform-origin: bottom center;
                }

                .lumina-dropdown-left {
                    right: calc(100% + 12px);
                    top: 50%;
                    transform: translateY(-50%);
                    transform-origin: center right;
                }

                .lumina-dropdown-right {
                    left: calc(100% + 12px);
                    top: 50%;
                    transform: translateY(-50%);
                    transform-origin: center left;
                }
            `
        );

    }

}