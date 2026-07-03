import type { LuminaConfig } from "./Config";
import { EventBus } from "./EventBus";
import type { Logger } from "../logger";
import type { StorageProvider } from "../storage";
import type { Dom } from "../dom";

export interface LuminaContext {

    readonly config: LuminaConfig;

    readonly eventBus: EventBus;

    readonly logger: Logger;

    readonly storage: StorageProvider;

    readonly dom: Dom;

}