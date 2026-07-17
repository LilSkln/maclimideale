/* ============ FEUILLES FLOTTANTES (ambiance légère) ============ */
(function initLeaves() {
  const layer = document.getElementById('leavesLayer');
  const leafSVG = `<svg width="26" height="26" viewBox="0 0 24 24" fill="#639922"><path d="M12 2C7 2 3 6 3 12c0 6 4 10 9 10 1-6 2-11 9-15-3-3-6-5-9-5z"/></svg>`;
  const count = 6;
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.innerHTML = leafSVG;
    leaf.style.left = (Math.random() * 94) + 'vw';
    leaf.style.animationDuration = (18 + Math.random() * 14) + 's';
    leaf.style.animationDelay = (Math.random() * 12) + 's';
    leaf.style.width = leaf.style.height = (18 + Math.random() * 12) + 'px';
    layer.appendChild(leaf);
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

function pickResults() {
  const scored = CLIM_DATA.map(p => ({ p, s: scoreProduct(p) }))
    .sort((a, b) => b.s - a.s);

  const pool = scored.slice(0, 8);
  const recommendation = pool[0];
  const rest = pool.slice(1);

  const economique = rest.slice().sort((a, b) => a.p.price - b.p.price)[0];
  const premiumCandidates = rest.filter(r => r.p.id !== economique.p.id);
  const premium = premiumCandidates.slice().sort((a, b) => b.p.price - a.p.price)[0] || rest[1];

  return [
    { ...recommendation, roleLabel: 'Notre recommandation', rankClass: 'rank-1' },
    { ...economique, roleLabel: 'Alternative économique', rankClass: 'rank-2' },
    { ...premium, roleLabel: 'Alternative premium', rankClass: 'rank-3' }
  ];
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

function showResults() {
  quizPanel.style.display = 'none';
  resultsSection.style.display = 'block';

  const top3 = pickResults();
  const cardsWrap = document.getElementById('resultCards');
  cardsWrap.innerHTML = '';

  top3.forEach((entry, idx) => {
    const p = entry.p;
    const badgesHTML = (p.badges || []).slice(0, 1).map(b =>
      `<span class="badge">${BADGE_LABELS[b] || b}</span>`
    ).join('') || `<span class="badge">${entry.roleLabel}</span>`;

    const card = document.createElement('div');
    card.className = `result-card ${entry.rankClass}`;
    card.innerHTML = `
      <div class="result-icon">${['🥇','🥈','🥉'][idx]}</div>
      <div class="result-body">
        <div class="result-top">
          <span class="result-name">${p.name}</span>
          ${badgesHTML}
        </div>
        <p class="result-meta">${p.decibels} dB · ${p.surface_min}–${p.surface_max} m² · ${p.energy_class}</p>
        <div class="result-stats">
          <span class="stat"><b>${p.price} €</b></span>
          <span class="stat">Garantie <b>${p.warranty_years} ans</b></span>
          <span class="stat">≈ <b>${p.annual_cost_estimate} €</b>/an</span>
        </div>
        <div class="result-actions">
          <span class="score-badge">${p.clim_score}<span>/100 ClimScore</span></span>
          <button class="link-btn" data-detail="${p.id}">Voir les détails ↓</button>
          <a class="buy-btn" href="${p.affiliate_url}" target="_blank" rel="nofollow noopener">Voir le prix</a>
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
      btn.textContent = open ? 'Voir les détails ↓' : 'Masquer les détails ↑';
    });
  });

  resultsSection.scrollIntoView({ behavior: 'smooth' });
}
