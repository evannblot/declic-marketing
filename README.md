# Déclic Marketing

Application de révision en français avec 224 questions couvrant 16 chapitres.

## Utilisation

1. Choisir tout le cours ou un chapitre.
2. Écrire sa réponse puis afficher la correction.
3. Choisir **Bon** pour mettre la question de côté, ou **Mauvais** pour la revoir après trois autres questions quand il en reste suffisamment.

La progression et la réponse en cours sont conservées dans le navigateur. Il n’y a pas de compte utilisateur, de base de données ni de correction automatique. La progression est propre à chaque navigateur et à chaque adresse du site.

## Structure

- `dist/index.html` : interface responsive.
- `dist/app.js` : interactions et sauvegarde locale.
- `dist/engine.js` : file de questions et compteurs.
- `dist/cards.js` : banque de questions chargée par l’application.
- `dist/cards.json` : copie structurée de la banque.
- `test.cjs` et `ui-test.cjs` : tests sans dépendances.
- `vercel.json` : publication statique du dossier `dist`.

## Vérification

Avec Node.js 20 ou plus récent, lancer `npm test`.

## Vercel

Importer ce dépôt dans Vercel. La configuration utilise le dossier `dist` sans installation de dépendances ni compilation. Pour une consultation publique, vérifier que la protection du déploiement de production ne demande pas de connexion Vercel.
