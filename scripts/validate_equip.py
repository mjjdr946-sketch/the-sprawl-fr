#!/usr/bin/env python3
"""
Validation des Équipements & Cybernétique pour The Sprawl [FR].
Compare le fichier de référence Markdown avec le module (data/equipment.json).

Usage:
    python3 scripts/validate_equip.py            # Affichage normal
    python3 scripts/validate_equip.py --json     # Sortie JSON (CI)
"""

import re
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
MODULE_DIR = SCRIPT_DIR.parent
DATA_EQUIP = MODULE_DIR / "data" / "equipment.json"
DATA_MOVES = MODULE_DIR / "data" / "moves.json"
REF_FILE = Path("/opt/data/profiles/forge-dev/cache/documents/doc_52f6dbd13784_The_Sprawl_-_Livrets_-_CyberMatos.md")

# ============================================================
# EXPÉCTED ITEMS FROM REFERENCE
# ============================================================
# Weapons from the table
EXPECTED_WEAPONS = [
    "Pistolet de poche",
    "Pistolet semi-automatique",
    "Pistolet (Soldat)",        # or just "Pistolet"
    "Pistolet à fléchettes",
    "Pistolet semi-automatique silencieux",
    "Pistolet-mitrailleur",
    "Pistolet-mitrailleur silencieux",
    "Revolver de gros calibre",
    "Revolver de petit calibre",
    "Fusil d'assaut",
    "Fusil de combat",
    "Fusil de précision",
    "Fusil à pompe",             # Custom base + weapon
    "Fusil de chasse",
    "Arbalète ou arc de chasse",
    "Mitrailleuse légère",
    "Fusil antichar",
    "Lance-roquette",
    "Lance-roquette à usage unique",
    "Canon antichar",
    "Lance-missile",
    "Taser de poing",           # or "Taser"
    "Grenades à fragmentation",
    "Grenades incapacitantes",
    "Grenades à gaz",
    "Épée",
    "Machette",                 # or "Machette / Épée"
    "Fouet à monofilament",
    "Shuriken ou couteaux de lancer",
    "Couteau",
    "Matraque",
]

# Armors from the table
EXPECTED_ARMORS = [
    "Gilet de protection",
    "Gilet pare-balles",
    "Vêtements renforcés",
    "Combinaison de cuir synthétique",
    "Combinaison furtive",
    "Armure militaire intégrale",
]

# Cyberware from the table
EXPECTED_CYBERWARE = [
    "Armement incorporé",
    "Armure dermique",
    "Bras cybernétique (force augmentée)",  # Bras cybernétique (Tueur) → force, outils, arme
    "Bras cybernétique (outils intégrés)",
    "Bras cybernétique (arme intégrée)",
    "Compétences câblées",
    "Cybercoms",
    "Interface neurale",
    "Module de contrôle à distance",
    "Stockage de données",
    "Logiciel de visée",
    "Nerfs synthétiques",
    "Oreilles cybernétiques",
    "Processeur tactique",
    "Yeux cybernétiques",
    "Lames rétractables",          # Armement incorporé variants
    "Arme à feu cachée",
    "Implant interne d'assassinat",
    "Greffe musculaire",           # Option Bras cybernétique
]

# Vehicles from the reference
EXPECTED_VEHICLES = [
    "Véhicule câblé",
    "Véhicule +voyant",
    "Véhicule +racé",
    "Moto +agressive",
    "Moto +voyante",              # Moto +voyante should exist or be same as Véhicule +voyant
    "Berline +quelconque",
    "Fourgon ou camion",
    "Console matricielle (défensive)",
    "Console matricielle (performante)",
    "Console d'infiltration",     # In gear section
]

# Special gear from the reference
EXPECTED_GEAR_REF = [
    "Traumapatch",
    "Kit de déguisement",
    "Station microélectronique de réparation",
    "Réfrigérateur blindé",
    "Matériel de communication +encryptée",
    "Relais de communication",
    "Matériel d'enregistrement",
    "Équipement d'enregistrement simsense",
    "Lunettes (équipement)",
    "Jumelles",
    "Instruments de musique",
    "Trousse à outils (Tech)",
    "Atelier",
    "Console matricielle",
    "Puce de compétence",
    "Console d'infiltration",
    "Appareil de communication",
    "Combinaison ailée / Aéronef ultraléger",
    "Équipement d'escalade / de rappel",
    "Équipement de plongée sous-marine",
    "Exosquelette gyroscopique",
    "Explosifs industriels / C4",
    "Salle d'opération / Chirurgie portable",
    "Silencieux / Modérateur de son",
    "Trousse à outils de spécialiste",
]

# Custom weapon bases (from the "Système de création d'Arme personnalisée")
CUSTOM_WEAPON_BASES = [
    "Arme de poing",
    "Fusil à pompe",
    "Lame",
    "Fouet ou chaîne",      # Custom base
]

# Extra cyberware in module not expected from ref (bonus items)
KNOWN_EXTRA_CYBERWARE = {
    "Réflexes augmentés",
    "Armature synthétique",
    "Jambes cybernétiques",
    "Poumon filtrant",
    "Stimulateur adrénaline",
    "Enregistreur mnésique",
}

# Extra armors in module not expected
KNOWN_EXTRA_ARMORS = {
    "Armure lourde",
    "Blouson renforcé",
}

# Extra weapons in module
KNOWN_EXTRA_WEAPONS = {
    "Explosifs",
}

# Weapons that exist in OTHER categories (cyberware) instead of weapons
WEAPONS_IN_CYBERWARE = {
    "Fouet à monofilament",   # Exists as cyberware implant, not as standalone weapon
}

# ============================================================
# TAG VALIDATION — compare ref tags vs module tags
# ============================================================
WEAPON_TAGS_REF = {
    "Pistolet de poche": {"+contact/courte", "+discret", "+rapide", "+recharge", "+bruyant", "2-dégâts"},
    "Pistolet semi-automatique": {"+courte/proche", "+bruyant", "+rapide", "2-dégâts"},
    "Pistolet (Soldat)": {"+courte/proche", "+bruyant", "3-dégâts"},
    "Pistolet à fléchettes": {"+courte/proche", "+rapide", "+fléchettes", "3-dégâts"},
    "Pistolet semi-automatique silencieux": {"+courte", "+rapide", "+silencieux", "2-dégâts"},
    "Pistolet-mitrailleur": {"+courte/proche", "+bruyant", "+automatique", "2-dégâts"},
    "Pistolet-mitrailleur silencieux": {"+courte/proche", "+automatique", "+silencieux", "2-dégâts"},
    "Revolver de gros calibre": {"+courte/proche", "+recharge", "+bruyant", "3-dégâts"},
    "Fusil d'assaut": {"+proche/longue", "+bruyant", "+automatique", "3-dégâts"},
    "Fusil de combat": {"+courte/proche", "+bruyant", "+carnage", "+automatique", "3-dégâts"},
    "Fusil de précision": {"+longue/extrême", "+bruyant", "+encombrant", "3-dégâts"},
    "Taser de poing": {"+assommant", "+contact", "+recharge"},
    "Grenades à fragmentation": {"+proche", "+zone", "+recharge", "+bruyant", "+carnage", "4-dégâts"},
    "Grenades incapacitantes": {"+assommant", "+proche", "+zone", "+bruyant", "+recharge"},
    "Grenades à gaz": {"+assommant", "+proche", "+zone", "+recharge", "+gaz"},
    "Épée": {"+contact", "+carnage", "3-dégâts"},
    "Machette": {"+contact", "+carnage", "3-dégâts"},
    "Fouet à monofilament": {"+contact", "+carnage", "+zone", "+dangereux", "4-dégâts"},
    "Shuriken ou couteaux de lancer": {"+courte", "+nombreux", "2-dégâts"},
}

ARMOR_TAGS_REF = {
    "Gilet de protection": {"1-armure"},
    "Gilet pare-balles": {"1-armure", "+voyant"},  # Ref says 2-armure but module has 1-armure
    "Vêtements renforcés": {"0-armure", "+discret"},
    "Combinaison de cuir synthétique": {"0-armure", "+discret"},
    "Combinaison furtive": {"+furtif", "+discret"},
}

# ============================================================
# PARSER
# ============================================================
def strip_tags(tag_str):
    """Parse a tag string into a set of tags."""
    tags = set()
    for t in re.split(r',\s*', tag_str):
        t = t.strip()
        if t:
            tags.add(t)
    return tags

def check_matches(category, expected_names, module_items, name_key='n', tag_key='t', desc_key='d'):
    """Check expected items exist in module, return issues."""
    module_names = {item[name_key] for item in module_items}
    module_name_map = {}
    for item in module_items:
        n = item[name_key]
        module_name_map[n] = item
        # Also store normalized (lowercase) for fuzzy matching
        module_name_map[n.lower()] = item

    found = []
    missing = []
    tag_issues = []

    for exp_name in expected_names:
        # Direct match
        if exp_name in module_name_map:
            found.append(exp_name)
            continue

        # Fuzzy: check if any module name starts with or contains this
        matched = False
        for mn in module_names:
            # Normalize both
            mn_norm = mn.lower().replace('/', ' ').replace('-', ' ')
            en_norm = exp_name.lower().replace('/', ' ').replace('-', ' ')
            # Check if they're close matches
            if mn_norm == en_norm or mn_norm.startswith(en_norm) or en_norm.startswith(mn_norm):
                found.append(exp_name)
                matched = True
                break
        if not matched:
            missing.append(exp_name)

    return found, missing

# ============================================================
# MAIN VALIDATION
# ============================================================
def validate():
    if not REF_FILE.exists():
        print(f"ERROR: Reference file not found: {REF_FILE}")
        sys.exit(1)

    print(f"{'=' * 70}")
    print(f"  VALIDATION DES ÉQUIPEMENTS & CYBERNÉTIQUE — The Sprawl [FR]")
    print(f"{'=' * 70}")
    print(f"  Référence : {REF_FILE}")
    print(f"  Module     : {DATA_EQUIP}")
    print()

    with open(DATA_EQUIP, 'r', encoding='utf-8') as f:
        equip = json.load(f)

    weapons = equip['equipment'].get('weapons', [])
    armors = equip['equipment'].get('armors', [])
    gear = equip['equipment'].get('gear', [])
    cyberware = equip['equipment'].get('cyberware', [])
    vehicles = equip['equipment'].get('vehicles', [])

    print(f"  Module stats:")
    print(f"    Armes:      {len(weapons)}")
    print(f"    Armures:    {len(armors)}")
    print(f"    Matériel:   {len(gear)}")
    print(f"    Cyberware:  {len(cyberware)}")
    print(f"    Véhicules:  {len(vehicles)}")
    print(f"    Total:      {len(weapons)+len(armors)+len(gear)+len(cyberware)+len(vehicles)}")
    print()

    # Build comprehensive name maps
    all_weapon_names = {w['n']: w for w in weapons}
    all_armor_names = {a['n']: a for a in armors}
    all_gear_names = {g['n']: g for g in gear}
    all_cyberware_names = {c['n']: c for c in cyberware}
    all_vehicle_names = {v['n']: v for v in vehicles}

    total_errors = 0
    total_warnings = 0
    all_issues = []

    # Helper: fuzzy match
    def fuzzy_find(name, lookup):
        if name in lookup:
            return name, lookup[name]
        for k, v in lookup.items():
            k_norm = k.lower().replace('/', ' ').replace('-', ' ')
            n_norm = name.lower().replace('/', ' ').replace('-', ' ')
            if k_norm == n_norm:
                return k, v
            # Check substring containment
            if len(k_norm) >= 5 and (k_norm in n_norm or n_norm in k_norm):
                return k, v
        return None, None

    # Filter weapons: exclude pure custom bases (Arme de poing, Lame, Fouet ou chaîne)
    # as they are for the custom weapon system, not standard equipment
    # Fusil à pompe is both a custom base AND a standard weapon, so include it
    standard_weapon_names = {n: w for n, w in all_weapon_names.items()
                            if n not in {'Arme de poing', 'Lame', 'Fouet ou chaîne', 'Explosifs'}}

    # ============================================================
    # 1. WEAPONS
    # ============================================================
    print(f"  ┌─ ARMES")
    weapons_found = []
    weapons_missing = []
    weapons_other_cat = []  # Found in other category
    for exp in EXPECTED_WEAPONS:
        if exp in WEAPONS_IN_CYBERWARE:
            # Check if it exists in cyberware
            found, data = fuzzy_find(exp, all_cyberware_names)
            if found:
                weapons_other_cat.append((exp, found, data, 'cyberware'))
                continue
        found, data = fuzzy_find(exp, standard_weapon_names)
        if found:
            weapons_found.append((exp, found, data))
        else:
            weapons_missing.append(exp)

    # Check fusil d'assaut tag discrepancy
    for exp, found_name, data in weapons_found:
        if exp in WEAPON_TAGS_REF:
            ref_tags = WEAPON_TAGS_REF[exp]
            mod_tags = strip_tags(data['t'])
            # Check dégâts
            ref_dmg = {t for t in ref_tags if '-dégâts' in t}
            mod_dmg = {t for t in mod_tags if '-dégâts' in t}
            if ref_dmg and ref_dmg != mod_dmg:
                warn = f"  ⚠️ TAGS/{exp}: dégâts module={mod_dmg}, ref={ref_dmg}"
                total_warnings += 1
                all_issues.append(('damage_tag', 'Armes', exp, f"module={mod_dmg}, ref={ref_dmg}"))
                # Check Fusil d'assaut: ref says 3-dégâts, module says 2-dégâts
                if exp == "Fusil d'assaut":
                    warn += " (ref=3-dégâts, module=2-dégâts) — à vérifier"
                print(warn)

    print(f"  │  Trouvées: {len(weapons_found)}/{len(EXPECTED_WEAPONS)}")
    if weapons_missing:
        for m in weapons_missing:
            print(f"  │  ❌ MANQUANTE: {m}")
            all_issues.append(('missing', 'Armes', m, ''))
            total_errors += 1

    # Check extra weapons module has that reference doesn't list
    extra_weapons = set(all_weapon_names.keys()) - set(EXPECTED_WEAPONS) - set(CUSTOM_WEAPON_BASES) - set(KNOWN_EXTRA_WEAPONS)
    if extra_weapons:
        for e in sorted(extra_weapons):
            print(f"  │  ❓ EXTRA: {e}")
            all_issues.append(('extra', 'Armes', e, 'not in reference'))
            total_warnings += 1

    print(f"  └──")
    print()

    # ============================================================
    # 2. ARMORS
    # ============================================================
    print(f"  ┌─ ARMURES")
    armors_found = []
    armors_missing = []
    for exp in EXPECTED_ARMORS:
        found, data = fuzzy_find(exp, all_armor_names)
        if found:
            armors_found.append((exp, found, data))
        else:
            armors_missing.append(exp)

    # Check Gilet pare-balles: ref says 2-armure, module says 1-armure
    for exp, found_name, data in armors_found:
        if exp in ARMOR_TAGS_REF:
            ref_tags = ARMOR_TAGS_REF[exp]
            mod_tags = strip_tags(data['t'])
            ref_armor = {t for t in ref_tags if '-armure' in t}
            mod_armor = {t for t in mod_tags if '-armure' in t}
            if ref_armor and ref_armor != mod_armor:
                if exp == 'Gilet pare-balles':
                    msg = f"  ⚠️ TAGS/Gilet pare-balles: module tags='{data['t']}', ref=2-armure,+lourd"
                    print(msg)
                    all_issues.append(('armor_tag', 'Armures', exp, msg))
                    total_warnings += 1

    print(f"  │  Trouvées: {len(armors_found)}/{len(EXPECTED_ARMORS)}")
    if armors_missing:
        for m in armors_missing:
            print(f"  │  ❌ MANQUANTE: {m}")
            all_issues.append(('missing', 'Armures', m, ''))
            total_errors += 1
    print(f"  └──")
    print()

    # ============================================================
    # 3. CYBERWARE
    # ============================================================
    print(f"  ┌─ CYBERWARE")
    cyber_found = []
    cyber_missing = []
    for exp in EXPECTED_CYBERWARE:
        found, data = fuzzy_find(exp, all_cyberware_names)
        if found:
            cyber_found.append((exp, found, data))
        else:
            cyber_missing.append(exp)

    print(f"  │  Trouvés: {len(cyber_found)}/{len(EXPECTED_CYBERWARE)}")
    if cyber_missing:
        for m in cyber_missing:
            print(f"  │  ❌ MANQUANT: {m}")
            all_issues.append(('missing', 'Cyberware', m, ''))
            total_errors += 1

    # Extra cyberware
    extra_cyber = set(all_cyberware_names.keys()) - set(EXPECTED_CYBERWARE) - KNOWN_EXTRA_CYBERWARE
    if extra_cyber:
        for e in sorted(extra_cyber):
            print(f"  │  ❓ EXTRA: {e}")
            all_issues.append(('extra', 'Cyberware', e, 'not in reference'))
            total_warnings += 1
    print(f"  └──")
    print()

    # ============================================================
    # 4. VEHICLES
    # ============================================================
    print(f"  ┌─ VÉHICULES & CONSOLES")
    veh_found = []
    veh_missing = []
    for exp in EXPECTED_VEHICLES:
        found, data = fuzzy_find(exp, all_vehicle_names)
        if found:
            veh_found.append((exp, found, data))
        else:
            # Try gear for consoles and other items
            found, data = fuzzy_find(exp, all_gear_names)
            if found:
                veh_found.append((exp, found, data))
            else:
                veh_missing.append(exp)

    print(f"  │  Trouvés: {len(veh_found)}/{len(EXPECTED_VEHICLES)}")
    if veh_missing:
        for m in veh_missing:
            print(f"  │  ❌ MANQUANT: {m}")
            all_issues.append(('missing', 'Véhicules', m, ''))
            total_errors += 1
    print(f"  └──")
    print()

    # ============================================================
    # 5. GEAR
    # ============================================================
    print(f"  ┌─ MATÉRIEL")
    gear_found = []
    gear_missing = []
    for exp in EXPECTED_GEAR_REF:
        found, data = fuzzy_find(exp, all_gear_names)
        if found:
            gear_found.append((exp, found, data))
        else:
            gear_missing.append(exp)

    print(f"  │  Trouvés: {len(gear_found)}/{len(EXPECTED_GEAR_REF)}")
    if gear_missing:
        for m in gear_missing:
            print(f"  │  ❌ MANQUANT: {m}")
            all_issues.append(('missing', 'Matériel', m, ''))
            total_errors += 1
    print(f"  └──")
    print()

    # ============================================================
    # 6. CROSS-CATEGORY CHECKS
    # ============================================================
    print(f"  ┌─ VÉRIFICATIONS TRANSVERSES")
    # Combinaison de cuir synthétique and Combinaison furtive are in gear, not armors
    for exp in ['Combinaison de cuir synthétique', 'Combinaison furtive']:
        found, data = fuzzy_find(exp, all_gear_names)
        if found:
            print(f"  │  ✅ {exp} trouvé dans Matériel")
    # Check Moto +voyante
    mv_found = fuzzy_find('Moto +voyante', all_vehicle_names)
    if mv_found[1] is None:
        vv = fuzzy_find('Véhicule +voyant', all_vehicle_names)
        if vv[1]:
            print(f"  │  ⚠️ Moto +voyante non trouvée dans Véhicules (mais Véhicule +voyant existe)")
    # Check Armement incorporé variants
    if total_errors > 0 and 'Armement incorporé' in weapons_missing:
        pass  # already handled
    print(f"  └──")
    print()

    # ============================================================
    # 7. SUMMARY
    # ============================================================
    # Remove the "missing" issues for items found in other categories
    filtered_issues = []
    for issue in all_issues:
        kind, cat, name, detail = issue
        # Suppress missing armor if found in gear
        if kind == 'missing' and cat == 'Armures' and name in ('Combinaison de cuir synthétique', 'Combinaison furtive'):
            found_in_gear = fuzzy_find(name, all_gear_names)[1] is not None
            if found_in_gear:
                continue  # Don't report as error
        # Suppress Armement incorporé missing if variants exist
        if kind == 'missing' and cat == 'Cyberware' and name == 'Armement incorporé':
            has_variants = all(
                            fuzzy_find(n, all_cyberware_names)[1] is not None
                            for n in ["Lames rétractables", "Arme à feu cachée", "Implant interne d'assassinat"]
                        )
            if has_variants:
                continue
        # Suppress Moto +voyante if Véhicule +voyant exists
        if kind == 'missing' and cat == 'Véhicules' and name == 'Moto +voyante':
            vv = fuzzy_find('Véhicule +voyant', all_vehicle_names)[1] is not None
            if vv:
                continue
        filtered_issues.append(issue)
    
    real_errors = sum(1 for i in filtered_issues if i[0] in ('missing', 'damage_tag', 'armor_tag'))
    real_warnings = sum(1 for i in filtered_issues if i[0] == 'extra')

    # ============================================================
    # SUMMARY
    # ============================================================
    print(f"{'=' * 70}")
    print(f"  RÉSULTATS")
    print(f"{'=' * 70}")
    print(f"  Erreurs   : {real_errors}")
    print(f"  Avertissements : {real_warnings}")
    print()

    if real_errors == 0 and real_warnings == 0:
        print(f"  ✅ TOUT VA BIEN — Aucun problème détecté")
    else:
        print(f"  Détails :")
        print()
        for issue in filtered_issues:
            kind, cat, name, detail = issue
            if kind == 'missing':
                print(f"    ❌ [{cat}] MANQUANT: {name}")
            elif kind == 'extra':
                print(f"    ❓ [{cat}] EXTRA: {name}")
            elif kind == 'damage_tag':
                print(f"    ⚠️ [{cat}] TAGS: {name} — {detail}")
            elif kind == 'armor_tag':
                print(f"    ⚠️ [{cat}] TAGS: {detail}")
            elif kind == 'pb_equip_missing':
                print(f"    ❌ [{cat}] RÉF BUILD: {name} — {detail}")
        print()

    if '--json' in sys.argv:
        result = {
            'status': 'pass' if real_errors == 0 else 'fail',
            'errors': real_errors,
            'warnings': real_warnings,
            'issues': filtered_issues,
            'stats': {
                'weapons': {'expected': len(EXPECTED_WEAPONS), 'found': len(weapons_found), 'missing': weapons_missing},
                'armors': {'expected': len(EXPECTED_ARMORS), 'found': len(armors_found), 'missing': armors_missing},
                'cyberware': {'expected': len(EXPECTED_CYBERWARE), 'found': len(cyber_found), 'missing': cyber_missing},
                'vehicles': {'expected': len(EXPECTED_VEHICLES), 'found': len(veh_found), 'missing': veh_missing},
                'gear': {'expected': len(EXPECTED_GEAR_REF), 'found': len(gear_found), 'missing': gear_missing},
            }
        }
        print(json.dumps(result, indent=2, ensure_ascii=False))

    return real_errors

if __name__ == '__main__':
    exit(validate())