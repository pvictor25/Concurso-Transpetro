// Apostila Teórica Completa - Engenharia Elétrica Transpetro 2026.4 (Anexo IV)
// Com Fórmulas em LaTeX Nativo (KaTeX) + Ilustrações e Animações Vetoriais (SVG)

window.DADOS_TEORIA = [
  {
    id: "bloco4",
    codigo: "Bloco 4 (Específicos)",
    titulo: "4. Análise de Sistemas Elétricos de Potência (SEP)",
    pesoProva: "22% da Prova Específica (11 de 50 questões em 2023.2)",
    prioridade: "Altíssima",
    subtopicosEdital: "4.1 Valores por unidade (p.u.); 4.2 Componentes simétricas; 4.3 Diagramas Sequenciais (Linhas, Trafos, Geradores e Motores); 4.4 Faltas simétricas e assimétricas; 4.5 Cálculo de correntes de curto-circuito; 4.6 Geração, transmissão e distribuição; 4.7 Proteção de sistemas elétricos.",
    conteudoHTML: `
      <h3>4.1 Sistema por Unidade (p.u.) e Diagrama Unifilar</h3>
      <p>O sistema <strong>por unidade (p.u.)</strong> normaliza grandezas elétricas (tensão, corrente, potência e impedância) em relação a valores de base escolhidos por setor do sistema elétrico, eliminando a necessidade de referir impedâncias entre lados de alta e baixa tensão de transformadores.</p>
      <div class="formula-box">
        <strong>Grandezas de Base Trifásicas (a partir de $S_{\\text{base}(3\\phi)}$ e $V_{\\text{base}(LL)}$):</strong>
        $$I_{\\text{base}} = \\frac{S_{\\text{base}(3\\phi)}}{\\sqrt{3} \\cdot V_{\\text{base}(LL)}} \\qquad ; \\qquad Z_{\\text{base}} = \\frac{V_{\\text{base}(LL)}^2}{S_{\\text{base}(3\\phi)}} = \\frac{(V_{\\text{base}}[\\text{kV}])^2}{S_{\\text{base}}[\\text{MVA}]} \\; [\\Omega]$$
        <strong>Valor em p.u. e Equação Geral de Mudança de Base:</strong>
        $$Z_{\\text{pu}} = \\frac{Z_{\\Omega}}{Z_{\\text{base}}} \\qquad ; \\qquad Z_{\\text{pu,novo}} = Z_{\\text{pu,antigo}} \\cdot \\left(\\frac{S_{\\text{base,novo}}}{S_{\\text{base,antigo}}}\\right) \\cdot \\left(\\frac{V_{\\text{base,antigo}}}{V_{\\text{base,novo}}}\\right)^2$$
      </div>
      <div class="cesgranrio-tip">
        <strong>🎯 Pegadinha Clássica Cesgranrio (Q37 e Q56 de 2023.2):</strong>
        1) Se um equipamento conectado em estrela tem potência nominal $S_{\\text{nom}} = 400\\text{ kVA}$ e tensão $10\\text{ kV}$ sem especificar impedância interna percentual, a impedância nominal da própria carga é $1,0\\text{ p.u.}$ na sua própria base! Mudando para $S_{\\text{base}} = 100\\text{ kVA}$ (mesma tensão $10\\text{ kV}$): $Z_{\\text{pu}} = 1,0 \\times \\frac{100}{400} = \\mathbf{0,25\\text{ p.u.}}$<br>
        2) No <strong>diagrama unifilar</strong> (Q39), as grandezas representadas fazem referência à <strong>tensão de linha</strong>, <strong>corrente de linha</strong> e à <strong>impedância de uma das fases na ligação estrela (ou do equivalente estrela $Z_Y = Z_\\Delta / 3$ se a carga for delta)</strong>!
      </div>

      <h3>4.2 Componentes Simétricas e Teorema de Fortescue</h3>
      <p>Pelo <strong>Teorema de Fortescue</strong>, qualquer sistema trifásico desequilibrado de fasores ($\\dot{V}_A, \\dot{V}_B, \\dot{V}_C$ ou $\\dot{I}_A, \\dot{I}_B, \\dot{I}_C$) pode ser decomposto em três sistemas equilibrados de sequência:</p>
      <ul>
        <li><strong>Sequência Positiva (índice 1):</strong> Mesma sequência de fases do sistema original ($ABC$), fasores de mesmo módulo defasados de $120^\\circ$.</li>
        <li><strong>Sequência Negativa (índice 2):</strong> Sequência de fases invertida ($ACB$), fasores de mesmo módulo defasados de $120^\\circ$.</li>
        <li><strong>Sequência Zero (índice 0):</strong> Três fasores idênticos em módulo e fase (em fase entre si, sem defasagem angular).</li>
      </ul>

      <!-- ANIMAÇÃO 1: FASORES DE FORTESCUE GIRANDO -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">🎬 Animação Vetorial: Decomposição de Fortescue (Sequências 1, 2 e 0)</span>
          <span class="visual-card-badge">Rotação Fasorial ω (Anti-horária)</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 660 210" width="660" height="210">
            <!-- Seq Positiva -->
            <g transform="translate(115, 105)">
              <circle cx="0" cy="0" r="68" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
              <g class="anim-ccw">
                <line x1="0" y1="0" x2="62" y2="0" stroke="#38bdf8" stroke-width="3"/>
                <circle cx="62" cy="0" r="4" fill="#38bdf8"/>
                <text x="48" y="-8" fill="#38bdf8" font-size="11" font-weight="bold">A₁</text>
                <line x1="0" y1="0" x2="-31" y2="53.7" stroke="#fbbf24" stroke-width="3"/>
                <circle cx="-31" cy="53.7" r="4" fill="#fbbf24"/>
                <text x="-48" y="64" fill="#fbbf24" font-size="11" font-weight="bold">B₁ (-120°)</text>
                <line x1="0" y1="0" x2="-31" y2="-53.7" stroke="#f43f5e" stroke-width="3"/>
                <circle cx="-31" cy="-53.7" r="4" fill="#f43f5e"/>
                <text x="-48" y="-58" fill="#f43f5e" font-size="11" font-weight="bold">C₁ (+120°)</text>
              </g>
              <circle cx="0" cy="0" r="4" fill="#fff"/>
              <text x="0" y="92" fill="#e2e8f0" font-size="12" font-weight="bold" text-anchor="middle">1. Seq. Positiva (ABC)</text>
            </g>

            <!-- Seq Negativa -->
            <g transform="translate(335, 105)">
              <circle cx="0" cy="0" r="68" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
              <g class="anim-ccw">
                <line x1="0" y1="0" x2="54" y2="0" stroke="#38bdf8" stroke-width="3"/>
                <circle cx="54" cy="0" r="4" fill="#38bdf8"/>
                <text x="42" y="-8" fill="#38bdf8" font-size="11" font-weight="bold">A₂</text>
                <line x1="0" y1="0" x2="-27" y2="-46.7" stroke="#fbbf24" stroke-width="3"/>
                <circle cx="-27" cy="-46.7" r="4" fill="#fbbf24"/>
                <text x="-46" y="-54" fill="#fbbf24" font-size="11" font-weight="bold">B₂ (+120°)</text>
                <line x1="0" y1="0" x2="-27" y2="46.7" stroke="#f43f5e" stroke-width="3"/>
                <circle cx="-27" cy="46.7" r="4" fill="#f43f5e"/>
                <text x="-46" y="60" fill="#f43f5e" font-size="11" font-weight="bold">C₂ (-120°)</text>
              </g>
              <circle cx="0" cy="0" r="4" fill="#fff"/>
              <text x="0" y="92" fill="#e2e8f0" font-size="12" font-weight="bold" text-anchor="middle">2. Seq. Negativa (ACB)</text>
            </g>

            <!-- Seq Zero -->
            <g transform="translate(550, 105)">
              <circle cx="0" cy="0" r="68" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
              <g class="anim-ccw">
                <line x1="0" y1="-6" x2="50" y2="-6" stroke="#38bdf8" stroke-width="2.5"/>
                <circle cx="50" cy="-6" r="3.5" fill="#38bdf8"/>
                <line x1="0" y1="0" x2="50" y2="0" stroke="#fbbf24" stroke-width="2.5"/>
                <circle cx="50" cy="0" r="3.5" fill="#fbbf24"/>
                <line x1="0" y1="6" x2="50" y2="6" stroke="#f43f5e" stroke-width="2.5"/>
                <circle cx="50" cy="6" r="3.5" fill="#f43f5e"/>
                <text x="26" y="-14" fill="#34d399" font-size="11" font-weight="bold">A₀=B₀=C₀</text>
              </g>
              <circle cx="0" cy="0" r="4" fill="#fff"/>
              <text x="0" y="92" fill="#e2e8f0" font-size="12" font-weight="bold" text-anchor="middle">0. Seq. Zero (Em Fase)</text>
            </g>
          </svg>
        </div>
        <div class="visual-card-caption">
          Observe como na <strong>Sequência Positiva (1)</strong> a fase $B_1$ passa pelo eixo real $120^\\circ$ depois de $A_1$ ($\\dot{B}_1 = a^2\\dot{A}_1$), enquanto na <strong>Sequência Negativa (2)</strong> a fase $B_2$ está adiantada de $120^\\circ$ ($\\dot{B}_2 = a\\dot{A}_2$). Na <strong>Sequência Zero (0)</strong>, os três fasores giram colineares em fase!
        </div>
      </div>

      <div class="formula-box">
        <strong>Operador de Rotação Fasorial ($a$):</strong>
        $$a = 1\\angle 120^\\circ = -\\frac{1}{2} + j\\frac{\\sqrt{3}}{2} \\qquad ; \\qquad a^2 = 1\\angle 240^\\circ = 1\\angle -120^\\circ = -\\frac{1}{2} - j\\frac{\\sqrt{3}}{2}$$
        $$a^3 = 1 \\qquad \\text{e} \\qquad 1 + a + a^2 = 0$$
        <strong>Matriz de Síntese (Componentes $\\to$ Fases) e Matriz de Análise (Fases $\\to$ Componentes):</strong>
        $$\\begin{bmatrix} \\dot{V}_A \\\\ \\dot{V}_B \\\\ \\dot{V}_C \\end{bmatrix} = \\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & a^2 & a \\\\ 1 & a & a^2 \\end{bmatrix} \\begin{bmatrix} \\dot{V}_{A0} \\\\ \\dot{V}_{A1} \\\\ \\dot{V}_{A2} \\end{bmatrix} \\qquad \\iff \\qquad \\begin{bmatrix} \\dot{V}_{A0} \\\\ \\dot{V}_{A1} \\\\ \\dot{V}_{A2} \\end{bmatrix} = \\frac{1}{3} \\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & a & a^2 \\\\ 1 & a^2 & a \\end{bmatrix} \\begin{bmatrix} \\dot{V}_A \\\\ \\dot{V}_B \\\\ \\dot{V}_C \\end{bmatrix}$$
      </div>
      <div class="cesgranrio-tip">
        <strong>🎯 Dica de Ouro Cesgranrio (Q38 de 2023.2):</strong>
        A Cesgranrio adora trocar a ordem das colunas da matriz! Para identificar quem é sequência positiva, negativa e zero na matriz que calcula $[\\dot{A}, \\dot{B}, \\dot{C}]^T$:<br>
        • A coluna $[1, 1, 1]^T$ é SEMPRE a <strong>Sequência Zero</strong>.<br>
        • A coluna $[1, a^2, a]^T$ é SEMPRE a <strong>Sequência Positiva</strong> (pois na fase B o fasor positivo atrasa $120^\\circ$, multiplicando por $a^2 = 1\\angle -120^\\circ$).<br>
        • A coluna $[1, a, a^2]^T$ é SEMPRE a <strong>Sequência Negativa</strong>.
      </div>

      <h3>4.3 Diagramas de Sequência Zero de Transformadores</h3>
      <p>A corrente de sequência zero só circula se houver caminho de retorno pela terra/neutro (em estrela aterrada) ou se puder circular em malha fechada interna (em delta).</p>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Conexão do Transformador</th>
              <th>Comportamento na Sequência Zero</th>
              <th>Representação no Diagrama de Seq. Zero</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>$Y_{\\text{aterrado}} - Y_{\\text{aterrado}}$</strong></td>
              <td>Corrente zero passa de ambos os lados para a referência.</td>
              <td>Chave série fechada de ambos os lados (com $3Z_n$ se aterrado por impedância $Z_n$).</td>
            </tr>
            <tr>
              <td><strong>$Y_{\\text{aterrado}} - \\Delta$</strong></td>
              <td>Corrente zero entra pelo lado $Y_{\\text{at}}$ e circula presa dentro do $\\Delta$ (não sai para a linha do lado $\\Delta$).</td>
              <td>Lado $Y_{\\text{at}}$ conectado em série com $Z_0$ (e $3Z_n$) ligado à barra de referência; lado $\\Delta$ aberto para a linha externa!</td>
            </tr>
            <tr>
              <td><strong>$Y_{\\text{aterrado}} - Y_{\\text{isolado}}$</strong></td>
              <td>Primário aterrado fecha chave série; secundário em estrela não aterrada fica com chave série aberta (Q36!).</td>
              <td>Série fechada no lado aterrado + $Z_0 + 3Z_n$ e chave série aberta no secundário isolado.</td>
            </tr>
            <tr>
              <td><strong>$\\Delta - \\Delta$ (Delta - Delta)</strong></td>
              <td>Não há caminho para a linha em nenhum dos lados; circula apenas internamente aos deltas.</td>
              <td>Aberto para ambos os lados da rede; $Z_0$ ligado em malha fechada com a referência.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><strong>Por que aparece $3Z_n$ na sequência zero?</strong> Como a corrente pelo neutro é $\\dot{I}_N = \\dot{I}_A + \\dot{I}_B + \\dot{I}_C = 3\\dot{I}_{A0}$, a queda de tensão na impedância de neutro é $Z_n \\dot{I}_N = (3Z_n)\\dot{I}_{A0}$!</p>

      <h3>4.4 e 4.5 Cálculo de Correntes de Curto-Circuito (Faltas)</h3>

      <!-- ANIMAÇÃO 2: REDES DE SEQUÊNCIA EM CURTO-CIRCUITO -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">⚡ Animação de Faltas: Conexão das Redes de Sequência (1φ-Terra vs. 2φ)</span>
          <span class="visual-card-badge">Fluxo de Corrente de Curto</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 650 185" width="650" height="185">
            <!-- Curto Fase-Terra (Série) -->
            <g transform="translate(20, 15)">
              <rect x="0" y="0" width="295" height="155" rx="8" fill="#0f172a" stroke="#334155"/>
              <text x="147" y="22" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Falta Fase-Terra (1φ-T): Redes em SÉRIE</text>
              <rect x="35" y="38" width="110" height="24" rx="4" fill="#1e293b" stroke="#38bdf8"/>
              <text x="90" y="54" fill="#e2e8f0" font-size="11" text-anchor="middle">Rede Positiva (E, Z₁)</text>
              <rect x="35" y="76" width="110" height="24" rx="4" fill="#1e293b" stroke="#fbbf24"/>
              <text x="90" y="92" fill="#e2e8f0" font-size="11" text-anchor="middle">Rede Negativa (Z₂)</text>
              <rect x="35" y="114" width="110" height="24" rx="4" fill="#1e293b" stroke="#34d399"/>
              <text x="90" y="130" fill="#e2e8f0" font-size="11" text-anchor="middle">Rede Zero (Z₀+3Zn)</text>
              <!-- Malha Série Animada -->
              <path d="M 145,50 L 185,50 L 185,76 M 145,88 L 185,88 L 185,114 M 145,126 L 215,126 L 215,38 L 145,38" stroke="#f43f5e" stroke-width="2.5" fill="none" class="anim-flow"/>
              <text x="252" y="82" fill="#f43f5e" font-size="11" font-weight="bold" text-anchor="middle">Ia₁=Ia₂=Ia₀</text>
              <text x="252" y="100" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">If = 3·Ia₀</text>
            </g>

            <!-- Curto Fase-Fase (Paralelo) -->
            <g transform="translate(335, 15)">
              <rect x="0" y="0" width="295" height="155" rx="8" fill="#0f172a" stroke="#334155"/>
              <text x="147" y="22" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">Falta Fase-Fase (2φ): Redes 1 e 2 em PARALELO</text>
              <rect x="35" y="45" width="115" height="28" rx="4" fill="#1e293b" stroke="#38bdf8"/>
              <text x="92" y="63" fill="#e2e8f0" font-size="11" text-anchor="middle">Rede Positiva (E, Z₁)</text>
              <rect x="35" y="102" width="115" height="28" rx="4" fill="#1e293b" stroke="#fbbf24"/>
              <text x="92" y="120" fill="#e2e8f0" font-size="11" text-anchor="middle">Rede Negativa (Z₂)</text>
              <!-- Malha Paralela Animada -->
              <path d="M 150,59 L 205,59 L 205,116 L 150,116 M 35,116 L 18,116 L 18,59 L 35,59" stroke="#38bdf8" stroke-width="2.5" fill="none" class="anim-flow"/>
              <text x="250" y="78" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Ia₁ = -Ia₂</text>
              <text x="250" y="96" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">Ia₀ = 0</text>
              <text x="250" y="114" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">|Ib|=√3·Ia₁</text>
            </g>
          </svg>
        </div>
      </div>

      <div class="formula-box">
        <strong>1) Curto-Circuito Trifásico Simétrico ($3\\phi$):</strong>
        $$\\dot{I}_{A1} = \\frac{\\dot{E}}{Z_1} \\qquad ; \\qquad \\dot{I}_{A2} = \\dot{I}_{A0} = 0$$\n
        <strong>2) Curto-Circuito Fase-Terra Franco na Fase A ($1\\phi\\text{-T}$ — Q50 de 2023.2):</strong>
        $$\\dot{I}_{A1} = \\dot{I}_{A2} = \\dot{I}_{A0} = \\frac{\\dot{E}}{Z_1 + Z_2 + Z_0 + 3Z_f} \\implies \\mathbf{\\dot{I}_{\\text{falta}} = \\dot{I}_A = 3\\dot{I}_{A0} = \\frac{3\\dot{E}}{Z_1 + Z_2 + Z_0}}$$\n
        <strong>3) Curto-Circuito Fase-Fase Franco entre Fases B e C ($2\\phi$ — Q40 de 2023.2):</strong>
        $$\\dot{I}_A = 0 \\;,\\; \\dot{I}_B = -\\dot{I}_C \\;,\\; \\dot{I}_{A0} = 0 \\;,\\; \\dot{I}_{A1} = -\\dot{I}_{A2} = \\frac{\\dot{E}}{Z_1 + Z_2} \\implies \\mathbf{|\\dot{I}_B| = \\frac{\\sqrt{3}|\\dot{E}|}{|Z_1 + Z_2|}}$$
      </div>

      <h3>4.6 Transmissão: Efeito Pelicular (Skin Effect — Q21 de 2023.2)</h3>
      <p>Em corrente alternada (CA), o maior enlaçamento de fluxo magnético interno no eixo central do condutor eleva a reatância indutiva no centro, forçando a corrente elétrica a concentrar-se na periferia ("pele" do condutor):</p>
      <div class="formula-box">
        $$\\delta = \\frac{1}{\\sqrt{\\pi \\cdot f \\cdot \\mu \\cdot \\sigma}} \\qquad \\implies \\qquad \\text{Quanto maior } f \\implies \\text{menor } \\delta \\implies \\mathbf{\\text{maior } R_{\\text{aparente(CA)}}}$$
      </div>

      <!-- ANIMAÇÃO 3: EFEITO PELICULAR -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">🔬 Ilustração Animada: Efeito Pelicular (Skin Effect) na Seção do Condutor</span>
          <span class="visual-card-badge">CC (f = 0 Hz) vs. CA (Alta Frequência)</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 560 175" width="560" height="175">
            <!-- Condutor CC -->
            <g transform="translate(140, 82)">
              <circle cx="0" cy="0" r="55" fill="rgba(56,189,248,0.38)" stroke="#38bdf8" stroke-width="2.5"/>
              <circle cx="0" cy="0" r="35" fill="rgba(56,189,248,0.38)"/>
              <circle cx="0" cy="0" r="15" fill="rgba(56,189,248,0.38)"/>
              <text x="0" y="4" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">J uniforme</text>
              <text x="0" y="76" fill="#e2e8f0" font-size="12" font-weight="bold" text-anchor="middle">Corrente Contínua (f = 0)</text>
            </g>
            <!-- Condutor CA -->
            <g transform="translate(410, 82)">
              <circle cx="0" cy="0" r="55" fill="rgba(244,63,94,0.55)" stroke="#f43f5e" stroke-width="3"/>
              <circle cx="0" cy="0" r="39" fill="#0f172a" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3" class="anim-pulse"/>
              <line x1="39" y1="0" x2="55" y2="0" stroke="#fbbf24" stroke-width="2"/>
              <text x="47" y="-6" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">δ</text>
              <text x="0" y="4" fill="#94a3b8" font-size="10" text-anchor="middle">J ≈ 0 no centro</text>
              <text x="0" y="76" fill="#e2e8f0" font-size="12" font-weight="bold" text-anchor="middle">Corrente Alternada (↑ f ⇒ ↑ R_CA)</text>
            </g>
          </svg>
        </div>
        <div class="visual-card-caption">
          Em CA, a redução da densidade de corrente $J$ no centro do condutor diminui a seção transversal útil, <strong>aumentando a resistência aparente $R_{\\text{CA}}$</strong> da linha de transmissão (Gabarito da Q21!).
        </div>
      </div>

      <h3>4.7 Proteção de Sistemas Elétricos (Tabela de Funções ANSI)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Código ANSI</th>
              <th>Nome da Função de Proteção</th>
              <th>Aplicação Principal na Subestação</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>21</strong></td><td>Relé de Distância (Impedância)</td><td>Proteção principal de linhas de transmissão (mede $Z = V/I$).</td></tr>
            <tr><td><strong>27 / 59</strong></td><td>Subtensão (27) / Sobretensão (59)</td><td>Proteção de barramentos, motores e bancos de capacitores.</td></tr>
            <tr><td><strong>50 / 50N</strong></td><td>Sobrecorrente Instantâneo (Fase / Neutro)</td><td>Atuação rápida sem retardo intencional para correntes elevadas de curto-circuito.</td></tr>
            <tr><td><strong>51 / 51N</strong></td><td>Sobrecorrente Temporizado (Fase / Neutro)</td><td>Atuação com curva de tempo inverso para coordenação de sobrecarga e faltas.</td></tr>
            <tr><td><strong>50BF</strong></td><td>Falha de Disjuntor (<em>Breaker Failure</em>)</td><td>Detecta que o disjuntor recebeu ordem de abertura mas não extinguiu a corrente, comandando a <strong>abertura dos disjuntores adjacentes</strong> para isolar a barra (Q29!).</td></tr>
            <tr><td><strong>67</strong></td><td>Sobrecorrente Direcional</td><td>Sistemas em anel ou com geração distribuída/paralela.</td></tr>
            <tr><td><strong>87</strong></td><td>Proteção Diferencial (87T, 87B, 87G)</td><td>Compara correntes de entrada e saída da zona protegida; usa bloqueio por 2º harmônico (120 Hz) contra <em>inrush</em>.</td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: "bloco2",
    codigo: "Bloco 2 (Específicos)",
    titulo: "2. Teoria e Técnica de Circuitos Elétricos",
    pesoProva: "16% da Prova Específica (8 de 50 questões em 2023.2)",
    prioridade: "Altíssima",
    subtopicosEdital: "2.1 Circuitos CC e CA (RL, RC, RLC), Kirchhoff, Norton e Thevenin; 2.2 Circuitos senoidais monofásicos e trifásicos equilibrados, Potência e Fator de Potência; 2.3 Fasores, Indutância, Capacitância, Potência e Energia; 2.4 Funções Singulares, Resposta livre, ao impulso e ao degrau.",
    conteudoHTML: `
      <h3>2.1 Teoremas de Thévenin e Norton, Máxima Transferência e Malhas Infinitas</h3>
      <div class="formula-box">
        <strong>Equivalente de Thévenin ($V_{Th}, Z_{Th}$) e Máxima Transferência de Potência Ativa em CA:</strong>
        $$Z_{Th} = \\frac{\\dot{V}_{\\text{aberto}}}{\\dot{I}_{\\text{curto}}} \\qquad ; \\qquad Z_{\\text{carga,ótima}} = Z_{Th}^* = R_{Th} - jX_{Th} \\qquad ; \\qquad P_{\\max} = \\frac{|V_{Th,\\text{rms}}|^2}{4 R_{Th}}$$
        <strong>Malha Infinita de Capacitores (Q62 de 2023.2):</strong>
        $$C_{eq} = C + \\frac{C \\cdot C_{eq}}{C + 2C_{eq}} \\implies 2C_{eq}^2 - 2C\\cdot C_{eq} - C^2 = 0 \\implies C_{eq} = \\frac{C(1 + \\sqrt{3})}{2}$$
      </div>

      <h3>2.2 e 2.3 Circuitos Senoidais, Fasores, Potência Complexa e Trifásicos</h3>
      <div class="formula-box">
        <strong>Impedância e Potência Complexa Monofásica (Q33 e Q51):</strong>
        $$Z = \\frac{\\dot{V}}{\\dot{I}} = \\frac{|V|}{|I|}\\angle(\\theta_v - \\theta_i) = |Z|\\angle\\varphi \\qquad ; \\qquad |S| = |V_{\\text{rms}}||I_{\\text{rms}}| = \\frac{|V_{\\text{rms}}|^2}{|Z|}$$
        $$S = P + jQ = \\dot{V}_{\\text{rms}} \\cdot \\dot{I}_{\\text{rms}}^* \\qquad ; \\qquad P = |S|\\cos\\varphi \\; [\\text{W}] \\qquad ; \\qquad Q = |S|\\operatorname{sen}\\varphi \\; [\\text{var}]$$
        <strong>Valor Eficaz (RMS) de Sinais Periódicos (Q63):</strong>
        $$V_{\\text{rms}} = \\sqrt{\\frac{1}{T}\\int_0^T v^2(t)\\,dt} \\qquad \\implies \\qquad V_{\\text{rms,onda quadrada}(\\pm S)} = S = \\sqrt{2}\\,V_{\\text{rede}}$$
      </div>

      <!-- ANIMAÇÃO 4: TRIÂNGULO DE POTÊNCIAS E CORREÇÃO DO FP -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">📐 Ilustração Vetorial: Triângulo de Potências e Correção de Fator de Potência</span>
          <span class="visual-card-badge">Qc = P · (tg φ₁ − tg φ₂)</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 540 190" width="540" height="190">
            <g transform="translate(60, 155)">
              <!-- Potência Ativa P -->
              <line x1="0" y1="0" x2="260" y2="0" stroke="#34d399" stroke-width="3.5"/>
              <text x="130" y="20" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">Potência Ativa P = S · cos φ (kW)</text>
              <!-- Q1 inicial -->
              <line x1="260" y1="0" x2="260" y2="-125" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4 3"/>
              <!-- S1 inicial -->
              <line x1="0" y1="0" x2="260" y2="-125" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
              <text x="115" y="-72" fill="#94a3b8" font-size="12" transform="rotate(-25 115 -72)">|S₁| Inicial (FP baixo)</text>
              <!-- S2 corrigido -->
              <line x1="0" y1="0" x2="260" y2="-55" stroke="#38bdf8" stroke-width="3"/>
              <text x="135" y="-36" fill="#38bdf8" font-size="12" font-weight="bold" transform="rotate(-12 135 -36)">|S₂| Corrigido (FP alto)</text>
              <!-- Q2 final -->
              <line x1="260" y1="0" x2="260" y2="-55" stroke="#38bdf8" stroke-width="3"/>
              <text x="315" y="-22" fill="#38bdf8" font-size="12" font-weight="bold">Q₂ = P·tg φ₂</text>
              <!-- Banco de Capacitores Qc -->
              <line x1="274" y1="-125" x2="274" y2="-55" stroke="#fbbf24" stroke-width="4" class="anim-pulse"/>
              <polygon points="274,-55 269,-65 279,-65" fill="#fbbf24"/>
              <text x="365" y="-88" fill="#fbbf24" font-size="12" font-weight="bold">Banco Capacitivo (-Qc)</text>
            </g>
          </svg>
        </div>
      </div>

      <div class="formula-box">
        <strong>Sistemas Trifásicos Equilibrados — Sequência Direta ($ABC$) vs. Inversa ($ACB$ — Q34):</strong>
        $$\\text{Seq. } ABC: \\quad \\dot{V}_{AN} = V_f\\angle\\theta_0 \\;,\\; \\dot{V}_{BN} = V_f\\angle(\\theta_0 - 120^\\circ) \\;,\\; \\dot{V}_{CN} = V_f\\angle(\\theta_0 + 120^\\circ)$$
        $$\\text{Seq. } ACB: \\quad \\dot{V}_{AN} = V_f\\angle\\theta_0 \\;,\\; \\mathbf{\\dot{V}_{BN} = V_f\\angle(\\theta_0 + 120^\\circ)} \\;,\\; \\dot{V}_{CN} = V_f\\angle(\\theta_0 - 120^\\circ)$$
        $$P_{3\\phi} = 3 V_f I_f \\cos\\varphi = \\sqrt{3} V_L I_L \\cos\\varphi \\qquad ; \\qquad Q_C = P_{3\\phi}\\left(\\operatorname{tg}\\varphi_1 - \\operatorname{tg}\\varphi_2\\right)$$
      </div>

      <h3>2.4 Transitórios de 1ª Ordem (Circuitos RC e RL ao Degrau)</h3>
      <div class="formula-box">
        <strong>1) Circuito RC Série (Carga do Capacitor — Q48 de 2023.2):</strong>
        $$\\tau = R \\cdot C \\; [\\text{s}] \\qquad ; \\qquad v_C(t) = V_f\\left(1 - e^{-\\frac{t}{RC}}\\right) \\qquad ; \\qquad i_C(t) = \\frac{V_f}{R}e^{-\\frac{t}{RC}}$$
        <strong>2) Circuito RL Série (Energização do Indutor — Q67 de 2023.2):</strong>
        $$\\tau = \\frac{L}{R} \\; [\\text{s}] \\qquad ; \\qquad i_L(t) = \\frac{E}{R}\\left(1 - e^{-\\frac{R}{L}t}\\right) \\qquad ; \\qquad v_L(t) = E\\,e^{-\\frac{R}{L}t}$$
      </div>

      <!-- ANIMAÇÃO 5: CURVA TRANSITÓRIA RC / RL -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">📈 Animação Transitória: Resposta ao Degrau de 1ª Ordem (Constante de Tempo τ)</span>
          <span class="visual-card-badge">1τ = 63,2% • 3τ = 95,0% • 5τ = 99,3%</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 560 185" width="560" height="185">
            <g transform="translate(55, 20)">
              <line x1="0" y1="130" x2="460" y2="130" stroke="#64748b" stroke-width="2"/>
              <line x1="0" y1="130" x2="0" y2="5" stroke="#64748b" stroke-width="2"/>
              <!-- Assíntota 100% -->
              <line x1="0" y1="15" x2="450" y2="15" stroke="#475569" stroke-width="1.5" stroke-dasharray="5 5"/>
              <text x="-8" y="20" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="end">100%</text>
              <text x="-8" y="58" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="end">63,2%</text>
              <line x1="0" y1="54" x2="80" y2="54" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="80" y1="54" x2="80" y2="130" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 3"/>
              <!-- Curva de Carga 1 - e^(-t/tau) -->
              <path d="M 0,130 Q 45,45 120,28 T 440,15" stroke="#38bdf8" stroke-width="3.5" fill="none" class="anim-trace"/>
              <!-- Curva de Descarga e^(-t/tau) -->
              <path d="M 0,15 Q 45,100 120,117 T 440,129" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="6 4" fill="none"/>
              <circle cx="80" cy="54" r="4.5" fill="#fbbf24"/>
              <text x="80" y="146" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">1τ</text>
              <text x="160" y="146" fill="#94a3b8" font-size="11" text-anchor="middle">2τ (86,5%)</text>
              <text x="240" y="146" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle">3τ (95%)</text>
              <text x="400" y="146" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">5τ (Regime)</text>
              <text x="310" y="34" fill="#38bdf8" font-size="12" font-weight="bold">Carga: x(t) = Xf · (1 − e⁻ᵗ/ᵀ)</text>
              <text x="310" y="112" fill="#f43f5e" font-size="12" font-weight="bold">Descarga: x(t) = X₀ · e⁻ᵗ/ᵀ</text>
            </g>
          </svg>
        </div>
      </div>
    `
  },
  {
    id: "bloco6",
    codigo: "Bloco 6 (Específicos)",
    titulo: "6. Máquinas Elétricas e Acionamentos",
    pesoProva: "14% da Prova Específica (7 de 50 questões em 2023.2)",
    prioridade: "Alta",
    subtopicosEdital: "6.1 Princípios de Conversão de Energia; 6.2 Transformadores monofásicos e trifásicos e Autotransformadores; 6.3 Máquinas de corrente contínua (CC); 6.4 Máquinas trifásicas síncronas; 6.5 Motores trifásicos assíncronos (MIT) e partida; 6.6 Estratégias de acionamento e controle.",
    conteudoHTML: `
      <h3>6.2 Transformadores e Autotransformadores</h3>
      <div class="formula-box">
        <strong>Ensaio de Curto-Circuito e Rendimento (Q23 de 2023.2):</strong>
        $$R_{eq} = \\frac{P_{cc}}{I_{cc}^2} \\qquad ; \\qquad |Z_{eq}| = \\frac{V_{cc}}{I_{cc}} \\qquad ; \\qquad X_{eq} = \\sqrt{|Z_{eq}|^2 - R_{eq}^2}$$
        $$\\eta = \\frac{P_{\\text{saída}}}{P_{\\text{entrada}}} = \\frac{R_L \\cdot I^2}{(R_L + R_{eq}) \\cdot I^2} = \\frac{R_L}{R_L + R_{eq}}$$
        <strong>Autotransformador Monofásico vs. Transformador Isolado (Q24 de 2023.2):</strong>
        $$\\frac{S_{\\text{auto}}}{S_{\\text{isolado}}} = \\frac{V_H}{V_H - V_X} \\qquad \\implies \\qquad \\mathbf{S_{\\text{isolado}} = S_{\\text{auto}} \\cdot \\left(1 - \\frac{V_X}{V_H}\\right) = V_{\\text{série}} \\cdot I_{\\text{série}}}$$
      </div>

      <!-- ANIMAÇÃO 6: AUTOTRANSFORMADOR -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">🔌 Ilustração Animada: Autotransformador Abaixador 300 V / 100 V (Q24 de 2023.2)</span>
          <span class="visual-card-badge">S_auto = 60 kVA ⇒ S_isolado = 40 kVA</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 540 190" width="540" height="190">
            <g stroke="#e2e8f0" stroke-width="2" fill="none">
              <line x1="60" y1="25" x2="230" y2="25"/>
              <path d="M 100,25 L 180,25" stroke="#fbbf24" stroke-width="3" class="anim-flow"/>
              <text x="140" y="18" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle" stroke="none">I_H = I_série = 200 A →</text>
              <!-- Enrolamento Série (200 V) -->
              <rect x="215" y="35" width="30" height="55" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
              <text x="155" y="66" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle" stroke="none">Enrol. Série (200 V)</text>
              <line x1="230" y1="90" x2="230" y2="105"/>
              <circle cx="230" cy="98" r="4" fill="#fbbf24"/>
              <line x1="230" y1="98" x2="430" y2="98"/>
              <path d="M 260,98 L 400,98" stroke="#34d399" stroke-width="3" class="anim-flow"/>
              <text x="340" y="90" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle" stroke="none">I_X = 600 A →</text>
              <!-- Enrolamento Comum (100 V) -->
              <rect x="215" y="105" width="30" height="50" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
              <text x="150" y="135" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle" stroke="none">Enrol. Comum (100 V)</text>
              <line x1="60" y1="165" x2="430" y2="165"/>
              <line x1="230" y1="155" x2="230" y2="165"/>
              <text x="45" y="100" fill="#e2e8f0" font-size="13" font-weight="bold" stroke="none">V₁=300V</text>
              <text x="465" y="136" fill="#34d399" font-size="13" font-weight="bold" stroke="none">V₂=100V</text>
            </g>
          </svg>
        </div>
        <div class="visual-card-caption">
          Dos $60\\text{ kVA}$ entregues à carga, $20\\text{ kVA}$ passam por condução direta e apenas $S_{\\text{isolado}} = 200\\text{ V} \\times 200\\text{ A} = \\mathbf{40\\text{ kVA}}$ são transformados magneticamente pelos enrolamentos!
        </div>
      </div>

      <h3>6.3 e 6.4 Máquinas de Corrente Contínua (CC) e Máquinas Síncronas</h3>
      <div class="formula-box">
        <strong>Motor CC Shunt (Derivação) com Fluxo Constante (Q25 de 2023.2):</strong>
        $$E_a = k\\phi\\omega \\implies \\frac{E_a}{E_{a0}} = \\frac{n}{n_0} \\qquad ; \\qquad I_a = I_L - I_f \\qquad ; \\qquad V_t = E_a + R_a I_a \\implies R_a = \\frac{V_t - E_a}{I_a}$$
        <strong>Velocidade Síncrona e Máquinas Síncronas Acopladas pelo Eixo (Q26 de 2023.2):</strong>
        $$n_s = \\frac{120 \\cdot f}{P} \\; [\\text{rpm}] \\qquad ; \\qquad n_1 = n_2 \\implies \\frac{f_1}{P_1} = \\frac{f_2}{P_2} \\implies f_2 = f_1 \\cdot \\left(\\frac{P_2}{P_1}\\right)$$
      </div>

      <h3>6.5 e 6.6 Motores de Indução Trifásicos (MIT) e Partida</h3>
      <div class="formula-box">
        <strong>Escorregamento ($s$), Balanço de Potências no Entreferro ($P_{\\text{ef}}$) e Resistência Rotórica (Q27 e Q55):</strong>
        $$s = \\frac{n_s - n}{n_s} \\qquad ; \\qquad n = n_s(1 - s) \\qquad ; \\qquad P_{jr} = s \\cdot P_{\\text{ef}} \\qquad ; \\qquad P_{\\text{mec}} = (1 - s) P_{\\text{ef}}$$
        $$\\text{Mesmo Torque em Rotor Bobinado:} \\quad \\frac{R_{r1}}{s_1} = \\frac{R_{r1} + R_{\\text{adic}}}{s_2} \\implies R_{\\text{adic}} = R_{r1}\\left(\\frac{s_2}{s_1} - 1\\right)$$
      </div>

      <!-- ANIMAÇÃO 7: MOTOR DE INDUÇÃO (CAMPO GIRANTE + CURVA T x s) -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">⚙️ Animação Dupla: Escorregamento (n_s vs. n_r) e Deslocamento de Torque com R_adic</span>
          <span class="visual-card-badge">MIT (Q27, Q28 e Q55)</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 620 195" width="620" height="195">
            <!-- Campo Girante vs Rotor -->
            <g transform="translate(125, 95)">
              <circle cx="0" cy="0" r="68" stroke="#334155" stroke-width="8" fill="none"/>
              <!-- Estator Campo Síncrono ns -->
              <g class="anim-cw">
                <circle cx="0" cy="-68" r="7" fill="#38bdf8"/>
                <circle cx="0" cy="68" r="7" fill="#f43f5e"/>
                <text x="0" y="-78" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">B_estator (n_s)</text>
              </g>
              <!-- Rotor Assíncrono nr (mais lento) -->
              <g class="anim-ccw-slow" style="animation: spinCW 9.5s linear infinite;">
                <circle cx="0" cy="0" r="42" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
                <line x1="-42" y1="0" x2="42" y2="0" stroke="#fbbf24" stroke-width="2"/>
                <line x1="0" y1="-42" x2="0" y2="42" stroke="#fbbf24" stroke-width="2"/>
              </g>
              <text x="0" y="92" fill="#e2e8f0" font-size="11" font-weight="bold" text-anchor="middle">n_r = n_s·(1 − s) &lt; n_s</text>
            </g>

            <!-- Curva Torque x Escorregamento com R_adic -->
            <g transform="translate(295, 25)">
              <line x1="0" y1="140" x2="290" y2="140" stroke="#64748b" stroke-width="2"/>
              <line x1="0" y1="140" x2="0" y2="10" stroke="#64748b" stroke-width="2"/>
              <!-- Curva Original R2 -->
              <path d="M 0,105 Q 140,85 215,25 Q 255,5 280,140" stroke="#38bdf8" stroke-width="3" fill="none"/>
              <!-- Curva com R2 + Radic -->
              <path d="M 0,60 Q 90,20 155,25 Q 220,30 280,140" stroke="#fbbf24" stroke-width="3" stroke-dasharray="6 4" fill="none"/>
              <!-- Linha de Torque Nominal -->
              <line x1="0" y1="85" x2="280" y2="85" stroke="#34d399" stroke-width="1.5" stroke-dasharray="3 3"/>
              <text x="55" y="78" fill="#34d399" font-size="11" font-weight="bold">T_nominal constante</text>
              <text x="200" y="18" fill="#38bdf8" font-size="11" font-weight="bold">R₂ original (s₁=4%)</text>
              <text x="65" y="18" fill="#fbbf24" font-size="11" font-weight="bold">R₂ + R_adic (s₂=10%)</text>
              <text x="10" y="156" fill="#94a3b8" font-size="11">Partida (s=1)</text>
              <text x="245" y="156" fill="#94a3b8" font-size="11">Síncrono (s=0)</text>
            </g>
          </svg>
        </div>
      </div>
    `
  },
  {
    id: "bloco5",
    codigo: "Bloco 5 (Específicos)",
    titulo: "5. Instalações Elétricas (BT/MT/AT), Aterramento, Subestações e SPDA",
    pesoProva: "12% da Prova Específica (6 de 50 questões em 2023.2)",
    prioridade: "Alta",
    subtopicosEdital: "5.1 Dimensionamento de condutores; 5.2 Proteção e coordenação; 5.3 Sistemas de aterramento; 5.4 Projeto de subestação e arranjos; 5.5 Barramentos, malhas de terra e equipamentos de manobra em AT; 5.6 SPDA (NBR 5419).",
    conteudoHTML: `
      <h3>5.1 e 5.2 Dimensionamento de Condutores e Coordenação de Proteção (NBR 5410)</h3>
      <div class="formula-box">
        <strong>Coordenação Obrigatória contra Sobrecargas (NBR 5410 item 5.3.4.1 — Q30 de 2023.2):</strong>
        $$I_L \\le I_d \\le I_c \\qquad \\text{e} \\qquad I_2 \\le 1,45 \\cdot I_c$$
        onde $I_L$ (ou $I_B$) é a corrente de projeto do circuito, $I_d$ (ou $I_N$) é a corrente nominal do dispositivo de proteção e $I_c$ (ou $I_Z$) é a capacidade de condução de corrente dos condutores.
      </div>
      <p><strong>DPS na entrada sem neutro (Q22 de 2023.2):</strong> Os DPS conectam-se em <strong>paralelo</strong>, cada um entre um condutor de fase e o <strong>BEP (Barramento de Equipotencialização Principal)</strong> ou a <strong>barra PE</strong> do quadro.</p>

      <h3>5.3 e 5.6 Esquemas de Aterramento (TT, TN, IT), Método de Wenner e SPDA (NBR 5419)</h3>
      <div class="formula-box">
        <strong>Resistividade Aparente do Solo pelo Método de Wenner (4 Hastes Espaçadas de $a$):</strong>
        $$\\rho(a) = 2 \\cdot \\pi \\cdot a \\cdot R \\; [\\Omega\\cdot\\text{m}]$$
      </div>

      <!-- ANIMAÇÃO 8: ESQUEMA TT E ESFERA ROLANTE SPDA -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">🛡️ Ilustração Normativa: Esquema TT (NBR 5410 — Q31) & Esfera Rolante SPDA (NBR 5419)</span>
          <span class="visual-card-badge">Segurança de Instalações</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 640 190" width="640" height="190">
            <!-- Esquema TT -->
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="295" height="160" rx="8" fill="#0f172a" stroke="#334155"/>
              <text x="147" y="20" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Esquema TT: Eletrodos Distintos</text>
              <!-- Fonte Trafo -->
              <circle cx="50" cy="65" r="18" stroke="#38bdf8" stroke-width="2" fill="#1e293b"/>
              <text x="50" y="69" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Fonte</text>
              <line x1="68" y1="55" x2="220" y2="55" stroke="#f43f5e" stroke-width="2"/>
              <text x="140" y="48" fill="#f43f5e" font-size="10">Fase L</text>
              <!-- Aterramento da Fonte -->
              <line x1="50" y1="83" x2="50" y2="125" stroke="#34d399" stroke-width="2"/>
              <line x1="36" y1="125" x2="64" y2="125" stroke="#34d399" stroke-width="2"/>
              <line x1="41" y1="131" x2="59" y2="131" stroke="#34d399" stroke-width="2"/>
              <text x="55" y="148" fill="#34d399" font-size="10" font-weight="bold" text-anchor="middle">1º T (Eletrodo Fonte)</text>
              <!-- Massa da Carga -->
              <rect x="200" y="55" width="55" height="42" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
              <text x="227" y="80" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">Massa</text>
              <line x1="227" y1="97" x2="227" y2="125" stroke="#fbbf24" stroke-width="2"/>
              <line x1="213" y1="125" x2="241" y2="125" stroke="#fbbf24" stroke-width="2"/>
              <line x1="218" y1="131" x2="236" y2="131" stroke="#fbbf24" stroke-width="2"/>
              <text x="227" y="148" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">2º T (Eletrodo Próprio)</text>
            </g>

            <!-- Esfera Rolante SPDA -->
            <g transform="translate(330, 15)">
              <rect x="0" y="0" width="295" height="160" rx="8" fill="#0f172a" stroke="#334155"/>
              <text x="147" y="20" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">SPDA NBR 5419: Método da Esfera Rolante</text>
              <!-- Solo -->
              <line x1="20" y1="140" x2="275" y2="140" stroke="#34d399" stroke-width="2.5"/>
              <!-- Mastros Captores -->
              <line x1="65" y1="140" x2="65" y2="55" stroke="#38bdf8" stroke-width="3"/>
              <line x1="230" y1="140" x2="230" y2="55" stroke="#38bdf8" stroke-width="3"/>
              <!-- Tanque Protegido -->
              <rect x="105" y="95" width="85" height="45" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
              <text x="147" y="122" fill="#34d399" font-size="10" font-weight="bold" text-anchor="middle">Zona Protegida</text>
              <!-- Arco da Esfera Rolante R -->
              <circle cx="147" cy="10" r="95" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 4" fill="rgba(251,191,36,0.08)" class="anim-pulse"/>
              <text x="147" y="75" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Esfera R (Nível I: R=20m)</text>
            </g>
          </svg>
        </div>
      </div>
    `
  },
  {
    id: "bloco7",
    codigo: "Bloco 7 (Específicos)",
    titulo: "7. Sistemas de Controle Contínuos e Discretos",
    pesoProva: "12% da Prova Específica (6 de 50 questões em 2023.2)",
    prioridade: "Alta",
    subtopicosEdital: "7.1 Modelo de Sistemas Lineares, Laplace, Função de Transferência; 7.2 Diagrama em Blocos, Malha aberta e fechada; 7.3 Sistemas de 2ª ordem; 7.4 Estabilidade, Lugar das Raízes e Diagrama de Bode; 7.5 Espaço de Estado, Polos e Zeros; 7.6 Sistemas Discretos e Transformada Z.",
    conteudoHTML: `
      <h3>7.1 a 7.4 Sistemas de 2ª Ordem, Estabilidade e Lugar das Raízes</h3>
      <div class="formula-box">
        <strong>Forma Canônica Mônica de 2ª Ordem (Q69 de 2023.2):</strong>
        $$G(s) = \\frac{Y(s)}{U(s)} = \\frac{K \\cdot \\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2} \\qquad \\implies \\qquad s_{1,2} = -\\zeta\\omega_n \\pm j\\omega_n\\sqrt{1 - \\zeta^2}$$
        • $0 < \\zeta < 1$: <strong>Subamortecido</strong> (senoide exponencialmente amortecida com frequência $\\omega_d = \\omega_n\\sqrt{1-\\zeta^2}$).<br>
        • $\\zeta = 1$: <strong>Criticamente amortecido</strong> &nbsp;|&nbsp; $\\zeta > 1$: <strong>Sobreamortecido</strong> &nbsp;|&nbsp; $\\zeta = 0$: <strong>Oscilador puro</strong>.
      </div>

      <!-- ANIMAÇÃO 9: RESPOSTA SUBAMORTECIDA E PLANO S -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">🎛️ Animação de Controle: Senoide Subamortecida (ζ = 0,2) & Estabilização no Plano-s</span>
          <span class="visual-card-badge">Q47, Q68 e Q69</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 640 190" width="640" height="190">
            <!-- Resposta Subamortecida -->
            <g transform="translate(20, 15)">
              <rect x="0" y="0" width="310" height="160" rx="8" fill="#0f172a" stroke="#334155"/>
              <text x="155" y="20" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Resposta ao Impulso Subamortecida (0 &lt; ζ &lt; 1)</text>
              <line x1="25" y1="90" x2="290" y2="90" stroke="#64748b" stroke-width="1.5"/>
              <line x1="25" y1="25" x2="25" y2="150" stroke="#64748b" stroke-width="1.5"/>
              <!-- Envelope Exponencial -->
              <path d="M 25,32 Q 110,65 280,86" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
              <path d="M 25,148 Q 110,115 280,94" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
              <!-- Senoide Amortecida Animada -->
              <path d="M 25,90 Q 45,22 65,90 T 105,90 T 145,90 T 185,90 T 225,90 T 275,90" stroke="#38bdf8" stroke-width="2.8" fill="none" class="anim-trace"/>
              <text x="215" y="52" fill="#fbbf24" font-size="10" font-weight="bold">Envelope ±e^(-ζωn·t)</text>
            </g>

            <!-- Plano S e Migração dos Polos -->
            <g transform="translate(345, 15)">
              <rect x="0" y="0" width="280" height="160" rx="8" fill="#0f172a" stroke="#334155"/>
              <text x="140" y="20" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Plano-s: SPE (Estável) vs. SPD (Instável)</text>
              <rect x="20" y="30" width="135" height="115" fill="rgba(16,185,129,0.1)"/>
              <rect x="155" y="30" width="105" height="115" fill="rgba(244,63,94,0.1)"/>
              <line x1="20" y1="88" x2="260" y2="88" stroke="#64748b" stroke-width="1.5"/>
              <line x1="155" y1="30" x2="155" y2="145" stroke="#e2e8f0" stroke-width="2"/>
              <text x="85" y="45" fill="#34d399" font-size="10" font-weight="bold" text-anchor="middle">SPE: Re(s) &lt; 0 (Estável)</text>
              <text x="208" y="45" fill="#f43f5e" font-size="10" font-weight="bold" text-anchor="middle">SPD: Instável</text>
              <!-- Polos Migrando do SPD para o SPE -->
              <g class="anim-pole-shift">
                <circle cx="170" cy="60" r="5" fill="#fbbf24"/>
                <circle cx="170" cy="116" r="5" fill="#fbbf24"/>
              </g>
              <text x="140" y="154" fill="#cbd5e1" font-size="10" text-anchor="middle">Aumento de K desloca polos para o SPE (Q47)</text>
            </g>
          </svg>
        </div>
      </div>

      <h3>7.5 e 7.6 Espaço de Estados e Transformada Z Discreta</h3>
      <div class="formula-box">
        <strong>Conversão Espaço de Estados $\\to$ Função de Transferência (Q45 e Q46):</strong>
        $$\\begin{cases} \\dot{x}(t) = A x(t) + B u(t) \\\\ y(t) = C x(t) + D u(t) \\end{cases} \\implies G(s) = C(sI - A)^{-1}B + D = \\frac{C \\cdot \\operatorname{adj}(sI - A) \\cdot B}{\\det(sI - A)} + D$$
        <strong>Transformada Z de Equação a Diferenças Causal (Q66 e Q70):</strong>
        $$x(n) - \\alpha x(n-1) - \\beta x(n-2) = \\delta(n) \\implies X(z) = \\frac{1}{1 - \\alpha z^{-1} - \\beta z^{-2}} = \\frac{z^2}{z^2 - \\alpha z - \\beta}$$
      </div>
    `
  },
  {
    id: "bloco1",
    codigo: "Bloco 1 (Específicos)",
    titulo: "1. Matemática Aplicada à Engenharia Elétrica",
    pesoProva: "10% da Prova Específica (5 de 50 questões em 2023.2)",
    prioridade: "Média-Alta",
    subtopicosEdital: "1.1 Matrizes, sistemas de equações, determinantes, Transformada de Laplace e aplicações; 1.2 Operações com vetores, produto escalar e produto vetorial; 1.3 Números complexos e funções de variáveis complexas.",
    conteudoHTML: `
      <h3>1.1 Transformada de Laplace e Expansão em Frações Parciais</h3>
      <div class="formula-box">
        $$\\mathcal{L}\\{\\delta(t)\\} = 1 \\quad ; \\quad \\mathcal{L}\\{u(t)\\} = \\frac{1}{s} \\quad ; \\quad \\mathcal{L}\\{e^{at}u(t)\\} = \\frac{1}{s - a} \\quad ; \\quad \\mathcal{L}\\{\\operatorname{sen}(\\omega t)\\} = \\frac{\\omega}{s^2 + \\omega^2}$$
        <strong>Exemplo Q64 de 2023.2:</strong>
        $$G(s) = \\frac{1}{s^2 - 5s + 6} = \\frac{1}{(s - 3)(s - 2)} = \\frac{1}{s - 3} - \\frac{1}{s - 2} \\implies g(t) = e^{3t} - e^{2t}$$
      </div>

      <h3>1.2 Álgebra Vetorial: Produto Escalar, Produto Vetorial e Força Magnética (Q61)</h3>
      <div class="formula-box">
        $$\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z = |\\vec{u}||\\vec{v}|\\cos\\theta \\qquad ; \\qquad |\\vec{u} \\times \\vec{v}| = |\\vec{u}||\\vec{v}|\\operatorname{sen}\\theta$$
        $$\\text{Se } \\vec{A} = \\vec{B} \\times \\vec{v} \\text{ com } \\vec{B}\\cdot\\vec{v} = 0 \\implies \\text{Movimento Circular de Raio } R = \\frac{|\\vec{v}|^2}{|\\vec{A}|} = \\frac{|\\vec{v}|}{|\\vec{B}|}$$
      </div>

      <!-- ANIMAÇÃO 10: TRAJETÓRIA CIRCULAR DE PARTÍCULA (Q61) -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">🧲 Animação Vetorial (Q61 de 2023.2): Aceleração Centrípeta A = B × v (Raio R = 1)</span>
          <span class="visual-card-badge">B · v = 0 ⇒ Trajetória Circular</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 480 185" width="480" height="185">
            <g transform="translate(240, 92)">
              <circle cx="0" cy="0" r="64" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 4" fill="rgba(56,189,248,0.06)"/>
              <circle cx="0" cy="0" r="4" fill="#fbbf24"/>
              <text x="12" y="14" fill="#fbbf24" font-size="11" font-weight="bold">B ⊙ (Ortogonal ao plano)</text>
              <g class="anim-ccw">
                <!-- Partícula -->
                <circle cx="64" cy="0" r="6" fill="#34d399"/>
                <!-- Vetor velocidade v tangente -->
                <line x1="64" y1="0" x2="64" y2="-48" stroke="#34d399" stroke-width="2.5"/>
                <polygon points="64,-52 60,-44 68,-44" fill="#34d399"/>
                <text x="78" y="-36" fill="#34d399" font-size="11" font-weight="bold">v (|v|=3)</text>
                <!-- Vetor aceleração centrípeta A = B x v -->
                <line x1="64" y1="0" x2="18" y2="0" stroke="#f43f5e" stroke-width="2.5"/>
                <polygon points="14,0 22,-4 22,4" fill="#f43f5e"/>
                <text x="38" y="-8" fill="#f43f5e" font-size="10" font-weight="bold">A = B×v</text>
              </g>
            </g>
          </svg>
        </div>
        <div class="visual-card-caption">
          Como $\\vec{B} = (2,-2,1)$ e $\\vec{v}_0 = (1,2,2)$ têm produto escalar $\\vec{B}\\cdot\\vec{v}_0 = 2 - 4 + 2 = 0$, a partícula gira em órbita circular de raio $R = |\\vec{v}| / |\\vec{B}| = 3 / 3 = \\mathbf{1}$!
        </div>
      </div>

      <h3>1.3 Funções de Variável Complexa $f(z) = u(x,y) + jv(x,y)$ (Q43 e Q65)</h3>
      <div class="formula-box">
        $$f(z) = \\frac{1}{z + 1} = \\frac{1}{(x + 1) + jy} \\cdot \\frac{(x + 1) - jy}{(x + 1) - jy} = \\underbrace{\\frac{x + 1}{x^2 + y^2 + 2x + 1}}_{u(x,y)} + j\\underbrace{\\frac{-y}{x^2 + y^2 + 2x + 1}}_{v(x,y)}$$
      </div>
    `
  },
  {
    id: "bloco3",
    codigo: "Bloco 3 (Específicos)",
    titulo: "3. Medidas Elétricas, Instrumentação e Unidades (SI)",
    pesoProva: "10% da Prova Específica (5 de 50 questões em 2023.2)",
    prioridade: "Média-Alta",
    subtopicosEdital: "3.1 Instrumentos (voltímetro, amperímetro, frequencímetro, ponte de Wheatstone, capacímetro, ohmímetro, analisador de espectro, osciloscópio); 3.2 Unidades SI; 3.3 TP e TC; 3.4 Medição de Potência em CA; 3.5 Medição de energia ativa e reativa.",
    conteudoHTML: `
      <h3>3.1 a 3.4 Instrumentos, Análise Dimensional (SI), TC/TP e Wattímetros</h3>
      <div class="formula-box">
        <strong>1) Medição de Potência com Osciloscópio e Resistor Shunt (Q52 de 2023.2):</strong>
        $$v_{\\text{carga}}(t) = V_p\\cos(\\omega t + \\theta_v) \\quad , \\quad i(t) = I_p\\cos(\\omega t + \\theta_i) \\implies P = \\frac{V_p \\cdot I_p}{2}\\cos(\\theta_v - \\theta_i)$$
        <strong>2) Transformador de Corrente (TC — Q41) e Equação Dimensional de Bond (Q60):</strong>
        $$I_{\\text{primário}} = I_{\\text{secundário}} \\times \\left(\\frac{I_{1n}}{I_{2n}}\\right) \\qquad ; \\qquad [K] = \\frac{[E]}{[d^{-1/2}]} = \\frac{\\text{W}\\cdot\\text{s}\\cdot\\text{kg}^{-1}}{\\text{m}^{-1/2}} = \\text{m}^{1/2}\\cdot\\text{kg}^{-1}\\cdot\\text{W}\\cdot\\text{s}$$
        <strong>3) Método dos Dois Wattímetros em Carga Trifásica Equilibrada (Q42):</strong>
        $$P_{3\\phi} = W_1 + W_2 \\qquad ; \\qquad Q_{3\\phi} = \\sqrt{3}\\left(W_1 - W_2\\right)$$
      </div>

      <!-- ANIMAÇÃO: OSCILOSCÓPIO + SHUNT (Q52) E MÉTODO DOS DOIS WATTÍMETROS (Q42) -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">📟 Ilustração Animada: Osciloscópio com Shunt (Q52) & Método dos Dois Wattímetros (Q42)</span>
          <span class="visual-card-badge">Medidas Elétricas em CA</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 640 185" width="640" height="185">
            <!-- Osciloscópio 2 Canais -->
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="295" height="155" rx="8" fill="#0f172a" stroke="#334155"/>
              <text x="147" y="20" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">Osciloscópio: v_carga(t) e i(t) Defasados</text>
              <line x1="20" y1="88" x2="275" y2="88" stroke="#475569" stroke-width="1.5"/>
              <line x1="30" y1="32" x2="30" y2="142" stroke="#475569" stroke-width="1.5"/>
              <!-- Onda Tensão v(t) -->
              <path d="M 30,88 Q 60,28 90,88 T 150,88 T 210,88 T 270,88" stroke="#38bdf8" stroke-width="2.5" fill="none" class="anim-trace"/>
              <!-- Onda Corrente i(t) atrasada de phi -->
              <path d="M 45,88 Q 75,45 105,88 T 165,88 T 225,88" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="5 3" fill="none"/>
              <text x="147" y="146" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Δθ = θ_v − θ_i ⇒ P = (Vp·Ip / 2)·cos(Δθ)</text>
            </g>

            <!-- Dois Wattímetros Blondel -->
            <g transform="translate(330, 15)">
              <rect x="0" y="0" width="295" height="155" rx="8" fill="#0f172a" stroke="#334155"/>
              <text x="147" y="20" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Teorema de Blondel (Carga Equilibrada: I_N = 0)</text>
              <line x1="25" y1="50" x2="265" y2="50" stroke="#e2e8f0" stroke-width="2"/>
              <path d="M 35,50 L 255,50" stroke="#38bdf8" stroke-width="3" class="anim-flow"/>
              <rect x="110" y="36" width="52" height="26" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
              <text x="136" y="53" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">W₁ (30W)</text>
              <line x1="25" y1="85" x2="265" y2="85" stroke="#e2e8f0" stroke-width="2"/>
              <line x1="90" y1="50" x2="90" y2="85" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3"/>
              <line x1="90" y1="85" x2="90" y2="120" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3"/>
              <line x1="25" y1="120" x2="265" y2="120" stroke="#e2e8f0" stroke-width="2"/>
              <path d="M 35,120 L 255,120" stroke="#fbbf24" stroke-width="3" class="anim-flow"/>
              <rect x="110" y="106" width="52" height="26" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
              <text x="136" y="123" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">W₂ (45W)</text>
              <text x="147" y="147" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle">P_3φ = W₁ + W₂ = 30 + 45 = 75 W (W₃ no neutro é distrator!)</text>
            </g>
          </svg>
        </div>
      </div>
    `
  },
  {
    id: "bloco8",
    codigo: "Bloco 8 (Específicos)",
    titulo: "8. Legislação: NR-10 e Nova Lei de Licitações (Lei nº 14.133/2021)",
    pesoProva: "4% da Prova Específica (2 de 50 questões em 2023.2 - Pontos Garantidos!)",
    prioridade: "Garantir 100%",
    subtopicosEdital: "8.1 Noções da Lei nº 14.133/2021, no que se refere a obras e serviços de engenharia; 8.2 NR10, Segurança em instalações e serviços em eletricidade.",
    conteudoHTML: `
      <h3>8.2 NR-10: Habilitação, Qualificação, Capacitação e Zonas de Risco</h3>

      <!-- ANIMAÇÃO 11: ZONAS DE RISCO E CONTROLADA DA NR-10 -->
      <div class="visual-card">
        <div class="visual-card-header">
          <span class="visual-card-title">⚠️ Ilustração Animada NR-10 (Anexo II): Zona de Risco (Rr), Zona Controlada (Rc) e Zona Livre</span>
          <span class="visual-card-badge">Distâncias de Segurança</span>
        </div>
        <div class="visual-svg-wrap">
          <svg viewBox="0 0 560 185" width="560" height="185">
            <g transform="translate(150, 92)">
              <!-- Zona Livre -->
              <rect x="-135" y="-80" width="270" height="160" rx="8" fill="rgba(16,185,129,0.1)" stroke="#34d399" stroke-width="1.5"/>
              <text x="-85" y="-62" fill="#34d399" font-size="11" font-weight="bold">ZONA LIVRE</text>
              <!-- Zona Controlada Rc -->
              <circle cx="0" cy="0" r="68" fill="rgba(251,191,36,0.16)" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5 3"/>
              <text x="0" y="-50" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">Zona Controlada (Rc)</text>
              <!-- Zona de Risco Rr -->
              <circle cx="0" cy="0" r="36" fill="rgba(244,63,94,0.3)" stroke="#f43f5e" stroke-width="2.5" class="anim-pulse"/>
              <text x="0" y="26" fill="#f43f5e" font-size="9.5" font-weight="bold" text-anchor="middle">Zona Risco (Rr)</text>
              <!-- Ponto Energizado -->
              <circle cx="0" cy="0" r="7" fill="#fff" stroke="#f43f5e" stroke-width="3"/>
            </g>
            <!-- Sequência S-I-C-A-P-S -->
            <g transform="translate(310, 20)">
              <text x="0" y="15" fill="#38bdf8" font-size="12" font-weight="bold">Sequência de Desenergização (10.5.1):</text>
              <text x="0" y="38" fill="#e2e8f0" font-size="11">1️⃣ <strong>S</strong>eccionamento</text>
              <text x="0" y="58" fill="#e2e8f0" font-size="11">2️⃣ <strong>I</strong>mpedimento de reenergização</text>
              <text x="0" y="78" fill="#e2e8f0" font-size="11">3️⃣ <strong>C</strong>onstatação da ausência de tensão</text>
              <text x="0" y="98" fill="#fbbf24" font-size="11" font-weight="bold">4️⃣ <strong>A</strong>terramento temporário + equipotencialização</text>
              <text x="0" y="118" fill="#e2e8f0" font-size="11">5️⃣ <strong>P</strong>roteção dos elementos na zona controlada</text>
              <text x="0" y="138" fill="#e2e8f0" font-size="11">6️⃣ <strong>S</strong>inalização de impedimento</text>
            </g>
          </svg>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Classificação NR-10 (Item 10.8)</th>
              <th>Requisito Oficial</th>
              <th>Destaque para a Prova (Q53 de 2023.2)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Qualificado (10.8.1)</strong></td>
              <td>Curso específico na área elétrica reconhecido pelo Sistema Oficial de Ensino.</td>
              <td>Possui diploma, mas sem registro no conselho ainda não é habilitado.</td>
            </tr>
            <tr>
              <td><strong>Legalmente Habilitado (10.8.1.2)</strong></td>
              <td>Previamente qualificado <strong>+ registro no competente conselho de classe (CREA/CFT)</strong>.</td>
              <td>Somente profissional <strong>habilitado e autorizado</strong> pode treinar e supervisionar capacitados (Q53!).</td>
            </tr>
            <tr>
              <td><strong>Capacitado (10.8.2)</strong></td>
              <td>Treinado e trabalhando sob responsabilidade de profissional <strong>habilitado e autorizado</strong>.</td>
              <td>Validade restrita à empresa que o capacitou.</td>
            </tr>
            <tr>
              <td><strong>Autorizado (10.8.4)</strong></td>
              <td>Qualificado, habilitado ou capacitado com <strong>anuência formal da empresa</strong>.</td>
              <td>Exige ASO apto + treinamento NR-10 em dia (reciclagem bienal a cada 2 anos).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>8.1 Lei nº 14.133/2021 — Modalidades e Regimes de Engenharia (Q58 de 2023.2)</h3>
      <ul>
        <li><strong>Pregão (Art. 6º, XLI e Art. 29):</strong> Obrigatório para aquisição de <strong>bens e serviços comuns</strong> (padrões objetivamente definidos no edital — ex.: EPIs, EPCs e ferramentas na Q58!).</li>
        <li><strong>Concorrência (Art. 6º, XXXVIII):</strong> Obras e serviços especiais de engenharia.</li>
        <li><strong>Contratação Integrada vs. Semi-integrada:</strong> Na <strong>Integrada</strong>, o contratado elabora os projetos <strong>básico e executivo</strong>; na <strong>Semi-integrada</strong>, elabora apenas o projeto <strong>executivo</strong>.</li>
      </ul>
    `
  },
  {
    id: "portugues",
    codigo: "Fase 2 - Gerais",
    titulo: "Língua Portuguesa (Padrão Fundação Cesgranrio)",
    pesoProva: "10 Questões (10,0 pontos) - Eliminatório e Classificatório",
    prioridade: "Essencial",
    subtopicosEdital: "1. Compreensão de textos; 2. Ortografia; 3. Coesão textual; 4. Significação das palavras; 5. Tempos e modos verbais; 6. Classes de palavras; 7. Coordenação e subordinação; 8. Pontuação; 9. Concordância; 10. Regência; 11. Crase; 12. Colocação pronominal.",
    conteudoHTML: `
      <h3>Mapa das 10 Questões de Português da Cesgranrio (Prova 2023.2)</h3>
      <ul>
        <li><strong>Compreensão e Interpretação (Q1 a Q4):</strong> Identificar reminiscência (<em>"Estou me vendo..."</em>), marcas de insegurança (<em>"rodeios"</em> e <em>"gaguejar"</em>) e causa do receio da narradora.</li>
        <li><strong>Crase e Regência (Q5):</strong> <em>"soneto à língua portuguesa"</em> = soneto escrito/dedicado <strong>para a</strong> língua portuguesa.</li>
        <li><strong>Coesão Referencial — Pronome Relativo "QUE" (Q6):</strong> Só é pronome relativo quando retoma um substantivo antecedente e equivale a <em>o qual / a qual</em>: <em>"ficou olhando <u>a borboleta que</u> [a qual] entrou na varanda"</em>.</li>
        <li><strong>Pontuação — Aposto Explicativo entre Vírgulas (Q7):</strong> <em>"a minha avó, <u>Pedrina Perucchi</u>, era italiana"</em> equivale a <em>"Os poemas, <u>textos de uma beleza sem igual</u>, encantam seus leitores"</em>.</li>
        <li><strong>Correlação de Tempos e Modos Verbais (Q8):</strong> <em>"A autora também <strong>teria sido lida</strong> se <strong>tivesse escrito</strong> seus contos em outra língua"</em> (Futuro do Pretérito Composto $\\leftrightarrow$ Pretérito Mais-Que-Perfeito Composto do Subjuntivo).</li>
      </ul>
    `
  },
  {
    id: "ingles",
    codigo: "Fase 2 - Gerais",
    titulo: "Língua Inglesa (Inglês Instrumental Cesgranrio)",
    pesoProva: "10 Questões (10,0 pontos) - Eliminatório e Classificatório",
    prioridade: "Essencial",
    subtopicosEdital: "1. Compreensão de texto escrito em língua inglesa; 2. Itens gramaticais relevantes para a compreensão dos conteúdos semânticos.",
    conteudoHTML: `
      <h3>Mapa das 10 Questões de Inglês da Cesgranrio (Prova 2023.2)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tópico Cobrado</th>
              <th>Exemplo Real da Prova 2023.2</th>
              <th>Bizu de Resolução</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Discourse Markers (Q12)</strong></td>
              <td><code>However</code> = <strong>Opposition</strong> (Contudo, entretanto)</td>
              <td><code>Although / Even though</code> = concessão; <code>Therefore / Thus</code> = conclusão; <code>Moreover</code> = adição.</td>
            </tr>
            <tr>
              <td><strong>Reference Pronouns (Q16)</strong></td>
              <td><em>"...14% of the UK's greenhouse gas emissions, of <strong>which</strong> 91%..."</em></td>
              <td>O pronome relativo <code>which</code> retoma o sintagma nominal antecedente: <strong>greenhouse gas emissions</strong>.</td>
            </tr>
            <tr>
              <td><strong>Technical Synonyms (Q15, Q18, Q20)</strong></td>
              <td><code>pivotal</code> = <strong>essential</strong><br><code>state-of-the-art</code> = <strong>cutting-edge</strong><br><code>low latency</code> = <strong>minimal delay</strong></td>
              <td>Leia a frase inteira substituindo a palavra pela alternativa para confirmar a coerência técnica.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];
