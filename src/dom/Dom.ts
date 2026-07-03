export interface LuminaViewTransition {

    readonly ready: Promise<void>;

    readonly finished: Promise<void>;

}

export interface ViewportSize {

    readonly width: number;

    readonly height: number;

}

export interface ViewportPoint {

    readonly x: number;

    readonly y: number;

}

export type ColorSchemeListener = (
    prefersDark: boolean
) => void;

export interface LuminaAnimationOptions
    extends KeyframeAnimationOptions {

    pseudoElement?: string;

}

export interface ElementPointerPosition {

    readonly x: number;

    readonly y: number;

}

export interface Dom {

    root(): HTMLElement;

    body(): HTMLBodyElement;

    find<T extends Element = HTMLElement>(
        selector: string
    ): T | null;

    findAll<T extends Element = HTMLElement>(
        selector: string
    ): T[];

    listen<K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        event: K,
        listener: (
            event: HTMLElementEventMap[K]
        ) => void
    ): () => void;

    listenDocument<K extends keyof DocumentEventMap>(
        event: K,
        listener: (
            event: DocumentEventMap[K]
        ) => void
    ): () => void;

    addClass(
        element: Element,
        className: string
    ): void;

    removeClass(
        element: Element,
        className: string
    ): void;

    hasClass(
        element: Element,
        className: string
    ): boolean;

    attr(
        element: Element,
        name: string,
        value?: string
    ): string | null | void;

    removeAttr(
        element: Element,
        name: string
    ): void;

    data(
        element: HTMLElement,
        name: string,
        value?: string
    ): string | null | void;

    css(
        name: string,
        value?: string
    ): string | void;

    style(
        element: HTMLElement,
        name: string,
        value?: string
    ): string | void;

    removeCss(
        name: string
    ): void;

    injectStyle(
        id: string,
        css: string
    ): void;

    removeStyle(
        id: string
    ): void;

    viewport(): ViewportSize;

    pointerFromEvent(
        event: MouseEvent
    ): ViewportPoint;

    elementCenterPercent(
        element: Element
    ): ViewportPoint;

    contains(
        element: Element,
        target: EventTarget | null
    ): boolean;

    prefersDarkColorScheme(): boolean;

    onSystemColorSchemeChange(
        listener: ColorSchemeListener
    ): () => void;

    animateRoot(
        keyframes: Keyframe[] | PropertyIndexedKeyframes,
        options: LuminaAnimationOptions
    ): Animation;

    startViewTransition(
        callback: () => void
    ): LuminaViewTransition | null;

    pointerWithinElement(
        element: Element,
        event: MouseEvent
    ): ElementPointerPosition;

}