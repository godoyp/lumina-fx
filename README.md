# LuminaFX v2 ✨

LuminaFX v2 é uma biblioteca visual modular em **TypeScript** para criar efeitos premium, microinterações e transições modernas em interfaces web.

O projeto nasceu como uma evolução do LuminaFX original, agora com uma arquitetura baseada em **core + plugins independentes**, facilitando testes, manutenção e integração em outros projetos.

> Status: em desenvolvimento ativo.

---

## Visão geral

O LuminaFX v2 foi pensado para entregar efeitos visuais reutilizáveis sem prender o projeto a um framework específico.

A ideia principal é simples:

```ts
import { Lumina } from "./core";
import {
    ThemePlugin,
    DropdownPlugin,
    ShimmerPlugin
} from "./plugins";

await Lumina
    .create({
        debug: true
    })
    .use(new ThemePlugin())
    .use(new DropdownPlugin())
    .use(new ShimmerPlugin())
    .start();
```

Cada plugin é responsável por um comportamento específico e pode funcionar por:

- **data attributes**, para uso declarativo direto no HTML;
- **API programática**, para casos onde o sistema precisa disparar efeitos manualmente;
- **CSS variables**, para permitir customização visual sem alterar o código do plugin.

---

## Plugins disponíveis

### ThemePlugin

Alterna entre temas `light`, `dark` ou `system`, com suporte a transição visual usando View Transitions API quando disponível.

```ts
new ThemePlugin({
    defaultTheme: "system",
    transition: "view",
    toggleSelector: "[data-lumina-theme-toggle]"
})
```

```html
<button data-lumina-theme-toggle>
    Alternar tema
</button>
```

---

### DropdownPlugin

Cria dropdowns independentes com fechamento por clique externo, tecla `Escape`, posicionamento configurável e efeito visual opcional.

```ts
new DropdownPlugin({
    effect: "glow",
    placement: "bottom"
})
```

```html
<button data-lumina-dropdown-trigger="docs-menu">
    Abrir menu
</button>

<div data-lumina-dropdown-menu="docs-menu">
    Conteúdo do dropdown
</div>
```

---

### PasswordVisibilityPlugin

Alterna a visibilidade de campos de senha usando um botão conectado por seletor.

```ts
new PasswordVisibilityPlugin()
```

```html
<input id="password" type="password" />

<button data-lumina-password-toggle="#password">
    Mostrar senha
</button>
```

---

### ShimmerPlugin

Aplica um shimmer em elementos atualizados, funcionando como feedback visual após uma mudança na tela.

```ts
const shimmer = new ShimmerPlugin({
    intensity: "medium",
    duration: 900
});

shimmer.pulse("#status-card");
```

Uso típico:

```ts
async function updateUser(): Promise<void> {
    await api.updateUser();

    shimmer.pulse("#user-card");
}
```

---

### SpotlightPlugin

Adiciona um brilho radial que acompanha o cursor dentro de um elemento.

```ts
new SpotlightPlugin({
    intensity: "medium",
    size: 320
})
```

```html
<article data-lumina-spotlight>
    Conteúdo com spotlight
</article>
```

---

### CascadePlugin

Revela grupos de elementos em sequência com atraso progressivo.

```ts
new CascadePlugin({
    direction: "up",
    distance: 28,
    duration: 720,
    stagger: 90,
    once: true
})
```

```html
<div data-lumina-cascade>
    <article data-lumina-cascade-item>Item 1</article>
    <article data-lumina-cascade-item>Item 2</article>
    <article data-lumina-cascade-item>Item 3</article>
</div>
```

Também é possível sobrescrever o comportamento por grupo:

```html
<div
    data-lumina-cascade
    data-lumina-cascade-once="false"
>
    ...
</div>
```

---

### ToastPlugin

Exibe notificações temporárias de sucesso, erro, aviso ou informação, com animação e efeito de glow.

```ts
const toast = new ToastPlugin({
    effect: "glow",
    position: "top-right",
    duration: 3600
});

toast.success("Operação concluída com sucesso!");
toast.info("Sincronizando dados...");
toast.error("Não foi possível concluir a operação.");
```

---

### TooltipPlugin

Exibe dicas contextuais em hover ou foco, com posicionamento configurável e efeito visual.

```ts
new TooltipPlugin({
    effect: "glow",
    placement: "top",
    offset: 12
})
```

```html
<button
    data-lumina-tooltip="Tooltip no topo"
    data-lumina-tooltip-placement="top"
>
    Passe o mouse
</button>
```

---

### SwitchPlugin

Alterna painéis de conteúdo com fade, glow, altura automática e estado ativo nos botões.

```ts
new SwitchPlugin({
    effect: "glow",
    duration: 520,
    autoHeight: true
})
```

```html
<button
    data-lumina-switch-trigger="demo-switch"
    data-lumina-switch-target="overview"
>
    Overview
</button>

<div data-lumina-switch="demo-switch">
    <div data-lumina-switch-panel="overview">
        Painel overview
    </div>

    <div data-lumina-switch-panel="api" hidden>
        Painel API
    </div>
</div>
```

---

### TransitionPlugin

Executa transições visuais antes de navegar entre páginas.

```ts
new TransitionPlugin({
    effect: "glow",
    duration: 720,
    navigateDelay: 520,
    enterOnLoad: true
})
```

```html
<a
    href="./transition-demo.html"
    data-lumina-transition
    data-lumina-transition-effect="glow"
>
    Ir para página de exemplo
</a>
```

O plugin também suaviza a entrada da próxima página usando `sessionStorage`.

---

### ConstellationPlugin

Renderiza partículas conectadas em `canvas`, ideal para backgrounds de páginas, heros e landing pages.

```ts
new ConstellationPlugin({
    mode: "background",
    density: "medium",
    interactive: true,
    connectDistance: 170,
    mouseRadius: 190,
    speed: 0.28,
    radius: 1.8,
    opacity: 0.9,
    lineOpacity: 0.62
})
```

```html
<div data-lumina-constellation></div>

<main class="app">
    ...
</main>
```

---

## Playground

O projeto inclui uma página de playground/documentação viva construída com Vite.

Ela demonstra os plugins funcionando juntos:

- troca de tema;
- dropdown com glow;
- campo de senha;
- shimmer em atualizações;
- spotlight seguindo o cursor;
- cascade em cards;
- toasts;
- switch de painéis;
- transição real entre páginas;
- constellation como background.

Também existe uma página de exemplo para testar o `TransitionPlugin` com navegação real:

```txt
index.html
transition-demo.html
```

---

## Estrutura do projeto

```txt
src/
├── core/
│   ├── BasePlugin.ts
│   ├── BrowserDom.ts
│   ├── Dom.ts
│   ├── Events.ts
│   ├── Lumina.ts
│   └── index.ts
│
├── plugins/
│   ├── cascade/
│   ├── constellation/
│   ├── dropdown/
│   ├── password/
│   ├── shimmer/
│   ├── spotlight/
│   ├── switch/
│   ├── theme/
│   ├── toast/
│   ├── tooltip/
│   ├── transition/
│   └── index.ts
│
├── playground/
│   ├── connectDemoActions.ts
│   ├── initializeLumina.ts
│   ├── styles.ts
│   └── template.ts
│
├── main.ts
└── transition-demo.ts
```

---

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Rode o ambiente de desenvolvimento:

```bash
npm run dev
```

Gere o build:

```bash
npm run build
```

Pré-visualize o build:

```bash
npm run preview
```

---

## Exemplo completo

```ts
import { Lumina } from "./core";
import {
    CascadePlugin,
    ConstellationPlugin,
    DropdownPlugin,
    PasswordVisibilityPlugin,
    ShimmerPlugin,
    SpotlightPlugin,
    SwitchPlugin,
    ThemePlugin,
    ToastPlugin,
    TooltipPlugin,
    TransitionPlugin
} from "./plugins";

const shimmer =
    new ShimmerPlugin({
        intensity: "medium",
        duration: 900
    });

const toast =
    new ToastPlugin({
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
        duration: 520,
        autoHeight: true
    }))
    .use(new CascadePlugin({
        direction: "up",
        stagger: 90,
        once: true
    }))
    .use(new SpotlightPlugin({
        intensity: "medium",
        size: 320
    }))
    .use(new TooltipPlugin({
        effect: "glow"
    }))
    .use(new TransitionPlugin({
        effect: "glow",
        duration: 720,
        navigateDelay: 520,
        enterOnLoad: true
    }))
    .use(new ConstellationPlugin({
        mode: "background",
        density: "medium",
        interactive: true
    }))
    .use(shimmer)
    .use(toast)
    .start();

toast.success("LuminaFX iniciado!");
```

---

## Customização visual

Os plugins foram pensados para aceitar customização via CSS variables.

Exemplo:

```css
:root[data-theme="light"] {
    --lumina-transition-bg: #f8fafc;
    --lumina-transition-glow: rgba(124, 58, 237, .34);
    --lumina-transition-glow-secondary: rgba(6, 182, 212, .26);
    --lumina-transition-sheen: rgba(15, 23, 42, .28);

    --lumina-constellation-color: rgba(15, 23, 42, .42);
    --lumina-constellation-line-color: rgba(6, 182, 212, .38);
}

:root[data-theme="dark"] {
    --lumina-transition-bg: #020617;
    --lumina-transition-glow: rgba(167, 139, 250, .36);
    --lumina-transition-glow-secondary: rgba(34, 211, 238, .28);
    --lumina-transition-sheen: rgba(255, 255, 255, .22);

    --lumina-constellation-color: rgba(226, 232, 240, .58);
    --lumina-constellation-line-color: rgba(34, 211, 238, .48);
}
```

---

## Roadmap

Próximas etapas planejadas:

- StormPlugin
- Icons
- AccessibilityPlugin
- documentação final de API
- empacotamento para publicação
- testes automatizados
- exemplos de integração com projetos reais

---

## Boas práticas

Ao integrar o LuminaFX em outro sistema, você não precisa replicar o playground inteiro.

O playground possui código extra apenas para demonstração:

```txt
playground/template.ts
playground/styles.ts
playground/connectDemoActions.ts
```

Em um projeto real, normalmente basta inicializar os plugins e chamar APIs como `shimmer.pulse()` ou `toast.success()` quando o fluxo da aplicação exigir.

---

## Licença

Defina aqui a licença do projeto.

Exemplo:

```txt
MIT
```
