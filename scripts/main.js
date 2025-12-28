// Initialisation du module
Hooks.once('init', async function() {
    console.log("THE SPRAWL | Initialisation du protocole...");

    // On prévient Foundry qu'on utilise une configuration personnalisée pour le système PbtA
    game.settings.set("pbta", "sheetConfigOverride", true);
});

// Injection de la configuration TOML au moment où le système PbtA est prêt
Hooks.once('pbtaSheetConfig', async function() {
    console.log("THE SPRAWL | Injection des données TOML...");

    // Récupération du fichier TOML situé dans le dossier du module
    try {
        const tomlString = await fetch('modules/the-sprawl-foundry-module/sprawl.toml').then(r => r.text());
        
        // On renvoie la configuration au système
        return {
            tomlString: tomlString
        };
    } catch (e) {
        console.error("THE SPRAWL | Erreur de chargement du TOML :", e);
    }
});
