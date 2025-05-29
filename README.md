# Documentation technique — mackerprodBackv2

## 1. Présentation

**mackerprodBackv2** est une API REST construite avec **Express.js**.  
Elle fournit des fonctionnalités backend modulaires, destinées à être utilisées par une interface cliente.  
Le projet est conçu pour être maintenable, testé, et facilement déployable.

---

## 2. Structure du projet

Organisation des dossiers à la racine du projet :

- `routes/`  
  Contient les définitions des routes API, réparties par fonctionnalité ou ressource.

- `middleware/`  
  Middlewares personnalisés pour le traitement des requêtes (authentification, validation, etc.).

- `utils/`  
  Fonctions utilitaires utilisées dans plusieurs parties de l'application.

- `tests/`  
  Dossier dédié aux tests unitaires et d’intégration.

- `mocks/`  
  Données factices et outils de simulation pour les tests.

- `scriptStarter/`  
  Scripts d’amorçage ou d’initialisation du projet.

- `db.js`  
  Fichier de configuration pour la base de données.

- `app.js`  
  Initialise l’application Express (middlewares, routes, etc.).

- `server.js`  
  Point d’entrée du serveur HTTP (écoute sur un port).

- `jest.config.js`  
  Configuration de l’environnement de test Jest.

- `package.json`  
  Contient la liste des dépendances et scripts de développement.

---

## 3. Fonctionnement de l’application

1. Le fichier `server.js` démarre le serveur et importe `app.js`.
2. `app.js` initialise Express, charge les middlewares et monte les routes.
3. Les routes dans `routes/` sont organisées par domaine fonctionnel.
4. Lorsqu'une requête HTTP est reçue, elle est traitée par :
   - les middlewares globaux,
   - les middlewares de route spécifiques,
   - le contrôleur lié à la route,
   - puis une réponse est envoyée.

---

## 4. Configuration

Le fichier `db.js` gère la connexion à la base de données.  
Les paramètres de connexion (hôte, port, utilisateur, mot de passe) sont généralement fournis via des variables d’environnement.  
Le projet utilise probablement un fichier `.env`, bien qu’il ne soit pas inclus dans le dépôt public.

---

## 5. Tests

Les tests sont organisés dans le dossier `tests/`.  
Ils couvrent des fonctions utilitaires, des routes et des comportements critiques.  
Le projet utilise le framework **Jest** pour l’exécution des tests.  
La configuration est définie dans le fichier `jest.config.js`.

---

## 6. Intégration continue (CI)

Le projet contient un dossier `.github/workflows/` avec une ou plusieurs définitions de pipelines GitHub Actions.  
Ces workflows permettent d'automatiser les actions suivantes :
- Installation des dépendances
- Exécution des tests
- Analyse du code
- Déploiement (si configuré)

---

## 7. Scripts du projet

Les scripts sont définis dans le fichier `package.json`.

Exemples de scripts disponibles :

- `nodemon server.js` : Démarre l’application Express en mode production
- `npm run dev` : Lance l’application en mode développement (avec rechargement)
- `npm run test` : Exécute les tests unitaires via Jest

---

## 8. Dépendances clés

Liste des bibliothèques les plus importantes :

- `express` : Framework web pour créer l’API REST
- `jest` : Framework de test unitaire
- `dotenv` : Chargement des variables d’environnement depuis un fichier `.env`
- `eslint` : Linting JavaScript

---

## 9. Bonnes pratiques du projet

- Séparation claire des responsabilités (routes, middlewares, utilitaires, logique métier)
- Support des tests automatisés
- Utilisation de `dotenv` pour la configuration
- Respect du standard de codage via ESLint
- Architecture simple et modulaire

---

## 10. Contribution

### Étapes recommandées :

1. Cloner le dépôt
2. Créer une nouvelle branche à partir de `main`
3. Effectuer les modifications
4. Ajouter des tests si nécessaire
5. Soumettre une Pull Request avec une description claire

---

## 11. À propos

Projet développé par [tOCHSKa](https://github.com/tOCHSKa).  
Pour plus d’informations ou questions techniques, consulter les issues du dépôt GitHub.

---

