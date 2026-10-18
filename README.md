# Déclic — Mes matières et mes quiz

L’accueil affiche les matières. Chaque matière ouvre sa liste de quiz, puis la session de révision. On répond dans sa tête, on affiche la correction et on choisit « Bon » ou « Mauvais ».

## Les quatre quiz intégrés

| Matière | Tout le cours | L’essentiel |
| --- | --- | --- |
| Marketing | 164 questions | 41 questions |
| Communication commerciale | 130 questions | 55 questions |

Les quiz essentiels reprennent des questions du cours complet dans une sélection plus courte. Les questions sur les exemples et cas de marques restent exclues.

En communication, la sélection suit les indications du PDF pour le partiel : définitions, hiérarchie des effets, identité/image/réputation et risques d’image, cibles, insight, motivations et freins, client idéal, théories, sémiologie, stratégie et copy stratégie. Les références utiles sont aux pages 1, 12 à 16 et 19, ainsi qu’aux pages des notions correspondantes.

La fiche marketing n’énumère pas une liste spécifique de thèmes du partiel. La sélection s’appuie sur ses définitions, mémos et repères centraux : démarche, mesures du marché, diagnostic et SWOT, mix, segmentation, ciblage et positionnement. Les six conditions de segmentation de la fiche sont incluses.

## Progression et navigation

Chaque quiz a sa propre sauvegarde et son propre filtre de chapitre. « Bon » retire la question de la session ; « Mauvais » la replace après trois autres questions si possible. La remise à zéro d’un quiz ne touche pas les autres.

Les quiz complets conservent leurs identifiants et clés de sauvegarde, ainsi que les résultats et historiques déjà enregistrés. Les banques originales de 104 et 70 questions peuvent toujours être étendues aux banques complètes actuelles. L’ancien filtre des essentiels est remplacé par deux quiz distincts ; une correction affichée dans cet ancien filtre est masquée lors de la transition pour éviter de l’associer à une autre question.

Le bouton de retour mène de la révision à la liste des quiz de la matière, puis à la liste des matières. Les cours consultés depuis une matière reviennent à cette matière ; ceux ouverts depuis une correction reviennent à la question.

Les données endommagées sont copiées avant remplacement. Si le stockage est indisponible, la progression reste disponible pendant la session. Les écritures de bibliothèque relisent les dernières données pour préserver les changements provenant d’autres onglets.

## Documents

Le site présente uniquement les copies PDF fournies : marketing (10 pages) et communication (19 pages). Il n’affiche pas de retranscription. Les boutons d’accès au cours depuis une question ou sa correction ouvrent la page correspondante et font défiler l’écran vers le PDF. Le lien pour ouvrir le document dans un autre onglet conserve la page. Les notions absentes de la fiche n’ont pas de référence artificielle.

## Quiz personnels

Depuis une matière, ajouter un quiz préremplit son nom. Depuis l’accueil, on peut créer une nouvelle matière. Les anciens quiz personnels sans nom de matière sont conservés et utilisent leur titre comme matière. On peut aussi importer ou exporter des quiz JSON. Le regroupement par matière est conservé à l’import et après rechargement.

Le format accepte un nom de quiz, un nom de matière facultatif et les questions :

```json
{"title":"Formules","subjectTitle":"Marketing","cards":[{"question":"Question ?","answer":"Correction","chapter":"Chapitre"}]}
```

## Développement et publication

Site statique sans secret ni base de données. Installer les dépendances avec `npm install --ignore-scripts`, puis lancer `npm test`.

Les tests vérifient la navigation matière → quiz → question, les sélections essentielles, les sauvegardes et migrations, les imports/exports, les écritures concurrentes, la répétition et les liens PDF. Happy DOM teste les interactions ; le rendu sur de vrais téléphones n’est pas validé par ces tests.

Vercel publie le dossier `dist` sans installation ni compilation. Les modifications de `main` sont déployées par l’intégration GitHub.
