import type { PlaygroundLumina } from "./initializeLumina";

export function connectDemoActions(
    playground: PlaygroundLumina
): void {

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target;

            if (!(target instanceof Element)) {
                return;
            }

            handleSimulateUpdate(
                target,
                playground
            );

            handlePulseHero(
                target,
                playground
            );

            handlePulseAll(
                target,
                playground
            );

            handleToastSuccess(
                target,
                playground
            );

            handleToastInfo(
                target,
                playground
            );

            handleToastError(
                target,
                playground
            );

        }
    );

}

function handleSimulateUpdate(
    target: Element,
    playground: PlaygroundLumina
): void {

    const button =
        target.closest<HTMLButtonElement>(
            "#simulate-update"
        );

    if (!button) {
        return;
    }

    const statusText =
        document.querySelector<HTMLElement>(
            "#status-text"
        );

    if (statusText) {

        statusText.textContent =
            `Atualizado em ${new Date().toLocaleTimeString()}`;

    }

    playground.toast.success(
        "Status atualizado com sucesso!"
    );

    playground.shimmer.pulse(
        "[data-status-refresh-surface]"
    );

}

function handlePulseHero(
    target: Element,
    playground: PlaygroundLumina
): void {

    const button =
        target.closest<HTMLButtonElement>(
            "#pulse-hero"
        );

    if (!button) {
        return;
    }

    playground.shimmer.pulse(
        "#hero-preview"
    );

    playground.toast.success(
        "Preview atualizado!"
    );

}

function handlePulseAll(
    target: Element,
    playground: PlaygroundLumina
): void {

    const button =
        target.closest<HTMLButtonElement>(
            "#pulse-all"
        );

    if (!button) {
        return;
    }

    const statusText =
        document.querySelector<HTMLElement>(
            "#status-text"
        );

    if (statusText) {

        statusText.textContent =
            `Atualização geral em ${new Date().toLocaleTimeString()}`;

    }

    playground.shimmer.pulseAll(
        "[data-refresh-surface]"
    );

    playground.shimmer.pulse(
        "[data-status-refresh-surface]"
    );

    playground.toast.info(
        "Atualização geral executada."
    );

}

function handleToastSuccess(
    target: Element,
    playground: PlaygroundLumina
): void {

    const button =
        target.closest<HTMLButtonElement>(
            "#demo-toast-success"
        );

    if (!button) {
        return;
    }

    playground.toast.success(
        "Operação concluída com sucesso!"
    );

}

function handleToastInfo(
    target: Element,
    playground: PlaygroundLumina
): void {

    const button =
        target.closest<HTMLButtonElement>(
            "#demo-toast-info"
        );

    if (!button) {
        return;
    }

    playground.toast.info(
        "Operação concluída com sucesso!"
    );

}

function handleToastError(
    target: Element,
    playground: PlaygroundLumina
): void {

    const button =
        target.closest<HTMLButtonElement>(
            "#demo-toast-error"
        );

    if (!button) {
        return;
    }

    playground.toast.error(
        "Não foi possível concluir a operação."
    );

}

export type AmbientBackground =
    | "constellation"
    | "storm";

type WindowWithAmbientHandler =
    Window & {
        __luminaAmbientBackgroundHandler?: EventListener;
    };

export function connectAmbientBackgroundToggle(): void {

    const button =
        document.querySelector<HTMLButtonElement>(
            "#toggle-ambient-background"
        );

    if (!button) {
        return;
    }

    const root =
        document.documentElement;

    const applyBackground =
        (
            background: AmbientBackground
        ): void => {

            root.setAttribute(
                "data-lumina-ambient-background",
                background
            );

            const isConstellation =
                background === "constellation";

            button.textContent =
                isConstellation
                    ? "Background: Constellation"
                    : "Background: Storm";

            button.setAttribute(
                "aria-label",
                isConstellation
                    ? "Alternar background para Storm"
                    : "Alternar background para Constellation"
            );

        };

    const getCurrentBackground =
        (): AmbientBackground => {

            return root.getAttribute(
                "data-lumina-ambient-background"
            ) === "storm"
                ? "storm"
                : "constellation";

        };

    applyBackground(
        getCurrentBackground()
    );

    const windowWithHandler =
        window as WindowWithAmbientHandler;

    if (windowWithHandler.__luminaAmbientBackgroundHandler) {

        document.removeEventListener(
            "click",
            windowWithHandler.__luminaAmbientBackgroundHandler,
            true
        );

    }

    const handler =
        (event: Event): void => {

            if (!(event.target instanceof Element)) {
                return;
            }

            const trigger =
                event.target.closest<HTMLButtonElement>(
                    "#toggle-ambient-background"
                );

            if (!trigger) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            const currentBackground =
                getCurrentBackground();

            applyBackground(
                currentBackground === "constellation"
                    ? "storm"
                    : "constellation"
            );

        };

    windowWithHandler.__luminaAmbientBackgroundHandler =
        handler;

    document.addEventListener(
        "click",
        handler,
        true
    );

}