// Aplicação Principal de Estudo e Acompanhamento — Transpetro 2026.4 (Engenharia Elétrica - Ênfase 23)

(function transpetroAppMain() {
  "use strict";

  const STORAGE_KEY = "TRANSPETRO_EE_2026_STATE_V1";

  // Combina todas as 85 questões (1 a 70 da Prova 2023.2 + 71 a 85 Inéditas 2026.4)
  const TODAS_QUESTOES = []
    .concat(window.QUESTOES_PARTE1 || [])
    .concat(window.QUESTOES_PARTE2 || [])
    .sort((a, b) => a.numero - b.numero);

  window.TODAS_QUESTOES = TODAS_QUESTOES;

  // Estado padrão persistido no navegador
  const defaultState = {
    theme: "dark",
    completedDays: [],
    studiedTheory: [],
    answeredQuestions: {}, // { [id]: { selected: "A", correct: true } }
    bookmarkedQuestions: [],
    completedChecklist: [],
    personalNotes:
      "📌 Fórmulas Rápidas para Revisar antes da Prova:\n" +
      "• Curto 1φ-Terra franco: I_f = 3·E / (Z1 + Z2 + Z0)\n" +
      "• Mudança de base p.u.: Z_novo = Z_antigo · (S_novo/S_antigo) · (V_antigo/V_novo)²\n" +
      "• NBR 5410 Sobrecarga: IL ≤ Id ≤ Ic\n" +
      "• MIT Conjugado × Escorregamento: R2 / s1 = (R2 + R_ext) / s2\n" +
      "• 2ª Ordem: G(s) = ωn² / (s² + 2·ζ·ωn·s + ωn²)\n",
    simuladoHistory: [],
    updatedAt: 0
  };

  const CLOUD_CONFIG_KEY = "TRANSPETRO_EE_2026_CLOUD_CFG_V1";
  const EMBEDDED_CLOUD_CONFIG = /*__EMBEDDED_CLOUD_CFG_START__*/ null /*__EMBEDDED_CLOUD_CFG_END__*/;

  let cloudConfig = loadCloudConfig();
  let cloudSyncTimer = null;
  let cloudStatus = {
    state: cloudConfig && cloudConfig.enabled ? "idle" : "unconfigured", // unconfigured | idle | syncing | synced | error
    message: "",
    lastSyncAt: null
  };

  let state = loadState();

  // Estado volátil de navegação/filtros
  let currentTab = "dashboard";
  let currentTheoryId = "bloco4";
  let currentPlanFilter = "todos";
  let customQuestionIdsFilter = null; // Array de IDs quando filtrado a partir de um Dia do Plano
  let customFilterLabel = "";

  // Estado do Timer de 30 Minutos (1800 segundos)
  let timerSeconds = 1800;
  let timerInterval = null;
  let timerRunning = false;

  // Estado do Simulado Ativo
  let activeSimulado = null;
  let simuladoTimerInterval = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(defaultState));
      const parsed = JSON.parse(raw);
      return Object.assign({}, JSON.parse(JSON.stringify(defaultState)), parsed);
    } catch (e) {
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  function saveState(skipCloudPush) {
    state.updatedAt = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Não foi possível salvar no localStorage:", e);
    }
    updateGlobalCounters();
    if (!skipCloudPush) {
      scheduleCloudPush();
    }
  }

  // =========================================================================
  // MOTOR DE SINCRONIZAÇÃO AUTOMÁTICA NA NUVEM (GOOGLE SCRIPT / GITHUB GIST / FIREBASE)
  // =========================================================================
  function loadCloudConfig() {
    try {
      const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.enabled) return parsed;
      }
    } catch (e) {
      // ignora
    }
    if (EMBEDDED_CLOUD_CONFIG && EMBEDDED_CLOUD_CONFIG.enabled) {
      return JSON.parse(JSON.stringify(EMBEDDED_CLOUD_CONFIG));
    }
    return {
      enabled: false,
      provider: "google", // "google" | "github" | "firebase"
      gasUrl: "",
      ghToken: "",
      gistId: "",
      fbUrl: ""
    };
  }

  function saveCloudConfig() {
    try {
      localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cloudConfig));
    } catch (e) {
      console.warn("Erro ao salvar config de nuvem:", e);
    }
    updateCloudStatusUI();
  }

  function isCloudConfigured() {
    if (!cloudConfig || !cloudConfig.enabled) return false;
    if (cloudConfig.provider === "google") return !!cloudConfig.gasUrl;
    if (cloudConfig.provider === "github") return !!cloudConfig.ghToken;
    if (cloudConfig.provider === "firebase") return !!cloudConfig.fbUrl;
    return false;
  }

  function updateCloudStatusUI() {
    const dot = document.getElementById("cloud-status-dot");
    const label = document.getElementById("cloud-status-label");
    const modalTitle = document.getElementById("cloud-modal-status-title");
    const modalSub = document.getElementById("cloud-modal-status-sub");

    if (!isCloudConfigured()) {
      if (dot) dot.className = "cloud-dot";
      if (label) label.textContent = "☁️ Nuvem: Configurar";
      if (modalTitle) modalTitle.textContent = "⚪ Nuvem desconectada (Salvando apenas neste navegador)";
      if (modalSub)
        modalSub.textContent =
          "Escolha abaixo Google Script (recomendado p/ Google Sites), GitHub Gist ou Firebase para ativar o salvamento na nuvem.";
      return;
    }

    const provName =
      cloudConfig.provider === "google"
        ? "Google Cloud Script"
        : cloudConfig.provider === "github"
        ? "GitHub Gist Secreto"
        : "Firebase / REST";

    const timeStr = cloudStatus.lastSyncAt
      ? new Date(cloudStatus.lastSyncAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      : "";

    if (cloudStatus.state === "syncing") {
      if (dot) dot.className = "cloud-dot syncing";
      if (label) label.textContent = "🔄 Sincronizando nuvem...";
      if (modalTitle) modalTitle.textContent = `🔄 Sincronizando com ${provName}...`;
      if (modalSub) modalSub.textContent = "Aguarde um instante...";
    } else if (cloudStatus.state === "error") {
      if (dot) dot.className = "cloud-dot error";
      if (label) label.textContent = "⚠️ Nuvem: Erro (Ver)";
      if (modalTitle) modalTitle.textContent = `⚠️ Falha ao sincronizar com ${provName}`;
      if (modalSub) modalSub.textContent = cloudStatus.message || "Verifique sua URL/Token ou conexão com a internet.";
    } else {
      if (dot) dot.className = "cloud-dot synced";
      if (label)
        label.textContent = timeStr
          ? `☁️ Salvo na Nuvem (${timeStr.slice(0, 5)})`
          : "☁️ Nuvem Conectada ✓";
      if (modalTitle)
        modalTitle.textContent = `🟢 Conectado a ${provName} ${timeStr ? "• Última sinc: " + timeStr : ""}`;
      if (modalSub)
        modalSub.textContent =
          cloudStatus.message ||
          "Qualquer questão respondida, dia concluído ou anotação é salvo automaticamente na sua nuvem.";
    }
  }

  function scheduleCloudPush() {
    if (!isCloudConfigured()) return;
    if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
    cloudStatus.state = "syncing";
    updateCloudStatusUI();
    cloudSyncTimer = setTimeout(function () {
      pushToCloud({ silent: true });
    }, 1000);
  }

  async function ensureGitHubGist() {
    if (cloudConfig.gistId) return cloudConfig.gistId;
    const headers = {
      Authorization: "Bearer " + cloudConfig.ghToken,
      Accept: "application/vnd.github+json"
    };
    // Procura Gist existente na conta do usuário
    const listRes = await fetch("https://api.github.com/gists?per_page=60", {
      method: "GET",
      headers: headers
    });
    if (!listRes.ok) {
      throw new Error("Token do GitHub inválido ou sem permissão 'gist' (HTTP " + listRes.status + ").");
    }
    const gists = await listRes.json();
    const found = (gists || []).find(
      (g) => g.files && g.files["transpetro_2026_estudo.json"]
    );
    if (found) {
      cloudConfig.gistId = found.id;
      saveCloudConfig();
      const inputGist = document.getElementById("input-cloud-gh-gist");
      if (inputGist) inputGist.value = found.id;
      return found.id;
    }
    // Cria novo Gist Secreto
    const createRes = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, headers),
      body: JSON.stringify({
        description: "Progresso na Nuvem — Plataforma Transpetro 2026.4 (Engenharia Elétrica)",
        public: false,
        files: {
          "transpetro_2026_estudo.json": {
            content: JSON.stringify(state, null, 2)
          }
        }
      })
    });
    if (!createRes.ok) {
      throw new Error("Não foi possível criar o Gist Secreto (HTTP " + createRes.status + ").");
    }
    const created = await createRes.json();
    cloudConfig.gistId = created.id;
    saveCloudConfig();
    const inputGist = document.getElementById("input-cloud-gh-gist");
    if (inputGist) inputGist.value = created.id;
    return created.id;
  }

  async function pushToCloud(opts) {
    if (!isCloudConfigured()) return false;
    cloudStatus.state = "syncing";
    updateCloudStatusUI();

    try {
      const payloadStr = JSON.stringify(state);

      if (cloudConfig.provider === "google") {
        const res = await fetch(cloudConfig.gasUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: payloadStr,
          redirect: "follow"
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } else if (cloudConfig.provider === "github") {
        const gistId = await ensureGitHubGist();
        const res = await fetch("https://api.github.com/gists/" + gistId, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + cloudConfig.ghToken,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            files: {
              "transpetro_2026_estudo.json": {
                content: JSON.stringify(state, null, 2)
              }
            }
          })
        });
        if (!res.ok) throw new Error("GitHub HTTP " + res.status);
      } else if (cloudConfig.provider === "firebase") {
        const res = await fetch(cloudConfig.fbUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: payloadStr
        });
        if (!res.ok) throw new Error("REST HTTP " + res.status);
      }

      cloudStatus.state = "synced";
      cloudStatus.lastSyncAt = Date.now();
      cloudStatus.message = "Progresso salvo na nuvem com sucesso!";
      updateCloudStatusUI();
      return true;
    } catch (err) {
      cloudStatus.state = "error";
      cloudStatus.message = "Erro ao enviar para nuvem: " + (err.message || err);
      updateCloudStatusUI();
      if (!opts || !opts.silent) {
        alert("Não foi possível salvar na nuvem:\n" + cloudStatus.message);
      }
      return false;
    }
  }

  async function pullFromCloud(opts) {
    if (!isCloudConfigured()) return false;
    cloudStatus.state = "syncing";
    updateCloudStatusUI();

    try {
      let remoteData = null;

      if (cloudConfig.provider === "google") {
        const sep = cloudConfig.gasUrl.includes("?") ? "&" : "?";
        const res = await fetch(cloudConfig.gasUrl + sep + "t=" + Date.now(), {
          method: "GET",
          redirect: "follow"
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const text = await res.text();
        remoteData = text ? JSON.parse(text) : null;
      } else if (cloudConfig.provider === "github") {
        const gistId = await ensureGitHubGist();
        const res = await fetch(
          "https://api.github.com/gists/" + gistId + "?t=" + Date.now(),
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + cloudConfig.ghToken,
              Accept: "application/vnd.github+json"
            }
          }
        );
        if (!res.ok) throw new Error("GitHub HTTP " + res.status);
        const gist = await res.json();
        const fileObj = gist.files && gist.files["transpetro_2026_estudo.json"];
        if (fileObj && fileObj.content) {
          remoteData = JSON.parse(fileObj.content);
        }
      } else if (cloudConfig.provider === "firebase") {
        const sep = cloudConfig.fbUrl.includes("?") ? "&" : "?";
        const res = await fetch(cloudConfig.fbUrl + sep + "t=" + Date.now(), {
          method: "GET"
        });
        if (!res.ok) throw new Error("REST HTTP " + res.status);
        remoteData = await res.json();
      }

      const hasRemoteContent =
        remoteData &&
        typeof remoteData === "object" &&
        (remoteData.updatedAt ||
          (remoteData.completedDays && remoteData.completedDays.length > 0) ||
          (remoteData.answeredQuestions &&
            Object.keys(remoteData.answeredQuestions).length > 0));

      if (!hasRemoteContent) {
        // Nuvem ainda está vazia -> envia o progresso local atual para inicializar a nuvem!
        await pushToCloud({ silent: true });
        return true;
      }

      // Se for clique manual em "Baixar da Nuvem Agora" ou se a nuvem for mais recente, aplica/mescla
      if (opts && opts.forceOverwrite) {
        state = Object.assign(
          {},
          JSON.parse(JSON.stringify(defaultState)),
          remoteData
        );
      } else {
        state = mergeLocalAndCloudState(state, remoteData);
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // ignora
      }

      applyTheme();
      updateGlobalCounters();
      switchTab(currentTab);

      cloudStatus.state = "synced";
      cloudStatus.lastSyncAt = Date.now();
      cloudStatus.message = "Progresso sincronizado a partir da nuvem!";
      updateCloudStatusUI();
      return true;
    } catch (err) {
      cloudStatus.state = "error";
      cloudStatus.message = "Erro ao carregar da nuvem: " + (err.message || err);
      updateCloudStatusUI();
      if (!opts || !opts.silent) {
        alert("Não foi possível carregar da nuvem:\n" + cloudStatus.message);
      }
      return false;
    }
  }

  function mergeLocalAndCloudState(local, remote) {
    const localTime = Number(local.updatedAt || 0);
    const remoteTime = Number(remote.updatedAt || 0);

    // Se um dos lados tem updatedAt maior, ele é a base principal para permitir até desmarcações intencionais,
    // mas preservamos questões respondidas se o estado local estava zerado (novo dispositivo).
    if (localTime === 0 && remoteTime > 0) {
      return Object.assign({}, JSON.parse(JSON.stringify(defaultState)), remote);
    }
    if (remoteTime >= localTime) {
      const mergedQuestions = Object.assign(
        {},
        local.answeredQuestions || {},
        remote.answeredQuestions || {}
      );
      return Object.assign({}, JSON.parse(JSON.stringify(defaultState)), remote, {
        answeredQuestions: mergedQuestions
      });
    }
    // Local é mais recente que a nuvem
    return local;
  }

  // Renderização Matemática LaTeX real via KaTeX + Fallback Nativo Vertical Offline
  function renderLatexExpr(rawLatex, displayMode) {
    const cleanLatex = rawLatex
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    if (window.katex && typeof window.katex.renderToString === "function") {
      try {
        return window.katex.renderToString(cleanLatex, {
          displayMode: !!displayMode,
          throwOnError: false,
          strict: false
        });
      } catch (e) {
        // cai no fallback abaixo se houver erro
      }
    }
    return formatMathSymbols(rawLatex);
  }

  function typesetMathInElement(el) {
    if (!el) return;
    if (typeof window.renderMathInElement === "function") {
      try {
        window.renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\[", right: "\\]", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        // Ignora erro de auto-render
      }
    }
  }

  // Formatação de texto matemático LaTeX e markdown nas explicações, enunciados e flashcards
  function formatRichText(text) {
    if (!text) return "";
    let html = String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Blocos matemáticos $$...$$
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, function (_, math) {
      return '<div class="formula-box">' + renderLatexExpr(math, true) + "</div>";
    });

    // Inline math $...$
    html = html.replace(/\$([^$\n]+)\$/g, function (_, math) {
      return (
        '<span class="inline-math" style="padding:0 2px;">' +
        renderLatexExpr(math, false) +
        "</span>"
      );
    });

    // Negrito **...**
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // Itálico *...*
    html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

    // Quebras de linha
    html = html.replace(/\n/g, "<br>");
    return html;
  }

  function formatMathSymbols(str) {
    let out = str
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\\mathbf\{([^}]*)\}/g, "<strong>$1</strong>")
      .replace(/\\operatorname\{([^}]*)\}/g, "$1")
      .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)");

    // Frações verticais empilhadas estilo LaTeX (até 2 níveis de aninhamento)
    for (let i = 0; i < 2; i++) {
      out = out.replace(
        /\\frac\{([^{}]*)\}\{([^{}]*)\}/g,
        '<span class="tex-frac"><span class="tex-num">$1</span><span class="tex-den">$2</span></span>'
      );
    }

    return out
      .replace(/\\angle/g, "∠")
      .replace(/\\^\{\\circ\}|\^\\circ/g, "°")
      .replace(/\\Omega/g, "Ω")
      .replace(/\\omega/g, "ω")
      .replace(/\\zeta/g, "ζ")
      .replace(/\\tau/g, "τ")
      .replace(/\\delta/g, "δ")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\phi/g, "φ")
      .replace(/\\varphi/g, "φ")
      .replace(/\\theta/g, "θ")
      .replace(/\\rho/g, "ρ")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\pi/g, "π")
      .replace(/\\sigma/g, "σ")
      .replace(/\\mu/g, "μ")
      .replace(/\\eta/g, "η")
      .replace(/\\infty/g, "∞")
      .replace(/\\implies/g, "⇒")
      .replace(/\\iff/g, "⇔")
      .replace(/\\to/g, "→")
      .replace(/\\le/g, "≤")
      .replace(/\\ge/g, "≥")
      .replace(/\\neq/g, "≠")
      .replace(/\\approx/g, "≈")
      .replace(/\\pm/g, "±")
      .replace(/\\times/g, "×")
      .replace(/\\cdot/g, "·")
      .replace(/\\parallel/g, "∥")
      .replace(/\\perp/g, "⊥")
      .replace(/\\det/g, "det")
      .replace(/\\cos/g, "cos")
      .replace(/\\sin/g, "sen")
      .replace(/\\log/g, "log")
      .replace(/\\dot\{([A-Za-z0-9_]+)\}/g, "$1")
      .replace(/\\vec\{([A-Za-z0-9_]+)\}/g, "$1⃗")
      .replace(/\\left|\\right/g, "")
      .replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>")
      .replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>")
      .replace(/_([a-zA-Z0-9])/g, "<sub>$1</sub>")
      .replace(/\^([0-9+-]+)/g, "<sup>$1</sup>");
  }

  // Som suave via Web Audio API para o Timer
  function playBeep(freq = 880, duration = 0.25) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignora caso áudio esteja bloqueado
    }
  }

  // =========================================================================
  // CRONÔMETRO GUIADO DE 30 MINUTOS (10m Teoria + 15m Questões + 5m Revisão)
  // =========================================================================
  function updateTimerUI() {
    const min = Math.floor(timerSeconds / 60);
    const sec = timerSeconds % 60;
    const formatted =
      String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    const display = document.getElementById("timer-display");
    if (display) {
      display.textContent = formatted;
    }

    const mobText = document.getElementById("mobile-timer-text");
    const mobIcon = document.getElementById("mobile-timer-icon");
    const mobPill = document.getElementById("btn-mobile-timer-pill");
    if (mobText) mobText.textContent = formatted;
    if (mobIcon) mobIcon.textContent = timerRunning ? "⏸" : "▶";
    if (mobPill) mobPill.classList.toggle("running", !!timerRunning);

    const badge = document.getElementById("timer-phase-badge");
    const seg1 = document.getElementById("timer-seg-1");
    const seg2 = document.getElementById("timer-seg-2");
    const seg3 = document.getElementById("timer-seg-3");

    if (seg1 && seg2 && seg3 && badge) {
      seg1.className = "timer-stage-seg";
      seg2.className = "timer-stage-seg";
      seg3.className = "timer-stage-seg";

      if (timerSeconds > 1200) {
        // 30:00 até 20:01 (primeiros 10 min)
        badge.textContent = "1/3 • 10m Teoria";
        seg1.classList.add("active");
      } else if (timerSeconds > 300) {
        // 20:00 até 05:01 (15 min seguintes)
        badge.textContent = "2/3 • 15m Questões";
        seg1.classList.add("done");
        seg2.classList.add("active");
      } else if (timerSeconds > 0) {
        // 05:00 até 00:01 (5 min finais)
        badge.textContent = "3/3 • 5m Revisão";
        seg1.classList.add("done");
        seg2.classList.add("done");
        seg3.classList.add("active");
      } else {
        badge.textContent = "✅ Meta 30m Concluída!";
        seg1.classList.add("done");
        seg2.classList.add("done");
        seg3.classList.add("done");
      }
    }

    const btnToggle = document.getElementById("btn-timer-toggle");
    if (btnToggle) {
      btnToggle.textContent = timerRunning ? "⏸ Pausar" : "▶ Iniciar 30m";
    }
  }

  function toggleTimer() {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
      updateTimerUI();
      return;
    }

    if (timerSeconds <= 0) {
      timerSeconds = 1800;
    }
    timerRunning = true;
    playBeep(660, 0.15);
    updateTimerUI();

    timerInterval = setInterval(function () {
      if (timerSeconds > 0) {
        timerSeconds--;
        // Alerta sonoro na transição das etapas (20:00 e 05:00)
        if (timerSeconds === 1200 || timerSeconds === 300) {
          playBeep(880, 0.3);
        }
        updateTimerUI();
      } else {
        clearInterval(timerInterval);
        timerRunning = false;
        playBeep(1046, 0.5);
        updateTimerUI();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 1800;
    updateTimerUI();
  }

  // =========================================================================
  // NAVEGAÇÃO ENTRE ABAS E CONTADORES GLOBAIS
  // =========================================================================
  function closeMobileSidebar() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sidebar-backdrop")?.classList.remove("open");
  }

  function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll(".tab-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === "tab-" + tabId);
    });
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
    document.querySelectorAll(".mobile-nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });

    // Fecha menu mobile/tablet caso aberto
    closeMobileSidebar();

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (tabId === "dashboard") renderDashboard();
    if (tabId === "plano") renderPlano30Dias();
    if (tabId === "teoria") renderTeoria();
    if (tabId === "questoes") renderQuestoes();
    if (tabId === "simulado") renderSimuladoTab();
    if (tabId === "edital") renderEditalTab();
  }

  function updateGlobalCounters() {
    const daysDone = state.completedDays.length;
    const totalDays = (window.PLANO_30_DIAS || []).length || 30;
    const pctPlan = Math.round((daysDone / totalDays) * 100);

    const answeredCount = Object.keys(state.answeredQuestions).length;
    const totalQuestions = TODAS_QUESTOES.length;

    const badgePlano = document.getElementById("nav-badge-plano");
    if (badgePlano) badgePlano.textContent = daysDone + "/" + totalDays;

    const badgeTeoria = document.getElementById("nav-badge-teoria");
    if (badgeTeoria)
      badgeTeoria.textContent =
        state.studiedTheory.length + "/" + (window.DADOS_TEORIA || []).length;

    const badgeQuestoes = document.getElementById("nav-badge-questoes");
    if (badgeQuestoes)
      badgeQuestoes.textContent = answeredCount + "/" + totalQuestions;

    const topProgressLabel = document.getElementById("top-progress-pct");
    if (topProgressLabel) topProgressLabel.textContent = pctPlan + "%";

    const topProgressFill = document.getElementById("top-progress-fill");
    if (topProgressFill) topProgressFill.style.width = pctPlan + "%";

    // Contagem regressiva até 06/12/2026
    const examDate = new Date("2026-12-06T08:00:00-03:00");
    const now = new Date();
    const diffMs = examDate - now;
    const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const countdownEl = document.getElementById("countdown-days-text");
    if (countdownEl) {
      countdownEl.textContent =
        diffDays > 0
          ? "⏳ Faltam " + diffDays + " dias para a Prova (06/12/2026)"
          : "🎯 Dia da Prova: 06/12/2026";
    }
  }

  // =========================================================================
  // ABA 1: DASHBOARD GERAL + RECUPERAÇÃO INTELIGENTE DE DIAS PERDIDOS
  // =========================================================================
  const FLASHCARDS_REVISAO = [
    {
      frente: "Bloco 4 (SEP) — Qual é a fórmula da Corrente de Falta Monofásica Franca (Fase-Terra) em p.u.?",
      verso: "$$I_{cc1\\phi} = 3 I_{a0} = \\frac{3 E}{Z_1 + Z_2 + Z_0}$$ As três redes de sequência (positiva, negativa e zero) ficam conectadas em **SÉRIE**!"
    },
    {
      frente: "Bloco 4 (SEP) — Na matriz de Fortescue $[\\dot{A}, \\dot{B}, \\dot{C}]^T = M \\cdot [\\dot{x}, \\dot{y}, \\dot{z}]^T$, como identificar as colunas de sequência positiva, negativa e zero?",
      verso: "• Coluna $[1, 1, 1]^T \\implies$ **Sequência ZERO**\n• Coluna $[1, a^2, a]^T \\implies$ **Sequência POSITIVA**\n• Coluna $[1, a, a^2]^T \\implies$ **Sequência NEGATIVA** (onde $a = 1\\angle 120^\\circ$)."
    },
    {
      frente: "Bloco 4 (SEP) — Como converter uma impedância em p.u. de uma base antiga $(S_v, V_v)$ para uma base nova $(S_n, V_n)$?",
      verso: "$$Z_{pu,\\text{novo}} = Z_{pu,\\text{velho}} \\cdot \\left(\\frac{S_{\\text{base,novo}}}{S_{\\text{base,velho}}}\\right) \\cdot \\left(\\frac{V_{\\text{base,velho}}}{V_{\\text{base,novo}}}\\right)^2$$"
    },
    {
      frente: "Bloco 4 (SEP) — O que faz o relé ANSI 50BF (Breaker Failure / Falha de Disjuntor)?",
      verso: "Se o disjuntor principal recebe comando de abertura sob falta e não interrompe a corrente no tempo ajustado, o **50BF** comanda a abertura de todos os disjuntores **ADJACENTES** que alimentam a mesma barra."
    },
    {
      frente: "Bloco 5 (NBR 5410) — Qual é a inequação obrigatória de coordenação para proteção de condutores contra sobrecarga?",
      verso: "$$I_L \\le I_d \\le I_c \\quad (\\text{ou } I_B \\le I_N \\le I_Z)$$ onde $I_L$ é a corrente de projeto da carga, $I_d$ é a corrente nominal do disjuntor e $I_c$ é a capacidade de condução do cabo."
    },
    {
      frente: "Bloco 5 (NBR 5410) — O que caracteriza o esquema de aterramento TT?",
      verso: "• **1ª letra T:** um ponto da alimentação (neutro) diretamente aterrado.\n• **2ª letra T:** massas da instalação aterradas em eletrodo(s) **ELETRICAMENTE DISTINTO(S)** do eletrodo da alimentação."
    },
    {
      frente: "Bloco 6 (Máquinas) — Em um Motor de Indução de Rotor Bobinado, como calcular a resistência externa $R_{\\text{adic}}$ para obter o mesmo torque num novo escorregamento $s_2$?",
      verso: "O conjugado depende da razão $R_2 / s$. Logo:\n$$\\frac{R_2}{s_1} = \\frac{R_2 + R_{\\text{adic}}}{s_2}$$"
    },
    {
      frente: "Bloco 6 (Máquinas) — Qual a relação entre a potência nominal como Autotransformador ($S_{\\text{auto}}$) e como Transformador Isolado ($S_{\\text{isol}}$)?",
      verso: "$$S_{\\text{isol}} = V_{\\text{série}} \\cdot I_{\\text{série}} = S_{\\text{auto}} \\cdot \\left(1 - \\frac{V_{\\text{menor}}}{V_{\\text{maior}}}\\right)$$ Em um autotrafo $300\\text{ V}/100\\text{ V}$ de $60\\text{ kVA}$, $S_{\\text{isol}} = 60 \\cdot (1 - 1/3) = 40\\text{ kVA}$."
    },
    {
      frente: "Bloco 2 (Circuitos) — Na sequência de fases ACB (negativa), se $\\dot{V}_{AN} = V\\angle\\theta$, qual é o ângulo de $\\dot{V}_{BN}$?",
      verso: "Na sequência ACB, a fase C atrasa $120^\\circ$ de A e a fase B **ADIANTA $120^\\circ$** de A:\n$$\\dot{V}_{BN} = V\\angle(\\theta + 120^\\circ)$$"
    },
    {
      frente: "Bloco 7 (Controle) — Dada $G(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}$, cuidado com o coeficiente de $s^2$! Se $G(s) = \\frac{200}{2s^2 + 8s + 200}$, quanto vale $\\zeta$?",
      verso: "Divida numerador e denominador por 2 primeiro!\n$$G(s) = \\frac{100}{s^2 + 4s + 100} \\implies \\omega_n = 10\\text{ rad/s} \\;\\text{ e }\\; 2\\zeta(10) = 4 \\implies \\zeta = 0,2$$"
    },
    {
      frente: "Bloco 8 (NR-10) — Qual é a sequência oficial dos 6 passos de Desenergização (item 10.5.1)?",
      verso: "Mnemônico **S-I-C-A-P-S**:\n1. **S**eccionamento\n2. **I**mpedimento de reenergização\n3. **C**onstatação da ausência de tensão\n4. Instalação de **A**terramento temporário com equipotencialização\n5. **P**roteção dos elementos energizados na zona controlada\n6. **S**inalização de impedimento de reenergização."
    },
    {
      frente: "Bloco 8 (Lei 14.133/2021) — Qual a modalidade obrigatória para bens e serviços comuns (ex: EPIs, EPCs, ferramentas) e a diferença entre Contratação Integrada e Semi-integrada?",
      verso: "• Bens/serviços comuns: **PREGÃO**.\n• **Contratação Integrada:** contratado elabora os projetos **BÁSICO e EXECUTIVO**.\n• **Semi-integrada:** contratado elabora apenas o projeto **EXECUTIVO**."
    }
  ];

  let currentFlashcardIdx = 0;
  let flashcardShowingBack = false;

  function getTodayOrNextPlanDay() {
    const plano = window.PLANO_30_DIAS || [];
    // Prioriza sempre o primeiro dia ainda não concluído na fila sequencial,
    // garantindo que nenhum conteúdo essencial fique para trás caso você falte algum dia!
    const nextPending = plano.find((d) => !state.completedDays.includes(d.dia));
    return nextPending || plano[plano.length - 1] || plano[0];
  }

  function getOverdueDays() {
    const plano = window.PLANO_30_DIAS || [];
    const todayISO = new Date().toISOString().slice(0, 10);
    return plano.filter(
      (d) => d.dataISO < todayISO && !state.completedDays.includes(d.dia)
    );
  }

  function startCustomTimer(minutes) {
    clearInterval(timerInterval);
    timerSeconds = minutes * 60;
    timerRunning = false;
    toggleTimer();
  }

  function renderDashboard() {
    const plano = window.PLANO_30_DIAS || [];
    const daysDone = state.completedDays.length;
    const hoursStudied = (daysDone * 0.5).toFixed(1).replace(".0", "");

    const answeredValues = Object.values(state.answeredQuestions);
    const totalAnswered = answeredValues.length;
    const totalCorrect = answeredValues.filter((a) => a.correct).length;
    const accuracy =
      totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Atualiza cards de estatísticas
    const statDays = document.getElementById("stat-days-val");
    const statDaysSub = document.getElementById("stat-days-sub");
    if (statDays) statDays.textContent = daysDone + " / " + plano.length;
    if (statDaysSub)
      statDaysSub.textContent =
        hoursStudied + "h acumuladas (meta: 15h em 30 dias)";

    const statQ = document.getElementById("stat-questions-val");
    const statQSub = document.getElementById("stat-questions-sub");
    if (statQ) statQ.textContent = totalAnswered + " / " + TODAS_QUESTOES.length;
    if (statQSub)
      statQSub.textContent =
        totalCorrect + " acertos (" + accuracy + "% de aproveitamento)";

    const statT = document.getElementById("stat-theory-val");
    const statTSub = document.getElementById("stat-theory-sub");
    const totalTeoria = (window.DADOS_TEORIA || []).length;
    if (statT) statT.textContent = state.studiedTheory.length + " / " + totalTeoria;
    if (statTSub)
      statTSub.textContent =
        "8 Blocos de Eng. Elétrica + Português + Inglês";

    // Card da Missão de Hoje (30 minutos) + Detector de Dias Perdidos
    const missionDay = getTodayOrNextPlanDay();
    const overdueDays = getOverdueDays();
    const heroContainer = document.getElementById("hero-mission-container");
    if (heroContainer && missionDay) {
      const isDone = state.completedDays.includes(missionDay.dia);
      const overdueBannerHTML =
        overdueDays.length > 0
          ? `<div style="background:rgba(251,191,36,0.14);border:1px solid var(--accent-yellow);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:0.85rem;">
               <strong>🔄 Replanejamento Automático Ativo (${overdueDays.length} dia(s) acumulado(s)):</strong>
               Nenhum conteúdo foi perdido! O sistema colocou o <strong>Dia ${missionDay.dia}</strong> na sua vez de hoje e usará os <strong>4 Dias Coringa (Dias 27 a 30)</strong> como margem de segurança, ou você pode usar abaixo o <strong>Modo Express (15m)</strong> ou <strong>Diluição (+10m = 40m)</strong>.
             </div>`
          : "";

      heroContainer.innerHTML = `
        <div class="hero-mission">
          <div class="hero-mission-content">
            ${overdueBannerHTML}
            <span class="mission-tag">⚡ Próxima Missão da Fila • Dia ${missionDay.dia} de 30 (Ref: ${missionDay.data} — ${missionDay.diaSemana})</span>
            <h3>${missionDay.titulo}</h3>
            <p><strong>${missionDay.bloco}</strong> • ${missionDay.fase}</p>
            <div class="mission-steps-pills">
              <div class="step-pill"><strong>⏱️ 10 min Teoria:</strong> ${missionDay.focoTeoria}</div>
              <div class="step-pill"><strong>✍️ 15 min Questões:</strong> Questões ${missionDay.questoesIds.map((id) => "#" + id).join(", ")}</div>
              <div class="step-pill"><strong>🔄 5 min Revisão:</strong> ${missionDay.focoRevisao}</div>
            </div>
          </div>
          <div class="hero-mission-actions">
            <button class="btn btn-yellow" id="hero-btn-start-timer">▶️ Iniciar Sessão Padrão (30 min)</button>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-secondary btn-sm" style="flex:1;" id="hero-btn-express-15" title="Sem tempo hoje? Faça só os 15 min de questões comentadas!">⚡ Express 15m</button>
              <button class="btn btn-secondary btn-sm" style="flex:1;" id="hero-btn-recover-40" title="Recuperar atraso diluindo +10 min hoje (40 min)">🔥 Diluir 40m</button>
            </div>
            <button class="btn btn-primary" id="hero-btn-open-theory">📖 1. Ler Teoria (10 min)</button>
            <button class="btn btn-secondary" id="hero-btn-open-questions">✍️ 2. Resolver ${missionDay.questoesIds.length} Questões (15 min)</button>
            <button class="btn ${isDone ? "btn-secondary" : "btn-primary"}" id="hero-btn-toggle-day">
              ${isDone ? "✅ Dia " + missionDay.dia + " Concluído (Desmarcar)" : "☑️ Marcar Dia " + missionDay.dia + " como Concluído"}
            </button>
          </div>
        </div>
      `;

      document
        .getElementById("hero-btn-start-timer")
        .addEventListener("click", function () {
          startCustomTimer(30);
        });
      document
        .getElementById("hero-btn-express-15")
        .addEventListener("click", function () {
          startCustomTimer(15);
          openQuestionsForDay(missionDay);
        });
      document
        .getElementById("hero-btn-recover-40")
        .addEventListener("click", function () {
          startCustomTimer(40);
        });
      document
        .getElementById("hero-btn-open-theory")
        .addEventListener("click", function () {
          openTheoryModule(missionDay.teoriaId);
        });
      document
        .getElementById("hero-btn-open-questions")
        .addEventListener("click", function () {
          openQuestionsForDay(missionDay);
        });
      document
        .getElementById("hero-btn-toggle-day")
        .addEventListener("click", function () {
          toggleDayCompletion(missionDay.dia);
          renderDashboard();
        });
    }

    // Tabela Raio-X da Prova Anterior (2023.2)
    const raioxTbody = document.getElementById("raiox-tbody");
    if (raioxTbody && window.DADOS_EDITAL) {
      raioxTbody.innerHTML = window.DADOS_EDITAL.raioxProva2023
        .map((item) => {
          let badgeClass = "badge-blue";
          if (item.prioridade === "Altíssima") badgeClass = "badge-danger";
          else if (item.prioridade === "Alta") badgeClass = "badge-yellow";
          else if (item.prioridade.includes("Essencial")) badgeClass = "badge-green";

          return `
            <tr>
              <td><strong>${item.bloco}</strong></td>
              <td><strong>${item.qtd} questões</strong></td>
              <td>
                <div style="display:flex;align-items:center;gap:8px;">
                  <div class="progress-bar-bg" style="width:80px;height:6px;">
                    <div class="progress-bar-fill" style="width:${Math.min(100, item.percentual * 3)}%"></div>
                  </div>
                  <span>${item.percentual}%</span>
                </div>
              </td>
              <td><span class="badge ${badgeClass}">${item.prioridade}</span></td>
              <td style="font-size:0.8rem;color:var(--text-muted);">${item.questoes2023}</td>
            </tr>
          `;
        })
        .join("");
    }

    // Bloco de notas pessoais
    const notesTextarea = document.getElementById("personal-notes-area");
    if (notesTextarea && notesTextarea.value !== state.personalNotes) {
      notesTextarea.value = state.personalNotes || "";
    }

    renderBlockPerformance();
    renderFlashcardUI();
  }

  function renderBlockPerformance() {
    const tbody = document.getElementById("block-performance-tbody");
    if (!tbody) return;
    const modulos = window.DADOS_TEORIA || [];
    tbody.innerHTML = modulos
      .map((m) => {
        const qs = TODAS_QUESTOES.filter((q) => q.bloco === m.id);
        const solved = qs.filter((q) => state.answeredQuestions[q.id]);
        const right = solved.filter((q) => state.answeredQuestions[q.id].correct);
        const pct =
          solved.length > 0 ? Math.round((right.length / solved.length) * 100) : 0;

        let badgeClass = "badge-blue";
        if (solved.length > 0) {
          badgeClass =
            pct >= 70 ? "badge-green" : pct >= 50 ? "badge-yellow" : "badge-danger";
        }

        return `
          <tr>
            <td><strong>${m.titulo}</strong></td>
            <td>${solved.length} / ${qs.length}</td>
            <td>${right.length}</td>
            <td><span class="badge ${badgeClass}">${solved.length > 0 ? pct + "%" : "—"}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" data-dash-filter-bloco="${m.id}">Praticar</button>
            </td>
          </tr>
        `;
      })
      .join("");

    tbody.querySelectorAll("[data-dash-filter-bloco]").forEach((btn) => {
      btn.addEventListener("click", function () {
        customQuestionIdsFilter = null;
        const bId = this.getAttribute("data-dash-filter-bloco");
        const sel = document.getElementById("filter-q-bloco");
        if (sel) sel.value = bId;
        switchTab("questoes");
      });
    });
  }

  function renderFlashcardUI() {
    const card = FLASHCARDS_REVISAO[currentFlashcardIdx];
    if (!card) return;
    const badge = document.getElementById("flashcard-counter-badge");
    const sideLabel = document.getElementById("flashcard-side-label");
    const textEl = document.getElementById("flashcard-text");
    const box = document.getElementById("flashcard-box");

    if (badge)
      badge.textContent = `Card ${currentFlashcardIdx + 1} / ${FLASHCARDS_REVISAO.length}`;
    if (sideLabel) {
      sideLabel.textContent = flashcardShowingBack
        ? "✅ VERSO • RESPOSTA / FÓRMULA OFICIAL"
        : "❓ FRENTE • PERGUNTA (CLIQUE PARA VIRAR)";
      sideLabel.style.color = flashcardShowingBack
        ? "var(--accent-green)"
        : "var(--accent-yellow)";
    }
    if (box) {
      box.style.borderColor = flashcardShowingBack
        ? "var(--accent-green)"
        : "var(--accent-blue)";
    }
    if (textEl) {
      textEl.innerHTML = formatRichText(
        flashcardShowingBack ? card.verso : card.frente
      );
    }
  }

  // =========================================================================
  // ABA 2: PLANEJAMENTO DE 30 DIAS (30 MINUTOS POR DIA)
  // =========================================================================
  function toggleDayCompletion(diaNum) {
    const idx = state.completedDays.indexOf(diaNum);
    if (idx >= 0) {
      state.completedDays.splice(idx, 1);
    } else {
      state.completedDays.push(diaNum);
    }
    saveState();
  }

  function openTheoryModule(teoriaId) {
    currentTheoryId = teoriaId || "bloco4";
    switchTab("teoria");
  }

  function openQuestionsForDay(dayObj) {
    customQuestionIdsFilter = dayObj.questoesIds.slice();
    customFilterLabel = `Dia ${dayObj.dia} (${dayObj.titulo})`;
    switchTab("questoes");
  }

  function renderPlano30Dias() {
    const grid = document.getElementById("days-grid-container");
    if (!grid) return;

    const plano = window.PLANO_30_DIAS || [];
    const todayISO = new Date().toISOString().slice(0, 10);

    const filtered = plano.filter((d) => {
      if (currentPlanFilter === "pendentes")
        return !state.completedDays.includes(d.dia);
      if (currentPlanFilter === "concluidos")
        return state.completedDays.includes(d.dia);
      if (currentPlanFilter === "semana1") return d.dia >= 1 && d.dia <= 7;
      if (currentPlanFilter === "semana2") return d.dia >= 8 && d.dia <= 15;
      if (currentPlanFilter === "semana3") return d.dia >= 16 && d.dia <= 22;
      if (currentPlanFilter === "semana4") return d.dia >= 23 && d.dia <= 30;
      return true;
    });

    grid.innerHTML = filtered
      .map((d) => {
        const isCompleted = state.completedDays.includes(d.dia);
        const isToday = d.dataISO === todayISO;
        return `
          <div class="day-card ${isCompleted ? "completed" : ""} ${isToday ? "today" : ""}">
            <div>
              <div class="day-card-header">
                <div>
                  <span class="day-number">DIA ${d.dia} DE 30 ${isToday ? "• 🌟 HOJE" : ""}</span>
                  <div class="day-date">📅 ${d.data} (${d.diaSemana})</div>
                </div>
                <span class="badge ${isCompleted ? "badge-green" : "badge-yellow"}">
                  ${isCompleted ? "✓ Concluído" : "⏱️ 30 min"}
                </span>
              </div>
              <div style="margin-bottom:6px;">
                <span class="badge badge-blue">${d.bloco}</span>
              </div>
              <div class="day-title">${d.titulo}</div>
              <div class="day-breakdown">
                <div class="day-breakdown-item">
                  <span class="time-pill">10 min</span>
                  <div><strong>Teoria:</strong> ${d.focoTeoria}</div>
                </div>
                <div class="day-breakdown-item">
                  <span class="time-pill">15 min</span>
                  <div><strong>Prática:</strong> Resolver Questões <strong>${d.questoesIds.map((q) => "Q" + q).join(", ")}</strong></div>
                </div>
                <div class="day-breakdown-item">
                  <span class="time-pill">05 min</span>
                  <div><strong>Revisão:</strong> ${d.focoRevisao}</div>
                </div>
              </div>
            </div>
            <div class="day-actions">
              <label class="check-day-label">
                <input type="checkbox" data-check-day="${d.dia}" ${isCompleted ? "checked" : ""}>
                Concluído
              </label>
              <div style="margin-left:auto;display:flex;gap:6px;">
                <button class="btn btn-secondary btn-sm" data-goto-theory="${d.teoriaId}">📖 Teoria</button>
                <button class="btn btn-primary btn-sm" data-goto-questions="${d.dia}">✍️ Questões (${d.questoesIds.length})</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // Eventos dos cards
    grid.querySelectorAll("[data-check-day]").forEach((chk) => {
      chk.addEventListener("change", function () {
        const dia = parseInt(this.getAttribute("data-check-day"), 10);
        toggleDayCompletion(dia);
        renderPlano30Dias();
      });
    });

    grid.querySelectorAll("[data-goto-theory]").forEach((btn) => {
      btn.addEventListener("click", function () {
        openTheoryModule(this.getAttribute("data-goto-theory"));
      });
    });

    grid.querySelectorAll("[data-goto-questions]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const dia = parseInt(this.getAttribute("data-goto-questions"), 10);
        const dayObj = plano.find((item) => item.dia === dia);
        if (dayObj) openQuestionsForDay(dayObj);
      });
    });
  }

  // =========================================================================
  // ABA 3: APOSTILA TEÓRICA & CONTEÚDOS EXPLICADOS
  // =========================================================================
  function renderTeoria() {
    const modulos = window.DADOS_TEORIA || [];
    const sidebarEl = document.getElementById("theory-topics-list");
    const contentEl = document.getElementById("theory-content-view");
    if (!sidebarEl || !contentEl || modulos.length === 0) return;

    const activeMod =
      modulos.find((m) => m.id === currentTheoryId) || modulos[0];

    sidebarEl.innerHTML = modulos
      .map((m) => {
        const isStudied = state.studiedTheory.includes(m.id);
        const isActive = m.id === activeMod.id;
        return `
          <button class="theory-topic-btn ${isActive ? "active" : ""}" data-theory-id="${m.id}">
            <div style="flex:1;">
              <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">${m.codigo}</div>
              <div>${m.titulo}</div>
            </div>
            <span class="badge ${isStudied ? "badge-green" : "badge-yellow"}">
              ${isStudied ? "✓ Lido" : m.prioridade}
            </span>
          </button>
        `;
      })
      .join("");

    sidebarEl.querySelectorAll("[data-theory-id]").forEach((btn) => {
      btn.addEventListener("click", function () {
        currentTheoryId = this.getAttribute("data-theory-id");
        renderTeoria();
      });
    });

    // Em smartphones/tablets, centraliza automaticamente o chip ativo na barra horizontal
    const activeChip = sidebarEl.querySelector(".theory-topic-btn.active");
    if (activeChip && window.innerWidth <= 1024 && activeChip.scrollIntoView) {
      try {
        activeChip.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      } catch (e) {
        // ignora
      }
    }

    const isStudied = state.studiedTheory.includes(activeMod.id);
    const relatedCount = TODAS_QUESTOES.filter(
      (q) => q.bloco === activeMod.id
    ).length;

    contentEl.innerHTML = `
      <div class="theory-header">
        <div>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;flex-wrap:wrap;">
            <span class="badge badge-blue">${activeMod.codigo}</span>
            <span class="badge badge-yellow">📊 Incidência: ${activeMod.pesoProva}</span>
            <span class="badge ${isStudied ? "badge-green" : "badge-purple"}">
              ${isStudied ? "✅ Módulo Estudado" : "📌 Prioridade: " + activeMod.prioridade}
            </span>
          </div>
          <h2 style="font-size:1.45rem;font-weight:800;">${activeMod.titulo}</h2>
          <p style="font-size:0.84rem;color:var(--text-muted);margin-top:4px;">
            <strong>Tópicos do Anexo IV do Edital 2026.4:</strong> ${activeMod.subtopicosEdital}
          </p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn ${isStudied ? "btn-secondary" : "btn-primary"} btn-sm" id="btn-toggle-studied-theory">
            ${isStudied ? "✅ Marcar como Não Lido" : "☑️ Marcar Módulo como Estudado"}
          </button>
          <button class="btn btn-yellow btn-sm" id="btn-practice-block-questions">
            ✍️ Resolver ${relatedCount} Questões deste Bloco
          </button>
        </div>
      </div>
      <div class="theory-body">
        ${activeMod.conteudoHTML}
      </div>
    `;

    // Renderiza todas as fórmulas LaTeX ($...$ e $$...$$) dentro da apostila teórica
    typesetMathInElement(contentEl);

    document
      .getElementById("btn-toggle-studied-theory")
      .addEventListener("click", function () {
        const idx = state.studiedTheory.indexOf(activeMod.id);
        if (idx >= 0) state.studiedTheory.splice(idx, 1);
        else state.studiedTheory.push(activeMod.id);
        saveState();
        renderTeoria();
      });

    document
      .getElementById("btn-practice-block-questions")
      .addEventListener("click", function () {
        customQuestionIdsFilter = null;
        customFilterLabel = "";
        const selBloco = document.getElementById("filter-q-bloco");
        if (selBloco) selBloco.value = activeMod.id;
        switchTab("questoes");
      });
  }

  // =========================================================================
  // ABA 4: BANCO DE QUESTÕES COMENTADAS (85 QUESTÕES)
  // =========================================================================
  function renderQuestoes() {
    const listContainer = document.getElementById("questions-list-container");
    const summaryBanner = document.getElementById("questions-filter-summary");
    if (!listContainer) return;

    const searchVal = (
      document.getElementById("filter-q-search")?.value || ""
    )
      .trim()
      .toLowerCase();
    const blocoVal = document.getElementById("filter-q-bloco")?.value || "todos";
    const origemVal =
      document.getElementById("filter-q-origem")?.value || "todas";
    const statusVal =
      document.getElementById("filter-q-status")?.value || "todas";

    const filtered = TODAS_QUESTOES.filter((q) => {
      if (customQuestionIdsFilter && customQuestionIdsFilter.length > 0) {
        if (!customQuestionIdsFilter.includes(q.id)) return false;
      } else {
        if (blocoVal !== "todos" && q.bloco !== blocoVal) return false;
        if (origemVal === "2023" && q.numero > 70) return false;
        if (origemVal === "ineditas" && q.numero <= 70) return false;

        const ans = state.answeredQuestions[q.id];
        if (statusVal === "nao_respondidas" && ans) return false;
        if (statusVal === "acertos" && (!ans || !ans.correct)) return false;
        if (statusVal === "erros" && (!ans || ans.correct)) return false;
        if (
          statusVal === "favoritas" &&
          !state.bookmarkedQuestions.includes(q.id)
        )
          return false;
      }

      if (searchVal) {
        const hay = (
          "q" +
          q.numero +
          " " +
          q.disciplina +
          " " +
          q.assunto +
          " " +
          q.enunciado +
          " " +
          q.comentario
        ).toLowerCase();
        if (!hay.includes(searchVal)) return false;
      }
      return true;
    });

    if (summaryBanner) {
      if (customQuestionIdsFilter) {
        summaryBanner.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:var(--accent-green-soft);border:1px solid var(--accent-green);padding:10px 16px;border-radius:8px;margin-bottom:16px;">
            <span>🎯 Exibindo as <strong>${filtered.length} questões selecionadas</strong> para a meta: <strong>${customFilterLabel}</strong></span>
            <button class="btn btn-secondary btn-sm" id="btn-clear-day-filter">✕ Mostrar Todas as 85 Questões</button>
          </div>
        `;
        document
          .getElementById("btn-clear-day-filter")
          .addEventListener("click", function () {
            customQuestionIdsFilter = null;
            customFilterLabel = "";
            renderQuestoes();
          });
      } else {
        summaryBanner.innerHTML = `
          <div style="margin-bottom:14px;font-size:0.88rem;color:var(--text-muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <span>Exibindo <strong>${filtered.length}</strong> de <strong>${TODAS_QUESTOES.length}</strong> questões disponíveis (70 da Prova 2023.2 + 15 Inéditas 2026.4).</span>
            <span>💡 Clique em uma alternativa (A a E) para corrigir automaticamente e abrir a resolução passo a passo!</span>
          </div>
        `;
      }
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="card" style="text-align:center;padding:40px;">
          <h3>Nenhuma questão encontrada com os filtros atuais</h3>
          <p style="color:var(--text-muted);margin:8px 0 16px;">Tente limpar a busca ou selecionar "Todas" nos filtros acima.</p>
          <button class="btn btn-primary" id="btn-reset-all-q-filters">Limpar Filtros</button>
        </div>
      `;
      document
        .getElementById("btn-reset-all-q-filters")
        .addEventListener("click", function () {
          customQuestionIdsFilter = null;
          document.getElementById("filter-q-search").value = "";
          document.getElementById("filter-q-bloco").value = "todos";
          document.getElementById("filter-q-origem").value = "todas";
          document.getElementById("filter-q-status").value = "todas";
          renderQuestoes();
        });
      return;
    }

    listContainer.innerHTML = filtered
      .map((q) => buildQuestionCardHTML(q))
      .join("");

    // Eventos das questões
    listContainer.querySelectorAll("[data-q-option]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qId = parseInt(this.getAttribute("data-q-id"), 10);
        const letter = this.getAttribute("data-q-option");
        handleAnswerQuestion(qId, letter);
      });
    });

    listContainer.querySelectorAll("[data-q-bookmark]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qId = parseInt(this.getAttribute("data-q-bookmark"), 10);
        const idx = state.bookmarkedQuestions.indexOf(qId);
        if (idx >= 0) state.bookmarkedQuestions.splice(idx, 1);
        else state.bookmarkedQuestions.push(qId);
        saveState();
        renderQuestoes();
      });
    });

    listContainer.querySelectorAll("[data-q-toggle-exp]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qId = this.getAttribute("data-q-toggle-exp");
        const expBox = document.getElementById("exp-box-" + qId);
        if (expBox) expBox.classList.toggle("visible");
      });
    });

    listContainer.querySelectorAll("[data-q-reset]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qId = parseInt(this.getAttribute("data-q-reset"), 10);
        delete state.answeredQuestions[qId];
        saveState();
        renderQuestoes();
      });
    });
  }

  function buildQuestionCardHTML(q) {
    const ans = state.answeredQuestions[q.id];
    const isBookmarked = state.bookmarkedQuestions.includes(q.id);
    const textoBase =
      q.textoBaseId && window.TEXTOS_BASE
        ? window.TEXTOS_BASE[q.textoBaseId]
        : null;

    let baseTextHTML = "";
    if (textoBase) {
      baseTextHTML = `
        <details class="base-text-Toggle">
          <summary>📄 Ler ${textoBase.titulo} (Clique para expandir/recolher)</summary>
          <div class="base-text-body">
            ${textoBase.paragrafos.map((p) => `<p style="margin-bottom:8px;">${p}</p>`).join("")}
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:8px;"><em>${textoBase.autor}</em></div>
          </div>
        </details>
      `;
    }

    const optionsHTML = ["A", "B", "C", "D", "E"]
      .map((letter) => {
        let btnClass = "option-btn";
        if (ans) {
          if (letter === q.correta) btnClass += " correct";
          else if (letter === ans.selected && !ans.correct) btnClass += " wrong";
        }
        return `
          <button class="${btnClass}" data-q-id="${q.id}" data-q-option="${letter}">
            <span class="option-letter">${letter}</span>
            <span style="flex:1;">${formatRichText(q.alternativas[letter])}</span>
          </button>
        `;
      })
      .join("");

    return `
      <div class="question-card" id="q-card-${q.id}">
        <div class="question-meta">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="question-num">Questão #${String(q.numero).padStart(2, "0")}</span>
            <span class="badge ${q.numero <= 70 ? "badge-green" : "badge-purple"}">${q.origem}</span>
            <span class="badge badge-blue">${q.disciplina}</span>
            <span class="badge badge-yellow">${q.assunto}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            ${
              ans
                ? `<span class="badge ${ans.correct ? "badge-green" : "badge-danger"}">${
                    ans.correct ? "✓ Acertou (" + ans.selected + ")" : "✗ Errou (Marcou " + ans.selected + " | Gab: " + q.correta + ")"
                  }</span>`
                : ""
            }
            <button class="btn btn-secondary btn-sm" data-q-bookmark="${q.id}" title="Salvar no Caderno de Revisão">
              ${isBookmarked ? "⭐ Favorita" : "☆ Favoritar"}
            </button>
          </div>
        </div>
        ${baseTextHTML}
        ${q.svgDiagrama ? `<div style="margin:10px 0;">${q.svgDiagrama}</div>` : ""}
        <div class="question-statement">${formatRichText(q.enunciado)}</div>
        <div class="options-list">
          ${optionsHTML}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <button class="btn btn-secondary btn-sm" data-q-toggle-exp="${q.id}">
            💡 Ver / Ocultar Gabarito e Resolução Comentada
          </button>
          ${
            ans
              ? `<button class="btn btn-secondary btn-sm" data-q-reset="${q.id}">🔄 Refazer Questão</button>`
              : ""
          }
        </div>
        <div class="explanation-box ${ans ? "visible" : ""}" id="exp-box-${q.id}">
          <h4>✅ Gabarito Oficial: Alternativa (${q.correta})</h4>
          <div>${formatRichText(q.comentario)}</div>
        </div>
      </div>
    `;
  }

  function handleAnswerQuestion(qId, selectedLetter) {
    const q = TODAS_QUESTOES.find((item) => item.id === qId);
    if (!q) return;
    const isCorrect = selectedLetter === q.correta;
    state.answeredQuestions[qId] = {
      selected: selectedLetter,
      correct: isCorrect,
      timestamp: Date.now()
    };
    saveState();

    // Re-renderiza apenas o card clicado para manter a rolagem suave
    const cardEl = document.getElementById("q-card-" + qId);
    if (cardEl) {
      const temp = document.createElement("div");
      temp.innerHTML = buildQuestionCardHTML(q);
      const newCard = temp.firstElementChild;
      cardEl.replaceWith(newCard);

      // Reatribui listeners ao novo card
      newCard.querySelectorAll("[data-q-option]").forEach((btn) => {
        btn.addEventListener("click", function () {
          handleAnswerQuestion(
            parseInt(this.getAttribute("data-q-id"), 10),
            this.getAttribute("data-q-option")
          );
        });
      });
      newCard
        .querySelector("[data-q-bookmark]")
        ?.addEventListener("click", function () {
          const idx = state.bookmarkedQuestions.indexOf(qId);
          if (idx >= 0) state.bookmarkedQuestions.splice(idx, 1);
          else state.bookmarkedQuestions.push(qId);
          saveState();
          renderQuestoes();
        });
      newCard
        .querySelector("[data-q-toggle-exp]")
        ?.addEventListener("click", function () {
          document
            .getElementById("exp-box-" + qId)
            ?.classList.toggle("visible");
        });
      newCard
        .querySelector("[data-q-reset]")
        ?.addEventListener("click", function () {
          delete state.answeredQuestions[qId];
          saveState();
          renderQuestoes();
        });
    }
  }

  // =========================================================================
  // ABA 5: SIMULADO CRONOMETRADO & CALCULADORA DE HABILITAÇÃO/CORTE
  // =========================================================================
  function renderSimuladoTab() {
    updateCutoffCalculator();
    renderSimuladoHistory();
  }

  function startSimulado(mode) {
    clearInterval(simuladoTimerInterval);
    let questionsPool = [];
    let durationMinutes = 30;
    let title = "";

    const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);

    if (mode === "rapido10") {
      // 7 específicas + 2 português + 1 inglês = 10 questões em 30 min
      const esp = shuffle(
        TODAS_QUESTOES.filter(
          (q) => q.bloco !== "portugues" && q.bloco !== "ingles"
        )
      ).slice(0, 7);
      const pt = shuffle(
        TODAS_QUESTOES.filter((q) => q.bloco === "portugues")
      ).slice(0, 2);
      const en = shuffle(
        TODAS_QUESTOES.filter((q) => q.bloco === "ingles")
      ).slice(0, 1);
      questionsPool = [].concat(pt, en, esp);
      durationMinutes = 30;
      title = "Mini-Simulado Diário (10 Questões • 30 min)";
    } else if (mode === "especificas20") {
      questionsPool = shuffle(
        TODAS_QUESTOES.filter(
          (q) => q.bloco !== "portugues" && q.bloco !== "ingles"
        )
      ).slice(0, 20);
      durationMinutes = 60;
      title = "Simulado Foco Conhecimentos Específicos (20 Questões • 60 min)";
    } else {
      // Prova 2023.2 Completa (70 questões em 4h30min = 270 min)
      questionsPool = TODAS_QUESTOES.filter((q) => q.numero <= 70);
      durationMinutes = 270;
      title = "Simulado Oficial Completo — Prova Transpetro 2023.2 (70 Questões • 4h30min)";
    }

    activeSimulado = {
      title: title,
      questions: questionsPool,
      answers: {}, // { [qId]: 'A'..'E' }
      remainingSeconds: durationMinutes * 60,
      finished: false
    };

    renderActiveSimulado();

    simuladoTimerInterval = setInterval(function () {
      if (!activeSimulado || activeSimulado.finished) {
        clearInterval(simuladoTimerInterval);
        return;
      }
      if (activeSimulado.remainingSeconds > 0) {
        activeSimulado.remainingSeconds--;
        const timerEl = document.getElementById("simulado-live-timer");
        if (timerEl) {
          const m = Math.floor(activeSimulado.remainingSeconds / 60);
          const s = activeSimulado.remainingSeconds % 60;
          timerEl.textContent =
            String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        }
      } else {
        finishSimulado();
      }
    }, 1000);
  }

  function renderActiveSimulado() {
    const container = document.getElementById("simulado-stage-container");
    if (!container || !activeSimulado) return;

    const m = Math.floor(activeSimulado.remainingSeconds / 60);
    const s = activeSimulado.remainingSeconds % 60;

    if (!activeSimulado.finished) {
      container.innerHTML = `
        <div class="card" style="border:2px solid var(--accent-yellow);margin-bottom:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <span class="badge badge-yellow">🔥 Simulado em Andamento</span>
              <h3 style="margin-top:4px;">${activeSimulado.title}</h3>
            </div>
            <div style="display:flex;align-items:center;gap:14px;">
              <div style="font-size:1.6rem;font-weight:800;color:var(--accent-yellow);font-variant-numeric:tabular-nums;" id="simulado-live-timer">
                ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}
              </div>
              <button class="btn btn-primary" id="btn-finish-simulado">🏁 Finalizar e Corrigir Simulado</button>
            </div>
          </div>
        </div>
        ${activeSimulado.questions
          .map((q, idx) => {
            const chosen = activeSimulado.answers[q.id];
            return `
              <div class="question-card">
                <div class="question-meta">
                  <span class="question-num">Questão ${idx + 1} de ${activeSimulado.questions.length} (Ref. #${q.numero})</span>
                  <span class="badge badge-blue">${q.disciplina} — ${q.assunto}</span>
                </div>
                ${q.svgDiagrama ? `<div style="margin:10px 0;">${q.svgDiagrama}</div>` : ""}
                <div class="question-statement">${formatRichText(q.enunciado)}</div>
                <div class="options-list">
                  ${["A", "B", "C", "D", "E"]
                    .map(
                      (letter) => `
                    <button class="option-btn ${chosen === letter ? "selected" : ""}" data-sim-q="${q.id}" data-sim-opt="${letter}">
                      <span class="option-letter">${letter}</span>
                      <span style="flex:1;">${formatRichText(q.alternativas[letter])}</span>
                    </button>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `;
          })
          .join("")}
      `;

      document
        .getElementById("btn-finish-simulado")
        .addEventListener("click", finishSimulado);

      container.querySelectorAll("[data-sim-opt]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const qId = parseInt(this.getAttribute("data-sim-q"), 10);
          const opt = this.getAttribute("data-sim-opt");
          activeSimulado.answers[qId] = opt;
          renderActiveSimulado();
        });
      });
    } else {
      // Resultado do simulado finalizado
      let correctCount = 0;
      activeSimulado.questions.forEach((q) => {
        const chosen = activeSimulado.answers[q.id];
        const isRight = chosen === q.correta;
        if (isRight) correctCount++;
        if (chosen) {
          state.answeredQuestions[q.id] = {
            selected: chosen,
            correct: isRight,
            timestamp: Date.now()
          };
        }
      });
      saveState();

      const pct = Math.round(
        (correctCount / activeSimulado.questions.length) * 100
      );

      container.innerHTML = `
        <div class="card" style="border:2px solid var(--accent-green);margin-bottom:20px;">
          <h3>🏆 Resultado do Simulado: ${correctCount} / ${activeSimulado.questions.length} acertos (${pct}%)</h3>
          <p style="color:var(--text-secondary);margin-top:6px;">
            Todas as respostas foram registradas nas suas estatísticas e as resoluções comentadas estão liberadas abaixo.
          </p>
        </div>
        ${activeSimulado.questions.map((q) => buildQuestionCardHTML(q)).join("")}
      `;
    }
  }

  function finishSimulado() {
    if (!activeSimulado || activeSimulado.finished) return;
    clearInterval(simuladoTimerInterval);
    activeSimulado.finished = true;

    let correctCount = 0;
    activeSimulado.questions.forEach((q) => {
      if (activeSimulado.answers[q.id] === q.correta) correctCount++;
    });

    state.simuladoHistory.unshift({
      date: new Date().toLocaleDateString("pt-BR"),
      title: activeSimulado.title,
      score: correctCount,
      total: activeSimulado.questions.length,
      pct: Math.round((correctCount / activeSimulado.questions.length) * 100)
    });
    saveState();
    renderActiveSimulado();
    renderSimuladoHistory();
  }

  function renderSimuladoHistory() {
    const tbody = document.getElementById("simulado-history-tbody");
    if (!tbody) return;
    if (!state.simuladoHistory || state.simuladoHistory.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">Nenhum simulado finalizado ainda. Escolha um modo acima para começar!</td></tr>`;
      return;
    }
    tbody.innerHTML = state.simuladoHistory
      .slice(0, 8)
      .map(
        (h) => `
        <tr>
          <td>${h.date}</td>
          <td><strong>${h.title}</strong></td>
          <td>${h.score} / ${h.total}</td>
          <td><span class="badge ${h.pct >= 70 ? "badge-green" : h.pct >= 50 ? "badge-yellow" : "badge-danger"}">${h.pct}%</span></td>
        </tr>
      `
      )
      .join("");
  }

  // Calculadora de Habilitação e Regras de Corte (Edital 2026.4 Item 7.1.4.3 e Anexo I)
  function updateCutoffCalculator() {
    const poloIdx = parseInt(
      document.getElementById("calc-polo")?.value || "0",
      10
    );
    const modKey = document.getElementById("calc-modalidade")?.value || "AC";
    const ptsEsp = Math.min(
      50,
      Math.max(
        0,
        parseInt(document.getElementById("calc-esp")?.value || "38", 10)
      )
    );
    const ptsPt = Math.min(
      10,
      Math.max(
        0,
        parseInt(document.getElementById("calc-pt")?.value || "7", 10)
      )
    );
    const ptsEn = Math.min(
      10,
      Math.max(
        0,
        parseInt(document.getElementById("calc-en")?.value || "7", 10)
      )
    );

    const ptsGerais = ptsPt + ptsEn;
    const ptsTotal = ptsEsp + ptsGerais;

    const poloObj =
      (window.DADOS_EDITAL?.polosVagas || [])[poloIdx] ||
      window.DADOS_EDITAL.polosVagas[0];

    const vagasImed = poloObj.vagasImediatas[modKey] || 0;
    const vagasCR = poloObj.vagasMaisCR[modKey] || 0;
    const habFase1 = poloObj.habilitadosFase1[modKey] || 0;

    const motivosEliminacao = [];
    if (ptsEsp < 25)
      motivosEliminacao.push(
        "Menos de 50% (25 pts) em Conhecimentos Específicos (Fase 1)"
      );
    if (ptsGerais < 10)
      motivosEliminacao.push(
        "Menos de 50% (10 pts) na soma de Conhecimentos Gerais (Fase 2)"
      );
    if (ptsPt === 0) motivosEliminacao.push("Nota ZERO em Língua Portuguesa");
    if (ptsEn === 0) motivosEliminacao.push("Nota ZERO em Língua Inglesa");

    const resultBox = document.getElementById("calc-result-box");
    if (!resultBox) return;

    const eliminado = motivosEliminacao.length > 0;
    const competitiva = ptsEsp >= 36 && ptsTotal >= 50;

    resultBox.innerHTML = `
      <div style="padding:16px;border-radius:10px;border:1px solid ${
        eliminado
          ? "var(--danger)"
          : competitiva
            ? "var(--accent-green)"
            : "var(--accent-yellow)"
      };background:${
        eliminado
          ? "var(--danger-soft)"
          : competitiva
            ? "var(--accent-green-soft)"
            : "var(--accent-yellow-soft)"
      };">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <h4 style="font-size:1.08rem;">
            ${
              eliminado
                ? "❌ ELIMINADO PELOS CRITÉRIOS MÍNIMOS (Item 7.1.4.3)"
                : competitiva
                  ? "🏆 APTO E ALTAMENTE COMPETITIVO PARA O CORTE 2x CR!"
                  : "✅ APROVADO NOS MÍNIMOS (Atenção ao funil da Fase 1!)"
            }
          </h4>
          <span class="badge ${eliminado ? "badge-danger" : "badge-green"}" style="font-size:0.9rem;">
            Nota Final: ${ptsTotal},0 / 70,0 pts (${Math.round((ptsTotal / 70) * 100)}%)
          </span>
        </div>
        <div style="font-size:0.88rem;color:var(--text-primary);margin-bottom:8px;">
          • <strong>Fase 1 (Específicos):</strong> ${ptsEsp},0 / 50,0 pts (${ptsEsp * 2}%) &nbsp;|&nbsp;
          <strong>Fase 2 (Gerais):</strong> ${ptsGerais},0 / 20,0 pts (PT: ${ptsPt} + EN: ${ptsEn})
        </div>
        ${
          eliminado
            ? `<ul style="margin-left:18px;color:var(--danger);font-size:0.86rem;">${motivosEliminacao.map((m) => `<li>${m}</li>`).join("")}</ul>`
            : `<p style="font-size:0.85rem;color:var(--text-secondary);">
                No polo <strong>${poloObj.polo} (${modKey})</strong>: são <strong>${vagasImed} vaga(s) imediata(s)</strong>, <strong>${vagasCR} vagas totais (Vagas + CR)</strong> e apenas os <strong>${habFase1} primeiros colocados em Conhecimentos Específicos (Fase 1)</strong> avançam para a classificação final (além da regra de paridade de 50% para mulheres).
              </p>`
        }
      </div>
    `;
  }

  // =========================================================================
  // ABA 6: EDITAL 2026.4, CRONOGRAMA OFICIAL & CHECKLIST
  // =========================================================================
  function renderEditalTab() {
    const edital = window.DADOS_EDITAL;
    if (!edital) return;

    // Cronograma Oficial (Timeline)
    const timelineEl = document.getElementById("official-timeline-container");
    if (timelineEl) {
      const todayISO = new Date().toISOString().slice(0, 10);
      let nextFound = false;

      timelineEl.innerHTML = edital.cronograma
        .map((item) => {
          const isPast = item.dataISO < todayISO;
          let itemClass = "timeline-item";
          if (item.prova) itemClass += " exam-day";
          else if (isPast) itemClass += " past";
          else if (!nextFound) {
            itemClass += " next";
            nextFound = true;
          }

          return `
            <div class="${itemClass}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                <div class="timeline-date">📅 ${item.data}</div>
                <span class="badge ${
                  item.prova
                    ? "badge-danger"
                    : isPast
                      ? "badge-green"
                      : item.critico
                        ? "badge-yellow"
                        : "badge-blue"
                }">
                  ${item.prova ? "🎯 DIA DA PROVA" : isPast ? "✓ Concluído" : item.categoria}
                </span>
              </div>
              <div class="timeline-title">${item.evento}</div>
            </div>
          `;
        })
        .join("");
    }

    // Checklist interativo de véspera/dia de prova
    const checklistEl = document.getElementById("exam-checklist-container");
    if (checklistEl) {
      checklistEl.innerHTML = edital.checklistProva
        .map((ck) => {
          const checked = state.completedChecklist.includes(ck.id);
          return `
            <label style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--bg-surface);border:1px solid ${
              checked ? "var(--accent-green)" : "var(--border-color)"
            };border-radius:8px;margin-bottom:8px;cursor:pointer;">
              <input type="checkbox" data-ck-id="${ck.id}" ${checked ? "checked" : ""} style="margin-top:4px;width:17px;height:17px;accent-color:var(--accent-green);">
              <span style="font-size:0.9rem;color:${checked ? "var(--accent-green)" : "var(--text-primary)"};text-decoration:${checked ? "line-through" : "none"};">
                ${ck.item}
              </span>
            </label>
          `;
        })
        .join("");

      checklistEl.querySelectorAll("[data-ck-id]").forEach((input) => {
        input.addEventListener("change", function () {
          const id = this.getAttribute("data-ck-id");
          const idx = state.completedChecklist.indexOf(id);
          if (idx >= 0) state.completedChecklist.splice(idx, 1);
          else state.completedChecklist.push(id);
          saveState();
          renderEditalTab();
        });
      });
    }
  }

  // =========================================================================
  // TEMA CLARO / ESCURO & EXPORTAR/IMPORTAR PROGRESSO
  // =========================================================================
  function applyTheme() {
    document.body.classList.toggle("light-theme", state.theme === "light");
    const btnTheme = document.getElementById("btn-toggle-theme");
    if (btnTheme) {
      btnTheme.textContent =
        state.theme === "light" ? "🌙 Modo Escuro" : "☀️ Modo Claro";
    }
  }

  function exportProgressJSON() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(state, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "progresso_transpetro_eletrica_2026.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // =========================================================================
  // INICIALIZAÇÃO DA APLICAÇÃO
  // =========================================================================
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme();
    updateTimerUI();
    updateGlobalCounters();

    // Botões de navegação lateral e barra inferior mobile/tablet
    document.querySelectorAll(".nav-btn, .mobile-nav-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        switchTab(this.getAttribute("data-tab"));
      });
    });

    // Menu mobile e backdrop
    document
      .getElementById("btn-mobile-menu")
      ?.addEventListener("click", function () {
        const sb = document.getElementById("sidebar");
        const bd = document.getElementById("sidebar-backdrop");
        const isOpen = sb?.classList.toggle("open");
        if (bd) bd.classList.toggle("open", !!isOpen);
      });
    document
      .getElementById("btn-close-sidebar")
      ?.addEventListener("click", closeMobileSidebar);
    document
      .getElementById("sidebar-backdrop")
      ?.addEventListener("click", closeMobileSidebar);

    // Timer de 30 minutos (Sidebar e Pílula Mobile na Topbar)
    document
      .getElementById("btn-timer-toggle")
      ?.addEventListener("click", toggleTimer);
    document
      .getElementById("btn-mobile-timer-pill")
      ?.addEventListener("click", toggleTimer);
    document
      .getElementById("btn-timer-reset")
      ?.addEventListener("click", resetTimer);

    // Tema e Backup
    document
      .getElementById("btn-toggle-theme")
      ?.addEventListener("click", function () {
        state.theme = state.theme === "dark" ? "light" : "dark";
        applyTheme();
        saveState();
      });

    document
      .getElementById("btn-export-progress")
      ?.addEventListener("click", exportProgressJSON);

    document
      .getElementById("btn-import-progress")
      ?.addEventListener("click", function () {
        document.getElementById("input-import-json")?.click();
      });

    document
      .getElementById("input-import-json")
      ?.addEventListener("change", function (ev) {
        const file = ev.target.files && ev.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const imported = JSON.parse(e.target.result);
            state = Object.assign(
              {},
              JSON.parse(JSON.stringify(defaultState)),
              imported
            );
            applyTheme();
            saveState();
            switchTab(currentTab);
          } catch (err) {
            alert("Arquivo JSON inválido.");
          }
        };
        reader.readAsText(file);
      });

    // Flashcards de Revisão Rápida (5 min finais)
    const toggleFlip = function () {
      flashcardShowingBack = !flashcardShowingBack;
      renderFlashcardUI();
    };
    document
      .getElementById("flashcard-box")
      ?.addEventListener("click", toggleFlip);
    document
      .getElementById("btn-fc-flip")
      ?.addEventListener("click", toggleFlip);
    document
      .getElementById("btn-fc-prev")
      ?.addEventListener("click", function () {
        currentFlashcardIdx =
          (currentFlashcardIdx - 1 + FLASHCARDS_REVISAO.length) %
          FLASHCARDS_REVISAO.length;
        flashcardShowingBack = false;
        renderFlashcardUI();
      });
    document
      .getElementById("btn-fc-next")
      ?.addEventListener("click", function () {
        currentFlashcardIdx =
          (currentFlashcardIdx + 1) % FLASHCARDS_REVISAO.length;
        flashcardShowingBack = false;
        renderFlashcardUI();
      });

    // Notas pessoais no Dashboard
    document
      .getElementById("personal-notes-area")
      ?.addEventListener("input", function () {
        state.personalNotes = this.value;
        saveState();
      });

    // Filtros do Plano de 30 Dias
    document.querySelectorAll("[data-plan-filter]").forEach((chip) => {
      chip.addEventListener("click", function () {
        document
          .querySelectorAll("[data-plan-filter]")
          .forEach((c) => c.classList.remove("active"));
        this.classList.add("active");
        currentPlanFilter = this.getAttribute("data-plan-filter");
        renderPlano30Dias();
      });
    });

    // Filtros do Banco de Questões
    ["filter-q-search", "filter-q-bloco", "filter-q-origem", "filter-q-status"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", function () {
            customQuestionIdsFilter = null;
            renderQuestoes();
          });
          el.addEventListener("change", function () {
            customQuestionIdsFilter = null;
            renderQuestoes();
          });
        }
      }
    );

    // Botões de Simulado
    document
      .getElementById("btn-sim-rapido10")
      ?.addEventListener("click", () => startSimulado("rapido10"));
    document
      .getElementById("btn-sim-especificas20")
      ?.addEventListener("click", () => startSimulado("especificas20"));
    document
      .getElementById("btn-sim-completo70")
      ?.addEventListener("click", () => startSimulado("completo70"));

    // Calculadora de Habilitação/Corte
    ["calc-polo", "calc-modalidade", "calc-esp", "calc-pt", "calc-en"].forEach(
      (id) => {
        document
          .getElementById(id)
          ?.addEventListener("input", updateCutoffCalculator);
        document
          .getElementById(id)
          ?.addEventListener("change", updateCutoffCalculator);
      }
    );

    // =======================================================================
    // EVENTOS DO MODAL DE SINCRONIZAÇÃO NA NUVEM
    // =======================================================================
    function selectCloudProviderTab(prov) {
      cloudConfig.provider = prov;
      document.querySelectorAll("[data-cloud-provider]").forEach((btn) => {
        btn.classList.toggle(
          "active",
          btn.getAttribute("data-cloud-provider") === prov
        );
      });
      ["google", "github", "firebase"].forEach((p) => {
        const panel = document.getElementById("cloud-panel-" + p);
        if (panel) panel.style.display = p === prov ? "block" : "none";
      });
    }

    function openCloudModal() {
      const modal = document.getElementById("cloud-sync-modal");
      if (!modal) return;
      const inGas = document.getElementById("input-cloud-gas-url");
      const inGhTok = document.getElementById("input-cloud-gh-token");
      const inGhGist = document.getElementById("input-cloud-gh-gist");
      const inFb = document.getElementById("input-cloud-fb-url");

      if (inGas) inGas.value = cloudConfig.gasUrl || "";
      if (inGhTok) inGhTok.value = cloudConfig.ghToken || "";
      if (inGhGist) inGhGist.value = cloudConfig.gistId || "";
      if (inFb) inFb.value = cloudConfig.fbUrl || "";

      selectCloudProviderTab(cloudConfig.provider || "google");
      updateCloudStatusUI();
      modal.style.display = "flex";
    }

    function closeCloudModal() {
      const modal = document.getElementById("cloud-sync-modal");
      if (modal) modal.style.display = "none";
    }

    document
      .getElementById("btn-open-cloud-modal")
      ?.addEventListener("click", openCloudModal);
    document
      .getElementById("btn-topbar-cloud")
      ?.addEventListener("click", openCloudModal);
    document
      .getElementById("btn-close-cloud-modal")
      ?.addEventListener("click", closeCloudModal);
    document
      .getElementById("cloud-sync-modal")
      ?.addEventListener("click", function (ev) {
        if (ev.target === this) closeCloudModal();
      });

    document.querySelectorAll("[data-cloud-provider]").forEach((btn) => {
      btn.addEventListener("click", function () {
        selectCloudProviderTab(this.getAttribute("data-cloud-provider"));
      });
    });

    document
      .getElementById("btn-copy-gas-code")
      ?.addEventListener("click", function () {
        const gasCode = [
          "// Código Google Apps Script — Salvar Progresso Transpetro 2026.4 na Nuvem",
          "function doGet() {",
          "  var p = PropertiesService.getScriptProperties();",
          "  var n = Number(p.getProperty('CHUNKS') || 0);",
          "  var s = '';",
          "  for (var i = 0; i < n; i++) s += (p.getProperty('C_' + i) || '');",
          "  return ContentService.createTextOutput(s || '{}').setMimeType(ContentService.MimeType.JSON);",
          "}",
          "function doPost(e) {",
          "  var p = PropertiesService.getScriptProperties();",
          "  var body = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';",
          "  var chunks = Math.ceil(body.length / 7000);",
          "  var obj = { CHUNKS: String(chunks) };",
          "  for (var i = 0; i < chunks; i++) obj['C_' + i] = body.slice(i * 7000, (i + 1) * 7000);",
          "  p.setProperties(obj, true);",
          "  return ContentService.createTextOutput('{\"ok\":true}').setMimeType(ContentService.MimeType.JSON);",
          "}"
        ].join("\n");

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(gasCode).then(() => {
            this.textContent = "✅ Código Copiado! Cole em script.google.com";
            setTimeout(() => {
              this.textContent =
                "📋 1. Copiar Código do Google Apps Script (15 linhas)";
            }, 3500);
          });
        } else {
          prompt("Copie o código abaixo:", gasCode);
        }
      });

    document
      .getElementById("btn-save-cloud-config")
      ?.addEventListener("click", async function () {
        cloudConfig.gasUrl = (
          document.getElementById("input-cloud-gas-url")?.value || ""
        ).trim();
        cloudConfig.ghToken = (
          document.getElementById("input-cloud-gh-token")?.value || ""
        ).trim();
        cloudConfig.gistId = (
          document.getElementById("input-cloud-gh-gist")?.value || ""
        ).trim();
        cloudConfig.fbUrl = (
          document.getElementById("input-cloud-fb-url")?.value || ""
        ).trim();
        cloudConfig.enabled = true;

        if (!isCloudConfigured()) {
          alert(
            "Preencha a URL ou o Token do provedor escolhido antes de conectar."
          );
          return;
        }

        saveCloudConfig();
        const ok = await pullFromCloud({ silent: false });
        if (ok) {
          await pushToCloud({ silent: true });
        }
      });

    document
      .getElementById("btn-cloud-push-now")
      ?.addEventListener("click", function () {
        if (!isCloudConfigured()) {
          alert("Configure e conecte um provedor de nuvem abaixo primeiro.");
          return;
        }
        pushToCloud({ silent: false });
      });

    document
      .getElementById("btn-cloud-pull-now")
      ?.addEventListener("click", function () {
        if (!isCloudConfigured()) {
          alert("Configure e conecte um provedor de nuvem abaixo primeiro.");
          return;
        }
        pullFromCloud({ silent: false, forceOverwrite: true });
      });

    document
      .getElementById("btn-disconnect-cloud")
      ?.addEventListener("click", function () {
        cloudConfig.enabled = false;
        saveCloudConfig();
        cloudStatus.state = "unconfigured";
        cloudStatus.message = "";
        updateCloudStatusUI();
      });

    document
      .getElementById("btn-copy-bundle-with-cloud")
      ?.addEventListener("click", function () {
        if (!isCloudConfigured()) {
          alert(
            "Conecte sua nuvem primeiro (Google Script, GitHub Gist ou Firebase) para embutir a configuração no HTML do Google Sites!"
          );
          return;
        }
        const modal = document.getElementById("cloud-sync-modal");
        if (modal) modal.style.display = "none";

        let rawDoc = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
        if (modal) modal.style.display = "flex";

        // Se foi aberto a partir do index.html modular, embute os dados e o script principal automaticamente
        if (rawDoc.includes('<script src="app.js"></script>')) {
          let inlineCss = "";
          try {
            Array.from(document.styleSheets).forEach((sheet) => {
              if (sheet.href && sheet.href.includes("katex")) return;
              Array.from(sheet.cssRules || []).forEach((rule) => {
                inlineCss += rule.cssText + "\n";
              });
            });
          } catch (e) {
            // ignora CORS de folhas externas
          }
          if (inlineCss) {
            rawDoc = rawDoc.replace(
              /<link rel="stylesheet" href="styles\.css"\s*\/?>/,
              "<style>\n" + inlineCss + "\n</style>"
            );
          }
          const dataScripts =
            "<script>\n" +
            "window.DADOS_EDITAL = " + JSON.stringify(window.DADOS_EDITAL) + ";\n" +
            "window.PLANO_30_DIAS = " + JSON.stringify(window.PLANO_30_DIAS) + ";\n" +
            "window.TEXTOS_BASE = " + JSON.stringify(window.TEXTOS_BASE) + ";\n" +
            "window.DADOS_TEORIA = " + JSON.stringify(window.DADOS_TEORIA) + ";\n" +
            "window.QUESTOES_PARTE1 = " + JSON.stringify(window.QUESTOES_PARTE1) + ";\n" +
            "window.QUESTOES_PARTE2 = " + JSON.stringify(window.QUESTOES_PARTE2) + ";\n" +
            "(" + transpetroAppMain.toString() + ")();\n" +
            "</script>";

          rawDoc = rawDoc
            .replace('<script src="dados_edital_plano.js"></script>', "")
            .replace('<script src="dados_teoria.js"></script>', "")
            .replace('<script src="dados_questoes_parte1.js"></script>', "")
            .replace('<script src="dados_questoes_parte2.js"></script>', "")
            .replace('<script src="app.js"></script>', dataScripts);
        }

        const withCloud = rawDoc.replace(
          /\/\*__EMBEDDED_CLOUD_CFG_START__\*\/[\s\S]*?\/\*__EMBEDDED_CLOUD_CFG_END__\*\//,
          "/*__EMBEDDED_CLOUD_CFG_START__*/ " +
            JSON.stringify(cloudConfig) +
            " /*__EMBEDDED_CLOUD_CFG_END__*/"
        );
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(withCloud).then(() => {
            this.textContent =
              "✅ HTML Copiado com Nuvem Embutida! Cole no Google Sites";
            setTimeout(() => {
              this.textContent =
                "📦 Copiar HTML p/ Google Sites (Com Nuvem Embutida)";
            }, 4000);
          });
        }
      });

    // Renderização inicial
    updateCloudStatusUI();
    renderDashboard();

    // Se a nuvem estiver configurada, busca progresso mais recente ao abrir e ao voltar para a aba
    if (isCloudConfigured()) {
      pullFromCloud({ silent: true });
    }
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && isCloudConfigured()) {
        pullFromCloud({ silent: true });
      }
    });

    // Garante que após o carregamento assíncrono do KaTeX (defer), toda matemática seja re-renderizada
    window.addEventListener("load", function () {
      switchTab(currentTab);
    });
  });
})();

