# Déclic — Mes quiz et mes cours

Une bibliothèque de matières avec questions de cours, réponse libre, correction et répétition des erreurs.

## Questions

- Marketing : 104 questions, 9 chapitres.
- Communication commerciale : 70 questions, 5 chapitres.

Les questions portent sur les définitions et notions. Elles ont été réécrites individuellement ; les questions consacrées aux exemples et cas de marques ont été retirées.

## Cours complets

Le bouton **Voir le cours** ouvre les documents de la matière en texte intégral ou en PDF, avec recherche et navigation par page. Les quatre séquences de marketing, la fiche de marketing et le cours de communication représentent 171 pages. La fiche de communication d’origine est également téléchargeable au format Word.

Sous chaque correction figurent un extrait du document, le titre et le numéro de page. **Voir ce passage dans le cours** ouvre cette page avec l’extrait surligné. Le retour au quiz conserve la réponse et la correction affichée.

Les informations d’accès à la plateforme universitaire ont été masquées dans le document publié. Les pages pédagogiques et la numérotation sont conservées.

## Progression

Une réponse « Bon » met la question de côté ; « Mauvais » la replace après trois autres questions si possible. Chaque matière a son propre filtre et sa propre progression. Les nouvelles banques de questions utilisent de nouvelles clés de progression ; les anciennes sauvegardes ne sont pas effacées. Les quiz personnels restent conservés.

Les sauvegardes restent dans le navigateur. Les ajouts relisent la bibliothèque avant écriture pour préserver les changements provenant d’autres onglets. Les données endommagées sont copiées avant remplacement. Si le stockage est indisponible, la progression reste accessible pendant la session.

## Quiz personnels

Créer un quiz ou importer un fichier JSON. Les exports contiennent les questions, corrections et références de cours, pas la progression. Le format est `{ "title": "Matière", "cards": [{ "question": "Question ?", "answer": "Correction", "chapter": "Chapitre" }] }`.

## Développement et tests

Le site est statique et ne requiert ni secret ni base de données. Installer les dépendances de développement avec `npm install --ignore-scripts`, puis lancer `npm test`.

Les tests couvrent le parcours de révision, les sauvegardes, les imports/exports, les onglets concurrents, les références exactes aux documents et la navigation entre cours et réponse. Happy DOM teste les interactions ; le rendu sur de vrais téléphones n’est pas validé par ces tests.

## Publication

Vercel publie le dossier `dist` sans installation ni compilation. Les modifications de `main` sont automatiquement déployées par l’intégration GitHub.
