# LuminaFX

**LuminaFX** is a lightweight TypeScript plugin framework for premium UI effects, transitions, accessibility tools, and interactive frontend experiences.

It provides a modular way to add polished visual behavior to modern web interfaces without locking your project into a specific UI framework.

> Status: early development / showcase phase.

---

## Overview

LuminaFX is built around a small core and independent plugins. Each plugin can be enabled, configured, and used separately.

The project currently includes a live showcase site built with Vite, demonstrating the plugins working together in a real page.

---

## Features

- TypeScript-first architecture
- Plugin-based core
- Framework-agnostic usage
- Declarative behavior through `data-*` attributes
- Programmatic API support
- Premium UI effects and transitions
- Accessibility-focused visual controls
- Canvas-powered background effects
- Lightweight playground/showcase site

---

## Available Plugins

### ThemePlugin

Switches between light and dark themes with optional View Transition support.

### DropdownPlugin

Creates independent dropdown menus with configurable placement, close behavior, and visual effects.

### PasswordVisibilityPlugin

Adds password visibility toggles using simple HTML attributes.

### ShimmerPlugin

Applies shimmer feedback to updated elements, useful for async updates, cache refreshes, WebSocket updates, or live UI changes.

### SpotlightPlugin

Adds a radial glow that follows the cursor inside an element.

### CascadePlugin

Reveals groups of elements in sequence with progressive delays.

### ToastPlugin

Displays temporary notifications such as success, info, warning, or error messages.

### TooltipPlugin

Adds contextual tooltips with configurable placement and visual style.

### SwitchPlugin

Switches between panels with animated transitions, automatic height handling, and active trigger states.

### TransitionPlugin

Runs visual page transitions before navigation.

### ConstellationPlugin

Creates connected particle effects using canvas, available as contained effects or full-page backgrounds.

### StormPlugin

Creates animated lightning-like digital storm effects using canvas.

### AccessibilityPlugin

Provides reusable accessibility controls, including:

- Exclusive color blindness filters
- Reduced motion mode
- Inverted colors
- High contrast
- Focus highlight
- Larger font mode
- Dyslexia-friendly font mode

---

## Project Structure

```txt
src/
├── core/
├── plugins/
│   ├── accessibility/
│   ├── cascade/
│   ├── constellation/
│   ├── dropdown/
│   ├── password/
│   ├── shimmer/
│   ├── spotlight/
│   ├── storm/
│   ├── switch/
│   ├── theme/
│   ├── toast/
│   ├── tooltip/
│   └── transition/
├── playground/
│   ├── connectDemoActions.ts
│   ├── initializeLumina.ts
│   ├── styles.ts
│   └── template.ts
├── main.ts
└── transition-demo.ts
```

---

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run TypeScript checks only:

```bash
npm run check
```

Preview the production build:

```bash
npm run preview
```

---

## Basic Usage

```ts
import { Lumina } from "./core";

import {
    ThemePlugin,
    DropdownPlugin,
    SpotlightPlugin,
    ShimmerPlugin
} from "./plugins";

const shimmer = new ShimmerPlugin();

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
        new DropdownPlugin({
            effect: "glow",
            placement: "bottom"
        })
    )
    .use(
        new SpotlightPlugin({
            intensity: "medium",
            size: 320
        })
    )
    .use(shimmer)
    .start();

shimmer.pulse("#status-card");
```

---

## Declarative Usage

Many plugins can be wired directly from HTML.

### Theme Toggle

```html
<button data-lumina-theme-toggle>
    Toggle theme
</button>
```

### Dropdown

```html
<button data-lumina-dropdown-trigger="docs-menu">
    Open menu
</button>

<div
    data-lumina-dropdown-menu="docs-menu"
    data-lumina-dropdown-placement="bottom"
>
    Dropdown content
</div>
```

### Password Visibility

```html
<input
    id="password"
    type="password"
/>

<button data-lumina-password-toggle="#password">
    Show password
</button>
```

### Tooltip

```html
<button
    data-lumina-tooltip="This is a tooltip."
    data-lumina-tooltip-placement="top"
>
    Hover me
</button>
```

### Transition Link

```html
<a
    href="./transition-demo.html"
    data-lumina-transition
    data-lumina-transition-effect="glow"
    data-lumina-transition-delay="360"
>
    Open page
</a>
```

---

## Accessibility Controls

The AccessibilityPlugin supports independent visual and reading adjustments.

Color blindness filters are exclusive, meaning only one can be active at a time:

```html
<button data-lumina-accessibility-action="toggle-filter-protanopia">
    Protanopia
</button>

<button data-lumina-accessibility-action="toggle-filter-deuteranopia">
    Deuteranopia
</button>

<button data-lumina-accessibility-action="toggle-filter-tritanopia">
    Tritanopia
</button>

<button data-lumina-accessibility-action="toggle-filter-achromatopsia">
    Achromatopsia
</button>
```

Visual and reading adjustments can be combined:

```html
<button data-lumina-accessibility-action="toggle-reduced-motion">
    Reduce motion
</button>

<button data-lumina-accessibility-action="toggle-inverted-colors">
    Invert colors
</button>

<button data-lumina-accessibility-action="toggle-high-contrast">
    High contrast
</button>

<button data-lumina-accessibility-action="toggle-focus-highlight">
    Highlight focus
</button>

<button data-lumina-accessibility-action="toggle-large-font">
    Larger font
</button>

<button data-lumina-accessibility-action="toggle-dyslexia-mode">
    Dyslexia mode
</button>
```

---

## OpenDyslexic Font Support

The project supports a custom dyslexia-friendly font through a CSS variable.

Example:

```css
@font-face {
    font-family: "OpenDyslexic";
    src:
        url("/fonts/OpenDyslexic-Regular.otf")
        format("opentype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: "OpenDyslexic";
    src:
        url("/fonts/OpenDyslexic-Bold.otf")
        format("opentype");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: "OpenDyslexic";
    src:
        url("/fonts/OpenDyslexic-Italic.otf")
        format("opentype");
    font-weight: 400;
    font-style: italic;
    font-display: swap;
}

@font-face {
    font-family: "OpenDyslexic";
    src:
        url("/fonts/OpenDyslexic-BoldItalic.otf")
        format("opentype");
    font-weight: 700;
    font-style: italic;
    font-display: swap;
}

:root {
    --lumina-dyslexia-font-family:
        "OpenDyslexic",
        Arial,
        Verdana,
        Tahoma,
        sans-serif;
}
```

---

## Roadmap

- Improve documentation for each plugin
- Add full API reference
- Add examples for framework integrations
- Prepare package entrypoints for npm distribution
- Add automated tests
- Split the showcase site into a dedicated app or workspace
- Publish the first public package version

---

## Development Notes

This repository currently contains both the LuminaFX source code and its showcase site.

The showcase is used as a living documentation page and as a manual testing environment for the plugins.

A future version may split the site into a separate project that consumes LuminaFX as a real package dependency.

---

## License

MIT © Pedro Godoy