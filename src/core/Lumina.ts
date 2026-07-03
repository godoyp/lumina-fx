import type { LuminaConfig } from "./Config";
import type { LuminaContext } from "./Context";
import { EventBus } from "./EventBus";
import { PluginManager } from "./PluginManager";
import type { LuminaModule } from "./Module";
import { ConsoleLogger } from "../logger";
import { LocalStorageProvider } from "../storage";
import { BrowserDom } from "../dom";

export class Lumina {

    private readonly config: LuminaConfig;

    private readonly eventBus: EventBus;

    private readonly pluginManager: PluginManager;

    private readonly logger: ConsoleLogger;

    private readonly storage: LocalStorageProvider;

    private readonly dom: BrowserDom;

    private readonly context: LuminaContext;

    private constructor(config: LuminaConfig = {}) {

        this.config = config;

        this.eventBus = new EventBus();

        this.pluginManager = new PluginManager();

        this.logger = new ConsoleLogger(this.config.debug);

        this.storage = new LocalStorageProvider();

        this.dom = new BrowserDom();

        this.context = {

            config: this.config,

            eventBus: this.eventBus,

            logger: this.logger,

            storage: this.storage,

            dom: this.dom,


        };

    }

    static create(config: LuminaConfig = {}): Lumina {

        return new Lumina(config);

    }

    use(plugin: LuminaModule): this {

        this.pluginManager.register(plugin);

        return this;

    }

    async start(): Promise<void> {

        if (this.config.debug) {

            this.logger.info("[Lumina] Starting...");

        }

        for (const plugin of this.pluginManager.values()) {

            if (this.config.debug) {

                this.logger.info(
                    `[Lumina] Loading "${plugin.metadata.name}"`
                );

            }

            try {

                await plugin.initialize(this.context);

            }
            catch (error) {

                this.logger.error(

                    `Plugin "${plugin.metadata.name}" failed to initialize.`

                );

                throw error;

            }

        }

        this.eventBus.emit("lumina:ready", undefined);

        if (this.config.debug) {

            this.logger.info("[Lumina] Ready");

        }

    }

    async destroy(): Promise<void> {

        for (const plugin of this.pluginManager.values()) {

            await plugin.destroy?.();

        }

        this.pluginManager.clear();

        this.eventBus.clear();

    }

}