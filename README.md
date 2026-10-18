# Déclic — Mes matières et mes quiz

L’accueil affiche les matières. Chaque matière ouvre sa liste de quiz, puis la session de révision. On répond dans sa tête, on affiche la correction et on choisit « Bon » ou « Mauvais ».

## Les cinq quiz intégrés

| Matière | Tout le cours | L’essentiel | Études de cas |
| --- | --- | --- | --- |
| Marketing | 164 questions | 41 questions | — |
| Communication commerciale | 133 questions | 73 questions | 12 situations |

Les quiz essentiels reprennent des questions du cours complet dans une sélection plus courte. Les quiz de notions excluent les questions de restitution des exemples de marques vus en cours. Le quiz de cas utilise des situations fictives inédites pour appliquer les notions.

En communication, la sélection suit les indications du PDF pour le partiel : définitions, hiérarchie des effets, identité/image/réputation et risques d’image, cibles, insight, motivations et freins, client idéal, théories, sémiologie, stratégie et copy stratégie. À la demande de l’utilisateur, elle comprend aussi Aaker, Keller et la réglementation, avec des corrections développées : dimensions et traits, niveaux et actions, organismes et règles publicitaires.

Les 12 études de cas couvrent les objectifs de communication, la marque, les cibles et l’insight, la copy stratégie, la sémiologie, les modèles et la réglementation. La situation est séparée de la question. Le corrigé explique le raisonnement et fournit des critères d’auto-évaluation ; des solutions différentes sont acceptables si elles sont justifiées. Les liens PDF renvoient aux notions utilisées, puisque les situations fictives ne figurent pas dans le document du cours.

La fiche marketing n’énumère pas une liste spécifique de thèmes du partiel. La sélection s’appuie sur ses définitions, mémos et repères centraux : démarche, mesures du marché, diagnostic et SWOT, mix, segmentation, ciblage et positionnement. Les six conditions de segmentation de la fiche sont incluses.

## Progression et navigation

Chaque quiz a sa propre sauvegarde et son propre filtre de chapitre. « Bon » retire la question de la session ; « Mauvais » la replace après trois autres questions si possible. La remise à zéro d’un quiz ne touche pas les autres.

Les quiz conservent leurs identifiants et clés de sauvegarde, ainsi que les résultats et historiques déjà enregistrés. Les banques originales de 104 et 70 questions, la précédente banque complète de communication de 130 questions et la sélection essentielle de 55 questions peuvent être étendues sans perte. Seuls ces ensembles antérieurs précis sont admis pour une migration : une sauvegarde partielle inconnue reste rejetée. L’ancien filtre des essentiels est remplacé par deux quiz distincts ; une correction affichée dans cet ancien filtre est masquée lors de la transition pour éviter de l’associer à une autre question.

Le bouton de retour mène de la révision à la liste des quiz de la matière, puis à la liste des matières. Le PDF s’ouvre dans une fenêtre de lecture sans quitter la révision. Le retour reste visible en haut et retrouve exactement la même question ou correction, la position de défilement et le contrôle utilisé. Depuis une matière, fermer le lecteur retrouve sa liste de quiz.

Les données endommagées sont copiées avant remplacement. Si le stockage est indisponible, la progression reste disponible pendant la session. Les écritures de bibliothèque relisent les dernières données pour préserver les changements provenant d’autres onglets.

## Confort de révision

La barre de révision reste en bas de l’écran. Elle affiche d’abord « Voir la réponse », puis « Bon » et « Mauvais » avec le résultat de chaque choix. L’accès au cours reste à côté des actions. Les corrections et les prochaines questions remontent dans la zone de lecture ; les préférences de réduction des mouvements sont respectées.

« Annuler » rétablit exactement la dernière évaluation, avec la file, la maîtrise et les compteurs précédents, y compris après la dernière question. Cette annulation reste disponible pendant le quiz courant et est invalidée après un changement de quiz, de filtre, une remise à zéro ou une nouvelle sauvegarde provenant d’un autre onglet.

Sur ordinateur : Espace affiche la réponse, 1 choisit « Mauvais », 2 choisit « Bon », C ouvre le cours. Les raccourcis laissent les formulaires, les champs et les fenêtres de dialogue fonctionner normalement. Échap ferme le lecteur PDF quand le navigateur transmet la touche à la page. Le bouton de retour reste disponible pendant la lecture du PDF.

## Documents

Le site présente uniquement les copies PDF fournies : marketing (10 pages) et communication (19 pages). Il n’affiche pas de retranscription. Les accès au cours depuis une question ou sa correction ouvrent la page correspondante. Le lecteur propose les pages précédente/suivante et un retour au passage lié après exploration. Le lien pour ouvrir le document dans un autre onglet conserve la page. Les notions absentes de la fiche n’ont pas de référence artificielle.

## Quiz personnels

Depuis une matière, ajouter un quiz préremplit son nom. Depuis l’accueil, on peut créer une nouvelle matière. Les anciens quiz personnels sans nom de matière sont conservés et utilisent leur titre comme matière. On peut aussi importer ou exporter des quiz JSON. Le regroupement par matière est conservé à l’import et après rechargement.

Le format accepte un nom de quiz, un nom de matière facultatif et les questions :

```json
{"title":"Formules","subjectTitle":"Marketing","cards":[{"question":"Question ?","answer":"Correction","chapter":"Chapitre"}]}
```

Un champ `scenario` facultatif (8 000 caractères maximum) ajoute une situation à analyser. L’export, l’import et son formulaire de vérification conservent ce champ et les références PDF. Il ne crée pas de zone de saisie pendant la révision.

## Développement et publication

Site statique sans secret ni base de données. Installer les dépendances avec `npm install --ignore-scripts`, puis lancer `npm test`.

Les tests vérifient la navigation matière → quiz → question, les sélections essentielles, les sauvegardes et migrations, les imports/exports, les écritures concurrentes, la répétition et les liens PDF. Happy DOM teste les interactions, dont l’annulation, la lecture modale et la restauration de la place. Le test navigateur facultatif utilise Playwright avec Chromium pour vérifier les formats 1440×1000, 390×844 et 320×568, le chargement du PDF, les contrôles et les retours. Ces formats simulés ne constituent pas un test sur un téléphone physique. Il se lance avec `node browser-test.cjs` pendant qu’un serveur sert `dist` sur le port 8778 ; `DEClic_BASE_URL`, `DEClic_PLAYWRIGHT_MODULE` et `DEClic_QA_DIR` peuvent adapter la cible et les outils.

Vercel publie le dossier `dist` sans installation ni compilation. Les modifications de `main` sont déployées par l’intégration GitHub.
