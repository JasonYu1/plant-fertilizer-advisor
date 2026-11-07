// UI translations. Content databases (fertilizers, symptoms, disease names)
// are translated server-side from data/i18n/<lang>/.
const LANGS = {
  "en": "English",
  "zh-TW": "繁體中文",
  "zh-CN": "简体中文",
  "es": "Español",
  "fr": "Français",
  "pt": "Português",
};

const I18N = {
  en: {
    title: "Plant Fertilizer Advisor",
    tagline: "Snap a plant, get its feeding plan — free.",
    demoBannerHtml:
      'Demo mode — no Pl@ntNet API key, so plant names are sample data. Get a free key at <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> (500 IDs/day) and paste it below.',
    keySummarySet: "Set your Pl@ntNet API key",
    keySummaryYours: "Your Pl@ntNet API key is set",
    keySummaryServer: "Using the server's Pl@ntNet key",
    keyBodyHtml:
      'Your key is stored only in this browser and used only to call Pl@ntNet. Get one free at <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> → My API.',
    keyPlaceholder: "Paste your API key",
    save: "Save",
    clear: "Clear",
    keyStatusYours: "✅ Using your key (stored only in this browser).",
    keyStatusServer: "This server has its own key; you can set a personal one to use your own quota.",
    keyStatusBlocked: "Could not save — browser storage is blocked.",
    uploadTitle: "Take or choose a photo",
    uploadHint: "Tap here, or drag & drop an image",
    organLabel: "What's in the photo?",
    organAuto: "Auto-detect",
    organLeaf: "Leaf",
    organFlower: "Flower",
    organFruit: "Fruit",
    organBark: "Bark / stem",
    identify: "Identify plant",
    spinnerMsg: "Identifying your plant…",
    resultsH: "Results",
    healthH: "Health check",
    howLookH: "How does it look?",
    howLookSub: "Tap anything you notice on your plant for likely causes and what to do:",
    footerHtml:
      'Identification by <a href="https://plantnet.org" target="_blank" rel="noopener">Pl@ntNet</a>. Fertilizer guidance is general advice — always check the label on your fertilizer.',
    labelNpk: "Fertilizer (N-P-K)",
    labelUse: "What to use",
    labelWhen: "When to feed",
    labelPh: "Soil pH",
    labelWater: "Watering",
    labelTemp: "Temperature",
    labelHumidity: "Humidity",
    likelyCauses: "Likely causes (most common first)",
    whatToDo: "What to do",
    noPlant: "No plant recognized. Try a closer, sharper photo of a leaf or flower.",
    healthyTitle: "✅ Looks healthy",
    healthyDetail: "The disease model sees no known disease ({pct}% confident: “{label}”).",
    alsoConsidered: "Also considered:",
    lowConfTip: "Low confidence — try a sharp, close-up photo of a single leaf.",
    possibleIssue: "⚠️ Possible issue: {label}",
    modelConf: "Model confidence: {pct}%",
    lowConfNote: " (low — treat as a hint, not a diagnosis)",
    noModelMsg: "Disease model not installed — use the symptom checklist below.",
    notCoveredMsg:
      "The AI disease check only covers common crops (apple, tomato, potato, grape, corn, pepper, strawberry…) — <em>{plant}</em> isn't one of them. Use the symptom checklist below instead.",
    matchFamily: "Advice based on the plant family ({name}).",
    matchDefault: "No specific entry for this plant yet — showing safe general guidance.",
  },

  "zh-TW": {
    title: "植物施肥顧問",
    tagline: "拍張植物照片，立刻取得施肥方案 — 完全免費。",
    demoBannerHtml:
      '示範模式 — 尚未設定 Pl@ntNet API 金鑰，植物名稱為範例資料。請到 <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> 免費申請金鑰（每天 500 次辨識），再貼到下方。',
    keySummarySet: "設定你的 Pl@ntNet API 金鑰",
    keySummaryYours: "已設定你的 Pl@ntNet API 金鑰",
    keySummaryServer: "目前使用伺服器的 Pl@ntNet 金鑰",
    keyBodyHtml:
      '金鑰只會儲存在這個瀏覽器中，僅用於呼叫 Pl@ntNet。請到 <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> → My API 免費申請。',
    keyPlaceholder: "貼上你的 API 金鑰",
    save: "儲存",
    clear: "清除",
    keyStatusYours: "✅ 正在使用你的金鑰（只儲存在這個瀏覽器）。",
    keyStatusServer: "此伺服器已有共用金鑰；你也可以設定個人金鑰，使用自己的額度。",
    keyStatusBlocked: "無法儲存 — 瀏覽器儲存空間被封鎖。",
    uploadTitle: "拍照或選擇照片",
    uploadHint: "點這裡，或將圖片拖放進來",
    organLabel: "照片裡是什麼？",
    organAuto: "自動偵測",
    organLeaf: "葉子",
    organFlower: "花",
    organFruit: "果實",
    organBark: "樹皮／莖",
    identify: "辨識植物",
    spinnerMsg: "正在辨識你的植物…",
    resultsH: "辨識結果",
    healthH: "健康檢查",
    howLookH: "植物看起來如何？",
    howLookSub: "點選你在植物上注意到的狀況，查看可能原因與處理方式：",
    footerHtml:
      '辨識服務由 <a href="https://plantnet.org" target="_blank" rel="noopener">Pl@ntNet</a> 提供。施肥建議僅供一般參考 — 請務必詳閱肥料產品標示。',
    labelNpk: "肥料（氮-磷-鉀）",
    labelUse: "使用什麼",
    labelWhen: "何時施肥",
    labelPh: "土壤 pH",
    labelWater: "澆水",
    labelTemp: "溫度",
    labelHumidity: "濕度",
    likelyCauses: "可能原因（最常見的在前）",
    whatToDo: "處理方式",
    noPlant: "無法辨識植物。請改用更近、更清晰的葉子或花朵特寫。",
    healthyTitle: "✅ 看起來很健康",
    healthyDetail: "疾病模型未偵測到已知病害（信心度 {pct}%：「{label}」）。",
    alsoConsidered: "其他可能：",
    lowConfTip: "信心度偏低 — 請改拍單一葉片的清晰特寫。",
    possibleIssue: "⚠️ 可能的問題：{label}",
    modelConf: "模型信心度：{pct}%",
    lowConfNote: "（偏低 — 僅供參考，並非診斷）",
    noModelMsg: "未安裝疾病模型 — 請使用下方的症狀檢查表。",
    notCoveredMsg:
      "AI 病害檢查僅涵蓋常見作物（蘋果、番茄、馬鈴薯、葡萄、玉米、甜椒、草莓等）— <em>{plant}</em> 不在其中。請改用下方的症狀檢查表。",
    matchFamily: "建議依植物科別（{name}）提供。",
    matchDefault: "資料庫尚無此植物的專屬條目 — 顯示安全的一般建議。",
  },

  "zh-CN": {
    title: "植物施肥顾问",
    tagline: "拍张植物照片，立刻获得施肥方案 — 完全免费。",
    demoBannerHtml:
      '演示模式 — 尚未设置 Pl@ntNet API 密钥，植物名称为示例数据。请到 <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> 免费申请密钥（每天 500 次识别），再粘贴到下方。',
    keySummarySet: "设置你的 Pl@ntNet API 密钥",
    keySummaryYours: "已设置你的 Pl@ntNet API 密钥",
    keySummaryServer: "当前使用服务器的 Pl@ntNet 密钥",
    keyBodyHtml:
      '密钥只会保存在这个浏览器中，仅用于调用 Pl@ntNet。请到 <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> → My API 免费申请。',
    keyPlaceholder: "粘贴你的 API 密钥",
    save: "保存",
    clear: "清除",
    keyStatusYours: "✅ 正在使用你的密钥(只保存在这个浏览器)。",
    keyStatusServer: "此服务器已有共用密钥；你也可以设置个人密钥，使用自己的额度。",
    keyStatusBlocked: "无法保存 — 浏览器存储被禁用。",
    uploadTitle: "拍照或选择照片",
    uploadHint: "点这里，或将图片拖放进来",
    organLabel: "照片里是什么？",
    organAuto: "自动检测",
    organLeaf: "叶子",
    organFlower: "花",
    organFruit: "果实",
    organBark: "树皮／茎",
    identify: "识别植物",
    spinnerMsg: "正在识别你的植物…",
    resultsH: "识别结果",
    healthH: "健康检查",
    howLookH: "植物看起来怎么样？",
    howLookSub: "点选你在植物上注意到的状况，查看可能原因与处理方法：",
    footerHtml:
      '识别服务由 <a href="https://plantnet.org" target="_blank" rel="noopener">Pl@ntNet</a> 提供。施肥建议仅供一般参考 — 请务必仔细阅读肥料产品标签。',
    labelNpk: "肥料（氮-磷-钾）",
    labelUse: "使用什么",
    labelWhen: "何时施肥",
    labelPh: "土壤 pH",
    labelWater: "浇水",
    labelTemp: "温度",
    labelHumidity: "湿度",
    likelyCauses: "可能原因（最常见的在前）",
    whatToDo: "处理方法",
    noPlant: "无法识别植物。请换一张更近、更清晰的叶子或花朵特写。",
    healthyTitle: "✅ 看起来很健康",
    healthyDetail: "疾病模型未检测到已知病害（置信度 {pct}%：“{label}”）。",
    alsoConsidered: "其他可能：",
    lowConfTip: "置信度偏低 — 请改拍单片叶子的清晰特写。",
    possibleIssue: "⚠️ 可能的问题：{label}",
    modelConf: "模型置信度：{pct}%",
    lowConfNote: "（偏低 — 仅供参考，并非诊断）",
    noModelMsg: "未安装疾病模型 — 请使用下方的症状检查表。",
    notCoveredMsg:
      "AI 病害检查仅覆盖常见作物（苹果、番茄、马铃薯、葡萄、玉米、甜椒、草莓等）— <em>{plant}</em> 不在其中。请改用下方的症状检查表。",
    matchFamily: "建议按植物科（{name}）给出。",
    matchDefault: "数据库尚无该植物的专属条目 — 显示安全的通用建议。",
  },

  es: {
    title: "Asesor de Fertilizantes",
    tagline: "Fotografía una planta y obtén su plan de abonado — gratis.",
    demoBannerHtml:
      'Modo demo — sin clave de la API de Pl@ntNet, los nombres de plantas son datos de ejemplo. Consigue una clave gratis en <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> (500 identificaciones/día) y pégala abajo.',
    keySummarySet: "Configura tu clave de API de Pl@ntNet",
    keySummaryYours: "Tu clave de API de Pl@ntNet está configurada",
    keySummaryServer: "Usando la clave de Pl@ntNet del servidor",
    keyBodyHtml:
      'Tu clave se guarda solo en este navegador y se usa únicamente para llamar a Pl@ntNet. Consigue una gratis en <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> → My API.',
    keyPlaceholder: "Pega tu clave de API",
    save: "Guardar",
    clear: "Borrar",
    keyStatusYours: "✅ Usando tu clave (guardada solo en este navegador).",
    keyStatusServer: "Este servidor tiene su propia clave; puedes configurar una personal para usar tu propia cuota.",
    keyStatusBlocked: "No se pudo guardar — el almacenamiento del navegador está bloqueado.",
    uploadTitle: "Toma o elige una foto",
    uploadHint: "Toca aquí, o arrastra y suelta una imagen",
    organLabel: "¿Qué hay en la foto?",
    organAuto: "Detección automática",
    organLeaf: "Hoja",
    organFlower: "Flor",
    organFruit: "Fruto",
    organBark: "Corteza / tallo",
    identify: "Identificar planta",
    spinnerMsg: "Identificando tu planta…",
    resultsH: "Resultados",
    healthH: "Chequeo de salud",
    howLookH: "¿Qué aspecto tiene?",
    howLookSub: "Toca lo que observes en tu planta para ver causas probables y qué hacer:",
    footerHtml:
      'Identificación por <a href="https://plantnet.org" target="_blank" rel="noopener">Pl@ntNet</a>. Los consejos de abonado son orientativos — consulta siempre la etiqueta de tu fertilizante.',
    labelNpk: "Fertilizante (N-P-K)",
    labelUse: "Qué usar",
    labelWhen: "Cuándo abonar",
    labelPh: "pH del suelo",
    labelWater: "Riego",
    labelTemp: "Temperatura",
    labelHumidity: "Humedad",
    likelyCauses: "Causas probables (la más común primero)",
    whatToDo: "Qué hacer",
    noPlant: "No se reconoció ninguna planta. Prueba con una foto más cercana y nítida de una hoja o flor.",
    healthyTitle: "✅ Se ve sana",
    healthyDetail: "El modelo no detecta ninguna enfermedad conocida (confianza del {pct}%: «{label}»).",
    alsoConsidered: "También consideró:",
    lowConfTip: "Confianza baja — prueba con una foto nítida de una sola hoja en primer plano.",
    possibleIssue: "⚠️ Posible problema: {label}",
    modelConf: "Confianza del modelo: {pct}%",
    lowConfNote: " (baja — tómalo como una pista, no un diagnóstico)",
    noModelMsg: "Modelo de enfermedades no instalado — usa la lista de síntomas de abajo.",
    notCoveredMsg:
      "El chequeo de enfermedades por IA solo cubre cultivos comunes (manzano, tomate, patata, vid, maíz, pimiento, fresa…) — <em>{plant}</em> no es uno de ellos. Usa la lista de síntomas de abajo.",
    matchFamily: "Consejo basado en la familia de la planta ({name}).",
    matchDefault: "Aún no hay una entrada específica para esta planta — se muestra una guía general segura.",
  },

  fr: {
    title: "Conseiller en Fertilisation",
    tagline: "Photographiez une plante, obtenez son plan de fertilisation — gratuit.",
    demoBannerHtml:
      'Mode démo — aucune clé API Pl@ntNet, les noms de plantes sont des exemples. Obtenez une clé gratuite sur <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> (500 identifications/jour) et collez-la ci-dessous.',
    keySummarySet: "Configurer votre clé API Pl@ntNet",
    keySummaryYours: "Votre clé API Pl@ntNet est configurée",
    keySummaryServer: "Utilisation de la clé Pl@ntNet du serveur",
    keyBodyHtml:
      'Votre clé est stockée uniquement dans ce navigateur et sert uniquement à appeler Pl@ntNet. Obtenez-en une gratuitement sur <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> → My API.',
    keyPlaceholder: "Collez votre clé API",
    save: "Enregistrer",
    clear: "Effacer",
    keyStatusYours: "✅ Votre clé est utilisée (stockée uniquement dans ce navigateur).",
    keyStatusServer: "Ce serveur possède sa propre clé ; vous pouvez en définir une personnelle pour utiliser votre propre quota.",
    keyStatusBlocked: "Enregistrement impossible — le stockage du navigateur est bloqué.",
    uploadTitle: "Prenez ou choisissez une photo",
    uploadHint: "Touchez ici, ou glissez-déposez une image",
    organLabel: "Que montre la photo ?",
    organAuto: "Détection automatique",
    organLeaf: "Feuille",
    organFlower: "Fleur",
    organFruit: "Fruit",
    organBark: "Écorce / tige",
    identify: "Identifier la plante",
    spinnerMsg: "Identification de votre plante…",
    resultsH: "Résultats",
    healthH: "Bilan de santé",
    howLookH: "Quel est son aspect ?",
    howLookSub: "Touchez ce que vous observez sur votre plante pour voir les causes probables et quoi faire :",
    footerHtml:
      'Identification par <a href="https://plantnet.org" target="_blank" rel="noopener">Pl@ntNet</a>. Les conseils de fertilisation sont indicatifs — consultez toujours l\'étiquette de votre engrais.',
    labelNpk: "Engrais (N-P-K)",
    labelUse: "Quoi utiliser",
    labelWhen: "Quand fertiliser",
    labelPh: "pH du sol",
    labelWater: "Arrosage",
    labelTemp: "Température",
    labelHumidity: "Humidité",
    likelyCauses: "Causes probables (la plus courante d'abord)",
    whatToDo: "Quoi faire",
    noPlant: "Aucune plante reconnue. Essayez une photo plus proche et plus nette d'une feuille ou d'une fleur.",
    healthyTitle: "✅ Semble en bonne santé",
    healthyDetail: "Le modèle ne détecte aucune maladie connue (confiance de {pct} % : « {label} »).",
    alsoConsidered: "Également envisagé :",
    lowConfTip: "Confiance faible — essayez une photo nette d'une seule feuille en gros plan.",
    possibleIssue: "⚠️ Problème possible : {label}",
    modelConf: "Confiance du modèle : {pct} %",
    lowConfNote: " (faible — à prendre comme un indice, pas un diagnostic)",
    noModelMsg: "Modèle de maladies non installé — utilisez la liste de symptômes ci-dessous.",
    notCoveredMsg:
      "Le diagnostic IA ne couvre que les cultures courantes (pommier, tomate, pomme de terre, vigne, maïs, poivron, fraisier…) — <em>{plant}</em> n'en fait pas partie. Utilisez la liste de symptômes ci-dessous.",
    matchFamily: "Conseil basé sur la famille de la plante ({name}).",
    matchDefault: "Pas encore d'entrée spécifique pour cette plante — affichage de conseils généraux sans risque.",
  },

  pt: {
    title: "Consultor de Adubação",
    tagline: "Fotografe uma planta e receba o plano de adubação — grátis.",
    demoBannerHtml:
      'Modo demo — sem chave da API Pl@ntNet, os nomes das plantas são dados de exemplo. Obtenha uma chave grátis em <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> (500 identificações/dia) e cole abaixo.',
    keySummarySet: "Configure sua chave da API Pl@ntNet",
    keySummaryYours: "Sua chave da API Pl@ntNet está configurada",
    keySummaryServer: "Usando a chave Pl@ntNet do servidor",
    keyBodyHtml:
      'Sua chave fica salva apenas neste navegador e é usada somente para chamar o Pl@ntNet. Obtenha uma grátis em <a href="https://my.plantnet.org" target="_blank" rel="noopener">my.plantnet.org</a> → My API.',
    keyPlaceholder: "Cole sua chave de API",
    save: "Salvar",
    clear: "Limpar",
    keyStatusYours: "✅ Usando a sua chave (salva apenas neste navegador).",
    keyStatusServer: "Este servidor tem a própria chave; você pode definir uma pessoal para usar a sua própria cota.",
    keyStatusBlocked: "Não foi possível salvar — o armazenamento do navegador está bloqueado.",
    uploadTitle: "Tire ou escolha uma foto",
    uploadHint: "Toque aqui, ou arraste e solte uma imagem",
    organLabel: "O que aparece na foto?",
    organAuto: "Detecção automática",
    organLeaf: "Folha",
    organFlower: "Flor",
    organFruit: "Fruto",
    organBark: "Casca / caule",
    identify: "Identificar planta",
    spinnerMsg: "Identificando sua planta…",
    resultsH: "Resultados",
    healthH: "Exame de saúde",
    howLookH: "Como ela está?",
    howLookSub: "Toque no que você observa na sua planta para ver causas prováveis e o que fazer:",
    footerHtml:
      'Identificação por <a href="https://plantnet.org" target="_blank" rel="noopener">Pl@ntNet</a>. As orientações de adubação são gerais — sempre confira o rótulo do seu fertilizante.',
    labelNpk: "Fertilizante (N-P-K)",
    labelUse: "O que usar",
    labelWhen: "Quando adubar",
    labelPh: "pH do solo",
    labelWater: "Rega",
    labelTemp: "Temperatura",
    labelHumidity: "Umidade",
    likelyCauses: "Causas prováveis (a mais comum primeiro)",
    whatToDo: "O que fazer",
    noPlant: "Nenhuma planta reconhecida. Tente uma foto mais próxima e nítida de uma folha ou flor.",
    healthyTitle: "✅ Parece saudável",
    healthyDetail: "O modelo não detecta nenhuma doença conhecida (confiança de {pct}%: “{label}”).",
    alsoConsidered: "Também considerou:",
    lowConfTip: "Confiança baixa — tente uma foto nítida de uma única folha em primeiro plano.",
    possibleIssue: "⚠️ Possível problema: {label}",
    modelConf: "Confiança do modelo: {pct}%",
    lowConfNote: " (baixa — trate como uma pista, não um diagnóstico)",
    noModelMsg: "Modelo de doenças não instalado — use a lista de sintomas abaixo.",
    notCoveredMsg:
      "A verificação de doenças por IA cobre apenas culturas comuns (maçã, tomate, batata, uva, milho, pimentão, morango…) — <em>{plant}</em> não é uma delas. Use a lista de sintomas abaixo.",
    matchFamily: "Orientação baseada na família da planta ({name}).",
    matchDefault: "Ainda não há uma entrada específica para esta planta — mostrando orientações gerais seguras.",
  },
};

function detectLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved && I18N[saved]) return saved;
  } catch {}
  const nav = (navigator.language || "en");
  if (/^zh\b/i.test(nav)) {
    return /tw|hk|mo|hant/i.test(nav) ? "zh-TW" : "zh-CN";
  }
  const two = nav.slice(0, 2).toLowerCase();
  for (const code of Object.keys(I18N)) {
    if (code.slice(0, 2).toLowerCase() === two) return code;
  }
  return "en";
}

let LANG = detectLang();

function t(key, vars) {
  let s = (I18N[LANG] && I18N[LANG][key]) ?? I18N.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll("{" + k + "}", v);
  return s;
}

function setLang(code) {
  if (!I18N[code]) return;
  try {
    localStorage.setItem("lang", code);
  } catch {}
  location.reload();
}

function applyStaticI18n() {
  document.documentElement.lang = LANG;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  const sel = document.getElementById("lang-select");
  if (sel) {
    sel.innerHTML = Object.entries(LANGS)
      .map(([code, name]) => `<option value="${code}"${code === LANG ? " selected" : ""}>${name}</option>`)
      .join("");
    sel.addEventListener("change", () => setLang(sel.value));
  }
}
