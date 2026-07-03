// src/core/EventBus.ts

import type { LuminaEvents } from "./Events";

type Listener<T> = (payload: T) => void;

export class EventBus {

    private readonly listeners = new Map<
        keyof LuminaEvents,
        Set<Listener<unknown>>
    >();

    on<K extends keyof LuminaEvents>(
        event: K,
        listener: Listener<LuminaEvents[K]>
    ): () => void {

        const listeners =
            this.listeners.get(event) ??
            new Set<Listener<unknown>>();

        listeners.add(listener as Listener<unknown>);

        this.listeners.set(event, listeners);

        return () => this.off(event, listener);

    }

    once<K extends keyof LuminaEvents>(
        event: K,
        listener: Listener<LuminaEvents[K]>
    ): void {

        const unsubscribe = this.on(event, payload => {

            unsubscribe();

            listener(payload);

        });

    }

    off<K extends keyof LuminaEvents>(
        event: K,
        listener: Listener<LuminaEvents[K]>
    ): void {

        const listeners =
            this.listeners.get(event);

        if (!listeners) {
            return;
        }

        listeners.delete(
            listener as Listener<unknown>
        );

        if (listeners.size === 0) {
            this.listeners.delete(event);
        }

    }

    emit<K extends keyof LuminaEvents>(
        event: K,
        payload: LuminaEvents[K]
    ): void {

        const listeners =
            this.listeners.get(event);

        if (!listeners) {
            return;
        }

        for (const listener of listeners) {
            listener(payload);
        }

    }

    clear(): void {

        this.listeners.clear();

    }

}