const assetBaseUrl =
    import.meta.env.BASE_URL;

const playgroundStyles = `

    @font-face {
        font-family: "OpenDyslexic";
        src:
            url("${assetBaseUrl}fonts/OpenDyslexic-Regular.otf")
            format("opentype");
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: "OpenDyslexic";
        src:
            url("${assetBaseUrl}fonts/OpenDyslexic-Italic.otf")
            format("opentype");
        font-weight: 400;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: "OpenDyslexic";
        src:
            url("${assetBaseUrl}fonts/OpenDyslexic-Bold.otf")
            format("opentype");
        font-weight: 700;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: "OpenDyslexic";
        src:
            url("${assetBaseUrl}fonts/OpenDyslexic-BoldItalic.otf")
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

    html,
    body {
        margin: 0;
        min-height: 100%;
        background: var(--bg);
        scrollbar-width: none;
        -ms-overflow-style: none; 
    }

    *::-webkit-scrollbar {
        display: none;
    }

    body {
        min-height: 100vh;
        font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        color: var(--fg);
        background: var(--bg);
    }

    body::before,
    body::after {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: -2;
    }

    body::before {
        background:
            radial-gradient(
                circle at 20% 10%,
                var(--hero-glow),
                transparent 34rem
            ),
            radial-gradient(
                circle at 85% 30%,
                var(--orb-glow),
                transparent 28rem
            ),
            var(--bg);
    }

    body::after {
        z-index: -1;
        opacity: var(--grid-opacity);
        background-image:
            linear-gradient(
                rgba(148, 163, 184, .16) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(148, 163, 184, .16) 1px,
                transparent 1px
            );
        background-size: 56px 56px;
    }

    :root[data-theme="light"] {
        --bg: #f8fafc;
        --fg: #0f172a;
        --muted: #64748b;
        --card: #ffffff;
        --card-soft: #f1f5f9;
        --border: rgba(15, 23, 42, .1);
        --code-bg: #0f172a;
        --code-fg: #e2e8f0;
        --accent: #7c3aed;
        --accent-2: #06b6d4;
        --hero-glow: rgba(124, 58, 237, .22);
        --orb-glow: rgba(6, 182, 212, .16);
        --grid-opacity: .22;
        --shadow: 0 24px 80px rgba(15, 23, 42, .12);
        --lumina-constellation-color: rgba(15, 23, 42, .42);
        --lumina-constellation-line-color: rgba(6, 182, 212, .38);
        --lumina-transition-bg: #f8fafc;
        --lumina-transition-glow: rgba(124, 58, 237, .34);
        --lumina-transition-glow-secondary: rgba(6, 182, 212, .26);
        --lumina-transition-sheen: rgba(15, 23, 42, .38);
        --lumina-storm-color: rgba(15, 23, 42, .42);
        --lumina-storm-glow: rgba(6, 182, 212, .38);
    }

    :root[data-theme="dark"] {
        --bg: #020617;
        --fg: #e2e8f0;
        --muted: #94a3b8;
        --card: #0f172a;
        --card-soft: #111827;
        --border: rgba(226, 232, 240, .1);
        --code-bg: #020617;
        --code-fg: #e2e8f0;
        --accent: #a78bfa;
        --accent-2: #22d3ee;
        --hero-glow: rgba(34, 211, 238, .18);
        --orb-glow: rgba(167, 139, 250, .16);
        --grid-opacity: .14;
        --shadow: 0 24px 80px rgba(0, 0, 0, .35);
        --lumina-constellation-color: rgba(226, 232, 240, .58);
        --lumina-constellation-line-color: rgba(34, 211, 238, .48);
        --lumina-transition-bg: #020617;
        --lumina-transition-glow: rgba(167, 139, 250, .36);
        --lumina-transition-glow-secondary: rgba(34, 211, 238, .28);
        --lumina-transition-sheen: rgba(255, 255, 255, .38);
        --lumina-storm-color: rgba(226, 232, 240, .72);
        --lumina-storm-glow: rgba(34, 211, 238, .48);
    }

    * {
        box-sizing: border-box;
    }

    button,
    input {
        font: inherit;
    }

    button {
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        cursor: pointer;
        font-weight: 800;
        color: #ffffff;
        background:
            linear-gradient(135deg, var(--accent), var(--accent-2));
        box-shadow: 0 16px 40px rgba(0, 0, 0, .16);
        transition:
            transform .18s ease,
            box-shadow .18s ease,
            opacity .18s ease;
    }

    button:hover {
        transform: translateY(-1px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, .2);
    }

    button:active {
        transform: translateY(0) scale(.98);
    }

    input {
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 12px 16px;
        min-width: 240px;
        background: var(--card-soft);
        color: var(--fg);
        outline: none;
    }

    input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 22%, transparent);
    }

    .app {
        min-height: 100vh;
        position: relative;
        z-index: 1;
    }

    .app::before {
        content: "";
        position: fixed;
        inset: -20%;
        z-index: -1;
        pointer-events: none;
        background:
            radial-gradient(
                circle at 18% 12%,
                color-mix(
                    in srgb,
                    var(--accent) 32%,
                    transparent
                ),
                transparent 34rem
            ),
            radial-gradient(
                circle at 82% 18%,
                color-mix(
                    in srgb,
                    var(--accent-2) 32%,
                    transparent
                ),
                transparent 32rem
            ),
            radial-gradient(
                circle at 50% 92%,
                color-mix(
                    in srgb,
                    #7c3aed 28%,
                    transparent
                ),
                transparent 36rem
            );
        opacity: 1;
    }

    .container {
        width: min(1240px, calc(100% - 32px));
        margin: 0 auto;
    }

    .nav {
        position: sticky;
        top: 0;
        z-index: 9999;
        backdrop-filter: blur(18px);
        background: color-mix(in srgb, var(--bg) 58%, transparent);
        border-bottom: 1px solid var(--border);
    }

    .nav-inner {
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 900;
        letter-spacing: -.04em;
    }

    .brand-mark {
        width: 38px;
        height: 38px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        color: #ffffff;
        background:
            radial-gradient(circle at 35% 25%, rgba(255,255,255,.6), transparent 28%),
            linear-gradient(135deg, var(--accent), var(--accent-2));
        box-shadow: 0 16px 40px color-mix(in srgb, var(--accent) 28%, transparent);
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .ghost-button {
        color: var(--fg);
        background: var(--card);
        border: 1px solid var(--border);
        box-shadow: none;
        border-radius: 999px;
    }

    .hero {
        padding: 56px 0 64px;
    }

    .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
        align-items: center;
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--accent);
        background: color-mix(in srgb, var(--accent) 12%, transparent);
        border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
        border-radius: 999px;
        padding: 8px 12px;
        font-weight: 800;
        font-size: 14px;
    }

    .hero h1 {
        margin: 20px 0 16px;
        font-size: clamp(44px, 7vw, 86px);
        line-height: 1;
        letter-spacing: -.035em;
    }

    .hero p {
        margin: 0;
        max-width: 680px;
        color: var(--muted);
        font-size: 18px;
        line-height: 1.7;
    }

    .hero-actions {
        margin-top: 28px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .hero-card {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 32px;
        padding: 24px;
        background:
            linear-gradient(
                180deg,
                color-mix(in srgb, var(--card) 92%, transparent),
                color-mix(in srgb, var(--card-soft) 92%, transparent)
            );
        box-shadow: var(--shadow);
    }

    .terminal {
        overflow: hidden;
        border-radius: 22px;
        border: 1px solid var(--border);
        background:
            linear-gradient(
                180deg,
                color-mix(in srgb, var(--code-bg) 90%, transparent),
                color-mix(in srgb, var(--code-bg) 96%, transparent)
            );
        color: var(--code-fg);
    }

    .terminal-header {
        display: flex;
        gap: 6px;
        padding: 14px;
        border-bottom: 1px solid rgba(255,255,255,.08);
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: rgba(255,255,255,.35);
    }

    pre {
        margin: 0;
        padding: 18px;
        overflow-x: auto;
        font-size: 13px;
        line-height: 1.7;
    }

    code {
        font-family:
            "SFMono-Regular",
            Consolas,
            "Liberation Mono",
            monospace;
    }

    .section {
        padding: 40px 0;
    }

    .section-header {
        margin-bottom: 22px;
    }

    .section-header h2 {
        margin: 0 0 8px;
        font-size: clamp(28px, 4vw, 44px);
        letter-spacing: -.05em;
    }

    .section-header p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
    }

    .parallax-band {
        position: relative;
        z-index: 2;
        overflow: hidden;
        min-height: 340px;
        display: grid;
        place-items: center;
        margin: 64px 0;
        border-block: 1px solid var(--border);
        isolation: isolate;
        background:
            linear-gradient(
                135deg,
                color-mix(in srgb, var(--accent) 18%, var(--bg)),
                color-mix(in srgb, var(--accent-2) 14%, var(--bg))
            );
        background-position: center;
        background-size: cover;
    }

    .parallax-band::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 2;
        opacity: .22;
    }

    .parallax-band::after {
        content: "";
        position: absolute;
        inset: -25%;
        z-index: 2;
        opacity: .95;

        background-attachment: fixed;
        background-position: center;

        background-image:
            radial-gradient(
                circle at 20% 30%,
                color-mix(in srgb, var(--accent) 46%, transparent),
                transparent 24rem
            ),
            radial-gradient(
                circle at 80% 70%,
                color-mix(in srgb, var(--accent-2) 42%, transparent),
                transparent 26rem
            );
    }

    .parallax-band-bg,
    .parallax-band-orb,
    .parallax-band-grid {
        display: none;
    }

    .parallax-band-content {
        position: relative;
        z-index: 2;
        text-align: center;
    }

    .parallax-band-content span {
        display: inline-block;
        font-size: clamp(36px, 6vw, 78px);
        line-height: 1.5;
        font-weight: 950;
        letter-spacing: -.055em;
        background:
            linear-gradient(
                135deg,
                var(--fg),
                color-mix(in srgb, var(--accent-2) 74%, var(--fg))
            );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .parallax-band-content p {
        margin: 16px auto 0;
        max-width: 640px;
        color: var(--muted);
        font-size: 18px;
        line-height: 1.7;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
    }

    .card {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 28px;
        padding: 22px;
        background: var(--card);
        box-shadow: var(--shadow);
    }

    .dropdown-card {
        overflow: visible !important;
        z-index: 30;
    }

    .dropdown-card .refresh-overlay {
        overflow: hidden;
        border-radius: inherit;
    }

    .dropdown-card .refresh-content {
        position: relative;
        z-index: 20;
    }

    .dropdown-card .demo-row {
        position: relative;
        z-index: 50;
    }

    .dropdown-card .dropdown-wrapper {
        position: relative;
        z-index: 60;
    }

    .dropdown-card [data-lumina-dropdown-menu] {
        position: absolute;
        z-index: 999;
    }

    .card h3 {
        margin: 0 0 8px;
        letter-spacing: -.03em;
    }

    .card p {
        color: var(--muted);
        line-height: 1.65;
    }

    .refresh-overlay {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: 8;
    }

    .refresh-content {
        position: relative;
        z-index: 4;
    }

    .hero-card.lumina-spotlight::before,
    .card.lumina-spotlight::before {
        border-radius: inherit;
        z-index: 3;
    }

    .hero-card.lumina-spotlight > .refresh-overlay,
    .card.lumina-spotlight > .refresh-overlay {
        z-index: 8;
    }

    .hero-card.lumina-spotlight > .refresh-content,
    .card.lumina-spotlight > .refresh-content {
        z-index: 4;
    }

    .hero-card .terminal,
    .card .terminal {
        position: relative;
        z-index: 4;
    }

    .terminal.lumina-spotlight::before {
        z-index: 1;
    }

    .terminal.lumina-spotlight > * {
        position: relative;
        z-index: 2;
    }

    .demo-row {
        position: relative;
        z-index: 9;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        margin-top: 18px;
    }

    .toast-demo-row {
        align-items: stretch;
    }

    .toast-demo-button {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        border: 1px solid var(--toast-demo-border);
        color: #ffffff;
        background:
            linear-gradient(
                135deg,
                var(--toast-demo-start),
                var(--toast-demo-end)
            );
        box-shadow:
            0 16px 40px var(--toast-demo-shadow);
    }

    .toast-demo-button::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        opacity: .95;
        background:
            radial-gradient(
                circle at 18% 22%,
                var(--toast-demo-glow),
                transparent 34%
            ),
            radial-gradient(
                circle at 86% 78%,
                rgba(255, 255, 255, .16),
                transparent 36%
            );
    }

    .toast-demo-button::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        opacity: .14;
        background-image:
            linear-gradient(
                rgba(255, 255, 255, .36) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(255, 255, 255, .36) 1px,
                transparent 1px
            );
        background-size: 18px 18px;
    }

    .toast-demo-button:hover {
        box-shadow:
            0 20px 50px var(--toast-demo-shadow);
    }

    .toast-demo-button-success {
        --toast-demo-start: #16a34a;
        --toast-demo-end: #22c55e;
        --toast-demo-glow: rgba(187, 247, 208, .32);
        --toast-demo-border: rgba(34, 197, 94, .46);
        --toast-demo-shadow: rgba(34, 197, 94, .24);
    }

    .toast-demo-button-info {
        --toast-demo-start: #0891b2;
        --toast-demo-end: #06b6d4;
        --toast-demo-glow: rgba(165, 243, 252, .34);
        --toast-demo-border: rgba(6, 182, 212, .48);
        --toast-demo-shadow: rgba(6, 182, 212, .24);
    }

    .toast-demo-button-error {
        --toast-demo-start: #dc2626;
        --toast-demo-end: #ef4444;
        --toast-demo-glow: rgba(254, 202, 202, .32);
        --toast-demo-border: rgba(239, 68, 68, .48);
        --toast-demo-shadow: rgba(239, 68, 68, .24);
    }


    .cascade-demo-controls {
        margin-top: 18px;
    }

    .cascade-demo-list.is-cascade-demo-hidden {
        pointer-events: none;
    }

    .cascade-demo-list {
        display: grid;
        gap: 8px;
        width: min(100%, 260px);
    }

    .cascade-demo-list span {
        display: block;
        padding: 10px 14px;
        border-radius: 14px;
        border: 1px solid var(--border);
        color: var(--fg);
        background:
            linear-gradient(
                135deg,
                color-mix(in srgb, var(--accent) 12%, var(--card)),
                color-mix(in srgb, var(--accent-2) 10%, var(--card))
            );
        box-shadow:
            0 12px 30px rgba(0, 0, 0, .10);
        font-size: 14px;
        font-weight: 800;
    }

    .dropdown-wrapper {
        position: relative;
        display: inline-block;
    }

    [data-lumina-dropdown-menu][hidden] {
        display: none;
    }

    .dropdown-menu {
        min-width: 240px;
        padding: 14px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: var(--card);
        color: var(--fg);
        box-shadow: var(--shadow);
    }

    .dropdown-menu p {
        margin-bottom: 0;
    }

    .password-demo {
        position: relative;
        z-index: 9;
        display: grid;
        gap: 12px;
        justify-items: start;
        margin-top: 18px;
    }

    .switch-demo {
        position: relative;
        z-index: 9;
        display: grid;
        gap: 14px;
        margin-top: 18px;
    }

    .switch-demo-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .switch-demo-actions button {
        padding: 10px 14px;
    }

    .switch-demo-panel {
        min-height: 118px;
        border-radius: 20px;
        border: 1px solid var(--border);
        padding: 18px;
        background:
            linear-gradient(
                135deg,
                color-mix(in srgb, var(--accent) 12%, var(--card)),
                color-mix(in srgb, var(--accent-2) 10%, var(--card))
            );
        box-shadow:
            0 16px 40px rgba(0, 0, 0, .12);
    }

    .switch-demo-panel p {
        margin-bottom: 0;
    }

    .status-card {
        position: relative;
        overflow: hidden;
        margin-top: 18px;
        border-radius: 22px;
        padding: 20px;
        background:
            linear-gradient(
                135deg,
                color-mix(in srgb, var(--card-soft) 88%, transparent),
                var(--card)
            );
        border: 1px solid var(--border);
    }

    .status-card-content {
        position: relative;
        z-index: 4;
    }

    .accessibility-card {
        min-height: 420px;
    }

    .accessibility-group {
        margin-top: 20px;
        padding: 18px;
        border-radius: 20px;
        border: 1px solid var(--border);
        background:
            color-mix(in srgb, var(--card-soft) 72%, transparent);
    }

    .accessibility-group strong {
        display: block;
        margin-bottom: 12px;
    }

    .accessibility-demo-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .accessibility-demo-grid button {
        padding: 10px 14px;
        font-size: 14px;
        color: var(--fg);
        background: var(--card);
        border: 1px solid var(--border);
        box-shadow: none;
    }

    .accessibility-demo-grid button:hover {
        box-shadow:
            0 16px 36px rgba(0, 0, 0, .14);
    }

    .accessibility-demo-grid button.is-accessibility-active {
        color: #ffffff;
        border-color:
            color-mix(
                in srgb,
                var(--accent) 46%,
                transparent
            );
        background:
            linear-gradient(
                135deg,
                var(--accent),
                var(--accent-2)
            );
        box-shadow:
            0 16px 40px
            color-mix(
                in srgb,
                var(--accent) 24%,
                transparent
            );
    }

    .accessibility-demo-grid button.is-accessibility-active:hover {
        box-shadow:
            0 20px 50px
            color-mix(
                in srgb,
                var(--accent) 30%,
                transparent
            );
    }

    .transition-demo-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        cursor: pointer;
        font-weight: 800;
        color: #ffffff;
        text-decoration: none;
        background:
            linear-gradient(
                135deg,
                var(--accent),
                var(--accent-2)
            );
        box-shadow:
            0 16px 40px rgba(0, 0, 0, .16);
        transition:
            transform .18s ease,
            box-shadow .18s ease,
            opacity .18s ease;
    }

    .transition-demo-link:hover {
        transform: translateY(-1px);
        box-shadow:
            0 20px 50px rgba(0, 0, 0, .2);
    }

    .constellation-card {
        min-height: 360px;
        position: relative;
        overflow: hidden;
        isolation: isolate;
        --lumina-constellation-color: color-mix(in srgb, var(--fg) 74%, transparent);
        --lumina-constellation-line-color: color-mix(in srgb, var(--accent-2) 62%, transparent);
        background:
            radial-gradient(
                circle at 18% 22%,
                color-mix(in srgb, var(--accent) 18%, var(--card)),
                transparent 22rem
            ),
            radial-gradient(
                circle at 84% 82%,
                color-mix(in srgb, var(--accent-2) 16%, var(--card)),
                transparent 22rem
            ),
            var(--card);
    }

    .constellation-card > .lumina-constellation-canvas {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 1;
    }

    .constellation-card .refresh-overlay {
        z-index: 3;
    }

    .constellation-card .refresh-content {
        position: relative;
        z-index: 4;
    }

    .constellation-demo-panel {
        position: relative;
        z-index: 4;
        margin-top: 20px;
        padding: 18px;
        border-radius: 20px;
        border: 1px solid var(--border);
        background:
            color-mix(in srgb, var(--card) 72%, transparent);
        backdrop-filter: blur(12px);
    }

    .constellation-demo-panel p {
        margin-bottom: 0;
    }

    .storm-card {
        min-height: 360px;
        position: relative;
        overflow: hidden;
        isolation: isolate;
        --lumina-storm-color: color-mix(in srgb, var(--fg) 74%, transparent);
        --lumina-storm-glow: color-mix(in srgb, var(--accent-2) 58%, transparent);
        background:
            radial-gradient(
                circle at 18% 22%,
                color-mix(in srgb, var(--accent) 18%, var(--card)),
                transparent 22rem
            ),
            radial-gradient(
                circle at 84% 82%,
                color-mix(in srgb, var(--accent-2) 16%, var(--card)),
                transparent 22rem
            ),
            var(--card);
    }

    .storm-card > .lumina-storm-canvas {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 1;
    }

    .storm-card .refresh-overlay {
        z-index: 3;
    }

    .storm-card .refresh-content {
        position: relative;
        z-index: 4;
    }

    .storm-demo-panel {
        position: relative;
        z-index: 4;
        margin-top: 20px;
        padding: 18px;
        border-radius: 20px;
        border: 1px solid var(--border);
        background:
            color-mix(in srgb, var(--card) 72%, transparent);
        backdrop-filter: blur(12px);
    }

    .storm-demo-panel p {
        margin-bottom: 0;
    }

    .spotlight-preview {
        margin-top: 18px;
        min-height: 120px;
        border-radius: 22px;
        padding: 20px;
        border: 1px solid var(--border);
        background:
            linear-gradient(
                135deg,
                color-mix(in srgb, var(--accent) 14%, var(--card)),
                var(--card)
            );
    }

    .plugin-list {
        display: grid;
        gap: 12px;
        margin-top: 18px;
    }

    .plugin-item {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 16px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: var(--card-soft);
    }

    .tag {
        color: var(--accent);
        font-size: 24px;
        line-height: 2;
        font-weight: 900;
    }

    .footer {
        position: relative;
        z-index: 2;
        margin-top: 56px;
        border-top: 1px solid var(--border);
    }

    .footer-inner {
        min-height: 84px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        color: var(--muted);
        font-size: 14px;
    }

    .footer-github-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 16px;
        color: var(--fg);
        text-decoration: none;
        font-size: 14px;
        transition:
            transform .18s ease,
            box-shadow .18s ease,
            opacity .18s ease;
    }

    .footer-github-link:hover {
        color: var(--fg);
        transform: translateY(-1px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, .2);
    }

    .footer-github-link:active {
        transform: translateY(0) scale(.98);
    }

    .footer-github-icon {
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
    }

    @media (max-width: 640px) {
        .footer-inner {
            min-height: 96px;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
        }
    }

    @media (max-width: 860px) {
        .hero-grid,
        .grid {
            grid-template-columns: 1fr;
        }

        .nav-inner {
            height: auto;
            padding: 16px 0;
            align-items: flex-start;
            flex-direction: column;
        }

        .hero {
            padding-top: 56px;
        }

        .parallax-band {
            margin: 32px 0;
            min-height: 260px;
        }

        .parallax-band::after {
            background-attachment: scroll;
        }
    }

    /* Site / landing page refinements */

    html {
        scroll-behavior: smooth;
    }

    .brand {
        color: var(--fg);
        text-decoration: none;
    }

    .nav-inner {
        min-height: 72px;
        height: auto;
        padding: 12px 0;
    }

    .nav-links {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-left: auto;
    }

    .nav-links a {
        color: var(--muted);
        text-decoration: none;
        font-size: 14px;
        font-weight: 800;
        border-radius: 999px;
        padding: 9px 12px;
        transition:
            color .18s ease,
            background .18s ease,
            transform .18s ease;
    }

    .nav-links a:hover {
        color: var(--fg);
        background:
            color-mix(
                in srgb,
                var(--accent) 10%,
                transparent
            );
        transform: translateY(-1px);
    }

    .nav-actions {
        margin-left: 8px;
    }

    .nav-actions button {
        padding: 10px 14px;
        font-size: 14px;
    }

    .hero {
        min-height: calc(100vh - 72px);
        display: grid;
        align-items: center;
        padding: 46px 0 72px;
    }

    .hero-copy {
        position: relative;
        z-index: 2;
    }

    .hero h1 {
        max-width: 780px;
        font-size: clamp(48px, 8vw, 104px);
        letter-spacing: -.065em;
    }

    .hero p {
        max-width: 720px;
        font-size: 19px;
    }

    .primary-link,
    .secondary-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 12px 18px;
        font-weight: 900;
        text-decoration: none;
        transition:
            transform .18s ease,
            box-shadow .18s ease,
            background .18s ease;
    }

    .primary-link {
        color: #ffffff;
        background:
            linear-gradient(
                135deg,
                var(--accent),
                var(--accent-2)
            );
        box-shadow:
            0 18px 44px
            color-mix(
                in srgb,
                var(--accent) 22%,
                transparent
            );
    }

    .secondary-link {
        color: var(--fg);
        background:
            color-mix(
                in srgb,
                var(--card) 78%,
                transparent
            );
        border: 1px solid var(--border);
        backdrop-filter: blur(12px);
    }

    .primary-link:hover,
    .secondary-link:hover {
        transform: translateY(-1px);
        box-shadow:
            0 20px 52px
            color-mix(
                in srgb,
                var(--accent) 18%,
                transparent
            );
    }

    .hero-metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 30px;
    }

    .hero-metric {
        min-width: 130px;
        border: 1px solid var(--border);
        border-radius: 22px;
        padding: 14px 16px;
        background:
            color-mix(
                in srgb,
                var(--card) 70%,
                transparent
            );
        backdrop-filter: blur(12px);
    }

    .hero-metric strong {
        display: block;
        font-size: 22px;
        letter-spacing: -.04em;
    }

    .hero-metric span {
        display: block;
        margin-top: 4px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 800;
    }

    .hero-preview-card {
        display: grid;
        gap: 14px;
    }

    .preview-status {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: #22c55e;
        box-shadow:
            0 0 0 6px rgba(34, 197, 94, .12),
            0 0 24px rgba(34, 197, 94, .6);
    }

    .mini-button {
        margin-left: auto;
        padding: 8px 12px;
        font-size: 12px;
    }

    .section {
        padding: 84px 0;
    }

    .section-header-centered {
        max-width: 760px;
        margin-inline: auto;
        text-align: center;
    }

    .section-kicker {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        margin-bottom: 12px;
        border-radius: 999px;
        padding: 8px 12px;
        color: var(--accent);
        background:
            color-mix(
                in srgb,
                var(--accent) 10%,
                transparent
            );
        border:
            1px solid
            color-mix(
                in srgb,
                var(--accent) 20%,
                transparent
            );
        font-size: 13px;
        font-weight: 900;
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        margin-top: 28px;
    }

    .feature-card {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 30px;
        padding: 24px;
        background:
            linear-gradient(
                180deg,
                color-mix(in srgb, var(--card) 84%, transparent),
                color-mix(in srgb, var(--card-soft) 76%, transparent)
            );
        box-shadow: var(--shadow);
    }

    .feature-icon {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        margin-bottom: 18px;
        color: #ffffff;
        background:
            linear-gradient(
                135deg,
                var(--accent),
                var(--accent-2)
            );
        box-shadow:
            0 18px 44px
            color-mix(
                in srgb,
                var(--accent) 26%,
                transparent
            );
        font-size: 22px;
    }

    .feature-card h3 {
        margin: 0 0 8px;
        letter-spacing: -.035em;
    }

    .feature-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
    }

    .docs-grid {
        display: grid;
        grid-template-columns: .85fr 1.15fr;
        gap: 28px;
        align-items: center;
    }

    .docs-copy h2 {
        margin: 0 0 14px;
        font-size: clamp(32px, 5vw, 58px);
        line-height: 1;
        letter-spacing: -.06em;
    }

    .docs-copy p {
        margin: 0;
        color: var(--muted);
        font-size: 18px;
        line-height: 1.75;
    }

    .install-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 24px;
    }

    .install-pills code {
        display: inline-flex;
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 9px 12px;
        color: var(--fg);
        background:
            color-mix(
                in srgb,
                var(--card) 82%,
                transparent
            );
        font-size: 13px;
        font-weight: 800;
    }

    .final-cta {
        padding: 20px 0 28px;
    }

    .final-cta-card {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 36px;
        padding: clamp(28px, 6vw, 58px);
        text-align: center;
        background:
            radial-gradient(
                circle at 20% 20%,
                color-mix(in srgb, var(--accent) 18%, transparent),
                transparent 26rem
            ),
            radial-gradient(
                circle at 84% 74%,
                color-mix(in srgb, var(--accent-2) 16%, transparent),
                transparent 26rem
            ),
            color-mix(
                in srgb,
                var(--card) 82%,
                transparent
            );
        box-shadow: var(--shadow);
    }

    .final-cta-card h2 {
        max-width: 850px;
        margin: 0 auto 14px;
        font-size: clamp(34px, 6vw, 72px);
        line-height: .98;
        letter-spacing: -.065em;
    }

    .final-cta-card p {
        max-width: 720px;
        margin: 0 auto;
        color: var(--muted);
        font-size: 18px;
        line-height: 1.75;
    }

    .final-cta-actions {
        justify-content: center;
    }

    .footer {
        border-top: 1px solid var(--border);
        background:
            color-mix(
                in srgb,
                var(--bg) 72%,
                transparent
            );
        backdrop-filter: blur(14px);
    }

    .footer-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
    }

    .footer-inner span {
        color: var(--muted);
    }

    .card,
    .feature-card,
    .hero-card,
    .plugin-item,
    .final-cta-card {
        backdrop-filter: blur(14px);
    }

    .plugin-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 1080px) {
        .nav-links {
            display: none;
        }

        .feature-grid,
        .docs-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 640px) {
        .hero-actions,
        .hero-metrics,
        .nav-actions,
        .install-pills,
        .final-cta-actions {
            width: 100%;
        }

        .hero-actions > *,
        .nav-actions > *,
        .final-cta-actions > * {
            width: 100%;
        }

        .primary-link,
        .secondary-link {
            width: 100%;
        }

        .hero-metric {
            width: 100%;
        }

        .plugin-list {
            grid-template-columns: 1fr;
        }

        .footer-inner {
            align-items: flex-start;
            flex-direction: column;
        }
    }

`;

export function injectPlaygroundStyles(): void {

    const existingStyle =
        document.getElementById(
            "lumina-playground-styles"
        );

    if (existingStyle) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "lumina-playground-styles";

    style.textContent =
        playgroundStyles;

    document.head.appendChild(
        style
    );

}