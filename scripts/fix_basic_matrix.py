#!/usr/bin/env python3
"""
Correcteur pour Manœuvres de Base + Matrice — The Sprawl [FR].

Corrections :
1. Normalise les clés des manœuvres de matrice : 10+/7-9/6- → success/partial/failure
2. Ajoute les paliers failure (6-) manquants sur les manœuvres de base
3. Ajoute les explications de retenues et options aux descriptions
4. Corrige Briser la Glace (7+ → success, ajoute 6-)

Usage:
    python3 scripts/fix_basic_matrix.py
"""

import json
import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
MODULE_DIR = SCRIPT_DIR.parent
DATA_MOVES = MODULE_DIR / "data" / "moves.json"

# ============================================================
# DESCRIPTION UPDATES — enrichir avec options/retenues
# ============================================================
DESC_UPDATES = {
    "Battre le pavé": (
        "<p>Quand tu te rapproches d'un Contact pour obtenir de l'aide, lance 2d6+Style.</p>"
        "<p><strong>Options & Retenues (sur 7-9)</strong> — tu obtiens ce que tu veux, mais choisis 2 options :</p>"
        "<ul>"
        "<li>Ta requête va te coûter cher.</li>"
        "<li>Ta requête va prendre du temps à organiser.</li>"
        "<li>Ta requête va attirer l'attention ou une complication.</li>"
        "<li>Ton Contact a besoin d'un coup de main (refuser = -1 continu).</li>"
        "</ul>"
    ),
    "Blessure": (
        "<p>Quand tu subis des dégâts, retranche l'armure, coche les segments, lance 2d6+dégâts subis.</p>"
        "<p><em>Note : jet inversé — les scores faibles sont favorables.</em></p>"
        "<p><strong>Options (sur 7-9)</strong> — le MC choisit : perds pied, perds prise, perds trace, ou quelqu'un prend le dessus.</p>"
        "<p><strong>Options (sur 10+)</strong> — tu choisis : hors-de-combat, dégâts complets, cybernétique perdue, ou membre perdu.</p>"
    ),
    "Évaluer": (
        "<p>Quand tu étudies une personne, lieu ou situation, lance 2d6+Pro.</p>"
        "<p><strong>Dépense de retenues</strong> : dépense 1 retenue à n'importe quel moment pour poser une question de la liste (le MC répond honnêtement), et gagne +1 sur ton prochain jet quand tu agis sur la base de la réponse :</p>"
        "<ul>"
        "<li>De quelle potentielle complication devrais-je me méfier ?</li>"
        "<li>Qu'est-ce que je remarque en dépit de l'effort fait pour le cacher ?</li>"
        "<li>En quoi ______ m'est-il vulnérable ?</li>"
        "<li>Comment puis-je éviter les ennuis ou me cacher ici ?</li>"
        "<li>Quelle est la meilleure façon de m'infiltrer / m'exfiltrer / traverser ?</li>"
        "<li>Où puis-je obtenir le meilleur avantage ?</li>"
        "<li>Quelle est la plus grande menace dans cette situation ?</li>"
        "<li>Qui est ou qu'est-ce qui est aux commandes ici ?</li>"
        "</ul>"
    ),
    "Passer sur le billard": (
        "<p>Quand tu installes un implant cybernétique chez un doc de rue, lance 2d6+dépense Cred (max +2).</p>"
        "<p><strong>Options (sur 7-9)</strong> — la cybernétique fonctionne imparfaitement, choisis une étiquette négative :</p>"
        "<ul>"
        "<li>+douloureux (douleurs aiguës, dommages nerveux).</li>"
        "<li>+dégradation (usure progressive inéluctable).</li>"
        "<li>+médiocre (efficacité réduite).</li>"
        "<li>+défaillant (dysfonctionnements aléatoires).</li>"
        "</ul>"
    ),
    "Compromettre la sécurité": (
        "<p>Quand tu tentes de compromettre la sécurité d'un sous-système, lance 2d6+Esprit.</p>"
        "<p><strong>Dépense de retenues</strong> : dépense 1 retenue pour activer une mesure de sécurité dans ce sous-système (déclencher/annuler une alerte locale, activer/désactiver une Glace du nœud, ouvrir/fermer des accès logiciels).</p>"
    ),
    "Manipuler un système": (
        "<p>Quand tu manipules le dispositif d'un bâtiment contrôlé électroniquement, lance 2d6+Synth.</p>"
        "<p><strong>Dépense de retenues</strong> : dépense 1 retenue pour activer une routine dans ce sous-système (verrouiller/déverrouiller des portes, éteindre/allumer les lumières, modifier la ventilation, déclencher les extincteurs).</p>"
    ),
    "Briser la Glace": (
        "<p>Quand tu esquives, détruis ou neutralises une Glace active, lance 2d6+Pro.</p>"
        "<p><strong>Effets au choix du joueur</strong> :</p>"
        "<ul>"
        "<li><em>Détruire</em> : élimine définitivement la Glace (laisse des traces visibles).</li>"
        "<li><em>Neutraliser</em> : désactive la Glace temporairement pour travailler sur le nœud.</li>"
        "<li><em>Esquiver</em> : laisse la Glace active derrière soi (menace pour un intrus non autorisé).</li>"
        "</ul>"
        "<p><strong>En cas de 7-9</strong>, la Glace exécute une routine avant désactivation : Bleue = 1 option, Rouge = 2 options, Noire = 3 options.</p>"
    ),
    "Aider ou Interférer": (
        "<p>Quand tu aides ou entraves un autre personnage, lance 2d6+Liens.</p>"
        "<p><strong>Objets de la Manœuvre</strong> : si tu aides, la cible gagne +1 ; si tu interfères, elle subit -2.</p>"
    ),
    "Employer la manière forte": (
        "<p>Quand tu emploies la violence face à une force armée, annonce ton objectif et lance 2d6+Chair.</p>"
        "<p><strong>Complications (sur 7-9, choisis 2)</strong> :</p>"
        "<ul>"
        "<li>Tu fais trop de remue-ménage (un Compte à rebours est avancé).</li>"
        "<li>Tu subis des dégâts.</li>"
        "<li>Un allié subit des dégâts.</li>"
        "<li>Quelque chose de valeur est cassé.</li>"
        "</ul>"
    ),
    "Obtenir le taf": (
        "<p>Quand tu négocies les termes d'une Mission, lance 2d6+Pro.</p>"
        "<p><strong>Options disponibles</strong> : employeur fournit [info] · employeur fournit [matos] · le travail paie bien (x3) · la rencontre n'attire pas l'attention · l'employeur est identifiable.</p>"
    ),
    "Se faire payer": (
        "<p>Quand tu te fais payer par ton employeur, lance 2d6+segments d'Investigation non remplis.</p>"
        "<p><strong>Options disponibles</strong> : pas de traquenard · paiement en totalité (x2/x3) · employeur identifiable · pas d'attention de tiers · tout le monde gagne en expérience.</p>"
    ),
}

# ============================================================
# MISSING TIERS — results to ADD (key → label/value)
# ============================================================
ADD_FAILURE = {
    "Administrer les premiers soins": "<p>Échec ; le MC effectue une Manœuvre.</p>",
    "Agir sous pression": "<p>Échec ; le danger se concrétise et le MC effectue une Manœuvre.</p>",
    "Aider ou Interférer": "<p>Échec ; le MC effectue une Manœuvre directement contre toi.</p>",
    "Baratiner": "<p>Échec ; la supercherie est percée à jour et le MC effectue une Manœuvre.</p>",
    "Battre le pavé": "<p>Échec ; la demande tourne mal et le MC effectue une Manœuvre.</p>",
    "Blessure": "",  # handled: 6- = "encaisses sans complication"
    "Employer la manière forte": "<p>Échec ; tu n'atteins pas ton objectif et le MC effectue une Manœuvre.</p>",
    "Évaluer": "<p>Échec ; le MC effectue une Manœuvre.</p>",
    "Montrer les dents": "<p>Échec ; la cible réagit agressivement et le MC effectue une Manœuvre.</p>",
    "Obtenir le taf": "<p>Échec ; l'employeur dicte ses conditions sans concession.</p>",
    "Se faire payer": "<p>Échec ; l'employeur trahit ou tend un piège, le MC effectue une Manœuvre.</p>",
    "Manipuler un système": "<p>Échec ; le MC effectue une Manœuvre.</p>",
    "Briser la Glace": "<p>Échec ; la Glace exécute sa routine complète sans être neutralisée et le MC effectue une Manœuvre.</p>",
}

# Blessure failure = 6- favorable (jet inversé)
BLESSURE_FAILURE = "<p>Tu encaisses le choc sans complication supplémentaire immédiate. (Jet inversé : 6- est favorable).</p>"

# ============================================================
# FIXES
# ============================================================
def fix_moves():
    print(f"{'=' * 60}")
    print(f"  CORRECTION MANŒUVRES DE BASE + MATRICE")
    print(f"{'=' * 60}")

    with open(DATA_MOVES, 'r', encoding='utf-8') as f:
        data = json.load(f)

    changes = 0

    for move in data['moves']:
        name = move['name']
        sysd = move['system']
        mt = sysd.get('moveType')
        modified = False

        # --- Matrix moves: normalize result keys 10+/7-9/6- → success/partial/failure
        if mt == 'matrix' or name in ("S'authentifier", "Compromettre la sécurité",
                                       "Manipuler un système", "Briser la Glace", "Se débrancher"):
            mr = sysd.get('moveResults', {})
            if any(k in mr for k in ('10+', '7-9', '6-')):
                key_map = {'10+': 'success', '7-9': 'partial', '6-': 'failure'}
                new_mr = {}
                for k, v in mr.items():
                    if k in key_map:
                        nk = key_map[k]
                        # Keep label as the threshold
                        new_mr[nk] = v
                    else:
                        new_mr[k] = v
                # Briser la Glace: 7+ → success (label 10+)
                if '7+' in new_mr:
                    v = new_mr.pop('7+')
                    new_mr['success'] = v
                sysd['moveResults'] = new_mr
                modified = True
                print(f"  ✅ CLÉS «{name}» : normalisées en success/partial/failure")

        # --- Briser la Glace: ensure success label is 10+
        if name == "Briser la Glace":
            mr = sysd.get('moveResults', {})
            if 'success' in mr:
                if mr['success'].get('label') != '10+':
                    mr['success']['label'] = '10+'
                    modified = True

        # --- Add missing failure tiers
        if name in ADD_FAILURE:
            mr = sysd.get('moveResults', {})
            if 'failure' not in mr:
                val = BLESSURE_FAILURE if name == 'Blessure' else ADD_FAILURE[name]
                if val:
                    mr['failure'] = {'key': 'failure', 'label': '6-', 'value': val}
                    sysd['moveResults'] = mr
                    modified = True
                    print(f"  ✅ RÉSULTAT «{name}» : palier failure (6-) ajouté")

        # --- Description updates (retenues / options)
        if name in DESC_UPDATES:
            new_desc = DESC_UPDATES[name]
            if sysd.get('description') != new_desc:
                sysd['description'] = new_desc
                modified = True
                print(f"  ✅ DESC «{name}» : options/retenues ajoutées")

        if modified:
            changes += 1

    # Fix labels on results that are mislabeled
    for move in data['moves']:
        name = move['name']
        sysd = move['system']
        mr = sysd.get('moveResults', {})
        # Ensure success label 10+, partial 7-9, failure 6- for basic moves
        if sysd.get('moveType') == 'basic':
            if 'success' in mr and mr['success'].get('label') in ('7+', ''):
                mr['success']['label'] = '10+'
            if 'partial' in mr and mr['partial'].get('label') == '7+':
                mr['partial']['label'] = '7-9'

    with open(DATA_MOVES, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n  {changes} manœuvres modifiées dans {DATA_MOVES}")
    return changes

if __name__ == '__main__':
    fix_moves()
    print(f"\n✅ Terminé !")