// src/storage/MemoryStorageProvider.ts

import type { StorageProvider } from "./StorageProvider";

export class MemoryStorageProvider implements StorageProvider {

    private readonly storage =
        new Map<string, unknown>();

    get<T>(key: string): T | null {

        const value =
            this.storage.get(key);

        return value === undefined
            ? null
            : (value as T);

    }

    set<T>(key: string, value: T): void {

        this.storage.set(key, value);

    }

    remove(key: string): void {

        this.storage.delete(key);

    }

    clear(): void {

        this.storage.clear();

    }

    has(key: string): boolean {

        return this.storage.has(key);

    }

}