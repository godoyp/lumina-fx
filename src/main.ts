import { connectDemoActions, connectAmbientBackgroundToggle } from "./playground/connectDemoActions";
import { initializeLumina } from "./playground/initializeLumina";
import { injectPlaygroundStyles } from "./playground/styles";
import { createPlaygroundTemplate } from "./playground/template";


async function main(): Promise<void> {

    injectPlaygroundStyles();

    document.documentElement.setAttribute(
        "data-lumina-ambient-background",
        "constellation"
    );

    document.body.innerHTML =
        createPlaygroundTemplate();

    connectAmbientBackgroundToggle();

    const playground =
        await initializeLumina();

    connectDemoActions(
        playground
    );

}

main();