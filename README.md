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
| `scripts/rebuild-leveldb.cjs` | (dev) Régénération des LevelDB si nécessaire |
| `styles/sprawl.css` | Thème visuel cyberpunk |
| `sprawl.toml` | Configuration TOML de référence pour The Sprawl |
| `data/moves.json` | Données de référence des manœuvres (format lisible) |
| `data/playbooks.json` | Données de référence des livrets (format lisible) |
| `data/equipment.json` | Données de référence de l'équipement (format lisible) |
| `packs/playbooks.db/` | Livrets (playbooks) |
| `packs/moves.db/` | Manœuvres (moves) |
| `packs/equipment.db/` | Équipement (armes, protection, cyberware, programmes, etc.) |

## Contenu pré-rempli

Les 3 compendiums sont inclus directement dans le module (fichiers LevelDB) :

| Compendium | Contenu |
|------------|---------|
| **Équipement (The Sprawl)** | 84 items : 23 armes, 5 armures, 24 matériels, 25 cyberwares, 7 véhicules/consoles |
| **Manœuvres (The Sprawl)** | 134 manœuvres : 17 basiques + 112 livrets + 5 matricielles |
| **Livrets (The Sprawl)** | 10 playbooks avec liens UUID vers leurs manœuvres et équipement |

Aucune manipulation supplémentaire n'est nécessaire — les compendiums sont prêts à l'emploi dès l'activation du module.