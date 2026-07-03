// src/dom/BrowserDom.ts

import type {
    ColorSchemeListener,
    Dom,
    ElementPointerPosition,
    LuminaAnimationOptions,
    LuminaViewTransition,
    ViewportPoint,
    ViewportSize
} from "./Dom";


interface DocumentWithOptionalViewTransition {

    startViewTransition?: (
        callback: () => void
    ) => LuminaViewTransition;

}

export class BrowserDom implements Dom {

    root(): HTMLElement {

        return document.documentElement;

    }

    body(): HTMLBodyElement {

        return document.body as HTMLBodyElement;

    }

    find<T extends Element = HTMLElement>(
        selector: string
    ): T | null {

        return document.querySelector<T>(selector);

    }

    findAll<T extends Element = HTMLElement>(
        selector: string
    ): T[] {

        return [...document.querySelectorAll<T>(selector)];

    }

    listen<K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        event: K,
        listener: (
            event: HTMLElementEventMap[K]
        ) => void
    ): () => void {

        element.addEventListener(
            event,
            listener
        );

        return () => {

            element.removeEventListener(
                event,
                listener
            );

        };

    }

    listenDocument<K extends keyof DocumentEventMap>(
        event: K,
        listener: (
            event: DocumentEventMap[K]
        ) => void
    ): () => void {

        document.addEventListener(
            event,
            listener
        );

        return () => {

            document.removeEventListener(
                event,
                listener
            );

        };

    }

    addClass(
        element: Element,
        className: string
    ): void {

        element.classList.add(className);

    }

    removeClass(
        element: Element,
        className: string
    ): void {

        element.classList.remove(className);

    }

    hasClass(
        element: Element,
        className: string
    ): boolean {

        return element.classList.contains(className);

    }

    data(
        element: HTMLElement,
        name: string,
        value?: string
    ): string | null | void {

        if (value !== undefined) {

            element.dataset[name] = value;

            return;

        }

        return element.dataset[name] ?? null;

    }

    css(
        name: string,
        value?: string
    ): string | void {

        const root = this.root();

        if (value !== undefined) {

            root.style.setProperty(
                name,
                value
            );

            return;

        }

        return getComputedStyle(root)
            .getPropertyValue(name);

    }

    style(
        element: HTMLElement,
        name: string,
        value?: string
    ): string | void {

        if (value !== undefined) {

            element.style.setProperty(
                name,
                value
            );

            return;

        }

        return getComputedStyle(element)
            .getPropertyValue(name);

    }

    removeCss(
        name: string
    ): void {

        this.root().style.removeProperty(name);

    }

    injectStyle(
        id: string,
        css: string
    ): void {

        const existingStyle =
            document.getElementById(id);

        if (existingStyle instanceof HTMLStyleElement) {

            existingStyle.textContent = css;

            return;

        }

        const style =
            document.createElement("style");

        style.id = id;
        style.textContent = css;

        document.head.appendChild(style);

    }

    removeStyle(
        id: string
    ): void {

        document
            .getElementById(id)
            ?.remove();

    }

    viewport(): ViewportSize {

        return {
            width: window.innerWidth,
            height: window.innerHeight
        };

    }

    elementCenterPercent(
        element: Element
    ): ViewportPoint {

        const rect = element.getBoundingClientRect();
        const viewport = this.viewport();

        return {
            x: ((rect.left + rect.width / 2) / viewport.width) * 100,
            y: ((rect.top + rect.height / 2) / viewport.height) * 100
        };

    }

    prefersDarkColorScheme(): boolean {

        return window
            .matchMedia("(prefers-color-scheme: dark)")
            .matches;

    }

    startViewTransition(
        callback: () => void
    ): LuminaViewTransition | null {

        const doc =
            document as DocumentWithOptionalViewTransition;

        if (!doc.startViewTransition) {
            return null;
        }

        return doc.startViewTransition(callback);

    }

    onSystemColorSchemeChange(
        listener: ColorSchemeListener
    ): () => void {

        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );

        const handler = (
            event: MediaQueryListEvent
        ): void => {

            listener(event.matches);

        };

        mediaQuery.addEventListener(
            "change",
            handler
        );

        return () => {

            mediaQuery.removeEventListener(
                "change",
                handler
            );

        };

    }

    attr(
        element: Element,
        name: string,
        value?: string
    ): string | null | void {

        if (value !== undefined) {

            element.setAttribute(
                name,
                value
            );

            return;

        }

        return element.getAttribute(name);

    }

    removeAttr(
        element: Element,
        name: string
    ): void {

        element.removeAttribute(name);

    }

    contains(
        element: Element,
        target: EventTarget | null
    ): boolean {

        if (!(target instanceof Node)) {
            return false;
        }

        return element.contains(target);

    }

    pointerFromEvent(
        event: MouseEvent
    ): ViewportPoint {

        return {
            x: event.clientX,
            y: event.clientY
        };

    }

    animateRoot(
        keyframes: Keyframe[] | PropertyIndexedKeyframes,
        options: LuminaAnimationOptions
    ): Animation {

        return this.root()
            .animate(
                keyframes,
                options
            );

    }

    pointerWithinElement(
        element: Element,
        event: MouseEvent
    ): ElementPointerPosition {

        const rect =
            element.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

    }

}