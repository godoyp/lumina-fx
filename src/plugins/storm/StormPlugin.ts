import { BasePlugin } from "../../core";

export type StormMode =
    | "contained"
    | "background";

export type StormIntensity =
    | "low"
    | "medium"
    | "high";

export type StormColor =
    | "auto"
    | string;

export interface StormPluginOptions {

    selector?: string;

    className?: string;

    mode?: StormMode;

    intensity?: StormIntensity;

    color?: StormColor;

    glowColor?: StormColor;

    speed?: number;

    boltLength?: number;

    opacity?: number;

    interactive?: boolean;

    mouseRadius?: number;

}

interface StormParticle {

    x: number;

    y: number;

    vx: number;

    vy: number;

    length: number;

    alpha: number;

    width: number;

}

interface StormFlash {

    x: number;

    y: number;

    radius: number;

    alpha: number;

    decay: number;

}

interface StormInstance {

    container: HTMLElement;

    canvas: HTMLCanvasElement;

    context: CanvasRenderingContext2D;

    particles: StormParticle[];

    flashes: StormFlash[];

    width: number;

    height: number;

    mode: StormMode;

    animationFrame: number | null;

    resizeFrame: number | null;

    resizeObserver: ResizeObserver | null;

    mouseX: number | null;

    mouseY: number | null;

    isFrozen: boolean;

}

interface StormListener {

    element: HTMLElement | Window;

    type: string;

    listener: EventListener;

}

export class StormPlugin extends BasePlugin {

    readonly metadata = {
        name: "storm",
        version: "1.0.0",
        description: "Renders a digital storm on a canvas as a background or within containers."
    };

    private readonly selector: string;

    private readonly className: string;

    private readonly mode: StormMode;

    private readonly intensity: StormIntensity;

    private readonly color: StormColor;

    private readonly glowColor: StormColor;

    private readonly speed: number;

    private readonly boltLength: number;

    private readonly opacity: number;

    private readonly interactive: boolean;

    private readonly mouseRadius: number;

    private isReducedMotionActive(): boolean {

        return document.documentElement.dataset.luminaReducedMotion === "true";

    }

    private readonly instances =
        new Map<HTMLElement, StormInstance>();

    private readonly listeners: StormListener[] =
        [];

    constructor(options: StormPluginOptions = {}) {

        super();

        this.selector =
            options.selector ??
            "[data-lumina-storm]";

        this.className =
            options.className ??
            "lumina-storm";

        this.mode =
            options.mode ??
            "contained";

        this.intensity =
            options.intensity ??
            "medium";

        this.color =
            options.color ??
            "auto";

        this.glowColor =
            options.glowColor ??
            "auto";

        this.speed =
            options.speed ??
            1;

        this.boltLength =
            options.boltLength ??
            52;

        this.opacity =
            options.opacity ??
            0.72;

        this.interactive =
            options.interactive ??
            true;

        this.mouseRadius =
            options.mouseRadius ??
            180;

    }

    protected onInitialize(): void {

        this.injectStyles();

        this.collectContainers();

        this.logger.info(
            `[Lumina Storm] Initialized ${this.instances.size} instance(s).`
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

        const instance: StormInstance = {
            container,
            canvas,
            context,
            particles: [],
            flashes: [],
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

        instance.particles =
            this.createParticles(instance);

        this.bindResize(instance);

        if (this.interactive) {

            this.bindPointerEvents(instance);

        }

        this.startInstance(instance);

        this.emit(
            "storm:start",
            {
                container,
                canvas
            }
        );

    }

    private prepareContainer(
        container: HTMLElement,
        mode: StormMode
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
    ): StormMode {

        const mode =
            container.dataset.luminaStormMode;

        if (mode === "background") {
            return "background";
        }

        if (mode === "contained") {
            return "contained";
        }

        return this.mode;

    }

    private bindResize(
        instance: StormInstance
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
        instance: StormInstance
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
        instance: StormInstance
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

                        instance.particles =
                            this.createParticles(instance);

                        instance.flashes =
                            [];

                    }

                }
            );

    }

    private resizeInstance(
        instance: StormInstance
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
        instance: StormInstance
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

    private createParticles(
        instance: StormInstance
    ): StormParticle[] {

        const area =
            instance.width * instance.height;

        const density =
            this.resolveDensityFactor();

        const count =
            Math.max(
                8,
                Math.round(
                    area / density
                )
            );

        return Array.from(
            {
                length: count
            },
            () => this.createParticle(instance)
        );

    }

    private createParticle(
        instance: StormInstance
    ): StormParticle {

        const angle =
            Math.PI * 0.18 +
            Math.random() * Math.PI * 0.14;

        const velocity =
            this.speed *
            (
                2.4 +
                Math.random() * 3.2
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
            length:
                this.boltLength *
                (
                    0.55 +
                    Math.random() * 0.95
                ),
            alpha:
                0.35 +
                Math.random() * 0.65,
            width:
                0.8 +
                Math.random() * 1.4
        };

    }

    private resolveDensityFactor(): number {

        if (this.intensity === "low") {
            return 46000;
        }

        if (this.intensity === "high") {
            return 17000;
        }

        return 29000;

    }

    private startInstance(
        instance: StormInstance
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
        instance: StormInstance
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
            "storm:stop",
            {
                container: instance.container,
                canvas: instance.canvas
            }
        );

    }

    private destroyInstance(
        instance: StormInstance
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
        instance: StormInstance
    ): void {

        for (const particle of instance.particles) {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;

            if (
                particle.x > instance.width + particle.length ||
                particle.y > instance.height + particle.length
            ) {

                this.resetParticle(
                    particle,
                    instance
                );

            }

        }

        this.updateFlashes(instance);

        if (
            this.interactive &&
            instance.mouseX !== null &&
            instance.mouseY !== null
        ) {

            this.maybeCreateMouseFlash(instance);

            return;

        }

        this.maybeCreateAmbientFlash(instance);

    }

    private resetParticle(
        particle: StormParticle,
        instance: StormInstance
    ): void {

        particle.x =
            Math.random() * instance.width -
            instance.width * 0.25;

        particle.y =
            -particle.length -
            Math.random() * instance.height * 0.25;

        const angle =
            Math.PI * 0.18 +
            Math.random() * Math.PI * 0.14;

        const velocity =
            this.speed *
            (
                2.4 +
                Math.random() * 3.2
            );

        particle.vx =
            Math.cos(angle) * velocity;

        particle.vy =
            Math.sin(angle) * velocity;

        particle.length =
            this.boltLength *
            (
                0.55 +
                Math.random() * 0.95
            );

        particle.alpha =
            0.35 +
            Math.random() * 0.65;

        particle.width =
            0.8 +
            Math.random() * 1.4;

    }

    private updateFlashes(
        instance: StormInstance
    ): void {

        instance.flashes =
            instance.flashes.filter(
                flash => {

                    flash.alpha -=
                        flash.decay;

                    flash.radius +=
                        1.4 * this.speed;

                    return flash.alpha > 0;

                }
            );

    }

    private maybeCreateMouseFlash(
        instance: StormInstance
    ): void {

        if (
            instance.mouseX === null ||
            instance.mouseY === null
        ) {
            return;
        }

        if (Math.random() > 0.035) {
            return;
        }

        instance.flashes.push({
            x:
                instance.mouseX +
                (
                    Math.random() - 0.5
                ) *
                this.mouseRadius,
            y:
                instance.mouseY +
                (
                    Math.random() - 0.5
                ) *
                this.mouseRadius,
            radius:
                24 +
                Math.random() * 48,
            alpha:
                0.22 +
                Math.random() * 0.18,
            decay:
                0.018 +
                Math.random() * 0.018
        });

    }

    private maybeCreateAmbientFlash(
        instance: StormInstance
    ): void {

        if (Math.random() > 0.012) {
            return;
        }

        instance.flashes.push({
            x:
                Math.random() * instance.width,
            y:
                Math.random() * instance.height,
            radius:
                40 +
                Math.random() * 90,
            alpha:
                0.12 +
                Math.random() * 0.16,
            decay:
                0.012 +
                Math.random() * 0.014
        });

    }

    private render(
        instance: StormInstance
    ): void {

        const context =
            instance.context;

        context.clearRect(
            0,
            0,
            instance.width,
            instance.height
        );

        const color =
            this.resolveColor(instance.container);

        const glowColor =
            this.resolveGlowColor(instance.container);

        this.renderFlashes(
            instance,
            glowColor
        );

        this.renderParticles(
            instance,
            color,
            glowColor
        );

    }

    private renderParticles(
        instance: StormInstance,
        color: string,
        glowColor: string
    ): void {

        const context =
            instance.context;

        context.save();

        context.lineCap =
            "round";

        for (const particle of instance.particles) {

            const dx =
                -particle.vx /
                Math.max(
                    1,
                    this.speed
                ) *
                particle.length *
                0.08;

            const dy =
                -particle.vy /
                Math.max(
                    1,
                    this.speed
                ) *
                particle.length *
                0.08;

            const gradient =
                context.createLinearGradient(
                    particle.x + dx,
                    particle.y + dy,
                    particle.x,
                    particle.y
                );

            gradient.addColorStop(
                0,
                "transparent"
            );

            gradient.addColorStop(
                0.45,
                glowColor
            );

            gradient.addColorStop(
                1,
                color
            );

            context.globalAlpha =
                particle.alpha *
                this.opacity;

            context.strokeStyle =
                gradient;

            context.lineWidth =
                particle.width;

            context.shadowBlur =
                14;

            context.shadowColor =
                glowColor;

            context.beginPath();

            context.moveTo(
                particle.x + dx,
                particle.y + dy
            );

            context.lineTo(
                particle.x,
                particle.y
            );

            context.stroke();

        }

        context.restore();

    }

    private renderFlashes(
        instance: StormInstance,
        glowColor: string
    ): void {

        const context =
            instance.context;

        context.save();

        for (const flash of instance.flashes) {

            const gradient =
                context.createRadialGradient(
                    flash.x,
                    flash.y,
                    0,
                    flash.x,
                    flash.y,
                    flash.radius
                );

            gradient.addColorStop(
                0,
                glowColor
            );

            gradient.addColorStop(
                1,
                "transparent"
            );

            context.globalAlpha =
                flash.alpha;

            context.fillStyle =
                gradient;

            context.beginPath();

            context.arc(
                flash.x,
                flash.y,
                flash.radius,
                0,
                Math.PI * 2
            );

            context.fill();

        }

        context.restore();

    }

    private resolveColor(
        container: HTMLElement
    ): string {

        if (this.color !== "auto") {
            return this.color;
        }

        return getComputedStyle(container)
            .getPropertyValue(
                "--lumina-storm-color"
            )
            .trim() ||
            "rgba(226, 232, 240, .74)";

    }

    private resolveGlowColor(
        container: HTMLElement
    ): string {

        if (this.glowColor !== "auto") {
            return this.glowColor;
        }

        return getComputedStyle(container)
            .getPropertyValue(
                "--lumina-storm-glow"
            )
            .trim() ||
            "rgba(34, 211, 238, .44)";

    }

    private injectStyles(): void {

        this.dom.injectStyle(
            "lumina-storm-style",
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