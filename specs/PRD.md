# Product Requirements Document (PRD) - NanoSpotify

## 1. Vision & Objectif
NanoSpotify est une "Companion App" utilitaire conçue pour combler les lacunes de l'application officielle Spotify, en particulier la gestion de l'aléatoire.
*   **Core Value** : Offrir un "Vrai Aléatoire" (True Shuffle) via la génération de playlists statiques mathématiquement mélangées.
*   **Approche** : Outil de gestion de bibliothèque et de découverte, pas de remplacement du lecteur audio.

## 2. Cible & Plateforme
*   **Cible** : Projet Portfolio (Showcase technique) avec qualité "Production-Ready" pour usage réel (Friends & Family).
*   **Plateforme** : Web App (Site internet) Mobile-First.
*   **Cible à terme** : PWA (Progressive Web App) avec sensation native (App-like).

## 3. Tech & Contraintes
### Architecture Audio
*   **Source Audio** : Aucune lecture directe dans le navigateur.
*   **Web Playback SDK** : **EXCLU**. L'application ne streame pas la musique.

### API & Données
*   **Provider** : Spotify Web API exclusive (REST).
*   **Authentification** : OAuth 2.0 (Scopes: `user-read-private`, `user-read-email`, `playlist-read-private`, `playlist-modify-public`, `playlist-modify-private`, `user-read-recently-played`).

## 4. Fonctionnalités Clés (MVP)

### Feature A : True Shuffle Generator (Priorité 1)
Résoudre le problème de l'algorithme "pseudo-aléatoire" de Spotify.
*   **Flow Utilisateur** :
    1.  L'utilisateur sélectionne une playlist source dans sa bibliothèque.
    2.  L'application génère (ou met à jour) une playlist cible nommée `[Nom Source] - Alter`.
    3.  L'algorithme (Fisher-Yates) mélange 100% des titres de manière purement aléatoire.
    4.  La playlist résultante est sauvegardée sur le compte Spotify de l'utilisateur.

### Feature B : Vibe Echo (Priorité 2)
Découverte basée sur l'historique récent.
*   **Flow Utilisateur** :
    1.  L'utilisateur choisit une fenêtre temporelle (24h, Semaine, Mois).
    2.  L'application analyse les titres récemment écoutés (`user-read-recently-played`).
    3.  L'application utilise les endpoints de Recommandations de Spotify pour trouver des titres similaires.
    4.  Une nouvelle playlist "Vibe Echo" est générée.

## 5. Design & Identité
*   **Style** : Futuriste / Glassmorphism.
*   **Thème** : Dark Mode Profond.
*   **Palette** :
    *   Fond sombre (quasi noir).
    *   Vert Spotify revisité (Néon / Glow).
    *   Accents violets/bleus profonds.
*   **UI/UX** :
    *   Effets de flou (`backdrop-filter: blur`).
    *   Transparences et superpositions.
    *   Animations fluides (micro-interactions).
    *   Navigation SPA (Single Page Application) sans rechargements visibles.
