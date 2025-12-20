# Technical Specifications (TECH_SPEC) - TrueShuffle

## 1. Stack Technique
Pour garantir une application moderne, performante et "Production-Ready", nous avons sélectionné la stack suivante :

### Core & Framework
*   **Next.js 14+ (App Router)** : Choisi pour son routing robuste, ses capacités Server-Side (si besoin pour cacher des secrets ou gérer des proxies) et son optimisation native des images (Album Arts).
*   **TypeScript** : Indispensable pour la robustesse et le typage strict des réponses API Spotify complexes.

### Styling & UI
*   **Tailwind CSS** : Pour la rapidité de développement et la gestion facile du Dark Mode.
*   **Framer Motion** : Pour les animations complexes (list reordering, transitions de pages fluides) essentielles à l'effet "Glassmorphism" et "App-like".
*   **Lucide React** : Pour une iconographie cohérente et moderne.

### State Management
*   **TanStack Query (React Query)** : **Critique** pour la gestion de l'état serveur (Playlists, User Profile, Recent Tracks). Gère le caching, le revalidation et les états de chargement nativement.
*   **Zustand** : Pour l'état global client (ex: sélections temporaires, états de l'UI, modales). Plus léger et performant que Context API pour éviter les re-renders inutiles.

### Authentification
*   **NextAuth.js (v5)** : Solution standard robuste. Gère l'OAuth 2.0 avec Spotify, le stockage sécurisé des tokens (HTTPOnly Cookies), et surtout la **rotation des Refresh Tokens** (point critique pour une UX sans coupure).

---

## 2. Stratégie d'Authentification
L'authentification est le point névralgique.
1.  **Provider** : Spotify (`next-auth/providers/spotify`).
2.  **Flow** : Authorization Code Flow.
3.  **Token Rotation** : Spotify Access Tokens expirent après 1h. Nous implémenterons un callback `jwt` dans NextAuth pour vérifier l'expiration et utiliser le `refresh_token` automatiquement via l'API Spotify pour en obtenir un nouveau sans déconnecter l'utilisateur.
4.  **Scopes** :
    *   `user-read-private` `user-read-email` (Auth)
    *   `playlist-read-private` `playlist-modify-public` `playlist-modify-private` (Gestion Playlists)


---

## 3. Arborescence du Projet (Folder Structure)

```
/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes (NextAuth, proxies)
│   │   └── auth/[...nextauth]/ # Configuration NextAuth
│   ├── (auth)/                 # Route Group pour Login (Page publique)
│   │   └── login/
│   ├── (dashboard)/            # Route Group protégé (Layout principal avec Nav)
│   │   ├── page.tsx            # Home (Dashboard)
│   │   ├── library/            # Sélection de playlist pour Shuffle

│   ├── layout.tsx              # Root Layout (Providers: Auth, Query)
│   └── globals.css             # Tailwind imports & Custom Variables
├── components/
│   ├── ui/                     # Composants atomiques (Buttons, Cards - Shadcn-like)
│   ├── layout/                 # Navbar, Sidebar, MobileMenu
│   ├── spotify/                # Composants métier (PlaylistCard, TrackRow)
│   └── animations/             # Wrappers Framer Motion
├── hooks/
│   ├── useSpotify.ts           # Helper pour utiliser l'instance spotify-web-api-node
│   └── useStore.ts             # Store Zustand
├── lib/
│   ├── spotify.ts              # Configuration SDK et Helpers API
│   ├── utils.ts                # Fonctions utilitaires (cn, formatTime)
│   └── algorithms/             # Logique pure
│       └── fisher-yates.ts     # Algorithme de mélange
├── types/                      # Définitions TypeScript (ou extensions du SDK)
└── public/                     # Assets statiques
```

---

## 4. Dépendances Clés

### Production
```json
{
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "next-auth": "beta",         // v5
  "spotify-web-api-node": "^5.0.0", // Wrapper pratique pour le serveur/API routes
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.0.0",
  "framer-motion": "^11.0.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",   // Pour fusionner les classes Tailwind proprement
  "lucide-react": "latest"
}
```

### Development
```json
{
  "typescript": "latest",
  "tailwindcss": "latest",
  "postcss": "latest",
  "autoprefixer": "latest",
  "@types/spotify-web-api-node": "*"
}
```
