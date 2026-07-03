import { BasePlugin } from "../core";

export class TestPlugin extends BasePlugin {

    readonly metadata = {

        name: "test",

        version: "1.0.0"

    };

    protected onInitialize(): void {

        const root = this.dom.root();

        this.dom.data(
            root,
            "lumina",
            "v2"
        );

        this.dom.css(
            "--lumina-test",
            "red"
        );

        this.logger.info(
            "DOM funcionando."
        );

    }

}