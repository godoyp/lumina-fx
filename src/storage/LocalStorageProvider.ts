// src/storage/LocalStorageProvider.ts

import type { StorageProvider } from "./StorageProvider";

export class LocalStorageProvider implements StorageProvider {

    get<T>(key: string): T | null {

        const value = localStorage.getItem(key);

        if (value === null) {
            return null;
        }

        try {

            return JSON.parse(value) as T;

        } catch {

            return value as T;

        }

    }

    set<T>(key: string, value: T): void {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }

    remove(key: string): void {

        localStorage.removeItem(key);

    }

    clear(): void {

        localStorage.clear();

    }

    has(key: string): boolean {

        return localStorage.getItem(key) !== null;

    }

}