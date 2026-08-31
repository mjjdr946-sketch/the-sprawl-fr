#!/usr/bin/env python3
"""
Validation des Manœuvres de Base et de Matrice pour The Sprawl [FR].
Compare les fichiers de référence Markdown avec le module (data/moves.json).

Usage:
    python3 scripts/validate_basic_matrix.py            # Affichage normal
    python3 scripts/validate_basic_matrix.py --json     # Sortie JSON (CI)
"""

import re
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
MODULE_DIR = SCRIPT_DIR.parent
DATA_MOVES = MODULE_DIR / "data" / "moves.json"
REF_BASIC = Path("/opt/data/profiles/forge-dev/cache/documents/doc_4e5ddb7a258c_the_sprawl_basic_moves.md")
REF_MATRIX = Path("/opt/data/profiles/forge-dev/cache/documents/doc_0957e2b8d7b6_the_sprawl_matrix_moves.md")

# ============================================================
# ROLL TYPE MAP (stat reference → pbta rollType)
# ============================================================
STAT_MAP = {
    'Chair': 'meat',
    'Cran': 'cool',
    'Esprit': 'mind',
    'Pro': 'edge',
    'Style': 'style',
    'Synth': 'synth',
    'Liens': 'formula',       # special: rolls with Liens or custom formula
    'Dégâts subis': 'formula',
    'Cred dépensés': 'formula',
    'Segments': 'formula',
}

# ============================================================
# EXPECTED MOVES FROM REFERENCE (name → expected rollType stat)
# ============================================================
BASIC_MOVES_EXPECTED = {
    "Acquérir une concession funéraire": "Chair",
    "Administrer les premiers soins": "Cran",
    "Agir sous pression": "Cran",
    "Aider ou Interférer": "Liens",
    "Baratiner": "Style",
    "Battre le pavé": "Style",
    "Blessure": "Dégâts subis",
    "Déclarer un Contact": None,          # no roll
    "Effectuer une recherche": "Esprit",
    "Employer la manière forte": "Chair",
    "Évaluer": "Pro",
    "Montrer les dents": "Pro",
    "Obtenir le taf": "Pro",
    "Passer sur le billard": "Cred dépensés",
    "Produire du matériel": None,          # no roll
    "Révéler une info": None,              # no roll
    "Se faire payer": None,                # formula segments
}

MATRIX_MOVES_EXPECTED = {
    "S'authentifier": "Synth",
    "Compromettre la sécurité": "Esprit",
    "Manipuler un système": "Synth",
    "Briser la Glace": "Pro",
    "Se débrancher": "Cran",
}

# Expected result tiers for each move (which result keys should exist)
BASIC_RESULT_TIERS = {
    "Acquérir une concession funéraire": ["success", "partial", "failure"],
    "Administrer les premiers soins": ["success", "partial", "failure"],
    "Agir sous pression": ["success", "partial", "failure"],
    "Aider ou Interférer": ["success", "partial", "failure"],
    "Baratiner": ["success", "partial", "failure"],
    "Battre le pavé": ["success", "partial", "failure"],
    "Blessure": ["success", "partial", "failure"],
    "Déclarer un Contact": [],
    "Effectuer une recherche": ["success", "partial", "failure"],
    "Employer la manière forte": ["success", "partial", "failure"],
    "Évaluer": ["success", "partial", "failure"],
    "Montrer les dents": ["success", "partial", "failure"],
    "Obtenir le taf": ["success", "partial", "failure"],
    "Passer sur le billard": ["success", "partial", "failure"],
    "Produire du matériel": [],
    "Révéler une info": [],
    "Se faire payer": ["success", "partial", "failure"],
}

MATRIX_RESULT_TIERS = {
    "S'authentifier": ["success", "partial", "failure"],
    "Compromettre la sécurité": ["success", "partial", "failure"],
    "Manipuler un système": ["success", "partial", "failure"],
    "Briser la Glace": ["success", "partial", "failure"],
    "Se débrancher": ["success", "partial", "failure"],
}

# ============================================================
# RETENUE / HOLD EXPLANATIONS — moves that MUST mention how to
# spend holds or choose options in their description
# ============================================================
RETENUE_REQUIRED = {
    "Évaluer": ["Dépense", "retenue", "question"],   # description must explain spending holds
    "Battre le pavé": ["option", "choisis"],          # 7-9 options
    "Compromettre la sécurité": ["Dépense", "retenue"],
    "Manipuler un système": ["Dépense", "retenue"],
    "Effectuer une recherche": ["question"],
    "Briser la Glace": ["routine", "Glace"],
    "Obtenir le taf": ["option"],
    "Se faire payer": ["option"],
    "Employer la manière forte": ["complication"],
    "Aider ou Interférer": ["+1", "-2"],
    "Baratiner": ["PNJ", "PJ"],
    "Montrer les dents": ["PNJ", "PJ"],
    "Blessure": ["hors-de-combat", "choisi"],
    "Administrer les premiers soins": ["segment"],
    "Passer sur le billard": ["étiquette", "choisis"],
}

# ============================================================
# HELPERS
# ============================================================
def norm(s):
    return re.sub(r'\s+', ' ', s).strip().lower()

def text_contains_all(text, keywords):
    t = norm(text)
    return all(norm(k) in t for k in keywords)

def text_lower(text):
    return norm(text)

# ============================================================
# MAIN
# ============================================================
def validate():
    missing_files = [p for p in [REF_BASIC, REF_MATRIX] if not p.exists()]
    if missing_files:
        print(f"ERROR: Missing reference files: {missing_files}")
        sys.exit(1)

    print(f"{'=' * 70}")
    print(f"  VALIDATION MANŒUVRES DE BASE + MATRICE — The Sprawl [FR]")
    print(f"{'=' * 70}")
    print(f"  Réf. base   : {REF_BASIC.name}")
    print(f"  Réf. matrice: {REF_MATRIX.name}")
    print(f"  Module      : {DATA_MOVES.name}")
    print()

    with open(DATA_MOVES, 'r', encoding='utf-8') as f:
        data = json.load(f)

    moves_by_name = {m['name']: m for m in data['moves']}

    total_errors = 0
    total_warnings = 0
    all_issues = []

    # ============================================================
    # 1. BASIC MOVES
    # ============================================================
    print(f"  ┌─ MANŒUVRES DE BASE ({len(BASIC_MOVES_EXPECTED)})")
    for name, expected_stat in BASIC_MOVES_EXPECTED.items():
        if name not in moves_by_name:
            print(f"  │  ❌ MANQUANTE: {name}")
            all_issues.append(('missing', 'Basique', name, ''))
            total_errors += 1
            continue

        move = moves_by_name[name]
        sysd = move['system']

        # rollType check
        if expected_stat:
            exp_rt = STAT_MAP.get(expected_stat, expected_stat.lower())
            actual_rt = sysd.get('rollType', '')
            if actual_rt != exp_rt:
                # Se faire payer uses formula with segments
                if name == "Se faire payer" and actual_rt == 'formula':
                    pass
                elif actual_rt != exp_rt:
                    print(f"  │  ⚠️ ROLL: «{name}» → rollType='{actual_rt}', attendu='{exp_rt}' ({expected_stat})")
                    all_issues.append(('rolltype', 'Basique', name, f"module={actual_rt}, expected={exp_rt}"))
                    total_warnings += 1

        # Result tiers check
        expected_tiers = BASIC_RESULT_TIERS.get(name, [])
        actual_tiers = list(sysd.get('moveResults', {}).keys())
        for tier in expected_tiers:
            if tier not in actual_tiers:
                print(f"  │  ⚠️ RÉSULTAT MANQUANT «{name}»: palier '{tier}'")
                all_issues.append(('missing_tier', 'Basique', name, f"missing: {tier}"))
                total_warnings += 1

        # Retenue / explanation check
        if name in RETENUE_REQUIRED:
            desc = sysd.get('description', '') + ' ' + ' '.join(
                v.get('value', '') for v in sysd.get('moveResults', {}).values())
            keywords = RETENUE_REQUIRED[name]
            if not text_contains_all(desc, keywords):
                print(f"  │  ⚠️ RETENUES: «{name}» — explication manquante (keywords: {keywords})")
                all_issues.append(('retenues', 'Basique', name, f"missing explanation: {keywords}"))
                total_warnings += 1

    print(f"  └──")
    print()

    # ============================================================
    # 2. MATRIX MOVES
    # ============================================================
    print(f"  ┌─ MANŒUVRES DE MATRICE ({len(MATRIX_MOVES_EXPECTED)})")
    for name, expected_stat in MATRIX_MOVES_EXPECTED.items():
        if name not in moves_by_name:
            print(f"  │  ❌ MANQUANTE: {name}")
            all_issues.append(('missing', 'Matrice', name, ''))
            total_errors += 1
            continue

        move = moves_by_name[name]
        sysd = move['system']

        # rollType check
        if expected_stat:
            exp_rt = STAT_MAP.get(expected_stat, expected_stat.lower())
            actual_rt = sysd.get('rollType', '')
            if actual_rt != exp_rt:
                print(f"  │  ⚠️ ROLL: «{name}» → rollType='{actual_rt}', attendu='{exp_rt}' ({expected_stat})")
                all_issues.append(('rolltype', 'Matrice', name, f"module={actual_rt}, expected={exp_rt}"))
                total_warnings += 1

        # Result tiers — matrix uses 10+/7-9/6- keys, should be success/partial/failure
        expected_tiers = MATRIX_RESULT_TIERS.get(name, [])
        actual_tiers = list(sysd.get('moveResults', {}).keys())
        for tier in expected_tiers:
            if tier not in actual_tiers:
                # Check for legacy matrix keys (10+, 7-9, 6-)
                legacy_map = {'success': '10+', 'partial': '7-9', 'failure': '6-'}
                legacy_key = legacy_map.get(tier)
                if legacy_key and legacy_key in actual_tiers:
                    print(f"  │  ⚠️ CLÉ «{name}»: palier '{tier}' présent comme '{legacy_key}' — à normaliser en success/partial/failure")
                    all_issues.append(('key_format', 'Matrice', name, f"{legacy_key} → {tier}"))
                    total_warnings += 1
                elif tier == 'failure' and legacy_key and '7+' in actual_tiers:
                    # Briser la Glace special case: has 7+ and 7-9 only
                    print(f"  │  ⚠️ CLÉ «{name}»: palier '6-' manquant (a 7+ au lieu de 10+) — à corriger")
                    all_issues.append(('key_format', 'Matrice', name, "7+ → 10+, ajouter 6-"))
                    total_warnings += 1
                else:
                    print(f"  │  ⚠️ RÉSULTAT MANQUANT «{name}»: palier '{tier}'")
                    all_issues.append(('missing_tier', 'Matrice', name, f"missing: {tier}"))
                    total_warnings += 1

        # Retenue / explanation check
        if name in RETENUE_REQUIRED:
            desc = sysd.get('description', '') + ' ' + ' '.join(
                v.get('value', '') for v in sysd.get('moveResults', {}).values())
            keywords = RETENUE_REQUIRED[name]
            if not text_contains_all(desc, keywords):
                print(f"  │  ⚠️ RETENUES: «{name}» — explication manquante (keywords: {keywords})")
                all_issues.append(('retenues', 'Matrice', name, f"missing explanation: {keywords}"))
                total_warnings += 1

    print(f"  └──")
    print()

    # ============================================================
    # 3. Extra moves (shouldn't exist in basic/matrix beyond expected)
    # ============================================================
    expected_names = set(BASIC_MOVES_EXPECTED) | set(MATRIX_MOVES_EXPECTED)
    found_basic = {m['name'] for m in data['moves'] if m['system']['moveType'] == 'basic'}
    found_matrix = {m['name'] for m in data['moves'] if m['system']['moveType'] == 'matrix'}
    extra = (found_basic | found_matrix) - expected_names
    if extra:
        print(f"  ┌─ MANŒUVRES SUPPLÉMENTAIRES")
        for e in sorted(extra):
            print(f"  │  ❓ EXTRA: {e}")
            all_issues.append(('extra', 'Base/Matrice', e, 'not in reference'))
            total_warnings += 1
        print(f"  └──")
        print()

    # ============================================================
    # SUMMARY
    # ============================================================
    print(f"{'=' * 70}")
    print(f"  RÉSULTATS")
    print(f"{'=' * 70}")
    print(f"  Erreurs   : {total_errors}")
    print(f"  Avertissements : {total_warnings}")
    print()

    if total_errors == 0 and total_warnings == 0:
        print(f"  ✅ TOUT VA BIEN — Aucun problème détecté")
    else:
        print(f"  Détails :")
        for issue in all_issues:
            kind, cat, name, detail = issue
            if kind == 'missing':
                print(f"    ❌ [{cat}] MANQUANT: {name}")
            elif kind == 'rolltype':
                print(f"    ⚠️ [{cat}] ROLL: {name} — {detail}")
            elif kind == 'missing_tier':
                print(f"    ⚠️ [{cat}] RÉSULTAT: {name} — {detail}")
            elif kind == 'retenues':
                print(f"    ⚠️ [{cat}] RETENUES: {name} — {detail}")
            elif kind == 'key_format':
                print(f"    ⚠️ [{cat}] CLÉ RÉSULTAT: {name} — {detail}")
            elif kind == 'extra':
                print(f"    ❓ [{cat}] EXTRA: {name}")
        print()

    if '--json' in sys.argv:
        result = {
            'status': 'pass' if total_errors == 0 else 'fail',
            'errors': total_errors,
            'warnings': total_warnings,
            'issues': [
                {'type': kind, 'category': cat, 'move': name, 'detail': detail}
                for kind, cat, name, detail in all_issues
            ]
        }
        print(json.dumps(result, indent=2, ensure_ascii=False))

    return total_errors

if __name__ == '__main__':
    exit(validate())