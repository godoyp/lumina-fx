export function createPlaygroundTemplate(): string {

    return `
        <main class="app" id="main-content">
            <nav class="nav">
                <div class="container nav-inner">
                    <a
                        class="brand"
                        href="#home"
                        aria-label="Go to home"
                    >
                        <div class="brand-mark">✦</div>

                        <span>LuminaFX</span>
                    </a>

                    <div class="nav-links" aria-label="Main navigation">
                        <a href="#features">Features</a>
                        <a href="#plugins">Plugins</a>
                        <a href="#install">Installation</a>
                    </div>

                    <div class="nav-actions">
                        <button
                            class="ghost-button"
                            data-lumina-theme-toggle
                            type="button"
                        >
                            Toggle theme
                        </button>
                    </div>
                </div>
            </nav>

            <section class="hero" id="home">
                <div class="container hero-grid">
                    <div class="hero-copy">
                        <span class="eyebrow">
                            Modular visual library in TypeScript
                        </span>

                        <h1>
                            Lumina FX
                        </h1>

                        <h2>
                            Premium UI effects for modern frontends.
                        </h2>

                        <p>
                            LuminaFX brings together visual effects, microinteractions,
                            transitions, feedback, and accessibility controls
                            in a plugin-based architecture.
                        </p>

                        <div class="hero-actions">
                            <a
                                class="primary-link"
                                href="#plugins"
                            >
                                View plugins
                            </a>

                            <a
                                class="secondary-link"
                                href="#install"
                            >
                                Get started
                            </a>

                            <button
                                class="ghost-button"
                                id="pulse-all"
                                type="button"
                            >
                                Simulate update
                            </button>
                        </div>

                        <div class="hero-metrics" aria-label="Project summary">
                            <div class="hero-metric">
                                <strong>13+</strong>
                                <span>plugins</span>
                            </div>

                            <div class="hero-metric">
                                <strong>0 deps</strong>
                                <span>independent core</span>
                            </div>

                            <div class="hero-metric">
                                <strong>TS</strong>
                                <span>typed and modular</span>
                            </div>
                        </div>
                    </div>

                    <div
                        class="hero-card hero-preview-card"
                        data-lumina-spotlight
                    >
                        <div
                            class="refresh-overlay"
                            id="hero-preview"
                            data-refresh-surface
                            data-lumina-shimmer-layer
                        ></div>

                        <div
                            class="terminal refresh-content"
                            data-lumina-spotlight
                        >
                            <div class="terminal-header">
                                <span class="dot"></span>
                                <span class="dot"></span>
                                <span class="dot"></span>
                            </div>

                            <pre><code>import { Lumina } from "@lumina/fx";
import {
    ThemePlugin,
    DropdownPlugin,
    SpotlightPlugin,
    ShimmerPlugin
} from "@lumina/fx/plugins";

const shimmer = new ShimmerPlugin();

await Lumina
    .create({ debug: true })
    .use(new ThemePlugin({
        transition: "view",
        toggleSelector: "[data-lumina-theme-toggle]"
    }))
    .use(new DropdownPlugin({
        effect: "glow",
        placement: "bottom"
    }))
    .use(new SpotlightPlugin({
        intensity: "medium",
        size: 320
    }))
    .use(shimmer)
    .start();

shimmer.pulse("#status-card");</code></pre>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section" id="features">
                <div class="container">
                    <div class="section-header section-header-centered">
                        <span class="section-kicker">Why LuminaFX?</span>

                        <h2>
                            Beautiful, reusable effects that are easy to integrate.
                        </h2>

                        <p>
                            The goal is to deliver a premium visual layer without locking
                            your project into a specific framework.
                        </p>
                    </div>

                    <div class="feature-grid" data-lumina-cascade>
                        <article
                            class="feature-card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <span class="feature-icon">⚡</span>
                            <h3>Plugin-based</h3>
                            <p>
                                Use only what you need. Each plugin is independent,
                                configurable, and initialized by the core.
                            </p>
                        </article>

                        <article
                            class="feature-card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <span class="feature-icon">🎛</span>
                            <h3>Declarative or programmatic</h3>
                            <p>
                                Connect through data attributes in HTML or control it
                                directly through the plugin API.
                            </p>
                        </article>

                        <article
                            class="feature-card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <span class="feature-icon">♿</span>
                            <h3>Built-in accessibility</h3>
                            <p>
                                Includes reading, contrast, focus,
                                reduced motion, and visual filter controls.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="parallax-band parallax-band-a">
                <div class="container parallax-band-content">
                    <span>Effects that feel alive.</span>
                    <p>
                        Transitions, feedback, and microinteractions working together
                        to make any interface feel more fluid.
                    </p>
                </div>
            </section>

            <section class="section" id="plugins">
                <div class="container">
                    <div class="section-header">
                        <span class="section-kicker">Interactive showcase</span>

                        <h2>
                            Available plugins
                        </h2>

                        <p>
                            The cards below are not images: each demo is
                            running with LuminaFX's own plugin.
                        </p>
                    </div>

                    <div class="grid">
                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">ThemePlugin</span>
                                <h3>Theme with View Transition</h3>
                                <p>
                                    Switches between light and dark using a smooth radial transition
                                    based on the real click position.
                                </p>
                            </div>

                            <div class="demo-row">
                                <button
                                    data-lumina-theme-toggle
                                    type="button"
                                >
                                    Toggle theme
                                </button>
                            </div>
                        </article>

                        <article
                            class="card dropdown-card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">DropdownPlugin</span>
                                <h3>Dropdown with glow</h3>
                                <p>
                                    Independent dropdown with outside-click close,
                                    Escape support, configurable placement, and an optional effect.
                                </p>
                            </div>

                            <div class="demo-row">
                                <div class="dropdown-wrapper">
                                    <button
                                        data-lumina-dropdown-trigger="docs-menu"
                                        type="button"
                                    >
                                        Open documentation
                                    </button>

                                    <div
                                        class="dropdown-menu"
                                        data-lumina-dropdown-menu="docs-menu"
                                        data-lumina-dropdown-placement="bottom"
                                    >
                                        <strong>Dropdown Lumina</strong>
                                        <p>
                                            This menu was automatically connected by the plugin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">PasswordVisibilityPlugin</span>
                                <h3>Password visibility</h3>
                                <p>
                                    Toggles password fields without relying on internal framework IDs.
                                    The target is defined by the HTML.
                                </p>
                            </div>

                            <div class="password-demo">
                                <label for="demo-password">
                                    Demo password
                                </label>

                                <input
                                    id="demo-password"
                                    type="password"
                                    value="lumina123"
                                />

                                <button
                                    data-lumina-password-toggle="#demo-password"
                                    type="button"
                                >
                                    Show password
                                </button>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">ShimmerPlugin</span>
                                <h3>Update feedback</h3>
                                <p>
                                    Trigger the shimmer when an element is updated by an API,
                                    WebSocket, cache, or any flow in your system.
                                </p>
                            </div>

                            <div
                                class="status-card"
                                id="status-card"
                            >
                                <div
                                    class="refresh-overlay"
                                    data-status-refresh-surface
                                    data-lumina-shimmer-layer
                                ></div>

                                <div class="status-card-content">
                                    <strong>System status</strong>
                                    <p
                                        id="status-text"
                                        style="margin-bottom: 0;"
                                    >
                                        Waiting for update...
                                    </p>
                                </div>
                            </div>

                            <div class="demo-row">
                                <button
                                    id="simulate-update"
                                    type="button"
                                >
                                    Simulate update
                                </button>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">CascadePlugin</span>
                                <h3>Cascade animation</h3>
                                <p>
                                    Reveals groups of elements in sequence, applying progressive delay
                                    between items to create a smooth entrance.
                                </p>
                            </div>

                            <div class="demo-row cascade-demo-controls">
                                <button
                                    id="toggle-cascade-demo"
                                    type="button"
                                    aria-expanded="true"
                                >
                                    Hide items
                                </button>
                            </div>

                            <div class="demo-row">
                                <div
                                    class="cascade-demo-list"
                                    id="cascade-demo-list"
                                    data-lumina-cascade
                                    data-lumina-cascade-once="false"
                                >
                                    <span data-lumina-cascade-item>First item</span>
                                    <span data-lumina-cascade-item>Second item</span>
                                    <span data-lumina-cascade-item>Third item</span>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">SwitchPlugin</span>
                                <h3>Panel switching</h3>
                                <p>
                                    Switches content blocks with animation, automatic height,
                                    active button state, and optional glow.
                                </p>
                            </div>

                            <div class="switch-demo">
                                <div class="switch-demo-actions">
                                    <button
                                        class="ghost-button"
                                        data-lumina-switch-trigger="docs-switch"
                                        data-lumina-switch-target="overview"
                                        type="button"
                                    >
                                        Overview
                                    </button>

                                    <button
                                        class="ghost-button"
                                        data-lumina-switch-trigger="docs-switch"
                                        data-lumina-switch-target="api"
                                        type="button"
                                    >
                                        API
                                    </button>

                                    <button
                                        class="ghost-button"
                                        data-lumina-switch-trigger="docs-switch"
                                        data-lumina-switch-target="usage"
                                        type="button"
                                    >
                                        Usage
                                    </button>
                                </div>

                                <div
                                    class="switch-demo-panel"
                                    data-lumina-switch="docs-switch"
                                >
                                    <div data-lumina-switch-panel="overview">
                                        <strong>Overview</strong>
                                        <p>
                                            SwitchPlugin controls multiple panels inside a container.
                                        </p>
                                    </div>

                                    <div
                                        data-lumina-switch-panel="api"
                                        hidden
                                    >
                                        <strong>Declarative API</strong>
                                        <p>
                                            Use triggers and panels through data attributes, without writing handlers.
                                        </p>
                                    </div>

                                    <div
                                        data-lumina-switch-panel="usage"
                                        hidden
                                    >
                                        <strong>Usage em sistemas reais</strong>
                                        <p>
                                            Ideal for previews, details, form states, and contextual content.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">SpotlightPlugin</span>
                                <h3>Cursor-following spotlight</h3>
                                <p>
                                    Applies a dynamic radial glow to the element,
                                    following the mouse position in real time.
                                </p>

                                <div
                                    class="spotlight-preview"
                                    data-lumina-spotlight
                                >
                                    <strong>Hover here</strong>
                                    <p style="margin-bottom: 0;">
                                        This block also uses SpotlightPlugin independently.
                                    </p>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">ToastPlugin</span>
                                <h3>Notifications with glow</h3>
                                <p>
                                    Displays temporary success, error, warning, or info messages,
                                    with animation, manual close, and an optional visual effect.
                                </p>
                            </div>

                            <div class="demo-row toast-demo-row">
                                <button
                                    class="toast-demo-button toast-demo-button-success"
                                    id="demo-toast-success"
                                    type="button"
                                >
                                    Success toast
                                </button>

                                <button
                                    class="toast-demo-button toast-demo-button-info"
                                    id="demo-toast-info"
                                    type="button"
                                >
                                    Info toast
                                </button>

                                <button
                                    class="toast-demo-button toast-demo-button-error"
                                    id="demo-toast-error"
                                    type="button"
                                >
                                    Error toast
                                </button>
                            </div>
                        </article>

                        <article
                            class="card storm-card"
                            data-lumina-storm
                            data-lumina-storm-mode="contained"
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">StormPlugin</span>

                                <h3>Digital storm</h3>

                                <p>
                                    Creates fast lines, glows, and flashes on canvas,
                                    ideal for energetic backgrounds and futuristic pages.
                                </p>

                                <div class="storm-demo-panel">
                                    <strong>Contained mode</strong>

                                    <p>
                                        The effect runs inside this card without affecting the page layout.
                                    </p>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card constellation-card"
                            data-lumina-constellation
                            data-lumina-constellation-mode="contained"
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">ConstellationPlugin</span>

                                <h3>Interactive constellation</h3>

                                <p>
                                    Creates connected particles on canvas,
                                    ideal for premium cards, heroes, and tech-inspired areas.
                                </p>

                                <div class="constellation-demo-panel">
                                    <strong>Contained mode</strong>

                                    <p>
                                        The effect runs inside this card without affecting the page layout.
                                    </p>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">TooltipPlugin</span>
                                <h3>Tooltips with glow</h3>
                                <p>
                                    Displays contextual tips on hover or focus, with configurable
                                    placement and a premium visual style.
                                </p>
                            </div>

                            <div class="demo-row">
                                <button
                                    class="ghost-button"
                                    data-lumina-tooltip="Tooltip at the top with a glow effect."
                                    data-lumina-tooltip-placement="top"
                                    type="button"
                                >
                                    Tooltip top
                                </button>

                                <button
                                    class="ghost-button"
                                    data-lumina-tooltip="Tooltip on the left with a glow effect."
                                    data-lumina-tooltip-placement="left"
                                    type="button"
                                >
                                    Tooltip left
                                </button>

                                <button
                                    class="ghost-button"
                                    data-lumina-tooltip="Tooltip at the bottom with a glow effect."
                                    data-lumina-tooltip-placement="bottom"
                                    type="button"
                                >
                                    Tooltip bottom
                                </button>

                                <button
                                    class="ghost-button"
                                    data-lumina-tooltip="Tooltip on the right with a glow effect."
                                    data-lumina-tooltip-placement="right"
                                    type="button"
                                >
                                    Tooltip right
                                </button>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">TransitionPlugin</span>
                                <h3>Navigation transition</h3>
                                <p>
                                    Applies a visual transition before navigating to another page,
                                    with glow, brightness, and an exit effect.
                                </p>
                            </div>

                            <div class="demo-row">
                                <a
                                    class="transition-demo-link"
                                    href="./transition-demo.html"
                                    data-lumina-transition
                                    data-lumina-transition-effect="glow"
                                    data-lumina-transition-delay="360"
                                >
                                    Go to example page
                                </a>
                            </div>
                        </article>

                        <article
                            class="card accessibility-card"
                            id="accessibility"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">AccessibilityPlugin</span>

                                <h3>Accessibility controls</h3>

                                <p>
                                    Enable independent filters and visual adjustments to adapt
                                    the page to the user’s needs.
                                </p>

                                <div class="accessibility-group">
                                    <strong>Color Blindness Filters</strong>

                                    <div class="accessibility-demo-grid">
                                        <button
                                            data-lumina-accessibility-action="toggle-filter-protanopia"
                                            type="button"
                                        >
                                            Protanopia
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-filter-deuteranopia"
                                            type="button"
                                        >
                                            Deuteranopia
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-filter-tritanopia"
                                            type="button"
                                        >
                                            Tritanopia
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-filter-achromatopsia"
                                            type="button"
                                        >
                                            Acromatopsia
                                        </button>
                                    </div>
                                </div>

                                <div class="accessibility-group">
                                    <strong>Visual Adjustments</strong>

                                    <div class="accessibility-demo-grid">
                                        <button
                                            data-lumina-accessibility-action="toggle-reduced-motion"
                                            type="button"
                                        >
                                            Reduce Animations
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-inverted-colors"
                                            type="button"
                                        >
                                            Invert Colors
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-high-contrast"
                                            type="button"
                                        >
                                            High Contrast
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-focus-highlight"
                                            type="button"
                                        >
                                            Highlight Focus
                                        </button>
                                    </div>
                                </div>

                                <div class="accessibility-group">
                                    <strong>Reading Adjustments</strong>

                                    <div class="accessibility-demo-grid">
                                        <button
                                            data-lumina-accessibility-action="toggle-large-font"
                                            type="button"
                                        >
                                            Larger Font
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-dyslexia-mode"
                                            type="button"
                                        >
                                            Dyslexia Mode
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section class="parallax-band parallax-band-b">
                <div class="container parallax-band-content">
                    <span>Built as plugins.</span>
                    <p>
                        Every LuminaFX feature is independent, configurable,
                        and easy to integrate into any project.
                    </p>
                </div>
            </section>

            <section class="section" id="install">
                <div class="container">
                    <div class="docs-grid">
                        <div class="docs-copy">
                            <span class="section-kicker">Installation</span>

                            <h2>
                                Initialize the core, connect the plugins, and you are ready.
                            </h2>

                            <p>
                                LuminaFX was designed to work as a pluggable
                                visual layer. You create the instance, register the plugins
                                you want to use, and start it.
                            </p>

                            <div class="install-pills">
                                <code>npm install ./lumina-fx</code>
                                <code>TypeScript first</code>
                                <code>Data attributes friendly</code>
                            </div>
                        </div>

                        <div
                            class="hero-card"
                            data-lumina-spotlight
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div
                                class="terminal refresh-content"
                                data-lumina-spotlight
                            >
                                <div class="terminal-header">
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                </div>

                                <pre><code>const shimmer = new ShimmerPlugin({
    intensity: "medium",
    duration: 900
});

const toast = new ToastPlugin({
    effect: "glow",
    position: "top-right"
});

await Lumina
    .create({
        debug: true
    })
    .use(new ThemePlugin({
        defaultTheme: "system",
        transition: "view",
        toggleSelector: "[data-lumina-theme-toggle]"
    }))
    .use(new DropdownPlugin({
        effect: "glow",
        placement: "bottom"
    }))
    .use(new PasswordVisibilityPlugin())
    .use(new SwitchPlugin({
        effect: "glow",
        autoHeight: true
    }))
    .use(new CascadePlugin())
    .use(new SpotlightPlugin({
        intensity: "medium",
        size: 320
    }))
    .use(new TooltipPlugin({
        effect: "glow",
        placement: "top"
    }))
    .use(shimmer)
    .use(toast)
    .start();

toast.success("LuminaFX started!");</code></pre>
                            </div>
                        </div>
                    </div>

                    <div class="plugin-list" data-lumina-cascade>
                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>ThemePlugin</strong>
                            <span>theme transition</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>DropdownPlugin</strong>
                            <span>independent menus</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>PasswordVisibilityPlugin</strong>
                            <span>password toggle</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>ShimmerPlugin</strong>
                            <span>update feedback</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>CascadePlugin</strong>
                            <span>sequential entrance</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>SpotlightPlugin</strong>
                            <span>cursor-following glow</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>ToastPlugin</strong>
                            <span>temporary notifications</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>TooltipPlugin</strong>
                            <span>contextual tips</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>SwitchPlugin</strong>
                            <span>panel switching</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>ConstellationPlugin</strong>
                            <span>connected particles</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>StormPlugin</strong>
                            <span>digital storm</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>AccessibilityPlugin</strong>
                            <span>visual controls</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="final-cta">
                <div class="container final-cta-card" data-lumina-spotlight>
                    <span class="section-kicker">Ready to use</span>

                    <h2>
                        Turn scattered effects into a consistent visual layer.
                    </h2>

                    <p>
                        Use LuminaFX to create more fluid, responsive,
                        and memorable interfaces without coupling your project to a specific stack.
                    </p>

                    <div class="hero-actions final-cta-actions">
                        <a
                            class="primary-link"
                            href="#install"
                        >
                            View installation
                        </a>

                        <button
                            class="ghost-button"
                            data-lumina-theme-toggle
                            type="button"
                        >
                            Test theme
                        </button>
                    </div>
                </div>
            </section>

            <footer class="footer">
                <div class="container footer-inner">
                    <span>
                        LuminaFX · Built by Pedro Godoy
                    </span>
                    <a
                        class="ghost-button footer-github-link"
                        href="https://github.com/godoyp/lumina-fx"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open the LuminaFX repository on GitHub"
                    >
                        <svg
                            class="footer-github-icon"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                fill="currentColor"
                                d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.699-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.467-1.11-1.467-.908-.621.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.594 1.028 2.687 0 3.848-2.338 4.695-4.566 4.944.359.31.678.922.678 1.858 0 1.341-.012 2.423-.012 2.752 0 .268.18.58.688.482A10.025 10.025 0 0 0 22 12.021C22 6.484 17.523 2 12 2Z"
                            />
                        </svg>

                        GitHub
                    </a>
                </div>
            </footer>
        </main>
    `;

}