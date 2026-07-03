// src/core/Module.ts

import type { LuminaContext } from "./Context";

export interface ModuleMetadata {

    name: string;

    version: string;

    description?: string;

    dependencies?: string[];

}

export interface LuminaModule {

    readonly metadata: ModuleMetadata;

    initialize(
        context: LuminaContext
    ): void | Promise<void>;

    destroy?(): void | Promise<void>;

}