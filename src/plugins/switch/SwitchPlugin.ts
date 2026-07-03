import { BasePlugin } from "../../core";

export type SwitchEffect =
    | "none"
    | "fade"
    | "slide"
    | "glow";

export interface SwitchPluginOptions {

    selector?: string;

    panelSelector?: string;

    triggerSelector?: string;

    className?: string;

    activeClassName?: string;

    triggerActiveClassName?: string;

    effect?: SwitchEffect;

    duration?: number;

    autoHeight?: boolean;

}

interface SwitchGroup {

    id: string;

    container: HTMLElement;

    panels: HTMLElement[];

    triggers: HTMLElement[];

    activePanel: HTMLElement | null;

    isSwitching: boolean;

}

interface SwitchListener {

    element: HTMLElement;

    type: keyof HTMLElementEventMap;

    listener: EventListener;

}

export class SwitchPlugin extends BasePlugin {

    readonly metadata = {
        name: "switch",
        version: "1.0.0",
        description: "Alterna painéis de conteúdo com animação, altura automática e efeito visual."
    };

    private readonly selector: string;

    private readonly panelSelector: string;

    private readonly triggerSelector: string;

    private readonly className: string;

    private readonly activeClassName: string;

    private readonly triggerActiveClassName: string;

    private readonly effect: SwitchEffect;

    private readonly duration: number;

    private readonly autoHeight: boolean;

    private readonly groups =
        new Map<string, SwitchGroup>();

    private readonly listeners: SwitchListener[] =
        [];

    constructor(options: SwitchPluginOptions = {}) {

        super();

        this.selector =
            options.selector ??
            "[data-lumina-switch]";

        this.panelSelector =
            options.panelSelector ??
            "[data-lumina-switch-panel]";

        this.triggerSelector =
            options.triggerSelector ??
            "[data-lumina-switch-trigger]";

        this.className =
            options.className ??
            "lumina-switch";

        this.activeClassName =
            options.activeClassName ??
            "is-switch-active";

        this.triggerActiveClassName =
            options.triggerActiveClassName ??
            "is-switch-trigger-active";

        this.effect =
            options.effect ??
            "glow";

        this.duration =
            options.duration ??
            520;

        this.autoHeight =
            options.autoHeight ??
            true;

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.collectGroups();

        this.bindTriggers();

        this.logger.info(
            `[Lumina Switch] Initialized ${this.groups.size} group(s).`
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

        for (const group of this.groups.values()) {

            this.cleanupGroup(group);

        }

        this.groups.clear();

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

        for (const group of this.groups.values()) {

            this.cleanupGroup(group);

        }

        this.groups.clear();

        this.collectGroups();

        this.bindTriggers();

    }

    async show(
        groupId: string,
        target: string
    ): Promise<void> {

        const group =
            this.groups.get(groupId);

        if (!group || group.isSwitching) {
            return;
        }

        const nextPanel =
            this.findPanelByName(
                group,
                target
            );

        if (!nextPanel) {
            return;
        }

        const previousPanel =
            group.activePanel;

        if (previousPanel === nextPanel) {
            return;
        }

        await this.switchToPanel(
            group,
            nextPanel
        );

    }

    private collectGroups(): void {

        const containers =
            this.dom.findAll<HTMLElement>(
                this.selector
            );

        for (const container of containers) {

            const id =
                container.dataset.luminaSwitch;

            if (!id) {
                continue;
            }

            const panels =
                [...container.querySelectorAll<HTMLElement>(
                    this.panelSelector
                )];

            if (panels.length === 0) {
                continue;
            }

            const triggers =
                this.dom.findAll<HTMLElement>(
                    `${this.triggerSelector}[data-lumina-switch-trigger="${id}"]`
                );

            const activePanel =
                this.resolveInitialPanel(panels);

            const group: SwitchGroup = {
                id,
                container,
                panels,
                triggers,
                activePanel,
                isSwitching: false
            };

            this.prepareGroup(group);

            this.groups.set(
                id,
                group
            );

        }

    }

    private prepareGroup(
        group: SwitchGroup
    ): void {

        this.dom.addClass(
            group.container,
            this.className
        );

        this.dom.style(
            group.container,
            "--lumina-switch-duration",
            `${this.duration}ms`
        );

        for (const panel of group.panels) {

            this.dom.addClass(
                panel,
                `${this.className}-panel`
            );

            const isActive =
                panel === group.activePanel;

            if (isActive) {

                panel.hidden =
                    false;

                this.dom.addClass(
                    panel,
                    this.activeClassName
                );

                continue;

            }

            panel.hidden =
                true;

            this.dom.removeClass(
                panel,
                this.activeClassName
            );

        }

        this.syncTriggers(group);

    }

    private bindTriggers(): void {

        for (const group of this.groups.values()) {

            for (const trigger of group.triggers) {

                const listener =
                    (): void => {

                        const target =
                            trigger.dataset.luminaSwitchTarget;

                        if (!target) {
                            return;
                        }

                        void this.show(
                            group.id,
                            target
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

    }

    private async switchToPanel(
        group: SwitchGroup,
        nextPanel: HTMLElement
    ): Promise<void> {

        const previousPanel =
            group.activePanel;

        const previousName =
            previousPanel?.dataset.luminaSwitchPanel ??
            null;

        const nextName =
            nextPanel.dataset.luminaSwitchPanel;

        if (!nextName) {
            return;
        }

        group.isSwitching =
            true;

        this.emit(
            "switch:before",
            {
                container: group.container,
                previousPanel,
                currentPanel: nextPanel,
                previous: previousName,
                current: nextName
            }
        );

        const startHeight =
            group.container.getBoundingClientRect().height;

        nextPanel.hidden =
            false;

        this.dom.addClass(
            nextPanel,
            `${this.className}-entering`
        );

        const endHeight =
            this.measureContainerHeightForPanel(
                group,
                nextPanel
            );

        if (this.autoHeight) {

            this.animateHeight(
                group.container,
                startHeight,
                endHeight
            );

        }

        if (previousPanel) {

            this.dom.addClass(
                previousPanel,
                `${this.className}-leaving`
            );

        }

        if (this.effect === "glow") {

            this.dom.addClass(
                group.container,
                `${this.className}-glow-active`
            );

        }

        await this.nextFrame();

        if (previousPanel) {

            this.dom.addClass(
                previousPanel,
                `${this.className}-leaving-active`
            );

            this.dom.removeClass(
                previousPanel,
                this.activeClassName
            );

        }

        await this.wait(
            Math.round(this.duration * 0.28)
        );

        this.dom.addClass(
            nextPanel,
            this.activeClassName
        );

        await this.wait(
            Math.round(this.duration * 0.72)
        );

        if (previousPanel) {

            previousPanel.hidden =
                true;

            this.dom.removeClass(
                previousPanel,
                `${this.className}-leaving`
            );

            this.dom.removeClass(
                previousPanel,
                `${this.className}-leaving-active`
            );

        }

        this.dom.removeClass(
            nextPanel,
            `${this.className}-entering`
        );

        if (this.autoHeight) {

            this.dom.style(
                group.container,
                "height",
                ""
            );

        }

        this.dom.removeClass(
            group.container,
            `${this.className}-glow-active`
        );

        group.activePanel =
            nextPanel;

        group.isSwitching =
            false;

        this.syncTriggers(group);

        this.emit(
            "switch:after",
            {
                container: group.container,
                previousPanel,
                currentPanel: nextPanel,
                previous: previousName,
                current: nextName
            }
        );

    }

    private measureContainerHeightForPanel(
        group: SwitchGroup,
        targetPanel: HTMLElement
    ): number {

        const container =
            group.container;

        const previousHeight =
            container.style.height;

        const previousPanelStates =
            group.panels.map(
                panel => ({
                    panel,
                    hidden: panel.hidden
                })
            );

        for (const panel of group.panels) {

            panel.hidden =
                panel !== targetPanel;

        }

        targetPanel.hidden =
            false;

        this.dom.removeClass(
            targetPanel,
            `${this.className}-entering`
        );

        this.dom.addClass(
            targetPanel,
            this.activeClassName
        );

        container.style.height =
            "";

        const height =
            container.getBoundingClientRect().height;

        this.dom.removeClass(
            targetPanel,
            this.activeClassName
        );

        this.dom.addClass(
            targetPanel,
            `${this.className}-entering`
        );

        for (const state of previousPanelStates) {

            state.panel.hidden =
                state.hidden;

        }

        targetPanel.hidden =
            false;

        container.style.height =
            previousHeight;

        return height;

    }

    private animateHeight(
        container: HTMLElement,
        startHeight: number,
        endHeight: number
    ): void {

        this.dom.style(
            container,
            "height",
            `${startHeight}px`
        );

        container.getBoundingClientRect();

        this.dom.style(
            container,
            "height",
            `${endHeight}px`
        );

    }

    private syncTriggers(
        group: SwitchGroup
    ): void {

        const activeName =
            group.activePanel?.dataset.luminaSwitchPanel;

        for (const trigger of group.triggers) {

            const target =
                trigger.dataset.luminaSwitchTarget;

            const isActive =
                target === activeName;

            trigger.setAttribute(
                "aria-pressed",
                String(isActive)
            );

            if (isActive) {

                this.dom.addClass(
                    trigger,
                    this.triggerActiveClassName
                );

                continue;

            }

            this.dom.removeClass(
                trigger,
                this.triggerActiveClassName
            );

        }

    }

    private resolveInitialPanel(
        panels: HTMLElement[]
    ): HTMLElement {

        const visiblePanel =
            panels.find(
                panel => !panel.hidden
            );

        return visiblePanel ??
            panels[0];

    }

    private findPanelByName(
        group: SwitchGroup,
        name: string
    ): HTMLElement | null {

        return group.panels.find(
            panel => panel.dataset.luminaSwitchPanel === name
        ) ?? null;

    }

    private cleanupGroup(
        group: SwitchGroup
    ): void {

        this.dom.removeClass(
            group.container,
            this.className
        );

        this.dom.removeClass(
            group.container,
            `${this.className}-glow-active`
        );

        this.dom.style(
            group.container,
            "--lumina-switch-duration",
            ""
        );

        this.dom.style(
            group.container,
            "height",
            ""
        );

        for (const panel of group.panels) {

            this.dom.removeClass(
                panel,
                `${this.className}-panel`
            );

            this.dom.removeClass(
                panel,
                this.activeClassName
            );

            this.dom.removeClass(
                panel,
                `${this.className}-entering`
            );

            this.dom.removeClass(
                panel,
                `${this.className}-leaving`
            );

            this.dom.removeClass(
                panel,
                `${this.className}-leaving-active`
            );

        }

        for (const trigger of group.triggers) {

            this.dom.removeClass(
                trigger,
                this.triggerActiveClassName
            );

            trigger.removeAttribute(
                "aria-pressed"
            );

        }

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

    private nextFrame(): Promise<void> {

        return new Promise(
            resolve => {

                requestAnimationFrame(
                    () => {

                        resolve();

                    }
                );

            }
        );

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-switch-style",
            `
                .${this.className} {
                    position: relative;
                    display: grid;
                    overflow: hidden;
                    transition:
                        height var(--lumina-switch-duration, 520ms) cubic-bezier(.16, 1, .3, 1);
                    isolation: isolate;
                }

                .${this.className}::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    pointer-events: none;
                    opacity: 0;
                    transition:
                        opacity var(--lumina-switch-duration, 520ms) ease;
                    background:
                        radial-gradient(
                            circle at 20% 20%,
                            var(--lumina-switch-glow, rgba(167, 139, 250, .24)),
                            transparent 36%
                        ),
                        radial-gradient(
                            circle at 88% 78%,
                            var(--lumina-switch-glow-secondary, rgba(34, 211, 238, .18)),
                            transparent 38%
                        );
                }

                .${this.className}.${this.className}-glow-active::before {
                    opacity: .95;
                }

                .${this.className}::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    pointer-events: none;
                    opacity: 0;
                    transition:
                        opacity var(--lumina-switch-duration, 520ms) ease;
                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255, 255, 255, .14),
                            transparent
                        );
                    transform: translateX(-100%);
                }

                .${this.className}.${this.className}-glow-active::after {
                    opacity: .75;
                    animation:
                        lumina-switch-sheen var(--lumina-switch-duration, 520ms) ease both;
                }

                .${this.className}-panel {
                    grid-area: 1 / 1;
                    position: relative;
                    z-index: 2;
                    min-width: 0;
                    width: 100%;
                    transition:
                        opacity var(--lumina-switch-duration, 520ms) ease,
                        filter var(--lumina-switch-duration, 520ms) ease,
                        transform var(--lumina-switch-duration, 520ms) cubic-bezier(.16, 1, .3, 1);
                    will-change: opacity, filter, transform;
                }

                .${this.className}-panel[hidden] {
                    display: none;
                }

                .${this.className}-entering {
                    opacity: 0;
                    filter: blur(8px);
                    transform: scale(.985);
                }

                .${this.className}-entering.${this.activeClassName} {
                    opacity: 1;
                    filter: blur(0);
                    transform: scale(1);
                }

                .${this.className}-leaving {
                    opacity: 1;
                    filter: blur(0);
                    transform: scale(1);
                    pointer-events: none;
                }

                .${this.className}-leaving-active {
                    opacity: 0;
                    filter: blur(8px);
                    transform: scale(.985);
                }

                .${this.triggerActiveClassName} {
                    color: #ffffff;
                    background:
                        linear-gradient(
                            135deg,
                            var(--accent, #7c3aed),
                            var(--accent-2, #06b6d4)
                        );
                    box-shadow:
                        0 16px 40px color-mix(in srgb, var(--accent, #7c3aed) 30%, transparent);
                }

                @keyframes lumina-switch-sheen {
                    from {
                        transform: translateX(-100%);
                    }

                    to {
                        transform: translateX(100%);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .${this.className},
                    .${this.className}-panel {
                        transition: none;
                    }

                    .${this.className}::after {
                        animation: none;
                    }

                    .${this.className}-entering,
                    .${this.className}-leaving,
                    .${this.className}-leaving-active {
                        opacity: 1;
                        filter: none;
                        transform: none;
                    }
                }
            `
        );

    }

}