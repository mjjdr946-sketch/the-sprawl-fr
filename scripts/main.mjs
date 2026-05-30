/* ------------------------------------ */
/*           THE SPRAWL [FR]            */
/* ------------------------------------ */

const sprawlToml = `
# CONFIGURATION GLOBAL
rollFormula = "2d6"
statToggle = true

[rollResults]
  [rollResults.failure]
    range = "6-"
    label = "Échec / Réaction"
  [rollResults.partial]
    range = "7-9"
    label = "Succès partiel"
  [rollResults.success]
    range = "10+"
    label = "Succès !"

# --- PERSONNAGE ---
[character]
  [character.stats]
    cool = "Cool"
    hard = "Cran"
    meat = "Viande"
    mind = "Cerveau"
    style = "Style"
    synth = "Synthé"

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

  [character.attributesLeft]
    [character.attributesLeft.look]
      label = "Look / Style"
      type = "LongText"
    [character.attributesLeft.directives]
      label = "Directives"
      type = "LongText"
    [character.attributesLeft.info]
      label = "[Info]"
      type = "Resource"
      max = 5
    [character.attributesLeft.matos]
      label = "[Matos]"
      type = "Resource"
      max = 5

  [character.moveTypes]
    basic = "Manoeuvres de base"
    playbook = "Livret"
    matrix = "Matrice"
    mission = "Mission"
    reputation = "Réputation"
`;

/* ------------------------------------ */
/*           INITIALISATION             */
/* ------------------------------------ */

// 1. DÉSACTIVATION DE L'OVERRIDE MANUEL 
// Si cette option est sur TRUE, Foundry ignore les modules. On la force à FALSE.
Hooks.once("ready", async function() {
    if (game.settings.get("pbta", "sheetConfigOverride")) {
        console.log("THE SPRAWL | Désactivation de la configuration manuelle pour activer le module.");
        await game.settings.set("pbta", "sheetConfigOverride", false);
        // On recharge pour que le changement prenne effet
        foundry.utils.debouncedReload();
    }
});

// 2. INJECTION PURE (MÉTHODE MASKS)
// Le système nous donne l'objet "sheetConfig", on le modifie directement.
Hooks.once('pbtaSheetConfig', (sheetConfig) => {
    console.log("THE SPRAWL | Chargement de la matrice du système...");

    // C'est ICI que la différence se fait : on assigne, on ne return pas.
    sheetConfig.label = "The Sprawl";
    sheetConfig.tomlString = sprawlToml;
    
    console.log("THE SPRAWL | Matrice chargée.");
});
