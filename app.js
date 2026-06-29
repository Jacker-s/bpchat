const firebaseConfig = {
  apiKey: "AIzaSyAs2AKTk2uHSOU3x8e7eauvq1dnQe0h4Bs",
  authDomain: "frend-eb335.firebaseapp.com",
  databaseURL: "https://frend-eb335-default-rtdb.firebaseio.com",
  projectId: "frend-eb335",
  storageBucket: "frend-eb335.firebasestorage.app",
  messagingSenderId: "135221802523",
  appId: "1:135221802523:web:8cfbdd04414729b244eabe"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

const state = {
  conversations: [],
  filtered: [],
  selectedKey: null,
  cache: new Map(),
};

const loginScreen = document.getElementById("loginScreen");
const appScreen = document.getElementById("appScreen");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginStatus = document.getElementById("loginStatus");
const loginError = document.getElementById("loginError");
const sessionMeta = document.getElementById("sessionMeta");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchInput");
const conversationSelect = document.getElementById("conversationSelect");
const conversationTitle = document.getElementById("conversationTitle");
const conversationSubtitle = document.getElementById("conversationSubtitle");
const conversationMeta = document.getElementById("conversationMeta");
const messagesPanel = document.getElementById("messagesPanel");

function md5(string) {
  function sub(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function rcls(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function cmn(q, a, b, x, s, t) {
    return sub(rcls(sub(sub(a, q), sub(x, t)), s), b);
  }
  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }
  function str2bin(str) {
    const bin = [];
    const mask = (1 << 8) - 1;
    for (let i = 0; i < str.length * 8; i += 8) {
      bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32);
    }
    return bin;
  }
  function bin2hex(bin) {
    const hexTab = "0123456789abcdef";
    let str = "";
    for (let i = 0; i < bin.length * 4; i += 1) {
      str += hexTab.charAt((bin[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf)
        + hexTab.charAt((bin[i >> 2] >> ((i % 4) * 8)) & 0xf);
    }
    return str;
  }

  const x = str2bin(string);
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;

    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1050366);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = sub(a, olda);
    b = sub(b, oldb);
    c = sub(c, oldc);
    d = sub(d, oldd);
  }

  return bin2hex([a, b, c, d]);
}

function getInternalEmail(username) {
  return `${md5(username.toLowerCase().trim())}@wappi.com`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (/^data:/i.test(url)) return url;
  return "";
}

function decodeConversationLabel(key) {
  if (!key) return "Conversa";
  const parts = key.split("_");
  if (parts.length === 2) return `${parts[0]} e ${parts[1]}`;
  if (parts.length > 2) return parts.join(" • ");
  return key;
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function dayLabel(timestamp) {
  const date = new Date(timestamp || Date.now());
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function setLoginError(message) {
  loginError.textContent = message || "";
  loginError.classList.toggle("hidden", !message);
}

function setLoginStatus(message) {
  loginStatus.textContent = message;
}

function renderMediaContent(msg) {
  const imageUrl = normalizeUrl(msg.imageUrl || msg.mediaUrl);
  const stickerUrl = normalizeUrl(msg.stickerUrl);
  const videoUrl = normalizeUrl(msg.videoUrl);
  const audioUrl = normalizeUrl(msg.audioUrl);
  const fileUrl = normalizeUrl(msg.fileUrl);
  const videoThumbUrl = normalizeUrl(msg.videoThumbnailUrl);
  const blocks = [];

  if (imageUrl) {
    blocks.push(`
      <div class="media-card">
        <img src="${escapeHtml(imageUrl)}" alt="Imagem enviada" loading="lazy" />
        <a class="media-link" href="${escapeHtml(imageUrl)}" target="_blank" rel="noopener noreferrer">Abrir imagem</a>
      </div>
    `);
  }

  if (stickerUrl) {
    blocks.push(`
      <div class="media-card">
        <img src="${escapeHtml(stickerUrl)}" alt="Sticker enviado" loading="lazy" />
        <a class="media-link" href="${escapeHtml(stickerUrl)}" target="_blank" rel="noopener noreferrer">Abrir sticker</a>
      </div>
    `);
  }

  if (videoUrl) {
    blocks.push(`
      <div class="media-card">
        <video controls preload="metadata" ${videoThumbUrl ? `poster="${escapeHtml(videoThumbUrl)}"` : ""}>
          <source src="${escapeHtml(videoUrl)}" />
        </video>
        <a class="media-link" href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer">Abrir vídeo</a>
      </div>
    `);
  }

  if (audioUrl) {
    blocks.push(`
      <div class="media-card">
        <audio controls preload="metadata">
          <source src="${escapeHtml(audioUrl)}" />
        </audio>
        <a class="media-link" href="${escapeHtml(audioUrl)}" target="_blank" rel="noopener noreferrer">Abrir áudio</a>
      </div>
    `);
  }

  if (fileUrl) {
    const fileName = escapeHtml(msg.fileName || msg.documentName || "Abrir arquivo");
    blocks.push(`
      <div class="media-card">
        <a class="media-link" href="${escapeHtml(fileUrl)}" target="_blank" rel="noopener noreferrer">${fileName}</a>
      </div>
    `);
  }

  if (!blocks.length) return "";
  return `<div class="media-stack">${blocks.join("")}</div>`;
}

async function updateSessionMeta(user) {
  if (!user) {
    sessionMeta.innerHTML = "";
    return;
  }

  let mappedName = "";
  try {
    const uidSnap = await database.ref(`uid_to_username/${user.uid}`).get();
    mappedName = uidSnap.val() || "";
  } catch {
    mappedName = "";
  }

  sessionMeta.innerHTML = [
    `UID: ${escapeHtml(user.uid)}`,
    mappedName ? `Usuário: ${escapeHtml(mappedName)}` : "Usuário mapeado não encontrado",
    `Email interno: ${escapeHtml(user.email || "sem email")}`
  ].join("<br>");
}

function setAppVisible(isVisible) {
  loginScreen.classList.toggle("hidden", isVisible);
  appScreen.classList.toggle("hidden", !isVisible);
}

async function ensureViewerAuth() {
  if (auth.currentUser) return auth.currentUser;
  throw new Error("Faça login com uma conta real para acessar as conversas.");
}

async function loginWithCredentials() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    setLoginError("Informe usuário e senha.");
    return;
  }

  setLoginError("");
  setLoginStatus("Autenticando...");

  const email = getInternalEmail(username);
  const legacyEmail = `${username.toUpperCase()}@friend.com`;

  try {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch {
      await auth.signInWithEmailAndPassword(legacyEmail, password);
    }
  } catch (error) {
    setLoginStatus("Falha ao autenticar.");
    setLoginError(error?.message || "Nao foi possivel entrar.");
  }
}

function renderConversationSelect() {
  if (!state.filtered.length) {
    conversationSelect.innerHTML = `<option value="">Nenhuma conversa encontrada</option>`;
    conversationSelect.value = "";
    return;
  }

  const options = [`<option value="">Selecione uma conversa</option>`];
  state.filtered.forEach((item) => {
    const selected = item.key === state.selectedKey ? " selected" : "";
    options.push(`<option value="${escapeHtml(item.key)}"${selected}>${escapeHtml(item.label)}</option>`);
  });
  conversationSelect.innerHTML = options.join("");
  conversationSelect.value = state.selectedKey && state.filtered.some((item) => item.key === state.selectedKey)
    ? state.selectedKey
    : "";
}

function applyFilter() {
  const query = searchInput.value.trim().toLowerCase();
  state.filtered = state.conversations.filter((item) => {
    if (!query) return true;
    return item.key.toLowerCase().includes(query) || item.label.toLowerCase().includes(query);
  });
  renderConversationSelect();
}

async function loadConversationKeys() {
  await ensureViewerAuth();
  const snap = await database.ref("messages").get();
  const data = snap.val();
  const keys = Object.keys(data || {}).sort();
  state.conversations = keys.map((key) => ({
    key,
    label: decodeConversationLabel(key),
  }));
  applyFilter();
  if (!state.selectedKey && state.filtered.length) {
    await selectConversation(state.filtered[0].key);
  }
}

async function loadConversationMessages(key) {
  if (state.cache.has(key)) return state.cache.get(key);
  await ensureViewerAuth();
  const snap = await database.ref(`messages/${key}`).get();
  const data = snap.val();
  const messages = Object.values(data || {})
    .filter(Boolean)
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  state.cache.set(key, messages);
  return messages;
}

function renderMessages(key, messages) {
  const total = messages.length;
  const first = messages[0];
  const last = messages[messages.length - 1];

  conversationTitle.textContent = decodeConversationLabel(key);
  conversationSubtitle.textContent = total
    ? `Exibindo ${total} mensagem(ns) reais dessa conversa.`
    : "Essa conversa ainda não tem mensagens.";

  conversationMeta.innerHTML = total ? `
    <div class="chip">Conversa: ${escapeHtml(key)}</div>
    <div class="chip">Mensagens: ${total}</div>
    <div class="chip">Primeira: ${escapeHtml(formatTime(first?.timestamp))}</div>
    <div class="chip">Última: ${escapeHtml(formatTime(last?.timestamp))}</div>
  ` : `<div class="chip">Conversa vazia</div>`;

  if (!total) {
    messagesPanel.innerHTML = `
      <div class="empty-state">
        <h3>Sem mensagens</h3>
        <p>Esse par existe no nó <code>messages</code>, mas está vazio no momento.</p>
      </div>
    `;
    return;
  }

  let lastDay = "";
  const me = messages[0]?.senderId || "";

  messagesPanel.innerHTML = messages.map((msg) => {
    const currentDay = dayLabel(msg.timestamp || Date.now());
    const separator = currentDay !== lastDay ? `<div class="separator">${escapeHtml(currentDay)}</div>` : "";
    lastDay = currentDay;

    const isOutgoing = msg.senderId === me;
    const safeText = escapeHtml(String(
      msg.text ||
      (msg.imageUrl ? "[Imagem]" :
      msg.videoUrl ? "[Vídeo]" :
      msg.audioUrl ? "[Áudio]" :
      msg.stickerUrl ? "[Sticker]" :
      msg.fileUrl ? "[Arquivo]" : "")
    ));
    const mediaContent = renderMediaContent(msg);
    const displayName = escapeHtml(msg.senderName || msg.senderId || "Usuário");

    return `
      ${separator}
      <article class="message ${isOutgoing ? "outgoing" : "incoming"}">
        <span class="name">${displayName}</span>
        <span class="text">${safeText || "[Mensagem vazia]"}</span>
        ${mediaContent}
        <span class="time">${escapeHtml(formatTime(msg.timestamp))}</span>
      </article>
    `;
  }).join("");
}

async function selectConversation(key) {
  if (!key) {
    state.selectedKey = null;
    renderConversationSelect();
    conversationTitle.textContent = "Selecione uma conversa";
    conversationSubtitle.textContent = "Escolha uma conversa no menu para visualizar as mensagens.";
    conversationMeta.innerHTML = "";
    messagesPanel.innerHTML = `
      <div class="empty-state">
        <h3>Nenhuma conversa aberta</h3>
        <p>Quando você selecionar uma conversa no dropdown, as mensagens e mídias aparecem aqui.</p>
      </div>
    `;
    return;
  }

  state.selectedKey = key;
  renderConversationSelect();
  conversationTitle.textContent = decodeConversationLabel(key);
  conversationSubtitle.textContent = `Carregando mensagens de ${key}...`;
  conversationMeta.innerHTML = "";
  messagesPanel.innerHTML = `
    <div class="empty-state">
      <h3>Carregando...</h3>
      <p>Buscando mensagens dessa conversa.</p>
    </div>
  `;

  try {
    const messages = await loadConversationMessages(key);
    renderMessages(key, messages);
  } catch (error) {
    messagesPanel.innerHTML = `
      <div class="empty-state">
        <h3>Erro ao carregar</h3>
        <p>${escapeHtml(error?.message || "Falha desconhecida")}</p>
      </div>
    `;
  }
}

function resetAppState() {
  state.conversations = [];
  state.filtered = [];
  state.selectedKey = null;
  state.cache.clear();
  conversationSelect.innerHTML = `<option value="">Nenhuma conversa carregada</option>`;
  conversationSelect.value = "";
  conversationTitle.textContent = "Selecione uma conversa";
  conversationSubtitle.textContent = "Entre com sua conta e abra uma conversa na lateral.";
  conversationMeta.innerHTML = "";
  messagesPanel.innerHTML = `
    <div class="empty-state">
      <h3>Nenhuma conversa aberta</h3>
      <p>Quando você selecionar uma conversa, as mensagens e mídias aparecem aqui.</p>
    </div>
  `;
}

loginBtn.addEventListener("click", loginWithCredentials);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loginWithCredentials();
  }
});
refreshBtn.addEventListener("click", async () => {
  state.cache.clear();
  await loadConversationKeys();
});
logoutBtn.addEventListener("click", async () => {
  await auth.signOut();
});
searchInput.addEventListener("input", applyFilter);
conversationSelect.addEventListener("change", () => {
  selectConversation(conversationSelect.value);
});

auth.onAuthStateChanged(async (user) => {
  await updateSessionMeta(user);
  if (!user) {
    resetAppState();
    setAppVisible(false);
    setLoginStatus("Aguardando login.");
    return;
  }

  setLoginError("");
  setLoginStatus("Sessão ativa.");
  setAppVisible(true);

  try {
    await loadConversationKeys();
  } catch (error) {
    resetAppState();
    conversationTitle.textContent = "Acesso negado ou indisponível";
    conversationSubtitle.textContent = "A sessão entrou, mas o Firebase ainda bloqueou a leitura desse nó.";
    messagesPanel.innerHTML = `
      <div class="empty-state">
        <h3>Erro</h3>
        <p>${escapeHtml(error?.message || "Falha desconhecida")}</p>
      </div>
    `;
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
