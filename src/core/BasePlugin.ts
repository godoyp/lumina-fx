// src/core/BasePlugin.ts

import type { LuminaContext } from "./Context";
import type { LuminaEvents } from "./Events";
import type { LuminaModule, ModuleMetadata } from "./Module";

export abstract class BasePlugin implements LuminaModule {

    abstract readonly metadata: ModuleMetadata;

    private context?: LuminaContext;

    public async initialize(context: LuminaContext): Promise<void> {

        this.context = context;

        await this.onInitialize();

    }

    public async destroy(): Promise<void> {

        await this.onDestroy();

    }

    protected get logger() {

        return this.requireContext().logger;

    }

    protected get eventBus() {

        return this.requireContext().eventBus;

    }

    protected get config() {

        return this.requireContext().config;

    }

    protected get storage() {

        return this.requireContext().storage;

    }

    protected get dom() {

        return this.requireContext().dom;

    }

    protected getContext(): LuminaContext {

        return this.requireContext();

    }

    protected emit<Event extends keyof LuminaEvents>(
        event: Event,
        payload: LuminaEvents[Event]
    ): void {

        this.eventBus.emit(event, payload);

    }

    protected on<Event extends keyof LuminaEvents>(
        event: Event,
        listener: (
            payload: LuminaEvents[Event]
        ) => void
    ): () => void {

        return this.eventBus.on(event, listener);

    }

    protected once<Event extends keyof LuminaEvents>(
        event: Event,
        listener: (
            payload: LuminaEvents[Event]
        ) => void
    ): void {

        this.eventBus.once(event, listener);

    }

    protected abstract onInitialize(): void | Promise<void>;

    protected onDestroy(): void | Promise<void> {}

    private requireContext(): LuminaContext {

        if (!this.context) {

            throw new Error(
                `[Lumina] Plugin "${this.metadata.name}" has not been initialized.`
            );

        }

        return this.context;

    }

}