/* ============ FEUILLES FLOTTANTES (ambiance légère) ============ */
(function initLeaves() {
  const layer = document.getElementById('leavesLayer');
  const leafSVG = `<svg width="26" height="26" viewBox="0 0 24 24" fill="#639922"><path d="M12 2C7 2 3 6 3 12c0 6 4 10 9 10 1-6 2-11 9-15-3-3-6-5-9-5z"/></svg>`;
  const count = 6;
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.innerHTML = leafSVG;
    leaf.style.left = (50 + Math.random() * 44) + 'vw';
    leaf.style.animationDuration = (18 + Math.random() * 14) + 's';
    leaf.style.animationDelay = (Math.random() * 12) + 's';
    leaf.style.width = leaf.style.height = (18 + Math.random() * 12) + 'px';
    layer.appendChild(leaf);
  }
})();

/* ============ FLOCONS FLOTTANTS (ambiance froide, côté gauche) ============ */
(function initSnow() {
  const layer = document.getElementById('snowLayer');
  const snowSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#185FA5" stroke-width="1.6" stroke-linecap="round"><path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11"/><path d="M12 2l-2 2M12 2l2 2M12 22l-2-2M12 22l2-2M4.5 6.5l2.7-.4M4.5 6.5l.5 2.7M19.5 6.5l-2.7-.4M19.5 6.5l-.5 2.7M19.5 17.5l-2.7.4M19.5 17.5l-.5-2.7M4.5 17.5l2.7.4M4.5 17.5l.5-2.7"/></svg>`;
  const count = 6;
  for (let i = 0; i < count; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.innerHTML = snowSVG;
    flake.style.left = (Math.random() * 44) + 'vw';
    flake.style.animationDuration = (16 + Math.random() * 14) + 's';
    flake.style.animationDelay = (Math.random() * 12) + 's';
    flake.style.width = flake.style.height = (14 + Math.random() * 12) + 'px';
    layer.appendChild(flake);
  }
})();

/* ============ DONNÉES QUESTIONS ============ */
const QUESTIONS = [
  {
    key: 'room',
    title: 'Quelle pièce veux-tu climatiser ?',
    options: [
      { value: 'chambre', label: 'Chambre' },
      { value: 'salon', label: 'Salon' },
      { value: 'bureau', label: 'Bureau' },
      { value: 'cuisine', label: 'Cuisine' },
      { value: 'studio', label: 'Autre / studio' }
    ]
  },
  {
    key: 'budget',
    title: 'Quel est ton budget total ?',
    options: [
      { value: 'b1', label: 'Moins de 2000 €' },
      { value: 'b2', label: '2000 – 3500 €' },
      { value: 'b3', label: '3500 – 5000 €' },
      { value: 'b4', label: 'Plus de 5000 €' }
    ]
  },
  {
    key: 'noise',
    title: 'Tu dors léger ou tu es sensible au bruit ?',
    options: [
      { value: 'n1', label: 'Très sensible' },
      { value: 'n2', label: 'Sensible' },
      { value: 'n3', label: 'Pas sensible du tout' }
    ]
  },
  {
    key: 'region',
    title: 'Dans quelle région habites-tu ?',
    options: [
      { value: 'chaude', label: 'Région chaude (Sud, méditerranée)' },
      { value: 'temperee', label: 'Région tempérée' },
      { value: 'froide', label: 'Région froide (chauffage réversible utile)' }
    ]
  },
  {
    key: 'surface',
    title: 'Quelle surface as-tu à climatiser ?',
    options: [
      { value: 's1', label: 'Petit (moins de 15 m²)' },
      { value: 's2', label: 'Moyen (15 – 25 m²)' },
      { value: 's3', label: 'Grand (plus de 25 m²)' }
    ]
  }
];

const BADGE_LABELS = {
  coup_de_coeur: 'Coup de cœur',
  meilleur_qp: 'Meilleur rapport Q/P',
  plus_economique: 'Plus économique',
  plus_silencieuse: 'Plus silencieuse',
  idee_famille: 'Idéale famille',
  region_froide: 'Adaptée région froide',
  meilleur_qp_petit_budget: 'Meilleur Q/P petit budget',
  idee_famille_petit_budget: 'Idéale famille budget',
  prix_le_plus_bas: 'Prix le plus bas'
};

/* ============ ÉTAT ============ */
let currentStep = 0;
const answers = {};

const homeView = document.getElementById('homeView');
const quizPanel = document.getElementById('quizPanel');
const resultsSection = document.getElementById('resultsSection');
const stepLabel = document.getElementById('stepLabel');
const stepPercent = document.getElementById('stepPercent');
const progressFill = document.getElementById('progressFill');
const questionTitle = document.getElementById('questionTitle');
const optionsList = document.getElementById('optionsList');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');

document.getElementById('startQuizBtn').addEventListener('click', () => {
  homeView.style.display = 'none';
  quizPanel.style.display = 'block';
  currentStep = 0;
  renderStep();
  quizPanel.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('restartBtn').addEventListener('click', () => {
  resultsSection.style.display = 'none';
  homeView.style.display = 'block';
  Object.keys(answers).forEach(k => delete answers[k]);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backBtn.addEventListener('click', () => {
  if (currentStep === 0) {
    quizPanel.style.display = 'none';
    homeView.style.display = 'block';
    return;
  }
  currentStep--;
  renderStep();
});

nextBtn.addEventListener('click', () => {
  if (currentStep < QUESTIONS.length - 1) {
    currentStep++;
    renderStep();
  } else {
    showResults();
  }
});

function renderStep() {
  const q = QUESTIONS[currentStep];
  stepLabel.textContent = `Question ${currentStep + 1} sur ${QUESTIONS.length}`;
  const pct = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);
  stepPercent.textContent = pct + '%';
  progressFill.style.width = pct + '%';
  questionTitle.textContent = q.title;

  optionsList.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (answers[q.key] === opt.value ? ' selected' : '');
    btn.innerHTML = `<span>${opt.label}</span><span class="check">✓</span>`;
    btn.addEventListener('click', () => {
      answers[q.key] = opt.value;
      renderStep();
    });
    optionsList.appendChild(btn);
  });

  nextBtn.disabled = !answers[q.key];
  nextBtn.textContent = currentStep === QUESTIONS.length - 1 ? 'Voir mes résultats' : 'Continuer';
}

/* ============ SCORING ============ */
function scoreProduct(p) {
  let score = p.clim_score;

  if (p.rooms.includes(answers.room)) score += 8; else score -= 5;
  if (p.regions.includes(answers.region)) score += 6; else score -= 8;

  const budgetRanges = { b1: [0, 2000], b2: [2000, 3500], b3: [3500, 5000], b4: [5000, 999999] };
  const [blo, bhi] = budgetRanges[answers.budget];
  if (p.price >= blo && p.price <= bhi) {
    score += 10;
  } else {
    const dist = p.price < blo ? blo - p.price : p.price - bhi;
    score -= Math.min(15, dist / 100);
  }

  const surfaceRanges = { s1: [0, 15], s2: [15, 25], s3: [25, 999] };
  const [slo, shi] = surfaceRanges[answers.surface];
  if (p.surface_min <= shi && p.surface_max >= slo) score += 8; else score -= 6;

  if (answers.noise === 'n1') score += (30 - p.decibels) * 1.5;
  else if (answers.noise === 'n2') score += (30 - p.decibels) * 0.5;

  return score;
}

function showResults() {
  quizPanel.style.display = 'none';
  resultsSection.style.display = 'block';

  currentPool = buildPool();
  activeTab = 'qp';
  renderTabs();
  renderCards(sortPoolByTab(activeTab), activeTab);

  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function renderCards(top3, tabKey) {
  const cardsWrap = document.getElementById('resultCards');
  cardsWrap.innerHTML = '';
  const rankClasses = ['rank-1', 'rank-2', 'rank-3'];
  const tints = ['#EF9F27', '#6B7784', '#639922'];
  const labels = RANK_LABELS[tabKey] || RANK_LABELS.qp;

  top3.forEach((entry, idx) => {
    const p = entry.p;
    const badgesHTML = (p.badges || []).slice(0, 1).map(b =>
      `<span class="badge">${BADGE_LABELS[b] || b}</span>`
    ).join('');
    const typeChip = p.type === 'portatif'
      ? `<span class="type-chip type-portatif">🛞 Sur roulettes, sans travaux</span>`
      : `<span class="type-chip type-mural">🔧 Murale, installation requise</span>`;

    const card = document.createElement('div');
    card.className = `result-card ${rankClasses[idx]}`;
    card.innerHTML = `
      <div class="result-image">
        <span class="rank-pill">${labels[idx]}</span>
        ${acIllustration(tints[idx])}
      </div>
      <div class="result-body">
        <div class="result-top">
          <div>
            <p class="result-brand">${p.brand}</p>
            <span class="result-name">${p.name}</span>
          </div>
          ${badgesHTML}
        </div>
        ${typeChip}

        <div class="result-stats">
          <span class="stat">${ICONS.volume}<b>${p.decibels} dB</b></span>
          <span class="stat">${ICONS.ruler}<b>${p.surface_min}–${p.surface_max} m²</b></span>
          <span class="stat">${ICONS.bolt}<b>${p.energy_class}</b></span>
          <span class="stat">${ICONS.shield}<b>${p.warranty_years} ans</b></span>
        </div>

        <button class="link-btn" data-detail="${p.id}">Voir le détail complet ↓</button>

        <div class="result-footer">
          <div class="price-row">
            <span class="price-value">${p.price} €</span>
            <span class="score-badge">${p.clim_score}<span>/100</span></span>
          </div>
          <a class="buy-btn" href="${p.affiliate_url}" target="_blank" rel="nofollow noopener">Voir l'offre →</a>
        </div>

        <div class="detail-panel" id="detail-${p.id}">
          <p style="font-size:13px;"><b>Pourquoi on le recommande :</b> ${p.avis}</p>
          <p style="font-size:13px;"><b>À savoir :</b> ${p.a_savoir}</p>
          <p style="font-size:12px; color:var(--text-secondary); margin:12px 0 4px;">Idéal si :</p>
          <ul style="font-size:12px; margin:0 0 10px; padding-left:18px;">
            ${p.ideal_si.map(s => `<li>${s}</li>`).join('')}
          </ul>
          <p style="font-size:12px; color:var(--text-secondary); margin:0 0 4px;">À éviter si :</p>
          <ul style="font-size:12px; margin:0 0 12px; padding-left:18px;">
            ${p.a_eviter_si.map(s => `<li>${s}</li>`).join('')}
          </ul>
          <p style="font-size:11px; color:var(--text-muted); margin:0 0 6px;">Repère décibels :</p>
          <div class="db-scale">${dbScaleHTML(p.decibels)}</div>
        </div>
      </div>
    `;
    cardsWrap.appendChild(card);
  });

  cardsWrap.querySelectorAll('[data-detail]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById('detail-' + btn.dataset.detail);
      const open = panel.style.display === 'block';
      panel.style.display = open ? 'none' : 'block';
      btn.textContent = open ? 'Voir le détail complet ↓' : 'Masquer le détail ↑';
    });
  });
}

/* ============ ICÔNES & ILLUSTRATION PRODUIT ============ */
const ICONS = {
  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M19 8a6 6 0 0 1 0 8"/></svg>`,
  ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M7 7v3M11 7v3M15 7v3M19 7v3"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z"/></svg>`
};

/* Illustration générique d'un climatiseur split, teintée à la couleur de la marque.
   ⚠️ Ce sont des illustrations stylisées de remplacement — à remplacer par de vraies
   photos produit (via l'API images Amazon ou les visuels officiels des fabricants)
   avant la mise en ligne définitive. Voir le README. */
function acIllustration(tint) {
  return `
  <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="18" width="104" height="34" rx="10" fill="#FFFFFF" stroke="${tint}" stroke-width="2.5"/>
    <rect x="18" y="30" width="30" height="8" rx="4" fill="${tint}" opacity="0.9"/>
    <rect x="52" y="30" width="30" height="8" rx="4" fill="${tint}" opacity="0.5"/>
    <rect x="86" y="30" width="18" height="8" rx="4" fill="${tint}" opacity="0.3"/>
    <circle cx="97" cy="24" r="3" fill="${tint}"/>
    <path d="M20 52c6 10 8 16 4 26M50 52c6 12 5 18 0 26M80 52c6 10 8 16 4 26" stroke="${tint}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.35"/>
  </svg>`;
}

/* ============ SHOWCASE ACCUEIL (avant le questionnaire) ============ */
function renderShowcase() {
  const wrap = document.getElementById('showcaseCards');
  if (!wrap) return;

  const sorted = [...CLIM_DATA].sort((a, b) => b.clim_score - a.clim_score);
  const portatifs = sorted.filter(p => p.type === 'portatif').slice(0, 2);
  const mural = sorted.filter(p => p.type === 'mural').slice(0, 1);
  const featured = [...portatifs, ...mural];
  const tints = ['#639922', '#185FA5', '#EF9F27'];
  const chips = ['🛞 Sur roulettes, sans travaux', '🛞 Sur roulettes, sans travaux', '🔧 Murale, installation requise'];

  featured.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <div class="result-image">${acIllustration(tints[idx])}</div>
      <div class="result-body">
        <div class="result-top">
          <div>
            <p class="result-brand">${p.brand}</p>
            <span class="result-name">${p.name}</span>
          </div>
        </div>
        <span class="type-chip ${p.type === 'portatif' ? 'type-portatif' : 'type-mural'}">${chips[idx]}</span>
        <div class="result-stats">
          <span class="stat">${ICONS.volume}<b>${p.decibels} dB</b></span>
          <span class="stat">${ICONS.ruler}<b>${p.surface_min}–${p.surface_max} m²</b></span>
        </div>
        <div class="result-footer">
          <div class="price-row">
            <span class="price-value">${p.price} €</span>
            <span class="score-badge">${p.clim_score}<span>/100</span></span>
          </div>
          <a class="buy-btn" href="${p.affiliate_url}" target="_blank" rel="nofollow noopener">Voir l'offre →</a>
        </div>
      </div>
    `;
    wrap.appendChild(card);
  });
}
renderShowcase();

const TABS = [
  { key: 'qp', label: 'Meilleur rapport qualité/prix' },
  { key: 'cheap', label: 'Le moins cher' },
  { key: 'quiet', label: 'Le plus silencieux' },
  { key: 'power', label: 'Le plus puissant' },
  { key: 'eco', label: 'Le plus économique' }
];

const RANK_LABELS = {
  qp: ['🥇 Portatif recommandé', '🥈 Portatif alternatif', '🥉 Option murale premium'],
  cheap: ['🥇 Le moins cher', '🥈 Bon plan', '🥉 Bon plan'],
  quiet: ['🥇 Le plus silencieux', '🥈 Très silencieux', '🥉 Silencieux'],
  power: ['🥇 Le plus puissant', '🥈 Puissant', '🥉 Puissant'],
  eco: ['🥇 Le plus économique', '🥈 Économique', '🥉 Économique']
};

let currentScoredAll = [];
let currentPool = [];
let activeTab = 'qp';

function buildPool() {
  currentScoredAll = CLIM_DATA.map(p => ({ p, s: scoreProduct(p) }))
    .sort((a, b) => b.s - a.s);
  return currentScoredAll.slice(0, 10);
}

function pickQP() {
  // Priorité aux climatiseurs portatifs (pas de travaux, budget plus léger) :
  // 2 meilleurs portatifs + 1 meilleur mural en complément haut de gamme.
  const portatifs = currentScoredAll.filter(e => e.p.type === 'portatif').slice(0, 2);
  const muraux = currentScoredAll.filter(e => e.p.type === 'mural').slice(0, 1);
  const combo = [...portatifs, ...muraux];
  // Filet de sécurité si jamais un des deux groupes est vide
  if (combo.length < 3) {
    currentScoredAll.forEach(e => { if (combo.length < 3 && !combo.includes(e)) combo.push(e); });
  }
  return combo.slice(0, 3);
}

function sortPoolByTab(key) {
  const list = [...currentPool];
  switch (key) {
    case 'cheap': return list.sort((a, b) => a.p.price - b.p.price).slice(0, 3);
    case 'quiet': return list.sort((a, b) => a.p.decibels - b.p.decibels).slice(0, 3);
    case 'power': return list.sort((a, b) => b.p.power_kw - a.p.power_kw).slice(0, 3);
    case 'eco': return list.sort((a, b) => a.p.annual_cost_estimate - b.p.annual_cost_estimate).slice(0, 3);
    default: return pickQP(); // 2 portatifs + 1 mural, triés par score personnalisé
  }
}

function renderTabs() {
  const wrap = document.getElementById('filterTabs');
  wrap.innerHTML = '';
  TABS.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (tab.key === activeTab ? ' active' : '');
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      activeTab = tab.key;
      renderTabs();
      renderCards(sortPoolByTab(activeTab), activeTab);
    });
    wrap.appendChild(btn);
  });
}

function dbScaleHTML(db) {
  const bands = [
    { max: 10, label: 'Silence total' },
    { max: 20, label: 'Très silencieux' },
    { max: 30, label: 'Silencieux' },
    { max: 40, label: 'Modéré' },
    { max: 999, label: 'Bruyant' }
  ];
  return bands.map(b => {
    const active = db <= b.max && (b.max === 999 || db > b.max - 10);
    return `<div class="db-row${active ? ' active' : ''}"><div class="db-bar"></div>${b.label}</div>`;
  }).join('');
}

