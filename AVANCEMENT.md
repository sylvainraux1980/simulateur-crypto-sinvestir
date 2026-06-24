# Avancement du projet — Simulateur Crypto S'investir

## Ce qui est fait

### Layout (app/page.tsx)
- **Header fixe** — 60px, fond `#080d18`, logo S'investir (SVG externe), wordmark SIMULATEURS, lien "Découvrir S'investir". **Verrouillé, ne pas toucher.**
- **Sidebar gauche collapsible** — clonée pixel-perfect depuis simulateurs.sinvestir.fr :
  - Collapsed par défaut à 60px, expanded à 300px avec transition 400ms
  - Bouton toggle : pilule `w-6 h-16 bg-white/5 rounded-r-2xl` avec chevron rotatif
  - Carte glass : `radial-gradient` + `border border-white/10 rounded-2xl` (visible uniquement expanded)
  - Avatar "ZM" : cercle glass en expanded, cercle gold `#f9d147` en collapsed
  - 5 items nav avec SVG exacts du site de référence (Tableau de bord, Les simulateurs ← actif, Les comparateurs, Mes simulations, Formation offerte)
  - Bottom : Gérer mon compte (icône gear qui tourne au hover), Faire une suggestion, Déconnexion (bouton gradient bleu pill)
  - `margin-left` du `<main>` synchronisé avec la largeur sidebar
  - **Verrouillé, ne pas toucher.**

### Backend API
- `app/api/cryptos/route.ts` — liste statique de 15 paires crypto (BTC, ETH, BNB, SOL, XRP, ADA, DOGE, AVAX, DOT, LTC, LINK, MATIC, ATOM, UNI, XLM) au format Binance.
- `app/api/history/route.ts` — proxy vers l'API Binance (`/api/v3/klines`, intervalle 1j), retourne `{ prices: [timestamp, closePrice][] }`. Cache 1h. Gère les erreurs 429 (rate limit). **Pagination automatique** : requêtes successives si la plage dépasse 1000 jours.

### Logique métier
- `lib/types.ts` — types TypeScript : `Crypto`, `Frequency`, `SimulationResult`, `ChartPoint`.
- `lib/calculator.ts` — moteur de calcul DCA.

---

## ✅ Étapes complétées

### ✅ Étape A — Titre de page + bannière disclaimer
- Titre centré "SIMULATEUR CRYPTO" style S'investir (tirets dégradés)
- Sous-titre bleu clair, description introductive
- Bandeau disclaimer ℹ️ dans la section titre
- Fond avec halo SVG intégré (effet lumineux)

### ✅ Étape B — Formulaire de simulation (colonne gauche)
- Sélecteur crypto (dropdown peuplé par `/api/cryptos`)
- Champ montant par investissement (€) — valeur par défaut `100`
- Sélecteur de fréquence (4 boutons : One-shot / Mensuel / Hebdomadaire / Quotidien)
- Champs dates Début / Fin avec auto-formatage `JJ/MM/AAAA` — valeurs par défaut `01/01/2023` / `31/12/2024`
- Bouton "Enregistrer la simulation" → ouvre une modale (nom de simulation, Annuler / Enregistrer)
- Bouton "Partager mes résultats"
- Colonne gauche en `flex flex-col justify-between` : boutons collés en bas

### ✅ Étape C — Affichage des résultats (colonne droite + section pleine largeur)
- 5 cartes KPI : Total investi / Acquis / Valeur finale / Plus-value / Prix moyen
- Toggle pill "Graphiques / Calendrier" (pleine largeur, sous la grille)
- **Onglet Graphiques** :
  - 3 KPI sans carte : Capital final / Intérêts gagnés / Somme investie (labels `#1098F7`)
  - Sélecteur type de graphique centré (area / bar / donut) — label `#1098F7`
  - Graphique Recharts pleine largeur (hauteur 350px) : area, bar empilé, donut
  - Données agrégées par année (`getFullYear()`, dernier point de l'année)
  - Champs `gains` (réel) et `barGains` (≥0 pour le bar stacké)
- **Onglet Calendrier** :
  - Tableau annuel : Années / Capital investi / Capital total / Plus-value
  - Header `bg-[#0049C6]`, lignes alternées `bg-transparent` / `bg-[#1098F7]/20`
- **Disclaimer** en bas de section : `bg-[#1098F7]/5 border border-[#1098F7]/10 rounded-2xl`, texte `text-[#93c5fd]`

### ✅ Étape D — États UI
- Skeleton loader animé pendant le chargement (3 cartes + 2 cartes + bloc graphique)
- État vide initial (icône graphique + message)
- Affichage d'erreur (fond rouge, message)

### ✅ Étape E — Connexion complète
- Auto-calcul via `useEffect` (debounce 500ms) sur tout changement de paramètre
- Simulation lancée au chargement initial grâce aux valeurs par défaut
- Gestion des cas limites (dates invalides, montant nul, erreurs API)

---

## À faire

### Responsive Design
> **Contrainte absolue : ne jamais modifier le header ni la sidebar.**  
> Toutes les adaptations responsive se font uniquement à l'intérieur de `<main>`.

- **Formulaire** (`col-span-2`) — passer en colonne unique sur mobile, empiler les champs
- **Grille de résultats** (`grid-cols-5` → `grid-cols-2` → `grid-cols-1`) — adapter les breakpoints `sm`/`md`
- **Cartes KPI** — réduire le padding et la taille de texte sur petits écrans
- **Section graphiques** — KPI row `grid-cols-3` → colonne unique sur mobile ; graphiques pleine largeur déjà OK
- **Tableau calendrier** — déjà en `text-[10px] sm:text-base` ; vérifier le scroll horizontal sur mobile
- **Toggle pill Graphiques/Calendrier** — déjà centré, vérifier l'affichage sur petits écrans
