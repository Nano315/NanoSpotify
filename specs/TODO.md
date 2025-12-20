# Implementation Plan (TODO) - TrueShuffle

## Phase 0: Setup & Auth
**Objectif :** Base saine, sécurisée et connectée à Spotify.

- [ ] **Initialisation Projet**
    - [ ] `npx create-next-app@latest` (TS, Tailwind, ESLint, App Router).
    - [ ] Nettoyage du boilerplate (suppression fichiers inutiles).
    - [ ] Configuration dossier `src` ou root (selon structure validée).
- [ ] **Dépendances & Config**
    - [ ] Installer `next-auth`, `spotify-web-api-node`, `@tanstack/react-query`, `zustand`, `framer-motion`, `lucide-react`.
    - [ ] Configurer `tailwind.config.ts` (Couleurs, Fonts, Border Radius).
    - [ ] Créer `.env.local` et ajouter variables (SPOTIFY_CLIENT_ID, SECRET, NEXTAUTH_SECRET).
- [ ] **Authentification (NextAuth)**
    - [ ] Créer `lib/auth.ts` (ou config dans `api/auth/[...nextauth]/route.ts`).
    - [ ] Implémenter Provider Spotify avec scopes : `playlist-read-private`, `playlist-modify-public`, etc.
    - [ ] **CRITIQUE** : Implémenter la rotation du Refresh Token (callback JWT).
    - [ ] Créer composant bouton `<LoginButton />`.
    - [ ] Tester connexion/déconnexion et persistance session.

## Phase 1: Core Logic (Backend/API focus)
**Objectif :** La logique métier fonctionne (Shuffling & Playlist creation) sans UI complexe.

- [ ] **Spotify Client Helper**
    - [x] Créer `lib/spotify.ts` pour instancier `spotify-web-api-node` avec le token user.
    - [x] Créer hook `useSpotify` pour accès facile côté client/composants.
- [ ] **Fetch Playlists**
    - [x] Créer Server Action ou API Route pour lister playlists utilisateur.
    - [ ] Configurer React Query : `usePlaylists`.
- [x] **Algo True Shuffle**
    - [x] Implémenter `lib/algorithms/fisher-yates.ts` (Fisher-Yates Shuffle pur).
    - [ ] Écrire test unitaire simple pour vérifier l'aléatoire (optionnel mais recommandé).
- [x] **Playlist Mutation (The Engine)**
    - [x] Créer fonction `createTrueShufflePlaylist(sourceId)`.
    - [x] Étape 1 : Fetch tous les tracks de la source (pagination !).
    - [x] Étape 2 : Mélanger tracks (Fisher-Yates).
    - [x] Étape 3 : Créer nouvelle playlist `[Nom] - Alter`.
    - [x] Étape 4 : Ajouter tracks à la nouvelle playlist (par batch de 100).

## Phase 2: UI & Vibe (Design Focus)
**Objectif :** L'expérience utilisateur finale (Glassmorphism & Vibe Echo).

- [x] **Layout Shell**
- [x] **Phase 1 : Authentification & Base**
    - [x] Configurer NextAuth avec SpotifyProvider.
    - [x] Créer le middleware de protection des routes.
    - [x] Design System : Variables CSS (.glass-panel, .glass-card).

- [ ] **Phase 2 : Vibe Explorer (Cancelled)**
    - [x] ~~**Pivot Stratégique** : Abandon de `/recommendations` (404) pour `getArtistRelatedArtists`.~~
    - [ ] ~~Algo "Vibe Explorer" (Sourcing Artistes -> Cousins -> Top Tracks).~~
    - [ ] ~~Interface : Cartes 24h/7j/30j.ur Tonalité/Période (24h, 7j, 30j).~~
    - [ ] ~~Logique `generateVibePlaylist` : Fetch Recent -> Get Recommendations -> Create Playlist.~~

## Phase 3: Polish & UX
**Objectif :** Finitions pour effet "Waw".

- [ ] **Framer Motion Integration**
    - [ ] Ajouter transitions de pages (`template.tsx` ou `AnimatePresence`).
    - [ ] Animations d'apparition listes (stagger children).
    - [ ] Micro-interactions boutons (scale on click).
- [ ] **Toast System**
    - [ ] Installer `sonner` ou créer système toast custom.
    - [ ] Notifier : "Playlist créée avec succès !", "Erreur API", etc.
- [ ] **Optimisations**
    - [ ] SEO Basic (Metadata).
    - [ ] Vérifier responsive mobile.
