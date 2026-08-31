#!/usr/bin/env python3
"""
Correcteur de données pour The Sprawl [FR] — Manœuvres de Livret.

Corrections :
1. Fix Agitateur rollType → 'style'
2. Ajoute explications retenues dans les descriptions
3. Reconstruit les sources JSON et LevelDB

Usage:
    python3 scripts/fix_livrets.py
"""

import json
import os
import sys
import subprocess
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
MODULE_DIR = SCRIPT_DIR.parent
DATA_MOVES = MODULE_DIR / "data" / "moves.json"

# ============================================================
# DESCRIPTIONS AVEC EXPLICATIONS DE RETENUES
# ============================================================
# Ces descriptions remplacent les descriptions existantes dans data/moves.json
# pour ajouter les explications de dépense des retenues.

DESCRIPTION_UPDATES = {
    "Cowboy informatique": (
        "<p>Quand tu te connectes à un système sécurisé, lance 2d6+Esprit.</p>"
        "<p><strong>Dépense de retenues</strong> (tant que tu restes dans le système) :</p>"
        "<ul>"
        "<li>Empêcher une construction virtuelle d'activer une alarme</li>"
        "<li>Empêcher une Glace d'exécuter une routine contre toi</li>"
        "<li>Retenir 1 supplémentaire sur une sécurité compromise ou un système manipulé</li>"
        "</ul>"
    ),
    "Entrée subreptice": (
        "<p>Quand tu t'infiltres seul dans une zone sécurisée, lance 2d6+Cran.</p>"
        "<p><strong>Dépense de retenues</strong> (une par une, pendant la description du MC) :</p>"
        "<ul>"
        "<li>Esquiver un système de sécurité ou un garde</li>"
        "<li>Désactiver un système de sécurité que tu as esquivé</li>"
        "<li>Neutraliser un garde</li>"
        "<li>Éviter d'être repéré</li>"
        "</ul>"
    ),
    "Mais c'est bien sûr !": (
        "<p>Au début d'une Mission, lance 2d6+Pro.</p>"
        "<p><strong>Dépense de retenues</strong> : dépense une retenue à n'importe quel moment pour poser une question de la liste d'<em>effectuer une recherche</em>.</p>"
    ),
    "Déterminé": (
        "<p>Au début d'une Mission qui promeut ta vision, lance 2d6+Pro.</p>"
        "<p><strong>Dépense de retenues</strong> : dépense une retenue avant de lancer n'importe quelle autre Manœuvre pour gagner <strong>+1</strong> sur ton jet ou <strong>-2</strong> sur le jet d'un adversaire.</p>"
    ),
    "Du flair pour les nouvelles": (
        "<p>Au début d'une Mission, lance 2d6+Pro.</p>"
        "<p><strong>Dépense de retenues</strong> (une par une, pendant la Mission) :</p>"
        "<ul>"
        "<li>Poser une question de la liste d'<em>effectuer une recherche</em></li>"
        "<li>Prendre <strong>+1</strong> sur ton prochain jet de <em>pitbull</em></li>"
        "<li>Trouver une preuve reliant la Mission à une histoire en cours</li>"
        "</ul>"
    ),
    "J'adore quand un plan se déroule sans accroc": (
        "<p>Au début d'une Mission, lance 2d6+Pro.</p>"
        "<p><strong>Dépense de retenues</strong> (une par une) :</p>"
        "<ul>"
        "<li>Tu as le matériel dont tu as besoin, maintenant</li>"
        "<li>Tu apparais dans une scène où on a besoin de toi, maintenant</li>"
        "</ul>"
        "<p><em>Note : sur un 6-, tu gagnes tout de même 1 retenue, mais tes adversaires ont prévu tes mouvements.</em></p>"
    ),
    "Un putain d'as du volant": (
        "<p>Conduis un véhicule câblé sous haute tension, lance 2d6+Pro.</p>"
        "<p><strong>Dépense de retenues</strong> (une par une) :</p>"
        "<ul>"
        "<li>Éviter un danger externe (missile, tir en rafale, collision)</li>"
        "<li>Échapper à un poursuivant</li>"
        "<li>Maintenir le contrôle de ton véhicule</li>"
        "<li>Impressionner, démoraliser ou effrayer quelqu'un</li>"
        "</ul>"
    ),
    "Visionnaire": (
        "<p>Crée une connexion émotionnelle et prône ta vision, lance 2d6+Style.</p>"
        "<p><strong>Dépense de retenues (sur un PNJ)</strong> :</p>"
        "<ul>"
        "<li>Il te donne quelque chose que tu veux</li>"
        "<li>Il fait quelque chose que tu demandes</li>"
        "<li>Il combat pour te protéger, toi ou ta cause</li>"
        "<li>Il désobéit à un ordre d'une autorité</li>"
        "</ul>"
        "<p><strong>Dépense de retenues (sur un PJ)</strong> : dépense 1 retenue pour aider (<strong>+1</strong>) ou interférer (<strong>-2</strong>) comme sur un 10+.</p>"
    ),
    "Regard de dur": (
        "<p>Situation tendue, lance 2d6+Style.</p>"
        "<p><strong>Dépense de retenues</strong> : dépense une retenue pour fixer un PNJ — il se fige ou hésite et ne peut agir tant que tu maintiens le contact visuel.</p>"
    ),
    "Repérage": (
        "<p>Étudie un lieu pour trouver des failles, lance 2d6+Pro.</p>"
        "<p>Tu gagnes des [infos] que tu peux dépenser comme d'habitude, ou en dépenser une pour poser une question de la liste d'<em>évaluer</em> ou d'<em>effectuer une recherche</em>.</p>"
    ),
    "Agitateur": (
        "<p>Tu peux utiliser <em>visionnaire</em> pour influencer une foule potentiellement favorable. Lance 2d6+Style.</p>"
    ),
}

# ============================================================
# ROLLTYPE FIXES
# ============================================================
ROLLTYPE_FIXES = {
    "Agitateur": "style",
}

# ============================================================
# FIX LOOP
# ============================================================
def fix_moves():
    print(f"{'=' * 60}")
    print(f"  CORRECTION DES MANŒUVRES DE LIVRET")
    print(f"{'=' * 60}")
    
    with open(DATA_MOVES, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes = 0
    
    for i, move in enumerate(data['moves']):
        name = move['name']
        sys_data = move['system']
        modified = False
        
        # 1. Fix rollType
        if name in ROLLTYPE_FIXES:
            expected = ROLLTYPE_FIXES[name]
            if sys_data.get('rollType') != expected:
                print(f"  ✅ ROLL: «{name}» → '{expected}' (était '{sys_data.get('rollType')}')")
                sys_data['rollType'] = expected
                modified = True
        
        # 2. Fix description with retenue explanations
        if name in DESCRIPTION_UPDATES:
            new_desc = DESCRIPTION_UPDATES[name]
            if sys_data.get('description') != new_desc:
                print(f"  ✅ DESC: «{name}» — description mise à jour avec explications de retenues")
                sys_data['description'] = new_desc
                modified = True
        
        if modified:
            changes += 1
    
    # Save
    with open(DATA_MOVES, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n  {changes} manœuvres modifiées dans {DATA_MOVES}")
    return changes

# ============================================================
# BUILD
# ============================================================
def build():
    print(f"\n{'=' * 60}")
    print(f"  RECONSTRUCTION DES SOURCES JSON ET LEVELDB")
    print(f"{'=' * 60}")
    
    # Check if @foundryvtt/foundryvtt-cli is available
    result = subprocess.run(
        ["node", "-e", "require('@foundryvtt/foundryvtt-cli'); console.log('OK');"],
        capture_output=True, text=True, timeout=10,
        cwd=str(MODULE_DIR)
    )
    
    if result.returncode != 0:
        print("  ⚠️ @foundryvtt/foundryvtt-cli non trouvé, installation...")
        install = subprocess.run(
            ["npm", "install", "@foundryvtt/foundryvtt-cli"],
            capture_output=True, text=True, timeout=30,
            cwd=str(MODULE_DIR)
        )
        if install.returncode != 0:
            print(f"  ❌ Échec d'installation: {install.stderr[:200]}")
            return False
        print("  ✅ Installation réussie")
    
    # Run build
    print("  Lancement du build...")
    build_result = subprocess.run(
        ["node", "scripts/build-ldb.mjs"],
        capture_output=True, text=True, timeout=60,
        cwd=str(MODULE_DIR)
    )
    
    print(build_result.stdout)
    if build_result.stderr:
        print(f"  STDERR: {build_result.stderr[:500]}")
    
    if build_result.returncode == 0:
        print("  ✅ Build réussi")
        return True
    else:
        print(f"  ❌ Build échoué (code {build_result.returncode})")
        return False

# ============================================================
# MAIN
# ============================================================
if __name__ == '__main__':
    fix_moves()
    build()
    print(f"\n✅ Terminé !")