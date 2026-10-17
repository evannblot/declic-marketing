# Déclic — Mes quiz

Une bibliothèque de matières avec réponses libres, corrections et répétition des questions ratées.

## Quiz inclus

- Marketing : 224 questions, 16 chapitres.
- Communication commerciale : 135 questions, 5 chapitres.

## Utilisation

Choisir une matière, écrire sa réponse, afficher la correction puis cliquer sur **Bon** ou **Mauvais**. Une question réussie est mise de côté ; une erreur revient après trois autres questions si possible. Le filtre de chapitre est propre à chaque matière.

L’accueil permet de rechercher une matière, créer un quiz personnel et importer ou exporter un quiz JSON. Un quiz personnel peut être supprimé après confirmation. Les quiz inclus restent disponibles.

Les quiz personnels, réponses en cours et progressions sont sauvegardés dans le navigateur. Les anciennes progressions marketing sont conservées avec la même clé de stockage. Chaque appareil et chaque adresse du site dispose de son propre stockage. Les exports contiennent les questions, pas la progression.

## Format d’import

```json
{
  "title": "Économie",
  "cards": [
    {"question": "Qu’est-ce qu’un marché ?", "answer": "La rencontre de l’offre et de la demande.", "chapter": "Introduction"}
  ]
}
```

La banque accepte 1 à 2 000 questions par quiz et 50 quiz personnels. Les fichiers d’import sont limités à 5 Mo. Tout contenu importé est validé et affiché comme du texte.

## Développement

Le site est statique. `dist/index.html` charge `quizzes.js`, `engine.js`, `catalog.js`, `app.js` et `library.js`. Les données des quiz inclus sont dans `quizzes.js`. Aucun secret ni base de données n’est nécessaire.

Installer les dépendances de développement (`npm install --ignore-scripts`) puis lancer `npm test`. Happy DOM sert uniquement aux tests de l’interface ; il n’est pas chargé dans le site.

## Publication

Vercel publie `dist` sans installation ni compilation. Les modifications de la branche `main` sont déployées par l’intégration GitHub.

## Fiabilité et vérifications

La progression reste disponible pendant la session si le navigateur refuse de la sauvegarder. Les ajouts de quiz relisent la bibliothèque avant enregistrement pour conserver les modifications provenant d’autres onglets. Une sauvegarde illisible est copiée dans une clé de récupération avant son remplacement.

Les résultats peuvent être synchronisés entre onglets du même navigateur. Une question actualisée par un autre onglet est affichée avant de poursuivre l’auto-évaluation.

La suite de vérification approfondie couvre 23 scénarios : parcours complet des deux matières, stockage indisponible ou plein, données endommagées, modifications concurrentes, import et export, limites de taille, clavier et libellés accessibles. Le moteur est également testé sur 20 000 transitions. Ces tests utilisent Happy DOM et ne remplacent pas un contrôle visuel dans un vrai navigateur sur mobile.
