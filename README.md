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

6. **☁️ Sincronização Automática na Nuvem (Auto-Save) + Backup Local**:
   - **Auto-Save em Nuvem**: Suporte integrado a **Google Apps Script** (100% gratuito na Conta Google, sem avisos de permissão), **GitHub Gist Secreto** e **Firebase / REST JSON**.
   - **Mesclagem Inteligente**: Ao abrir em outro dispositivo (celular, PC ou Google Sites), puxa e mescla automaticamente as questões resolvidas e o progresso mais recente.
   - **Exportação com Nuvem Embutida**: Botão no modal de nuvem que gera o pacote HTML único já pré-configurado com sua nuvem para colar no Google Sites Restrito.
   - Progresso salvo simultaneamente no `localStorage` do navegador + botões de **Exportar (.json)** e **Importar Backup**.

---

## 🚀 Como Executar Localmente

Basta abrir o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari). Não requer instalação de servidores ou dependências externas.

Para atualizar o pacote único (`plataforma_transpetro_bundle.html`) e copiá-lo automaticamente para a Área de Transferência (`Ctrl + V`), execute no PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\gerar_bundle.ps1
```

---

## 🌐 Publicação no GitHub Pages e Google Sites

1. **Via Código Embutido (100% Privado no Google Sites Restrito)**:
   - Conecte sua nuvem em `☁️ Nuvem: Configurar` e clique em `📦 Copiar HTML p/ Google Sites (Com Nuvem Embutida)`.
   - No Google Sites, crie uma página com **Incorporação de página inteira (`</>`) > Incorporar código** e cole (`Ctrl + V`).
2. **Via GitHub Pages (Por URL)**:
   - Suba os arquivos para seu repositório no GitHub (`main`).
   - Ative o **GitHub Pages** em `Settings > Pages > Branch: main > Save`.
   - No **Google Sites**, crie uma página com **Incorporação de página inteira (`</>`)** e cole a URL do GitHub Pages (`https://seu-usuario.github.io/seu-repo/`).

