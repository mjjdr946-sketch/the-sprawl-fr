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
| `styles/sprawl.css` | Thème visuel cyberpunk |
| `sprawl.toml` | Configuration TOML de référence pour The Sprawl |
| `packs/playbooks.db/` | Livrets (playbooks) |
| `packs/moves.db/` | Manœuvres (moves) |
| `packs/equipment.db/` | Équipement (armes, protection, cyberware, programmes, etc.) |