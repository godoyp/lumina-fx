import { BasePlugin } from "../../core";

export type ConstellationDensity =
    | "low"
    | "medium"
    | "high";

export type ConstellationColor =
    | "auto"
    | string;

export type ConstellationMode =
    | "contained"
    | "background";

export interface ConstellationPluginOptions {

    selector?: string;

    className?: string;

    mode?: ConstellationMode;

    density?: ConstellationDensity;

    color?: ConstellationColor;

    lineColor?: ConstellationColor;

    speed?: number;

    radius?: number;

    connectDistance?: number;

    interactive?: boolean;

    mouseRadius?: number;

    opacity?: number;

    lineOpacity?: number;

}

interface ConstellationPoint {

    x: number;

    y: number;

    vx: number;

    vy: number;

    radius: number;

}

interface ConstellationInstance {

    container: HTMLElement;

    canvas: HTMLCanvasElement;

    context: CanvasRenderingContext2D;

    points: ConstellationPoint[];

    width: number;

    height: number;

    mode: ConstellationMode;

    animationFrame: number | null;

    resizeFrame: number | null;

    resizeObserver: ResizeObserver | null;

    mouseX: number | null;

    mouseY: number | null;

    isFrozen: boolean;

}

interface ConstellationListener {

    element: HTMLElement | Window;

    type: string;

    listener: EventListener;

}

export class ConstellationPlugin extends BasePlugin {

    readonly metadata = {
        name: "constellation",
        version: "1.0.0",
        description: "Renders connected particles on a canvas as a background or within containers."
    };

    private readonly selector: string;

    private readonly className: string;

    private readonly mode: ConstellationMode;

    private readonly density: ConstellationDensity;

    private readonly color: ConstellationColor;

    private readonly lineColor: ConstellationColor;

    private readonly speed: number;

    private readonly radius: number;

    private readonly connectDistance: number;

    private readonly interactive: boolean;

    private readonly mouseRadius: number;

    private readonly opacity: number;

    private readonly lineOpacity: number;

    private isReducedMotionActive(): boolean {

        return document.documentElement.dataset.luminaReducedMotion === "true";

    }

    private readonly instances =
        new Map<HTMLElement, ConstellationInstance>();

    private readonly listeners: ConstellationListener[] =
        [];

    constructor(options: ConstellationPluginOptions = {}) {

        super();

        this.selector =
            options.selector ??
            "[data-lumina-constellation]";

        this.className =
            options.className ??
            "lumina-constellation";

        this.mode =
            options.mode ??
            "contained";

        this.density =
            options.density ??
            "medium";

        this.color =
            options.color ??
            "auto";

        this.lineColor =
            options.lineColor ??
            "auto";

        this.speed =
            options.speed ??
            0.35;

        this.radius =
            options.radius ??
            1.7;

        this.connectDistance =
            options.connectDistance ??
            130;

        this.interactive =
            options.interactive ??
            true;

        this.mouseRadius =
            options.mouseRadius ??
            160;

        this.opacity =
            options.opacity ??
            0.9;

        this.lineOpacity =
            options.lineOpacity ??
            0.28;

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.collectContainers();

        this.logger.info(
            `[Lumina Constellation] Initialized ${this.instances.size} instance(s).`
        );

    }

    protected async onDestroy(): Promise<void> {

        for (const listener of this.listeners) {

            listener.element.removeEventListener(
                listener.type,
                listener.listener
            );

        }

        this.listeners.length =
            0;

        for (const instance of this.instances.values()) {

            this.destroyInstance(instance);

        }

        this.instances.clear();

    }

    refresh(): void {

        for (const listener of this.listeners) {

            listener.element.removeEventListener(
                listener.type,
                listener.listener
            );

        }

        this.listeners.length =
            0;

        for (const instance of this.instances.values()) {

            this.destroyInstance(instance);

        }

        this.instances.clear();

        this.collectContainers();

    }

    private collectContainers(): void {

        const containers =
            this.dom.findAll<HTMLElement>(
                this.selector
            );

        for (const container of containers) {

            this.createInstance(container);

        }

    }

    private createInstance(
        container: HTMLElement
    ): void {

        if (this.instances.has(container)) {
            return;
        }

        const canvas =
            document.createElement("canvas");

        const context =
            canvas.getContext("2d");

        if (!context) {
            return;
        }

        const mode =
            this.resolveMode(container);

        this.prepareContainer(
            container,
            mode
        );

        this.dom.addClass(
            container,
            this.className
        );

        this.dom.addClass(
            container,
            `${this.className}-${mode}`
        );

        this.dom.addClass(
            canvas,
            `${this.className}-canvas`
        );

        this.prepareCanvas(canvas);

        container.prepend(canvas);

        const instance: ConstellationInstance = {
            container,
            canvas,
            context,
            points: [],
            width: 0,
            height: 0,
            mode,
            animationFrame: null,
            resizeFrame: null,
            resizeObserver: null,
            mouseX: null,
            mouseY: null,
            isFrozen: false
        };

        this.instances.set(
            container,
            instance
        );

        this.resizeInstance(instance);

        instance.points =
            this.createPoints(instance);

        this.bindResize(instance);

        if (this.interactive) {

            this.bindPointerEvents(instance);

        }

        this.startInstance(instance);

        this.emit(
            "constellation:start",
            {
                container,
                canvas
            }
        );

    }

    private prepareContainer(
        container: HTMLElement,
        mode: ConstellationMode
    ): void {

        if (mode !== "contained") {
            return;
        }

        const position =
            getComputedStyle(container).position;

        if (position === "static") {

            container.style.position =
                "relative";

        }

        container.style.overflow =
            "hidden";

    }

    private prepareCanvas(
        canvas: HTMLCanvasElement
    ): void {

        canvas.setAttribute(
            "aria-hidden",
            "true"
        );

        canvas.style.position =
            "absolute";

        canvas.style.inset =
            "0";

        canvas.style.zIndex =
            "1";

        canvas.style.display =
            "block";

        canvas.style.width =
            "100%";

        canvas.style.height =
            "100%";

        canvas.style.maxWidth =
            "none";

        canvas.style.maxHeight =
            "none";

        canvas.style.pointerEvents =
            "none";

        canvas.style.contain =
            "strict";

    }

    private resolveMode(
        container: HTMLElement
    ): ConstellationMode {

        const mode =
            container.dataset.luminaConstellationMode;

        if (mode === "background") {
            return "background";
        }

        if (mode === "contained") {
            return "contained";
        }

        return this.mode;

    }

    private bindResize(
        instance: ConstellationInstance
    ): void {

        if (instance.mode === "background") {

            const listener =
                (): void => {

                    this.requestResize(instance);

                };

            window.addEventListener(
                "resize",
                listener
            );

            this.listeners.push({
                element: window,
                type: "resize",
                listener
            });

            return;

        }

        const resizeObserver =
            new ResizeObserver(
                () => {

                    this.requestResize(instance);

                }
            );

        resizeObserver.observe(
            instance.container
        );

        instance.resizeObserver =
            resizeObserver;

    }

    private bindPointerEvents(
        instance: ConstellationInstance
    ): void {

        const target =
            instance.mode === "background"
                ? window
                : instance.container;

        const move =
            (event: Event): void => {

                if (!(event instanceof PointerEvent)) {
                    return;
                }

                const rect =
                    instance.canvas.getBoundingClientRect();

                instance.mouseX =
                    event.clientX - rect.left;

                instance.mouseY =
                    event.clientY - rect.top;

            };

        const leave =
            (): void => {

                instance.mouseX =
                    null;

                instance.mouseY =
                    null;

            };

        target.addEventListener(
            "pointermove",
            move
        );

        target.addEventListener(
            "pointerleave",
            leave
        );

        this.listeners.push(
            {
                element: target,
                type: "pointermove",
                listener: move
            },
            {
                element: target,
                type: "pointerleave",
                listener: leave
            }
        );

    }

    private requestResize(
        instance: ConstellationInstance
    ): void {

        if (instance.resizeFrame !== null) {
            return;
        }

        instance.resizeFrame =
            requestAnimationFrame(
                () => {

                    instance.resizeFrame =
                        null;

                    const changed =
                        this.resizeInstance(instance);

                    if (changed) {

                        instance.points =
                            this.createPoints(instance);

                    }

                }
            );

    }

    private resizeInstance(
        instance: ConstellationInstance
    ): boolean {

        const size =
            this.resolveSize(instance);

        if (
            size.width === instance.width &&
            size.height === instance.height
        ) {
            return false;
        }

        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        instance.width =
            size.width;

        instance.height =
            size.height;

        instance.canvas.width =
            Math.floor(
                size.width * pixelRatio
            );

        instance.canvas.height =
            Math.floor(
                size.height * pixelRatio
            );

        instance.canvas.style.width =
            "100%";

        instance.canvas.style.height =
            "100%";

        instance.context.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        return true;

    }

    private resolveSize(
        instance: ConstellationInstance
    ): {
        width: number;
        height: number;
    } {

        if (instance.mode === "background") {

            return {
                width:
                    Math.max(
                        1,
                        Math.floor(window.innerWidth)
                    ),
                height:
                    Math.max(
                        1,
                        Math.floor(window.innerHeight)
                    )
            };

        }

        const rect =
            instance.container.getBoundingClientRect();

        return {
            width:
                Math.max(
                    1,
                    Math.floor(rect.width)
                ),
            height:
                Math.max(
                    1,
                    Math.floor(rect.height)
                )
        };

    }

    private createPoints(
        instance: ConstellationInstance
    ): ConstellationPoint[] {

        const area =
            instance.width * instance.height;

        const densityFactor =
            this.resolveDensityFactor();

        const count =
            Math.max(
                14,
                Math.round(
                    area / densityFactor
                )
            );

        return Array.from(
            {
                length: count
            },
            () => this.createPoint(instance)
        );

    }

    private createPoint(
        instance: ConstellationInstance
    ): ConstellationPoint {

        const angle =
            Math.random() * Math.PI * 2;

        const velocity =
            this.speed * (
                0.45 + Math.random() * 0.75
            );

        return {
            x:
                Math.random() * instance.width,
            y:
                Math.random() * instance.height,
            vx:
                Math.cos(angle) * velocity,
            vy:
                Math.sin(angle) * velocity,
            radius:
                this.radius * (
                    0.7 + Math.random() * 0.8
                )
        };

    }

    private resolveDensityFactor(): number {

        if (this.density === "low") {
            return 22000;
        }

        if (this.density === "high") {
            return 9000;
        }

        return 14000;

    }

    private startInstance(
        instance: ConstellationInstance
    ): void {

        const tick =
            (): void => {

                if (this.isReducedMotionActive()) {

                    if (!instance.isFrozen) {

                        this.render(instance);

                        instance.isFrozen =
                            true;

                    }

                    instance.animationFrame =
                        requestAnimationFrame(tick);

                    return;

                }

                instance.isFrozen =
                    false;

                this.update(instance);

                this.render(instance);

                instance.animationFrame =
                    requestAnimationFrame(tick);

            };

        tick();

    }

    private stopInstance(
        instance: ConstellationInstance
    ): void {

        if (instance.animationFrame === null) {
            return;
        }

        cancelAnimationFrame(
            instance.animationFrame
        );

        instance.animationFrame =
            null;

        this.emit(
            "constellation:stop",
            {
                container: instance.container,
                canvas: instance.canvas
            }
        );

    }

    private destroyInstance(
        instance: ConstellationInstance
    ): void {

        this.stopInstance(instance);

        if (instance.resizeFrame !== null) {

            cancelAnimationFrame(
                instance.resizeFrame
            );

            instance.resizeFrame =
                null;

        }

        instance.resizeObserver?.disconnect();

        instance.canvas.remove();

        this.dom.removeClass(
            instance.container,
            this.className
        );

        this.dom.removeClass(
            instance.container,
            `${this.className}-contained`
        );

        this.dom.removeClass(
            instance.container,
            `${this.className}-background`
        );

    }

    private update(
        instance: ConstellationInstance
    ): void {

        for (const point of instance.points) {

            point.x +=
                point.vx;

            point.y +=
                point.vy;

            if (
                point.x <= 0 ||
                point.x >= instance.width
            ) {

                point.vx *=
                    -1;

            }

            if (
                point.y <= 0 ||
                point.y >= instance.height
            ) {

                point.vy *=
                    -1;

            }

            point.x =
                this.clamp(
                    point.x,
                    0,
                    instance.width
                );

            point.y =
                this.clamp(
                    point.y,
                    0,
                    instance.height
                );

        }

    }

    private render(
        instance: ConstellationInstance
    ): void {

        const context =
            instance.context;

        context.clearRect(
            0,
            0,
            instance.width,
            instance.height
        );

        const pointColor =
            this.resolvePointColor(instance.container);

        const lineColor =
            this.resolveLineColor(instance.container);

        this.renderLines(
            instance,
            lineColor
        );

        this.renderMouseLines(
            instance,
            lineColor
        );

        this.renderPoints(
            instance,
            pointColor
        );

    }

    private renderPoints(
        instance: ConstellationInstance,
        color: string
    ): void {

        const context =
            instance.context;

        context.save();

        context.fillStyle =
            color;

        context.globalAlpha =
            this.opacity;

        for (const point of instance.points) {

            context.beginPath();

            context.arc(
                point.x,
                point.y,
                point.radius,
                0,
                Math.PI * 2
            );

            context.fill();

        }

        context.restore();

    }

    private renderLines(
        instance: ConstellationInstance,
        color: string
    ): void {

        const context =
            instance.context;

        context.save();

        context.strokeStyle =
            color;

        context.lineWidth =
            1;

        const points =
            instance.points;

        for (let i = 0; i < points.length; i++) {

            for (let j = i + 1; j < points.length; j++) {

                const first =
                    points[i];

                const second =
                    points[j];

                const distance =
                    this.distance(
                        first.x,
                        first.y,
                        second.x,
                        second.y
                    );

                if (distance > this.connectDistance) {
                    continue;
                }

                context.globalAlpha =
                    this.lineOpacity *
                    (
                        1 -
                        distance / this.connectDistance
                    );

                context.beginPath();

                context.moveTo(
                    first.x,
                    first.y
                );

                context.lineTo(
                    second.x,
                    second.y
                );

                context.stroke();

            }

        }

        context.restore();

    }

    private renderMouseLines(
        instance: ConstellationInstance,
        color: string
    ): void {

        if (
            instance.mouseX === null ||
            instance.mouseY === null
        ) {
            return;
        }

        const context =
            instance.context;

        context.save();

        context.strokeStyle =
            color;

        context.lineWidth =
            1;

        for (const point of instance.points) {

            const distance =
                this.distance(
                    point.x,
                    point.y,
                    instance.mouseX,
                    instance.mouseY
                );

            if (distance > this.mouseRadius) {
                continue;
            }

            context.globalAlpha =
                this.lineOpacity *
                1.7 *
                (
                    1 -
                    distance / this.mouseRadius
                );

            context.beginPath();

            context.moveTo(
                point.x,
                point.y
            );

            context.lineTo(
                instance.mouseX,
                instance.mouseY
            );

            context.stroke();

        }

        context.restore();

    }

    private resolvePointColor(
        container: HTMLElement
    ): string {

        if (this.color !== "auto") {
            return this.color;
        }

        return getComputedStyle(container)
            .getPropertyValue(
                "--lumina-constellation-color"
            )
            .trim() ||
            "rgba(226, 232, 240, 0.82)";

    }

    private resolveLineColor(
        container: HTMLElement
    ): string {

        if (this.lineColor !== "auto") {
            return this.lineColor;
        }

        return getComputedStyle(container)
            .getPropertyValue(
                "--lumina-constellation-line-color"
            )
            .trim() ||
            "rgba(167, 139, 250, 0.34)";

    }

    private distance(
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): number {

        const dx =
            x1 - x2;

        const dy =
            y1 - y2;

        return Math.sqrt(
            dx * dx +
            dy * dy
        );

    }

    private clamp(
        value: number,
        min: number,
        max: number
    ): number {

        return Math.min(
            Math.max(
                value,
                min
            ),
            max
        );

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-constellation-style",
            `
                .${this.className} {
                    isolation: isolate;
                }

                .${this.className}-contained {
                    position: relative;
                    overflow: hidden;
                }

                .${this.className}-background {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    pointer-events: none;
                }

                .${this.className}-canvas {
                    position: absolute !important;
                    inset: 0 !important;
                    z-index: 1;
                    display: block;
                    width: 100% !important;
                    height: 100% !important;
                    max-width: none !important;
                    max-height: none !important;
                    pointer-events: none;
                    contain: strict;
                }

                .${this.className}-contained > :not(.${this.className}-canvas) {
                    position: relative;
                    z-index: 2;
                }

                @media (prefers-reduced-motion: reduce) {
                    .${this.className}-canvas {
                        display: none;
                    }
                }
            `
        );

    }

}