export function createPlaygroundTemplate(): string {

    return `
        <div
            class="ambient-background ambient-background-constellation"
            data-lumina-background="constellation"
            data-lumina-constellation
            data-lumina-constellation-mode="background"
        ></div>

        <div
            class="ambient-background ambient-background-storm"
            data-lumina-background="storm"
            data-lumina-storm
            data-lumina-storm-mode="background"
        ></div>

        <main class="app" id="main-content">
            <nav class="nav">
                <div class="container nav-inner">
                    <a
                        class="brand"
                        href="#home"
                        aria-label="Ir para o início"
                    >
                        <div class="brand-mark">✦</div>

                        <span>LuminaFX</span>
                    </a>

                    <div class="nav-links" aria-label="Navegação principal">
                        <a href="#features">Recursos</a>
                        <a href="#plugins">Plugins</a>
                        <a href="#install">Instalação</a>
                        <a href="#accessibility">Acessibilidade</a>
                    </div>

                    <div class="nav-actions">
                        <button
                            class="ghost-button ambient-toggle-button"
                            id="toggle-ambient-background"
                            type="button"
                        >
                            Background: Constellation
                        </button>

                        <button
                            class="ghost-button"
                            data-lumina-theme-toggle
                            type="button"
                        >
                            Alternar tema
                        </button>
                    </div>
                </div>
            </nav>

            <section class="hero" id="home">
                <div class="container hero-grid">
                    <div class="hero-copy">
                        <span class="eyebrow">
                            Biblioteca visual modular em TypeScript
                        </span>

                        <h1>
                            Premium UI effects for modern frontends.
                        </h1>

                        <p>
                            LuminaFX reúne efeitos visuais, microinterações,
                            transições, feedbacks e controles de acessibilidade
                            em uma arquitetura baseada em plugins.
                        </p>

                        <div class="hero-actions">
                            <a
                                class="primary-link"
                                href="#plugins"
                            >
                                Ver plugins
                            </a>

                            <a
                                class="secondary-link"
                                href="#install"
                            >
                                Começar agora
                            </a>

                            <button
                                class="ghost-button"
                                id="pulse-all"
                                type="button"
                            >
                                Simular atualização
                            </button>
                        </div>

                        <div class="hero-metrics" aria-label="Resumo do projeto">
                            <div class="hero-metric">
                                <strong>13+</strong>
                                <span>plugins</span>
                            </div>

                            <div class="hero-metric">
                                <strong>0 deps</strong>
                                <span>core independente</span>
                            </div>

                            <div class="hero-metric">
                                <strong>TS</strong>
                                <span>tipado e modular</span>
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

                        <div class="hero-preview-header refresh-content">
                            <span class="preview-status"></span>
                            <strong>Live preview</strong>
                            <button
                                class="ghost-button mini-button"
                                id="pulse-hero"
                                type="button"
                            >
                                Atualizar
                            </button>
                        </div>

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
                        <span class="section-kicker">Por que LuminaFX?</span>

                        <h2>
                            Efeitos bonitos, reutilizáveis e fáceis de encaixar.
                        </h2>

                        <p>
                            O objetivo é entregar uma camada visual premium sem prender
                            seu projeto a um framework específico.
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
                                Use só o que precisar. Cada plugin é independente,
                                configurável e inicializado pelo core.
                            </p>
                        </article>

                        <article
                            class="feature-card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <span class="feature-icon">🎛</span>
                            <h3>Declarativo ou programático</h3>
                            <p>
                                Conecte via data attributes no HTML ou controle
                                diretamente pela API do plugin.
                            </p>
                        </article>

                        <article
                            class="feature-card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <span class="feature-icon">♿</span>
                            <h3>Acessibilidade integrada</h3>
                            <p>
                                Inclui controles de leitura, contraste, foco,
                                redução de movimento e filtros visuais.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="parallax-band parallax-band-a">
                <div class="container parallax-band-content">
                    <span>Effects that feel alive.</span>
                    <p>
                        Transições, feedbacks e microinterações trabalhando juntos
                        para deixar qualquer interface mais fluida.
                    </p>
                </div>
            </section>

            <section class="section" id="plugins">
                <div class="container">
                    <div class="section-header">
                        <span class="section-kicker">Showcase interativo</span>

                        <h2>
                            Plugins disponíveis
                        </h2>

                        <p>
                            Os cards abaixo não são imagens: cada demonstração está
                            rodando com o próprio plugin da LuminaFX.
                        </p>
                    </div>

                    <div class="grid" data-lumina-cascade>
                        <article
                            class="card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">ThemePlugin</span>
                                <h3>Tema com View Transition</h3>
                                <p>
                                    Alterna entre light/dark usando uma transição radial suave
                                    baseada na posição real do clique.
                                </p>
                            </div>

                            <div class="demo-row">
                                <button
                                    data-lumina-theme-toggle
                                    type="button"
                                >
                                    Alternar tema
                                </button>
                            </div>
                        </article>

                        <article
                            class="card dropdown-card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">DropdownPlugin</span>
                                <h3>Dropdown com glow</h3>
                                <p>
                                    Dropdown independente, com fechamento por clique externo,
                                    Escape, posicionamento configurável e efeito opcional.
                                </p>
                            </div>

                            <div class="demo-row">
                                <div class="dropdown-wrapper">
                                    <button
                                        data-lumina-dropdown-trigger="docs-menu"
                                        type="button"
                                    >
                                        Abrir documentação
                                    </button>

                                    <div
                                        class="dropdown-menu"
                                        data-lumina-dropdown-menu="docs-menu"
                                        data-lumina-dropdown-placement="bottom"
                                    >
                                        <strong>Dropdown Lumina</strong>
                                        <p>
                                            Esse menu foi conectado automaticamente pelo plugin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">PasswordVisibilityPlugin</span>
                                <h3>Visibilidade de senha</h3>
                                <p>
                                    Alterna campos de senha sem depender de IDs internos do framework.
                                    O alvo é definido pelo HTML.
                                </p>
                            </div>

                            <div class="password-demo">
                                <label for="demo-password">
                                    Senha de demonstração
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
                                    Mostrar senha
                                </button>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">ShimmerPlugin</span>
                                <h3>Feedback de atualização</h3>
                                <p>
                                    Dispare o shimmer quando um elemento for atualizado por API,
                                    WebSocket, cache ou qualquer fluxo do seu sistema.
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
                                    <strong>Status do sistema</strong>
                                    <p
                                        id="status-text"
                                        style="margin-bottom: 0;"
                                    >
                                        Aguardando atualização...
                                    </p>
                                </div>
                            </div>

                            <div class="demo-row">
                                <button
                                    id="simulate-update"
                                    type="button"
                                >
                                    Simular atualização
                                </button>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">CascadePlugin</span>
                                <h3>Animação em cascata</h3>
                                <p>
                                    Revela grupos de elementos em sequência, aplicando atraso progressivo
                                    entre os itens para criar uma entrada fluida.
                                </p>
                            </div>

                            <div class="demo-row cascade-demo-controls">
                                <button
                                    class="ghost-button"
                                    id="toggle-cascade-demo"
                                    type="button"
                                    aria-expanded="true"
                                >
                                    Ocultar itens
                                </button>
                            </div>

                            <div class="demo-row">
                                <div
                                    class="cascade-demo-list"
                                    id="cascade-demo-list"
                                    data-lumina-cascade
                                    data-lumina-cascade-once="false"
                                >
                                    <span data-lumina-cascade-item>Primeiro item</span>
                                    <span data-lumina-cascade-item>Segundo item</span>
                                    <span data-lumina-cascade-item>Terceiro item</span>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">SwitchPlugin</span>
                                <h3>Troca de painéis</h3>
                                <p>
                                    Alterna blocos de conteúdo com animação, altura automática,
                                    estado ativo nos botões e glow opcional.
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
                                        Visão geral
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
                                        Uso
                                    </button>
                                </div>

                                <div
                                    class="switch-demo-panel"
                                    data-lumina-switch="docs-switch"
                                >
                                    <div data-lumina-switch-panel="overview">
                                        <strong>Overview</strong>
                                        <p>
                                            O SwitchPlugin controla múltiplos painéis dentro de um container.
                                        </p>
                                    </div>

                                    <div
                                        data-lumina-switch-panel="api"
                                        hidden
                                    >
                                        <strong>API declarativa</strong>
                                        <p>
                                            Use triggers e panels via data attributes, sem escrever handlers.
                                        </p>
                                    </div>

                                    <div
                                        data-lumina-switch-panel="usage"
                                        hidden
                                    >
                                        <strong>Uso em sistemas reais</strong>
                                        <p>
                                            Ideal para previews, detalhes, estados de formulário e conteúdo contextual.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">SpotlightPlugin</span>
                                <h3>Spotlight seguindo o cursor</h3>
                                <p>
                                    Aplica um brilho radial dinâmico no elemento,
                                    acompanhando a posição do mouse em tempo real.
                                </p>

                                <div
                                    class="spotlight-preview"
                                    data-lumina-spotlight
                                >
                                    <strong>Passe o mouse aqui</strong>
                                    <p style="margin-bottom: 0;">
                                        Esse bloco também usa SpotlightPlugin de forma independente.
                                    </p>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">ToastPlugin</span>
                                <h3>Notificações com glow</h3>
                                <p>
                                    Exibe mensagens temporárias de sucesso, erro, aviso ou informação,
                                    com animação, fechamento manual e efeito visual opcional.
                                </p>
                            </div>

                            <div class="demo-row toast-demo-row">
                                <button
                                    class="toast-demo-button toast-demo-button-success"
                                    id="demo-toast-success"
                                    type="button"
                                >
                                    Toast sucesso
                                </button>

                                <button
                                    class="toast-demo-button toast-demo-button-info"
                                    id="demo-toast-info"
                                    type="button"
                                >
                                    Toast informação
                                </button>

                                <button
                                    class="toast-demo-button toast-demo-button-error"
                                    id="demo-toast-error"
                                    type="button"
                                >
                                    Toast erro
                                </button>
                            </div>
                        </article>

                        <article
                            class="card storm-card"
                            data-lumina-storm
                            data-lumina-storm-mode="contained"
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">StormPlugin</span>

                                <h3>Tempestade digital</h3>

                                <p>
                                    Cria linhas rápidas, brilhos e flashes em canvas,
                                    ideal para backgrounds energéticos e páginas futuristas.
                                </p>

                                <div class="storm-demo-panel">
                                    <strong>Modo contained</strong>

                                    <p>
                                        O efeito roda dentro deste card sem afetar o layout da página.
                                    </p>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card constellation-card"
                            data-lumina-constellation
                            data-lumina-constellation-mode="contained"
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">ConstellationPlugin</span>

                                <h3>Constelação interativa</h3>

                                <p>
                                    Cria partículas conectadas em canvas,
                                    ideal para cards premium, heros e áreas com visual tecnológico.
                                </p>

                                <div class="constellation-demo-panel">
                                    <strong>Modo contained</strong>

                                    <p>
                                        O efeito roda dentro deste card sem afetar o layout da página.
                                    </p>
                                </div>
                            </div>
                        </article>

                        <article
                            class="card"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">TooltipPlugin</span>
                                <h3>Tooltips com glow</h3>
                                <p>
                                    Exibe dicas contextuais em hover ou foco, com posicionamento
                                    configurável e visual premium.
                                </p>
                            </div>

                            <div class="demo-row">
                                <button
                                    class="ghost-button"
                                    data-lumina-tooltip="Tooltip no topo com efeito glow."
                                    data-lumina-tooltip-placement="top"
                                    type="button"
                                >
                                    Tooltip top
                                </button>

                                <button
                                    class="ghost-button"
                                    data-lumina-tooltip="Tooltip na esquerda com efeito glow."
                                    data-lumina-tooltip-placement="left"
                                    type="button"
                                >
                                    Tooltip left
                                </button>

                                <button
                                    class="ghost-button"
                                    data-lumina-tooltip="Tooltip em baixo com efeito glow."
                                    data-lumina-tooltip-placement="bottom"
                                    type="button"
                                >
                                    Tooltip bottom
                                </button>

                                <button
                                    class="ghost-button"
                                    data-lumina-tooltip="Tooltip na direita com efeito glow."
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
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">TransitionPlugin</span>
                                <h3>Transição de navegação</h3>
                                <p>
                                    Aplica uma transição visual antes de navegar para outra página,
                                    com glow, brilho e efeito de saída.
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
                                    Ir para página de exemplo
                                </a>
                            </div>
                        </article>

                        <article
                            class="card accessibility-card"
                            id="accessibility"
                            data-lumina-spotlight
                            data-lumina-cascade-item
                        >
                            <div
                                class="refresh-overlay"
                                data-refresh-surface
                                data-lumina-shimmer-layer
                            ></div>

                            <div class="refresh-content">
                                <span class="tag">AccessibilityPlugin</span>

                                <h3>Controles de acessibilidade</h3>

                                <p>
                                    Ative filtros e ajustes visuais independentes para adaptar
                                    a página conforme a necessidade do usuário.
                                </p>

                                <div class="accessibility-group">
                                    <strong>Filtros de Daltonismo</strong>

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
                                    <strong>Ajustes Visuais</strong>

                                    <div class="accessibility-demo-grid">
                                        <button
                                            data-lumina-accessibility-action="toggle-reduced-motion"
                                            type="button"
                                        >
                                            Reduzir Animações
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-inverted-colors"
                                            type="button"
                                        >
                                            Inverter Cores
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-high-contrast"
                                            type="button"
                                        >
                                            Alto Contraste
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-focus-highlight"
                                            type="button"
                                        >
                                            Destacar Foco
                                        </button>
                                    </div>
                                </div>

                                <div class="accessibility-group">
                                    <strong>Ajustes de Leitura</strong>

                                    <div class="accessibility-demo-grid">
                                        <button
                                            data-lumina-accessibility-action="toggle-large-font"
                                            type="button"
                                        >
                                            Fonte Maior
                                        </button>

                                        <button
                                            data-lumina-accessibility-action="toggle-dyslexia-mode"
                                            type="button"
                                        >
                                            Modo Dislexia
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
                        Cada recurso do LuminaFX é independente, configurável
                        e fácil de encaixar em qualquer projeto.
                    </p>
                </div>
            </section>

            <section class="section" id="install">
                <div class="container">
                    <div class="docs-grid">
                        <div class="docs-copy">
                            <span class="section-kicker">Instalação</span>

                            <h2>
                                Inicialize o core, conecte os plugins e pronto.
                            </h2>

                            <p>
                                O LuminaFX foi desenhado para funcionar como uma camada
                                visual plugável. Você cria a instância, registra os plugins
                                que quer usar e inicia.
                            </p>

                            <div class="install-pills">
                                <code>npm install @lumina/fx</code>
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

toast.success("LuminaFX iniciado!");</code></pre>
                            </div>
                        </div>
                    </div>

                    <div class="plugin-list" data-lumina-cascade>
                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>ThemePlugin</strong>
                            <span>transição de tema</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>DropdownPlugin</strong>
                            <span>menus independentes</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>PasswordVisibilityPlugin</strong>
                            <span>toggle de senha</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>ShimmerPlugin</strong>
                            <span>feedback de atualização</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>CascadePlugin</strong>
                            <span>entrada em sequência</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>SpotlightPlugin</strong>
                            <span>brilho seguindo cursor</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>ToastPlugin</strong>
                            <span>notificações temporárias</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>TooltipPlugin</strong>
                            <span>dicas contextuais</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>SwitchPlugin</strong>
                            <span>troca de painéis</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>ConstellationPlugin</strong>
                            <span>partículas conectadas</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>StormPlugin</strong>
                            <span>tempestade digital</span>
                        </div>

                        <div class="plugin-item" data-lumina-spotlight data-lumina-cascade-item>
                            <strong>AccessibilityPlugin</strong>
                            <span>controles visuais</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="final-cta">
                <div class="container final-cta-card" data-lumina-spotlight>
                    <span class="section-kicker">Pronto para usar</span>

                    <h2>
                        Transforme efeitos soltos em uma camada visual consistente.
                    </h2>

                    <p>
                        Use o LuminaFX para criar interfaces mais fluidas, responsivas
                        e memoráveis sem acoplar seu projeto a uma stack específica.
                    </p>

                    <div class="hero-actions final-cta-actions">
                        <a
                            class="primary-link"
                            href="#install"
                        >
                            Ver instalação
                        </a>

                        <button
                            class="ghost-button"
                            data-lumina-theme-toggle
                            type="button"
                        >
                            Testar tema
                        </button>
                    </div>
                </div>
            </section>

            <footer class="footer">
                <div class="container footer-inner">
                    <strong>LuminaFX</strong>
                    <span>Documentação viva, playground e showcase oficial do projeto.</span>
                </div>
            </footer>
        </main>
    `;

}