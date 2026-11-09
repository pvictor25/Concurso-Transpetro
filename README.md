# ⚡ Plataforma de Estudo — Transpetro 2026.4 (Engenharia Elétrica)

Plataforma interativa desenvolvida sob medida para a preparação diária de **30 minutos por dia** para o concurso da **Transpetro 2026.4** — Cargo: **Profissional Transpetro de Nível Superior - Júnior | Ênfase 23: Engenharia Elétrica** (Banca Fundação Cesgranrio).

---

## 🎯 Principais Recursos

1. **⏱️ Cronômetro Guiado de 30 Minutos**:
   - **Etapa 1 (10 min)**: Leitura rápida e esquemática da teoria com fórmulas e diagramas.
   - **Etapa 2 (15 min)**: Resolução de questões comentadas passo a passo.
   - **Etapa 3 (05 min)**: Revisão ativa com flashcards dos conceitos críticos.
   - Alertas sonoros automáticos nas transições de etapa (Web Audio API).

2. **📐 Fórmulas Matemáticas em LaTeX**:
   - Renderização tipográfica via **KaTeX** com suporte a matrizes, frações verticais reais, fasores com ângulo ($\angle$), potências e integrais.
   - Fallback CSS offline embutido para funcionamento sem internet.

3. **🎬 11 Pranchas Visuais e Animações Vetoriais (SVG + CSS)**:
   - Rotação fasorial de Fortescue (Sequências Positiva $ABC$, Negativa $ACB$ e Zero colinear).
   - Conexão de Redes em Faltas ($1\phi$-Terra em série vs. $2\phi$ em paralelo com fluxo animado).
   - Efeito Pelicular (*Skin effect*) comparando CC ($f=0$) e CA na profundidade $\delta$.
   - Triângulo de Potências e correção de Fator de Potência com capacitor pulsante ($-Q_C$).
   - Transitórios de 1ª ordem ao degrau (curvas $1 - e^{-t/\tau}$ e $e^{-t/\tau}$).
   - Autotransformador $300\text{ V}/100\text{ V}$ (potência conduzida vs. transformada).
   - Motor de Indução Trifásico: campo girante do estator ($n_s$), rotor ($n_r$) e curva Conjugado $\times$ Escorregamento com $R_{\text{adic}}$.
   - Esquema TT (NBR 5410) e Método da Esfera Rolante para SPDA (NBR 5419).
   - Resposta subamortecida de 2ª ordem ($\zeta=0,2$) e migração de polos no plano-$s$.
   - Força de Lorentz e órbita circular $\vec{A} = \vec{B} \times \vec{v}$ ($R=1$).
   - Zonas de Risco/Controlada da NR-10 e mnemônico de desenergização **S-I-C-A-P-S**.
   - Osciloscópio de 2 canais com resistor shunt e Método dos Dois Wattímetros (Blondel).

4. **✍️ Banco com 85 Questões Comentadas**:
   - As **70 questões completas** da última prova oficial de Engenharia Elétrica da Transpetro (Edital 2023.2).
   - **15 questões inéditas** no estilo Cesgranrio com diagramas elétricos SVG e resoluções detalhadas.

5. **🎯 Simulados Cronometrados e Calculadora Oficial de Habilitação**:
   - Mini-simulado (10 questões / 30 min), Foco Específicas (20 questões / 60 min) e Prova Completa (70 questões / 4h30min).
   - Simulador das regras de corte da Fase 1 (mínimo de 50% em Conhecimentos Específicos) e Fase 2 (eliminação com zero em Português ou Inglês), comparando com o corte de homologação de 2x (Vagas + CR) por polo e modalidade.

6. **☁️ Sincronização Automática na Nuvem via GitHub (Auto-Save) + Backup Local**:
   - **Auto-Save no GitHub**: Sincronização nativa em tempo real com **Secret Gist privado** na sua própria conta do GitHub, sem intermediários.
   - **Mesclagem Multi-Dispositivo**: Ao abrir no computador, tablet ou smartphone através do **GitHub Pages**, a plataforma sincroniza e mescla automaticamente as questões respondidas, anotações e o progresso mais recente.
   - **Link Rápido para Celular**: Botão `📲 Copiar Link p/ Celular` no modal que permite abrir no smartphone já conectado, sem precisar digitar tokens em teclado virtual.
   - **Backup Local**: Progresso salvo simultaneamente no `localStorage` do navegador + botões de **Exportar (.json)** e **Importar Backup**.

---

## 🚀 Como Executar Localmente

Basta abrir o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari). Não requer instalação de servidores ou dependências externas.

Para recompilar o pacote autônomo offline (`plataforma_transpetro_bundle.html`) e atualizar os hashes de cache-busting do GitHub Pages, execute no PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\gerar_bundle.ps1
```

---

## 🌐 Publicação e Acesso no GitHub Pages

1. **Repositório GitHub**:
   - Faça push das alterações para a branch `main`:
     ```bash
     git add .
     git commit -m "feat: sincronizacao em nuvem via github"
     git push origin main
     ```
2. **GitHub Pages**:
   - Em `Settings > Pages > Build and deployment > Branch: main > Save`.
   - A plataforma estará disponível mundialmente no seu endereço GitHub Pages: `https://pvictor25.github.io/Concurso-Transpetro/`.
3. **Conexão de Nuvem (Auto-Save)**:
   - Clique no botão `☁️ Nuvem GitHub (Auto-Save)` ou no topo `GitHub: Conectar Nuvem`.
   - Clique em `🔑 Abrir GitHub para Gerar Token →` (já com permissão `gist`).
   - Cole o token gerado e clique em `✓ Conectar e Sincronizar com GitHub`.
   - Para acessar no celular com tudo sincronizado, use o botão `📲 Copiar Link p/ Celular`.

