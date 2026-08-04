/* ------------------------------------ */
/*           THE SPRAWL [FR]            */
/*         Foundry VTT v14 + pbta       */
/* ------------------------------------ */

const sprawlToml = `# --- CONFIGURATION GÉNÉRALE ---
rollFormula = "2d6"
statToggle = true

[rollResults]
  [rollResults.failure]
    range = "6-"
    label = "Échec (Réaction du MC)"
  [rollResults.partial]
    range = "7-9"
    label = "Succès partiel / Glitch"
  [rollResults.success]
    range = "10+"
    label = "Succès !"

# ==========================================
#              PERSONNAGES (PJ)
# ==========================================
[character]

  # 1. STATISTIQUES (The Sprawl Stats)
  [character.stats]
    cool = "Cran"
    edge = "Pro"
    meat = "Chair"
    mind = "Esprit"
    style = "Style"
    synth = "Synth"

  # 2. BARRES DU HAUT (Top Attributes)
  [character.attributesTop]
    [character.attributesTop.harm]
      label = "Blessures"
      type = "Clock"
      max = 6
    [character.attributesTop.xp]
      label = "Expérience"
      type = "Xp"
      max = 10
    [character.attributesTop.cred]
      label = "Crédit"
      type = "Resource"
      max = 50
    [character.attributesTop.intel]
      label = "Rens."
      type = "Resource"
      max = 3

  # 3. COLONNE DE GAUCHE (Left Attributes)
  [character.attributesLeft]
    [character.attributesLeft.look]
      label = "Look / Style"
      type = "LongText"
    [character.attributesLeft.directives]
      label = "Directives"
      type = "LongText"
    [character.attributesLeft.retenue]
      label = "[Retenue]"
      type = "Resource"
      max = 3
    [character.attributesLeft.info]
      label = "[Info]"
      type = "Resource"
      max = 5
    [character.attributesLeft.matos]
      label = "[Matos]"
      type = "Resource"
      max = 5

  # 4. GROUPES DE MANŒUVRES (Moves)
  [character.moveTypes]
    basic = "Manoeuvres de base"
    playbook = "Livret"
    matrix = "Matrice"
    mission = "Mission"
    reputation = "Réputation"

  # 5. TYPES D'ÉQUIPEMENT (OBLIGATOIRE POUR ÉVITER L'ERREUR)
  [character.equipmentTypes]
    weapon = "Armes"
    armor = "Protection"
    gear = "Matériel"
    cyberware = "Cyberware"
    program = "Programmes"
    vehicle = "Véhicules"
    bond = "Liens"

# ==========================================
#              PNJ (NPC)
# ==========================================
# Cette section est OBLIGATOIRE sinon erreur "npc type requis"
[npc]
  
  [npc.attributesTop]
    [npc.attributesTop.harm]
      label = "Santé / Menace"
      type = "Clock"
      max = 10
    [npc.attributesTop.instinct]
      label = "Instinct"
      type = "Text"

  [npc.attributesLeft]
    [npc.attributesLeft.description]
      label = "Description"
      type = "LongText"

  [npc.moveTypes]
    gm = "Manoeuvres MC"

  [npc.equipmentTypes]
    weapon = "Armes"
    gear = "Matériel"
`;

/* ------------------------------------ */
/*           INITIALISATION             */
/* ------------------------------------ */

// INJECTION DE LA CONFIGURATION THE SPRAWL
// Le système pbta v1.2.0+ appelle le hook "pbtaSheetConfig" pendant son ready.
// On parse notre TOML et on injecte la config directement dans game.pbta.sheetConfig.
Hooks.once('pbtaSheetConfig', async () => {
    console.log("THE SPRAWL | Chargement de la matrice du système...");

    try {
        // Parser le TOML via l'utilitaire du système pbta
        const parsed = game.pbta.utils.parseTomlString(sprawlToml);
        // Convertir en config utilisable par les sheets
        game.pbta.sheetConfig = game.pbta.utils.convertSheetConfig(parsed);
        // Activer le override pour que la config persiste en session
        await game.settings.set("pbta", "sheetConfigOverride", true);

        console.log("THE SPRAWL | Matrice chargée avec succès ✅");
    } catch (err) {
        console.error("THE SPRAWL | Erreur lors du chargement de la matrice :", err);
    }
});