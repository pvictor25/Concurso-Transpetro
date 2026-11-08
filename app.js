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
      "### Fórmulas Rápidas para Revisar antes da Prova\n\n" +
      "• **Curto 1φ-Terra franco:**\n" +
      "$$I_{cc1\\phi} = 3I_{a0} = \\frac{3E_a}{Z_1 + Z_2 + Z_0}$$\n\n" +
      "• **Mudança de base em p.u.:**\n" +
      "$$Z_{pu,\\text{novo}} = Z_{pu,\\text{antigo}} \\cdot \\left(\\frac{S_{\\text{base,novo}}}{S_{\\text{base,antigo}}}\\right) \\cdot \\left(\\frac{V_{\\text{base,antigo}}}{V_{\\text{base,novo}}}\\right)^2$$\n\n" +
      "• **NBR 5410 — Coordenação contra Sobrecarga:**\n" +
      "$$I_L \\le I_d \\le I_c \\qquad ; \\qquad I_2 \\le 1,45 \\cdot I_c$$\n\n" +
      "• **MIT — Conjugado e Escorregamento:**\n" +
      "$$\\frac{R_{r1}}{s_1} = \\frac{R_{r1} + R_{\\text{adic}}}{s_2}$$\n\n" +
      "• **Sistemas de 2ª Ordem (Forma Canônica):**\n" +
      "$$G(s) = \\frac{K \\cdot \\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}$$\n",
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
  let customQuestionIdsFilter = null; // Array de IDs quando filtrado a partir de um Tópico/Dia
  let customFilterLabel = "";
  let returnToTheoryId = "bloco4";

  // Estado da Trilha de Estudo Guiado Linear (Passo 1: Teoria -> Passo 2: Questões -> Passo 3: Revisão)
  let guidedDayNum = null;
  let guidedStep = 1; // 1 = Teoria, 2 = Questões do Conteúdo, 3 = Revisão & Conclusão
  let showFullBlockInGuided = false;
  let showAllFlashcardsInGuided = false;
  let currentTheoryFlashcardIdx = 0;
  let theoryFlashcardShowingBack = false;
  let personalNotesMode = "split"; // "edit" | "preview" | "split"

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
      const merged = Object.assign({}, JSON.parse(JSON.stringify(defaultState)), parsed);
      if (typeof merged.personalNotes === "string") {
        if (merged.personalNotes.startsWith("📌 ")) {
          merged.personalNotes = merged.personalNotes.replace(/^📌\s*/, "");
        }
        // Migra notas padrão antigas em texto puro para a versão oficial com LaTeX nativo
        const hasOldFormulas =
          merged.personalNotes.includes("Fórmulas Rápidas para Revisar") ||
          merged.personalNotes.includes("Curto 1φ-Terra franco") ||
          merged.personalNotes.includes("I_f = 3·E") ||
          merged.personalNotes.includes("I_cc1φ = 3·I_a0");
        if (hasOldFormulas && !merged.personalNotes.includes("$$")) {
          merged.personalNotes = defaultState.personalNotes;
        }
      }
      return merged;
    } catch (e) {
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  // =========================================================================
  // MOTOR ANTI-CACHE E ATUALIZAÇÃO AUTOMÁTICA SEM PERDER DADOS LOCAIS
  // =========================================================================
  async function clearStaleBrowserCaches() {
    try {
      if ("caches" in window && window.caches && typeof window.caches.keys === "function") {
        const keys = await window.caches.keys();
        await Promise.all(keys.map((k) => window.caches.delete(k)));
      }
      if ("serviceWorker" in navigator && navigator.serviceWorker) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch (e) {
      // Ignora em contextos restritos (file:// ou iframe sandbox)
    }
  }

  async function forceRefreshUIWithoutLosingData(targetHash) {
    await clearStaleBrowserCaches();
    const bust = (targetHash || window.APP_BUILD_HASH || "v") + "_" + Date.now();
    const sheet = document.getElementById("main-stylesheet");
    if (sheet && sheet.getAttribute("href")) {
      const baseHref = sheet.getAttribute("href").split("?")[0];
      sheet.setAttribute("href", baseHref + "?v=" + bust);
    }
    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      const url = new URL(window.location.href);
      url.searchParams.set("v", bust);
      window.location.replace(url.toString());
    } else {
      window.location.reload();
    }
  }

  async function checkAndApplyAppUpdate() {
    await clearStaleBrowserCaches();
    if (window.location.protocol !== "http:" && window.location.protocol !== "https:") {
      return;
    }
    try {
      const res = await fetch("version.json?t=" + Date.now(), {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache"
        }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.hash && window.APP_BUILD_HASH && data.hash !== window.APP_BUILD_HASH) {
        const lastReloadedHash = sessionStorage.getItem("TP_LAST_RELOADED_HASH");
        if (lastReloadedHash !== data.hash) {
          sessionStorage.setItem("TP_LAST_RELOADED_HASH", data.hash);
          await forceRefreshUIWithoutLosingData(data.hash);
        }
      }
    } catch (e) {
      // Offline ou arquivo version.json indisponível no bundle inline
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
      if (label) label.textContent = "Nuvem: Configurar";
      if (modalTitle) modalTitle.textContent = "Nuvem desconectada (persistência local no navegador)";
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
      if (label) label.textContent = "Sincronizando nuvem...";
      if (modalTitle) modalTitle.textContent = `Sincronizando com ${provName}...`;
      if (modalSub) modalSub.textContent = "Aguarde a confirmação do servidor...";
    } else if (cloudStatus.state === "error") {
      if (dot) dot.className = "cloud-dot error";
      if (label) label.textContent = "Nuvem: Erro de sinc.";
      if (modalTitle) modalTitle.textContent = `Falha ao sincronizar com ${provName}`;
      if (modalSub) modalSub.textContent = cloudStatus.message || "Verifique sua URL/Token ou conexão com a internet.";
    } else {
      if (dot) dot.className = "cloud-dot synced";
      if (label)
        label.textContent = timeStr
          ? `Sincronizado (${timeStr.slice(0, 5)})`
          : "Nuvem Conectada";
      if (modalTitle)
        modalTitle.textContent = `Conectado a ${provName} ${timeStr ? "· Última sinc: " + timeStr : ""}`;
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

  // Formatação de texto matemático LaTeX e markdown nas explicações, enunciados, flashcards e notas pessoais
  function formatRichText(text) {
    if (!text) return "";
    let str = String(text);

    // Isola blocos e termos matemáticos em placeholders para não sofrerem escapes ou quebras de linha indevidas
    const mathTokens = [];
    str = str.replace(/\$\$([\s\S]*?)\$\$/g, function (_, math) {
      const idx = mathTokens.length;
      mathTokens.push('<div class="formula-box">' + renderLatexExpr(math, true) + "</div>");
      return `___MATH_BLOCK_${idx}___`;
    });

    str = str.replace(/\$([^$\n]+)\$/g, function (_, math) {
      const idx = mathTokens.length;
      mathTokens.push('<span class="inline-math">' + renderLatexExpr(math, false) + "</span>");
      return `___MATH_BLOCK_${idx}___`;
    });

    let html = str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Negrito **...**
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // Itálico *...*
    html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

    // Quebras de linha normais de parágrafos/listas
    html = html.replace(/\n/g, "<br>");

    // Restaura as fórmulas matemáticas intactas
    mathTokens.forEach((token, idx) => {
      html = html.replace(`___MATH_BLOCK_${idx}___`, token);
    });

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
        badge.textContent = "1/3 · 10m Teoria";
        seg1.classList.add("active");
      } else if (timerSeconds > 300) {
        // 20:00 até 05:01 (15 min seguintes)
        badge.textContent = "2/3 · 15m Questões";
        seg1.classList.add("done");
        seg2.classList.add("active");
      } else if (timerSeconds > 0) {
        // 05:00 até 00:01 (5 min finais)
        badge.textContent = "3/3 · 5m Revisão";
        seg1.classList.add("done");
        seg2.classList.add("done");
        seg3.classList.add("active");
      } else {
        badge.textContent = "Meta 30m Concluída";
        seg1.classList.add("done");
        seg2.classList.add("done");
        seg3.classList.add("done");
      }
    }

    const btnToggle = document.getElementById("btn-timer-toggle");
    if (btnToggle) {
      btnToggle.textContent = timerRunning ? "Pausar" : "Iniciar 30m";
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
          ? "PROVA: 06/12/2026 (" + diffDays + " DIAS)"
          : "DIA DA PROVA: 06/12/2026";
    }
  }

  // =========================================================================
  // ABA 1: DASHBOARD GERAL + RECUPERAÇÃO INTELIGENTE DE DIAS PERDIDOS
  // FLASHCARDS INDEXADOS POR SUBTÓPICO TEÓRICO (22 SEÇÕES DO EDITAL)
  // =========================================================================
  const FLASHCARDS_REVISAO = [
    // =========================================================================
    // BLOCO 4: SEP (SISTEMAS ELÉTRICOS DE POTÊNCIA)
    // =========================================================================
    // --- DIA 1 (07/11): Tópicos 4.1 (PU & Unifilar) e 4.6 (Efeito Pelicular Q21) ---
    {
      id: "fc-4-1-1",
      bloco: "bloco4",
      secaoId: "sub-4-1",
      secaoTitulo: "4.1 Sistema por Unidade (p.u.) e Diagrama Unifilar",
      days: [1, 23],
      frente: "4.1 Mudança de Base p.u. — Qual é a fórmula oficial para conversão de uma impedância em p.u. de uma base antiga para uma base nova?",
      verso: "$$Z_{pu,\\text{novo}} = Z_{pu,\\text{antigo}} \\cdot \\left(\\frac{S_{\\text{base,novo}}}{S_{\\text{base,antigo}}}\\right) \\cdot \\left(\\frac{V_{\\text{base,antigo}}}{V_{\\text{base,novo}}}\\right)^2$$\n• A potência base varia **diretamente** ($S_{\\text{novo}}/S_{\\text{antigo}}$).\n• A tensão base varia com o **quadrado inverso** ($(V_{\\text{antigo}}/V_{\\text{novo}})^2$).\n• A impedância base ôhmica é $Z_{\\text{base}} = \\frac{V_{\\text{base}}^2}{S_{\\text{base}}}$."
    },
    {
      id: "fc-4-1-2",
      bloco: "bloco4",
      secaoId: "sub-4-1",
      secaoTitulo: "4.1 Sistema por Unidade (p.u.) e Diagrama Unifilar",
      days: [1, 23],
      frente: "4.1 Diagrama Unifilar e Carga Nominal — No diagrama unifilar, a quais grandezas os dados se referem e qual a impedância em p.u. de uma carga nominal na sua própria base (Q37, Q39 e Q56)?",
      verso: "• **Diagrama Unifilar (Q39):** Representa a **tensão de linha**, a **corrente de linha** e a **impedância de uma fase na ligação estrela** (ou equivalente estrela $Z_Y = Z_\\Delta/3$).\n• **Carga na Própria Base (Q37 e Q56):** Qualquer carga operando na sua tensão e potência nominais tem **$Z_{pu} = 1,0\\text{ p.u.}$** na base própria! Ao converter para a base do sistema ($S_{\\text{base}}$): $Z_{pu} = 1,0 \\times \\frac{S_{\\text{base}}}{S_{\\text{nom}}} \\times \\left(\\frac{V_{\\text{nom}}}{V_{\\text{base}}}\\right)^2$."
    },
    {
      id: "fc-4-6-1",
      bloco: "bloco4",
      secaoId: "sub-4-6",
      secaoTitulo: "4.6 Transmissão: Efeito Pelicular (Skin Effect — Q21)",
      days: [1, 23],
      frente: "4.6 Efeito Pelicular (Skin Effect) — Qual é a causa física do efeito pelicular em condutores CA, qual a fórmula da profundidade de penetração ($\\delta$) e o impacto na resistência da linha (Q21)?",
      verso: "• **Causa Física:** Em CA, o maior enlace de fluxo magnético interno no centro do condutor eleva a reatância indutiva no eixo central, repelindo os elétrons para a periferia ('pele' do condutor).\n• **Profundidade de Penetração:**\n$$\\delta = \\frac{1}{\\sqrt{\\pi \\cdot f \\cdot \\mu \\cdot \\sigma}}$$\n• **Impacto (Q21):** O aumento da frequência ($f$) reduz a espessura útil $\\delta$, concentrando a corrente na borda e **AUMENTANDO a resistência aparente em CA ($R_{\\text{CA}} > R_{\\text{CC}}$)** da linha de transmissão."
    },

    // --- DIA 2 (08/11): Tópico 4.2 (Componentes Simétricas e Fortescue) ---
    {
      id: "fc-4-2-1",
      bloco: "bloco4",
      secaoId: "sub-4-2",
      secaoTitulo: "4.2 Componentes Simétricas e Teorema de Fortescue",
      days: [2, 23, 28],
      frente: "4.2 Operador Fasorial $a$ — Quais são as propriedades essenciais do operador $a$ e como ele decompõe um sistema desequilibrado em três sequências?",
      verso: "• $a = 1\\angle 120^\\circ = -\\frac{1}{2} + j\\frac{\\sqrt{3}}{2} \\approx -0,5 + j0,866$\n• $a^2 = 1\\angle 240^\\circ = 1\\angle -120^\\circ = -\\frac{1}{2} - j\\frac{\\sqrt{3}}{2}$\n• $a^3 = 1$ e $1 + a + a^2 = 0$\n• **Decomposição:**\n- **Sequência Positiva (1):** Fasores $ABC$ equilibrados, $B_1$ atrasa $120^\\circ$ ($B_1 = a^2 A_1$, $C_1 = a A_1$).\n- **Sequência Negativa (2):** Fasores $ACB$ invertidos, $B_2$ adianta $120^\\circ$ ($B_2 = a A_2$, $C_2 = a^2 A_2$).\n- **Sequência Zero (0):** Fasores idênticos em módulo e fase ($A_0 = B_0 = C_0$)."
    },
    {
      id: "fc-4-2-2",
      bloco: "bloco4",
      secaoId: "sub-4-2",
      secaoTitulo: "4.2 Componentes Simétricas e Teorema de Fortescue",
      days: [2, 23, 28],
      frente: "4.2 Matriz de Fortescue — Na matriz de síntese de fases $[\\dot{V}_A, \\dot{V}_B, \\dot{V}_C]^T = [M] \\cdot [\\dot{V}_{A0}, \\dot{V}_{A1}, \\dot{V}_{A2}]^T$, como identificar imediatamente as colunas de cada sequência (Q38 da Cesgranrio)?",
      verso: "• **Coluna de Sequência Zero (0):** Sempre $[1, 1, 1]^T$ (fasores colineares em fase).\n• **Coluna de Sequência Positiva (1):** Sempre $[1, a^2, a]^T$ (na fase B o fasor positivo atrasa $120^\\circ$, multiplicando por $a^2$).\n• **Coluna de Sequência Negativa (2):** Sempre $[1, a, a^2]^T$ (na fase B o fasor negativo adianta $120^\\circ$, multiplicando por $a$).\n$$\\begin{bmatrix} \\dot{V}_A \\\\ \\dot{V}_B \\\\ \\dot{V}_C \\end{bmatrix} = \\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & a^2 & a \\\\ 1 & a & a^2 \\end{bmatrix} \\begin{bmatrix} \\dot{V}_{A0} \\\\ \\dot{V}_{A1} \\\\ \\dot{V}_{A2} \\end{bmatrix}$$"
    },

    // --- DIA 3 (09/11): Tópico 4.3 a 4.5 (Sequência Zero e Faltas Simétricas/Assimétricas) ---
    {
      id: "fc-4-3-1",
      bloco: "bloco4",
      secaoId: "sub-4-3",
      secaoTitulo: "4.3 Sequência Zero e Faltas Simétricas/Assimétricas",
      days: [3, 23, 28],
      frente: "4.3 e 4.4 Curto Monofásico-Terra (1φ-T) — Como são associadas as redes de sequência e qual a expressão da corrente de curto-circuito franca para a terra (Q50)?",
      verso: "As três redes de sequência (positiva, negativa e zero) ficam associadas em **SÉRIE**:\n$$I_{a1} = I_{a2} = I_{a0} = \\frac{E_a}{Z_1 + Z_2 + Z_0}$$\nA corrente total de falta na fase defeituosa ($A$) para a terra é a soma das 3 componentes:\n$$I_{cc1\\phi} = 3 \\cdot I_{a0} = \\frac{3E_a}{Z_1 + Z_2 + Z_0}$$"
    },
    {
      id: "fc-4-3-2",
      bloco: "bloco4",
      secaoId: "sub-4-3",
      secaoTitulo: "4.3 Sequência Zero e Faltas Simétricas/Assimétricas",
      days: [3, 23, 28],
      frente: "4.4 e 4.5 Curtos 3φ, 2φ e 2φ-Terra — Como são associadas as redes de sequência nos curtos Trifásico ($3\\phi$), Bifásico ($2\\phi$) e Bifásico-Terra ($2\\phi\\text{-T}$)?",
      verso: "• **Trifásica Simétrica ($3\\phi$):** Apenas sequência positiva atua ($I_{a2}=0, I_{a0}=0$). Corrente: $I_{cc3\\phi} = \\frac{E_a}{Z_1}$.\n• **Bifásica ($2\\phi$ entre B e C):** Sem contato com terra $\\implies I_{a0}=0$. Redes positiva e negativa em **oposição/paralelo**: $I_{a1} = -I_{a2} = \\frac{E_a}{Z_1 + Z_2}$ e $I_{cc2\\phi} = \\sqrt{3}I_{a1} = \\frac{\\sqrt{3}E_a}{Z_1 + Z_2}$.\n• **Bifásica-Terra ($2\\phi\\text{-T}$):** Redes positiva, negativa e zero em **PARALELO** ($V_{a1} = V_{a2} = V_{a0}$)."
    },
    {
      id: "fc-4-3-3",
      bloco: "bloco4",
      secaoId: "sub-4-3",
      secaoTitulo: "4.3 Sequência Zero e Faltas Simétricas/Assimétricas",
      days: [3, 23, 28],
      frente: "4.3 Sequência Zero em Transformadores — Como as conexões Y-aterrado e Delta afetam a passagem da corrente de sequência zero e a impedância de aterramento de neutro ($Z_n$)?",
      verso: "• **Aterramento com impedância $Z_n$:** A impedância inserida no circuito de sequência zero é multiplicada por 3: **$3Z_n$** (pois pelo neutro retorna $I_n = 3I_{a0}$).\n• **$Y_{\\text{aterrado}} - \\Delta$:** Corrente entra pelo lado estrela aterrada e circula internamente no delta fechado, conectando o lado estrela à barra de referência, mas deixando o enrolamento delta aberto para as linhas externas.\n• **$Y$ não aterrado:** Chave em circuito aberto (não há caminho para corrente zero)."
    },

    // --- DIA 4 (10/11): Tópico 4.7 (Proteção ANSI 50/51, 50BF, 87, 21 e TC) ---
    {
      id: "fc-4-7-1",
      bloco: "bloco4",
      secaoId: "sub-4-7",
      secaoTitulo: "4.7 Proteção de Sistemas Elétricos (ANSI 50/51, 50BF, 87, 21)",
      days: [4, 23, 29],
      frente: "4.7 Relé 50BF (Breaker Failure) — O que é e como opera a função ANSI 50BF em subestações elétricas (Q29)?",
      verso: "Se o disjuntor principal recebe comando de abertura por curto-circuito e **falha ao extinguir a corrente ou abrir seus polos** dentro do tempo ajustado do temporizador de retaguarda, o relé **ANSI 50BF** atua comandando a abertura imediata de **todos os disjuntores adjacentes** ligados ao mesmo barramento, isolando a barra e eliminando a corrente de falta com segurança."
    },
    {
      id: "fc-4-7-2",
      bloco: "bloco4",
      secaoId: "sub-4-7",
      secaoTitulo: "4.7 Proteção de Sistemas Elétricos (ANSI 50/51, 50BF, 87, 21)",
      days: [4, 23, 29],
      frente: "4.7 Ajuste de Relé de Sobrecarga (ANSI 51) com TC — Como calcular a corrente ajustada no secundário do relé em um transformador trifásico alimentado via TC (Q54)?",
      verso: "1º) Calcula-se a corrente nominal primária do transformador trifásico:\n$$I_{n,\\text{prim}} = \\frac{S_{3\\phi}}{\\sqrt{3} \\cdot V_L}$$\n2º) Multiplica-se pelo fator de sobrecarga admissível e divide-se pela RTC (relação de transformação do TC):\n$$I_{\\text{ajuste}} = \\frac{f_{\\text{sobrecarga}} \\cdot I_{n,\\text{prim}}}{\\text{RTC}}$$\nExemplo da prova: para $I_{n,\\text{prim}} = 200\\text{ A}$, sobrecarga de $1,25$ e TC $250/5\\text{ A}$ ($\\text{RTC}=50$): $I_{\\text{ajuste}} = \\frac{1,25 \\times 200}{50} = \\mathbf{5,0\\text{ A}}$."
    },

    // =========================================================================
    // BLOCO 2: CIRCUITOS ELÉTRICOS
    // =========================================================================
    // --- DIA 5 (11/11): Tópico 2.1 (CC, Thévenin, Norton, Máxima Transferência, Malhas) ---
    {
      id: "fc-2-1-1",
      bloco: "bloco2",
      secaoId: "sub-2-1",
      secaoTitulo: "2.1 Análise CC, Thévenin, Norton e Máxima Transferência",
      days: [5, 22, 28],
      frente: "2.1 Circuitos CC e Thévenin — Qual é o teorema da Máxima Transferência de Potência e qual o rendimento da fonte nesse ponto?",
      verso: "• Para carga resistiva variável $R_L$ conectada a um bipolo linear:\n$$R_L = R_{Th}$$\n• Potência máxima fornecida à carga:\n$$P_{\\max} = \\frac{V_{Th}^2}{4 R_{Th}}$$\n• O rendimento da fonte no ponto de máxima transferência é de **exatamente 50%** (a outra metade da potência total gerada é dissipada internamente na resistência de Thévenin $R_{Th}$)."
    },
    {
      id: "fc-2-1-2",
      bloco: "bloco2",
      secaoId: "sub-2-1",
      secaoTitulo: "2.1 Análise CC, Thévenin, Norton e Malhas Infinitas",
      days: [5, 22, 28],
      frente: "2.1 Malhas e Escadas Infinitas — Como resolver associações infinitas periódicas de capacitores ou resistores (Q72)?",
      verso: "Por autosimilaridade, se a cadeia for infinita, a impedância equivalente vista após o primeiro elo é idêntica à impedância equivalente total ($Z_{eq}$):\n1º) Corta-se a escada após o 1º módulo e substitui-se todo o ramo restante infinito pela incógnita $Z_{eq}$.\n2º) Monta-se a equação $Z_{eq} = Z_1 + (Z_2 \\parallel Z_{eq})$ (ou equivalente com capacitores em série/paralelo).\n3º) Resolve-se a equação do 2º grau e adota-se a raiz positiva real."
    },

    // --- DIA 6 (12/11): Tópico 2.2 (Fasores CA Monofásicos, Queda 2 condutores, RMS) ---
    {
      id: "fc-2-2-1",
      bloco: "bloco2",
      secaoId: "sub-2-2",
      secaoTitulo: "2.2 Monofásico CA, Fasores, Queda de Tensão e RMS",
      days: [6, 22],
      frente: "2.2 Queda de Tensão Fasorial — Em um circuito monofásico a 2 condutores alimentando uma carga indutiva, qual é a queda de tensão e a defasagem angular da corrente (Q51)?",
      verso: "• **Circuito a dois condutores (ida + retorno):**\n$$\\Delta\\dot{V} = 2 \\cdot \\dot{I} \\cdot Z_{\\text{cabo}} = 2 \\cdot \\dot{I} \\cdot (R + jX)$$\n• Se a carga é **indutiva**, a corrente $\\dot{I}$ está **atrasada** em relação à tensão na carga: $\\theta_i = \\theta_v - \\varphi$.\n• Potência complexa: $S = \\dot{V}\\dot{I}^* = P + jQ$."
    },
    {
      id: "fc-2-2-2",
      bloco: "bloco2",
      secaoId: "sub-2-2",
      secaoTitulo: "2.2 Monofásico CA, Fasores, Queda de Tensão e RMS",
      days: [6, 22],
      frente: "2.2 Valor Eficaz (RMS) — Como calcular o valor eficaz RMS de ondas senoidais, quadradas e triangulares simétricas (Q63)?",
      verso: "• **Onda Senoidal Pura ($V_p$):** $V_{\\text{rms}} = \\frac{V_p}{\\sqrt{2}} \\approx 0,707 V_p$.\n• **Onda Quadrada Simétrica (alternada $\\pm S$):** $V_{\\text{rms}} = S$ (o valor eficaz é igual ao próprio pico!). Logo, se comutar entre $+V_p$ e $-V_p$ de uma senóide, $V_{\\text{rms}} = V_p = \\sqrt{2}V_{\\text{rede}}$.\n• **Onda Triangular / Dente de Serra:** $V_{\\text{rms}} = \\frac{V_p}{\\sqrt{3}}$."
    },

    // --- DIA 7 (13/11): Tópico 2.3 (Trifásicos ABC/ACB, Correção de FP, Bode 1ª ordem) ---
    {
      id: "fc-2-3-1",
      bloco: "bloco2",
      secaoId: "sub-2-3",
      secaoTitulo: "2.3 Trifásicos ABC/ACB, Correção de FP e Bode de 1ª Ordem",
      days: [7, 22],
      frente: "2.3 Sequência ABC vs. ACB — Se um gerador trifásico tem tensão $\\dot{V}_{AN} = V\\angle 0^\\circ$, quais são os fasores das tensões de fase na sequência inversa ACB (Q34)?",
      verso: "• **Sequência Direta (ABC):** $\\dot{V}_{BN}$ ATRASA $120^\\circ$ e $\\dot{V}_{CN}$ ADIANTA $120^\\circ$:\n$$\\dot{V}_{AN} = V\\angle 0^\\circ, \\quad \\dot{V}_{BN} = V\\angle -120^\\circ, \\quad \\dot{V}_{CN} = V\\angle +120^\\circ$$\n• **Sequência Inversa (ACB):** Invertem-se B e C! $\\dot{V}_{BN}$ **ADIANTA $120^\\circ$** e $\\dot{V}_{CN}$ ATRASA $120^\\circ$:\n$$\\dot{V}_{AN} = V\\angle 0^\\circ, \\quad \\dot{V}_{BN} = V\\angle +120^\\circ, \\quad \\dot{V}_{CN} = V\\angle -120^\\circ$$"
    },
    {
      id: "fc-2-3-2",
      bloco: "bloco2",
      secaoId: "sub-2-3",
      secaoTitulo: "2.3 Trifásicos ABC/ACB, Correção de FP e Bode de 1ª Ordem",
      days: [7, 22],
      frente: "2.3 Correção de FP e Filtro de 1ª Ordem — Qual a fórmula do banco de capacitores $Q_C$ e a taxa de decaimento em alta frequência no Diagrama de Bode de 1ª ordem?",
      verso: "• **Correção de Fator de Potência:**\n$$Q_C = P_{3\\phi} \\cdot (\\operatorname{tg}\\varphi_1 - \\operatorname{tg}\\varphi_2)$$\nonde $\\cos\\varphi_1 = FP_{\\text{antigo}}$ e $\\cos\\varphi_2 = FP_{\\text{novo}}$.\n• **Bode de 1ª Ordem:** Para polo simples em $\\omega_c$, acima da frequência de corte a curva assintótica de módulo decai com inclinação de **$-20\\text{ dB/década}$** (ou $-6\\text{ dB/oitava}$) e a fase tende a $-90^\\circ$."
    },

    // --- DIA 8 (14/11): Tópico 2.4 (Transitórios RC e RL ao Degrau) ---
    {
      id: "fc-2-4-1",
      bloco: "bloco2",
      secaoId: "sub-2-4",
      secaoTitulo: "2.4 Regime Transitório (RL, RC e RLC)",
      days: [8, 22],
      frente: "2.4 Constantes de Tempo e Resposta ao Degrau — Quais as constantes de tempo ($\\tau$) para circuitos RC e RL e a equação da resposta temporal ao degrau de 1ª ordem?",
      verso: "• Circuito RC: $\\tau = R \\cdot C$\n• Circuito RL: $\\tau = \\frac{L}{R}$\n• **Equação Geral de 1ª Ordem ao Degrau:**\n$$x(t) = x(\\infty) + [x(0^+) - x(\\infty)] \\cdot e^{-t/\\tau}$$\n• Em $t = \\tau$, $x(t)$ atinge $63,2\\%$ da transição;\n• Em $t = 3\\tau$, $x(t)$ atinge $95\\%$;\n• Em $t = 5\\tau$, atinge mais de $99\\%$ (considerado regime permanente na prática da Cesgranrio)."
    },
    {
      id: "fc-2-4-2",
      bloco: "bloco2",
      secaoId: "sub-2-4",
      secaoTitulo: "2.4 Regime Transitório (RL, RC e RLC)",
      days: [8, 22],
      frente: "2.4 Continuidade em Transitórios — Como se comportam capacitores e indutores imediatamente após chaveamento ($t=0^+$) e em regime permanente CC ($t=\\infty$)?",
      verso: "• **Tensão no capacitor:** Não varia bruscamente $\\implies v_C(0^+) = v_C(0^-)$. Se descarregado em $0^-$, comporta-se como **curto-circuito** em $0^+$; em $t=\\infty$ (CC), comporta-se como **circuito aberto**.\n• **Corrente no indutor:** Não varia bruscamente $\\implies i_L(0^+) = i_L(0^-)$. Se desenergizado em $0^-$, comporta-se como **circuito aberto** em $0^+$; em $t=\\infty$ (CC), comporta-se como **curto-circuito**."
    },

    // =========================================================================
    // BLOCO 6: MÁQUINAS ELÉTRICAS
    // =========================================================================
    // --- DIA 9 (15/11): Tópico 6.1 e 6.2 (Transformadores Monofásicos, Autotrafos, Paralelismo) ---
    {
      id: "fc-6-2-1",
      bloco: "bloco6",
      secaoId: "sub-6-2",
      secaoTitulo: "6.1 e 6.2 Transformadores Monofásicos e Trifásicos",
      days: [9, 24],
      frente: "6.2 Autotransformador — Como se relaciona a potência dimensionada dos enrolamentos ($S_{\\text{isol}}$) com a potência nominal do autotransformador ($S_{\\text{auto}}$) (Q23)?",
      verso: "$$S_{\\text{isol}} = V_{\\text{série}} \\cdot I_{\\text{série}} = S_{\\text{auto}} \\cdot \\left(1 - \\frac{V_{\\text{menor}}}{V_{\\text{maior}}}\\right)$$\nExemplo da prova: para um autotransformador abaixador $300\\text{ V}/100\\text{ V}$ de $60\\text{ kVA}$, os enrolamentos são dimensionados para apenas $60 \\times (1 - 100/300) = \\mathbf{40\\text{ kVA}}$! A potência transmitida por condução é $60 - 40 = 20\\text{ kVA}$."
    },
    {
      id: "fc-6-2-2",
      bloco: "bloco6",
      secaoId: "sub-6-2",
      secaoTitulo: "6.1 e 6.2 Transformadores Monofásicos e Trifásicos",
      days: [9, 24],
      frente: "6.1 e 6.2 Ensaios de Trafo e Paralelismo — O que medem os ensaios a vazio e de curto-circuito e qual a regra do grupo angular para paralelismo trifásico (Q24)?",
      verso: "• **Ensaio a Vazio (tensão nominal):** Mede perdas no ferro do núcleo ($P_{\\text{ferro}}$) e ramo em derivação ($R_c, X_m$).\n• **Ensaio em Curto-Circuito (corrente nominal):** Mede perdas Joule no cobre ($P_{cu}$) e parâmetros série ($R_{eq} = P_{cc}/I_{cc}^2, X_{eq} = \\sqrt{Z_{eq}^2 - R_{eq}^2}$).\n• **Paralelismo Trifásico:** Exige mesma relação de transformação, mesma sequência de fases e **mesmo deslocamento angular** (ex.: Dy1 com $-30^\\circ$ só paraleliza com grupos de mesmo ângulo; nunca com Yy0)."
    },

    // --- DIA 10 (16/11): Tópico 6.3 (Motores CC Shunt e Curvas V de Síncronas) ---
    {
      id: "fc-6-3-1",
      bloco: "bloco6",
      secaoId: "sub-6-3",
      secaoTitulo: "6.3 Motores CC Shunt e Curvas V de Máquinas Síncronas",
      days: [10, 24, 28],
      frente: "6.3 Motor CC Shunt — Qual é a equação da tensão de armadura e como varia a rotação ($n$) com a corrente de armadura ($I_a$) e a tensão aplicada (Q25)?",
      verso: "• Equação da armadura: $V_t = E_a + R_a I_a \\implies E_a = V_t - R_a I_a$.\n• Força contraeletromotriz: $E_a = k \\phi n$.\n• Rotação: $n = \\frac{V_t - R_a I_a}{k \\phi}$.\n• No motor shunt, o campo está em paralelo com a linha constante, logo o fluxo $\\phi$ é aproximadamente constante. Ao aumentar a carga no eixo, $I_a$ cresce, provocando ligeira queda na rotação devido à queda de tensão $R_a I_a$."
    },
    {
      id: "fc-6-3-2",
      bloco: "bloco6",
      secaoId: "sub-6-3",
      secaoTitulo: "6.3 Motores CC Shunt e Curvas V de Máquinas Síncronas",
      days: [10, 24, 28],
      frente: "6.3 Curvas V de Máquinas Síncronas — Pelas Curvas V ($I_a \\times I_f$), qual o comportamento de um Motor Síncrono quando opera Sobre-excitado e Sub-excitado?",
      verso: "• **Sobre-excitado ($I_f > I_{f,\\text{normal}}$):** Corrente de armadura adianta da tensão $\\implies$ Fator de Potência **CAPACITIVO** (o motor injeta potência reativa capacitiva na rede, funcionando como compensador síncrono).\n• **Sub-excitado ($I_f < I_{f,\\text{normal}}$):** Corrente de armadura atrasa da tensão $\\implies$ Fator de Potência **INDUTIVO** (o motor absorve potência reativa indutiva da rede).\n• No ponto de corrente mínima de armadura, o fator de potência é **UNITÁRIO** ($FP = 1,0$)."
    },

    // --- DIA 11 (17/11): Tópico 6.4 (MIT: Escorregamento, Potências, R2/s e V/f) ---
    {
      id: "fc-6-4-1",
      bloco: "bloco6",
      secaoId: "sub-6-4",
      secaoTitulo: "6.4 Motores de Indução Trifásicos (MIT): Escorregamento e Potências",
      days: [11, 24, 28],
      frente: "6.4 MIT — Quais são as fórmulas de velocidade síncrona ($n_s$), escorregamento ($s$) e a proporção de potências no rotor (Q28 e Q55)?",
      verso: "• Velocidade síncrona: $n_s = \\frac{120 f}{p}$ [rpm].\n• Escorregamento: $s = \\frac{n_s - n_r}{n_s}$.\n• **Balanço de Ouro Cesgranrio no Rotor:**\n$$P_{\\text{entreferro}} : P_{\\text{Joule,rotor}} : P_{\\text{mecânica}} = 1 : s : (1 - s)$$\nLogo: $P_{jr} = s \\cdot P_{\\text{gap}}$ e $P_{\\text{mec}} = (1 - s) \\cdot P_{\\text{gap}} = \\frac{1 - s}{s} P_{jr}$."
    },
    {
      id: "fc-6-4-2",
      bloco: "bloco6",
      secaoId: "sub-6-4",
      secaoTitulo: "6.4 Motores de Indução Trifásicos (MIT): Escorregamento e Potências",
      days: [11, 24, 28],
      frente: "6.4 MIT: Inserção de Resistência Rotórica e Controle V/f — Como calcular a resistência adicional para manter o conjugado em outro escorregamento e como opera o controle V/f?",
      verso: "• **Resistência Rotórica:** O conjugado do MIT é constante se a razão $\\frac{R_2}{s}$ for constante:\n$$\\frac{R_2}{s_1} = \\frac{R_2 + R_{\\text{adic}}}{s_2}$$\n• **Controle Escalar $V/f$ Constante:** Ao variar a frequência $f$ do inversor de frequência, ajusta-se a tensão $V$ na mesma proporção ($V/f = \\text{constante}$) para manter o fluxo magnético no entreferro $\\phi_m \\approx \\frac{V_1}{f_1}$ constante, assegurando a capacidade de produzir conjugado máximo nominal na partida."
    },

    // =========================================================================
    // BLOCO 3: MEDIDAS ELÉTRICAS E SI
    // =========================================================================
    // --- DIA 12 (18/11): Tópico 3.1 a 3.5 (Medidas Elétricas, Blondel 2 Wattímetros, Shunt, TC) ---
    {
      id: "fc-3-1-1",
      bloco: "bloco3",
      secaoId: "sub-3-1",
      secaoTitulo: "3.1 a 3.5 Medidas Elétricas, SI, TC/TP e Wattímetros",
      days: [12, 22, 26],
      frente: "3.4 Teorema de Blondel e Método dos 2 Wattímetros — Em sistema trifásico a 3 fios equilibrado, quais são as potências ativa ($P_{3\\phi}$) e reativa ($Q_{3\\phi}$) a partir das leituras $W_1$ e $W_2$ (Q41 e Q60)?",
      verso: "Pelo Teorema de Blondel (exige $N-1 = 2$ elementos de medição para $N=3$ fios):\n$$P_{3\\phi} = W_1 + W_2$$\n$$Q_{3\\phi} = \\sqrt{3}(W_1 - W_2)$$\n• **Fator de Potência:** $\\operatorname{tg}\\varphi = \\sqrt{3}\\frac{W_1 - W_2}{W_1 + W_2}$.\n• Se a carga for puramente resistiva ($FP=1$), $W_1 = W_2$.\n• Se $FP = 0,5$ indutivo ($60^\\circ$), um wattímetro medirá zero ($W_2 = 0$) e toda a potência ativa será indicada pelo outro ($W_1 = P_{3\\phi}$).\n• Em carga equilibrada com neutro ($I_N = 0$), um 3º wattímetro inserido no neutro medirá zero (pegadinha clássica da Q60!)."
    },
    {
      id: "fc-3-1-2",
      bloco: "bloco3",
      secaoId: "sub-3-1",
      secaoTitulo: "3.1 a 3.5 Medidas Elétricas, SI, TC/TP e Wattímetros",
      days: [12, 22, 26],
      frente: "3.1 e 3.3 Medidas de Resistência e TC — Como se classifica o método volt-amperímetro e como calcular a potência média CA num osciloscópio usando resistor shunt (Q42 e Q52)?",
      verso: "• **Método Volt-Amperímetro:** É uma medição **INDIRETA** de resistência ($R = V/I$), pois utiliza dois instrumentos para deduzir o valor por lei física.\n• **Medição de Potência com Shunt no Osciloscópio (Q42):**\nO shunt $R_s$ em série mede a corrente $i(t) = \\frac{v_s(t)}{R_s}$. A potência ativa média em CA com $v(t) = V_p\\cos(\\omega t + \\theta_v)$ e $i(t) = I_p\\cos(\\omega t + \\theta_i)$ é:\n$$P = \\frac{V_p \\cdot I_p}{2} \\cos(\\theta_v - \\theta_i) = V_{\\text{rms}} \\cdot I_{\\text{rms}} \\cdot \\cos(\\varphi)$$\nNão esqueça de dividir o produto das amplitudes de pico por 2!"
    },

    // =========================================================================
    // CONHECIMENTOS BÁSICOS: LÍNGUA PORTUGUESA
    // =========================================================================
    // --- DIA 13 (19/11): Português Parte 1 (Compreensão, Pronome Relativo 'QUE', Aposto) ---
    {
      id: "fc-pt-1-1",
      bloco: "portugues",
      secaoId: "sub-pt-1",
      secaoTitulo: "Português Parte 1: Compreensão, Pronome Relativo 'QUE' e Pontuação",
      days: [13, 25],
      frente: "Português (Coesão Referencial) — Quando o vocábulo 'QUE' atua como Pronome Relativo segundo o rigor da Cesgranrio (Q04 e Q06)?",
      verso: "O vocábulo 'QUE' é **pronome relativo** se e somente se:\n1. Retoma um substantivo ou pronome antecedente na oração principal.\n2. Pode ser substituído exatamente por **o qual, a qual, os quais, as quais**.\n• Exemplo da prova: *'olhou a borboleta <u>que</u> [a qual] entrou na varanda'* $\\implies$ pronome relativo retomando *borboleta*.\n• Se vier após verbos de cognição/dizer introduzindo oração subordinada substantiva (*'disse <u>que</u> viria'*), é **conjunção integrante** (substituível por *'isso'*)."
    },
    {
      id: "fc-pt-1-2",
      bloco: "portugues",
      secaoId: "sub-pt-1",
      secaoTitulo: "Português Parte 1: Compreensão, Pronome Relativo 'QUE' e Pontuação",
      days: [13, 25],
      frente: "Português (Pontuação) — Qual a regra para pontuação de Aposto Explicativo e de Vocativo segundo a banca Cesgranrio (Q03)?",
      verso: "• **Aposto Explicativo:** Termo substantivo que explica ou identifica um substantivo anterior. Deve vir **OBRIGATORIAMENTE ISOLADO POR DUPLA VÍRGULA** (ou travessões):\n*'A minha avó, <u>Pedrina Perucchi</u>, era italiana.'* equivale a *'Os poemas, <u>textos de imensa beleza</u>, comovem.'*\n• **Vocativo:** Termo de chamamento/invocação. Deve vir **SEMPRE ISOLADO POR VÍRGULA** (*'Venha cá, <u>meu amigo</u>, para conversarmos'*)."
    },

    // --- DIA 14 (20/11): Português Parte 2 (Crase, Regência, Concordância, Correlação Verbal) ---
    {
      id: "fc-pt-2-1",
      bloco: "portugues",
      secaoId: "sub-pt-2",
      secaoTitulo: "Português Parte 2: Crase, Regência, Concordância e Correlação Verbal",
      days: [14, 25],
      frente: "Português (Correlação Verbal) — Qual a correlação em orações condicionais com hipótese contrafactual não realizada no passado (Q08)?",
      verso: "A Cesgranrio cobra a harmonia verbal clássica:\n• **Oração Principal:** Futuro do Pretérito Composto do Indicativo (*teria sido / teria feito*)\n• **Oração Subordinada Condicional ('se'):** Pretérito Mais-Que-Perfeito Composto do Subjuntivo (*se tivesse escrito / se houvesse feito*)\n• Exemplo padrão da prova: *'A obra também <strong>teria sido lida</strong> se a autora <strong>tivesse escrito</strong> seus contos em inglês.'*"
    },
    {
      id: "fc-pt-2-2",
      bloco: "portugues",
      secaoId: "sub-pt-2",
      secaoTitulo: "Português Parte 2: Crase, Regência, Concordância e Correlação Verbal",
      days: [14, 25],
      frente: "Português (Crase e Concordância de Impessoais) — Quando ocorre crase em regência nominal e qual a regra para os verbos 'Haver' e 'Fazer' (Q05 e Q09)?",
      verso: "• **Crase com Regência Nominal:** Ocorre fusão da preposição *a* (exigida por nome: *soneto dedicado a*) com o artigo feminino *a* (*a língua portuguesa*): *'soneto <u>à</u> língua portuguesa'*.\n• **Verbos Impessoais:** O verbo **Haver** (sentido de existir ou tempo transcorrido) e o verbo **Fazer** (tempo transcorrido ou clima) são estritamente **impessoais** e permanecem na **3ª pessoa do singular**:\n*'<u>Havia</u> muitos problemas'*, *'<u>Faz</u> cinco anos que me formei'*, *'<u>Deve haver</u> soluções'."
    },

    // =========================================================================
    // BLOCO 5: INSTALAÇÕES ELÉTRICAS E SUBESTAÇÕES
    // =========================================================================
    // --- DIA 15 (21/11): Tópico 5.1 (NBR 5410: Condutores, Queda de Tensão, DPS, Esquema TT) ---
    {
      id: "fc-5-1-1",
      bloco: "bloco5",
      secaoId: "sub-5-1",
      secaoTitulo: "5.1 a 5.3 NBR 5410: Condutores, Queda de Tensão, DPS e Esquema TT",
      days: [15, 23],
      frente: "5.1 NBR 5410: Proteção contra Sobrecarga — Qual é a regra normativa de coordenação entre a corrente de projeto ($I_L$), a corrente nominal do disjuntor ($I_d$) e a capacidade do condutor ($I_c$) (Q59)?",
      verso: "Pelo item 5.3.4.1 da NBR 5410, para proteção eficaz contra sobrecargas:\n$$I_L \\le I_d \\le I_c \\qquad \\text{e} \\qquad I_2 \\le 1,45 \\cdot I_c$$\nonde:\n• $I_L$ (ou $I_B$): corrente de projeto do circuito alimentado;\n• $I_d$ (ou $I_n$): corrente nominal do dispositivo de proteção (disjuntor/fusível);\n• $I_c$ (ou $I_z$): capacidade de condução de corrente corrigida dos cabos;\n• $I_2$: corrente convencional de atuação da proteção no tempo nominal."
    },
    {
      id: "fc-5-1-2",
      bloco: "bloco5",
      secaoId: "sub-5-1",
      secaoTitulo: "5.1 a 5.3 NBR 5410: Condutores, Queda de Tensão, DPS e Esquema TT",
      days: [15, 23],
      frente: "5.3 NBR 5410: Esquema TT e DPS sem Neutro — O que define o Esquema TT e como conectar os Dispositivos de Proteção contra Surtos (DPS) num padrão trifásico sem neutro (Q22 e Q30)?",
      verso: "• **Esquema TT:** O ponto de alimentação (neutro da concessionária/trafo) é aterrado em um eletrodo; e todas as massas metálicas da instalação consumidora são aterradas em um eletrodo **ELETRICAMENTE INDEPENDENTE** do eletrodo de alimentação.\n• **DPS em Sistema Trifásico sem Neutro (3 fases):** Conectam-se 3 DPS em paralelo, instalados cada um **entre cada fase e o BEP (Barramento de Equipotencialização Principal)** ou barra PE do quadro (Q30)."
    },

    // --- DIA 16 (22/11): Tópico 5.3 (Subestações AT, Wenner, SPDA NBR 5419) ---
    {
      id: "fc-5-3-1",
      bloco: "bloco5",
      secaoId: "sub-5-3",
      secaoTitulo: "5.4 a 5.6 Subestações, Malha de Terra (Wenner) e SPDA",
      days: [16, 23, 27],
      frente: "5.4 e 5.5 Método de Wenner e Seccionadoras de AT — Qual a fórmula de Wenner para resistividade aparente e a função da seccionadora com lâmina de terra (Q32 e Q57)?",
      verso: "• **Método dos 4 Eletrodos de Wenner:** Com 4 hastes alinhadas e igualmente espaçadas de distância $a$:\n$$\\rho(a) = 2 \\cdot \\pi \\cdot a \\cdot R \\; [\\Omega\\cdot\\text{m}]$$\nNa curva $\\rho(a) \\times a$, cada mudança de concavidade/patamar indica a transição para uma nova camada do solo estratificado.\n• **Seccionadora com Lâmina de Terra:** Manobrada **sem carga** após a abertura do disjuntor principal, com intertravamento mecânico/elétrico, garantindo isolamento visual e aterramento seguro dos condutores antes de intervenção de manutenção."
    },
    {
      id: "fc-5-3-2",
      bloco: "bloco5",
      secaoId: "sub-5-3",
      secaoTitulo: "5.4 a 5.6 Subestações, Malha de Terra (Wenner) e SPDA",
      days: [16, 23, 27],
      frente: "5.4 e 5.6 Arranjo 'Disjuntor e Meio' e SPDA NBR 5419 Nível I — Como é o arranjo Disjuntor e Meio e quais os parâmetros do SPDA Nível I (Q77 e Q78)?",
      verso: "• **Barramento Disjuntor e Meio (1,5 disjuntor/circuito):** 2 barramentos principais e **3 disjuntores para cada 2 saídas**. Permite manutenção de qualquer disjuntor ou de um barramento sem desligar nenhum circuito.\n• **SPDA Nível I (NBR 5419-3):**\n- Raio da Esfera Rolante: **$R = 20\\text{ m}$**\n- Malha de Faraday (gaiola): **$5 \\times 5\\text{ m}$**\n- Espaçamento médio entre descidas: **$10\\text{ m}$**\n(Nível II: $R=30\\text{m}$, malha $10\\times 10\\text{m}$, descidas $10\\text{m}$; Nível III: $R=45\\text{m}$, malha $15\\times 15\\text{m}$, descidas $15\\text{m}$; Nível IV: $R=60\\text{m}$, malha $20\\times 20\\text{m}$, descidas $20\\text{m}$)."
    },

    // =========================================================================
    // BLOCO 7: SISTEMAS DE CONTROLE
    // =========================================================================
    // --- DIA 17 (23/11): Tópico 7.1 (Sistemas 2ª ordem, Estabilidade SPE, Controlabilidade) ---
    {
      id: "fc-7-1-1",
      bloco: "bloco7",
      secaoId: "sub-7-1",
      secaoTitulo: "7.1 a 7.4 Sistemas de 2ª Ordem, Estabilidade e Controlabilidade",
      days: [17, 24, 28],
      frente: "7.3 Sistemas de 2ª Ordem — Dada a função de transferência $G(s) = \\frac{200}{2s^2 + 8s + 200}$, como calcular $\\omega_n$ e $\\zeta$ e classificar o amortecimento (Q68)?",
      verso: "1º) Normaliza-se o coeficiente de $s^2$ para 1 dividindo por 2:\n$$G(s) = \\frac{100}{s^2 + 4s + 100}$$\n2º) Compara-se com a forma padrão canônica mônica $\\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}$:\n$$\\omega_n^2 = 100 \\implies \\omega_n = 10\\text{ rad/s}$$\n$$2\\zeta\\omega_n = 4 \\implies 2\\zeta(10) = 4 \\implies \\zeta = 0,2$$\nComo $0 < \\zeta < 1$, a resposta temporal é oscilatória e **SUBAMORTECIDA**."
    },
    {
      id: "fc-7-1-2",
      bloco: "bloco7",
      secaoId: "sub-7-1",
      secaoTitulo: "7.1 a 7.4 Sistemas de 2ª Ordem, Estabilidade e Controlabilidade",
      days: [17, 24, 28],
      frente: "7.4 e 7.5 Estabilidade e Matriz de Controlabilidade — Qual a condição de estabilidade no plano $s$ e o critério de posto da matriz de controlabilidade $\\mathcal{C}$ (Q47 e Q69)?",
      verso: "• **Estabilidade Linear:** Todos os polos de malha fechada devem situar-se estritamente no **Semiplano Esquerdo (SPE)** do plano complexo $s$ (parte real estritamente negativa, $\\operatorname{Re}(s) < 0$).\n• Um polo na origem ($s=0$) anula o termo independente da equação característica.\n• **Matriz de Controlabilidade:** $\\mathcal{C} = [B \\quad AB \\quad \\dots \\quad A^{n-1}B]$. O sistema é completamente controlável se e somente se o posto de $\\mathcal{C}$ for $n$ (ou seja, $\\det(\\mathcal{C}) \\neq 0$)."
    },

    // --- DIA 18 (24/11): Tópico 7.5 (Espaço de Estados para G(s), Transformada Z) ---
    {
      id: "fc-7-5-1",
      bloco: "bloco7",
      secaoId: "sub-7-5",
      secaoTitulo: "7.5 e 7.6 Espaço de Estados e Transformada Z Discreta",
      days: [18, 24, 28],
      frente: "7.5 Espaço de Estados para Função de Transferência — Como obter $G(s)$ a partir das matrizes $(A, B, C, D)$ e o atalho para matriz companheira (Q45 e Q70)?",
      verso: "$$G(s) = C(sI - A)^{-1}B + D = \\frac{C \\cdot \\operatorname{adj}(sI - A) \\cdot B}{\\det(sI - A)} + D$$\n• **Atalho Cesgranrio para Matriz Companheira $2\\times 2$:**\nPara $A = \\begin{bmatrix} a & b \\\\ 1 & 0 \\end{bmatrix}$, o polinômio característico no denominador é:\n$$\\det(sI - A) = s(s-a) - b = s^2 - as - b$$"
    },
    {
      id: "fc-7-5-2",
      bloco: "bloco7",
      secaoId: "sub-7-5",
      secaoTitulo: "7.5 e 7.6 Espaço de Estados e Transformada Z Discreta",
      days: [18, 24, 28],
      frente: "7.6 Transformada Z e Amostras Temporais — Dada $G(z) = \\frac{3z^2 - 3z}{z^2 - 6z + 5}$, como obter as primeiras amostras $y(0), y(1), y(2)$ à resposta ao impulso unitário (Q46)?",
      verso: "1º) Fatorando numerador e denominador:\n$$G(z) = \\frac{3z(z-1)}{(z-1)(z-5)} = \\frac{3z}{z-5} = \\frac{3}{1 - 5z^{-1}}$$\n2º) Como $\\mathcal{Z}^{-1}\\left\\{\\frac{1}{1 - a z^{-1}}\\right\\} = a^n u(n)$:\n$$y(n) = 3 \\cdot 5^n u(n)$$\n3º) Calculando as primeiras amostras:\n• $n = 0 \\implies y(0) = 3 \\cdot 5^0 = \\mathbf{3}$\n• $n = 1 \\implies y(1) = 3 \\cdot 5^1 = \\mathbf{15}$\n• $n = 2 \\implies y(2) = 3 \\cdot 5^2 = \\mathbf{75}$"
    },

    // =========================================================================
    // BLOCO 1: MATEMÁTICA APLICADA
    // =========================================================================
    // --- DIA 19 (25/11): Tópico 1.1 (Determinantes, Vetores, Fase 2j, Laplace) ---
    {
      id: "fc-1-1-1",
      bloco: "bloco1",
      secaoId: "sub-1-1",
      secaoTitulo: "1.1 a 1.3 Laplace, Determinantes, Vetores e Complexos",
      days: [19, 22, 28],
      frente: "1.1 Propriedades de Determinantes — Se $A$ é matriz $n \\times n$ com $n=3$ e $\\det(A) = 4$, quanto valem $\\det(2A)$ e $\\det(A^{-1})$ (Q65)?",
      verso: "Pelas propriedades clássicas cobradas pela Cesgranrio:\n• $\\det(k \\cdot A) = k^n \\cdot \\det(A) \\implies \\det(2A) = 2^3 \\cdot \\det(A) = 8 \\times 4 = \\mathbf{32}$\n• $\\det(A^{-1}) = \\frac{1}{\\det(A)} = \\frac{1}{4} = \\mathbf{0,25}$\n• $\\det(A^T) = \\det(A) = \\mathbf{4}$\n• $\\det(A \\cdot B) = \\det(A) \\cdot \\det(B)$"
    },
    {
      id: "fc-1-1-2",
      bloco: "bloco1",
      secaoId: "sub-1-1",
      secaoTitulo: "1.1 a 1.3 Laplace, Determinantes, Vetores e Complexos",
      days: [19, 22, 28],
      frente: "1.2 e 1.3 Vetores e Fase em Números Complexos — Quando $\\vec{A} = \\vec{B} \\times \\vec{v}$, qual a condição para órbita circular e como calcular a fase de $G(s) = \\frac{5(s-2)}{s+2}$ em $s=2j$ (Q64 e Q71)?",
      verso: "• **Movimento Circular:** Se $\\vec{B} \\cdot \\vec{v}_0 = 0$ (perpendiculares), a aceleração gerada pelo produto vetorial é centrípeta pura, descrevendo trajetória circular com raio $R = \\frac{|\\vec{v}|}{|\\vec{B}|}$.\n• **Fase em $s = 2j$:**\n$$\\angle G(2j) = \\angle(5) + \\angle(-2 + 2j) - \\angle(2 + 2j)$$\nComo $(-2+2j)$ está no 2º quadrante ($\\theta = 135^\\circ$) e $(2+2j)$ está no 1º quadrante ($\\theta = 45^\\circ$):\n$$\\angle G(2j) = 0^\\circ + 135^\\circ - 45^\\circ = \\mathbf{+90^\\circ}$$\n(Não caia na pegadinha de achar que $\\operatorname{tg}(-1) = -45^\\circ$; considere o quadrante real!)."
    },
    {
      id: "fc-1-1-3",
      bloco: "bloco1",
      secaoId: "sub-1-1",
      secaoTitulo: "1.1 a 1.3 Laplace, Determinantes, Vetores e Complexos",
      days: [19, 22, 28],
      frente: "1.1 Transformada de Laplace Inversa por Frações Parciais — Como obter o coeficiente $K_1$ do polo simples $(s+a)$ em $F(s) = \\frac{N(s)}{(s+a)(s+b)}$?",
      verso: "Aplica-se o método dos resíduos de Heaviside:\n$$K_1 = \\left. (s + a) \\cdot F(s) \\right|_{s = -a} = \\frac{N(-a)}{-a + b}$$\nE pela propriedade da transformada inversa:\n$$\\mathcal{L}^{-1}\\left\\{ \\frac{K_1}{s+a} + \\frac{K_2}{s+b} \\right\\} = (K_1 e^{-at} + K_2 e^{-bt}) \\cdot u(t)$$"
    },

    // =========================================================================
    // BLOCO 8: NR-10 E LEI 14.133/2021
    // =========================================================================
    // --- DIA 20 (26/11): Tópico 8.1 (NR-10 SICAPS, Habilitação; Pregão Lei 14.133) ---
    {
      id: "fc-8-1-1",
      bloco: "bloco8",
      secaoId: "sub-8-1",
      secaoTitulo: "8.1 e 8.2 NR-10 e Nova Lei de Licitações (Lei 14.133/2021)",
      days: [20, 24, 29],
      frente: "8.2 NR-10: Etapas de Desenergização — Qual é o mnemônico oficial dos 6 passos obrigatórios de desenergização da NR-10 (item 10.5.1)?",
      verso: "Mnemônico **S-I-C-A-P-S**:\n1. **S**eccionamento (abertura dos dispositivos);\n2. **I**mpedimento de reenergização (travamento/bloqueio com cadeado e etiqueta);\n3. **C**onstatação da ausência de tensão com detector testado;\n4. Instalação de **A**terramento temporário com equipotencialização dos condutores;\n5. **P**roteção dos elementos energizados existentes na zona controlada adjacente;\n6. **S**inalização de impedimento de reenergização."
    },
    {
      id: "fc-8-1-2",
      bloco: "bloco8",
      secaoId: "sub-8-1",
      secaoTitulo: "8.1 e 8.2 NR-10 e Nova Lei de Licitações (Lei 14.133/2021)",
      days: [20, 24, 29],
      frente: "8.1 e 8.2 NR-10 e Lei 14.133/2021 — Quem pode ministrar treinamento da NR-10 e qual a modalidade licitatória obrigatória para bens e serviços comuns de engenharia (Q53 e Q58)?",
      verso: "• **NR-10 (Treinamento - Q53):** Apenas o profissional **legalmente habilitado** (graduado com registro ativo no CREA/CFT) e **autorizado** pela empresa pode ministrar treinamentos e responsabilizar-se pelo prontuário.\n• **Lei 14.133/2021 (Pregão - Q58):** Modalidade **OBRIGATÓRIA** para aquisição de **bens e serviços comuns** (aqueles cujos padrões de desempenho e qualidade podem ser objetivamente definidos pelo edital por especificações usuais de mercado, como aquisição de EPIs, condutores padronizados e instrumentos normatizados).\n• **Concorrência:** Para obras e serviços especiais de engenharia."
    },

    // =========================================================================
    // CONHECIMENTOS BÁSICOS: LÍNGUA INGLESA
    // =========================================================================
    // --- DIA 21 (27/11): Tópico Inglês Instrumental (Discourse Markers, Synonyms, Reference) ---
    {
      id: "fc-en-1-1",
      bloco: "ingles",
      secaoId: "sub-en-1",
      secaoTitulo: "Língua Inglesa (Inglês Instrumental Cesgranrio)",
      days: [21, 25],
      frente: "Inglês (Conectivos e Discourse Markers) — Quais os valores semânticos de 'However', 'Although / Even though', 'Therefore / Thus' e 'Moreover' na banca Cesgranrio?",
      verso: "• <code>However / Yet / Nonetheless</code> = **Opposition / Contrast** (Contudo, no entanto)\n• <code>Although / Even though / Whereas</code> = **Concession / Contrast** (Embora, ao passo que)\n• <code>Therefore / Thus / Hence / Thereby</code> = **Conclusion / Consequence / Result** (Portanto, dessa forma)\n• <code>Moreover / Furthermore / In addition</code> = **Addition** (Além disso, outrossim)\n• <code>Despite / In spite of</code> = **Concession** (+ substantivo ou verbo em -ing)."
    },
    {
      id: "fc-en-1-2",
      bloco: "ingles",
      secaoId: "sub-en-1",
      secaoTitulo: "Língua Inglesa (Inglês Instrumental Cesgranrio)",
      days: [21, 25],
      frente: "Inglês (Sinônimos Técnicos e Pronomes Relativos) — Quais são as equivalências semânticas de 'pivotal', 'state-of-the-art', 'low latency' e a quem se refere o pronome 'which'?",
      verso: "• <code>pivotal</code> = **essential / crucial / vital**\n• <code>state-of-the-art</code> = **cutting-edge / up-to-date / advanced**\n• <code>low latency</code> = **minimal delay / high response speed**\n• <code>to curb</code> = **to restrain / to reduce / to limit**\n• **Pronome Relativo <code>which</code>:** Retoma o sintagma nominal antecedente imediato (ex.: *'...greenhouse gas emissions, <u>of which</u> 90% come from...'* $\\implies$ refere-se a *greenhouse gas emissions*)."
    }
  ];

  function getFlashcardsForGuidedDay(dayNum) {
    if (showAllFlashcardsInGuided) return FLASHCARDS_REVISAO;
    const filtered = FLASHCARDS_REVISAO.filter(
      (c) => Array.isArray(c.days) && c.days.includes(dayNum)
    );
    if (filtered.length > 0) return filtered;
    const plano = window.PLANO_30_DIAS || [];
    const dayObj = plano.find((d) => d.dia === dayNum);
    if (dayObj && dayObj.teoriaId) {
      const byBlock = FLASHCARDS_REVISAO.filter((c) => c.bloco === dayObj.teoriaId);
      if (byBlock.length > 0) return byBlock;
    }
    return FLASHCARDS_REVISAO;
  }

  function getFlashcardsForTheoryBlock(blockId) {
    const byBlock = FLASHCARDS_REVISAO.filter((c) => c.bloco === blockId);
    return byBlock.length > 0 ? byBlock : FLASHCARDS_REVISAO;
  }

  let currentFlashcardIdx = 0;
  let flashcardShowingBack = false;

  // Data local real (evita o bug de toISOString() que usa UTC e vira o dia às 21h no Brasil UTC-3)
  function getLocalTodayISO() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getLocalTodayLabel() {
    const dias = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ];
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${dias[now.getDay()]}, ${dd}/${mm}`;
  }

  function getTodayOrNextPlanDay() {
    const plano = window.PLANO_30_DIAS || [];
    const todayISO = getLocalTodayISO();
    const todayEntry = plano.find((d) => d.dataISO === todayISO);
    if (todayEntry && !state.completedDays.includes(todayEntry.dia)) {
      return todayEntry;
    }
    const nextPending = plano.find((d) => !state.completedDays.includes(d.dia));
    return nextPending || todayEntry || plano[plano.length - 1] || plano[0];
  }

  function getOverdueDays() {
    const plano = window.PLANO_30_DIAS || [];
    const todayISO = getLocalTodayISO();
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

  function extractTheoryForDay(modObj, dayNum) {
    if (!modObj || !modObj.conteudoHTML) return "";
    if (showFullBlockInGuided) return modObj.conteudoHTML;
    try {
      const temp = document.createElement("div");
      temp.innerHTML = modObj.conteudoHTML;
      const sections = Array.from(temp.querySelectorAll(".theory-subtopic"));
      if (sections.length === 0) return modObj.conteudoHTML;
      const matched = sections.filter((sec) => {
        const daysAttr = (sec.getAttribute("data-days") || "")
          .split(",")
          .map((x) => parseInt(x.trim(), 10));
        return daysAttr.includes(dayNum);
      });
      if (matched.length === 0) return modObj.conteudoHTML;
      return matched.map((sec) => sec.outerHTML).join("\n");
    } catch (e) {
      return modObj.conteudoHTML;
    }
  }

  function updateKPIStatsAndTables() {
    const plano = window.PLANO_30_DIAS || [];
    const daysDone = state.completedDays.length;
    const hoursStudied = (daysDone * 0.5).toFixed(1).replace(".0", "");

    const answeredValues = Object.values(state.answeredQuestions);
    const totalAnswered = answeredValues.length;
    const totalCorrect = answeredValues.filter((a) => a.correct).length;
    const accuracy =
      totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

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

    renderBlockPerformance();
  }

  function bindQuestionCardEvents(containerEl, onUpdateCallback) {
    if (!containerEl) return;
    containerEl.querySelectorAll("[data-q-option]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qId = parseInt(this.getAttribute("data-q-id"), 10);
        const letter = this.getAttribute("data-q-option");
        handleAnswerQuestion(qId, letter, onUpdateCallback);
      });
    });

    containerEl.querySelectorAll("[data-q-bookmark]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qId = parseInt(this.getAttribute("data-q-bookmark"), 10);
        const idx = state.bookmarkedQuestions.indexOf(qId);
        if (idx >= 0) state.bookmarkedQuestions.splice(idx, 1);
        else state.bookmarkedQuestions.push(qId);
        saveState();
        if (typeof onUpdateCallback === "function") onUpdateCallback();
        else renderQuestoes();
      });
    });

    containerEl.querySelectorAll("[data-q-toggle-exp]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qId = this.getAttribute("data-q-toggle-exp");
        const expBox = document.getElementById("exp-box-" + qId);
        if (expBox) expBox.classList.toggle("visible");
      });
    });

    containerEl.querySelectorAll("[data-q-reset]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qId = parseInt(this.getAttribute("data-q-reset"), 10);
        delete state.answeredQuestions[qId];
        saveState();
        if (typeof onUpdateCallback === "function") onUpdateCallback();
        else renderQuestoes();
      });
    });
  }

  function renderDashboard() {
    const plano = window.PLANO_30_DIAS || [];
    const modulos = window.DADOS_TEORIA || [];
    const heroContainer = document.getElementById("hero-mission-container");
    if (!heroContainer || plano.length === 0) return;

    if (!guidedDayNum) {
      const nextDayObj = getTodayOrNextPlanDay();
      guidedDayNum = nextDayObj ? nextDayObj.dia : 1;
    }

    const missionDay =
      plano.find((d) => d.dia === guidedDayNum) || getTodayOrNextPlanDay();
    guidedDayNum = missionDay.dia;

    const isDone = state.completedDays.includes(missionDay.dia);
    const activeMod =
      modulos.find((m) => m.id === missionDay.teoriaId) || modulos[0];

    const dayQuestions = TODAS_QUESTOES.filter((q) =>
      (missionDay.questoesIds || []).includes(q.id)
    );
    const solvedInDay = dayQuestions.filter(
      (q) => state.answeredQuestions[q.id]
    ).length;
    const correctInDay = dayQuestions.filter(
      (q) =>
        state.answeredQuestions[q.id] && state.answeredQuestions[q.id].correct
    ).length;

    let stageHTML = "";

    if (guidedStep === 1) {
      // PASSO 1: LEITURA TEÓRICA FOCADA NO CONTEÚDO DO DIA
      const extractedHTML = extractTheoryForDay(activeMod, missionDay.dia);
      const qCount = dayQuestions.length;

      stageHTML = `
        <div class="linear-stage-card">
          <div class="linear-focus-banner">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px;">
              <strong>ETAPA 1 DE 3 · LEITURA TEÓRICA DIRIGIDA (10 MINUTOS)</strong>
              <button class="btn btn-secondary btn-sm" id="btn-guided-toggle-full-theory" style="padding:3px 9px;font-size:0.74rem;">
                ${showFullBlockInGuided ? "Mostrar apenas o recorte de hoje" : "Ver capítulo completo do bloco"}
              </button>
            </div>
            <div><strong>O que focar nesta leitura:</strong> ${missionDay.focoTeoria}</div>
          </div>

          <div class="theory-body guided-theory-extract" id="guided-theory-body">
            ${extractedHTML}
          </div>

          <div class="linear-next-cta-box">
            <div class="linear-next-cta-text">
              <h4>Fim da Leitura Teórica — Vamos praticar este conteúdo?</h4>
              <p>${
                qCount > 0
                  ? `Avance agora para as <strong>${qCount} questões selecionadas</strong> especificamente sobre <em>${missionDay.titulo}</em>.`
                  : "Avance para a síntese final de revisão deste dia."
              }</p>
            </div>
            <button class="btn btn-primary btn-lg" id="btn-guided-goto-step2">
              ${
                qCount > 0
                  ? `Ir para as ${qCount} Questões deste Conteúdo →`
                  : "Ir para a Revisão Final →"
              }
            </button>
          </div>
        </div>
      `;
    } else if (guidedStep === 2) {
      // PASSO 2: QUESTÕES PRÁTICAS RELATIVAS AO CONTEÚDO LIDO
      stageHTML = `
        <div class="linear-stage-card">
          <div class="linear-focus-banner" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
            <div>
              <strong>ETAPA 2 DE 3 · QUESTÕES RELATIVAS AO CONTEÚDO LIDO (15 MINUTOS)</strong>
              <div id="guided-q-progress-label">Progresso neste assunto: <strong>${solvedInDay} de ${dayQuestions.length} respondidas</strong> (${correctInDay} acertos). Clique em uma alternativa (A–E) para ver a resolução passo a passo.</div>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-guided-back-step1">← Rever Leitura Teórica</button>
          </div>

          <div id="guided-questions-list">
            ${
              dayQuestions.length > 0
                ? dayQuestions.map((q) => buildQuestionCardHTML(q)).join("")
                : `<p style="color:var(--text-secondary);">Dia dedicado à execução da Prova Oficial (sem questões avulsas pendentes).</p>`
            }
          </div>

          <div class="linear-next-cta-box">
            <div class="linear-next-cta-text">
              <h4>Questões do Assunto Finalizadas (${solvedInDay}/${dayQuestions.length} respondidas)</h4>
              <p>Avance para os 5 minutos finais de fixação das fórmulas-chave e conclusão do Dia ${missionDay.dia}.</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary" id="btn-guided-back-step1-bottom">← Voltar à Teoria</button>
              <button class="btn btn-primary btn-lg" id="btn-guided-goto-step3">
                Ir para a Revisão Rápida (Passo 3) →
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      // PASSO 3: REVISÃO DE FÓRMULAS (5 MIN) E CONCLUSÃO DO DIA
      const nextDayNum = missionDay.dia < plano.length ? missionDay.dia + 1 : 1;
      stageHTML = `
        <div class="linear-stage-card">
          <div class="linear-focus-banner">
            <strong>ETAPA 3 DE 3 · SÍNTESE DE FIXAÇÃO E FECHAMENTO (5 MINUTOS)</strong>
            <div style="margin-top:4px;"><strong>Resumo obrigatório para memorizar hoje:</strong> ${missionDay.focoRevisao}</div>
          </div>

          <!-- Flashcards da Seção (Card Superior) -->
          <div class="card flashcards-card-section" style="margin-bottom:18px;">
            <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span>Flashcards da Seção</span>
                <span class="badge badge-blue" id="flashcard-section-badge"></span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <button class="btn btn-secondary btn-sm" id="btn-fc-toggle-scope" style="font-size:0.72rem;padding:2px 8px;">
                  ${showAllFlashcardsInGuided ? "Ver apenas da seção de hoje" : "Ver todos os flashcards"}
                </button>
                <span class="badge badge-yellow" id="flashcard-counter-badge">01 / 01</span>
              </div>
            </div>
            <div class="flashcard-wrapper">
              <div
                id="flashcard-box"
                class="flashcard-surface"
                title="Clique para girar o cartão (ver resposta / fórmula)"
              >
                <div class="flashcard-flip-hint">
                  <span class="flashcard-flip-icon">↻</span>
                  <span>Girar</span>
                </div>
                <div class="flashcard-side-tag" id="flashcard-side-label">FRENTE · PERGUNTA TÉCNICA (CLIQUE PARA VIRAR)</div>
                <div class="flashcard-body-text" id="flashcard-text"></div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;gap:8px;margin-top:12px;">
              <button class="btn btn-secondary btn-sm" id="btn-fc-prev">Anterior</button>
              <button class="btn btn-yellow btn-sm" id="btn-fc-flip" style="flex:1;">↻ Girar Cartão</button>
              <button class="btn btn-primary btn-sm" id="btn-fc-next">Próximo</button>
            </div>
          </div>

          <!-- Bloco de Notas e Fórmulas Pessoais (Abaixo dos Flashcards) -->
          <div class="card notes-card-wrapper" style="margin-bottom:18px;">
            <div class="card-title notes-header-bar" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span>Bloco de Notas e Fórmulas</span>
                <span class="badge badge-blue" id="notes-save-badge">Salvo Auto</span>
              </div>
              <div class="notes-mode-pills" role="tablist">
                <button type="button" class="notes-pill-btn ${personalNotesMode === "edit" ? "active" : ""}" id="btn-notes-mode-edit" title="Modo de Edição (digitar texto e fórmulas)">✏️ Editar</button>
                <button type="button" class="notes-pill-btn ${personalNotesMode === "preview" ? "active" : ""}" id="btn-notes-mode-preview" title="Modo Visualização Renderizada (KaTeX LaTeX)">👁️ Visualizar</button>
                <button type="button" class="notes-pill-btn ${personalNotesMode === "split" ? "active" : ""}" id="btn-notes-mode-split" title="Modo Dividido (Editor + Preview em tempo real)">◫ Dividir</button>
              </div>
            </div>

            <!-- Barra Rápida de Inserção de LaTeX (visível ao editar) -->
            <div class="notes-math-toolbar ${personalNotesMode === "preview" ? "hidden" : ""}" id="notes-math-toolbar">
              <span class="math-tool-label">LATEX:</span>
              <button type="button" class="btn-math-insert" data-snippet="$$ $$" title="Inserir Bloco de Fórmula Centralizada">$$ Bloco $$</button>
              <button type="button" class="btn-math-insert" data-snippet="$ $" title="Inserir Fórmula em Linha">$ Linha $</button>
              <button type="button" class="btn-math-insert" data-snippet="\\frac{a}{b}" title="Fração">\frac{a}{b}</button>
              <button type="button" class="btn-math-insert" data-snippet="\\sqrt{x}" title="Raiz Quadrada">\sqrt{x}</button>
              <button type="button" class="btn-math-insert" data-snippet="Z_{pu}" title="Subscrito">Z_{pu}</button>
              <button type="button" class="btn-math-insert" data-snippet="\\cdot" title="Multiplicação">\cdot</button>
              <button type="button" class="btn-math-insert" data-snippet="\\le" title="Menor ou Igual">\le</button>
              <button type="button" class="btn-math-insert" data-snippet="\\angle 120^\\circ" title="Ângulo Fasorial">\angle 120°</button>
            </div>

            <!-- Container do Editor e da Visualização KaTeX -->
            <div class="notes-content-container mode-${personalNotesMode}" id="notes-content-container">
              <div class="notes-editor-pane" id="notes-editor-pane">
                <textarea
                  id="personal-notes-area"
                  class="form-input personal-notes-textarea"
                  placeholder="Anote aqui fórmulas e observações usando LaTeX:&#10;• Em linha: $Z_{pu} = 0,25$&#10;• Em bloco: $$P = \sqrt{3} \cdot V_L \cdot I_L \cdot \cos\varphi$$&#10;• Negrito: **termo**"
                  spellcheck="false"
                ></textarea>
              </div>

              <div
                class="personal-notes-preview-box"
                id="personal-notes-preview"
                title="Duplo clique para alternar para edição"
              ></div>
            </div>
          </div>

          <div class="linear-next-cta-box">
            <div class="linear-next-cta-text">
              <h4>Pronto para concluir o Dia ${missionDay.dia} (${missionDay.titulo})?</h4>
              <p>Desempenho nas questões do tema: <strong>${correctInDay} acertos em ${solvedInDay} respondidas</strong> (total de ${dayQuestions.length} questões).</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary" id="btn-guided-back-step2">← Rever Questões</button>
              <button class="btn btn-primary btn-lg" id="btn-guided-complete-and-next">
                ✓ Concluir Dia ${missionDay.dia} e Ir para o Dia ${nextDayNum} →
              </button>
            </div>
          </div>
        </div>
      `;
    }

    const todayISO = getLocalTodayISO();
    const isMissionToday = missionDay.dataISO === todayISO;
    const todayPlanEntry = plano.find((d) => d.dataISO === todayISO);

    heroContainer.innerHTML = `
      <div class="guided-shell">
        <!-- CABEÇALHO DO DIA ATUAL -->
        <div class="guided-top-bar">
          <div>
            <div class="guided-day-meta">
              <span class="guided-day-kicker">
                DIA ${String(missionDay.dia).padStart(2, "0")} DE 30 · ${
                  isMissionToday
                    ? `HOJE: ${missionDay.data} (${missionDay.diaSemana})`
                    : `Meta agendada: ${missionDay.data} (${missionDay.diaSemana}) · Hoje é ${getLocalTodayLabel()}`
                }
              </span>
              <span class="badge badge-blue">${missionDay.bloco}</span>
              <span class="badge ${isDone ? "badge-green" : "badge-yellow"}">${isDone ? "✓ Dia Concluído" : "Em Estudo"}</span>
            </div>
            <div class="guided-day-title">${missionDay.titulo}</div>
          </div>
          <div class="guided-day-nav">
            <button class="btn btn-secondary btn-sm" id="btn-guided-prev-day" ${missionDay.dia <= 1 ? "disabled" : ""}>← Dia Anterior</button>
            ${
              todayPlanEntry && todayPlanEntry.dia !== missionDay.dia
                ? `<button class="btn btn-secondary btn-sm" id="btn-guided-goto-today">Ir p/ Hoje (Dia ${String(todayPlanEntry.dia).padStart(2, "0")})</button>`
                : ""
            }
            <button class="btn btn-secondary btn-sm" id="btn-guided-open-calendar">Ver 30 Dias</button>
            <button class="btn btn-secondary btn-sm" id="btn-guided-next-day" ${missionDay.dia >= plano.length ? "disabled" : ""}>Próximo Dia →</button>
          </div>
        </div>

        <!-- BARRA LINEAR DE 3 ETAPAS (STEPPER) -->
        <div class="linear-stepper">
          <button class="linear-step-btn ${guidedStep === 1 ? "active" : "done"}" data-guided-step="1">
            <span class="linear-step-num">${guidedStep > 1 ? "✓" : "1"}</span>
            <span class="linear-step-info">
              <span class="linear-step-title">1. Leitura Teórica</span>
              <span class="linear-step-sub">10 min · Conceitos e Fórmulas</span>
            </span>
          </button>
          <button class="linear-step-btn ${guidedStep === 2 ? "active" : guidedStep > 2 ? "done" : ""}" data-guided-step="2">
            <span class="linear-step-num">${guidedStep > 2 ? "✓" : "2"}</span>
            <span class="linear-step-info">
              <span class="linear-step-title">2. Questões do Conteúdo</span>
              <span class="linear-step-sub">15 min · ${solvedInDay}/${dayQuestions.length} respondidas</span>
            </span>
          </button>
          <button class="linear-step-btn ${guidedStep === 3 ? "active" : isDone ? "done" : ""}" data-guided-step="3">
            <span class="linear-step-num">${isDone ? "✓" : "3"}</span>
            <span class="linear-step-info">
              <span class="linear-step-title">3. Revisão &amp; Conclusão</span>
              <span class="linear-step-sub">5 min · Fixar e Avançar</span>
            </span>
          </button>
        </div>

        <!-- CONTEÚDO DA ETAPA ATIVA -->
        ${stageHTML}
      </div>
    `;

    // Renderiza matemática LaTeX se estiver na Etapa 1
    if (guidedStep === 1) {
      typesetMathInElement(document.getElementById("guided-theory-body"));
      setupVisualCardControls(document.getElementById("guided-theory-body"));
    }

    // Se estiver na Etapa 2, conecta os eventos das questões do dia
    if (guidedStep === 2) {
      const qListEl = document.getElementById("guided-questions-list");
      bindQuestionCardEvents(qListEl, function () {
        // Atualiza contadores no topo do Passo 2 sem perder posição de rolagem
        const updatedSolved = dayQuestions.filter(
          (q) => state.answeredQuestions[q.id]
        ).length;
        const updatedCorrect = dayQuestions.filter(
          (q) =>
            state.answeredQuestions[q.id] &&
            state.answeredQuestions[q.id].correct
        ).length;
        const lbl = document.getElementById("guided-q-progress-label");
        if (lbl) {
          lbl.innerHTML = `Progresso neste assunto: <strong>${updatedSolved} de ${dayQuestions.length} respondidas</strong> (${updatedCorrect} acertos). Clique em uma alternativa (A–E) para ver a resolução passo a passo.`;
        }
      });
    }

    // Se estiver na Etapa 3, conecta Flashcards e Notas Pessoais
    if (guidedStep === 3) {
      const notesTextarea = document.getElementById("personal-notes-area");
      if (notesTextarea) {
        notesTextarea.value = state.personalNotes || "";
        notesTextarea.addEventListener("input", function () {
          state.personalNotes = this.value;
          saveState();
          updateNotesPreview();
          const badge = document.getElementById("notes-save-badge");
          if (badge) {
            badge.textContent = "✓ Salvo";
            badge.className = "badge badge-green";
            clearTimeout(notesTextarea._badgeTimer);
            notesTextarea._badgeTimer = setTimeout(() => {
              if (badge) {
                badge.textContent = "Salvo Auto";
                badge.className = "badge badge-blue";
              }
            }, 1200);
          }
        });
      }

      // Seletor de Modos do Bloco de Notas: Editar / Visualizar / Dividir
      document
        .getElementById("btn-notes-mode-edit")
        ?.addEventListener("click", () => setPersonalNotesMode("edit"));
      document
        .getElementById("btn-notes-mode-preview")
        ?.addEventListener("click", () => setPersonalNotesMode("preview"));
      document
        .getElementById("btn-notes-mode-split")
        ?.addEventListener("click", () => setPersonalNotesMode("split"));

      // Clique na área renderizada para abrir modo de edição / divisão rapidamente
      document
        .getElementById("personal-notes-preview")
        ?.addEventListener("click", () => {
          if (personalNotesMode === "preview") {
            setPersonalNotesMode("split");
          }
        });
      document
        .getElementById("personal-notes-preview")
        ?.addEventListener("dblclick", () => setPersonalNotesMode("edit"));

      // Botões da barra rápida de snippets LaTeX
      document.querySelectorAll(".btn-math-insert").forEach((btn) => {
        btn.addEventListener("click", function () {
          const snippet = this.getAttribute("data-snippet");
          if (snippet) insertSnippetIntoNotes(snippet);
        });
      });

      // Aplica o modo inicial e renderiza as fórmulas LaTeX
      setPersonalNotesMode(personalNotesMode || "split");
      renderFlashcardUI();
      document
        .getElementById("flashcard-box")
        ?.addEventListener("click", flipGuidedFlashcardWithSpin);
      document
        .getElementById("btn-fc-flip")
        ?.addEventListener("click", flipGuidedFlashcardWithSpin);
      document
        .getElementById("btn-fc-prev")
        ?.addEventListener("click", prevGuidedFlashcard);
      document
        .getElementById("btn-fc-next")
        ?.addEventListener("click", nextGuidedFlashcard);
      document
        .getElementById("btn-fc-toggle-scope")
        ?.addEventListener("click", function () {
          showAllFlashcardsInGuided = !showAllFlashcardsInGuided;
          currentFlashcardIdx = 0;
          flashcardShowingBack = false;
          renderFlashcardUI();
        });
    }

    // Eventos de navegação entre Passos (1 -> 2 -> 3) e entre Dias
    heroContainer.querySelectorAll("[data-guided-step]").forEach((btn) => {
      btn.addEventListener("click", function () {
        guidedStep = parseInt(this.getAttribute("data-guided-step"), 10) || 1;
        renderDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    document
      .getElementById("btn-guided-toggle-full-theory")
      ?.addEventListener("click", function () {
        showFullBlockInGuided = !showFullBlockInGuided;
        renderDashboard();
      });

    document
      .getElementById("btn-guided-goto-step2")
      ?.addEventListener("click", function () {
        guidedStep = dayQuestions.length > 0 ? 2 : 3;
        renderDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    document
      .getElementById("btn-guided-back-step1")
      ?.addEventListener("click", function () {
        guidedStep = 1;
        renderDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    document
      .getElementById("btn-guided-back-step1-bottom")
      ?.addEventListener("click", function () {
        guidedStep = 1;
        renderDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    document
      .getElementById("btn-guided-goto-step3")
      ?.addEventListener("click", function () {
        guidedStep = 3;
        renderDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    document
      .getElementById("btn-guided-back-step2")
      ?.addEventListener("click", function () {
        guidedStep = 2;
        renderDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    document
      .getElementById("btn-guided-complete-and-next")
      ?.addEventListener("click", function () {
        if (!state.completedDays.includes(missionDay.dia)) {
          state.completedDays.push(missionDay.dia);
        }
        if (
          missionDay.teoriaId &&
          !state.studiedTheory.includes(missionDay.teoriaId)
        ) {
          state.studiedTheory.push(missionDay.teoriaId);
        }
        saveState();
        if (missionDay.dia < plano.length) {
          guidedDayNum = missionDay.dia + 1;
        }
        guidedStep = 1;
        showFullBlockInGuided = false;
        renderDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    document
      .getElementById("btn-guided-prev-day")
      ?.addEventListener("click", function () {
        if (guidedDayNum > 1) {
          guidedDayNum--;
          guidedStep = 1;
          showFullBlockInGuided = false;
          renderDashboard();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });

    document
      .getElementById("btn-guided-next-day")
      ?.addEventListener("click", function () {
        if (guidedDayNum < plano.length) {
          guidedDayNum++;
          guidedStep = 1;
          showFullBlockInGuided = false;
          renderDashboard();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });

    document
      .getElementById("btn-guided-goto-today")
      ?.addEventListener("click", function () {
        if (todayPlanEntry) {
          guidedDayNum = todayPlanEntry.dia;
          guidedStep = 1;
          showFullBlockInGuided = false;
          renderDashboard();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });

    document
      .getElementById("btn-guided-open-calendar")
      ?.addEventListener("click", function () {
        switchTab("plano");
      });

    updateKPIStatsAndTables();
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

  let isGuidedFlashcardSpinning = false;
  function flipGuidedFlashcardWithSpin() {
    if (isGuidedFlashcardSpinning) return;
    const box = document.getElementById("flashcard-box");
    if (!box) {
      flashcardShowingBack = !flashcardShowingBack;
      renderFlashcardUI();
      return;
    }
    isGuidedFlashcardSpinning = true;
    box.classList.remove("anim-slide-next", "anim-slide-prev");
    box.classList.add("anim-spinning");

    setTimeout(() => {
      flashcardShowingBack = !flashcardShowingBack;
      renderFlashcardUI();
    }, 225);

    setTimeout(() => {
      box.classList.remove("anim-spinning");
      isGuidedFlashcardSpinning = false;
    }, 450);
  }

  function nextGuidedFlashcard() {
    const deck = getFlashcardsForGuidedDay(guidedDayNum);
    if (!deck || deck.length === 0) return;
    currentFlashcardIdx = (currentFlashcardIdx + 1) % deck.length;
    flashcardShowingBack = false;
    renderFlashcardUI();
    const box = document.getElementById("flashcard-box");
    if (box) {
      box.classList.remove("anim-slide-next", "anim-slide-prev", "anim-spinning");
      void box.offsetWidth;
      box.classList.add("anim-slide-next");
    }
  }

  function prevGuidedFlashcard() {
    const deck = getFlashcardsForGuidedDay(guidedDayNum);
    if (!deck || deck.length === 0) return;
    currentFlashcardIdx = (currentFlashcardIdx - 1 + deck.length) % deck.length;
    flashcardShowingBack = false;
    renderFlashcardUI();
    const box = document.getElementById("flashcard-box");
    if (box) {
      box.classList.remove("anim-slide-next", "anim-slide-prev", "anim-spinning");
      void box.offsetWidth;
      box.classList.add("anim-slide-prev");
    }
  }

  function renderFlashcardUI() {
    const deck = getFlashcardsForGuidedDay(guidedDayNum);
    if (!deck || deck.length === 0) return;
    if (currentFlashcardIdx >= deck.length) currentFlashcardIdx = 0;
    if (currentFlashcardIdx < 0) currentFlashcardIdx = deck.length - 1;

    const card = deck[currentFlashcardIdx];
    const badge = document.getElementById("flashcard-counter-badge");
    const secBadge = document.getElementById("flashcard-section-badge");
    const sideLabel = document.getElementById("flashcard-side-label");
    const textEl = document.getElementById("flashcard-text");
    const box = document.getElementById("flashcard-box");
    const toggleBtn = document.getElementById("btn-fc-toggle-scope");

    if (badge) {
      badge.textContent = `Card ${String(currentFlashcardIdx + 1).padStart(2, "0")} / ${String(deck.length).padStart(2, "0")}`;
    }
    if (secBadge && card) {
      secBadge.textContent = card.secaoTitulo || card.bloco;
    }
    if (toggleBtn) {
      toggleBtn.textContent = showAllFlashcardsInGuided
        ? "Ver apenas da seção de hoje"
        : `Ver todos (${FLASHCARDS_REVISAO.length})`;
    }
    if (sideLabel) {
      sideLabel.textContent = flashcardShowingBack
        ? "VERSO · RESPOSTA / FÓRMULA OFICIAL (CLIQUE PARA GIRAR)"
        : "FRENTE · PERGUNTA TÉCNICA (CLIQUE PARA GIRAR)";
      sideLabel.style.color = flashcardShowingBack
        ? "var(--accent-green)"
        : "var(--accent-yellow)";
    }
    if (box) {
      box.style.borderColor = flashcardShowingBack
        ? "var(--accent-green)"
        : "var(--accent-blue)";
      if (flashcardShowingBack) {
        box.classList.add("is-back");
      } else {
        box.classList.remove("is-back");
      }
    }
    if (textEl && card) {
      textEl.innerHTML = formatRichText(
        flashcardShowingBack ? card.verso : card.frente
      );
      typesetMathInElement(textEl);
    }
  }

  // =========================================================================
  // BLOCO DE NOTAS E FÓRMULAS PESSOAIS (MODOS: EDITAR / VISUALIZAR / DIVIDIR)
  // SUPORTE COMPLETO A FÓRMULAS EM LATEX / KATEX ($...$ e $$...$$)
  // =========================================================================
  function setPersonalNotesMode(mode) {
    personalNotesMode = mode || "preview";
    const container = document.getElementById("notes-content-container");
    const toolbar = document.getElementById("notes-math-toolbar");
    const btnEdit = document.getElementById("btn-notes-mode-edit");
    const btnPreview = document.getElementById("btn-notes-mode-preview");
    const btnSplit = document.getElementById("btn-notes-mode-split");

    if (!container) return;

    container.classList.remove("mode-edit", "mode-preview", "mode-split");
    container.classList.add(`mode-${personalNotesMode}`);

    btnEdit?.classList.toggle("active", personalNotesMode === "edit");
    btnPreview?.classList.toggle("active", personalNotesMode === "preview");
    btnSplit?.classList.toggle("active", personalNotesMode === "split");

    if (toolbar) {
      if (personalNotesMode === "preview") {
        toolbar.classList.add("hidden");
      } else {
        toolbar.classList.remove("hidden");
      }
    }

    if (personalNotesMode === "edit" || personalNotesMode === "split") {
      const ta = document.getElementById("personal-notes-area");
      if (ta && personalNotesMode === "edit") {
        ta.focus();
      }
    }

    updateNotesPreview();
  }

  function updateNotesPreview() {
    const previewEl = document.getElementById("personal-notes-preview");
    const ta = document.getElementById("personal-notes-area");
    if (!previewEl) return;

    const raw = ta ? ta.value : (state.personalNotes || "");
    if (!raw.trim()) {
      previewEl.innerHTML = `
        <div class="notes-empty-state">
          <span class="notes-empty-icon">📝</span>
          <p><strong>Nenhuma anotação pessoal ainda.</strong></p>
          <p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">
            Clique em <strong>✏️ Editar</strong> para registrar suas fórmulas em LaTeX (ex.: <code>$Z_{pu} = \\frac{Z_\\Omega}{Z_{\\text{base}}}$</code> ou <code>$$P = \\sqrt{3} V_L I_L$$</code>).
          </p>
        </div>`;
      return;
    }

    let html = formatRichText(raw);
    html = html
      .replace(/### (.*?)(?:<br>|$)/g, '<h4 class="notes-heading notes-h4">$1</h4>')
      .replace(/## (.*?)(?:<br>|$)/g, '<h3 class="notes-heading notes-h3">$1</h3>')
      .replace(/# (.*?)(?:<br>|$)/g, '<h2 class="notes-heading notes-h2">$1</h2>');

    previewEl.innerHTML = html;
    typesetMathInElement(previewEl);
  }

  function insertSnippetIntoNotes(snippet) {
    const ta = document.getElementById("personal-notes-area");
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const val = ta.value;
    let insertion = snippet;
    let cursorOffset = snippet.length;

    if (snippet === "$$ $$") {
      cursorOffset = 3;
    } else if (snippet === "$ $") {
      cursorOffset = 2;
    } else if (snippet === "\\frac{a}{b}") {
      cursorOffset = 6;
    } else if (snippet === "\\sqrt{x}") {
      cursorOffset = 6;
    }

    ta.value = val.substring(0, start) + insertion + val.substring(end);
    ta.selectionStart = ta.selectionEnd = start + cursorOffset;

    state.personalNotes = ta.value;
    saveState();
    updateNotesPreview();
  }

  let isTheoryFlashcardSpinning = false;
  function flipTheoryFlashcardWithSpin(blockId) {
    if (isTheoryFlashcardSpinning) return;
    const box = document.getElementById("theory-flashcard-box");
    if (!box) {
      theoryFlashcardShowingBack = !theoryFlashcardShowingBack;
      renderTheoryFlashcardUI(blockId);
      return;
    }
    isTheoryFlashcardSpinning = true;
    box.classList.remove("anim-slide-next", "anim-slide-prev");
    box.classList.add("anim-spinning");

    setTimeout(() => {
      theoryFlashcardShowingBack = !theoryFlashcardShowingBack;
      renderTheoryFlashcardUI(blockId);
    }, 225);

    setTimeout(() => {
      box.classList.remove("anim-spinning");
      isTheoryFlashcardSpinning = false;
    }, 450);
  }

  function nextTheoryFlashcard(blockId) {
    const deck = getFlashcardsForTheoryBlock(blockId);
    if (!deck || deck.length === 0) return;
    currentTheoryFlashcardIdx = (currentTheoryFlashcardIdx + 1) % deck.length;
    theoryFlashcardShowingBack = false;
    renderTheoryFlashcardUI(blockId);
    const box = document.getElementById("theory-flashcard-box");
    if (box) {
      box.classList.remove("anim-slide-next", "anim-slide-prev", "anim-spinning");
      void box.offsetWidth;
      box.classList.add("anim-slide-next");
    }
  }

  function prevTheoryFlashcard(blockId) {
    const deck = getFlashcardsForTheoryBlock(blockId);
    if (!deck || deck.length === 0) return;
    currentTheoryFlashcardIdx =
      (currentTheoryFlashcardIdx - 1 + deck.length) % deck.length;
    theoryFlashcardShowingBack = false;
    renderTheoryFlashcardUI(blockId);
    const box = document.getElementById("theory-flashcard-box");
    if (box) {
      box.classList.remove("anim-slide-next", "anim-slide-prev", "anim-spinning");
      void box.offsetWidth;
      box.classList.add("anim-slide-prev");
    }
  }

  function renderTheoryFlashcardUI(activeModId) {
    const deck = getFlashcardsForTheoryBlock(activeModId);
    if (!deck || deck.length === 0) return;
    if (currentTheoryFlashcardIdx >= deck.length) currentTheoryFlashcardIdx = 0;
    if (currentTheoryFlashcardIdx < 0) currentTheoryFlashcardIdx = deck.length - 1;

    const card = deck[currentTheoryFlashcardIdx];
    const badge = document.getElementById("theory-fc-counter-badge");
    const secBadge = document.getElementById("theory-fc-section-badge");
    const sideLabel = document.getElementById("theory-fc-side-label");
    const textEl = document.getElementById("theory-fc-text");
    const box = document.getElementById("theory-flashcard-box");

    if (badge) {
      badge.textContent = `Card ${String(currentTheoryFlashcardIdx + 1).padStart(2, "0")} / ${String(deck.length).padStart(2, "0")}`;
    }
    if (secBadge && card) {
      secBadge.textContent = card.secaoTitulo || card.bloco;
    }
    if (sideLabel) {
      sideLabel.textContent = theoryFlashcardShowingBack
        ? "VERSO · RESPOSTA / FÓRMULA OFICIAL (CLIQUE PARA GIRAR)"
        : "FRENTE · PERGUNTA TÉCNICA (CLIQUE PARA GIRAR)";
      sideLabel.style.color = theoryFlashcardShowingBack
        ? "var(--accent-green)"
        : "var(--accent-yellow)";
    }
    if (box) {
      box.style.borderColor = theoryFlashcardShowingBack
        ? "var(--accent-green)"
        : "var(--accent-blue)";
      if (theoryFlashcardShowingBack) {
        box.classList.add("is-back");
      } else {
        box.classList.remove("is-back");
      }
    }
    if (textEl && card) {
      textEl.innerHTML = formatRichText(
        theoryFlashcardShowingBack ? card.verso : card.frente
      );
      typesetMathInElement(textEl);
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
    returnToTheoryId = dayObj.teoriaId || null;
    switchTab("questoes");
  }

  function renderPlano30Dias() {
    const grid = document.getElementById("days-grid-container");
    if (!grid) return;

    const plano = window.PLANO_30_DIAS || [];
    const todayISO = getLocalTodayISO();

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
                  <span class="day-number">DIA ${String(d.dia).padStart(2, "0")} / 30 ${isToday ? "· HOJE" : ""}</span>
                  <div class="day-date">${d.data} (${d.diaSemana})</div>
                </div>
                <span class="badge ${isCompleted ? "badge-green" : "badge-yellow"}">
                  ${isCompleted ? "CONCLUÍDO" : "30 MIN"}
                </span>
              </div>
              <div style="margin-bottom:6px;">
                <span class="badge badge-blue">${d.bloco}</span>
              </div>
              <div class="day-title" style="cursor:pointer;" data-open-guided-day="${d.dia}">${d.titulo}</div>
              <div class="day-breakdown">
                <div class="day-breakdown-item">
                  <span class="time-pill">10 min</span>
                  <div><strong>1. Leitura:</strong> ${d.focoTeoria}</div>
                </div>
                <div class="day-breakdown-item">
                  <span class="time-pill">15 min</span>
                  <div><strong>2. Prática:</strong> Questões <strong>${d.questoesIds.map((q) => "Q" + q).join(", ")}</strong></div>
                </div>
                <div class="day-breakdown-item">
                  <span class="time-pill">05 min</span>
                  <div><strong>3. Revisão:</strong> ${d.focoRevisao}</div>
                </div>
              </div>
            </div>
            <div class="day-actions">
              <label class="check-day-label">
                <input type="checkbox" data-check-day="${d.dia}" ${isCompleted ? "checked" : ""}>
                Concluído
              </label>
              <button type="button" class="btn btn-primary btn-sm" data-open-guided-day="${d.dia}" style="margin-left:auto;">
                Abrir no Estudo Guiado →
              </button>
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

    grid.querySelectorAll("[data-open-guided-day]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const dia = parseInt(this.getAttribute("data-open-guided-day"), 10);
        guidedDayNum = dia;
        guidedStep = 1;
        showFullBlockInGuided = false;
        switchTab("dashboard");
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

    const activeModIdx = modulos.findIndex((m) => m.id === currentTheoryId);
    const activeMod = activeModIdx >= 0 ? modulos[activeModIdx] : modulos[0];
    const nextMod =
      activeModIdx >= 0 && activeModIdx + 1 < modulos.length
        ? modulos[activeModIdx + 1]
        : modulos[0];

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
        currentTheoryFlashcardIdx = 0;
        theoryFlashcardShowingBack = false;
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
            <span class="badge badge-yellow">Incidência: ${activeMod.pesoProva}</span>
            <span class="badge ${isStudied ? "badge-green" : "badge-purple"}">
              ${isStudied ? "✓ Capítulo Concluído" : "Prioridade: " + activeMod.prioridade}
            </span>
          </div>
          <h2 style="font-size:1.35rem;font-weight:700;letter-spacing:-0.02em;">${activeMod.titulo}</h2>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">
            <strong>Tópicos do Edital 2026.4:</strong> ${activeMod.subtopicosEdital}
          </p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn ${isStudied ? "btn-secondary" : "btn-primary"} btn-sm" id="btn-toggle-studied-theory">
            ${isStudied ? "✓ Capítulo Lido (Desmarcar)" : "Marcar Capítulo como Lido"}
          </button>
        </div>
      </div>
      <div class="theory-body">
        ${activeMod.conteudoHTML}
      </div>

      <!-- FLASHCARDS DO BLOCO NO CADERNO TEÓRICO -->
      <div class="card" style="margin-top:24px;border:1px solid var(--accent-blue);background:var(--bg-surface);">
        <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span>Flashcards de Fixação deste Bloco (${activeMod.codigo})</span>
            <span class="badge badge-blue" id="theory-fc-section-badge"></span>
          </div>
          <span class="badge badge-yellow" id="theory-fc-counter-badge">01 / 01</span>
        </div>
        <div class="flashcard-wrapper">
          <div
            id="theory-flashcard-box"
            class="flashcard-surface"
            style="cursor:pointer;"
            title="Clique para girar o cartão (ver resposta / fórmula)"
          >
            <div class="flashcard-flip-hint">
              <span class="flashcard-flip-icon">↻</span>
              <span>Girar</span>
            </div>
            <div class="flashcard-side-tag" id="theory-fc-side-label">FRENTE · PERGUNTA TÉCNICA (CLIQUE PARA VIRAR)</div>
            <div class="flashcard-body-text" id="theory-fc-text"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;gap:8px;margin-top:12px;">
          <button class="btn btn-secondary btn-sm" id="btn-theory-fc-prev">← Anterior</button>
          <button class="btn btn-yellow btn-sm" id="btn-theory-fc-flip" style="flex:1;">↻ Girar Cartão</button>
          <button class="btn btn-primary btn-sm" id="btn-theory-fc-next">Próximo →</button>
        </div>
      </div>

      <div class="linear-next-cta-box">
        <div>
          <div class="linear-next-cta-label">Fim do Capítulo · ${activeMod.codigo}</div>
          <div class="linear-next-cta-title">Pratique todas as ${relatedCount} questões deste bloco ou avance para o próximo capítulo</div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-secondary" id="btn-next-theory-chapter">
            Próximo Capítulo: ${nextMod.codigo} →
          </button>
          <button class="btn btn-primary btn-lg" id="btn-practice-block-questions-bottom">
            Resolver Todas as ${relatedCount} Questões deste Bloco →
          </button>
        </div>
      </div>
    `;

    // Renderiza todas as fórmulas LaTeX ($...$ e $$...$$) dentro da apostila teórica
    typesetMathInElement(contentEl);

    // Inicializa os Flashcards específicos do bloco no Caderno Teórico
    renderTheoryFlashcardUI(activeMod.id);
    document
      .getElementById("theory-flashcard-box")
      ?.addEventListener("click", function () {
        flipTheoryFlashcardWithSpin(activeMod.id);
      });
    document
      .getElementById("btn-theory-fc-flip")
      ?.addEventListener("click", function () {
        flipTheoryFlashcardWithSpin(activeMod.id);
      });
    document
      .getElementById("btn-theory-fc-prev")
      ?.addEventListener("click", function () {
        prevTheoryFlashcard(activeMod.id);
      });
    document
      .getElementById("btn-theory-fc-next")
      ?.addEventListener("click", function () {
        nextTheoryFlashcard(activeMod.id);
      });

    // Eventos dos botões "Resolver as X Questões deste Tópico →" ao final de cada subtópico
    contentEl.querySelectorAll("[data-practice-qids]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const qIdsStr = this.getAttribute("data-practice-qids") || "";
        const label =
          this.getAttribute("data-practice-label") || activeMod.titulo;
        const retTheory =
          this.getAttribute("data-return-theory") || activeMod.id;
        const parsedIds = qIdsStr
          .split(",")
          .map((x) => parseInt(x.trim(), 10))
          .filter((n) => !isNaN(n));
        if (parsedIds.length > 0) {
          customQuestionIdsFilter = parsedIds;
          customFilterLabel = label;
          returnToTheoryId = retTheory;
          switchTab("questoes");
        }
      });
    });

    document
      .getElementById("btn-toggle-studied-theory")
      ?.addEventListener("click", function () {
        const idx = state.studiedTheory.indexOf(activeMod.id);
        if (idx >= 0) state.studiedTheory.splice(idx, 1);
        else state.studiedTheory.push(activeMod.id);
        saveState();
        renderTeoria();
      });

    document
      .getElementById("btn-practice-block-questions-bottom")
      ?.addEventListener("click", function () {
        if (!state.studiedTheory.includes(activeMod.id)) {
          state.studiedTheory.push(activeMod.id);
          saveState();
        }
        customQuestionIdsFilter = null;
        customFilterLabel = "";
        returnToTheoryId = activeMod.id;
        const selBloco = document.getElementById("filter-q-bloco");
        if (selBloco) selBloco.value = activeMod.id;
        switchTab("questoes");
      });

    document
      .getElementById("btn-next-theory-chapter")
      ?.addEventListener("click", function () {
        if (!state.studiedTheory.includes(activeMod.id)) {
          state.studiedTheory.push(activeMod.id);
          saveState();
        }
        currentTheoryId = nextMod.id;
        renderTeoria();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    setupVisualCardControls(contentEl);
  }

  // =========================================================================
  // ABA 4: BANCO DE QUESTÕES COMENTADAS (85 QUESTÕES)
  // =========================================================================
  function renderQuestoes() {
    const listContainer = document.getElementById("questions-list-container");
    const summaryBanner = document.getElementById("questions-filter-summary");
    const controlsBar = document.querySelector("#tab-questoes .quiz-controls-bar");
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

    // Quando o usuário veio de um tópico específico da leitura, oculta a barra de filtros complexa para manter foco linear
    if (controlsBar) {
      controlsBar.style.display =
        customQuestionIdsFilter && customQuestionIdsFilter.length > 0
          ? "none"
          : "";
    }

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

      if (searchVal && (!customQuestionIdsFilter || customQuestionIdsFilter.length === 0)) {
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

    const answeredInFiltered = filtered.filter(
      (q) => state.answeredQuestions[q.id]
    ).length;

    if (summaryBanner) {
      if (customQuestionIdsFilter && customQuestionIdsFilter.length > 0) {
        summaryBanner.innerHTML = `
          <div class="linear-focus-banner">
            <div>
              <div style="font-size:0.72rem;font-family:var(--font-mono);color:var(--accent-blue);text-transform:uppercase;font-weight:700;margin-bottom:2px;">
                Prática Direcionada do Conteúdo Lido · ${answeredInFiltered} de ${filtered.length} respondidas
              </div>
              <div style="font-size:0.95rem;font-weight:600;color:var(--text-primary);">
                Tópico: <strong>${customFilterLabel}</strong> (${filtered.map((q) => "Q" + q.id).join(", ")})
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${
                returnToTheoryId
                  ? `<button class="btn btn-secondary btn-sm" id="btn-back-to-theory-top">← Voltar à Leitura Teórica</button>`
                  : ""
              }
              <button class="btn btn-secondary btn-sm" id="btn-clear-day-filter">Ver Banco Completo (85 Questões)</button>
            </div>
          </div>
        `;
        document
          .getElementById("btn-clear-day-filter")
          ?.addEventListener("click", function () {
            customQuestionIdsFilter = null;
            customFilterLabel = "";
            renderQuestoes();
          });
        document
          .getElementById("btn-back-to-theory-top")
          ?.addEventListener("click", function () {
            if (returnToTheoryId) currentTheoryId = returnToTheoryId;
            switchTab("teoria");
          });
      } else {
        summaryBanner.innerHTML = `
          <div style="margin-bottom:14px;font-size:0.84rem;color:var(--text-muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <span>Exibindo <strong>${filtered.length}</strong> de <strong>${TODAS_QUESTOES.length}</strong> questões disponíveis (${answeredInFiltered} respondidas neste filtro).</span>
            <span>Clique em uma alternativa (A–E) para correção imediata e resolução comentada.</span>
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
        ?.addEventListener("click", function () {
          customQuestionIdsFilter = null;
          document.getElementById("filter-q-search").value = "";
          document.getElementById("filter-q-bloco").value = "todos";
          document.getElementById("filter-q-origem").value = "todas";
          document.getElementById("filter-q-status").value = "todas";
          renderQuestoes();
        });
      return;
    }

    const modulos = window.DADOS_TEORIA || [];
    const activeTheoryId =
      returnToTheoryId || (blocoVal !== "todos" ? blocoVal : null);
    const activeModIdx = activeTheoryId
      ? modulos.findIndex((m) => m.id === activeTheoryId)
      : -1;
    const nextMod =
      activeModIdx >= 0 && activeModIdx + 1 < modulos.length
        ? modulos[activeModIdx + 1]
        : modulos[0];

    const bottomLinearBarHTML =
      customQuestionIdsFilter || blocoVal !== "todos"
        ? `
      <div class="linear-next-cta-box">
        <div>
          <div class="linear-next-cta-label">Fim da Bateria de Questões (${answeredInFiltered}/${filtered.length} respondidas)</div>
          <div class="linear-next-cta-title">Continue a leitura teórica de onde parou ou avance para o próximo capítulo</div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          ${
            activeTheoryId
              ? `<button class="btn btn-secondary" id="btn-return-reading-bottom">← Continuar Leitura deste Capítulo</button>`
              : ""
          }
          ${
            nextMod
              ? `<button class="btn btn-primary btn-lg" id="btn-advance-next-chapter-bottom">Ir para Próximo Capítulo (${nextMod.codigo}) →</button>`
              : ""
          }
        </div>
      </div>
    `
        : "";

    listContainer.innerHTML =
      filtered.map((q) => buildQuestionCardHTML(q)).join("") +
      bottomLinearBarHTML;

    bindQuestionCardEvents(listContainer, () => {
      renderQuestoes();
    });

    document
      .getElementById("btn-return-reading-bottom")
      ?.addEventListener("click", function () {
        if (activeTheoryId) currentTheoryId = activeTheoryId;
        switchTab("teoria");
      });

    document
      .getElementById("btn-advance-next-chapter-bottom")
      ?.addEventListener("click", function () {
        if (nextMod) currentTheoryId = nextMod.id;
        switchTab("teoria");
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
          <summary>Texto-Base: ${textoBase.titulo} (expandir / recolher)</summary>
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
              ${isBookmarked ? "★ Favorita" : "☆ Favoritar"}
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
            Ver / Ocultar Gabarito e Resolução Comentada
          </button>
          ${
            ans
              ? `<button class="btn btn-secondary btn-sm" data-q-reset="${q.id}">Refazer Questão</button>`
              : ""
          }
        </div>
        <div class="explanation-box ${ans ? "visible" : ""}" id="exp-box-${q.id}">
          <h4>GABARITO OFICIAL: ALTERNATIVA (${q.correta})</h4>
          <div>${formatRichText(q.comentario)}</div>
        </div>
      </div>
    `;
  }

  function handleAnswerQuestion(qId, selectedLetter, onUpdateCallback) {
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
      typesetMathInElement(newCard);

      // Reatribui listeners ao novo card
      newCard.querySelectorAll("[data-q-option]").forEach((btn) => {
        btn.addEventListener("click", function () {
          handleAnswerQuestion(
            parseInt(this.getAttribute("data-q-id"), 10),
            this.getAttribute("data-q-option"),
            onUpdateCallback
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
          if (onUpdateCallback) onUpdateCallback();
          else renderQuestoes();
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
          if (onUpdateCallback) onUpdateCallback();
          else renderQuestoes();
        });
    }
  }

  // =========================================================================
  // ABA 5: SIMULADO CRONOMETRADO & CALCULADORA DE HABILITAÇÃO/CORTE
  // =========================================================================
  function renderSimuladoTab() {
    updateKPIStatsAndTables();
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
        <div class="card" style="border:1px solid var(--accent-yellow);margin-bottom:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <span class="badge badge-yellow">SIMULADO EM EXECUÇÃO</span>
              <h3 style="margin-top:4px;">${activeSimulado.title}</h3>
            </div>
            <div style="display:flex;align-items:center;gap:14px;">
              <div style="font-size:1.5rem;font-weight:700;font-family:var(--font-mono);color:var(--accent-yellow);font-variant-numeric:tabular-nums;" id="simulado-live-timer">
                ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}
              </div>
              <button class="btn btn-primary" id="btn-finish-simulado">Finalizar e Corrigir Simulado</button>
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
        <div class="card" style="border:1px solid var(--accent-green);margin-bottom:20px;">
          <h3>Resultado do Simulado: ${correctCount} / ${activeSimulado.questions.length} acertos (${pct}%)</h3>
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
      <div style="padding:16px;border-radius:4px;border:1px solid ${
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
          <h4 style="font-size:1rem;">
            ${
              eliminado
                ? "ELIMINADO PELOS CRITÉRIOS MÍNIMOS (Item 7.1.4.3)"
                : competitiva
                  ? "APTO E COMPETITIVO PARA O CORTE 2x CR"
                  : "APROVADO NOS MÍNIMOS (Atenção ao funil da Fase 1)"
            }
          </h4>
          <span class="badge ${eliminado ? "badge-danger" : "badge-green"}" style="font-size:0.82rem;">
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
      const todayISO = getLocalTodayISO();
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
                <div class="timeline-date">${item.data}</div>
                <span class="badge ${
                  item.prova
                    ? "badge-danger"
                    : isPast
                      ? "badge-green"
                      : item.critico
                        ? "badge-yellow"
                        : "badge-blue"
                }">
                  ${item.prova ? "DIA DA PROVA" : isPast ? "Concluído" : item.categoria}
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
        state.theme === "light" ? "Tema Escuro" : "Tema Claro";
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
  // CONTROLE INDIVIDUAL DE ANIMAÇÃO EM CADA DIAGRAMA VISUAL (.visual-card)
  // =========================================================================
  function syncCardAnimButton(card, btn) {
    if (!btn) return;
    const isPaused = card.classList.contains("anim-paused");
    btn.classList.toggle("is-paused", isPaused);
    btn.innerHTML = isPaused
      ? '<span class="visual-anim-toggle-icon">▶</span><span class="visual-anim-toggle-text">Retomar</span>'
      : '<span class="visual-anim-toggle-icon">⏸</span><span class="visual-anim-toggle-text">Pausar</span>';
    btn.setAttribute(
      "title",
      isPaused
        ? "Retomar animação deste diagrama"
        : "Pausar animação deste diagrama"
    );
  }

  function setupVisualCardControls(container) {
    const root = container || document;
    const visualCards = root.querySelectorAll(".visual-card");
    visualCards.forEach((card) => {
      const hasAnim = card.querySelector(
        ".anim-ccw, .anim-cw, .anim-ccw-slow, .anim-flow, .anim-pulse, .anim-trace, .anim-pole-shift, [class*='anim-']"
      );
      if (!hasAnim) return;

      const header = card.querySelector(".visual-card-header");
      if (!header) return;

      const existingBtn = header.querySelector(".visual-anim-toggle");
      if (existingBtn) {
        syncCardAnimButton(card, existingBtn);
        return;
      }

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "visual-anim-toggle";
      toggleBtn.setAttribute("aria-label", "Pausar ou retomar animação");
      syncCardAnimButton(card, toggleBtn);

      toggleBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        card.classList.toggle("anim-paused");
        syncCardAnimButton(card, toggleBtn);
      });

      const badge = header.querySelector(".visual-card-badge");
      if (badge) {
        header.insertBefore(toggleBtn, badge);
      } else {
        header.appendChild(toggleBtn);
      }
    });
  }

  // =========================================================================
  // INICIALIZAÇÃO DA APLICAÇÃO
  // =========================================================================
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme();
    updateTimerUI();
    updateGlobalCounters();
    switchTab(currentTab);

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

    // Flashcards de Revisão Rápida (5 min finais) - delega para funções com giro 3D e escopo por dia
    document
      .getElementById("flashcard-box")
      ?.addEventListener("click", flipGuidedFlashcardWithSpin);
    document
      .getElementById("btn-fc-flip")
      ?.addEventListener("click", flipGuidedFlashcardWithSpin);
    document
      .getElementById("btn-fc-prev")
      ?.addEventListener("click", prevGuidedFlashcard);
    document
      .getElementById("btn-fc-next")
      ?.addEventListener("click", nextGuidedFlashcard);

    // Notas pessoais no Dashboard
    document
      .getElementById("personal-notes-area")
      ?.addEventListener("input", function () {
        state.personalNotes = this.value;
        saveState();
        updateNotesPreview();
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
            this.textContent = "Código Copiado — Cole em script.google.com";
            setTimeout(() => {
              this.textContent =
                "1. Copiar Código do Google Apps Script (15 linhas)";
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
        if (/src="app\.js(\?[^"]*)?"/.test(rawDoc)) {
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
              /<link rel="stylesheet"[^>]*href="styles\.css(\?[^"]*)?"[^>]*>/,
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
            .replace(/<script src="dados_edital_plano\.js(\?[^"]*)?"><\/script>/, "")
            .replace(/<script src="dados_teoria\.js(\?[^"]*)?"><\/script>/, "")
            .replace(/<script src="dados_questoes_parte1\.js(\?[^"]*)?"><\/script>/, "")
            .replace(/<script src="dados_questoes_parte2\.js(\?[^"]*)?"><\/script>/, "")
            .replace(/<script src="app\.js(\?[^"]*)?"><\/script>/, dataScripts);
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
              "HTML Copiado com Nuvem Embutida — Cole no Google Sites";
            setTimeout(() => {
              this.textContent =
                "Copiar HTML p/ Google Sites (Com Nuvem Embutida)";
            }, 4000);
          });
        }
      });

    // Renderização inicial
    updateCloudStatusUI();
    renderDashboard();
    checkAndApplyAppUpdate();

    // Feedback visual discreto (toast) para salvamento rápido via Ctrl+S
    let cloudToastTimer = null;
    function showCloudSaveToast(text, tone) {
      let toast = document.getElementById("cloud-save-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "cloud-save-toast";
        toast.style.cssText =
          "position:fixed;right:20px;bottom:24px;z-index:9999;padding:10px 16px;border-radius:4px;" +
          "font-family:var(--font-mono);font-size:0.8rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.45);" +
          "border:1px solid var(--border-strong);background:var(--bg-elevated);color:var(--text-primary);" +
          "transition:opacity 0.2s ease,transform 0.2s ease;pointer-events:none;";
        document.body.appendChild(toast);
      }
      if (tone === "success") {
        toast.style.borderColor = "var(--accent-green)";
        toast.style.color = "var(--accent-green)";
      } else if (tone === "error") {
        toast.style.borderColor = "var(--danger)";
        toast.style.color = "var(--danger)";
      } else {
        toast.style.borderColor = "var(--accent-blue)";
        toast.style.color = "var(--text-primary)";
      }
      toast.textContent = text;
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";

      if (cloudToastTimer) clearTimeout(cloudToastTimer);
      cloudToastTimer = setTimeout(function () {
        if (toast) {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(6px)";
        }
      }, 2800);
    }

    // Atalho global Ctrl+S / Cmd+S para salvar imediatamente o estado na nuvem
    window.addEventListener("keydown", async function (ev) {
      if ((ev.ctrlKey || ev.metaKey) && !ev.altKey && (ev.key === "s" || ev.key === "S")) {
        ev.preventDefault();
        const notesEl = document.getElementById("personal-notes-area");
        if (notesEl) {
          state.personalNotes = notesEl.value;
        }
        if (cloudSyncTimer) {
          clearTimeout(cloudSyncTimer);
          cloudSyncTimer = null;
        }
        saveState(true);

        if (!isCloudConfigured()) {
          showCloudSaveToast(
            "Salvo localmente · Configure a nuvem para sincronizar (Ctrl+S)",
            "info"
          );
          openCloudModal();
          return;
        }

        showCloudSaveToast("Sincronizando estado na nuvem (Ctrl+S)...", "info");
        const ok = await pushToCloud({ silent: true });
        if (ok) {
          showCloudSaveToast("✓ Estado salvo na nuvem com sucesso (Ctrl+S)", "success");
        } else {
          showCloudSaveToast(
            "✗ Falha ao salvar na nuvem — salvo localmente",
            "error"
          );
        }
      }
    });

    // Se a nuvem estiver configurada, busca progresso mais recente ao abrir e ao voltar para a aba
    if (isCloudConfigured()) {
      pullFromCloud({ silent: true });
    }
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        checkAndApplyAppUpdate();
        if (isCloudConfigured()) {
          pullFromCloud({ silent: true });
        }
      }
    });

    // Garante que após o carregamento assíncrono do KaTeX (defer), toda matemática seja re-renderizada
    window.addEventListener("load", function () {
      switchTab(currentTab);
      setupVisualCardControls(document);
      updateNotesPreview();
    });
  });
})();

