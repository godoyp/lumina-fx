import {
    BasePlugin,
    type ToastType
} from "../../core";

export type ToastPosition =
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";

export type ToastEffect =
    | "none"
    | "glow";

export interface ToastPluginOptions {

    containerId?: string;

    className?: string;

    position?: ToastPosition;

    duration?: number;

    maxVisible?: number;

    effect?: ToastEffect;

}

export interface ToastOptions {

    duration?: number;

}

interface ToastInstance {

    id: string;

    type: ToastType;

    message: string;

    element: HTMLElement;

    timer: number;

}

export class ToastPlugin extends BasePlugin {

    readonly metadata = {
        name: "toast",
        version: "1.0.0",
        description: "Exibe notificações temporárias com animação e efeito visual."
    };

    private readonly containerId: string;

    private readonly className: string;

    private readonly position: ToastPosition;

    private readonly duration: number;

    private readonly maxVisible: number;

    private readonly effect: ToastEffect;

    private initialized = false;

    private container: HTMLElement | null =
        null;

    private readonly toasts =
        new Map<string, ToastInstance>();

    constructor(options: ToastPluginOptions = {}) {

        super();

        this.containerId =
            options.containerId ??
            "lumina-toast-container";

        this.className =
            options.className ??
            "lumina-toast";

        this.position =
            options.position ??
            "top-right";

        this.duration =
            options.duration ??
            3600;

        this.maxVisible =
            options.maxVisible ??
            4;

        this.effect =
            options.effect ??
            "glow";

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.ensureContainer();

        this.initialized = true;

        this.logger.info(
            "[Lumina Toast] Initialized."
        );

    }

    protected async onDestroy(): Promise<void> {

        for (const toast of this.toasts.values()) {

            clearTimeout(toast.timer);

            toast.element.remove();

        }

        this.toasts.clear();

        this.container?.remove();

        this.container =
            null;

        this.initialized = false;

    }

    success(
        message: string,
        options: ToastOptions = {}
    ): string {

        return this.show(
            "success",
            message,
            options
        );

    }

    error(
        message: string,
        options: ToastOptions = {}
    ): string {

        return this.show(
            "error",
            message,
            options
        );

    }

    info(
        message: string,
        options: ToastOptions = {}
    ): string {

        return this.show(
            "info",
            message,
            options
        );

    }

    warning(
        message: string,
        options: ToastOptions = {}
    ): string {

        return this.show(
            "warning",
            message,
            options
        );

    }

    show(
        type: ToastType,
        message: string,
        options: ToastOptions = {}
    ): string {

        if (!this.initialized) {

            console.warn(
                "[Lumina Toast] Tried to show a toast before initialization."
            );

            return "";

        }

        const container =
            this.ensureContainer();

        this.trimToMaxVisible();

        const id =
            this.createId();

        const element =
            this.createToastElement(
                id,
                type,
                message
            );

        container.appendChild(element);

        requestAnimationFrame(
            () => {

                this.dom.addClass(
                    element,
                    "is-visible"
                );

            }
        );

        const timer =
            window.setTimeout(
                () => {

                    this.hide(id);

                },
                options.duration ?? this.duration
            );

        this.toasts.set(
            id,
            {
                id,
                type,
                message,
                element,
                timer
            }
        );

        this.emit(
            "toast:show",
            {
                id,
                type,
                message
            }
        );

        return id;

    }

    hide(id: string): void {

        const toast =
            this.toasts.get(id);

        if (!toast) {
            return;
        }

        clearTimeout(toast.timer);

        this.dom.removeClass(
            toast.element,
            "is-visible"
        );

        this.dom.addClass(
            toast.element,
            "is-leaving"
        );

        window.setTimeout(
            () => {

                toast.element.remove();

                this.toasts.delete(id);

                this.emit(
                    "toast:hide",
                    {
                        id: toast.id,
                        type: toast.type,
                        message: toast.message
                    }
                );

            },
            220
        );

    }

    clear(): void {

        for (const id of this.toasts.keys()) {

            this.hide(id);

        }

    }

    private ensureContainer(): HTMLElement {

        if (this.container) {
            return this.container;
        }

        const existing =
            document.getElementById(
                this.containerId
            );

        if (existing instanceof HTMLElement) {

            this.container =
                existing;

            return existing;

        }

        const container =
            document.createElement("div");

        container.id =
            this.containerId;

        this.dom.addClass(
            container,
            `${this.className}-container`
        );

        this.dom.addClass(
            container,
            `${this.className}-container-${this.position}`
        );

        document.body.appendChild(container);

        this.container =
            container;

        return container;

    }

    private createToastElement(
        id: string,
        type: ToastType,
        message: string
    ): HTMLElement {

        const toast =
            document.createElement("div");

        toast.dataset.luminaToastId =
            id;

        toast.setAttribute(
            "role",
            "status"
        );

        toast.setAttribute(
            "aria-live",
            type === "error"
                ? "assertive"
                : "polite"
        );

        this.dom.addClass(
            toast,
            this.className
        );

        this.dom.addClass(
            toast,
            `${this.className}-${type}`
        );

        if (this.effect === "glow") {

            this.dom.addClass(
                toast,
                `${this.className}-glow`
            );

        }

        toast.innerHTML = `
            <span class="${this.className}-icon">
                ${this.resolveIcon(type)}
            </span>

            <span class="${this.className}-content">
                ${this.escapeHtml(message)}
            </span>

            <button
                class="${this.className}-close"
                type="button"
                aria-label="Fechar notificação"
            >
                ×
            </button>
        `;

        const closeButton =
            toast.querySelector<HTMLButtonElement>(
                `.${this.className}-close`
            );

        closeButton?.addEventListener(
            "click",
            () => {

                this.hide(id);

            }
        );

        return toast;

    }

    private trimToMaxVisible(): void {

        while (this.toasts.size >= this.maxVisible) {

            const oldest =
                this.toasts.keys().next().value as string | undefined;

            if (!oldest) {
                return;
            }

            this.hide(oldest);

        }

    }

    private createId(): string {

        return `toast-${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`;

    }

    private resolveIcon(type: ToastType): string {

        if (type === "success") {
            return "✓";
        }

        if (type === "error") {
            return "!";
        }

        if (type === "warning") {
            return "!";
        }

        return "i";

    }

    private escapeHtml(value: string): string {

        const element =
            document.createElement("div");

        element.textContent =
            value;

        return element.innerHTML;

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-toast-style",
            `
                .${this.className}-container {
                    position: fixed;
                    z-index: 10000;
                    display: grid;
                    gap: 12px;
                    width: min(380px, calc(100vw - 32px));
                    pointer-events: none;
                }

                .${this.className}-container-top-right {
                    top: 88px;
                    right: 16px;
                }

                .${this.className}-container-top-left {
                    top: 88px;
                    left: 16px;
                }

                .${this.className}-container-bottom-right {
                    right: 16px;
                    bottom: 16px;
                }

                .${this.className}-container-bottom-left {
                    left: 16px;
                    bottom: 16px;
                }

                .${this.className} {
                    position: relative;
                    overflow: hidden;
                    isolation: isolate;
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    align-items: center;
                    gap: 12px;

                    min-height: 58px;
                    padding: 14px 14px;
                    border-radius: 18px;
                    border: 1px solid var(--lumina-toast-border, rgba(148, 163, 184, .24));

                    color: var(--lumina-toast-fg, var(--fg, #e2e8f0));
                    background:
                        linear-gradient(
                            180deg,
                            color-mix(in srgb, var(--card, #0f172a) 92%, transparent),
                            color-mix(in srgb, var(--card-soft, #111827) 92%, transparent)
                        );

                    box-shadow:
                        0 20px 60px rgba(0, 0, 0, .24);

                    opacity: 0;
                    transform:
                        translate3d(
                            var(--lumina-toast-enter-x, 18px),
                            0,
                            0
                        )
                        scale(.98);

                    transition:
                        opacity 220ms ease,
                        transform 220ms cubic-bezier(.2, .8, .2, 1);
                    pointer-events: auto;
                }

                .${this.className}.is-visible {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                .${this.className}.is-leaving {
                    opacity: 0;
                    transform:
                        translate3d(
                            var(--lumina-toast-enter-x, 18px),
                            0,
                            0
                        )
                        scale(.98);
                }

                .${this.className}-container-top-left .${this.className},
                .${this.className}-container-bottom-left .${this.className} {
                    --lumina-toast-enter-x: -18px;
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
                            var(--lumina-toast-glow, rgba(167, 139, 250, .30)),
                            transparent 32%
                        ),
                        radial-gradient(
                            circle at 88% 80%,
                            var(--lumina-toast-glow-secondary, rgba(34, 211, 238, .20)),
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
                    opacity: .18;

                    background-image:
                        linear-gradient(
                            rgba(148, 163, 184, .28) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(148, 163, 184, .28) 1px,
                            transparent 1px
                        );

                    background-size: 26px 26px;
                }

                .${this.className}-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 999px;
                    display: grid;
                    place-items: center;
                    font-size: 14px;
                    font-weight: 950;
                    color: #ffffff;
                    background: var(--lumina-toast-accent, var(--accent, #7c3aed));
                    box-shadow:
                        0 10px 24px color-mix(in srgb, var(--lumina-toast-accent, #7c3aed) 36%, transparent);
                }

                .${this.className}-content {
                    font-size: 14px;
                    line-height: 1.45;
                    font-weight: 750;
                }

                .${this.className}-close {
                    width: 28px;
                    height: 28px;
                    padding: 0;
                    border: 0;
                    border-radius: 999px;
                    display: grid;
                    place-items: center;

                    color: currentColor;
                    background: color-mix(in srgb, currentColor 10%, transparent);
                    box-shadow: none;
                    opacity: .72;
                    cursor: pointer;
                }

                .${this.className}-close:hover {
                    opacity: 1;
                    transform: none;
                    box-shadow: none;
                }

                .${this.className}-success {
                    --lumina-toast-accent: #22c55e;
                    --lumina-toast-glow: rgba(34, 197, 94, .24);
                    --lumina-toast-glow-secondary: rgba(34, 211, 238, .16);
                }

                .${this.className}-error {
                    --lumina-toast-accent: #ef4444;
                    --lumina-toast-glow: rgba(239, 68, 68, .24);
                    --lumina-toast-glow-secondary: rgba(244, 114, 182, .16);
                }

                .${this.className}-warning {
                    --lumina-toast-accent: #f59e0b;
                    --lumina-toast-glow: rgba(245, 158, 11, .25);
                    --lumina-toast-glow-secondary: rgba(251, 191, 36, .16);
                }

                .${this.className}-info {
                    --lumina-toast-accent: #06b6d4;
                    --lumina-toast-glow: rgba(6, 182, 212, .24);
                    --lumina-toast-glow-secondary: rgba(167, 139, 250, .16);
                }

                @media (prefers-reduced-motion: reduce) {
                    .${this.className} {
                        opacity: 1;
                        transform: none;
                        transition: none;
                    }

                    .${this.className}.is-leaving {
                        opacity: 0;
                        transform: none;
                    }
                }
            `
        );

    }

}