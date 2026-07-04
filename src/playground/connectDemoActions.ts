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

            handleCascadeDemoToggle(
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
            `Updated at ${new Date().toLocaleTimeString()}`;

    }

    playground.toast.success(
        "Status updated successfully!"
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
        "Preview updated!"
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
        "Operation completed successfully!"
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
        "Operation completed successfully!"
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
        "The operation could not be completed."
    );

}

function handleCascadeDemoToggle(
    target: Element,
    playground: PlaygroundLumina
): void {

    const button =
        target.closest<HTMLButtonElement>(
            "#toggle-cascade-demo"
        );

    if (!button) {
        return;
    }

    const list =
        document.querySelector<HTMLElement>(
            "#cascade-demo-list"
        );

    if (!list) {
        return;
    }

    const items =
        Array.from(
            list.querySelectorAll<HTMLElement>(
                "[data-lumina-cascade-item]"
            )
        );

    const isHidden =
        list.classList.contains(
            "is-cascade-demo-hidden"
        );

    if (isHidden) {

        list.classList.remove(
            "is-cascade-demo-hidden"
        );

        button.textContent =
            "Hide items";

        button.setAttribute(
            "aria-expanded",
            "true"
        );

        items.forEach(
            item => {

                item.classList.remove(
                    "is-cascade-visible"
                );

            }
        );

        window.setTimeout(
            () => {

                items.forEach(
                    (item, index) => {

                        window.setTimeout(
                            () => {

                                item.classList.add(
                                    "is-cascade-visible"
                                );

                            },
                            index * 90
                        );

                    }
                );

            },
            40
        );

        playground.toast.info(
            "Items displayed in a cascade."
        );

        return;

    }

    list.classList.add(
        "is-cascade-demo-hidden"
    );

    button.textContent =
        "Show items";

    button.setAttribute(
        "aria-expanded",
        "false"
    );

    items.forEach(
        item => {

            item.classList.remove(
                "is-cascade-visible"
            );

        }
    );

    playground.toast.info(
        "Hidden items."
    );

}
