import { Lumina } from "../core";
import {
    AccessibilityPlugin,
    CascadePlugin,
    ConstellationPlugin,
    DropdownPlugin,
    PasswordVisibilityPlugin,
    ShimmerPlugin,
    SpotlightPlugin,
    StormPlugin,
    SwitchPlugin,
    ThemePlugin,
    ToastPlugin,
    TooltipPlugin,
    TransitionPlugin
} from "../plugins";

export interface PlaygroundLumina {

    shimmer: ShimmerPlugin;

    toast: ToastPlugin;

}

export async function initializeLumina(): Promise<PlaygroundLumina> {

    const shimmer =
        new ShimmerPlugin({
            intensity: "medium",
            duration: 900
        });

    const toast =
        new ToastPlugin({
            effect: "glow",
            position: "top-right",
            duration: 3600
        });

    await Lumina

        .create({
            debug: true
        })

        .use(
            new ThemePlugin({
                defaultTheme: "system",
                transition: "view",
                toggleSelector: "[data-lumina-theme-toggle]"
            })
        )

        .use(
            new AccessibilityPlugin({
                persist: true
            })
        )

        .use(
            new DropdownPlugin({
                effect: "glow",
                placement: "bottom"
            })
        )

        .use(
            new PasswordVisibilityPlugin()
        )

        .use(
            new SwitchPlugin({
                effect: "glow",
                duration: 420,
                autoHeight: true
            })
        )

        .use(
            new TransitionPlugin({
                effect: "glow",
                duration: 720,
                enterDuration: 220,
                navigateDelay: 720,
                enterOnLoad: true
            })
        )

        .use(
            new ConstellationPlugin({
                mode: "contained",
                density: "high",
                interactive: true,
                connectDistance: 170,
                mouseRadius: 190,
                speed: 0.28,
                radius: 1.8,
                opacity: 0.9,
                lineOpacity: 0.62
            })
        )

        .use(
            new StormPlugin({
                mode: "contained",
                intensity: "medium",
                interactive: true,
                speed: 0.85,
                boltLength: 64,
                opacity: 0.92,
                glowColor: "rgba(34, 211, 238, .78)"
            })
        )

        .use(
            new CascadePlugin({
                direction: "up",
                distance: 28,
                duration: 720,
                stagger: 90,
                once: true
            })
        )

        .use(
            new SpotlightPlugin({
                intensity: "medium",
                size: 320
            })
        )

        .use(
            new TooltipPlugin({
                effect: "glow",
                placement: "top",
                offset: 12
            })
        )

        .use(shimmer)

        .use(toast)

        .start();

    return {
        shimmer,
        toast
    };

}