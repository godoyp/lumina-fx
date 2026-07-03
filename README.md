# LuminaFX

A lightweight TypeScript plugin framework for premium UI effects, transitions, accessibility tools, and interactive frontend experiences.

LuminaFX is designed around a small core and independent plugins. Each plugin can be enabled only when needed, configured through TypeScript, and connected to your UI with simple `data-*` attributes.

> Status: early development / `0.1.0`.
>
> The project currently includes a showcase site and a library build. The package is not published to npm yet, but it can already be tested as a local dependency.

---

## Highlights

- TypeScript-first architecture
- Modular plugin system
- Declarative `data-*` integration
- Premium UI effects and transitions
- Canvas-based visual backgrounds
- Accessibility tools
- Local library build with generated `.d.ts` types
- Showcase site built with Vite

---

## Plugins

LuminaFX currently includes:

| Plugin | Purpose |
| --- | --- |
| `ThemePlugin` | Light/dark theme switching with optional View Transition support |
| `DropdownPlugin` | Declarative dropdown menus with positioning and glow effects |
| `PasswordVisibilityPlugin` | Password visibility toggles connected by selector |
| `ShimmerPlugin` | Shimmer feedback for refreshed or updated elements |
| `SpotlightPlugin` | Cursor-following radial glow effects |
| `CascadePlugin` | Staggered reveal animations for grouped elements |
| `ToastPlugin` | Temporary notifications with success, error, info, and warning states |
| `TooltipPlugin` | Contextual tooltips with placement support |
| `SwitchPlugin` | Animated panel switching with active trigger state |
| `TransitionPlugin` | Page/navigation transition effects |
| `ConstellationPlugin` | Interactive particle constellation effects using canvas |
| `StormPlugin` | Electric storm-style canvas effects |
| `AccessibilityPlugin` | Visual and reading accessibility controls |

---

## Accessibility features

The `AccessibilityPlugin` provides independent controls grouped by purpose.

### Color blindness filters

Only one color blindness filter can be active at a time:

- Protanopia
- Deuteranopia
- Tritanopia
- Achromatopsia

Activating one filter automatically disables the previous one. Clicking the active filter again disables it.

### Visual adjustments

These can be combined independently:

- Reduced motion
- Inverted colors
- High contrast
- Focus highlight

Reduced motion also works with the visual effects layer by disabling Spotlight and freezing Constellation/Storm motion when supported by those plugins.

### Reading adjustments

These can also be combined independently:

- Larger font
- Dyslexia-friendly mode

Dyslexia mode supports a custom font through the CSS variable:

```css
:root {
    --lumina-dyslexia-font-family:
        "OpenDyslexic",
        Arial,
        Verdana,
        Tahoma,
        sans-serif;
}
```

Example `@font-face` setup:

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
        url("/fonts/OpenDyslexic-Italic.otf")
        format("opentype");
    font-weight: 400;
    font-style: italic;
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
        url("/fonts/OpenDyslexic-BoldItalic.otf")
        format("opentype");
    font-weight: 700;
    font-style: italic;
    font-display: swap;
}
```

---

## Installation

LuminaFX is not published to npm yet.

During local development, build the library and install it from another project:

```bash
cd ~/Projects/lumina-fx
npm run build
```

Then, in a consumer project:

```bash
npm install ../lumina-fx
```

This adds a local dependency similar to:

```json
{
    "dependencies": {
        "lumina-fx": "file:../lumina-fx"
    }
}
```

---

## Basic usage

```ts
import {
    Lumina,
    ThemePlugin,
    SpotlightPlugin,
    ShimmerPlugin
} from "lumina-fx";

const shimmer =
    new ShimmerPlugin({
        intensity: "medium",
        duration: 900
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
        new SpotlightPlugin({
            intensity: "medium",
            size: 320
        })
    )
    .use(shimmer)
    .start();

shimmer.pulse("#status-card");
```

Example HTML:

```html
<section
    id="status-card"
    class="card"
    data-lumina-spotlight
>
    <div data-lumina-shimmer-layer></div>

    <h1>LuminaFX</h1>
    <p>Premium UI effects powered by plugins.</p>

    <button data-lumina-theme-toggle>
        Toggle theme
    </button>
</section>
```

---

## Accessibility usage

```ts
import {
    AccessibilityPlugin,
    Lumina
} from "lumina-fx";

await Lumina
    .create()
    .use(
        new AccessibilityPlugin({
            persist: true
        })
    )
    .start();
```

Example controls:

```html
<button data-lumina-accessibility-action="toggle-filter-protanopia">
    Protanopia
</button>

<button data-lumina-accessibility-action="toggle-filter-deuteranopia">
    Deuteranopia
</button>

<button data-lumina-accessibility-action="toggle-reduced-motion">
    Reduce motion
</button>

<button data-lumina-accessibility-action="toggle-high-contrast">
    High contrast
</button>

<button data-lumina-accessibility-action="toggle-large-font">
    Larger font
</button>

<button data-lumina-accessibility-action="toggle-dyslexia-mode">
    Dyslexia mode
</button>
```

---

## Library build

LuminaFX has a dedicated library build.

```bash
npm run build
```

The library output is generated in:

```txt
dist/
```

Expected output includes:

```txt
lumina-fx.js
lumina-fx.umd.cjs
index.d.ts
```

The package entrypoints are configured through `package.json`:

```json
{
    "main": "./dist/lumina-fx.umd.cjs",
    "module": "./dist/lumina-fx.js",
    "types": "./dist/index.d.ts",
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/lumina-fx.js",
            "require": "./dist/lumina-fx.umd.cjs"
        }
    }
}
```

---

## Showcase site

The project also includes an interactive showcase site built with Vite.

```bash
npm run dev
```

Build the showcase separately:

```bash
npm run build:site
```

The site output is generated in:

```txt
site-dist/
```

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the showcase site in development mode |
| `npm run build` | Builds the LuminaFX library |
| `npm run build:lib` | Builds the library directly |
| `npm run build:site` | Builds the showcase site |
| `npm run preview` | Previews the showcase build |
| `npm run check` | Runs TypeScript type checking without emitting files |

---

## Project structure

```txt
src/
├── index.ts
├── core/
├── plugins/
├── playground/
├── main.ts
└── transition-demo.ts
```

Important entrypoints:

```txt
src/index.ts       -> public library entrypoint
src/main.ts        -> showcase site entrypoint
src/playground/    -> showcase template, styles, and interactions
src/plugins/       -> plugin implementations
src/core/          -> Lumina core, module system, events, and DOM utilities
```

---

## Public exports

The public package currently exports from the root entrypoint:

```ts
import {
    Lumina,
    ThemePlugin,
    DropdownPlugin,
    ShimmerPlugin,
    SpotlightPlugin,
    ToastPlugin,
    AccessibilityPlugin
} from "lumina-fx";
```

Subpath exports such as `lumina-fx/plugins` are not configured yet.

---

## Development checklist

Before pushing changes:

```bash
npm run check
npm run build
npm run build:site
```

To test as a local dependency:

```bash
cd ~/Projects/lumina-fx
npm run build

cd ~/Projects/lumina-fx-consumer
rm -rf node_modules/lumina-fx
npm install ../lumina-fx
npm run build
```

---

## Roadmap

Planned improvements:

- Add subpath exports such as `lumina-fx/plugins`
- Improve generated API documentation
- Add automated tests
- Add examples for each plugin
- Add production-ready npm publishing configuration
- Split the showcase site into a separate app or monorepo workspace
- Add more demos and visual presets

---

## License

MIT © Pedro Godoy