# Implementation Plan (TODO) - NanoSpotify

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
    - [ ] Implémenter Provider Spotify avec scopes : `playlist-read-private`, `playlist-modify-public`, `user-read-recently-played`, etc.
    - [ ] **CRITIQUE** : Implémenter la rotation du Refresh Token (callback JWT).
    - [ ] Créer composant bouton `<LoginButton />`.
    - [ ] Tester connexion/déconnexion et persistance session.

## Phase 1: Core Logic (Backend/API focus)
**Objectif :** La logique métier fonctionne (Shuffling & Playlist creation) sans UI complexe.

- [ ] **Spotify Client Helper**
    - [ ] Créer `lib/spotify.ts` pour instancier `spotify-web-api-node` avec le token user.
    - [ ] Créer hook `useSpotify` pour accès facile côté client/composants.
- [ ] **Fetch Playlists**
    - [ ] Créer Server Action ou API Route pour lister playlists utilisateur.
    - [ ] Configurer React Query : `usePlaylists`.
- [ ] **Algo True Shuffle**
    - [ ] Implémenter `lib/algorithms/fisher-yates.ts` (Fisher-Yates Shuffle pur).
    - [ ] Écrire test unitaire simple pour vérifier l'aléatoire (optionnel mais recommandé).
- [ ] **Playlist Mutation (The Engine)**
    - [ ] Créer fonction `createTrueShufflePlaylist(sourceId)`.
    - [ ] Étape 1 : Fetch tous les tracks de la source (pagination !).
    - [ ] Étape 2 : Mélanger tracks (Fisher-Yates).
    - [ ] Étape 3 : Créer nouvelle playlist `[Nom] - Alter`.
    - [ ] Étape 4 : Ajouter tracks à la nouvelle playlist (par batch de 100).

## Phase 2: UI & Vibe (Design Focus)
**Objectif :** L'expérience utilisateur finale (Glassmorphism & Vibe Echo).

- [ ] **Layout Shell**
    - [ ] Créer `components/layout/AppShell.tsx` (Sidebar/Nav simplifiée mobile-first).
    - [ ] Appliquer bg sombre + `globals.css` (Glassmorphism base classes).
- [ ] **Dashboard Home**
    - [ ] Afficher liste des playlists (Grid/List toggle).
    - [ ] Composant `PlaylistCard` avec image, titre, et hover effect glass.
- [ ] **Shuffle UI Flow**
    - [ ] Page détail playlist ou Modal de sélection.
    - [ ] Bouton "Generate True Shuffle" avec état de loading (spinner/progress).
    - [ ] Feedback visuel post-génération (succès).
- [ ] **Feature B: Vibe Echo**
    - [ ] Créer page `/vibe`.
    - [ ] UI Sélecteur Tonalité/Période (24h, 7j, 30j).
    - [ ] Logique `generateVibePlaylist` : Fetch Recent -> Get Recommendations -> Create Playlist.

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
