// src/logger/ConsoleLogger.ts

import type { Logger } from "./Logger";

export class ConsoleLogger implements Logger {

    private readonly enabled: boolean;

    constructor(enabled = false) {

        this.enabled = enabled;

    }

    debug(message: string): void {

        if (!this.enabled) {
            return;
        }

        console.debug(message);

    }

    info(message: string): void {

        if (!this.enabled) {
            return;
        }

        console.info(message);

    }

    warn(message: string): void {

        if (!this.enabled) {
            return;
        }

        console.warn(message);

    }

    error(message: string): void {

        console.error(message);

    }

}