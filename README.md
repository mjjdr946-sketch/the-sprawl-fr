# The Sprawl [FR] — Module Foundry VTT

Configuration complète pour **The Sprawl** (PbtA cyberpunk) sur Foundry VTT v14+.

## Dépendance

- **Système requis :** [Powered by the Apocalypse (pbta)](https://github.com/asacolips-projects/pbta) v1.2.0+

## Installation

1. Copie l'URL du manifest :
   ```
   https://raw.githubusercontent.com/mjjdr946-sketch/the-sprawl-fr/v14-port/module.json
   ```
2. Dans Foundry VTT, va dans *Modules → Installer un module*
3. Colle l'URL et installe

## Contenu

- Configuration automatique des statistiques, attributs, manoeuvres et équipements pour The Sprawl
- Thème cyberpunk (gris anthracite, vert néon, orange/cyan/jaune pour les jauges)
- Traduction française complète
- Compatible PNJ et PJ

## Développement

### Branches

- `main` — version stable (dernière release)
- `v14-port` — portage en cours vers Foundry v14

### Fichiers

| Fichier | Rôle |
|---|---|
| `module.json` | Manifeste du module |
| `scripts/main.mjs` | Injection automatique de la configuration pbta |
| `scripts/populate-moves.mjs` | Script de peuplement du compendium des manœuvres (134 manœuvres : 17 basiques + 112 livrets + 5 matrice) |
| `scripts/populate-playbooks.mjs` | Script de peuplement du compendium des livrets (après les manœuvres) |
| `scripts/populate-equipment.mjs` | Script de peuplement du compendium d'équipement (84 items : 23 armes, 5 armures, 24 matériels, 25 cyberwares, 7 véhicules/consoles) |
| `styles/sprawl.css` | Thème visuel cyberpunk |
| `sprawl.toml` | Configuration TOML de référence pour The Sprawl |
| `data/moves.json` | Données de référence des manœuvres (format lisible) |
| `data/playbooks.json` | Données de référence des livrets (format lisible) |
| `data/equipment.json` | Données de référence de l'équipement (format lisible) |
| `packs/playbooks.db/` | Livrets (playbooks) |
| `packs/moves.db/` | Manœuvres (moves) |
| `packs/equipment.db/` | Équipement (armes, protection, cyberware, programmes, etc.) |

## Peuplement des compendiums

Les compendiums sont initialement vides (`.gitkeep`). Pour les remplir :

### Ordre d'exécution

1. **Équipement** : exécute `scripts/populate-equipment.mjs` pour importer les **84 items** (23 armes, 5 armures, 24 matériels, 25 cyberwares, 7 véhicules/consoles)
2. **Manœuvres** : exécute `scripts/populate-moves.mjs` pour importer les **134 manœuvres** (17 basiques + 112 livrets + 5 matrice)
3. **Livrets** : exécute `scripts/populate-playbooks.mjs` pour importer les **10 livrets** avec leurs manœuvres et équipement de départ liés automatiquement

### Procédure

1. Active le module **The Sprawl [FR]** dans un monde Foundry VTT
2. Ouvre la console développeur (F12)
3. Copie-colle le contenu de `scripts/populate-moves.mjs` et exécute
4. Copie-colle le contenu de `scripts/populate-playbooks.mjs` et exécute
5. Les fichiers LevelDB générés (`packs/*.db/*.ldb`) sont à commiter dans le repo

> **Alternative :** Tu peux aussi créer les manœuvres et livrets manuellement dans Foundry VTT.