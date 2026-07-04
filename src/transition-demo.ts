import { Lumina } from "./core";
import {
    ThemePlugin,
    TransitionPlugin
} from "./plugins";

const style =
    document.createElement("style");

style.textContent = `
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

    :root[data-theme="light"] {
        --bg: #f8fafc;
        --fg: #0f172a;
        --muted: #64748b;
        --card: #ffffff;
        --border: rgba(15, 23, 42, .1);
        --accent: #7c3aed;
        --accent-2: #06b6d4;
        --shadow: 0 24px 80px rgba(15, 23, 42, .12);

        --lumina-transition-bg: #f8fafc;
        --lumina-transition-glow: rgba(124, 58, 237, .34);
        --lumina-transition-glow-secondary: rgba(6, 182, 212, .26);
        --lumina-transition-sheen: rgba(15, 23, 42, .38);
    }

    :root[data-theme="dark"] {
        --bg: #020617;
        --fg: #e2e8f0;
        --muted: #94a3b8;
        --card: #0f172a;
        --border: rgba(226, 232, 240, .1);
        --accent: #a78bfa;
        --accent-2: #22d3ee;
        --shadow: 0 24px 80px rgba(0, 0, 0, .35);

        --lumina-transition-bg: #020617;
        --lumina-transition-glow: rgba(167, 139, 250, .36);
        --lumina-transition-glow-secondary: rgba(34, 211, 238, .28);
        --lumina-transition-sheen: rgba(255, 255, 255, .38);
    }

    * {
        box-sizing: border-box;
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
    }

    body::before {
        z-index: -2;
        background:
            radial-gradient(
                circle at 20% 10%,
                color-mix(
                    in srgb,
                    var(--accent) 26%,
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
            ),
            var(--bg);
    }

    body::after {
        z-index: -1;
        opacity: .12;
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

    main {
        position: relative;
        z-index: 1;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 32px;
        overflow: hidden;
    }

    main::before {
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
        opacity: .9;
    }

    .demo-card {
        width: min(760px, 100%);
        position: relative;
        overflow: hidden;
        border-radius: 32px;
        border: 1px solid var(--border);
        padding: clamp(28px, 6vw, 56px);
        background:
            linear-gradient(
                180deg,
                color-mix(in srgb, var(--card) 92%, transparent),
                color-mix(in srgb, var(--card) 78%, transparent)
            );
        box-shadow: var(--shadow);
        text-align: center;
        backdrop-filter: blur(16px);
    }

    .demo-card::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
            radial-gradient(
                circle at 20% 20%,
                color-mix(in srgb, var(--accent) 26%, transparent),
                transparent 18rem
            ),
            radial-gradient(
                circle at 85% 80%,
                color-mix(in srgb, var(--accent-2) 20%, transparent),
                transparent 18rem
            );
    }

    .demo-content {
        position: relative;
        z-index: 1;
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

    h1 {
        margin: 20px 0 12px;
        font-size: clamp(38px, 7vw, 76px);
        line-height: 1;
        letter-spacing: -.055em;
    }

    p {
        margin: 0 auto;
        max-width: 560px;
        color: var(--muted);
        font-size: 18px;
        line-height: 1.7;
    }

    .actions {
        margin-top: 28px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
    }

    a,
    button {
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        cursor: pointer;
        font: inherit;
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

    a:hover,
    button:hover {
        transform: translateY(-1px);
        box-shadow:
            0 20px 50px rgba(0, 0, 0, .2);
    }

    a:active,
    button:active {
        transform: translateY(0) scale(.98);
    }

    .ghost-button {
        color: var(--fg);
        background: var(--card);
        border: 1px solid var(--border);
        box-shadow: none;
    }

    @media (max-width: 640px) {
        main {
            padding: 20px;
        }

        .actions {
            align-items: stretch;
            flex-direction: column;
        }

        a,
        button {
            width: 100%;
        }
    }
`;

document.head.appendChild(style);

async function main(): Promise<void> {

    document.body.innerHTML = `
        <main>
            <section class="demo-card">
                <div class="demo-content">
                    <span class="eyebrow">
                        TransitionPlugin
                    </span>

                    <h1>
                        Página de exemplo
                    </h1>

                    <p>
                        Essa página existe só para testar a transição real
                        entre documentos usando o LuminaFX.
                    </p>

                    <div class="actions">
                        <a
                            href="./index.html"
                            data-lumina-transition
                            data-lumina-transition-effect="glow"
                        >
                            Voltar para o playground
                        </a>

                        <button
                            class="ghost-button"
                            data-lumina-theme-toggle
                            type="button"
                        >
                            Alternar tema
                        </button>
                    </div>
                </div>
            </section>
        </main>
    `;

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
            new TransitionPlugin({
                effect: "glow",
                duration: 720,
                enterDuration: 220,
                navigateDelay: 720,
                enterOnLoad: true
            })
        )
        .start();

}

main();