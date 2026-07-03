import { BasePlugin } from "../../core";

export type CascadeDirection =
    | "up"
    | "down"
    | "left"
    | "right"
    | "fade";

interface CascadeGroup {

    container: HTMLElement;

    items: HTMLElement[];

    once: boolean;

}

export interface CascadePluginOptions {

    selector?: string;

    itemSelector?: string;

    className?: string;

    visibleClassName?: string;

    direction?: CascadeDirection;

    distance?: number;

    duration?: number;

    stagger?: number;

    threshold?: number;

    rootMargin?: string;

    once?: boolean;

}

export class CascadePlugin extends BasePlugin {

    readonly metadata = {
        name: "cascade",
        version: "1.0.0",
        description: "Revela grupos de elementos em sequência com atraso progressivo."
    };

    private readonly selector: string;

    private readonly itemSelector: string;

    private readonly className: string;

    private readonly visibleClassName: string;

    private readonly direction: CascadeDirection;

    private readonly distance: number;

    private readonly duration: number;

    private readonly stagger: number;

    private readonly threshold: number;

    private readonly rootMargin: string;

    private readonly revealOnce: boolean;

    private observer: IntersectionObserver | null =
        null;

    private readonly groups =
        new Map<HTMLElement, CascadeGroup>();

    constructor(options: CascadePluginOptions = {}) {

        super();

        this.selector =
            options.selector ??
            "[data-lumina-cascade]";

        this.itemSelector =
            options.itemSelector ??
            "[data-lumina-cascade-item]";

        this.className =
            options.className ??
            "lumina-cascade";

        this.visibleClassName =
            options.visibleClassName ??
            "is-cascade-visible";

        this.direction =
            options.direction ??
            "up";

        this.distance =
            options.distance ??
            24;

        this.duration =
            options.duration ??
            700;

        this.stagger =
            options.stagger ??
            80;

        this.threshold =
            options.threshold ??
            0.14;

        this.rootMargin =
            options.rootMargin ??
            "0px 0px -8% 0px";

        this.revealOnce =
            options.once ??
            true;

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.collectGroups();

        this.createObserver();

        this.observeGroups();

        this.logger.info(
            `[Lumina Cascade] Initialized ${this.groups.size} group(s).`
        );

    }

    protected onDestroy(): void {

        this.observer?.disconnect();

        this.observer =
            null;

        for (const group of this.groups.values()) {

            this.cleanupGroup(group);

        }

        this.groups.clear();

    }

    refresh(): void {

        this.observer?.disconnect();

        for (const group of this.groups.values()) {

            this.cleanupGroup(group);

        }

        this.groups.clear();

        this.collectGroups();

        this.createObserver();

        this.observeGroups();

    }

    private collectGroups(): void {

        const containers =
            this.dom.findAll<HTMLElement>(
                this.selector
            );

        for (const container of containers) {

            const items =
                this.findItems(container);

            if (items.length === 0) {
                continue;
            }

            const group: CascadeGroup = {
                container,
                items,
                once: this.resolveOnce(container)
            };

            this.prepareGroup(group);

            this.groups.set(
                container,
                group
            );

        }

    }

    private findItems(
        container: HTMLElement
    ): HTMLElement[] {

        const explicitItems =
            [...container.querySelectorAll<HTMLElement>(
                this.itemSelector
            )];

        if (explicitItems.length > 0) {
            return explicitItems;
        }

        return [...container.children]
            .filter(
                child => child instanceof HTMLElement
            ) as HTMLElement[];

    }

    private prepareGroup(
        group: CascadeGroup
    ): void {

        group.items.forEach(
            (item, index) => {

                const direction =
                    this.resolveDirection(item);

                this.dom.addClass(
                    item,
                    this.className
                );

                this.dom.addClass(
                    item,
                    `${this.className}-${direction}`
                );

                this.dom.style(
                    item,
                    "--lumina-cascade-distance",
                    `${this.distance}px`
                );

                this.dom.style(
                    item,
                    "--lumina-cascade-duration",
                    `${this.duration}ms`
                );

                this.dom.style(
                    item,
                    "--lumina-cascade-delay",
                    `${index * this.stagger}ms`
                );

            }
        );

    }

    private createObserver(): void {

        this.observer =
            new IntersectionObserver(
                entries => {

                    for (const entry of entries) {

                        const container =
                            entry.target as HTMLElement;

                        const group =
                            this.groups.get(container);

                        if (!group) {
                            continue;
                        }

                        if (entry.isIntersecting) {

                            this.showGroup(group);

                            if (group.once) {

                                this.observer?.unobserve(
                                    container
                                );

                            }

                            continue;

                        }

                        if (!group.once) {

                            this.hideGroup(group);

                        }

                    }

                },
                {
                    threshold: this.threshold,
                    rootMargin: this.rootMargin
                }
            );

    }

    private observeGroups(): void {

        if (!this.observer) {
            return;
        }

        for (const container of this.groups.keys()) {

            this.observer.observe(container);

        }

    }

    private showGroup(
        group: CascadeGroup
    ): void {

        group.items.forEach(
            (item, index) => {

                if (
                    this.dom.hasClass(
                        item,
                        this.visibleClassName
                    )
                ) {
                    return;
                }

                this.dom.addClass(
                    item,
                    this.visibleClassName
                );

                this.emit(
                    "cascade:show",
                    {
                        element: item,
                        index
                    }
                );

            }
        );

    }

    private hideGroup(
        group: CascadeGroup
    ): void {

        group.items.forEach(
            (item, index) => {

                if (
                    !this.dom.hasClass(
                        item,
                        this.visibleClassName
                    )
                ) {
                    return;
                }

                this.dom.removeClass(
                    item,
                    this.visibleClassName
                );

                this.emit(
                    "cascade:hide",
                    {
                        element: item,
                        index
                    }
                );

            }
        );

    }

    private resolveDirection(
        item: HTMLElement
    ): CascadeDirection {

        const direction =
            item.dataset.luminaCascadeItem as CascadeDirection | undefined;

        if (this.isDirection(direction)) {
            return direction;
        }

        return this.direction;

    }

    private resolveOnce(
        container: HTMLElement
    ): boolean {

        const value =
            container.dataset.luminaCascadeOnce;

        if (value === "false") {
            return false;
        }

        if (value === "true") {
            return true;
        }

        return this.revealOnce;

    }

    private isDirection(
        value: string | undefined
    ): value is CascadeDirection {

        return (
            value === "up" ||
            value === "down" ||
            value === "left" ||
            value === "right" ||
            value === "fade"
        );

    }

    private cleanupGroup(
        group: CascadeGroup
    ): void {

        for (const item of group.items) {

            this.dom.removeClass(
                item,
                this.className
            );

            this.dom.removeClass(
                item,
                this.visibleClassName
            );

            this.dom.removeClass(
                item,
                `${this.className}-up`
            );

            this.dom.removeClass(
                item,
                `${this.className}-down`
            );

            this.dom.removeClass(
                item,
                `${this.className}-left`
            );

            this.dom.removeClass(
                item,
                `${this.className}-right`
            );

            this.dom.removeClass(
                item,
                `${this.className}-fade`
            );

            this.dom.style(
                item,
                "--lumina-cascade-distance",
                ""
            );

            this.dom.style(
                item,
                "--lumina-cascade-duration",
                ""
            );

            this.dom.style(
                item,
                "--lumina-cascade-delay",
                ""
            );

        }

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-cascade-style",
            `
                .${this.className} {
                    opacity: 0;
                    transform: translate3d(0, var(--lumina-cascade-distance, 24px), 0);
                    transition:
                        opacity var(--lumina-cascade-duration, 700ms) ease,
                        transform var(--lumina-cascade-duration, 700ms) cubic-bezier(.2, .8, .2, 1);
                    transition-delay: var(--lumina-cascade-delay, 0ms);
                    will-change: opacity, transform;
                }

                .${this.className}.${this.visibleClassName} {
                    opacity: 1;
                    transform: translate3d(0, 0, 0);
                }

                .${this.className}-up {
                    transform: translate3d(0, var(--lumina-cascade-distance, 24px), 0);
                }

                .${this.className}-down {
                    transform: translate3d(0, calc(var(--lumina-cascade-distance, 24px) * -1), 0);
                }

                .${this.className}-left {
                    transform: translate3d(var(--lumina-cascade-distance, 24px), 0, 0);
                }

                .${this.className}-right {
                    transform: translate3d(calc(var(--lumina-cascade-distance, 24px) * -1), 0, 0);
                }

                .${this.className}-fade {
                    transform: none;
                }

                .${this.className}-fade.${this.visibleClassName} {
                    transform: none;
                }

                @media (prefers-reduced-motion: reduce) {
                    .${this.className} {
                        opacity: 1;
                        transform: none;
                        transition: none;
                    }
                }
            `
        );

    }

}