import { connectDemoActions } from "./playground/connectDemoActions";
import { initializeLumina } from "./playground/initializeLumina";
import { injectPlaygroundStyles } from "./playground/styles";
import { createPlaygroundTemplate } from "./playground/template";


async function main(): Promise<void> {

    injectPlaygroundStyles();

    document.body.innerHTML =
        createPlaygroundTemplate();

    const playground =
        await initializeLumina();

    connectDemoActions(
        playground
    );

}

main();