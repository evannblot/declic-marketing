# Déclic — Mes quiz et mes cours

Une bibliothèque de matières avec questions de cours, réponse dans la tête, correction et répétition des erreurs. Aucune saisie n’est nécessaire : afficher la correction, puis choisir « Bon » ou « Mauvais ».

## Questions

- Marketing : 104 questions, 9 chapitres.
- Communication commerciale : 70 questions, 5 chapitres.

Les questions portent sur les définitions et notions. Elles ont été réécrites individuellement ; les questions consacrées aux exemples et cas de marques ont été retirées.

## Cours complets

Le bouton **Voir le cours** ouvre directement la fiche fournie pour la matière au format PDF : marketing (10 pages) ou communication commerciale (19 pages). Les deux fiches sont téléchargeables en PDF. La lecture en texte intégral, la recherche et la navigation par page restent disponibles.

Lorsqu’une notion est présente dans la fiche fournie, sa correction indique un extrait, le titre du document et le numéro de page. Les notions absentes de la fiche ne reçoivent pas de référence artificielle ; les questions et la progression sont conservées. **Voir ce passage dans le cours** ouvre cette page avec l’extrait surligné. Le retour au quiz conserve la question et la correction affichée.

## Progression

Une réponse « Bon » met la question de côté ; « Mauvais » la replace après trois autres questions si possible. Chaque matière a son propre filtre et sa propre progression. Les nouvelles banques de questions utilisent de nouvelles clés de progression ; les anciennes sauvegardes ne sont pas effacées. Les quiz personnels restent conservés.

Les sauvegardes restent dans le navigateur. Les ajouts relisent la bibliothèque avant écriture pour préserver les changements provenant d’autres onglets. Les données endommagées sont copiées avant remplacement. Si le stockage est indisponible, la progression reste accessible pendant la session.

## Quiz personnels

Créer un quiz ou importer un fichier JSON. Les exports contiennent les questions, corrections et références de cours, pas la progression. Le format est `{ "title": "Matière", "cards": [{ "question": "Question ?", "answer": "Correction", "chapter": "Chapitre" }] }`.

## Développement et tests

Le site est statique et ne requiert ni secret ni base de données. Installer les dépendances de développement avec `npm install --ignore-scripts`, puis lancer `npm test`.

Les tests couvrent le parcours de révision, les sauvegardes, les imports/exports, les onglets concurrents, les références exactes aux documents et la navigation entre cours et question. Happy DOM teste les interactions ; le rendu sur de vrais téléphones n’est pas validé par ces tests.

## Publication

Vercel publie le dossier `dist` sans installation ni compilation. Les modifications de `main` sont automatiquement déployées par l’intégration GitHub.
