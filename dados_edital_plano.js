// Dados Oficiais do Edital Nº 04 - TRANSPETRO/PSP/TERRA/NÍVEL SUPERIOR - 2026.4
// Ênfase 23: Engenharia Elétrica

window.DADOS_EDITAL = {
  tituloConcurso: "Processo Seletivo Público TRANSPETRO/PSP/TERRA/NÍVEL SUPERIOR - 2026.4",
  edital: "Edital nº 04/2026 (com alterações DOU até 04/11/2026 + Retificação)",
  banca: "Fundação Cesgranrio",
  cargo: "Profissional Transpetro de Nível Superior - Júnior",
  enfase: "Ênfase 23: Engenharia Elétrica",
  regime: "CLT (Consolidação das Leis do Trabalho) - 90 dias experimentais",
  salarioBasico: "R$ 8.647,34",
  remuneracaoMinima: "R$ 14.973,62",
  dataProva: "2026-12-06",
  horaDuracao: "4h30min",
  taxaInscricao: "R$ 117,00",
  validadeConcurso: "18 meses (prorrogável uma vez por igual período)",
  atribuicoes: "Garantir a execução das atividades de planejamento, estudos, programação, acompanhamento, assistência técnica, projeto, fiscalização, implantação, coordenação e orientação das operações vinculadas à engenharia, propondo soluções e medidas que garantam a continuidade operacional, visando atender às necessidades do negócio, de acordo com critérios técnicos de segurança, qualidade e preservação do meio ambiente. Executar a fiscalização técnica e administrativa dos contratos de bens e serviços.",
  requisito: "Curso de graduação de nível superior, bacharelado, em Engenharia Elétrica reconhecido pelo MEC, Secretarias ou Conselhos Estaduais de Educação + Registro no respectivo Conselho de Classe (CREA). Outras formações em Engenharia são aceitas desde que acompanhadas de certidão do Conselho de Classe atestando posse de todas as atribuições de Engenheiro Eletricista.",

  polosVagas: [
    {
      polo: "Rio de Janeiro",
      vagasImediatas: { AC: 1, PCD: 0, PN: 1, PI: 0, PQ: 0, total: 2 },
      vagasMaisCR: { AC: 12, PCD: 3, PN: 6, PI: 1, PQ: 0, total: 22 },
      habilitadosFase1: { AC: 24, PCD: 6, PN: 12, PI: 2, PQ: 0, total: 44 },
      localidades: "Angra dos Reis/RJ, Duque de Caxias/RJ, Japeri/RJ, Macaé/RJ, Rio das Flores/RJ, Rio de Janeiro/RJ ou Volta Redonda/RJ"
    },
    {
      polo: "São Paulo",
      vagasImediatas: { AC: 0, PCD: 1, PN: 0, PI: 0, PQ: 0, total: 1 },
      vagasMaisCR: { AC: 5, PCD: 3, PN: 3, PI: 0, PQ: 0, total: 11 },
      habilitadosFase1: { AC: 10, PCD: 6, PN: 6, PI: 0, PQ: 0, total: 22 },
      localidades: "Barueri/SP, Caraguatatuba/SP, Cubatão/SP, Guararema/SP, Guarulhos/SP, Mauá/SP, Paulínia/SP, Porto Ferreira/SP, Ribeirão Preto/SP, Santos/SP, São Caetano do Sul/SP, São José dos Campos/SP, São Paulo/SP, São Sebastião/SP ou Taubaté/SP"
    }
  ],

  regrasProva: [
    {
      titulo: "Estrutura do Caderno (70 Questões = 70,0 pontos)",
      detalhe: "Aplicadas simultaneamente em 4h30min (5 alternativas A-E, 1,0 ponto por questão). Fase 1: 50 questões de Conhecimentos Específicos (Engenharia Elétrica). Fase 2: 20 questões de Conhecimentos Gerais (10 de Língua Portuguesa + 10 de Língua Inglesa)."
    },
    {
      titulo: "Critérios de Eliminação Direta (Item 7.1.4.3)",
      detalhe: "É eliminado quem obtiver: (1) menos de 50% na Fase 1 (< 25 pontos em Específicos); OU (2) menos de 50% na Fase 2 (< 10 pontos na soma de Português + Inglês); OU (3) nota ZERO em Língua Portuguesa ou nota ZERO em Língua Inglesa."
    },
    {
      titulo: "Funil da Fase 1 (Corte de Habilitação - Item 7.1.2.d)",
      detalhe: "Os candidatos não eliminados são ranqueados APENAS pela nota de Conhecimentos Específicos (Fase 1). Só avançam para ter a nota de Conhecimentos Gerais somada os classificados até 2x (Vagas + CR) por polo e modalidade (44 no RJ; 22 em SP), além do critério de equiparação de gênero (50% mulheres/trans feminina)."
    },
    {
      titulo: "Nota Classificatória Final (Item 7.1.4.1)",
      detalhe: "Para os habilitados na Fase 1, a classificação final é dada pela soma algébrica simples: Nota Final = Nota Específicos (máx. 50) + Nota Gerais (máx. 20) = máx. 70 pontos."
    }
  ],

  raioxProva2023: [
    { bloco: "Bloco 4: Análise de Sistemas Elétricos (SEP)", qtd: 11, percentual: 22, prioridade: "Altíssima", questoes2023: "Q21, Q29, Q36, Q37, Q38, Q39, Q40, Q49, Q50, Q54, Q56" },
    { bloco: "Bloco 2: Teoria e Técnica de Circuitos Elétricos", qtd: 8, percentual: 16, prioridade: "Altíssima", questoes2023: "Q33, Q34, Q44, Q48, Q51, Q62, Q63, Q67" },
    { bloco: "Bloco 6: Máquinas Elétricas", qtd: 7, percentual: 14, prioridade: "Alta", questoes2023: "Q23, Q24, Q25, Q26, Q27, Q28, Q55" },
    { bloco: "Bloco 5: Instalações Elétricas e Subestações", qtd: 6, percentual: 12, prioridade: "Alta", questoes2023: "Q22, Q30, Q31, Q32, Q57, Q59" },
    { bloco: "Bloco 7: Sistemas de Controle", qtd: 6, percentual: 12, prioridade: "Alta", questoes2023: "Q45, Q46, Q47, Q68, Q69, Q70" },
    { bloco: "Bloco 1: Matemática Aplicada à Eng. Elétrica", qtd: 5, percentual: 10, prioridade: "Média-Alta", questoes2023: "Q43, Q61, Q64, Q65, Q66" },
    { bloco: "Bloco 3: Medidas Elétricas e SI", qtd: 5, percentual: 10, prioridade: "Média-Alta", questoes2023: "Q35, Q41, Q42, Q52, Q60" },
    { bloco: "Bloco 8: Legislação (Lei 14.133/2021 e NR-10)", qtd: 2, percentual: 4, prioridade: "Garantir Pontos", questoes2023: "Q53, Q58" },
    { bloco: "Básicos: Língua Portuguesa + Língua Inglesa", qtd: 20, percentual: 100, prioridade: "Essencial (Fase 2)", questoes2023: "Q01 a Q10 (PT) e Q11 a Q20 (EN)" }
  ],

  cronograma: [
    { id: "c1", data: "12/08 a 21/09/2026", dataISO: "2026-09-21", evento: "Período de Inscrições na página da Fundação Cesgranrio (R$ 117,00)", categoria: "Inscrição" },
    { id: "c2", data: "12 a 19/08/2026", dataISO: "2026-08-19", evento: "Solicitação de isenção do valor da taxa de inscrição (CadÚnico / Medula Óssea)", categoria: "Inscrição" },
    { id: "c3", data: "27/08/2026", dataISO: "2026-08-27", evento: "Resultado preliminar dos pedidos de isenção da taxa", categoria: "Inscrição" },
    { id: "c4", data: "09/09/2026", dataISO: "2026-09-09", evento: "Situação final dos pedidos de isenção da taxa após recursos", categoria: "Inscrição" },
    { id: "c5", data: "28/09/2026", dataISO: "2026-09-28", evento: "Situação preliminar das inscrições em vagas reservadas (PcD, PN, PI, PQ), atendimento especial e nome social", categoria: "Inscrição" },
    { id: "c6", data: "07/10/2026", dataISO: "2026-10-07", evento: "Situação final das solicitações de vagas reservadas e atendimento especial", categoria: "Inscrição" },
    { id: "c7", data: "01/12/2026", dataISO: "2026-12-01", evento: "Obtenção impressa do Cartão de Confirmação de Inscrição (CCI) com local de prova no site da Cesgranrio", categoria: "Pré-Prova", critico: true },
    { id: "c8", data: "01 a 04/12/2026", dataISO: "2026-12-04", evento: "Atendimento a dúvidas sobre locais de prova, vagas reservadas ou adaptações (0800 701 2028, 9h às 17h)", categoria: "Pré-Prova" },
    { id: "c9", data: "06/12/2026", dataISO: "2026-12-06", evento: "APLICAÇÃO DAS PROVAS OBJETIVAS (Fase 1 Específicos + Fase 2 Gerais)", categoria: "Dia da Prova", prova: true },
    { id: "c10", data: "07/12/2026", dataISO: "2026-12-07", evento: "Divulgação dos gabaritos preliminares das provas objetivas", categoria: "Pós-Prova", critico: true },
    { id: "c11", data: "07 e 08/12/2026", dataISO: "2026-12-08", evento: "Prazo para interposição de recursos quanto às questões objetivas e/ou gabaritos (sem identificação do candidato!)", categoria: "Pós-Prova", critico: true },
    { id: "c12", data: "09/12/2026 a 04/03/2027", dataISO: "2026-12-09", evento: "Prazo para acerto cadastral (correção de nome/endereço) no site da Cesgranrio", categoria: "Pós-Prova" },
    { id: "c13", data: "08/01/2027", dataISO: "2027-01-08", evento: "Disponibilização da imagem digital do Cartão-Resposta", categoria: "Resultados" },
    { id: "c14", data: "14/01/2027", dataISO: "2027-01-14", evento: "Divulgação das notas das provas objetivas (Resultado Preliminar) e decisões dos recursos", categoria: "Resultados", critico: true },
    { id: "c15", data: "03/02/2027", dataISO: "2027-02-03", evento: "Convocação para Avaliação Multiprofissional (PcD) e Confirmação de Autodeclaração (PN)", categoria: "2ª Etapa" },
    { id: "c16", data: "13 a 15/02/2027", dataISO: "2027-02-13", evento: "Realização da 2ª Etapa: Avaliação PcD, Heteroidentificação (PN) e Verificação Documental (PI/PQ)", categoria: "2ª Etapa" },
    { id: "c17", data: "03/03/2027", dataISO: "2027-03-03", evento: "Divulgação do resultado preliminar da 2ª Etapa (PcD, PN, PI e PQ)", categoria: "2ª Etapa" },
    { id: "c18", data: "03 e 04/03/2027", dataISO: "2027-03-04", evento: "Prazo para recursos quanto ao resultado preliminar da 2ª Etapa", categoria: "2ª Etapa" },
    { id: "c19", data: "23/03/2027", dataISO: "2027-03-23", evento: "DIVULGAÇÃO E HOMOLOGAÇÃO DOS RESULTADOS FINAIS", categoria: "Resultado Final", critico: true }
  ],

  checklistProva: [
    { id: "ck1", item: "Imprimir o Cartão de Confirmação de Inscrição (CCI) a partir de 01/12/2026 (serve para anotar o gabarito no dia!)" },
    { id: "ck2", item: "Separar 2 ou 3 canetas esferográficas de tinta PRETA fabricadas em material TRANSPARENTE (proibido lápis, lapiseira e borracha!)" },
    { id: "ck3", item: "Documento oficial de identidade original com foto (RG, CNH com foto, CREA, Passaporte ou documento digital nos apps oficiais GOV.BR/CNH/CIN)" },
    { id: "ck4", item: "Garrafa de água e lanches SOMENTE em embalagens/recipientes fabricados em material TRANSPARENTE (sem rótulo)" },
    { id: "ck5", item: "Não usar relógio de qualquer natureza, óculos escuros, boné, chapéu ou protetor auricular" },
    { id: "ck6", item: "Chegar ao local de prova com 1 hora de antecedência e desligar completamente o celular (e alarmes!) antes de lacrar o envelope porta-objetos" },
    { id: "ck7", item: "Reservar pelo menos 30 minutos finais das 4h30min para preencher e assinar o Cartão-Resposta e a Lista de Presença" }
  ]
};

// Planejamento Estratégico de 30 Minutos por Dia (07/11/2026 até 06/12/2026 = 30 Dias)
// Metodologia: 10 min Teoria Direta + 15 min Questões Comentadas + 5 min Revisão de Fórmulas/Erros
window.PLANO_30_DIAS = [
  {
    dia: 1,
    data: "07/11/2026",
    dataISO: "2026-11-07",
    diaSemana: "Sábado",
    fase: "Semana 1: SEP & Circuitos (Alto Peso)",
    bloco: "Bloco 4 - Análise de Sistemas Elétricos",
    titulo: "Sistema por Unidade (p.u.), Diagrama Unifilar e Efeito Pelicular",
    teoriaId: "bloco4",
    focoTeoria: "Fórmula de Zbase = V²/S, mudança de base em p.u., referências do diagrama unifilar e efeito pelicular em linhas CA.",
    questoesIds: [21, 37, 39, 56],
    focoRevisao: "Memorizar Z_pu(novo) = Z_pu(velho) * (S_b,novo/S_b,velho) * (V_b,velho/V_b,novo)² e reatância em ohms Z = z_pu * V² / S."
  },
  {
    dia: 2,
    data: "08/11/2026",
    dataISO: "2026-11-08",
    diaSemana: "Domingo",
    fase: "Semana 1: SEP & Circuitos (Alto Peso)",
    bloco: "Bloco 4 - Análise de Sistemas Elétricos",
    titulo: "Componentes Simétricas e Teorema de Fortescue",
    teoriaId: "bloco4",
    focoTeoria: "Operador a = 1∠120°, relação 1 + a + a² = 0, matriz de transformação de Fortescue (sequências 0, 1 e 2).",
    questoesIds: [38, 49, 75],
    focoRevisao: "Atenção à ordem das colunas na matriz! Fase A tem [1, 1, 1]; Fase B tem [a², a, 1] para [positiva, negativa, zero]."
  },
  {
    dia: 3,
    data: "09/11/2026",
    dataISO: "2026-11-09",
    diaSemana: "Segunda-feira",
    fase: "Semana 1: SEP & Circuitos (Alto Peso)",
    bloco: "Bloco 4 - Análise de Sistemas Elétricos",
    titulo: "Diagramas de Sequência Zero e Faltas Simétricas/Assimétricas",
    teoriaId: "bloco4",
    focoTeoria: "Conexões de transformadores na sequência zero (Y aterrado por Zn -> 3Zn no diagrama), falta fase-terra (Ia1=Ia2=Ia0=E/(Z1+Z2+Z0)) e fase-fase.",
    questoesIds: [36, 40, 50],
    focoRevisao: "Curto Fase-Terra franco: I_falta = 3 * I_a0 = 3E / (Z1 + Z2 + Z0). Curto Fase-Fase (B-C): I_a0 = 0 e I_B = -I_C."
  },
  {
    dia: 4,
    data: "10/11/2026",
    dataISO: "2026-11-10",
    diaSemana: "Terça-feira",
    fase: "Semana 1: SEP & Circuitos (Alto Peso)",
    bloco: "Bloco 4 - Análise de Sistemas Elétricos",
    titulo: "Proteção de Sistemas Elétricos (Códigos ANSI e Ajuste de Relés)",
    teoriaId: "bloco4",
    focoTeoria: "Funções ANSI (50, 51, 50BF, 87, 21, 27, 59), falha de disjuntor (50BF) e cálculo de corrente secundária vista pelo relé via TC.",
    questoesIds: [29, 54, 76],
    focoRevisao: "Em transformador trifásico: I_prim = S / (√3 * V_L). Multiplique pelo fator de sobrecarga (ex.: 1,2) e divida pela RTC."
  },
  {
    dia: 5,
    data: "11/11/2026",
    dataISO: "2026-11-11",
    diaSemana: "Quarta-feira",
    fase: "Semana 1: SEP & Circuitos (Alto Peso)",
    bloco: "Bloco 2 - Circuitos Elétricos",
    titulo: "Circuitos CC, Equivalente de Thevenin e Malhas Infinitas",
    teoriaId: "bloco2",
    focoTeoria: "Cálculo de R_Th (fontes independentes de tensão em curto) e técnica de simetria/recorrência para malhas infinitas de capacitores ou resistores.",
    questoesIds: [44, 62, 72],
    focoRevisao: "Em associação de capacitores: paralelo soma (C1+C2), série faz produto pela soma. Em malha infinita, substitua o restante da cadeia por C_eq."
  },
  {
    dia: 6,
    data: "12/11/2026",
    dataISO: "2026-11-12",
    diaSemana: "Quinta-feira",
    fase: "Semana 1: SEP & Circuitos (Alto Peso)",
    bloco: "Bloco 2 - Circuitos Elétricos",
    titulo: "Análise Fasorial CA Monofásica e Valor Eficaz (RMS)",
    teoriaId: "bloco2",
    focoTeoria: "Potência complexa S = V * I*, impedância Z = |V|/|I| ∠φ (indutivo φ>0, capacitivo φ<0), lei dos cossenos fasorial e tensão RMS de onda quadrada.",
    questoesIds: [33, 51, 63],
    focoRevisao: "Onda quadrada simétrica de amplitude S tem V_rms = S = √2 * V_eficaz_rede."
  },
  {
    dia: 7,
    data: "13/11/2026",
    dataISO: "2026-11-13",
    diaSemana: "Sexta-feira",
    fase: "Semana 1: SEP & Circuitos (Alto Peso)",
    bloco: "Bloco 2 - Circuitos Elétricos",
    titulo: "Circuitos Trifásicos Equilibrados (Sequências ABC e ACB)",
    teoriaId: "bloco2",
    focoTeoria: "Sequência direta (ABC: B atrasada 120°) vs. inversa (ACB: B adiantada 120° de A). Defasagem da corrente em carga indutiva.",
    questoesIds: [34, 73],
    focoRevisao: "Sequência ACB: V_B = V_A ∠(+120°). Se carga é indutiva com FP = 0,5 (60°), a corrente I_B atrasa 60° em relação a V_B!"
  },
  {
    dia: 8,
    data: "14/11/2026",
    dataISO: "2026-11-14",
    diaSemana: "Sábado",
    fase: "Semana 2: Transitórios, Máquinas & Medidas",
    bloco: "Bloco 2 - Circuitos Elétricos",
    titulo: "Transitórios de 1ª Ordem (Circuitos RC e RL ao Degrau)",
    teoriaId: "bloco2",
    focoTeoria: "Constante de tempo τ = R*C (circuito RC) e τ = L/R (circuito RL). Resposta ao degrau: x(t) = x(∞) + [x(0+) - x(∞)] * e^(-t/τ).",
    questoesIds: [48, 67],
    focoRevisao: "Cuidado com as unidades! R = 10 kΩ e C = 1 mF -> τ = 10⁴ * 10⁻³ = 10 s. Em t = 30 s, t/τ = 3!"
  },
  {
    dia: 9,
    data: "15/11/2026",
    dataISO: "2026-11-15",
    diaSemana: "Domingo",
    fase: "Semana 2: Transitórios, Máquinas & Medidas",
    bloco: "Bloco 6 - Máquinas Elétricas",
    titulo: "Transformadores Monofásicos e Autotransformadores",
    teoriaId: "bloco6",
    focoTeoria: "Ensaio de curto-circuito (R_eq = P_cc / I_cc²), cálculo de rendimento η = P_out / P_in e relação de potências no autotransformador.",
    questoesIds: [23, 24, 79],
    focoRevisao: "No autotransformador abaixador 300V/100V (enrolamento série de 200V e comum de 100V), a potência do trafo isolado é S_isol = S_auto * (1 - N_baixa/N_alta)."
  },
  {
    dia: 10,
    data: "16/11/2026",
    dataISO: "2026-11-16",
    diaSemana: "Segunda-feira",
    fase: "Semana 2: Transitórios, Máquinas & Medidas",
    bloco: "Bloco 6 - Máquinas Elétricas",
    titulo: "Máquinas de Corrente Contínua (Equação de Tensão e Velocidade)",
    teoriaId: "bloco6",
    focoTeoria: "Motor CC Shunt (derivação): I_L = I_a + I_f, tensão induzida E_a = V_t - R_a * I_a, proporcionalidade E_a ∝ n (com fluxo constante).",
    questoesIds: [25, 80],
    focoRevisao: "Em vazio no motor CC shunt com torque zero: I_a ≈ 0, logo I_f = I_L(vazio) = 10 A e E_a0 = 200 V. Sob carga, I_a = I_L - I_f!"
  },
  {
    dia: 11,
    data: "17/11/2026",
    dataISO: "2026-11-17",
    diaSemana: "Terça-feira",
    fase: "Semana 2: Transitórios, Máquinas & Medidas",
    bloco: "Bloco 6 - Máquinas Elétricas",
    titulo: "Máquinas Síncronas e Motores de Indução Trifásicos (MIT)",
    teoriaId: "bloco6",
    focoTeoria: "Velocidade síncrona n_s = 120*f / P, máquinas acopladas no mesmo eixo (mesma rpm!), escorregamento s = P_jr / P_ef e controle da resistência rotórica (R2/s).",
    questoesIds: [26, 27, 28, 55],
    focoRevisao: "Fórmula de ouro do MIT: Perdas Joule no rotor P_jr = s * P_entreferro! E para manter o mesmo torque em outro escorregamento: R_total / s = constante."
  },
  {
    dia: 12,
    data: "18/11/2026",
    dataISO: "2026-11-18",
    diaSemana: "Quarta-feira",
    fase: "Semana 2: Transitórios, Máquinas & Medidas",
    bloco: "Bloco 3 - Medidas Elétricas",
    titulo: "Instrumentos Elétricos, TCs, Wattímetros e Shunt no Osciloscópio",
    teoriaId: "bloco3",
    focoTeoria: "Uso de voltímetro/amperímetro/ponte de Wheatstone, relação de TC (ex.: 400:5 A), teorema de Blondel (3 wattímetros: P_total = W1+W2+W3), potência ativa com fasores no tempo.",
    questoesIds: [35, 41, 42, 52, 60],
    focoRevisao: "Com v(t) = Vp cos(ωt + θv) e i(t) = Ip cos(ωt + θi), a potência ativa média é P = (Vp * Ip / 2) * cos(θv - θi). Não esqueça de dividir por 2!"
  },
  {
    dia: 13,
    data: "19/11/2026",
    dataISO: "2026-11-19",
    diaSemana: "Quinta-feira",
    fase: "Semana 2: Transitórios, Máquinas & Medidas",
    bloco: "Conhecimentos Básicos - Língua Portuguesa",
    titulo: "Interpretação, Coesão Referencial e Pontuação (Estilo Cesgranrio)",
    teoriaId: "portugues",
    focoTeoria: "Gêneros textuais (crônica/narrativa), pronome relativo 'que' retomando antecedente, vírgulas isolando aposto explicativo e conectivos.",
    questoesIds: [1, 2, 3, 4, 6, 7],
    focoRevisao: "Pronome relativo 'que' equivale a 'o qual / a qual' e retoma o substantivo antecedente imediato."
  },
  {
    dia: 14,
    data: "20/11/2026",
    dataISO: "2026-11-20",
    diaSemana: "Sexta-feira",
    fase: "Semana 2: Transitórios, Máquinas & Medidas",
    bloco: "Conhecimentos Básicos - Língua Portuguesa",
    titulo: "Crase, Regência, Correlação Verbal e Semântica",
    teoriaId: "portugues",
    focoTeoria: "Correlação entre futuro do pretérito composto ('teria sido lida') e pretérito mais-que-perfeito do subjuntivo ('se tivesse escrito'), crase e conectivos conclusivos.",
    questoesIds: [5, 8, 9, 10, 84],
    focoRevisao: "Regra clássica Cesgranrio: 'Teria + particípio' pede obrigatoriamente 'se tivesse + particípio'!"
  },
  {
    dia: 15,
    data: "21/11/2026",
    dataISO: "2026-11-21",
    diaSemana: "Sábado",
    fase: "Semana 3: Instalações, Controle, Matemática & Legislação",
    bloco: "Bloco 5 - Instalações Elétricas e Subestações",
    titulo: "NBR 5410: Aterramento (TN/TT/IT), DPS e Coordenação de Sobrecarga",
    teoriaId: "bloco5",
    focoTeoria: "Regra de coordenação de sobrecarga (IL ≤ Id ≤ Ic), esquemas TN-S, TN-C, TT e IT, instalação de DPS e dimensionamento por queda de tensão.",
    questoesIds: [22, 30, 31, 59],
    focoRevisao: "Sobrecarga NBR 5410: Corrente de projeto (IL) ≤ Corrente nominal do disjuntor (Id) ≤ Capacidade de condução do cabo (Ic)."
  },
  {
    dia: 16,
    data: "22/11/2026",
    dataISO: "2026-11-22",
    diaSemana: "Domingo",
    fase: "Semana 3: Instalações, Controle, Matemática & Legislação",
    bloco: "Bloco 5 - Instalações Elétricas e Subestações",
    titulo: "Subestações de Alta Tensão, Malhas de Terra (Wenner) e SPDA (NBR 5419)",
    teoriaId: "bloco5",
    focoTeoria: "Seccionadoras com lâmina de terra, arranjos de barramento (barra simples, dupla, disjuntor e meio), estratificação do solo por Wenner (nº de camadas = pontos de inflexão/patamares) e SPDA.",
    questoesIds: [32, 57, 77, 78],
    focoRevisao: "Na curva de resistividade aparente ρ(a) de Wenner: cada mudança de patamar/concavidade indica uma nova camada (ex.: sobe -> desce -> desce mais = 3 camadas)."
  },
  {
    dia: 17,
    data: "23/11/2026",
    dataISO: "2026-11-23",
    diaSemana: "Segunda-feira",
    fase: "Semana 3: Instalações, Controle, Matemática & Legislação",
    bloco: "Bloco 7 - Sistemas de Controle",
    titulo: "Sistemas de 2ª Ordem, Estabilidade e Lugar das Raízes (Root Locus)",
    teoriaId: "bloco7",
    focoTeoria: "Forma padrão ωn² / (s² + 2ζωn*s + ωn²), cálculo de razão de amortecimento ζ, polos no semiplano esquerdo (Re(s) < 0) e leitura do Lugar das Raízes.",
    questoesIds: [47, 68, 69, 81],
    focoRevisao: "Não esqueça de dividir numerador e denominador pelo coeficiente de s² antes de igualar a ωn² e 2ζωn!"
  },
  {
    dia: 18,
    data: "24/11/2026",
    dataISO: "2026-11-24",
    diaSemana: "Terça-feira",
    fase: "Semana 3: Instalações, Controle, Matemática & Legislação",
    bloco: "Bloco 7 - Sistemas de Controle",
    titulo: "Espaço de Estados e Controle em Tempo Discreto (Transformada Z)",
    teoriaId: "bloco7",
    focoTeoria: "Conversão G(s) = C*(sI - A)⁻¹*B + D, polinômio característico det(sI - A), equações a diferenças e cálculo de amostras y(0), y(1), y(2) ao impulso.",
    questoesIds: [45, 46, 66, 70],
    focoRevisao: "Para encontrar amostras de Y(z)/X(z) ao impulso (X(z)=1), divida em potências de z⁻¹ ou converta para equação a diferenças y(n)!"
  },
  {
    dia: 19,
    data: "25/11/2026",
    dataISO: "2026-11-25",
    diaSemana: "Quarta-feira",
    fase: "Semana 3: Instalações, Controle, Matemática & Legislação",
    bloco: "Bloco 1 - Matemática Aplicada",
    titulo: "Transformada de Laplace, Variáveis Complexas e Álgebra Vetorial",
    teoriaId: "bloco1",
    focoTeoria: "Frações parciais na Transformada de Laplace inversa, parte real e imaginária f(z) = u(x,y) + j*v(x,y), fase de número complexo e produto vetorial A = B × v.",
    questoesIds: [43, 61, 64, 65, 71],
    focoRevisao: "Se aceleração A = ω × v e v é perpendicular a ω (produto escalar ω·v = 0), o movimento é circular uniforme de raio R = |v| / |ω|!"
  },
  {
    dia: 20,
    data: "26/11/2026",
    dataISO: "2026-11-26",
    diaSemana: "Quinta-feira",
    fase: "Semana 3: Instalações, Controle, Matemática & Legislação",
    bloco: "Bloco 8 - Legislação (NR-10 e Lei 14.133/2021)",
    titulo: "Segurança em Eletricidade (NR-10) e Licitações de Engenharia (Lei 14.133)",
    teoriaId: "bloco8",
    focoTeoria: "NR-10: profissional qualificado vs. habilitado vs. capacitado vs. autorizado, zonas de risco e controlada. Lei 14.133/2021: modalidades (pregão para bens comuns, concorrência, diálogo competitivo) e regimes de execução.",
    questoesIds: [53, 58, 82, 83],
    focoRevisao: "NR-10: Profissional CAPACITADO recebe capacitação E trabalha sob orientação/responsabilidade de profissional HABILITADO (com registro no conselho) e AUTORIZADO."
  },
  {
    dia: 21,
    data: "27/11/2026",
    dataISO: "2026-11-27",
    diaSemana: "Sexta-feira",
    fase: "Semana 3: Instalações, Controle, Matemática & Legislação",
    bloco: "Conhecimentos Básicos - Língua Inglesa",
    titulo: "Inglês Instrumental Técnico: Skimming, Scanning, Conectivos e Referência",
    teoriaId: "ingles",
    focoTeoria: "Ideia principal (main idea), conectivos adversativos (however, yet, whereas), pronomes relativos (which, whose, that) e vocabulário técnico de energia/engenharia.",
    questoesIds: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 85],
    focoRevisao: "'Pivotal' = essential/crucial; 'However' = opposition/contrast; 'Low latency' = minimal delay."
  },
  {
    dia: 22,
    data: "28/11/2026",
    dataISO: "2026-11-28",
    diaSemana: "Sábado",
    fase: "Semana 4: Revisão Intensiva, Simulados & Reta Final",
    bloco: "Revisão Integrada - Blocos 1, 2 e 3",
    titulo: "Bateria Cronometrada: Matemática, Circuitos e Medidas Elétricas",
    teoriaId: "bloco2",
    focoTeoria: "Revisão rápida do formulário de Circuitos CA/CC, Transitórios RC/RL, Wattímetros e Laplace.",
    questoesIds: [33, 34, 42, 44, 48, 52, 64, 67, 74],
    focoRevisao: "Conferir velocidade de resolução (< 3,5 min por questão) e precisão nas contas trigonométricas (cos 30° = √3/2, sen 30° = 0,5)."
  },
  {
    dia: 23,
    data: "29/11/2026",
    dataISO: "2026-11-29",
    diaSemana: "Domingo",
    fase: "Semana 4: Revisão Intensiva, Simulados & Reta Final",
    bloco: "Revisão Integrada - Blocos 4 e 5",
    titulo: "Bateria Cronometrada: Sistemas de Potência (SEP), Proteção e Instalações",
    teoriaId: "bloco4",
    focoTeoria: "Revisão rápida de Curto-Circuito em p.u., Componentes Simétricas, Relés ANSI e NBR 5410/5419.",
    questoesIds: [22, 29, 30, 31, 36, 37, 40, 49, 50, 54],
    focoRevisao: "Refazer sem olhar a resolução as questões de curto-circuito (Q50) e tensão por componentes simétricas (Q49)."
  },
  {
    dia: 24,
    data: "30/11/2026",
    dataISO: "2026-11-30",
    diaSemana: "Segunda-feira",
    fase: "Semana 4: Revisão Intensiva, Simulados & Reta Final",
    bloco: "Revisão Integrada - Blocos 6, 7 e 8",
    titulo: "Bateria Cronometrada: Máquinas Elétricas, Controle, NR-10 e Lei 14.133",
    teoriaId: "bloco6",
    focoTeoria: "Revisão rápida de Transformadores, Motores CC/MIT/Síncronos, Espaço de Estados, 2ª Ordem e NR-10.",
    questoesIds: [23, 24, 25, 27, 45, 46, 53, 55, 68, 69],
    focoRevisao: "Checar se todas as fórmulas de Máquinas e Controle estão na ponta da língua."
  },
  {
    dia: 25,
    data: "01/12/2026",
    dataISO: "2026-12-01",
    diaSemana: "Terça-feira",
    fase: "Semana 4: Revisão Intensiva, Simulados & Reta Final",
    bloco: "Marco Oficial do Edital (CCI) + Simulado Geral Parte 1",
    titulo: "HOJE SAI O LOCAL DE PROVA (CCI)! + Simulado Questões 1 a 25",
    teoriaId: "portugues",
    focoTeoria: "1) Acessar www.cesgranrio.org.br e imprimir o Cartão de Confirmação de Inscrição (CCI). 2) Resolver bateria mista de Básicos + Específicos.",
    questoesIds: [1, 5, 8, 12, 15, 21, 22, 23, 24, 25],
    focoRevisao: "Verificar se o polo de trabalho, ênfase e cidade de prova estão corretos no CCI (prazo de retificação: 01 a 04/12)."
  },
  {
    dia: 26,
    data: "02/12/2026",
    dataISO: "2026-12-02",
    diaSemana: "Quarta-feira",
    fase: "Semana 4: Revisão Intensiva, Simulados & Reta Final",
    bloco: "Simulado Geral Parte 2",
    titulo: "Treino de Velocidade: Questões de Cálculo Rápido da Cesgranrio",
    teoriaId: "bloco3",
    focoTeoria: "Estratégia de prova: identificar questões de resolução imediata (< 1 min) vs. questões de conta longa (deixar para a 2ª passada).",
    questoesIds: [26, 27, 30, 33, 37, 41, 42, 43, 48, 63],
    focoRevisao: "Na prova real, garanta primeiro as 30 questões mais diretas antes de gastar tempo em álgebra matricial longa."
  },
  {
    dia: 27,
    data: "03/12/2026",
    dataISO: "2026-12-03",
    diaSemana: "Quinta-feira",
    fase: "Semana 4: Revisão Intensiva, Simulados & Reta Final",
    bloco: "Caderno de Erros e Questões Inéditas 2026.4",
    titulo: "Revisão do Caderno de Erros + Questões Inéditas do Edital 2026.4",
    teoriaId: "bloco5",
    focoTeoria: "Resolver todas as questões inéditas focadas em temas do edital que podem surpreender (SPDA, Bode, Arranjos de SE, Lei 14.133).",
    questoesIds: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85],
    focoRevisao: "Ir na aba 'Banco de Questões', filtrar por 'Erradas' e refazer todas até zerar os erros!"
  },
  {
    dia: 28,
    data: "04/12/2026",
    dataISO: "2026-12-04",
    diaSemana: "Sexta-feira",
    fase: "Semana 4: Revisão Intensiva, Simulados & Reta Final",
    bloco: "Revisão de Fórmulas-Chave (Formulário Ouro)",
    titulo: "Memorização Ativa de Todas as Fórmulas de Engenharia Elétrica",
    teoriaId: "bloco1",
    focoTeoria: "Passar pelos quadros de fórmulas dos 8 blocos: Laplace, Thevenin, Potência CA, Fortescue, Curto-Circuito, Trafo/MIT/MCC e Controle.",
    questoesIds: [38, 45, 50, 55, 62, 65, 69, 70],
    focoRevisao: "Escrever em uma folha em branco as 15 fórmulas essenciais sem consultar."
  },
  {
    dia: 29,
    data: "05/12/2026",
    dataISO: "2026-12-05",
    diaSemana: "Sábado (Véspera)",
    fase: "Véspera da Prova",
    bloco: "Checklist Final & Revisão Leve de Véspera",
    titulo: "Véspera Estratégica: NR-10, Lei 14.133, Códigos ANSI e Checklist de Prova",
    teoriaId: "bloco8",
    focoTeoria: "Leitura leve de códigos ANSI de proteção, conceitos de NR-10, modalidades da Lei 14.133 e conferência do Checklist do Dia da Prova.",
    questoesIds: [29, 32, 53, 58],
    focoRevisao: "Separar documento com foto, CCI impresso, canetas pretas transparentes e descansar cedo!"
  },
  {
    dia: 30,
    data: "06/12/2026",
    dataISO: "2026-12-06",
    diaSemana: "Domingo (DIA DA PROVA)",
    fase: "DIA D - PROVA TRANSPETRO",
    bloco: "Execução da Prova Objetiva (70 Questões - 4h30min)",
    titulo: "DIA DA PROVA! Estratégia de Gestão de Tempo e Cartão-Resposta",
    teoriaId: "bloco4",
    focoTeoria: "Chegar com 1h de antecedência. Fazer 1ª passada nas questões rápidas de Específicas (garantir >25 pts e corte 2x CR), fazer Português e Inglês com atenção total, voltar nas questões trabalhadas e reservar 30 min para o Cartão-Resposta!",
    questoesIds: [],
    focoRevisao: "Anote suas respostas no Cartão de Confirmação de Inscrição (CCI) para conferir o gabarito oficial amanhã (07/12/2026)!"
  }
];

