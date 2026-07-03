export type LuminaTheme =
    | "light"
    | "dark";

export type ToastType =
    | "success"
    | "error"
    | "info"
    | "warning";

export interface DropdownEventPayload {

    id: string;

    trigger: HTMLElement;

    menu: HTMLElement;

}

export interface PasswordVisibilityEventPayload {

    input: HTMLInputElement;

    trigger: HTMLElement;

    visible: boolean;

}

export interface ShimmerEventPayload {

    element: HTMLElement;

}

export interface SpotlightEventPayload {

    element: HTMLElement;

}

export interface CascadeEventPayload {

    element: HTMLElement;

    index: number;

}

export interface ToastEventPayload {

    id: string;

    type: ToastType;

    message: string;

}

export interface TooltipEventPayload {

    trigger: HTMLElement;

    tooltip: HTMLElement;

    text: string;

}

export interface SwitchEventPayload {

    container: HTMLElement;

    previousPanel: HTMLElement | null;

    currentPanel: HTMLElement;

    previous: string | null;

    current: string;

}

export interface TransitionEventPayload {

    url: string;

    trigger: HTMLElement | null;

}

export interface ConstellationEventPayload {

    container: HTMLElement;

    canvas: HTMLCanvasElement;

}

export interface StormEventPayload {

    container: HTMLElement;

    canvas: HTMLCanvasElement;

}

export interface LuminaEvents {

    "lumina:ready": void;

    "theme:changed": {
        theme: LuminaTheme;
        previousTheme: LuminaTheme | null;
    };

    "dropdown:open": DropdownEventPayload;

    "dropdown:close": DropdownEventPayload;

    "password:show": PasswordVisibilityEventPayload;

    "password:hide": PasswordVisibilityEventPayload;

    "password:toggle": PasswordVisibilityEventPayload;

    "shimmer:start": ShimmerEventPayload;

    "shimmer:end": ShimmerEventPayload;

    "spotlight:enter": SpotlightEventPayload;

    "spotlight:move": SpotlightEventPayload;

    "spotlight:leave": SpotlightEventPayload;

    "cascade:show": CascadeEventPayload;

    "cascade:hide": CascadeEventPayload;

    "toast:show": ToastEventPayload;

    "toast:hide": ToastEventPayload;

    "tooltip:show": TooltipEventPayload;

    "tooltip:hide": TooltipEventPayload;

    "switch:before": SwitchEventPayload;

    "switch:after": SwitchEventPayload;

    "transition:start": TransitionEventPayload;

    "transition:end": TransitionEventPayload;

    "constellation:start": ConstellationEventPayload;

    "constellation:stop": ConstellationEventPayload;

    "storm:start": StormEventPayload;

    "storm:stop": StormEventPayload;

}