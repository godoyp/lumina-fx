// src/core/PluginManager.ts

import type { LuminaModule } from "./Module";

export class PluginManager {

    private readonly plugins = new Map<string, LuminaModule>();

    register(plugin: LuminaModule): void {

        const { name } = plugin.metadata;

        if (this.plugins.has(name)) {
            throw new Error(
                `[Lumina] Plugin "${name}" is already registered.`
            );
        }

        this.plugins.set(name, plugin);

    }

    has(name: string): boolean {

        return this.plugins.has(name);

    }

    get(name: string): LuminaModule | undefined {

        return this.plugins.get(name);

    }

    *values(): IterableIterator<LuminaModule> {

        yield* this.plugins.values();

    }

    remove(name: string): boolean {

        return this.plugins.delete(name);

    }

    clear(): void {

        this.plugins.clear();

    }

    get size(): number {

        return this.plugins.size;

    }

}