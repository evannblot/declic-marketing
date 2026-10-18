# Déclic — Mes quiz et mes cours

Une bibliothèque de matières avec questions de cours, réponse dans la tête, correction et répétition des erreurs. Aucune saisie n’est nécessaire : afficher la correction, puis choisir « Bon » ou « Mauvais ».

## Questions

- Marketing : 164 questions, 9 chapitres, dont 109 dans « Essentiels du partiel ».
- Communication commerciale : 130 questions, 5 chapitres, dont 99 dans « Essentiels du partiel ».

Les questions portent sur les définitions et notions. Elles ont été réécrites individuellement ; les questions consacrées aux exemples et cas de marques ont été retirées.

Le marketing propose 60 questions supplémentaires sur les notions de la fiche : démarche et objectifs, mesures du marché, diagnostic interne, SWOT, marketing mix, segmentation, ciblage et positionnement. Sa sélection « Essentiels du partiel » regroupe les 109 questions avec renvoi à la fiche.

La communication s’ouvre sur « Essentiels du partiel » : définitions, hiérarchie des effets, identité/image/réputation, cibles, insight, motivations et freins, client idéal, théories, sémiologie, stratégie et copy stratégie. Les 130 questions restent accessibles via « Toutes les questions » ou par chapitre.

## Cours complets

Le bouton **Voir le cours** ouvre directement la fiche fournie pour la matière au format PDF : marketing (10 pages) ou communication commerciale (19 pages). Les deux fiches sont téléchargeables en PDF. Le site affiche uniquement les copies PDF, avec navigation par page et téléchargement. Il ne propose pas de retranscription des documents.

Lorsqu’une notion est présente dans la fiche fournie, sa correction indique le titre du document et le numéro de page. Les notions absentes de la fiche ne reçoivent pas de référence artificielle ; les questions et la progression sont conservées. **Voir la page du PDF** et le bouton **Voir le cours en entier** ouvrent directement la page liée à la question. Le lecteur indique la page concernée et défile jusqu’au document ; le lien ouvrant le PDF dans un autre onglet conserve cette page. La bibliothèque permet toujours de consulter le document depuis sa première page. Le retour au quiz conserve la question et la correction affichée.

## Progression

Une réponse « Bon » met la question de côté ; « Mauvais » la replace après trois autres questions si possible. Chaque matière a son propre filtre et sa propre progression. Les ajouts de 60 questions en marketing et de 60 en communication conservent les 104 anciennes questions de marketing et les 70 anciennes questions de communication, leurs identifiants, les clés de sauvegarde et les résultats précédents. Une migration ajoute les nouvelles questions à la file. Si aucune sélection de chapitre n’était active, elle ouvre la sélection des essentiels ; les choix de filtre effectués après cette mise à jour restent conservés. Les autres sauvegardes invalides restent protégées par une copie de récupération. Les quiz personnels restent conservés.

Les sauvegardes restent dans le navigateur. Les ajouts relisent la bibliothèque avant écriture pour préserver les changements provenant d’autres onglets. Les données endommagées sont copiées avant remplacement. Si le stockage est indisponible, la progression reste accessible pendant la session.

## Quiz personnels

Créer un quiz ou importer un fichier JSON. Les exports contiennent les questions, corrections et références de cours, pas la progression. Le format est `{ "title": "Matière", "cards": [{ "question": "Question ?", "answer": "Correction", "chapter": "Chapitre" }] }`.

## Développement et tests

Le site est statique et ne requiert ni secret ni base de données. Installer les dépendances de développement avec `npm install --ignore-scripts`, puis lancer `npm test`.

Les tests couvrent le parcours de révision, les sauvegardes, les imports/exports, les onglets concurrents, les références exactes aux documents et la navigation entre cours et question. Happy DOM teste les interactions ; le rendu sur de vrais téléphones n’est pas validé par ces tests.

## Publication

Vercel publie le dossier `dist` sans installation ni compilation. Les modifications de `main` sont automatiquement déployées par l’intégration GitHub.
