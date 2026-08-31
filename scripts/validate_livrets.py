#!/usr/bin/env python3
"""
Validation des Manœuvres de Livret (playbook moves) pour The Sprawl [FR].
Compare le fichier de référence Markdown avec les données du module (data/moves.json).

Usage:
    python3 scripts/validate_livrets.py            # Affichage normal
    python3 scripts/validate_livrets.py --json     # Sortie JSON (CI)
"""

import re
import json
import sys
from html.parser import HTMLParser
from pathlib import Path

# ============================================================
# 1. CHEMIN DES FICHIERS
# ============================================================
SCRIPT_DIR = Path(__file__).resolve().parent
MODULE_DIR = SCRIPT_DIR.parent
DATA_MOVES = MODULE_DIR / "data" / "moves.json"
USER_REF_FILE = Path("/opt/data/profiles/forge-dev/cache/documents/doc_f23e2ee773a0_The_Sprawl_-_Livrets.md")

# ============================================================
# 2. HTML STRIPPER
# ============================================================
class HTMLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs = True
        self.text = []
    def handle_data(self, data):
        self.text.append(data)
    def get_text(self):
        return ''.join(self.text).strip()

def strip_html(html):
    s = HTMLStripper()
    s.feed(html)
    return s.get_text()

# ============================================================
# 3. REFERENCE PARSER
# ============================================================
def parse_reference(filepath):
    """Parse reference Markdown to extract expected moves per playbook."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    playbooks = {}
    current_pb = None
    current_move = None
    moves_list = []

    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Playbook section: ## 1. Le Fixeur
        pb_match = re.match(r'^##\s+\d+\.\s+(.+)$', line)
        if pb_match:
            if current_pb and moves_list:
                if current_move:
                    moves_list.append(current_move)
                playbooks[current_pb] = moves_list
            current_pb = pb_match.group(1).strip()
            moves_list = []
            current_move = None
            i += 1
            continue

        # Move name: ### Je connais du monde
        move_match = re.match(r'^###\s+(.+)$', line)
        if move_match and current_pb:
            if current_move:
                moves_list.append(current_move)
            name = move_match.group(1).strip()
            name = re.sub(r'\s*\*?\[cite_start\][^\[]*', '', name).strip()
            current_move = {
                'name': name,
                'roll_type': '',
                'roll_stat': '',
                'has_results': False,
                'results': {}
            }
            i += 1
            continue

        if current_move:
            # Jet line
            jet_match = re.match(r'\*?\s*\[\w+\]\s*\*{0,2}Jet\*{0,2}\s*:\s*(.+)', line, re.IGNORECASE)
            if jet_match:
                jet_text = jet_match.group(1).strip()
                roll_m = re.search(r'2d6\s*\+\s*(\w+)', jet_text)
                if roll_m:
                    current_move['roll_type'] = 'stat'
                    current_move['roll_stat'] = roll_m.group(1).strip()
                else:
                    current_move['roll_type'] = 'none'
                i += 1
                continue

            # Results block
            if '**Résultats**' in line or '*Résultats*' in line:
                current_move['has_results'] = True
                i += 1
                while i < len(lines):
                    rl = lines[i].strip()
                    r10 = re.match(r'\*\*\s*(\d+[\-–]\d*\+?)\s*\*{0,2}\s*:\s*(.*)', rl)
                    if r10:
                        key = r10.group(1).replace('–', '-').strip()
                        value = r10.group(2).strip()
                        value = re.sub(r'\s*\[cite_start\][^\]]*', '', value).strip()
                        current_move['results'][key] = value
                        i += 1
                        continue
                    if rl.startswith('###') or rl.startswith('##') or rl.startswith('---'):
                        break
                    i += 1
                continue

        i += 1

    if current_pb and moves_list:
        if current_move:
            moves_list.append(current_move)
        playbooks[current_pb] = moves_list

    return playbooks


# ============================================================
# 4. MODULE PARSER
# ============================================================
def parse_module(filepath):
    """Parse data/moves.json to extract all playbook moves."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    moves = {}
    for move in data.get('moves', []):
        if move.get('system', {}).get('moveType') == 'playbook':
            name = move['name']
            sys_data = move['system']
            desc = strip_html(sys_data.get('description', ''))
            roll_type = sys_data.get('rollType', '')

            results = {}
            mr = sys_data.get('moveResults', {})
            for key in mr:
                label = mr[key].get('label', '')
                value = strip_html(mr[key].get('value', ''))
                results[label] = value

            moves[name] = {
                'description': desc,
                'rollType': roll_type,
                'results': results
            }
    return moves

# ============================================================
# 5. HELPERS
# ============================================================
PLAYBOOK_ORDER = [
    'Le Fixeur', 'Le Hacker', "L'Infiltré", 'Le Limier', 'Le Pilote',
    'Le Provocateur', 'Le Reporter', 'Le Soldat', 'Le Tech', 'Le Tueur'
]

PLAYBOOK_SLUGS = {
    'Le Fixeur': 'Fixeur',
    'Le Hacker': 'Hacker',
    "L'Infiltré": 'Infiltré',
    'Le Limier': 'Limier',
    'Le Pilote': 'Pilote',
    'Le Provocateur': 'Provocateur',
    'Le Reporter': 'Reporter',
    'Le Soldat': 'Soldat',
    'Le Tech': 'Tech',
    'Le Tueur': 'Tueur',
}

STAT_MAP = {
    'Style': 'style',
    'Pro': 'edge',
    'Esprit': 'mind',
    'Cran': 'cool',
    'Chair': 'meat',
    'Synth': 'synth',
}

def normalize_module_name(name):
    """Remove playbook suffix from module move names."""
    return re.sub(r'\s+\((?:Fixeur|Hacker|Infiltré|Limier|Pilote|Provocateur|Reporter|Soldat|Tech|Tueur)\)', '', name).strip()

def get_module_suffix(name):
    """Extract playbook suffix from module name, if any."""
    m = re.search(r'\((Fixeur|Hacker|Infiltré|Limier|Pilote|Provocateur|Reporter|Soldat|Tech|Tueur)\)', name)
    return m.group(1) if m else None

def expand_combined_name(name):
    """Split combined reference entries like 'A / B / C' into individual names."""
    parts = [p.strip() for p in name.split('/')]
    if len(parts) >= 3:
        return parts
    return [name]

# ============================================================
# 6. MAIN VALIDATION
# ============================================================
def validate():
    if not USER_REF_FILE.exists():
        print(f"ERROR: Reference file not found: {USER_REF_FILE}")
        sys.exit(1)

    print(f"{'=' * 70}")
    print(f"  VALIDATION DES MANŒUVRES DE LIVRET — The Sprawl [FR]")
    print(f"{'=' * 70}")
    print(f"  Référence : {USER_REF_FILE}")
    print(f"  Module     : {DATA_MOVES}")
    print()

    expected = parse_reference(USER_REF_FILE)
    actual = parse_module(DATA_MOVES)

    # Build flat expected list: (playbook, move_name) for each expected move
    # Expand combined entries
    flat_expected = {}  # normalized_name -> list of (playbook, ref_data)
    for pb, moves_list in expected.items():
        for m in moves_list:
            names = expand_combined_name(m['name'])
            for n in names:
                if n not in flat_expected:
                    flat_expected[n] = []
                flat_expected[n].append((pb, m))

    # Build flat module list: normalized_name -> list of (original_name, data)
    flat_module = {}  # normalized_name -> list of (original_name, data)
    for orig_name, data in actual.items():
        norm = normalize_module_name(orig_name)
        if norm not in flat_module:
            flat_module[norm] = []
        flat_module[norm].append((orig_name, data))

    total_errors = 0
    total_warnings = 0
    all_issues = []

    # ============================================================
    # Check 1: All expected moves exist in module
    # ============================================================
    print(f"  VÉRIFICATION 1: Manœuvres attendues présentes dans le module")
    print(f"{'─' * 70}")

    for ref_name in sorted(flat_expected.keys()):
        pbs = flat_expected[ref_name]
        pb_names = [p[0] for p in pbs]
        pb_str = ', '.join(pb_names)

        if ref_name in flat_module:
            # Found in module!
            mod_entries = flat_module[ref_name]
            # Check if the module has enough entries for shared moves
            # Shared moves like Chromé should have one per playbook
            # Get the suffixes to determine which playbooks have it
            mod_suffixes = [get_module_suffix(e[0]) for e in mod_entries]
            mod_suffixes = [s for s in mod_suffixes if s]  # Remove None

            # For Chromé: reference says it's available for all playbooks
            # Check that module has it for all expected playbooks
            if ref_name == 'Chromé':
                # Reference only lists Chromé once under Fixeur (with note: available for all)
                # Module should have it for all 10 playbooks
                # Tueux uses "Plus machine qu'homme" instead of "Chromé (Tueur)" — correct per rules
                missing_pbs = [s for s in PLAYBOOK_SLUGS.values() if s not in mod_suffixes]
                # Remove Tueur from missing list (uses "Plus machine qu'homme" instead)
                if 'Tueur' in missing_pbs:
                    missing_pbs.remove('Tueur')
                    if 'Plus machine qu\'homme' in flat_module:
                        print(f"  ✅ Chromé (Tueur) → nommé «Plus machine qu'homme» (correct)")
                if missing_pbs:
                    print(f"  ⚠️ Chromé manquant pour: {', '.join(missing_pbs)}")
                    all_issues.append(('missing_chrome', 'Global', 'Chromé', f"missing for: {', '.join(missing_pbs)}"))
                    total_warnings += 1
                else:
                    print(f"  ✅ Chromé présent pour tous les {len(mod_suffixes)} livrets")

            # Check rollType if reference has a stat
            for pb, ref_data in pbs:
                ref_stat = ref_data.get('roll_stat', '')
                mod_roll = mod_entries[0][1]['rollType']  # Use first module entry
                if ref_stat and ref_stat in STAT_MAP:
                    expected_roll = STAT_MAP[ref_stat]
                    if mod_roll != expected_roll:
                        print(f"  ⚠️ ROLL: «{ref_name}» ({pb}) → module='{mod_roll}', attendu='{expected_roll}' ({ref_stat})")
                        all_issues.append(('rolltype_mismatch', pb, ref_name, f"module={mod_roll}, expected={expected_roll}"))
                        total_warnings += 1

                # Check results
                if ref_data.get('has_results') and ref_data.get('roll_type') != 'none':
                    # Skip results check for passive moves (no roll) — their "Résultats" are descriptive
                    mod_results = mod_entries[0][1]['results']
                    if not mod_results:
                        print(f"  ⚠️ RÉSULTATS: «{ref_name}» ({pb}) → pas de résultats dans le module")
                        all_issues.append(('missing_results', pb, ref_name, 'no results in module'))
                        total_warnings += 1
                    else:
                        for result_key in ref_data['results']:
                            if result_key not in mod_results:
                                print(f"  ⚠️ RÉSULTAT: «{ref_name}» ({pb}) → pas de résultat '{result_key}'")
                                all_issues.append(('missing_result_key', pb, ref_name, f"missing: {result_key}"))
                                total_warnings += 1

            good = True
        else:
            print(f"  ❌ MANQUANT: «{ref_name}» ({pb_str})")
            all_issues.append(('missing', pb_str, ref_name, ''))
            total_errors += 1
            good = False

    print()

    # ============================================================
    # Check 2: Extra moves in module not in reference
    # ============================================================
    print(f"  VÉRIFICATION 2: Manœuvres supplémentaires dans le module")
    print(f"{'─' * 70}")

    # Chromé is expected for all playbooks per reference note
    ref_names_with_shared = set(flat_expected.keys())

    # Combined entries like "Homme de la Renaissance / Intérêts diversifiés / Touche-à-tout"
    # expand to 3 separate names. The module has all 3. Those are already accounted for.
    # But we need to add Chromé as expected for all playbooks.
    chromé_expected = True  # Known shared move

    extra_count = 0
    for norm_name in sorted(flat_module.keys()):
        if norm_name in ref_names_with_shared:
            continue  # Expected, skip

        # Check if it's a Chromé variant (expected for all playbooks)
        if norm_name == 'Chromé':
            # Already checked above, skip here
            continue

        # Check if it's a known shared move variant
        if norm_name == 'Branché':
            # Branché is listed for Hacker in reference, module has it for Infiltré too
            # This is a legitimate extension
            print(f"  ✅ EXTENSION: «Branché» (Infiltré) — variante légitime")
            continue

        if norm_name == 'Plus machine qu\'homme':
            # Chromé equivalent for Tueur (per reference notes)
            print(f"  ✅ EXTENSION: «Plus machine qu'homme» (Tueur) — variante légitime")
            continue

        print(f"  ❓ EXTRA: «{norm_name}» — non listé dans la référence")
        mod_entries = flat_module[norm_name]
        for orig_name, _ in mod_entries:
            suffix = get_module_suffix(orig_name)
            pb = f" ({suffix})" if suffix else ""
            print(f"       → {orig_name}{pb}")
        all_issues.append(('extra', 'Global', norm_name, 'not in reference'))
        total_warnings += 1
        extra_count += 1

    if extra_count == 0:
        print(f"  ✅ Aucune manœuvre supplémentaire inattendue")
    print()

    # ============================================================
    # Per-playbook summary
    # ============================================================
    print(f"  RÉCAPITULATIF PAR LIVRET")
    print(f"{'─' * 70}")

    for pb in PLAYBOOK_ORDER:
        if pb not in expected:
            continue
        ref_moves = expected[pb]
        ref_names = set()
        for m in ref_moves:
            for n in expand_combined_name(m['name']):
                ref_names.add(n)

        # Find module moves for this playbook
        # Moves can be identified by:
        # 1. Name without suffix matching a ref name for this playbook
        # 2. Name with suffix matching this playbook's slug
        pb_slug = PLAYBOOK_SLUGS[pb]
        mod_moves_for_pb = set()
        for norm_name, entries in flat_module.items():
            for orig_name, _ in entries:
                suffix = get_module_suffix(orig_name)
                if suffix == pb_slug:
                    mod_moves_for_pb.add(norm_name)
                elif norm_name in ref_names and not suffix:
                    # Un-suffixed move that matches this playbook's ref
                    mod_moves_for_pb.add(norm_name)

        # Also add Chromé for this playbook
        if 'Chromé' in flat_module and f'Chromé ({pb_slug})' in [e[0] for e in flat_module.get('Chromé', [])]:
            mod_moves_for_pb.add('Chromé')

        # Add Branché for Infiltré
        if pb == "L'Infiltré" and 'Branché' in flat_module:
            mod_moves_for_pb.add('Branché')

        # Add Plus machine qu'homme for Tueur
        if pb == 'Le Tueur' and "Plus machine qu'homme" in flat_module:
            mod_moves_for_pb.add("Plus machine qu'homme")

        status = "✅" if len(ref_names) == len(ref_names & mod_moves_for_pb) else "⚠️"
        print(f"  {status} {pb}: {len(ref_names)} attendues, {len(ref_names & mod_moves_for_pb)} trouvées"
              f" ({len(mod_moves_for_pb - ref_names)} supplémentaire{'s' if len(mod_moves_for_pb - ref_names) != 1 else ''})")

    print()

    # ============================================================
    # 7. SUMMARY
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
        print()
        for issue in all_issues:
            kind, pb, name, detail = issue
            if kind == 'missing':
                print(f"    ❌ [{pb}] MANQUANT: {name}")
            elif kind == 'missing_chrome':
                print(f"    ⚠️ CHROMÉ MANQUANT: {detail}")
            elif kind == 'rolltype_mismatch':
                print(f"    ⚠️ [{pb}] ROLL: {name} — {detail}")
            elif kind == 'missing_results':
                print(f"    ⚠️ [{pb}] RÉSULTATS: {name} — {detail}")
            elif kind == 'missing_result_key':
                print(f"    ⚠️ [{pb}] RÉSULTAT: {name} — {detail}")
            elif kind == 'extra':
                print(f"    ❓ GLOBAL: {name} — {detail}")
        print()

    # JSON output for CI
    if '--json' in sys.argv:
        result = {
            'status': 'pass' if total_errors == 0 else 'fail',
            'errors': total_errors,
            'warnings': total_warnings,
            'issues': [
                {'type': kind, 'playbook': pb, 'move': name, 'detail': detail}
                for kind, pb, name, detail in all_issues
            ]
        }
        print(json.dumps(result, indent=2, ensure_ascii=False))

    return total_errors

if __name__ == '__main__':
    exit(validate())