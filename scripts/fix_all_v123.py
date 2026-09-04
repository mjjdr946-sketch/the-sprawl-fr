#!/usr/bin/env python3
"""
Correcteur complet v1.2.3 — The Sprawl [FR]
Corrige tous les problèmes remontés par les tests.

Usage:
    python3 scripts/fix_all_v123.py
"""

import json
import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
MODULE_DIR = SCRIPT_DIR.parent
DATA_MOVES = MODULE_DIR / "data" / "moves.json"
DATA_EQUIP = MODULE_DIR / "data" / "equipment.json"
BUILD_SCRIPT = MODULE_DIR / "scripts" / "build-ldb.mjs"

# ============================================================
# 1. LIVRETS — DESCRIPTION UPDATES
# ============================================================

PLAYBOOK_DESC_UPDATES = {
    "Renforts": (
        "<p>Tu embauches un petit Gang (5-10 gros bras : 2-dégâts, +petit, +employé, 1-armure). Tu obtiens +1 équipe et le job Protection.</p>"
        "<p><strong>Personnalisation (choisis 2)</strong> :</p>"
        "<ul>"
        "<li>Associés bien armés : +1 dégât</li>"
        "<li>Associés bien protégés : +1 armure, +voyant</li>"
        "<li>Anciens militaires : +discipliné</li>"
        "<li>Plus que des hommes de main : +loyal (remplace +employé)</li>"
        "<li>Motos ou véhicules : +mobile</li>"
        "<li>Large groupe (15-30) : +moyen (remplace +petit)</li>"
        "</ul>"
        "<p><strong>Job Protection</strong> :</p>"
        "<ul>"
        "<li><em>Profit</em> : Tes associés couvrent tes arrières.</li>"
        "<li><em>Désastre</em> : Tes associés ont énervé les mauvaises personnes.</li>"
        "</ul>"
    ),
    "Magouilles": (
        "<p>Des gens accomplissent des boulots pour toi. Tu démarres avec 2-équipe et deux jobs. "
        "Entre les Missions, choisis un nombre de jobs ≤ ton équipe, décris chacun, lance 2d6+Pro.</p>"
        "<p><strong>Jobs disponibles</strong> :</p>"
        "<ul>"
        "<li><em>Surveillance</em> : Profit = [info] · Désastre = mauvaise info</li>"
        "<li><em>Recouvrement de dettes</em> : Profit = [matos] · Désastre = débiteur à sec</li>"
        "<li><em>Menu larcin</em> : Profit = [matos] · Désastre = volent la mauvaise personne</li>"
        "<li><em>Livraisons</em> : Profit = 1 Cred · Désastre = livraison jamais arrivée</li>"
        "<li><em>Intermédiaire</em> : Profit = 1 Cred · Désastre = négociation tourne au vinaigre</li>"
        "<li><em>Travail technique</em> : Profit = [matos] · Désastre = matos d'un tiers a des problèmes</li>"
        "<li><em>Proxénétisme</em> : Profit = [info] · Désastre = problème avec un client</li>"
        "<li><em>Substances addictives</em> : Profit = [info] · Désastre = problème client ou labo</li>"
        "</ul>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : Tous tes jobs sont des Profits.</li>"
        "<li><em>7-9</em> : L'un d'eux est un Désastre.</li>"
        "<li><em>6-</em> : Merdier complet. Le MC fait une Manœuvre pour chaque job.</li>"
        "</ul>"
    ),
    "Renom (Hacker)": (
        "<p>Avec un avatar reconnaissable, lance 2d6+Synth pour baratiner et montrer les dents au lieu de Style/Pro.</p>"
        "<p>Quand ta renommée te cause problème (gêne, complications), gagne en expérience.</p>"
    ),
    "Guerre psychologique": (
        "<p>Influence le moral de tes adversaires en laissant des preuves de violence tout en restant invisible, lance 2d6+Pro.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : C'est toi qui choisis l'état des adversaires.</li>"
        "<li><em>7-9</em> : Le MC choisit : excessivement prudents, effrayés et démoralisés, ou en colère et négligents.</li>"
        "<li><em>6-</em> : Échec.</li>"
        "</ul>"
    ),
    "Chasseur de gros gibier": (
        "<p>Tends un piège à une cible sur laquelle tu as enquêté, lance 2d6+Pro.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : La cible est à ta merci. Si elle tente de s'échapper, lance 2d6+Pro au lieu de Chair pour employer la manière forte.</li>"
        "<li><em>7-9</em> : Tu l'as prise au piège, la seule issue passe par toi.</li>"
        "<li><em>6-</em> : Échec.</li>"
        "</ul>"
    ),
    "Tireur embusqué": (
        "<p>Établis un endroit couvert et dissimulé pour te cacher, lance 2d6+Cran.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : Choisis 3 options.</li>"
        "<li><em>7-9</em> : Choisis 2 options.</li>"
        "<li><em>6-</em> : Échec.</li>"
        "</ul>"
        "<p><strong>Options disponibles</strong> :</p>"
        "<ul>"
        "<li>Ton site est bien caché.</li>"
        "<li>Ton site dispose d'un excellent couvert.</li>"
        "<li>Ton site t'octroie un excellent champ de vision.</li>"
        "<li>Tu disposes d'un site de rechange, couvert et dissimulé.</li>"
        "<li>Ton site est bien sécurisé.</li>"
        "</ul>"
    ),
    "Seconde peau": (
        "<p>Connecté par interface neurale à un véhicule câblé, tu ajoutes les stats du véhicule à tes jets :</p>"
        "<ul>"
        "<li><em>Agir sous pression</em> : 2d6 + Cran + Puissance</li>"
        "<li><em>Employer la manière forte</em> : 2d6 + Synth + Puissance (au lieu de Chair)</li>"
        "<li><em>Montrer les dents</em> : 2d6 + Pro + Aspect</li>"
        "<li><em>Aider ou interférer</em> : 2d6 + Liens + Puissance</li>"
        "<li>Si quelqu'un interfère avec toi, il ajoute le Défaut de ton véhicule à son jet.</li>"
        "</ul>"
    ),
    "Ramener au bercail": (
        "<p>Quand tu poses une question avec <em>Un million de points lumineux</em>, pose une question supplémentaire.</p>"
        "<p>Sur une réussite avec <em>Visionnaire</em>, gagne 1 retenue additionnelle.</p>"
    ),
    "Un million de points lumineux": (
        "<p>Sur un succès avec <em>Visionnaire</em>, pose l'une des questions suivantes. Tu peux dépenser des retenues pour en poser d'autres :</p>"
        "<ul>"
        "<li>Que souhaiterais-tu que je fasse ?</li>"
        "<li>Comment es-tu vulnérable ?</li>"
        "<li>Dis-tu la vérité ?</li>"
        "<li>Qu'as-tu l'intention de faire ?</li>"
        "<li>En quoi es-tu relié aux événements actuels ?</li>"
        "<li>Que désires-tu le plus ?</li>"
        "</ul>"
    ),
    "Rassembler les preuves": (
        "<p>Réunis les preuves pour publier un scoop, lance 2d6+Esprit.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : Preuves obtenues, avance le Compte à rebours d'Affaire.</li>"
        "<li><em>7-9</em> : Preuves obtenues mais tu révèles tes atouts. Choisis quelle horloge avancer : Corporation, Tapage de cette affaire, ou Mission (Investigation/Action).</li>"
        "<li><em>6-</em> : Le MC avance le Compte à rebours de Tapage et fait une Manœuvre.</li>"
        "</ul>"
        "<p><strong>Règles d'opposition</strong> :</p>"
        "<ul>"
        "<li>Affaire atteint 24h00 en premier : scoop publié, impact majeur.</li>"
        "<li>Tapage atteint 24h00 en premier : affaire étouffée, les corpos s'occupent de toi.</li>"
        "</ul>"
    ),
    "Voici le plan": (
        "<p>Quand tu planifies une Mission, toute personne à qui tu assignes une tâche gagne +1 continu tant qu'elle l'accomplit conformément au plan.</p>"
        "<p>Un raté ou une déviation fait perdre le bonus.</p>"
        "<p>Si tu te fais payer, gagne en expérience.</p>"
    ),
    "Recruteur": (
        "<p>Recrute un spécialiste ou une équipe pour t'assister durant la Mission, lance 2d6+Pro.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : Choisis 2 options.</li>"
        "<li><em>7-9</em> : Choisis 1 option.</li>"
        "<li><em>6-</em> : Échec.</li>"
        "</ul>"
        "<p><strong>Options disponibles</strong> :</p>"
        "<ul>"
        "<li>Il s'agit de professionnel(s) sûr(s).</li>"
        "<li>C'est une petite équipe (jusqu'à 5 membres).</li>"
        "<li>Il(s) a(ont) le niveau de compétence requis.</li>"
        "</ul>"
    ),
    "Solution de repli": (
        "<p>Quand il y a de la merde dans le ventilo et que tu dois te faire la malle, lance 2d6+Esprit.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : Tu t'échappes en abandonnant 1 élément de la liste.</li>"
        "<li><em>7-9</em> : Tu t'échappes en abandonnant 2 éléments de la liste.</li>"
        "<li><em>6-</em> : Échec critique.</li>"
        "</ul>"
        "<p><strong>Éléments à abandonner</strong> :</p>"
        "<ul>"
        "<li>Ton équipe.</li>"
        "<li>Un objectif de mission.</li>"
        "<li>Des preuves concernant ton identité.</li>"
        "<li>Les Cred que tu as misés.</li>"
        "</ul>"
    ),
    "Expert": (
        "<p>Choisis une sphère d'expertise :</p>"
        "<ul>"
        "<li><em>Armurier</em> : Débute avec la manœuvre Arme personnalisée du Tueur.</li>"
        "<li><em>Artificier</em> : Ignore l'étiquette +dangereux des explosifs.</li>"
        "<li><em>Cybernéticien</em> : Débute avec un implant cybernétique gratuit supplémentaire.</li>"
        "<li><em>Électronicien</em> : Console matricielle (5 pts, max 2/score) et processeur+1 programmes.</li>"
        "<li><em>Mécano</em> : Deux drones construits selon la manœuvre Opérateur de drones du Pilote.</li>"
        "<li><em>Médecin</em> : Premiers soins : soigne un segment additionnel, même sur un raté.</li>"
        "</ul>"
    ),
    "Œil exercé": (
        "<p>Jauge un individu, véhicule, drone ou gang, lance 2d6+Cran.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : Demande « Comment m'es-tu vulnérable ? », gagne +1 sur le prochain jet qui utilise la réponse, et +1 continu quand tu agis contre cette cible.</li>"
        "<li><em>7-9</em> : Demande « Comment m'es-tu vulnérable ? » et gagne +1 sur le prochain jet qui utilise la réponse.</li>"
        "<li><em>6-</em> : Échec.</li>"
        "</ul>"
    ),
}

# Fixes for moves that have partial results but no failure/7-9 in the right key
PLAYBOOK_RESULT_FIXES = {
    "Guerre psychologique": {
        "partial": {"key": "partial", "label": "7-9", "value": "<p>Le MC choisit : excessivement prudents, effrayés et démoralisés, ou en colère et négligents.</p>"},
    },
    "Chasseur de gros gibier": {
        "partial": {"key": "partial", "label": "7-9", "value": "<p>Tu l'as prise au piège, la seule issue passe par toi.</p>"},
    },
    "Œil exercé": {
        "partial": {"key": "partial", "label": "7-9", "value": "<p>Demande « Comment m'es-tu vulnérable ? » et gagne +1 sur le prochain jet qui utilise la réponse.</p>"},
    },
}

# ============================================================
# 2. BASIC MOVES — UPDATES
# ============================================================

BASIC_DESC_UPDATES = {
    "Aider ou Interférer": (
        "<p>Quand tu aides ou entraves un autre personnage, lance 2d6+Liens.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>7+</em> : La cible gagne +1 (aide) ou -2 (interférence). Tu n'es pas inquiété.</li>"
        "<li><em>7-9</em> : Comme ci-dessus, mais tu es impliqué dans le résultat (danger, prix, représailles).</li>"
        "<li><em>6-</em> : Échec ; le MC effectue une Manœuvre directement contre toi.</li>"
        "</ul>"
    ),
    "Baratiner": (
        "<p>Quand tu convaincs quelqu'un par promesses, mensonges ou paroles en l'air, lance 2d6+Style.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : Les PNJ font ce que tu veux. Face à des PJ, ils choisissent : ils obéissent (gagnent XP) ou refusent (doivent agir sous pression).</li>"
        "<li><em>7-9</em> : Les PNJ obéissent mais quelqu'un s'en rend compte. Face à des PJ, choisis : carotte (XP s'ils obéissent) ou bâton (agir sous pression s'ils refusent).</li>"
        "<li><em>6-</em> : Échec ; la supercherie est percée à jour.</li>"
        "</ul>"
    ),
    "Blessure": (
        "<p>Quand tu subis des dégâts, retranche l'armure, coche les segments, lance 2d6+dégâts subis.</p>"
        "<p><em>Note : jet inversé — les scores faibles sont favorables.</em></p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>6-</em> : Tu encaisses le choc sans complication.</li>"
        "<li><em>7-9</em> : Le MC choisit : perds pied, perds prise, perds trace, ou qqn prend le dessus.</li>"
        "<li><em>10+</em> : Tu choisis : hors-de-combat, dégâts complets, cybernétique perdue, ou membre perdu.</li>"
        "</ul>"
    ),
    "Effectuer une recherche": (
        "<p>Quand tu enquêtes sur une personne, lieu, objet ou service, pose une question et lance 2d6+Esprit.</p>"
        "<p><strong>Questions disponibles</strong> :</p>"
        "<ul>"
        "<li>Où pourrais-je trouver ______ ?</li>"
        "<li>À quel point ______ est sécurisé ?</li>"
        "<li>Qui est ou quoi est relié à ______ ?</li>"
        "<li>Qui a possédé ou employé ______ ?</li>"
        "<li>Pour qui ou pour quoi ______ est le plus précieux ?</li>"
        "<li>Quelle relation unit ______ et ______ ?</li>"
        "</ul>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : [info] + réponse + question supplémentaire.</li>"
        "<li><em>7-9</em> : [info] + réponse.</li>"
        "<li><em>6-</em> : Réponse… mais le MC effectue une Manœuvre.</li>"
        "</ul>"
    ),
    "Montrer les dents": (
        "<p>Quand tu menaces de violence et es prêt à exécuter, lance 2d6+Pro.</p>"
        "<p><strong>Résultats</strong> :</p>"
        "<ul>"
        "<li><em>10+</em> : Les PNJ obéissent. Les PJ choisissent : obéir ou subir les conséquences.</li>"
        "<li><em>7-9</em> : Face à des PNJ, le MC choisit : ils tentent de te supprimer, ils obéissent mais veulent se venger, ou ils obéissent mais en parlent. Face à des PJ : ils choisissent et gagnent +1 sur leur prochain jet contre toi.</li>"
        "<li><em>6-</em> : Échec ; la cible réagit agressivement.</li>"
        "</ul>"
    ),
}

# rollType fixes: formula → ask
ROLLTYPE_ASK = ["Aider ou Interférer", "Blessure", "Passer sur le billard", "Se faire payer"]

# Aider ou Interférer: result tiers should be 7+ (success at 7+), 7-9 (partial), 6- (failure)
# In pbta system, the move has "success" at 7+ (not 10+), meaning any 7+ gives the bonus
AIDER_RESULTS = {
    "success": {"key": "success", "label": "7+", "value": "<p>La cible gagne +1 (aide) ou -2 (interférence). Tu n'es pas inquiété.</p>"},
    "partial": {"key": "partial", "label": "7-9", "value": "<p>Comme ci-dessus, mais tu es impliqué dans le résultat (danger, prix, représailles).</p>"},
    "failure": {"key": "failure", "label": "6-", "value": "<p>Échec ; le MC effectue une Manœuvre directement contre toi.</p>"},
}

# ============================================================
# 3. EQUIPMENT CATEGORIES — add "program" category
# ============================================================
PROGRAM_ITEMS = [
    {"n": "Console matricielle", "t": "+matrice", "d": "Console de decking avec processeur, mémoire et programmes."},
    {"n": "Console d'infiltration", "t": "+matrice, +infiltration", "d": "Console spécialisée : Résistance 1, Pare-feu 1, Processeur 1, Furtivité 2. Avec Protection d'identité, Traitement de données, Verrouillage."},
    {"n": "Console matricielle (défensive)", "t": "+matrice, +défensive", "d": "Console défensive : Résistance 2, Pare-feu 2, Processeur 1, Furtivité 1. Avec 2 programmes."},
    {"n": "Console matricielle (performante)", "t": "+matrice, +performante", "d": "Console performante : Résistance 1, Pare-feu 1, Processeur 2, Furtivité 2. Avec 3 programmes."},
    {"n": "Programme : Alerte", "t": "+matrice, +programme", "d": "Sur un succès à Évaluer dans la Matrice, choisis 1 option supplémentaire."},
    {"n": "Programme : Défense", "t": "+matrice, +programme", "d": "Octroie +2 Pare-feu à la console."},
    {"n": "Programme : Disjoncteur de sécurité", "t": "+matrice, +programme", "d": "Coupe l'alimentation lors d'une attaque de Glace Noire (0 dégât, déconnexion, console HS)."},
    {"n": "Programme : Éjection", "t": "+matrice, +programme", "d": "+1 sur le prochain jet pour se débrancher de la Matrice."},
    {"n": "Programme : Filtre", "t": "+matrice, +programme", "d": "+1 continu pour Effectuer une recherche ou chercher des données dans un serveur sécurisé."},
    {"n": "Programme : Protection d'identité", "t": "+matrice, +programme", "d": "Octroie +2 Furtivité à la console."},
    {"n": "Programme : Routines optimisées", "t": "+matrice, +programme", "d": "Octroie +2 Processeur à la console."},
    {"n": "Programme : Traitement de données", "t": "+matrice, +programme", "d": "Sur un succès à Manipuler un système, retiens 1 supplémentaire."},
    {"n": "Programme : Verrouillage", "t": "+matrice, +programme", "d": "Sur un succès à Compromettre la sécurité, retiens 1 supplémentaire."},
]

def fix_all():
    print(f"{'=' * 60}")
    print(f"  CORRECTIONS v1.2.3 — The Sprawl [FR]")
    print(f"{'=' * 60}")

    # ============================================================
    # DATA MOVES
    # ============================================================
    with open(DATA_MOVES, 'r', encoding='utf-8') as f:
        moves = json.load(f)

    changes = 0

    for move in moves['moves']:
        name = move['name']
        sysd = move['system']
        modified = False

        # --- rollType: formula → ask
        if name in ROLLTYPE_ASK:
            if sysd['rollType'] != 'ask':
                sysd['rollType'] = 'ask'
                print(f"  ✅ ROLL «{name}» : formula → ask")
                modified = True

        # --- Special: Aider ou Interférer results
        if name == 'Aider ou Interférer':
            sysd['moveResults'] = AIDER_RESULTS
            modified = True
            print(f"  ✅ RÉSULTATS «{name}» : corrigés (7+ = succès, 7-9 = partiel)")

        # --- Description updates
        if name in BASIC_DESC_UPDATES:
            new_desc = BASIC_DESC_UPDATES[name]
            if sysd.get('description') != new_desc:
                sysd['description'] = new_desc
                print(f"  ✅ DESC «{name}» : description mise à jour")
                modified = True

        if name in PLAYBOOK_DESC_UPDATES:
            new_desc = PLAYBOOK_DESC_UPDATES[name]
            if sysd.get('description') != new_desc:
                sysd['description'] = new_desc
                print(f"  ✅ DESC «{name}» : description mise à jour")
                modified = True

        # --- Specific result fixes
        if name in PLAYBOOK_RESULT_FIXES:
            mr = sysd.get('moveResults', {})
            for tier, data in PLAYBOOK_RESULT_FIXES[name].items():
                mr[tier] = data
            sysd['moveResults'] = mr
            modified = True
            print(f"  ✅ RÉSULTATS «{name}» : paliers corrigés")

        if modified:
            changes += 1

    with open(DATA_MOVES, 'w', encoding='utf-8') as f:
        json.dump(moves, f, indent=2, ensure_ascii=False)

    print(f"\n  {changes} manœuvres modifiées dans moves.json")

    # ============================================================
    # DATA EQUIPMENT — add program category
    # ============================================================
    with open(DATA_EQUIP, 'r', encoding='utf-8') as f:
        equip = json.load(f)

    # Remove console items from gear and vehicles (they'll be in programs)
    console_names = ['Console matricielle', 'Console d\'infiltration']
    vehicle_console_names = ['Console matricielle (défensive)', 'Console matricielle (performante)']
    
    equip['equipment']['gear'] = [g for g in equip['equipment']['gear'] if g['n'] not in console_names]
    equip['equipment']['vehicles'] = [v for v in equip['equipment']['vehicles'] if v['n'] not in vehicle_console_names]

    # Add programs category
    equip['equipment']['programs'] = PROGRAM_ITEMS
    equip['categories']['programs'] = len(PROGRAM_ITEMS)
    print(f"\n  ✅ CATÉGORIES : {len(PROGRAM_ITEMS)} programmes ajoutés")

    # Update total
    total = sum(len(v) for v in equip['equipment'].values())
    print(f"  Total équipements : {total}")

    with open(DATA_EQUIP, 'w', encoding='utf-8') as f:
        json.dump(equip, f, indent=2, ensure_ascii=False)

    # ============================================================
    # BUILD SCRIPT — update colors and EQ_TYPE_MAP
    # ============================================================
    with open(BUILD_SCRIPT, 'r', encoding='utf-8') as f:
        build = f.read()

    # Update folder colors: #ff6b35 (orange flashy) → #6366f1 (indigo lisible)
    # Keep basic/matrix folders with their colors
    build = build.replace("color: '#ff6b35'", "color: '#6366f1'")
    
    # Add 'programs' to EQ_TYPE_MAP
    build = build.replace(
        "const EQ_TYPE_MAP = { weapons: 'weapon', armors: 'armor', gear: 'gear', cyberware: 'cyberware', vehicles: 'vehicle' };",
        "const EQ_TYPE_MAP = { weapons: 'weapon', armors: 'armor', gear: 'gear', cyberware: 'cyberware', vehicles: 'vehicle', programs: 'program' };"
    )

    print(f"  ✅ COULEURS : dossiers #ff6b35 → #6366f1 (indigo lisible)")
    print(f"  ✅ EQ_TYPE_MAP : programs ajouté")

    with open(BUILD_SCRIPT, 'w', encoding='utf-8') as f:
        f.write(build)

    print(f"\n✅ Terminé !")

if __name__ == '__main__':
    fix_all()