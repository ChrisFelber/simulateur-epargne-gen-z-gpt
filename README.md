# simulateur-epargne-gen-z-gpt

Prototype mobile-first de **bloom.**, un simulateur d'épargne pensé pour un public jeune.

## Architecture

Le projet est volontairement sans framework, mais séparé par responsabilités afin de limiter les régressions lors des futures modifications.

```text
.
├── index.html
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── themes.css
│   └── responsive.css
└── js/
    ├── app.js
    ├── calculator.js
    ├── chart.js
    ├── translations.js
    ├── theme.js
    └── ui.js
```

### Responsabilités

- `index.html` : structure HTML uniquement.
- `css/base.css` : variables globales et styles fondamentaux.
- `css/layout.css` : structure et disposition générale.
- `css/components.css` : composants visuels.
- `css/themes.css` : mode clair/sombre.
- `css/responsive.css` : adaptations mobiles.
- `js/calculator.js` : calculs financiers purs.
- `js/chart.js` : rendu du graphique.
- `js/translations.js` : textes FR/EN.
- `js/theme.js` : gestion du thème et préférence locale.
- `js/ui.js` : mise à jour de l'interface.
- `js/app.js` : état de l'application, événements et orchestration.

Cette séparation permet de modifier une fonctionnalité ciblée sans toucher au reste du simulateur. Elle ne rend pas une erreur impossible, mais réduit nettement son rayon d'impact et facilite le retour arrière via Git.

## Fonctionnalités

- Design Gen Z responsive, optimisé mobile
- Projection de l'épargne avec intérêts composés
- Capital initial et versement mensuel interactifs
- Durée de 5 à 30 ans
- 4 stratégies de rendement : Revenu, Équilibré, Croissance, Actions
- Graphique dynamique : épargne totale vs capital investi
- Carte d'objectif avec progression
- FR / EN fonctionnel
- Mode clair / sombre avec préférence mémorisée
- Aucun framework ni dépendance externe

## Lancer localement

Les scripts utilisent les modules JavaScript natifs. Il faut donc servir le dossier via un petit serveur HTTP plutôt que d'ouvrir directement `index.html` avec `file://`.

Exemple :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Déploiement GitHub Pages

Dans GitHub : **Settings → Pages → Deploy from a branch → main / root**.

## Méthode de travail recommandée

Pour les futures modifications importantes : créer une branche dédiée, tester, puis fusionner via une pull request. Ainsi `main` reste la version stable.
