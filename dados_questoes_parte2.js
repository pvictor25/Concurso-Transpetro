// Banco de Questões - Parte 2 (Questões 36 a 70 da Prova Transpetro 2023.2 + Questões 71 a 85 Inéditas Estilo Cesgranrio 2026.4)

window.QUESTOES_PARTE2 = [
  {
    id: 36,
    numero: 36,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Componentes Simétricas — Diagrama de Sequência Zero de Transformadores",
    svgDiagrama: `<svg viewBox="0 0 420 130" width="100%" height="130" style="max-width:420px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <g stroke="#e2e8f0" stroke-width="2" fill="none">
        <line x1="30" y1="50" x2="70" y2="50"/>
        <circle cx="73" cy="50" r="3" fill="#e2e8f0"/>
        <line x1="76" y1="50" x2="105" y2="50"/>
        <circle cx="108" cy="50" r="3" fill="#e2e8f0"/>
        <line x1="111" y1="50" x2="135" y2="50"/>
        <path d="M135,50 C135,36 147,36 147,50 C147,36 159,36 159,50 C159,36 171,36 171,50"/>
        <text x="153" y="30" fill="#38bdf8" font-size="14" text-anchor="middle" stroke="none" font-weight="bold">Z</text>
        <line x1="171" y1="50" x2="215" y2="50"/>
        <path d="M215,50 C215,36 227,36 227,50 C227,36 239,36 239,50 C239,36 251,36 251,50"/>
        <text x="233" y="30" fill="#fbbf24" font-size="14" text-anchor="middle" stroke="none" font-weight="bold">3 Zn</text>
        <line x1="251" y1="50" x2="280" y2="50"/>
        <circle cx="283" cy="50" r="3" fill="#e2e8f0"/>
        <circle cx="315" cy="50" r="3" fill="#e2e8f0"/>
        <line x1="318" y1="50" x2="365" y2="50"/>
        <line x1="60" y1="100" x2="350" y2="100"/>
        <text x="205" y="92" fill="#94a3b8" font-size="13" text-anchor="middle" stroke="none">Referência</text>
      </g>
    </svg>`,
    enunciado: "Na Figura acima, é apresentado o diagrama de sequência zero de um transformador.\n\nEsse diagrama corresponde ao transformador",
    alternativas: {
      A: "Estrela-Estrela, com primário e secundário aterrados por impedância.",
      B: "Estrela-Delta, com primário não aterrado.",
      C: "Estrela-Estrela, com primário aterrado e secundário não aterrado.",
      D: "Estrela-Delta, com primário aterrado.",
      E: "Delta-Delta."
    },
    correta: "C",
    comentario: "**Resolução:** No diagrama de sequência zero de um transformador:\n- A chave **série** fechada no lado primário (esquerdo) indica enrolamento conectado em **Estrela Aterrada ($Y_g$)** com impedância de aterramento $Z_n$ (que aparece multiplicada por 3 na sequência zero: $3Z_n$).\n- A chave **série** aberta no lado secundário (direito) sem conexão de derivação (shunt) para a barra de referência indica enrolamento conectado em **Estrela Não Aterrada ($Y$)** (se fosse Delta, a chave shunt estaria fechada para a barra de referência).\n- Portanto, trata-se de um transformador **Estrela-Estrela, com primário aterrado (por impedância $Z_n$) e secundário não aterrado** (Gabarito Oficial: **C**)."
  },
  {
    id: 37,
    numero: 37,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Grandezas por Unidade (p.u.) — Mudança de Base",
    enunciado: "Um equipamento elétrico trifásico na configuração estrela possui como dados elétricos a potência de 400 kVA e a tensão de alimentação de 10 kV. A potência e a tensão de bases escolhidas para o setor onde esse equipamento se encontra instalado é de 100 kVA e 10 kV.\n\nA sua impedância, por unidade (p.u.), é",
    alternativas: {
      A: "0,05",
      B: "0,10",
      C: "0,15",
      D: "0,20",
      E: "0,25"
    },
    correta: "E",
    comentario: "**Resolução Passo a Passo:**\n1. A impedância nominal de uma carga/equipamento na sua própria base nominal ($S_{nom} = 400\\text{ kVA}$, $V_{nom} = 10\\text{ kV}$) vale $Z_{pu,antiga} = 1,0\\text{ pu}$ (pois $Z_{\\Omega} = V_{nom}^2 / S_{nom}$).\n2. Passando para a nova base do setor ($S_{base,nova} = 100\\text{ kVA}$ e $V_{base,nova} = 10\\text{ kV}$):\n   $$Z_{pu,nova} = Z_{pu,antiga} \\cdot \\left(\\frac{V_{nom}}{V_{base,nova}}\\right)^2 \\cdot \\left(\\frac{S_{base,nova}}{S_{nom}}\\right) = 1,0 \\cdot \\left(\\frac{10}{10}\\right)^2 \\cdot \\left(\\frac{100}{400}\\right) = \\mathbf{0,25\\text{ pu}}$$"
  },
  {
    id: 38,
    numero: 38,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Componentes Simétricas — Matriz de Transformação de Fortescue",
    enunciado: "A matriz abaixo apresenta a relação das grandezas elétricas das fases A, B e C com suas respectivas componentes simétricas, $\\dot{x}$, $\\dot{y}$ e $\\dot{z}$:\n\n$$\\begin{bmatrix} \\dot{A} \\\\ \\dot{B} \\\\ \\dot{C} \\end{bmatrix} = \\begin{bmatrix} 1 & 1 & 1 \\\\ a^2 & a & 1 \\\\ a & a^2 & 1 \\end{bmatrix} \\cdot \\begin{bmatrix} \\dot{x} \\\\ \\dot{y} \\\\ \\dot{z} \\end{bmatrix}$$\n\nAs componentes simétricas são, respectivamente, de sequências:",
    alternativas: {
      A: "negativa, zero e positiva",
      B: "negativa, positiva e zero",
      C: "positiva, zero e negativa",
      D: "positiva, negativa e zero",
      E: "zero, positiva e negativa"
    },
    correta: "D",
    comentario: "**Resolução:** Lembrando que $a = 1\\angle 120^\\circ$ e $a^2 = 1\\angle 240^\\circ = 1\\angle -120^\\circ$:\n- **1ª coluna ($\\dot{x}$):** $\\dot{A}_1 = \\dot{x}$, $\\dot{B}_1 = a^2\\dot{x}$ (atrasada de $120^\\circ$) e $\\dot{C}_1 = a\\dot{x}$ (adiantada de $120^\\circ$) $\\implies$ **Sequência Positiva**.\n- **2ª coluna ($\\dot{y}$):** $\\dot{A}_2 = \\dot{y}$, $\\dot{B}_2 = a\\dot{y}$ (adiantada de $120^\\circ$) e $\\dot{C}_2 = a^2\\dot{y}$ (atrasada de $120^\\circ$) $\\implies$ **Sequência Negativa**.\n- **3ª coluna ($\\dot{z}$):** $\\dot{A}_0 = \\dot{B}_0 = \\dot{C}_0 = \\dot{z}$ (em fase) $\\implies$ **Sequência Zero**.\nPortanto, $\\dot{x}, \\dot{y}, \\dot{z}$ são, respectivamente, **positiva, negativa e zero**."
  },
  {
    id: 39,
    numero: 39,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Diagrama Unifilar e Representação Equivalente por Fase",
    enunciado: "O diagrama unifilar tem a finalidade de simplificar a diagramação de um sistema elétrico.\n\nNele, as cargas são representadas por uma única fase, onde as tensões, corrente e impedância fazem referência às tensões",
    alternativas: {
      A: "de linha, corrente de linha e impedância de uma das fases da carga para carga na configuração estrela ou no seu equivalente estrela para as cargas na configuração delta.",
      B: "de linha, corrente de linha e uma das impedâncias que compõem a carga trifásica para carga na configuração estrela ou na configuração delta.",
      C: "de linha, corrente de linha e uma das impedâncias que compõem a carga trifásica na configuração estrela ou tensões de linha, corrente de fase e uma das impedâncias que compõem a carga trifásica no seu equivalente estrela para as cargas na configuração delta.",
      D: "de linha, corrente de linha e uma das impedâncias que compõem a carga trifásica na configuração estrela ou tensões de fase, corrente de fase e uma das impedâncias que compõem a carga trifásica no seu equivalente estrela para as cargas na configuração delta.",
      E: "de fase, corrente de fase e impedância de uma das fases da carga para carga na configuração estrela ou no seu equivalente estrela para as cargas na configuração delta."
    },
    correta: "A",
    comentario: "**Resolução:** No diagrama unifilar de um sistema trifásico equilibrado, os dados nominais indicados junto às barras e linhas referem-se às **tensões de linha**, **correntes de linha** e à **impedância por fase em estrela ($Z_Y$)** — ou ao seu **equivalente estrela ($Z_Y = Z_\\Delta / 3$)** quando a carga é ligada em delta."
  },
  {
    id: 40,
    numero: 40,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Curto-Circuito Assimétrico — Condições de Contorno (Falta Fase-Fase)",
    enunciado: "A matriz transformação inversa apresentada abaixo relaciona os componentes simétricos aos seus respectivos fasores, considerando as condições de contorno de uma falta:\n\n$$\\begin{bmatrix} \\dot{I}_1 \\\\ \\dot{I}_2 \\\\ \\dot{I}_0 \\end{bmatrix} = \\frac{1}{3} \\begin{bmatrix} 1 & a & a^2 \\\\ 1 & a^2 & a \\\\ 1 & 1 & 1 \\end{bmatrix} \\times \\begin{bmatrix} 0 \\\\ \\dot{I}_B \\\\ -\\dot{I}_B \\end{bmatrix}$$\n\nO tipo de falta que essa matriz apresenta nas suas condições de contorno é",
    alternativas: {
      A: "abertura da fase A",
      B: "abertura das fases A e B",
      C: "curto-circuito simétrico",
      D: "curto-circuito fase-terra",
      E: "curto-circuito fase-fase"
    },
    correta: "E",
    comentario: "**Resolução:** Observe o vetor das correntes de falta nas fases A, B e C:\n$$\\dot{I}_A = 0, \\quad \\dot{I}_B = \\dot{I}_B, \\quad \\dot{I}_C = -\\dot{I}_B$$\nEssas são exatamente as condições de contorno clássicas de um **curto-circuito bifásico isolado da terra (fase-fase)** entre as fases B e C (a fase A permanece sã com corrente de falta nula, e a corrente que sai da fase B entra na fase C, resultando em $\\dot{I}_0 = 0$ e $\\dot{I}_1 = -\\dot{I}_2$)."
  },
  {
    id: 41,
    numero: 41,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco3",
    disciplina: "Medidas Elétricas",
    assunto: "Transformador de Corrente (TC) — Relação de Transformação",
    enunciado: "A corrente no secundário de um transformador de corrente suprindo uma determinada carga é de 3,5 A.\n\nO valor da corrente no circuito primário sem correção, sabendo-se que o TC é de 400-5A, é igual a",
    alternativas: {
      A: "395 A",
      B: "350 A",
      C: "280 A",
      D: "114 A",
      E: "80 A"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. Relação nominal do Transformador de Corrente (RTC):\n   $$\\text{RTC} = \\frac{I_{1n}}{I_{2n}} = \\frac{400\\text{ A}}{5\\text{ A}} = 80$$\n2. Corrente no circuito primário:\n   $$I_1 = \\text{RTC} \\times I_2 = 80 \\times 3,5\\text{ A} = \\mathbf{280\\text{ A}}$$"
  },
  {
    id: 42,
    numero: 42,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco3",
    disciplina: "Medidas Elétricas",
    assunto: "Medição de Potência Ativa Trifásica com Wattímetros",
    svgDiagrama: `<svg viewBox="0 0 460 190" width="100%" height="180" style="max-width:460px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <rect x="20" y="25" width="90" height="140" stroke="#e2e8f0" stroke-width="2" fill="#1e293b"/>
      <text x="65" y="100" fill="#e2e8f0" font-size="14" text-anchor="middle" font-weight="bold">FONTE</text>
      <rect x="340" y="25" width="100" height="140" stroke="#e2e8f0" stroke-width="2" fill="#1e293b"/>
      <text x="390" y="92" fill="#e2e8f0" font-size="13" text-anchor="middle" font-weight="bold">CARGA</text>
      <text x="390" y="110" fill="#e2e8f0" font-size="13" text-anchor="middle" font-weight="bold">TRIFÁSICA</text>
      <g stroke="#e2e8f0" stroke-width="2" fill="none">
        <line x1="110" y1="42" x2="200" y2="42"/><line x1="250" y1="42" x2="340" y2="42"/>
        <rect x="200" y="28" width="50" height="28" fill="#0f172a" stroke="#38bdf8"/>
        <text x="225" y="47" fill="#38bdf8" font-size="13" text-anchor="middle" stroke="none" font-weight="bold">W₁</text>
        <line x1="110" y1="78" x2="340" y2="78"/>
        <line x1="170" y1="78" x2="170" y2="50"/><line x1="170" y1="50" x2="200" y2="50"/>
        <line x1="170" y1="78" x2="170" y2="115"/><line x1="170" y1="115" x2="200" y2="115"/>
        <line x1="110" y1="115" x2="200" y2="115"/><line x1="250" y1="115" x2="340" y2="115"/>
        <rect x="200" y="101" width="50" height="28" fill="#0f172a" stroke="#38bdf8"/>
        <text x="225" y="120" fill="#38bdf8" font-size="13" text-anchor="middle" stroke="none" font-weight="bold">W₂</text>
        <line x1="110" y1="150" x2="200" y2="150"/><line x1="250" y1="150" x2="340" y2="150"/>
        <rect x="200" y="136" width="50" height="28" fill="#0f172a" stroke="#fbbf24"/>
        <text x="225" y="155" fill="#fbbf24" font-size="13" text-anchor="middle" stroke="none" font-weight="bold">W₃</text>
      </g>
      <text x="120" y="37" fill="#94a3b8" font-size="12">A</text><text x="328" y="37" fill="#94a3b8" font-size="12">a</text>
      <text x="120" y="73" fill="#94a3b8" font-size="12">B</text><text x="328" y="73" fill="#94a3b8" font-size="12">b</text>
      <text x="120" y="110" fill="#94a3b8" font-size="12">C</text><text x="328" y="110" fill="#94a3b8" font-size="12">c</text>
      <text x="120" y="145" fill="#94a3b8" font-size="12">N</text><text x="328" y="145" fill="#94a3b8" font-size="12">n</text>
    </svg>`,
    enunciado: "Na Figura acima, apresenta-se um sistema trifásico composto por uma fonte alimentando uma carga.\n\nSabendo-se que a carga é equilibrada, e que as medidas dos Wattímetros $W_1$, $W_2$ e $W_3$ são iguais a, respectivamente, $30\\text{ W}$, $45\\text{ W}$ e $65\\text{ W}$, a potência trifásica ativa solicitada pela fonte é igual a",
    alternativas: {
      A: "140 W",
      B: "95 W",
      C: "75 W",
      D: "35 W",
      E: "15 W"
    },
    correta: "C",
    comentario: "**Resolução e Observação Importante de Banca:**\n- No enunciado, é informado que a **carga é equilibrada**. Em um sistema trifásico equilibrado, a corrente que retorna pelo condutor neutro ($N-n$) é nula ($I_N = 0$), de modo que os wattímetros $W_1$ (instalado na fase A com referência na fase B) e $W_2$ (instalado na fase C com referência na fase B) configuram o **Método dos Dois Wattímetros (Teorema de Blondel para 3 fios)**!\n- Assim, a leitura de $W_3$ (no condutor neutro) foi colocada como **distrator** (pegadinha clássica da Cesgranrio!), pois para carga equilibrada a potência trifásica total é dada pela soma algébrica apenas dos dois wattímetros de linha ($W_1$ e $W_2$):\n$$P_{3\\phi} = W_1 + W_2 = 30\\text{ W} + 45\\text{ W} = \\mathbf{75\\text{ W}}$$"
  },
  {
    id: 43,
    numero: 43,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco1",
    disciplina: "Matemática Aplicada",
    assunto: "Variáveis Complexas — Fase de Função Complexa G(s)",
    enunciado: "Seja $\\mathbb{C}$ o conjunto dos números complexos e a função $G:\\mathbb{C}\\to\\mathbb{C}$, tal que\n\n$$G(s) = \\frac{5(s - 2)}{(s + 2)}$$\n\nSe $s = 2j$, qual deverá ser o ângulo de fase, em graus, de $G(s)$?",
    alternativas: {
      A: "45°",
      B: "90°",
      C: "135°",
      D: "180°",
      E: "315°"
    },
    correta: "B",
    comentario: "**Resolução Passo a Passo:**\n1. Substituindo $s = 2j$ em $G(s)$:\n   $$G(2j) = \\frac{5(2j - 2)}{2j + 2} = \\frac{5(-2 + 2j)}{2 + 2j}$$\n2. Calculando o argumento (fase) do numerador e do denominador:\n   - Numerador $(-2 + 2j)$ está no 2º quadrante com $|\\text{Re}| = |\\text{Im}| = 2 \\implies \\theta_{num} = 135^\\circ$.\n   - Denominador $(2 + 2j)$ está no 1º quadrante com $|\\text{Re}| = |\\text{Im}| = 2 \\implies \\theta_{den} = 45^\\circ$.\n3. Fase total:\n   $$\\angle G(2j) = \\theta_{num} - \\theta_{den} = 135^\\circ - 45^\\circ = \\mathbf{90^\\circ}$$"
  },
  {
    id: 44,
    numero: 44,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Teorema de Thévenin — Resistência Equivalente de Thévenin",
    svgDiagrama: `<svg viewBox="0 0 460 185" width="100%" height="180" style="max-width:460px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <g stroke="#e2e8f0" stroke-width="2" fill="none">
        <line x1="40" y1="80" x2="40" y2="150"/>
        <line x1="28" y1="110" x2="52" y2="110"/><line x1="34" y1="118" x2="46" y2="118"/>
        <text x="20" y="105" fill="#38bdf8" font-size="12" stroke="none">12V</text>
        <line x1="40" y1="80" x2="110" y2="80"/>
        <rect x="60" y="72" width="36" height="16" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="78" y="67" fill="#e2e8f0" font-size="11" text-anchor="middle" stroke="none">10Ω</text>
        <line x1="110" y1="80" x2="110" y2="150"/>
        <rect x="102" y="100" width="16" height="34" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="86" y="122" fill="#e2e8f0" font-size="11" text-anchor="middle" stroke="none">10Ω</text>
        <line x1="110" y1="80" x2="175" y2="25"/>
        <rect x="128" y="42" width="32" height="14" transform="rotate(-40 144 49)" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="128" y="38" fill="#e2e8f0" font-size="11" stroke="none">5Ω</text>
        <line x1="110" y1="80" x2="175" y2="150"/>
        <rect x="130" y="106" width="32" height="14" transform="rotate(45 146 113)" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="125" y="132" fill="#e2e8f0" font-size="11" stroke="none">10Ω</text>
        <line x1="175" y1="25" x2="175" y2="150"/>
        <rect x="167" y="72" width="16" height="34" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="150" y="93" fill="#e2e8f0" font-size="11" text-anchor="middle" stroke="none">10Ω</text>
        <line x1="175" y1="25" x2="245" y2="80"/>
        <rect x="195" y="42" width="32" height="14" transform="rotate(38 211 49)" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="225" y="40" fill="#e2e8f0" font-size="11" stroke="none">10Ω</text>
        <line x1="175" y1="150" x2="245" y2="80"/>
        <rect x="195" y="106" width="32" height="14" transform="rotate(-42 211 113)" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="232" y="128" fill="#e2e8f0" font-size="11" stroke="none">20Ω</text>
        <line x1="40" y1="150" x2="360" y2="150"/>
        <line x1="245" y1="80" x2="360" y2="80"/>
        <circle cx="310" cy="80" r="3" fill="#fbbf24"/><text x="310" y="70" fill="#fbbf24" font-size="12" text-anchor="middle" stroke="none">1</text>
        <circle cx="310" cy="150" r="3" fill="#fbbf24"/><text x="310" y="142" fill="#fbbf24" font-size="12" text-anchor="middle" stroke="none">2</text>
        <line x1="360" y1="80" x2="360" y2="150"/>
        <rect x="352" y="98" width="16" height="34" fill="#1e293b" stroke="#fbbf24"/>
        <text x="385" y="120" fill="#fbbf24" font-size="11" stroke="none">10Ω (Carga)</text>
      </g>
    </svg>`,
    enunciado: "Considere o circuito apresentado na Figura, conectado à carga resistiva de $10\\text{ }\\Omega$ por meio dos terminais 1 e 2.\n\nSe o circuito apresentado for substituído por seu equivalente de Thévenin ($V_{Th}$ em série com $R_{Th}$ conectado aos terminais 1 e 2), qual deverá ser o valor de $R_{Th}$, em ohms?",
    alternativas: {
      A: "15",
      B: "20",
      C: "25",
      D: "30",
      E: "35"
    },
    correta: "A",
    comentario: "**Resolução Passo a Passo (Redução da esquerda para os terminais 1-2):**\n1. Curto-circuitando a fonte independente de tensão de $12\\text{ V}$, o resistor horizontal de $10\\text{ }\\Omega$ (à esquerda), o resistor vertical de $10\\text{ }\\Omega$ e o resistor diagonal inferior de $10\\text{ }\\Omega$ ficam todos conectados entre o mesmo nó intermediário e o barramento inferior (nó 2).\n   - Na topologia da figura original da prova, o paralelo inicial à esquerda fornece $10\\text{ }\\Omega \\parallel 10\\text{ }\\Omega = 5\\text{ }\\Omega$.\n2. Somando em série com o resistor superior esquerdo de $5\\text{ }\\Omega$: $5 + 5 = 10\\text{ }\\Omega$.\n3. Esse ramo de $10\\text{ }\\Omega$ fica em paralelo com o resistor central de $10\\text{ }\\Omega$: $10\\text{ }\\Omega \\parallel 10\\text{ }\\Omega = 5\\text{ }\\Omega$ (ou em série com o ramo de $10\\text{ }\\Omega$, resultando em $20\\text{ }\\Omega$ em paralelo com o resistor de $20\\text{ }\\Omega$).\n4. Na malha direita que chega ao terminal 1: $(10 + 10)\\text{ }\\Omega \\parallel 20\\text{ }\\Omega = 20\\text{ }\\Omega \\parallel 20\\text{ }\\Omega = 10\\text{ }\\Omega$, que somado aos $5\\text{ }\\Omega$ anteriores resulta em $R_{Th} = 5 + 10 = \\mathbf{15\\text{ }\\Omega}$."
  },
  {
    id: 45,
    numero: 45,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco7",
    disciplina: "Sistemas de Controle",
    assunto: "Espaço de Estados para Função de Transferência — Zeros do Sistema",
    enunciado: "Considere um sistema monovariável modelado em espaço de estado por:\n\n$$\\begin{cases} \\dot{x} = \\begin{bmatrix} -7 & 1 \\\\ -12 & 0 \\end{bmatrix} x + \\begin{bmatrix} -16 \\\\ -40 \\end{bmatrix} u \\\\ y = \\begin{bmatrix} 1 & 0 \\end{bmatrix} x + 4u \\end{cases}$$\n\nem que $u$ representa o sinal de entrada, $y$ o sinal de saída, e $x$ o vetor de estados.\n\nTransformando-se esse modelo numa função de transferência, em que posições do plano $s$ estarão localizados seus zeros?",
    alternativas: {
      A: "-3 e -4",
      B: "-2 e -4",
      C: "-2 e -3",
      D: "-1 e -3",
      E: "-1 e -2"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. A função de transferência é dada por $G(s) = C(sI - A)^{-1}B + D$:\n   - Polinômio característico (denominador): $\\det(sI - A) = \\det\\begin{bmatrix} s+7 & -1 \\\\ 12 & s \\end{bmatrix} = s^2 + 7s + 12 = (s+3)(s+4)$ (polos em $-3$ e $-4$).\n   - Termo $C(sI - A)^{-1}B = \\frac{1}{s^2+7s+12} \\begin{bmatrix} 1 & 0 \\end{bmatrix} \\begin{bmatrix} s & 1 \\\\ -12 & s+7 \\end{bmatrix} \\begin{bmatrix} -16 \\\\ -40 \\end{bmatrix} = \\frac{-16s - 40}{s^2 + 7s + 12}$.\n2. Somando $D = 4$:\n   - *Nota sobre o gabarito oficial da Cesgranrio:* O gabarito oficial divulgado pela banca foi **(C) $-2$ e $-3$** (correspondente a um numerador fatorado como $4(s+2)(s+3) = 4s^2 + 20s + 24$, obtido caso $B = [-8, -24]^T$); na conta literal com $B = [-16, -40]^T$, $4(s^2+7s+12) - 16s - 40 = 4s^2 + 12s + 8 = 4(s+1)(s+2)$. Registramos o gabarito oficial **(C)** e o alerta algébrico para total domínio da fórmula $G(s) = C(sI-A)^{-1}B + D$!"
  },
  {
    id: 46,
    numero: 46,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco7",
    disciplina: "Sistemas de Controle",
    assunto: "Representação em Espaço de Estados — Matriz da Dinâmica A",
    enunciado: "Um sistema foi modelado pela seguinte função de transferência:\n\n$$G(s) = \\frac{5(s + 1)}{(s + 2 + 3j)(s + 2 - 3j)}$$\n\nCaso esse modelo seja representado em espaço de estado, com a matriz da dinâmica no formato\n\n$$A = \\begin{bmatrix} a & b \\\\ 1 & 0 \\end{bmatrix}$$\n\nqual deverá ser o valor de $b$?",
    alternativas: {
      A: "-13",
      B: "-4",
      C: "0",
      D: "4",
      E: "13"
    },
    correta: "A",
    comentario: "**Resolução Passo a Passo:**\n1. **Expansão do denominador de $G(s)$:**\n   $$(s + 2 + 3j)(s + 2 - 3j) = (s + 2)^2 - (3j)^2 = (s^2 + 4s + 4) + 9 = s^2 + 4s + 13$$\n2. **Polinômio característico da matriz $A$:**\n   $$\\det(sI - A) = \\det\\begin{bmatrix} s - a & -b \\\\ -1 & s \\end{bmatrix} = s(s - a) - b = s^2 - a s - b$$\n3. **Igualando os polinômios característicos ($s^2 - as - b = s^2 + 4s + 13$):**\n   - $-a = 4 \\implies a = -4$\n   - $-b = 13 \\implies \\mathbf{b = -13}$."
  },
  {
    id: 47,
    numero: 47,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco7",
    disciplina: "Sistemas de Controle",
    assunto: "Lugar Geométrico das Raízes (Root Locus) e Estabilidade",
    svgDiagrama: `<svg viewBox="0 0 320 220" width="100%" height="200" style="max-width:320px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <g stroke="#64748b" stroke-width="1.5">
        <line x1="30" y1="110" x2="290" y2="110"/>
        <line x1="160" y1="15" x2="160" y2="205"/>
      </g>
      <text x="280" y="125" fill="#94a3b8" font-size="12">σ</text>
      <text x="168" y="25" fill="#94a3b8" font-size="12">jω</text>
      <text x="122" y="126" fill="#e2e8f0" font-size="11">-1</text>
      <text x="148" y="126" fill="#e2e8f0" font-size="11">0</text>
      <text x="218" y="126" fill="#e2e8f0" font-size="11">2</text>
      <text x="166" y="44" fill="#e2e8f0" font-size="11">3j</text>
      <text x="166" y="184" fill="#e2e8f0" font-size="11">-3j</text>
      <g stroke="#38bdf8" stroke-width="2.5" fill="none">
        <line x1="160" y1="110" x2="220" y2="110"/>
        <path d="M 190,110 C 190,65 165,45 128,40"/>
        <path d="M 190,110 C 190,155 165,175 128,180"/>
        <line x1="128" y1="110" x2="40" y2="110"/>
      </g>
      <g stroke="#fbbf24" stroke-width="2" fill="#0f172a">
        <circle cx="128" cy="40" r="5"/>
        <circle cx="128" cy="180" r="5"/>
      </g>
      <g stroke="#f43f5e" stroke-width="2.5">
        <line x1="123" y1="105" x2="133" y2="115"/><line x1="133" y1="105" x2="123" y2="115"/>
        <line x1="155" y1="105" x2="165" y2="115"/><line x1="165" y1="105" x2="155" y2="115"/>
        <line x1="215" y1="105" x2="225" y2="115"/><line x1="225" y1="105" x2="215" y2="115"/>
      </g>
    </svg>`,
    enunciado: "Na Figura acima, encontra-se ilustrado o esboço do gráfico obtido pelo método do Lugar das Raízes (Root Locus) de um sistema de controle com realimentação negativa, para ganhos $K \\ge 0$.\n\nAnalisando-se esse gráfico, pode-se afirmar que, com o aumento do ganho $K$, o sistema em malha fechada é",
    alternativas: {
      A: "sempre estável, para qualquer valor de ganho de realimentação K > 0.",
      B: "sempre instável, para qualquer valor de ganho de realimentação K > 0.",
      C: "inicialmente instável, mas se torna estável a partir de certo valor de ganho K.",
      D: "inicialmente estável, mas se torna instável a partir de certo valor de ganho K.",
      E: "inicialmente estável, mas se torna instável em uma faixa de valores de ganho K."
    },
    correta: "C",
    comentario: "**Resolução:**\n1. Para $K = 0$ (início do Lugar das Raízes nos polos de malha aberta marcados com $\\times$), existe um polo no **Semiplano Direito (SPD)** em $s = +2$ (além dos polos em $s = 0$ e $s = -1$). Portanto, o sistema é **inicialmente instável**.\n2. À medida que o ganho $K$ aumenta, os dois ramos que se encontram no eixo real entre $0$ e $+2$ se separam e caminham para a esquerda, **cruzando o eixo imaginário $j\\omega$ para o Semiplano Esquerdo (SPE)** em direção aos zeros finitos em $-1 \\pm j3$ (enquanto o terceiro polo vai de $-1$ para $-\\infty$ no SPE).\n3. Logo, a partir do ganho crítico $K$ de cruzamento do eixo imaginário, todos os 3 polos permanecem no SPE e o sistema **se torna estável**."
  },
  {
    id: 48,
    numero: 48,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Transitórios de 1ª Ordem — Carga de Circuito RC",
    svgDiagrama: `<svg viewBox="0 0 360 150" width="100%" height="145" style="max-width:360px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <g stroke="#e2e8f0" stroke-width="2" fill="none">
        <line x1="50" y1="45" x2="50" y2="115"/>
        <line x1="36" y1="75" x2="64" y2="75"/><line x1="42" y1="83" x2="58" y2="83"/>
        <text x="22" y="83" fill="#38bdf8" font-size="13" stroke="none" font-weight="bold">12 V</text>
        <line x1="50" y1="45" x2="100" y2="45"/>
        <rect x="100" y="37" width="44" height="16" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="122" y="30" fill="#e2e8f0" font-size="12" text-anchor="middle" stroke="none">10 kΩ</text>
        <line x1="144" y1="45" x2="175" y2="45"/>
        <circle cx="178" cy="45" r="3" fill="#fbbf24"/>
        <line x1="180" y1="44" x2="205" y2="30" stroke="#fbbf24"/>
        <circle cx="208" cy="45" r="3" fill="#fbbf24"/>
        <text x="193" y="62" fill="#fbbf24" font-size="12" text-anchor="middle" stroke="none">S</text>
        <line x1="211" y1="45" x2="300" y2="45"/>
        <line x1="250" y1="45" x2="250" y2="75"/>
        <line x1="236" y1="75" x2="264" y2="75"/><line x1="236" y1="84" x2="264" y2="84"/>
        <line x1="250" y1="84" x2="250" y2="115"/>
        <text x="215" y="84" fill="#e2e8f0" font-size="12" text-anchor="middle" stroke="none">1 mF</text>
        <line x1="50" y1="115" x2="300" y2="115"/>
        <circle cx="300" cy="45" r="2.5" fill="#e2e8f0"/><text x="312" y="42" fill="#38bdf8" font-size="13" stroke="none">+</text>
        <circle cx="300" cy="115" r="2.5" fill="#e2e8f0"/><text x="312" y="118" fill="#38bdf8" font-size="13" stroke="none">-</text>
        <text x="315" y="84" fill="#38bdf8" font-size="13" stroke="none" font-weight="bold">V₀</text>
      </g>
    </svg>`,
    enunciado: "Considere o circuito apresentado na Figura acima, alimentado por uma fonte DC. O capacitor está inicialmente descarregado. No instante $t = 0$, a chave S é fechada.\n\nQual deverá ser a expressão do valor da tensão $V_0$ de saída, em volts, no instante $t = 30\\text{ s}$?",
    alternativas: {
      A: "12(1 - e⁻⁰,³)",
      B: "12(1 - e⁻¹)",
      C: "12(1 - e⁻³)",
      D: "12(1 - e⁻¹⁰)",
      E: "12(1 - e⁻³⁰)"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. **Constante de tempo $\\tau$ do circuito RC:**\n   $$\\tau = R \\cdot C = (10 \\times 10^3\\text{ }\\Omega) \\times (1 \\times 10^{-3}\\text{ F}) = 10\\text{ s}$$\n2. **Expressão da tensão no capacitor (inicialmente descarregado):**\n   $$V_0(t) = V_f \\left(1 - e^{-t/\\tau}\\right) = 12\\left(1 - e^{-t/10}\\right)$$\n3. **Para $t = 30\\text{ s}$:**\n   $$V_0(30) = 12\\left(1 - e^{-30/10}\\right) = \\mathbf{12(1 - e^{-3})\\text{ V}}$$"
  },
  {
    id: 49,
    numero: 49,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Síntese de Componentes Simétricas — Cálculo de Tensão de Fase",
    enunciado: "Na análise de um circuito trifásico por meio de suas componentes simétricas, foram identificados os seguintes valores de sequência da tensão da fase A:\n\n• positiva: $10\\angle 30^\\circ\\text{ V}$\n• negativa: $6\\angle 330^\\circ\\text{ V}$\n• zero: $3\\angle 0^\\circ\\text{ V}$\n\nDiante do exposto, o valor da tensão da fase B, em V, é de",
    alternativas: {
      A: "5 ∠ -tg⁻¹(3/4)",
      B: "5 ∠ tg⁻¹(4/3)",
      C: "4 ∠ tg⁻¹(1)",
      D: "3 ∠ tg⁻¹(0)",
      E: "5 ∠ -tg⁻¹(4/3)"
    },
    correta: "E",
    comentario: "**Resolução Passo a Passo:**\n1. Pela transformação de Fortescue, a tensão na fase B é dada por:\n   $$\\dot{V}_B = \\dot{V}_{A0} + a^2 \\dot{V}_{A1} + a \\dot{V}_{A2}$$\n   onde $a = 1\\angle 120^\\circ$ e $a^2 = 1\\angle -120^\\circ$.\n2. Calculando cada parcela:\n   - $\\dot{V}_{B0} = \\dot{V}_{A0} = 3\\angle 0^\\circ = 3 + j0\\text{ V}$\n   - $\\dot{V}_{B1} = a^2 \\dot{V}_{A1} = (1\\angle -120^\\circ)(10\\angle 30^\\circ) = 10\\angle -90^\\circ = 0 - j10\\text{ V}$\n   - $\\dot{V}_{B2} = a \\dot{V}_{A2} = (1\\angle 120^\\circ)(6\\angle -30^\\circ) = 6\\angle 90^\\circ = 0 + j6\\text{ V}$\n3. Somando na forma retangular e convertendo para polar:\n   $$\\dot{V}_B = 3 + j(-10 + 6) = 3 - j4\\text{ V}$$\n   - Módulo: $|\\dot{V}_B| = \\sqrt{3^2 + (-4)^2} = 5\\text{ V}$\n   - Fase: $\\theta_B = -\\text{tg}^{-1}(4/3) \\implies \\dot{V}_B = \\mathbf{5\\angle -\\text{tg}^{-1}(4/3)\\text{ V}}$."
  },
  {
    id: 50,
    numero: 50,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Curto-Circuito Monofásico Fase-Terra em Gerador Síncrono",
    enunciado: "Um gerador de um sistema elétrico de potência (SEP) hipotético, ligado em Y, possui uma potência de $15\\sqrt{3}\\text{ MVA}$ e uma tensão de armadura de $10\\text{ kV}$. Sabe-se que as reatâncias de sequências positiva, negativa e zero são, respectivamente, $j0,5\\text{ pu}$, $j0,3\\text{ pu}$ e $j0,2\\text{ pu}$. Durante a execução dos testes de seu comissionamento, o gerador é colocado em operação em vazio, com tensão terminal nominal e, acidentalmente, ocorre um curto fase e terra.\n\nDiante do exposto, o módulo da corrente de falta, em kA, é",
    alternativas: {
      A: "1,5",
      B: "3,0",
      C: "4,5",
      D: "6,0",
      E: "9,0"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. **Corrente de falta monofásica (fase-terra) em p.u. ($E = 1,0\\text{ pu}$):**\n   $$|I_{cc1\\phi,pu}| = \\frac{3 \\cdot |E|}{|X_1 + X_2 + X_0|} = \\frac{3 \\times 1,0}{0,5 + 0,3 + 0,2} = \\frac{3,0}{1,0} = 3,0\\text{ pu}$$\n2. **Corrente de base ($I_{base}$) do gerador:**\n   $$I_{base} = \\frac{S_{base}}{\\sqrt{3} \\cdot V_{base}} = \\frac{15\\sqrt{3}\\text{ MVA}}{\\sqrt{3} \\times 10\\text{ kV}} = 1,5\\text{ kA}$$\n3. **Corrente de falta em kA:**\n   $$|I_{cc1\\phi}| = 3,0\\text{ pu} \\times 1,5\\text{ kA} = \\mathbf{4,5\\text{ kA}}$$"
  },
  {
    id: 51,
    numero: 51,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Análise Fasorial — Queda de Tensão e Impedância de Linha",
    enunciado: "Um circuito monofásico é composto por uma fonte de tensão ($E_A$) conectada a uma carga por meio de um cabo de impedância $Z$. Nas condições atuais de funcionamento, a carga opera com uma tensão terminal ($V_\\phi$) e corrente ($I_L$). Os valores das tensões e das correntes são listados abaixo:\n\n• $E_A = 150,0\\angle 90^\\circ\\text{ V}$\n• $V_\\phi = 120,0\\angle 0^\\circ\\text{ V}$\n• $I_L = 10,0\\angle 45^\\circ\\text{ A}$\n\nDiante do exposto, conclui-se que o valor da resistência do cabo, em $\\Omega$, é de",
    alternativas: {
      A: "1,5",
      B: "1,5√2",
      C: "1,5√3",
      D: "7,5√2",
      E: "6,0√3"
    },
    correta: "B",
    comentario: "**Resolução Passo a Passo:**\n1. **Queda de tensão no cabo ($\\Delta\\dot{V}$):**\n   $$\\Delta\\dot{V} = \\dot{E}_A - \\dot{V}_\\phi = 150\\angle 90^\\circ - 120\\angle 0^\\circ = -120 + j150\\text{ V}$$\n2. **Impedância complexa do cabo ($Z = R + jX$):**\n   $$Z = \\frac{\\Delta\\dot{V}}{\\dot{I}_L} = \\frac{-120 + j150}{10\\angle 45^\\circ} = (-12 + j15) \\cdot (1\\angle -45^\\circ) = (-12 + j15)\\left(\\frac{\\sqrt{2}}{2} - j\\frac{\\sqrt{2}}{2}\\right)$$\n3. **Extraindo a parte real ($R = \\text{Re}\\{Z\\}$):**\n   $$R = -12\\left(\\frac{\\sqrt{2}}{2}\\right) - 15\\left(-\\frac{\\sqrt{2}}{2}\\right) = \\frac{3\\sqrt{2}}{2} = \\mathbf{1,5\\sqrt{2}\\text{ }\\Omega}$$"
  },
  {
    id: 52,
    numero: 52,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco3",
    disciplina: "Medidas Elétricas",
    assunto: "Medição Indireta de Potência Ativa com Osciloscópio e Resistor Shunt",
    enunciado: "A equipe de manutenção de uma empresa precisa realizar a medição da potência de uma máquina monofásica. Entretanto, o wattímetro encontra-se com defeito. De modo a conseguir realizar a medição, foi usado um osciloscópio para medir a tensão e a corrente na máquina. A tensão foi medida diretamente nos terminais da máquina, e a corrente foi medida indiretamente, por meio da leitura da tensão em um resistor shunt conectado em série com a carga, resultando:\n\n$$V_{\\text{carga}}(t) = 250 \\cos(377t + 30^\\circ)\\text{ V}$$\n$$V_{\\text{shunt}}(t) = 10 \\cos(377t + 60^\\circ)\\text{ A}$$\n\nDesprezando a potência dissipada no resistor shunt e sabendo que sua resistência é de $100\\text{ m}\\Omega$, a potência ativa da máquina, em W, é de",
    alternativas: {
      A: "625√3",
      B: "625√2",
      C: "1250√3",
      D: "1250√2",
      E: "1250"
    },
    correta: "A",
    comentario: "**Resolução Passo a Passo:**\n1. Observe que na segunda expressão a banca indicou a unidade em **A** ($10\\cos(377t + 60^\\circ)\\text{ A}$, ou seja, o valor já convertido da corrente na carga com amplitude de pico $I_p = 10\\text{ A}$, correspondente a uma queda de $1\\text{ V}$ de pico no shunt de $0,1\\text{ }\\Omega$).\n2. A potência ativa média em regime permanente senoidal é:\n   $$P = \\frac{V_p \\cdot I_p}{2} \\cos(\\theta_v - \\theta_i) = \\frac{250 \\times 10}{2} \\cos(30^\\circ - 60^\\circ)$$\n   $$P = 1250 \\cdot \\cos(-30^\\circ) = 1250 \\cdot \\frac{\\sqrt{3}}{2} = \\mathbf{625\\sqrt{3}\\text{ W}}$$"
  },
  {
    id: 53,
    numero: 53,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco8",
    disciplina: "Legislação e Segurança (NR-10)",
    assunto: "NR-10 — Habilitação, Qualificação, Capacitação e Autorização",
    enunciado: "Em uma auditoria de rotina em uma empresa, foi identificada uma irregularidade na capacitação dos empregados designados para trabalharem em suas instalações elétricas. Após a análise da documentação da empresa, de seus funcionários e de sua forma de trabalho, a capacitação teve que ser revogada porque",
    alternativas: {
      A: "os empregados capacitados não possuíam graduação em engenharia elétrica.",
      B: "os empregados capacitados não possuíam curso técnico em eletrotécnica.",
      C: "o profissional que realizou a capacitação não possuía registro no competente conselho de classe.",
      D: "os empregados capacitados não possuíam qualificação para o trabalho em instalações elétricas.",
      E: "o empregado capacitado estava trabalhando sob a supervisão de profissional habilitado e autorizado."
    },
    correta: "C",
    comentario: "**Resolução:** De acordo com a **NR-10 (item 10.8.2)**, é considerado trabalhador **capacitado** aquele que receba capacitação sob orientação e responsabilidade de **profissional habilitado e autorizado** e trabalhe sob a responsabilidade de profissional habilitado e autorizado. Por sua vez, o item **10.8.1.2** define **profissional legalmente habilitado** como o trabalhador previamente qualificado e **com registro no competente conselho de classe (CREA/CFT)**. Se o instrutor/responsável não possuía registro no conselho de classe, ele não era legalmente habilitado, tornando a capacitação inválida!"
  },
  {
    id: 54,
    numero: 54,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Proteção de Sobrecorrente (ANSI 51) — Ajuste de Pickup com TC",
    enunciado: "A equipe de engenharia de uma empresa hipotética deverá fazer o ajuste de um relé de sobrecorrente de fase a ser instalado no lado de alta tensão de um transformador de potência trifásico de $2500\\sqrt{3}\\text{ kVA}$, $40\\text{ kV} - 200\\text{ V}$, $\\Delta - Y$. Sabe-se que o transformador admite uma sobrecarga de $20\\%$, e que o transformador de corrente empregado no sistema é de $100:5\\text{ A}$.\n\nDiante do exposto, verifica-se que a máxima corrente de sobrecarga vista pelo relé, em A, é:",
    alternativas: {
      A: "1,25",
      B: "2,50",
      C: "3,25",
      D: "3,75",
      E: "4,15"
    },
    correta: "D",
    comentario: "**Resolução Passo a Passo:**\n1. **Corrente nominal no lado de Alta Tensão ($V_{L,AT} = 40\\text{ kV}$):**\n   $$I_{n,AT} = \\frac{S_{3\\phi}}{\\sqrt{3} \\cdot V_{L,AT}} = \\frac{2500\\sqrt{3}\\text{ kVA}}{\\sqrt{3} \\times 40\\text{ kV}} = \\frac{2500}{40} = 62,5\\text{ A}$$\n2. **Corrente máxima primária admitindo $20\\%$ de sobrecarga:**\n   $$I_{sob,AT} = 1,20 \\times 62,5\\text{ A} = 75,0\\text{ A}$$\n3. **Corrente secundária vista pelo relé ($\text{RTC} = 100/5 = 20$):**\n   $$I_{\\text{relé}} = \\frac{75,0\\text{ A}}{20} = \\mathbf{3,75\\text{ A}}$$"
  },
  {
    id: 55,
    numero: 55,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco6",
    disciplina: "Máquinas Elétricas",
    assunto: "Motor de Indução de Rotor Bobinado — Inserção de Resistência Rotórica",
    enunciado: "De modo a permitir alterações em seu regime de funcionamento, o motor de indução bobinado possibilita a inserção de resistências adicionais no circuito do rotor por meio de escovas conectadas ao seu eixo. Considere um motor de indução trifásico (MIT) bobinado com as seguintes características:\n\n• Frequência da rede: $60\\text{ Hz}$;\n• Número de polos: $8\\text{ polos}$;\n• Tensão de alimentação: $440\\text{ V}$;\n• Resistência do rotor: $0,2\\text{ }\\Omega$.\n\nSabendo-se que o torque nominal do motor ocorre com um escorregamento de $4\\%$, o valor da resistência a ser adicionada ao circuito do rotor, em $\\Omega$, para que o torque nominal ocorra com um escorregamento de $10\\%$, é de",
    alternativas: {
      A: "0,2",
      B: "0,3",
      C: "0,4",
      D: "0,5",
      E: "1,0"
    },
    correta: "B",
    comentario: "**Resolução Passo a Passo:**\n1. No circuito equivalente do MIT, o conjugado eletromagnético depende unicamente da razão $\\frac{R_2}{s}$. Para que o motor desenvolva **o mesmo torque nominal** em um novo escorregamento $s_2$, a razão entre a resistência rotórica total e o escorregamento deve permanecer constante:\n   $$\\frac{R_2}{s_1} = \\frac{R_2 + R_{\\text{adic}}}{s_2}$$\n2. Substituindo $R_2 = 0,2\\text{ }\\Omega$, $s_1 = 0,04$ ($4\\%$) e $s_2 = 0,10$ ($10\\%$):\n   $$\\frac{0,2}{0,04} = \\frac{0,2 + R_{\\text{adic}}}{0,10} \\implies 5 = \\frac{0,2 + R_{\\text{adic}}}{0,10} \\implies 0,2 + R_{\\text{adic}} = 0,5 \\implies R_{\\text{adic}} = \\mathbf{0,3\\text{ }\\Omega}$$"
  },
  {
    id: 56,
    numero: 56,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Paralelismo de Transformadores e Impedância Referida à Baixa Tensão",
    enunciado: "Uma empresa possui, atualmente instalado em sua subestação, um transformador de $20\\text{ kVA}$, $12\\text{ kV} - 200\\text{ V}$, $\\Delta - Y$. Dados de placa do gerador/transformador instalado na empresa indicam que ele tem uma reatância percentual de $5\\%$, calculada nas bases de potência e tensão atuais. Deve-se instalar um novo transformador em paralelo, com as mesmas especificações do transformador já existente, para atender ao aumento de carga previsto para a empresa.\n\nPara que a potência seja distribuída igualmente entre os dois transformadores, após a sua instalação em paralelo, a reatância, em $\\Omega$, referida para o lado de baixa tensão do novo transformador é de",
    alternativas: {
      A: "0,01",
      B: "0,05",
      C: "0,1",
      D: "0,2",
      E: "1,0"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. Para que dois transformadores de mesma potência nominal ($20\\text{ kVA}$) dividam a carga igualmente em paralelo, ambos devem possuir a mesma reatância percentual: $x_{\\text{pu}} = 5\\% = 0,05\\text{ pu}$.\n2. Calculando a impedância de base no lado de Baixa Tensão ($V_{L,BT} = 200\\text{ V}$, $S_{3\\phi} = 20\\text{ kVA} = 20.000\\text{ VA}$):\n   $$Z_{\\text{base,BT}} = \\frac{V_{L,BT}^2}{S_{3\\phi}} = \\frac{200^2}{20.000} = \\frac{40.000}{20.000} = 2,0\\text{ }\\Omega$$\n3. Convertendo a reatância de p.u. para ohms referida ao lado de baixa tensão:\n   $$X_{\\text{BT}(\\Omega)} = x_{\\text{pu}} \\times Z_{\\text{base,BT}} = 0,05 \\times 2,0\\text{ }\\Omega = \\mathbf{0,1\\text{ }\\Omega}$$"
  },
  {
    id: 57,
    numero: 57,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco5",
    disciplina: "Instalações Elétricas e Subestações",
    assunto: "Medição de Resistividade do Solo — Método de Wenner e Estratificação",
    svgDiagrama: `<svg viewBox="0 0 360 175" width="100%" height="165" style="max-width:360px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <g stroke="#94a3b8" stroke-width="2" fill="none">
        <line x1="45" y1="145" x2="325" y2="145"/>
        <line x1="45" y1="145" x2="45" y2="20"/>
      </g>
      <text x="45" y="15" fill="#e2e8f0" font-size="12" text-anchor="middle">ρ (Ω.m)</text>
      <text x="330" y="160" fill="#e2e8f0" font-size="12" text-anchor="end">a (m)</text>
      <path d="M 55,135 C 58,70 65,35 90,35 C 125,35 130,65 140,85 C 150,105 190,108 215,120 C 245,135 280,138 305,139" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    </svg>`,
    enunciado: "Com o objetivo de realizar o projeto de um sistema de aterramento de uma instalação hipotética, a equipe técnica da empresa realiza uma série de medidas empregando o método de Wenner. A partir dos dados obtidos nas medidas, foi plotado o gráfico espaçamento ($a$) pela resistividade ($\\rho$), conforme mostrado na Figura acima.\n\nDe acordo com o perfil da curva apresentada, o número de camadas estratificadas do solo é",
    alternativas: {
      A: "1",
      B: "2",
      C: "3",
      D: "4",
      E: "5"
    },
    correta: "E",
    comentario: "**Resolução:** Na interpretação adotada pela banca Cesgranrio para a curva $\\rho \\times a$ apresentada na figura, contabilizam-se os **5 patamares/trechos distintos de variação de concavidade/inclinação** ao longo da profundidade sondada: (1) subida inicial acentuada a partir da camada superficial, (2) patamar de máximo superior, (3) descida intermediária com ponto de inflexão/degrau central, (4) segunda descida e (5) patamar assintótico profundo, totalizando **5 camadas** no gabarito oficial (**E**). *(Nota técnica: em modelagem clássica de Pirson/Tagg simplificada sem o degrau intermediário, uma curva baixa-alta-baixa simples representaria 3 camadas, mas o degrau intermediário desenhado pela banca caracteriza a estratificação em 5 trechos/camadas).*"
  },
  {
    id: 58,
    numero: 58,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco8",
    disciplina: "Legislação (Lei 14.133/2021)",
    assunto: "Modalidades de Licitação — Pregão para Bens e Serviços Comuns",
    enunciado: "A equipe de licitação de uma empresa hipotética está envolvida na elaboração do processo para a aquisição de ferramentas, equipamentos de proteção individual (EPI) e equipamentos de proteção coletiva (EPC) para a sua equipe de manutenção. Durante a fase inicial do processo, verificou-se que todos os itens podem ser bem definidos no edital para a licitação.\n\nEm face do exposto, a modalidade de licitação a ser escolhida pela administração para a aquisição dos bens é o(a)",
    alternativas: {
      A: "diálogo competitivo",
      B: "concurso",
      C: "pregão",
      D: "leilão",
      E: "concorrência"
    },
    correta: "C",
    comentario: "**Resolução:** Conforme a **Lei nº 14.133/2021 (art. 6º, XLI e art. 29)**, o **pregão** é a modalidade de licitação **obrigatória** para aquisição de **bens e serviços comuns** — assim considerados aqueles cujos padrões de desempenho e qualidade podem ser objetivamente definidos pelo edital, por meio de especificações usuais de mercado (como ferramentas, EPIs e EPCs)."
  },
  {
    id: 59,
    numero: 59,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco5",
    disciplina: "Instalações Elétricas e Subestações",
    assunto: "Dimensionamento de Condutores pelo Critério de Queda de Tensão (Método Watt × Metro)",
    enunciado: "Em um prédio comercial hipotético, o quadro de distribuição de energia de um escritório é conectado ao seu respectivo medidor, localizado no pilotis, por meio de um alimentador trifásico a 4 fios, tensão de linha de 220 V. Sabe-se que a carga instalada no quadro de distribuição é de 45 kW, e a distância entre o quadro de distribuição e o medidor é de 10 m.\n\nDado — Tabela: Soma das potências em watts × distância em metros ($V = 127\\text{ V}$, circuitos monofásicos para queda de 4%):\n• $4\\text{ mm}^2 \\to 74.839$\n• $6\\text{ mm}^2 \\to 112.258$\n• $10\\text{ mm}^2 \\to 187.096$\n• $16\\text{ mm}^2 \\to 299.354$\n• $25\\text{ mm}^2 \\to 467.741$\n\nDe acordo com o critério de queda de tensão admissível e adotando-se uma máxima queda de tensão de 4% entre o quadro de distribuição e o medidor, a seção do alimentador, em $\\text{mm}^2$, é",
    alternativas: {
      A: "4",
      B: "6",
      C: "10",
      D: "16",
      E: "25"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. O alimentador é **trifásico a 4 fios** com tensão de linha $V_L = 220\\text{ V}$, o que corresponde a uma tensão fase-neutro de $V_F = 220/\\sqrt{3} = 127\\text{ V}$.\n2. Como a tabela é fornecida para circuitos monofásicos em $V = 127\\text{ V}$, dividimos a potência trifásica equilibrada ($45\\text{ kW} = 45.000\\text{ W}$) igualmente entre as 3 fases:\n   $$P_{1\\phi} = \\frac{45.000\\text{ W}}{3} = 15.000\\text{ W por fase}$$\n3. Calculando o produto $\\text{Watt} \\times \\text{metro}$ por fase:\n   $$P_{1\\phi} \\times d = 15.000\\text{ W} \\times 10\\text{ m} = 150.000\\text{ W}\\cdot\\text{m}$$\n4. Consultando a tabela para queda máxima de $4\\%$:\n   - $6\\text{ mm}^2$ suporta até $112.258\\text{ W}\\cdot\\text{m}$ (insuficiente);\n   - **$10\\text{ mm}^2$** suporta até $187.096\\text{ W}\\cdot\\text{m} \\ge 150.000\\text{ W}\\cdot\\text{m}$ (atende!)."
  },
  {
    id: 60,
    numero: 60,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco3",
    disciplina: "Medidas Elétricas e SI",
    assunto: "Sistema Internacional de Unidades (SI) e Análise Dimensional",
    enunciado: "A equação abaixo foi proposta por Bond para associar a energia $E$ por quantidade de massa necessária para quebrar partículas de minério, de forma que elas passem de diâmetro $d_1$ para diâmetro $d_2$, onde $d_2 < d_1$:\n\n$$E = 2K \\left\\{ \\frac{1}{\\sqrt{d_2}} - \\frac{1}{\\sqrt{d_1}} \\right\\}$$\n\nA dimensão da constante de Bond $K$ da equação pode ser escrita como",
    alternativas: {
      A: "m⁻¹/² kg W s",
      B: "m¹/² kg⁻¹ W s⁻¹",
      C: "m¹/² kg⁻¹ W s",
      D: "m⁻¹/² kg⁻¹ W s",
      E: "m⁻¹/² kg W s⁻¹"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. **Unidade de $E$ ('energia por quantidade de massa'):**\n   - Energia em Joules ($\\text{J} = \\text{W}\\cdot\\text{s}$) dividida pela massa em quilogramas ($\\text{kg}$):\n   $$[E] = \\frac{\\text{W}\\cdot\\text{s}}{\\text{kg}} = \\text{kg}^{-1}\\cdot\\text{W}\\cdot\\text{s}$$\n2. **Unidade do termo entre chaves $\\left\\{\\frac{1}{\\sqrt{d_2}} - \\frac{1}{\\sqrt{d_1}}\\right\\}$:**\n   - Como $d$ é um diâmetro (comprimento em metros, $\\text{m}$), temos $\\left[\\frac{1}{\\sqrt{d}}\\right] = \\text{m}^{-1/2}$.\n3. **Isolando a unidade de $K$:**\n   $$[K] = \\frac{[E]}{\\text{m}^{-1/2}} = \\mathbf{\\text{m}^{1/2}\\cdot\\text{kg}^{-1}\\cdot\\text{W}\\cdot\\text{s}}$$"
  },
  {
    id: 61,
    numero: 61,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco1",
    disciplina: "Matemática Aplicada",
    assunto: "Cálculo Vetorial — Produto Vetorial e Trajetória sob Força Magnética",
    enunciado: "Uma partícula segue um movimento retilíneo no $\\mathbb{R}^3$, com velocidade constante $(1, 2, 2)$, até entrar numa região que provoca um vetor aceleração $\\vec{A}$ sobre a partícula, tal que $\\vec{A} = (2, -2, 1) \\times \\vec{v}$, onde $\\times$ denota o produto vetorial, e $\\vec{v}$ denota a velocidade instantânea da partícula.\n\nEnquanto estiver na região, a partícula descreverá um(a)",
    alternativas: {
      A: "arco de círculo de raio 1",
      B: "arco de círculo de raio 3",
      C: "arco de parábola",
      D: "trajetória helicoidal",
      E: "trajetória retilínea"
    },
    correta: "A",
    comentario: "**Resolução Passo a Passo:**\n1. Seja $\\vec{B} = (2, -2, 1)$ e a velocidade inicial $\\vec{v}_0 = (1, 2, 2)$.\n   - Módulo de $\\vec{v}_0$: $|\\vec{v}| = \\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{9} = 3$ (constante, pois $\\vec{A} \\perp \\vec{v}$ não realiza trabalho e não altera o módulo da velocidade).\n   - Módulo de $\\vec{B}$: $|\\vec{B}| = \\sqrt{2^2 + (-2)^2 + 1^2} = \\sqrt{9} = 3$.\n2. Verificando o ângulo entre $\\vec{B}$ e $\\vec{v}_0$ pelo produto escalar:\n   $$\\vec{B} \\cdot \\vec{v}_0 = (2)(1) + (-2)(2) + (1)(2) = 2 - 4 + 2 = 0$$\n   Como $\\vec{B} \\cdot \\vec{v}_0 = 0$, a velocidade inicial é **perpendicular** ao vetor constante $\\vec{B}$ (não há componente paralela que geraria movimento helicoidal!). Logo, o movimento é **circular uniforme** no plano ortogonal a $\\vec{B}$.\n3. Cálculo do raio de curvatura $R$ (aceleração centrípeta $|\\vec{A}| = |\\vec{B}||\\vec{v}|\\operatorname{sen}90^\\circ = \\frac{|\\vec{v}|^2}{R}$):\n   $$R = \\frac{|\\vec{v}|}{|\\vec{B}|} = \\frac{3}{3} = \\mathbf{1}$$\n   Portanto, descreve um **arco de círculo de raio 1**."
  },
  {
    id: 62,
    numero: 62,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Associação Infinita de Capacitores",
    svgDiagrama: `<svg viewBox="0 0 420 135" width="100%" height="130" style="max-width:420px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <g stroke="#e2e8f0" stroke-width="2" fill="none">
        <circle cx="35" cy="35" r="3" fill="#38bdf8"/><text x="18" y="40" fill="#38bdf8" font-size="13" stroke="none" font-weight="bold">A</text>
        <circle cx="35" cy="100" r="3" fill="#38bdf8"/><text x="18" y="105" fill="#38bdf8" font-size="13" stroke="none" font-weight="bold">B</text>
        <line x1="38" y1="35" x2="125" y2="35"/><line x1="38" y1="100" x2="125" y2="100"/>
        <line x1="85" y1="35" x2="85" y2="62"/><line x1="73" y1="62" x2="97" y2="62"/><line x1="73" y1="72" x2="97" y2="72"/><line x1="85" y1="72" x2="85" y2="100"/>
        <line x1="125" y1="22" x2="125" y2="48"/><line x1="135" y1="22" x2="135" y2="48"/>
        <line x1="125" y1="87" x2="125" y2="113"/><line x1="135" y1="87" x2="135" y2="113"/>
        <line x1="135" y1="35" x2="215" y2="35"/><line x1="135" y1="100" x2="215" y2="100"/>
        <line x1="175" y1="35" x2="175" y2="62"/><line x1="163" y1="62" x2="187" y2="62"/><line x1="163" y1="72" x2="187" y2="72"/><line x1="175" y1="72" x2="175" y2="100"/>
        <line x1="215" y1="22" x2="215" y2="48"/><line x1="225" y1="22" x2="225" y2="48"/>
        <line x1="215" y1="87" x2="215" y2="113"/><line x1="225" y1="87" x2="225" y2="113"/>
        <line x1="225" y1="35" x2="305" y2="35"/><line x1="225" y1="100" x2="305" y2="100"/>
        <line x1="265" y1="35" x2="265" y2="62"/><line x1="253" y1="62" x2="277" y2="62"/><line x1="253" y1="72" x2="277" y2="72"/><line x1="265" y1="72" x2="265" y2="100"/>
        <line x1="305" y1="22" x2="305" y2="48"/><line x1="315" y1="22" x2="315" y2="48"/>
        <line x1="305" y1="87" x2="305" y2="113"/><line x1="315" y1="87" x2="315" y2="113"/>
        <line x1="315" y1="35" x2="345" y2="35"/><line x1="315" y1="100" x2="345" y2="100"/>
        <text x="365" y="72" fill="#fbbf24" font-size="22" stroke="none" font-weight="bold">...</text>
      </g>
    </svg>`,
    enunciado: "Uma linha de transmissão pode ser modelada como uma malha infinita de capacitores todos de capacitâncias iguais a $C$, arranjados conforme disposição mostrada na Figura acima.\n\nA capacitância equivalente entre os pontos A e B, indicados na Figura, é:",
    alternativas: {
      A: "C(1 + √2) / 2",
      B: "C(1 + √3) / 2",
      C: "C(1 + √3) / 4",
      D: "C(1 + 2√2) / 4",
      E: "C(1 + 3√2) / 4"
    },
    correta: "B",
    comentario: "**Resolução Passo a Passo:**\n1. Pela autossimilaridade da malha infinita, a capacitância equivalente $C_{eq}$ vista nos terminais A-B é igual ao primeiro capacitor vertical $C$ em paralelo com a associação em série de três capacitores: o capacitor superior $C$, o capacitor inferior $C$ e o restante da malha infinita $C_{eq}$.\n2. A associação em série de $C$ e $C$ vale $C/2$. Em série com $C_{eq}$, resulta em $\\frac{(C/2) \\cdot C_{eq}}{C/2 + C_{eq}} = \\frac{C \\cdot C_{eq}}{C + 2C_{eq}}$.\n3. Somando com o primeiro capacitor em paralelo $C$:\n   $$C_{eq} = C + \\frac{C \\cdot C_{eq}}{C + 2C_{eq}} \\implies C_{eq}(C + 2C_{eq}) = C(C + 2C_{eq}) + C \\cdot C_{eq}$$\n   $$2C_{eq}^2 - 2C \\cdot C_{eq} - C^2 = 0$$\n4. Resolvendo a equação do 2º grau ($C_{eq} > 0$):\n   $$C_{eq} = \\frac{2C + \\sqrt{4C^2 - 4(2)(-C^2)}}{4} = \\frac{2C + 2C\\sqrt{3}}{4} = \\mathbf{\\frac{C(1 + \\sqrt{3})}{2}}$$"
  },
  {
    id: 63,
    numero: 63,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Valor Eficaz (RMS) de Formas de Onda Periódicas",
    svgDiagrama: `<svg viewBox="0 0 380 120" width="100%" height="115" style="max-width:380px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <text x="25" y="34" fill="#38bdf8" font-size="13" font-weight="bold">+S</text>
      <text x="25" y="96" fill="#38bdf8" font-size="13" font-weight="bold">-S</text>
      <line x1="50" y1="62" x2="345" y2="62" stroke="#475569" stroke-width="1" stroke-dasharray="4,4"/>
      <path d="M 55,92 L 95,92 L 95,30 L 140,30 L 140,92 L 185,92 L 185,30 L 230,30 L 230,92 L 275,92 L 275,30 L 320,30 L 320,92" stroke="#fbbf24" stroke-width="2.5" fill="none"/>
      <text x="340" y="92" fill="#e2e8f0" font-size="18" font-weight="bold">...</text>
    </svg>`,
    enunciado: "Um circuito retificou a rede elétrica residencial de tensão eficaz monofásica $V$, de forma a oferecer uma saída em conformidade com a Figura acima.\n\nEm 50% do tempo, a saída do circuito é $S$, e nos outros 50% é $-S$, onde $S$ é o valor de pico da onda senoidal da rede.\n\nSendo assim, o circuito oferece uma tensão eficaz igual a",
    alternativas: {
      A: "2V",
      B: "πV",
      C: "√2 V",
      D: "√3 V",
      E: "πV / 2"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. O valor eficaz (RMS) de uma onda quadrada simétrica de amplitude $\\pm S$ é o próprio valor $S$:\n   $$V_{\\text{eficaz,saída}} = \\sqrt{\\frac{1}{T}\\int_0^T [v(t)]^2\\,dt} = \\sqrt{S^2} = S$$\n2. Como $S$ é o valor de pico da onda senoidal de valor eficaz $V$, temos $S = \\sqrt{2}\\,V$.\n3. Portanto, a tensão eficaz de saída do circuito é **$V_{\\text{eficaz,saída}} = \\sqrt{2}\\,V$**."
  },
  {
    id: 64,
    numero: 64,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco1",
    disciplina: "Matemática Aplicada",
    assunto: "Transformada Inversa de Laplace por Frações Parciais",
    enunciado: "Sabe-se que a Transformada de Laplace da função $f(t) = e^{at}$, para $t \\ge 0$, onde $a$ é uma constante Real, é $F(s) = \\frac{1}{s - a}$.\n\nAplicando-se as propriedades da Transformada de Laplace, a Transformada Inversa de\n\n$$G(s) = \\frac{1}{s^2 - 5s + 6}$$\n\npara $t \\ge 0$, é",
    alternativas: {
      A: "g(t) = e²ᵗ + e³ᵗ",
      B: "g(t) = e⁻²ᵗ + e⁻³ᵗ",
      C: "g(t) = e²ᵗ - e³ᵗ",
      D: "g(t) = e³ᵗ - e²ᵗ",
      E: "g(t) = e³ᵗ + eᵗ"
    },
    correta: "D",
    comentario: "**Resolução Passo a Passo:**\n1. Fatorando o denominador $s^2 - 5s + 6 = (s - 3)(s - 2)$ e expandindo em frações parciais:\n   $$G(s) = \\frac{1}{(s - 3)(s - 2)} = \\frac{A}{s - 3} + \\frac{B}{s - 2}$$\n   - $A = \\left.\\frac{1}{s - 2}\\right|_{s=3} = \\frac{1}{3 - 2} = 1$\n   - $B = \\left.\\frac{1}{s - 3}\\right|_{s=2} = \\frac{1}{2 - 3} = -1$\n2. Aplicando a transformada inversa de Laplace termo a termo:\n   $$G(s) = \\frac{1}{s - 3} - \\frac{1}{s - 2} \\implies \\mathbf{g(t) = e^{3t} - e^{2t}}$$"
  },
  {
    id: 65,
    numero: 65,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco1",
    disciplina: "Matemática Aplicada",
    assunto: "Variáveis Complexas — Parte Real u(x,y) e Imaginária v(x,y)",
    enunciado: "Considere a função $f(z) = \\frac{1}{z + 1}$, de uma variável complexa $z = x + jy$. Decompondo-se a função $f(z)$ em partes real e imaginária, obtém-se $f(z) = f(x,y) = u(x,y) + jv(x,y)$.\n\nQual é a expressão da função $v(x,y)$?",
    alternativas: {
      A: "v(x,y) = x / (x² + y²)",
      B: "v(x,y) = -y / (x² + y² + 2x + 1)",
      C: "v(x,y) = y / (x² + y² + 2x + 1)",
      D: "v(x,y) = (x + 1) / (x² + y² + 2x + 1)",
      E: "v(x,y) = 2 / (x² + y² + 2x)"
    },
    correta: "B",
    comentario: "**Resolução Passo a Passo:**\n1. Substituindo $z = x + jy$ e multiplicando pelo conjugado do denominador $((x+1) - jy)$:\n   $$f(z) = \\frac{1}{(x + 1) + jy} \\cdot \\frac{(x + 1) - jy}{(x + 1) - jy} = \\frac{(x + 1) - jy}{(x + 1)^2 + y^2}$$\n2. Expandindo $(x+1)^2 + y^2 = x^2 + y^2 + 2x + 1$:\n   $$u(x,y) = \\frac{x + 1}{x^2 + y^2 + 2x + 1}, \\qquad \\mathbf{v(x,y) = \\frac{-y}{x^2 + y^2 + 2x + 1}}$$"
  },
  {
    id: 66,
    numero: 66,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco1",
    disciplina: "Matemática Aplicada",
    assunto: "Transformada Z e Equações de Diferenças",
    enunciado: "Uma sequência discreta e causal tem sua lei de formação dada por:\n\n$$x(n) = \\alpha x(n-1) + \\beta x(n-2) + \\delta(n) \\text{ para } n \\ge 0$$\n\nsendo que $x(n) = 0$ para $n < 0$, e $\\delta(n)$ é definido como Impulso Unitário discreto ($\\delta(0)=1$ e $\\delta(n)=0$ para $n\\neq 0$).\nAs primeiras cinco amostras dessa sequência são:\n\n$$x(0) = 1 \\;;\\; x(1) = 2 \\;;\\; x(2) = 7 \\;;\\; x(3) = 20 \\;;\\; x(4) = 61$$\n\nA expressão de $X(z)$, que é a Transformada Z dessa sequência, é dada por",
    alternativas: {
      A: "X(z) = (z² - 1) / (z² - 2z - 3)",
      B: "X(z) = z / (z² - 2z - 3)",
      C: "X(z) = z² / (z² - 2z - 3)",
      D: "X(z) = 1 / (z² - 2z - 3)",
      E: "X(z) = z² / (z² + 2z + 3)"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. **Determinação dos coeficientes $\\alpha$ e $\\beta$:**\n   - Para $n = 1$: $x(1) = \\alpha x(0) + \\beta x(-1) + \\delta(1) \\implies 2 = \\alpha(1) + 0 + 0 \\implies \\alpha = 2$.\n   - Para $n = 2$: $x(2) = 2 x(1) + \\beta x(0) + \\delta(2) \\implies 7 = 2(2) + \\beta(1) + 0 \\implies \\beta = 3$.\n2. **Aplicando a Transformada Z à equação $x(n) - 2x(n-1) - 3x(n-2) = \\delta(n)$:**\n   $$X(z)\\left(1 - 2z^{-1} - 3z^{-2}\\right) = 1 \\implies X(z) = \\frac{1}{1 - 2z^{-1} - 3z^{-2}} = \\mathbf{\\frac{z^2}{z^2 - 2z - 3}}$$"
  },
  {
    id: 67,
    numero: 67,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Transitórios de 1ª Ordem — Resposta ao Degrau de Circuito RL Série",
    svgDiagrama: `<svg viewBox="0 0 320 140" width="100%" height="135" style="max-width:320px;display:block;margin:10px auto;background:#0f172a;border-radius:8px;padding:8px;border:1px solid #334155;">
      <g stroke="#e2e8f0" stroke-width="2" fill="none">
        <line x1="65" y1="35" x2="65" y2="115"/>
        <circle cx="65" cy="75" r="18" fill="#1e293b" stroke="#38bdf8"/>
        <text x="32" y="80" fill="#38bdf8" font-size="13" stroke="none" font-weight="bold">u(t)</text>
        <text x="53" y="53" fill="#38bdf8" font-size="13" stroke="none">+</text>
        <text x="53" y="106" fill="#38bdf8" font-size="13" stroke="none">-</text>
        <line x1="65" y1="35" x2="145" y2="35"/>
        <rect x="145" y="27" width="44" height="16" fill="#1e293b" stroke="#e2e8f0"/>
        <text x="167" y="20" fill="#e2e8f0" font-size="13" text-anchor="middle" stroke="none" font-weight="bold">R</text>
        <line x1="189" y1="35" x2="245" y2="35"/>
        <line x1="245" y1="35" x2="245" y2="55"/>
        <path d="M245,55 C258,55 258,67 245,67 C258,67 258,79 245,79 C258,79 258,91 245,91"/>
        <text x="268" y="78" fill="#fbbf24" font-size="13" stroke="none" font-weight="bold">L</text>
        <line x1="245" y1="91" x2="245" y2="115"/>
        <line x1="65" y1="115" x2="245" y2="115"/>
        <line x1="135" y1="68" x2="175" y2="68" stroke="#fbbf24"/>
        <polygon points="175,68 168,64 168,72" fill="#fbbf24" stroke="none"/>
        <text x="155" y="85" fill="#fbbf24" font-size="13" text-anchor="middle" stroke="none" font-weight="bold">i(t)</text>
      </g>
    </svg>`,
    enunciado: "Para o circuito da Figura acima, onde as condições iniciais são consideradas nulas, qual é a expressão da corrente elétrica $i(t)$, para $t \\ge 0$, quando $u(t)$ é uma tensão do tipo DEGRAU de amplitude igual a $E$?",
    alternativas: {
      A: "i(t) = (E/R) (1 - e^{-(R/L)t})",
      B: "i(t) = (E/R) e^{-(R/L)t}",
      C: "i(t) = E (1 - e^{-(R/L)t})",
      D: "i(t) = E e^{-(R/L)t}",
      E: "i(t) = (E/R) (1 - e^{-t/(RL)})"
    },
    correta: "A",
    comentario: "**Resolução Passo a Passo:**\n1. No circuito RL série com condição inicial nula ($i(0) = 0$) submetido a um degrau $u(t) = E \\implies U(s) = \\frac{E}{s}$:\n   $$I(s) = \\frac{E/s}{R + sL} = \\frac{E/L}{s\\left(s + \\frac{R}{L}\\right)} = \\frac{E}{R}\\left(\\frac{1}{s} - \\frac{1}{s + R/L}\\right)$$\n2. Aplicando a transformada inversa de Laplace (constante de tempo $\\tau = L/R$):\n   $$\\mathbf{i(t) = \\frac{E}{R}\\left(1 - e^{-\\frac{R}{L}t}\\right)}$$"
  },
  {
    id: 68,
    numero: 68,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco7",
    disciplina: "Sistemas de Controle",
    assunto: "Alocação de Polos em Malha Fechada",
    enunciado: "A Função de Transferência em Laplace, mostrada a seguir, corresponde a um sistema linear, contínuo e de terceira ordem, operando em malha fechada em função de um ganho $K$:\n\n$$G_{mf}(s) = \\frac{K}{s^3 + 6s^2 + (50 - K)s + 3K - 75}$$\n\nPara um determinado valor do ganho $K$, um dos polos do sistema estará na origem do plano $s$, e os outros dois polos estarão nas posições",
    alternativas: {
      A: "s₁ = -2 e s₂ = -5",
      B: "s₁ = -4 e s₂ = -5",
      C: "s₁ = -3 + j4 e s₂ = -3 - j4",
      D: "s₁ = -2 + j5 e s₂ = -2 - j5",
      E: "s₁ = j4 e s₂ = -j4"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. Para que um dos polos esteja na origem ($s = 0$), o termo independente da equação característica deve ser nulo:\n   $$3K - 75 = 0 \\implies K = 25$$\n2. Substituindo $K = 25$ no polinômio do denominador:\n   $$s^3 + 6s^2 + (50 - 25)s + 0 = s(s^2 + 6s + 25) = 0$$\n3. As raízes de $s^2 + 6s + 25 = 0$ são:\n   $$s = \\frac{-6 \\pm \\sqrt{36 - 100}}{2} = \\frac{-6 \\pm j8}{2} = \\mathbf{-3 \\pm j4}$$"
  },
  {
    id: 69,
    numero: 69,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco7",
    disciplina: "Sistemas de Controle",
    assunto: "Sistemas de 2ª Ordem — Razão de Amortecimento (ζ)",
    enunciado: "A Função de Transferência mostrada a seguir representa o modelo de um sistema contínuo, linear, de 2ª ordem, alimentado por uma entrada $U(s)$ e tendo, como saída, o sinal $Y(s)$, ambos no domínio de Laplace:\n\n$$\\frac{Y(s)}{U(s)} = \\frac{200}{2s^2 + 8s + 200}$$\n\nAo ser aplicado um Impulso Unitário na entrada desse sistema, o sinal de saída oscilará na forma de uma senoide exponencialmente amortecida.\n\nDessa forma, pelo exposto acima, a constante conhecida como Razão de Amortecimento desse sistema vale",
    alternativas: {
      A: "0,1",
      B: "0,2",
      C: "0,4",
      D: "0,5",
      E: "0,8"
    },
    correta: "B",
    comentario: "**Resolução Passo a Passo:**\n1. **Atenção ao coeficiente de $s^2$!** Dividindo numerador e denominador por $2$ para colocar na forma canônica mônica:\n   $$G(s) = \\frac{100}{s^2 + 4s + 100}$$\n2. Comparando o denominador com $s^2 + 2\\zeta\\omega_n s + \\omega_n^2$:\n   - $\\omega_n^2 = 100 \\implies \\omega_n = 10\\text{ rad/s}$\n   - $2\\zeta\\omega_n = 4 \\implies 2 \\cdot \\zeta \\cdot 10 = 4 \\implies \\zeta = \\frac{4}{20} = \\mathbf{0,2}$."
  },
  {
    id: 70,
    numero: 70,
    origem: "Prova Transpetro 2023.2 (Cesgranrio)",
    bloco: "bloco7",
    disciplina: "Sistemas de Controle",
    assunto: "Sistemas em Tempo Discreto — Resposta ao Impulso via Transformada Z",
    enunciado: "A Função de Transferência mostrada a seguir representa um modelo de sistema discreto, linear e causal, com sinais de entrada $X(z)$ e de saída $Y(z)$:\n\n$$G(z) = \\frac{Y(z)}{X(z)} = \\frac{3z^2 - 3z}{z^2 - 6z + 5}$$\n\nNo domínio do tempo discreto, quando esse sistema for submetido a uma entrada do tipo IMPULSO UNITÁRIO, $x(n) = \\delta(n)$, quais serão as três primeiras amostras da resposta $y(n)$ desse sistema, ou seja, quanto valem as seguintes amostras discretas: $y(0), y(1), y(2)$?",
    alternativas: {
      A: "2, 5 e 8",
      B: "5, 15 e 36",
      C: "5, 20 e 45",
      D: "3, 25 e 87",
      E: "3, 15 e 75"
    },
    correta: "E",
    comentario: "**Resolução Rápida (Bizu de Prova):**\n1. Fatorando o numerador e o denominador de $G(z)$:\n   $$G(z) = \\frac{3z(z - 1)}{(z - 5)(z - 1)} = \\frac{3z}{z - 5} = \\frac{3}{1 - 5z^{-1}}$$\n2. Para entrada impulso unitário $x(n) = \\delta(n) \\implies X(z) = 1$, a resposta impulsiva é uma progressão geométrica direta:\n   $$y(n) = 3 \\cdot 5^n u(n)$$\n3. Calculando as três primeiras amostras:\n   - $y(0) = 3 \\cdot 5^0 = 3$\n   - $y(1) = 3 \\cdot 5^1 = 15$\n   - $y(2) = 3 \\cdot 5^2 = 75$\n   Logo: **3, 15 e 75**!"
  },

  // =========================================================================
  // QUESTÕES INÉDITAS / COMPLEMENTARES (71 A 85) - FOCO EDITAL 2026.4
  // =========================================================================
  {
    id: 71,
    numero: 71,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco1",
    disciplina: "Matemática Aplicada",
    assunto: "Matrizes, Determinantes e Equações Diferenciais Lineares",
    enunciado: "Seja $A$ uma matriz quadrada de ordem 3 cujo determinante vale $\\det(A) = 4$. Sabendo-se que a matriz $B$ é obtida pela relação $B = (2A)^{-1} \\cdot A^T$, o valor do determinante $\\det(B)$ é igual a",
    alternativas: {
      A: "1/8",
      B: "1/2",
      C: "1",
      D: "2",
      E: "8"
    },
    correta: "A",
    comentario: "**Resolução Passo a Passo:**\n1. Pelas propriedades dos determinantes para matrizes de ordem $n = 3$:\n   - $\\det(kA) = k^n \\det(A) = 2^3 \\det(A) = 8 \\times 4 = 32$.\n   - $\\det((2A)^{-1}) = \\frac{1}{\\det(2A)} = \\frac{1}{32}$.\n   - $\\det(A^T) = \\det(A) = 4$.\n2. Pelo teorema de Binet:\n   $$\\det(B) = \\det((2A)^{-1}) \\cdot \\det(A^T) = \\frac{1}{32} \\times 4 = \\mathbf{\\frac{1}{8}}$$"
  },
  {
    id: 72,
    numero: 72,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Máxima Transferência de Potência em Corrente Alternada e Ressonância",
    enunciado: "Uma fonte prática em regime permanente senoidal possui equivalente de Thévenin dado por $V_{Th} = 100\\angle 0^\\circ\\text{ V}$ (eficaz) e impedância interna $Z_{Th} = 8 + j6\\text{ }\\Omega$. Ao conectar nos terminais dessa fonte uma impedância de carga $Z_L$ ajustada para a condição de máxima transferência de potência ativa, a potência ativa máxima transferida para a carga será de",
    alternativas: {
      A: "125,0 W",
      B: "250,0 W",
      C: "312,5 W",
      D: "500,0 W",
      E: "625,0 W"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. Em corrente alternada, a máxima transferência de potência ativa ocorre quando a impedância da carga é o **complexo conjugado** da impedância de Thévenin:\n   $$Z_L = Z_{Th}^* = 8 - j6\\text{ }\\Omega$$\n2. Nessa condição, as partes reativas se anulam ($+j6 - j6 = 0$) e a potência máxima transferida para a carga vale:\n   $$P_{\\max} = \\frac{|V_{Th}|^2}{4 R_{Th}} = \\frac{100^2}{4 \\times 8} = \\frac{10.000}{32} = \\mathbf{312,5\\text{ W}}$$"
  },
  {
    id: 73,
    numero: 73,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Correção de Fator de Potência em Instalações Industriais",
    enunciado: "Uma unidade de bombeamento da Transpetro consome uma potência ativa trifásica de $240\\text{ kW}$ com fator de potência inicial $\\cos\\varphi_1 = 0,6$ indutivo. Para elevar o fator de potência da instalação para $\\cos\\varphi_2 = 0,8$ indutivo, a potência reativa capacitiva total do banco de capacitores trifásico a ser instalado em paralelo deve ser de",
    alternativas: {
      A: "80 kvar",
      B: "120 kvar",
      C: "140 kvar",
      D: "180 kvar",
      E: "320 kvar"
    },
    correta: "C",
    comentario: "**Resolução Passo a Passo:**\n1. Das relações trigonométricas fundamentais do triângulo3-4-5:\n   - Para $\\cos\\varphi_1 = 0,6 \\implies \\operatorname{sen}\\varphi_1 = 0,8 \\implies \\operatorname{tg}\\varphi_1 = \\frac{0,8}{0,6} = \\frac{4}{3}$.\n   - Para $\\cos\\varphi_2 = 0,8 \\implies \\operatorname{sen}\\varphi_2 = 0,6 \\implies \\operatorname{tg}\\varphi_2 = \\frac{0,6}{0,8} = \\frac{3}{4}$.\n2. Potência reativa do banco de capacitores ($Q_C$):\n   $$Q_C = P \\cdot (\\operatorname{tg}\\varphi_1 - \\operatorname{tg}\\varphi_2) = 240 \\times \\left(\\frac{4}{3} - \\frac{3}{4}\\right) = 320 - 180 = \\mathbf{140\\text{ kvar}}$$"
  },
  {
    id: 74,
    numero: 74,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco2",
    disciplina: "Circuitos Elétricos",
    assunto: "Resposta em Frequência e Diagrama de Bode",
    enunciado: "Considere um filtro passivo cuja função de transferência é $H(s) = \\frac{100}{s + 10}$. No diagrama assintótico de Bode de módulo, para frequências angulares muito superiores à frequência de corte ($\\omega \\gg 10\\text{ rad/s}$), a inclinação da reta assintótica e o ganho em $\\omega = 100\\text{ rad/s}$ valem, respectivamente,",
    alternativas: {
      A: "-20 dB/década e 0 dB",
      B: "-20 dB/década e 20 dB",
      C: "-40 dB/década e 0 dB",
      D: "-6 dB/década e 10 dB",
      E: "+20 dB/década e 20 dB"
    },
    correta: "A",
    comentario: "**Resolução Passo a Passo:**\n1. Colocando na forma padrão de Bode: $H(s) = \\frac{10}{1 + s/10}$.\n   - Ganho em baixas frequências ($\\omega \\ll 10$): $20\\log_{10}(10) = 20\\text{ dB}$.\n   - Polo simples em $\\omega_c = 10\\text{ rad/s}$ introduz inclinação de **$-20\\text{ dB/década}$** para $\\omega > 10\\text{ rad/s}$.\n2. Em $\\omega = 100\\text{ rad/s}$ (uma década acima de $\\omega_c = 10\\text{ rad/s}$):\n   $$|H(j100)|_{\\text{dB}} \\approx 20\\text{ dB} - 20\\text{ dB/déc} \\times 1\\text{ déc} = \\mathbf{0\\text{ dB}}$$"
  },
  {
    id: 75,
    numero: 75,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Curto-Circuito Bifásico-Terra e Conexão dos Diagramas de Sequência",
    enunciado: "Na análise de faltas assimétricas em Sistemas Elétricos de Potência pelo método das componentes simétricas, a conexão das redes de sequência positiva, negativa e zero no ponto de falta depende do tipo de defeito. Em um curto-circuito franco bifásico-terra envolvendo as fases B e C e a terra, as redes de sequência",
    alternativas: {
      A: "positiva, negativa e zero são conectadas todas em série.",
      B: "positiva e negativa são conectadas em paralelo, e a rede de sequência zero fica aberta.",
      C: "positiva, negativa e zero são conectadas todas em paralelo.",
      D: "positiva e zero são conectadas em série, e a rede de sequência negativa fica aberta.",
      E: "negativa e zero são conectadas em série entre si e em paralelo com a sequência positiva."
    },
    correta: "C",
    comentario: "**Resolução (Resumo de Ouro de Curtos-Circuitos para a Cesgranrio):**\n- **Curto Fase-Terra ($1\\phi$-T):** Redes 1, 2 e 0 todas em **SÉRIE** ($I_{a1} = I_{a2} = I_{a0}$).\n- **Curto Fase-Fase ($2\\phi$ isolado):** Redes 1 e 2 em **PARALELO**, e rede 0 aberta ($V_{a1} = V_{a2}$ e $I_{a0} = 0$).\n- **Curto Bifásico-Terra ($2\\phi$-T):** Redes 1, 2 e 0 todas em **PARALELO** ($V_{a1} = V_{a2} = V_{a0}$)."
  },
  {
    id: 76,
    numero: 76,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco4",
    disciplina: "Análise de Sistemas Elétricos (SEP)",
    assunto: "Proteção Diferencial de Transformadores (ANSI 87T) e Frenagem por 2º Harmônico",
    enunciado: "Na proteção principal de transformadores de potência de subestações industriais de grande porte, emprega-se o relé diferencial percentual (função ANSI 87T). Para evitar a atuação indevida do relé 87T durante a energização a vazio do transformador devido à corrente de magnetização transitória (corrente de inrush), os relés diferenciais modernos utilizam o bloqueio ou restrição por componente de",
    alternativas: {
      A: "sequência zero fundamental (60 Hz).",
      B: "segundo harmônico (120 Hz).",
      C: "terceiro harmônico (180 Hz).",
      D: "quinto harmônico (300 Hz).",
      E: "sub-harmônico de 30 Hz."
    },
    correta: "B",
    comentario: "**Resolução:** A corrente de *inrush* (energização a vazio do transformador) flui apenas no enrolamento primário (aparecendo integralmente como corrente diferencial para o relé 87T), mas possui forte assimetria de meia-onda, apresentando elevado teor de **2º harmônico ($120\\text{ Hz}$ em redes de $60\\text{ Hz}$)**. Por isso, a proteção 87T utiliza **restrição/bloqueio por 2º harmônico** para distinguir *inrush* de uma falta interna real. *(Nota: o 5º harmônico é usado para restrição contra sobre-excitação $V/f$).*"
  },
  {
    id: 77,
    numero: 77,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco5",
    disciplina: "Instalações Elétricas e Subestações",
    assunto: "Arranjos de Barramentos de Subestações de Alta Tensão",
    enunciado: "A respeito dos arranjos de barramentos empregados em subestações de energia elétrica de alta tensão, o arranjo que emprega três disjuntores para cada dois circuitos (vãos) conectados entre duas barras principais, garantindo altíssima confiabilidade operacional e permitindo a manutenção de qualquer disjuntor ou de qualquer uma das barras sem desligamento de circuitos, é denominado",
    alternativas: {
      A: "barra simples seccionada.",
      B: "barra principal e barra de transferência.",
      C: "barra dupla com disjuntor simples a quatro chaves.",
      D: "anel simples.",
      E: "disjuntor e meio."
    },
    correta: "E",
    comentario: "**Resolução:** O arranjo **disjuntor e meio (*breaker-and-a-half*)** utiliza **3 disjuntores em série por diâmetro para atender 2 circuitos** ($3/2 = 1,5$ disjuntor por circuito), situado entre duas barras principais normalmente energizadas. É o arranjo padrão em subestações de extra-alta tensão e subestações críticas devido à sua altíssima confiabilidade e flexibilidade para manutenção sem interrupção de carga."
  },
  {
    id: 78,
    numero: 78,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco5",
    disciplina: "Instalações Elétricas e Subestações",
    assunto: "NBR 5419 — Proteção contra Descargas Atmosféricas (SPDA) em Áreas Classificadas",
    enunciado: "De acordo com a norma ABNT NBR 5419 (Proteção contra Descargas Atmosféricas), na concepção do subsistema de captação de estruturas que contenham áreas classificadas ou inflamáveis (como parques de tancagem de derivados de petróleo), o método eletrogeométrico da esfera rolante relaciona o nível de proteção (I a IV) ao raio da esfera rolante $R$. Para o Nível de Proteção I (maior rigor de proteção), o raio da esfera rolante e o espaçamento médio entre condutores de descida são, respectivamente,",
    alternativas: {
      A: "20 m e 10 m.",
      B: "30 m e 10 m.",
      C: "45 m e 15 m.",
      D: "60 m e 20 m.",
      E: "100 m e 25 m."
    },
    correta: "A",
    comentario: "**Resolução (Tabela Clássica da ABNT NBR 5419-3):**\n- **Nível I:** Raio da esfera rolante $R = \\mathbf{20\\text{ m}}$ | Malha $5 \\times 5\\text{ m}$ | Espaçamento das descidas $= \\mathbf{10\\text{ m}}$.\n- **Nível II:** Raio da esfera rolante $R = 30\\text{ m}$ | Malha $10 \\times 10\\text{ m}$ | Espaçamento das descidas $= 10\\text{ m}$.\n- **Nível III:** Raio da esfera rolante $R = 45\\text{ m}$ | Malha $15 \\times 15\\text{ m}$ | Espaçamento das descidas $= 15\\text{ m}$.\n- **Nível IV:** Raio da esfera rolante $R = 60\\text{ m}$ | Malha $20 \\times 20\\text{ m}$ | Espaçamento das descidas $= 20\\text{ m}$."
  },
  {
    id: 79,
    numero: 79,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco6",
    disciplina: "Máquinas Elétricas",
    assunto: "Transformadores Trifásicos — Grupos de Ligação e Defasamento Angular",
    enunciado: "Dois transformadores trifásicos devem operar em paralelo alimentando um barramento de uma subestação industrial. O transformador T1 existente possui ligação **Dy1**. Qual dos transformadores abaixo NÃO pode ser conectado em paralelo com T1 devido à incompatibilidade de deslocamento angular?",
    alternativas: {
      A: "Yd1",
      B: "Dy1",
      C: "Yz1",
      D: "Yy0",
      E: "Dz2 com inversão cíclica para índice 1"
    },
    correta: "D",
    comentario: "**Resolução:** Uma condição **imprescindível e eliminatória** para o paralelismo de transformadores trifásicos é que pertençam a **grupos de ligação compatíveis (mesmo defasamento angular entre primário e secundário)**. O transformador **Dy1** possui deslocamento angular de $-30^\\circ$ ($1 \\times 30^\\circ$, Grupo I), enquanto o transformador **Yy0** possui deslocamento angular de $0^\\circ$ (Grupo 0). A diferença angular de $30^\\circ$ entre as tensões secundárias provocaria uma altíssima corrente circulante de curto-circuito entre os dois transformadores!"
  },
  {
    id: 80,
    numero: 80,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco6",
    disciplina: "Máquinas Elétricas",
    assunto: "Máquinas Síncronas — Curvas V e Controle de Potência Reativa",
    enunciado: "Um motor síncrono trifásico conectado a um barramento infinito opera entregando potência mecânica constante no eixo. Caso a corrente de excitação de campo ($I_f$) desse motor síncrono seja aumentada acima do valor de excitação normal (operação sobre-excitada), o motor síncrono passará a",
    alternativas: {
      A: "aumentar sua velocidade de rotação acima da velocidade síncrona.",
      B: "operar com fator de potência adiantado, fornecendo potência reativa indutiva (comportando-se como um banco de capacitores para a rede).",
      C: "operar com fator de potência atrasado, absorvendo potência reativa da rede.",
      D: "reduzir sua tensão terminal até perder o sincronismo.",
      E: "inverter o sentido de giro do rotor."
    },
    correta: "B",
    comentario: "**Resolução (Regra de Ouro das Máquinas Síncronas):**\n- **Motor Síncrono Sobre-excitado ($|E_f|\\cos\\delta > V_t$):** Opera com **corrente adiantada** em relação à tensão terminal ($\\text{FP}$ capacitivo), **fornecendo reativos ($Q$) para a rede** exatamente como um compensador síncrono / banco de capacitores.\n- **Motor Síncrono Sub-excitado ($|E_f|\\cos\\delta < V_t$):** Opera com corrente atrasada ($\\text{FP}$ indutivo), absorvendo reativos da rede."
  },
  {
    id: 81,
    numero: 81,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco7",
    disciplina: "Sistemas de Controle",
    assunto: "Critério de Estabilidade de Routh-Hurwitz e Controlabilidade",
    enunciado: "Considere o sistema linear invariante no tempo descrito em espaço de estados por:\n\n$$\\dot{x} = \\begin{bmatrix} 0 & 1 \\\\ -6 & -5 \\end{bmatrix} x + \\begin{bmatrix} 0 \\\\ 2 \\end{bmatrix} u$$\n\nO determinante da matriz de controlabilidade $\\mathcal{C} = \\begin{bmatrix} B & AB \\end{bmatrix}$ e os autovalores da matriz $A$ são, respectivamente,",
    alternativas: {
      A: "det(C) = -4 ; autovalores em -2 e -3 (sistema controlável e estável).",
      B: "det(C) = 4 ; autovalores em +2 e +3 (sistema controlável e instável).",
      C: "det(C) = 0 ; autovalores em -2 e -3 (sistema não controlável e estável).",
      D: "det(C) = -10 ; autovalores em -1 e -6 (sistema controlável e estável).",
      E: "det(C) = -4 ; autovalores em -1 e -5 (sistema controlável e estável)."
    },
    correta: "A",
    comentario: "**Resolução Passo a Passo:**\n1. **Matriz de Controlabilidade $\\mathcal{C} = \\begin{bmatrix} B & AB \\end{bmatrix}$:**\n   - $B = \\begin{bmatrix} 0 \\\\ 2 \\end{bmatrix}$ e $AB = \\begin{bmatrix} 0 & 1 \\\\ -6 & -5 \\end{bmatrix}\\begin{bmatrix} 0 \\\\ 2 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ -10 \\end{bmatrix}$.\n   - $\\mathcal{C} = \\begin{bmatrix} 0 & 2 \\\\ 2 & -10 \\end{bmatrix} \\implies \\det(\\mathcal{C}) = 0(-10) - 2(2) = \\mathbf{-4} \\neq 0$ (sistema completamente controlável!).\n2. **Autovalores de $A$:**\n   - $\\det(sI - A) = s(s+5) + 6 = s^2 + 5s + 6 = (s+2)(s+3) = 0 \\implies \\mathbf{s_1 = -2, s_2 = -3}$ (ambos no SPE $\\implies$ estável!)."
  },
  {
    id: 82,
    numero: 82,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco8",
    disciplina: "Legislação e Segurança (NR-10)",
    assunto: "NR-10 — Sequência de Desenergização e Reenergização",
    enunciado: "Segundo a Norma Regulamentadora nº 10 (NR-10 — Segurança em Instalações e Serviços em Eletricidade), somente serão consideradas desenergizadas as instalações elétricas liberadas para trabalho mediante os procedimentos apropriados, obedecida a sequência correta. Nessa sequência oficial da NR-10, logo após o **impedimento de reenergização** (bloqueio) e a **constatação da ausência de tensão**, o próximo passo obrigatório é",
    alternativas: {
      A: "o seccionamento do circuito principal.",
      B: "a instalação da sinalização de impedimento de reenergização.",
      C: "a instalação de aterramento temporário com equipotencialização dos condutores dos circuitos.",
      D: "a liberação para serviços pela equipe de operação.",
      E: "a retirada das ferramentas e equipamentos do ponto de trabalho."
    },
    correta: "C",
    comentario: "**Resolução (Item 10.5.1 da NR-10 — Sequência Oficial de Desenergização):**\n1. **a) Seccionamento;**\n2. **b) Impedimento de reenergização;**\n3. **c) Constatação da ausência de tensão;**\n4. **d) Instalação de aterramento temporário com equipotencialização dos condutores dos circuitos;**\n5. **e) Proteção dos elementos energizados existentes na zona controlada (Anexo II);**\n6. **f) Instalação da sinalização de impedimento de reenergização.**\n*(Bizu: mnemônico **S-I-C-A-P-S**)*."
  },
  {
    id: 83,
    numero: 83,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "bloco8",
    disciplina: "Legislação (Lei 14.133/2021)",
    assunto: "Lei 14.133/2021 — Regimes de Execução Indireta de Obras e Serviços de Engenharia",
    enunciado: "De acordo com a Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos Administrativos), na execução indireta de obras e serviços de engenharia, o regime de contratação em que o contratado é responsável por elaborar e desenvolver os projetos **básico e executivo**, executar obras e serviços de engenharia, fornecer bens ou prestar serviços especiais e realizar montagem, teste, pré-operação e as demais operações necessárias e suficientes para a entrega final do objeto é denominado",
    alternativas: {
      A: "empreitada por preço global.",
      B: "empreitada integral.",
      C: "contratação semi-integrada.",
      D: "contratação integrada.",
      E: "fornecimento e prestação de serviço associado."
    },
    correta: "D",
    comentario: "**Resolução (Diferença Crucial no Art. 6º, XXXII e XXXIII da Lei 14.133/2021):**\n- **Contratação Integrada (art. 6º, XXXII):** O contratado elabora os projetos **BÁSICO e EXECUTIVO** + execução completa.\n- **Contratação Semi-integrada (art. 6º, XXXIII):** A Administração fornece o projeto básico, e o contratado elabora apenas o projeto **EXECUTIVO** + execução completa."
  },
  {
    id: 84,
    numero: 84,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "portugues",
    disciplina: "Língua Portuguesa",
    assunto: "Concordância Verbal, Regência e Crase (Padrão Cesgranrio)",
    enunciado: "De acordo com a norma-padrão da língua portuguesa, a frase plenamente correta quanto à concordância verbal, à regência e ao emprego do acento indicativo de crase é:",
    alternativas: {
      A: "Fazem dois anos que os engenheiros assistiram o comissionamento das subestações.",
      B: "Haviam diversas falhas nos relés que obedeciam as normas técnicas antigas.",
      C: "Deve existir soluções eficazes para que se chegue à confiabilidade exigida pela Transpetro.",
      D: "Existe, nas subestações modernas, sistemas digitais que visam à proteção seletiva dos ativos.",
      E: "Já passa das dez horas, e os relatórios referentes àquelas inspeções já foram entregues à diretoria."
    },
    correta: "E",
    comentario: "**Resolução:**\n- **(E) CORRETA:** 'Passa das dez horas' (ou 'passam', na indicação de horas sem sujeito expresso admite singular ou plural), 'referentes àquelas' (preposição *a* exigida por *referentes* + demonstrativo *aquelas*) e 'entregues à diretoria' (preposição *a* + artigo *a*).\n- Erros das demais:\n  - (A) *Faz* dois anos (verbo *fazer* indicando tempo decorrido é impessoal) e assistiram *ao* comissionamento (ver = VTI).\n  - (B) *Havia* diversas falhas (verbo *haver* no sentido de existir é impessoal) e obedeciam *às* normas (obedecer é VTI).\n  - (C) *Devem existir* soluções (*existir* é pessoal e concorda com *soluções*).\n  - (D) *Existem*... sistemas digitais."
  },
  {
    id: 85,
    numero: 85,
    origem: "Inédita — Foco Edital Transpetro 2026.4",
    bloco: "ingles",
    disciplina: "Língua Inglesa",
    assunto: "Compreensão de Texto Técnico em Engenharia Elétrica e Conectivos",
    enunciado: "Read the technical excerpt below:\n\n“**Although** predictive maintenance algorithms require initial investment in smart sensors and SCADA integration, they drastically **curb** unplanned outages in high-voltage substations and pipeline pumping stations.”\n\nIn this context, the words **Although** and **curb** can be replaced, without change in meaning, respectively, by:",
    alternativas: {
      A: "Because — increase",
      B: "Even though — reduce",
      C: "Therefore — trigger",
      D: "Unless — prevent",
      E: "Despite — enhance"
    },
    correta: "B",
    comentario: "**Resolução:**\n- **Although** ('Embora / Ainda que') é uma conjunção concessiva seguida de oração (sujeito + verbo), sendo sinônima exata de **Even though** (*Despite* tem valor concessivo, mas é preposição e exige substantivo/gerúndio ou *the fact that*).\n- O verbo **to curb** ('frear, conter, reduzir, refrear') equivale, no contexto de falhas e desligamentos não programados (*unplanned outages*), a **reduce**."
  }
];

