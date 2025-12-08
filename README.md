# 🚚 TrackFlow - Système de Gestion de Flotte

Application web complète de gestion de flotte de transport routier permettant le suivi des trajets, la consommation de carburant, et la maintenance des véhicules.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies Utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Déploiement Docker](#-déploiement-docker)
- [Tests](#-tests)
- [Structure du Projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Contributeurs](#-contributeurs)

## ✨ Fonctionnalités

### Pour les Administrateurs
- ✅ Gestion complète de la flotte (camions, remorques, pneus)
- ✅ Création et assignation des trajets aux chauffeurs
- ✅ Suivi en temps réel du kilométrage et de la consommation
- ✅ Rapports détaillés : consommation, kilométrage, maintenance
- ✅ Configuration des règles de maintenance périodique
- ✅ Gestion des utilisateurs et des permissions

### Pour les Chauffeurs
- ✅ Visualisation des trajets assignés
- ✅ Téléchargement des ordres de mission en PDF
- ✅ Mise à jour du statut des trajets (à faire, en cours, terminé)
- ✅ Saisie du kilométrage et volume de gasoil
- ✅ Signalement de l'état des véhicules

## 🛠 Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification et autorisation
- **Jest** - Tests unitaires
- **PDFKit** - Génération de PDF

### Frontend
- **React.js** - Bibliothèque UI
- **Redux / Context API** - Gestion d'état global
- **React Router** - Routing avec Nested Routes
- **Axios** - Client HTTP
- **Tailwind CSS** - Styling

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration des conteneurs
- **Git** - Contrôle de version

## 🏗 Architecture

```
TrackFlow/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration de l'app
│   │   ├── controllers/     # Logique métier
│   │   ├── models/          # Modèles Mongoose
│   │   ├── routes/          # Définition des routes
│   │   ├── middlewares/     # Middlewares (auth, errors)
│   │   ├── services/        # Services métier
│   │   ├── utils/           # Utilitaires
│   │   └── app.js           # Point d'entrée
│   ├── tests/               # Tests unitaires
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── pages/           # Pages de l'application
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # Context API
│   │   ├── services/        # Services API
│   │   ├── utils/           # Utilitaires
│   │   └── App.js
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 📦 Prérequis

- **Node.js** >= 18.x
- **MongoDB** >= 6.x
- **Docker** >= 20.x (optionnel)
- **Docker Compose** >= 2.x (optionnel)
- **npm** ou **yarn**

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/keltoummalouki/trackflow.git
cd TrackFlow
```

### 2. Installation Backend

```bash
cd backend
npm install
```

### 3. Installation Frontend

```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend (.env)

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/trackflow
MONGODB_TEST_URI=mongodb://localhost:27017/trackflow_test

# JWT
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# PDF Generation
PDF_UPLOAD_PATH=./uploads/pdfs
```

### Frontend (.env)

Créez un fichier `.env` dans le dossier `frontend/` :

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🏃 Démarrage

### Développement Local

#### 1. Démarrer MongoDB
```bash
# Si MongoDB est installé localement
mongod
```

#### 2. Démarrer le Backend
```bash
cd backend
npm run dev
```

Le serveur backend démarrera sur `http://localhost:5000`

#### 3. Démarrer le Frontend
```bash
cd frontend
npm start
```

L'application frontend démarrera sur `http://localhost:3000`

## 🐳 Déploiement Docker

### Build et démarrage avec Docker Compose

```bash
# Build les images et démarre les conteneurs
docker-compose up --build

# En mode détaché
docker-compose up -d
```

### Commandes Docker utiles

```bash
# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire une image spécifique
docker-compose build backend
docker-compose build frontend

# Accéder au conteneur backend
docker exec -it trackflow sh

# Accéder à MongoDB
docker exec -it trackflow_mongodb mongosh
```

### Architecture Docker

```yaml
Services:
- frontend: Port 3000
- backend: Port 5000
- mongodb: Port 27017

Network: trackflow-network
```

## 🧪 Tests

### Backend Tests

```bash
cd backend

# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm run test:coverage
```

### Frontend Tests (si implémentés)

```bash
cd frontend
npm test
```

## 📁 Structure du Projet

### Backend

```
backend/src/
├── config/
│   └── database.js          # Configuration MongoDB
├── controllers/
│   ├── authController.js    # Authentification
│   ├── truckController.js   # Gestion camions
│   ├── trailerController.js # Gestion remorques
│   ├── routeController.js   # Gestion trajets
│   └── maintenanceController.js
├── models/
│   ├── User.js
│   ├── Truck.js
│   ├── Trailer.js
│   ├── Route.js
│   ├── Tire.js
│   └── Maintenance.js
├── routes/
│   ├── authRoutes.js
│   ├── truckRoutes.js
│   └── routeRoutes.js
├── middlewares/
│   ├── auth.js              # Vérification JWT
│   ├── errorHandler.js      # Gestion des erreurs
│   └── validation.js        # Validation des données
└── services/
    └── pdfService.js        # Génération PDF
```

### Frontend

```
frontend/src/
├── components/
│   ├── common/              # Composants réutilisables
│   ├── admin/               # Composants admin
│   └── driver/              # Composants chauffeur
├── pages/
│   ├── Dashboard.js
│   ├── Login.js
│   ├── Trucks.js
│   └── Routes.js
├── context/
│   └── AuthContext.js       # Context d'authentification
├── services/
│   └── api.js               # Configuration Axios
└── utils/
    └── helpers.js
```

## 📡 API Documentation

### Endpoints Principaux

#### Authentication
```
POST   /api/auth/register    # Inscription
POST   /api/auth/login       # Connexion
GET    /api/auth/me          # Profil utilisateur
```

#### Trucks (Admin)
```
GET    /api/trucks           # Liste des camions
POST   /api/trucks           # Créer un camion
GET    /api/trucks/:id       # Détails d'un camion
PUT    /api/trucks/:id       # Modifier un camion
DELETE /api/trucks/:id       # Supprimer un camion
```

#### Routes
```
GET    /api/routes           # Liste des trajets
POST   /api/routes           # Créer un trajet (Admin)
GET    /api/routes/:id       # Détails d'un trajet
PUT    /api/routes/:id       # Modifier un trajet
GET    /api/routes/:id/pdf   # Télécharger PDF
PATCH  /api/routes/:id/status # Mettre à jour le statut
```

#### Maintenance (Admin)
```
GET    /api/maintenance      # Liste des maintenances
POST   /api/maintenance      # Créer une maintenance
GET    /api/maintenance/alerts # Alertes de maintenance
```

### Codes de Statut HTTP

- `200` - Succès
- `201` - Créé
- `400` - Mauvaise requête
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Non trouvé
- `500` - Erreur serveur

## 🔐 Sécurité

- Authentification JWT avec tokens sécurisés
- Validation des entrées utilisateur
- Protection contre les injections NoSQL
- Gestion des rôles et permissions
- CORS configuré
- Rate limiting (recommandé en production)

## 📝 Bonnes Pratiques Implémentées

- ✅ **DRY** (Don't Repeat Yourself) - Code réutilisable
- ✅ **SRP** (Single Responsibility Principle) - Une fonction = une responsabilité
- ✅ **Error Handling** - Gestion robuste des erreurs
- ✅ **Tests unitaires** - Coverage des controllers
- ✅ **Code modulaire** - Organisation claire
- ✅ **Nommage explicite** - Variables et fonctions claires
- ✅ **Documentation** - Code commenté

## 🚧 Améliorations Futures

- [ ] Notifications en temps réel (WebSockets)
- [ ] Module de géolocalisation GPS
- [ ] Dashboard avec graphiques avancés
- [ ] Export de rapports Excel
- [ ] Application mobile (React Native)
- [ ] Intégration avec systèmes ERP

## 📄 Licence

Ce projet est développé dans le cadre d'une formation [2025] Concepteur⋅rice développeur⋅se d'applications.

## 📞 Contact

Pour toute question ou suggestion :
- Email: keltoummalouki@gmail.com
- GitHub: [@keltoummalouki](https://github.com/keltoummalouki)

---

**Date de création**: 08/12/2025  

Made with ❤️ for efficient fleet management