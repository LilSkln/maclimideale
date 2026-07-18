# Ma Clim Idéale — Guide de mise en ligne

## Ce que contient ce dossier
- `index.html` — la page (accueil, questionnaire, résultats)
- `style.css` — toute la direction artistique (glacier, vert, boutons pilule, feuilles animées)
- `data.js` — la base des 16 climatiseurs (Daikin, Mitsubishi, Panasonic, Toshiba, Atlantic, LG, Samsung, Hitachi, Hisense, Midea, Comfee)
- `data.json` — la même donnée en JSON pur, pratique si tu veux l'éditer proprement plus tard (non utilisée directement par le site)
- `script.js` — le questionnaire, l'algorithme de recommandation, l'affichage des résultats

## Étape 1 — GitHub (déjà fait ✅)
Tu as créé le repo `maclimideale`.

## Étape 2 — Uploader le code
1. Va sur ton repo GitHub `maclimideale`
2. Clique sur **Add file → Upload files**
3. Glisse les 5 fichiers de ce dossier (`index.html`, `style.css`, `script.js`, `data.js`, `data.json`)
4. Clique **Commit changes**

## Étape 3 — Déployer sur Netlify
1. Va sur [netlify.com](https://netlify.com), crée un compte (avec ton GitHub, c'est plus rapide)
2. Clique **Add new site → Import an existing project**
3. Choisis **GitHub**, autorise l'accès, sélectionne le repo `maclimideale`
4. Laisse les champs de build vides (c'est un site statique, pas de build nécessaire)
5. Clique **Deploy site**
6. En 1 minute, tu as une URL du type `maclimideale-xxxx.netlify.app` — ton site est en ligne

## Étape 4 — Connecter ton nom de domaine
1. Dans Netlify : **Site settings → Domain management → Add a domain**
2. Entre `maclimideale.fr`
3. Netlify te donne des enregistrements DNS à copier
4. Va chez ton registrar (là où tu as acheté `maclimideale.fr`), section **DNS**, colle les enregistrements indiqués par Netlify
5. La propagation prend entre 30 minutes et quelques heures

## Étape 5 — Finaliser l'affiliation Amazon
Ton ID partenaire `maclimideale-21` est déjà intégré dans tous les liens du site (`data.js`).
Une fois le site en ligne, retourne dans ton compte Club Partenaire Amazon et confirme l'URL finale (`maclimideale.fr`) si demandé.

## ⚠️ À vérifier avant le lancement public
Les prix, décibels, classes énergétiques et garanties dans `data.js` sont des **valeurs de démarrage réalistes mais à vérifier** modèle par modèle avant publication — les prix changent souvent et une donnée fausse affichée au visiteur (prix, décibels, garantie) peut poser un problème de confiance ou légal. Avant la mise en ligne définitive :
- Vérifie chaque prix sur le site du revendeur
- Vérifie les décibels et classes énergétiques sur la fiche technique officielle du fabricant
- Mets à jour `data.js` (et `data.json` si tu veux garder les deux synchronisés) en conséquence

## Mettre à jour un climatiseur plus tard
Ouvre `data.js`, trouve le bloc du modèle concerné, modifie les champs (`price`, `decibels`, etc.), puis renvoie le fichier sur GitHub — Netlify redéploie automatiquement en quelques secondes.
