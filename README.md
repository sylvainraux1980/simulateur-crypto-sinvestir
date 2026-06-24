# Simulateur DCA Crypto

Simulateur d'investissement en cryptomonnaies basé sur les données historiques réelles de Binance.

## Fonctionnalités

- **15 cryptos** disposant d'une paire EUR sur Binance (BTC, ETH, BNB, SOL, XRP, ADA, DOGE, AVAX, DOT, LTC, LINK, MATIC, ATOM, UNI, XLM)
- **Stratégies** : One-shot / Mensuel / Hebdomadaire / Quotidien
- **Calcul DCA** sur données historiques réelles
- **Résultats** : valeur finale, plus-value en € et %, total investi, nombre d'achats
- **Graphique** area chart avec évolution du portefeuille vs montant investi
- Responsive desktop & mobile

## Lancement

### Prérequis

- Node.js ≥ 18 — télécharger sur [nodejs.org](https://nodejs.org)

### Étapes

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Build production

```bash
npm run build
npm start
```

### Déploiement Vercel

```bash
npx vercel
```

Ou connectez le dépôt GitHub à [vercel.com](https://vercel.com) pour un déploiement automatique.

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Graphique | Recharts |
| Données | Binance API v3 (gratuit, sans clé) |
| Déploiement | Vercel |

## Architecture

```
app/
  page.tsx          — Page principale (client component), gestion d'état
  layout.tsx        — Root layout, metadata
  globals.css       — Styles globaux + import Inter
  api/
    cryptos/route.ts — Liste statique des 15 cryptos avec paire EUR sur Binance
    history/route.ts — Proxy GET /api/v3/klines (Binance, cache 1h)
components/
  ResultsPanel.tsx  — Affichage KPIs + conteneur graphique
  EvolutionChart.tsx — AreaChart Recharts
lib/
  types.ts          — Types TypeScript partagés
  calculator.ts     — Logique DCA : calcul des achats, valeur finale, serie temporelle
```

## Partis pris techniques

**Binance plutôt que CoinGecko** : l'API Binance klines (`/api/v3/klines`) est gratuite et ne nécessite aucune clé API. Elle retourne des chandeliers journaliers (OHLCV) fiables, directement issus des marchés réels. On utilise le prix de **clôture** (index 4 du kline) comme référence de prix du jour, ce qui correspond à la convention standard en analyse technique. CoinGecko retournait un prix moyen pondéré, moins précis pour reproduire un achat réel à cours de clôture.

**Paires EUR uniquement** : seules 15 cryptos disposent d'une paire EUR liquide sur Binance. La liste est hardcodée pour éviter tout appel dynamique et garantir la disponibilité des données.

**Routes API Next.js comme proxy** : les appels Binance sont faits côté serveur pour éviter les problèmes CORS, ajouter un cache HTTP (`revalidate: 3600`) et centraliser la gestion des erreurs.

**Calcul côté client** : une fois les prix historiques récupérés, le calcul DCA se fait entièrement dans le browser (`lib/calculator.ts`). Cela rend l'UI réactive sans aller-retour serveur supplémentaire.

**Limite à 1000 klines par requête** : Binance limite les réponses à 1000 chandeliers. En granularité journalière (`interval=1d`), cela couvre environ 2 ans et 9 mois. Pour des périodes plus longues, seules les 1000 premières bougies depuis `startTime` sont retournées.

**Downsampling du graphique** : la série temporelle est réduite à 200 points maximum (`lib/calculator.ts > sample()`) pour maintenir les performances Recharts sur de longues périodes.

**Nearest-price fallback** : si une date d'investissement n'a pas de prix exact (weekend, jour férié), on prend le prix disponible le plus proche.

## Limites API Binance (public)

- Pas de clé API requise
- 1 200 requêtes/minute par IP (tier public)
- 1 000 klines maximum par appel — couvre ~2 ans 9 mois en `1d`
- Données disponibles depuis le listing de chaque paire sur Binance
