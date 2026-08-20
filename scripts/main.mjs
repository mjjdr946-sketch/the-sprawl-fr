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

// ── DONNÉES DES MANŒUVRES ──
const ALL_MOVES_DATA = () => []; // Will be populated from JSON in the data folder

// ── DONNÉES DES ÉQUIPEMENTS ──
const ALL_EQUIP_DATA = () => [];

// ── DONNÉES DES PLAYBOOKS ──
const PLAYBOOK_DEFS = [];

/* ------------------------------------ */
/*           INITIALISATION             */
/* ------------------------------------ */

// Charger les données JSON depuis le module
async function loadData(path) {
  const url = `modules/the-sprawl-fr/${path}`;
  const resp = await fetch(url);
  return await resp.json();
}

// Peupler un compendium
async function populatePack(packId, items) {
  const pack = game.packs.get(packId);
  if (!pack) {
    console.error(`THE SPRAWL | Pack "${packId}" introuvable`);
    return 0;
  }
  
  // Vérifier si déjà peuplé
  const existing = await pack.getDocuments();
  if (existing.length > 0) {
    console.log(`THE SPRAWL | ${pack.metadata.label} déjà peuplé (${existing.length} items) ✓`);
    return existing.length;
  }

  // Déverrouiller le compendium pour permettre l'import
  const wasLocked = pack.locked;
  if (wasLocked) {
    await pack.configure({ locked: false });
    console.log(`THE SPRAWL | ${pack.metadata.label} déverrouillé ✓`);
  }

  console.log(`THE SPRAWL | Peuplement de ${pack.metadata.label}...`);
  let count = 0;
  
  for (const data of items) {
    try {
      const item = await Item.create(data, { temporary: true });
      await pack.importDocument(item);
      count++;
    } catch (err) {
      console.error(`THE SPRAWL | Erreur création ${data.name}:`, err);
    }
  }
  
  // Re-verrouiller si nécessaire
  if (wasLocked) {
    await pack.configure({ locked: true });
    console.log(`THE SPRAWL | ${pack.metadata.label} re-verrouillé ✓`);
  }

  console.log(`THE SPRAWL | ${count} items importés dans ${pack.metadata.label}`);
  return count;
}

// Hook principal : injection config + peuplement automatique
Hooks.once('pbtaSheetConfig', async () => {
  console.log("THE SPRAWL | Chargement de la matrice du système...");

  try {
    const parsed = game.pbta.utils.parseTomlString(sprawlToml);
    game.pbta.sheetConfig = game.pbta.utils.convertSheetConfig(parsed);
    await game.settings.set("pbta", "sheetConfigOverride", true);
    console.log("THE SPRAWL | Matrice chargée avec succès ✅");
  } catch (err) {
    console.error("THE SPRAWL | Erreur lors du chargement de la matrice :", err);
  }
});

// Peuplement automatique des compendiums au ready
Hooks.once('ready', async () => {
  console.log("THE SPRAWL | Vérification des compendiums...");

  try {
    // Charger les données JSON
    const movesData = await loadData('data/moves.json');
    const equipData = await loadData('data/equipment.json');
    const playbookData = await loadData('data/playbooks.json');

    // 1. Peupler équipement
    const equipItems = [];
    const eqTypeMap = { weapons: "weapon", armors: "armor", gear: "gear", cyberware: "cyberware", vehicles: "vehicle" };
    for (const [cat, items] of Object.entries(equipData.equipment)) {
      for (const item of items) {
        equipItems.push({
          name: item.n, type: "equipment",
          system: { description: `<p>${item.d}</p>`, equipmentType: eqTypeMap[cat], quantity: 1, tags: item.t, uses: 0 }
        });
      }
    }
    const eqCount = await populatePack("the-sprawl-fr.equipment", equipItems);

    // 2. Peupler manœuvres
    const moveItems = movesData.moves.map(m => ({
      name: m.name, type: "move",
      system: m.system
    }));
    const mvCount = await populatePack("the-sprawl-fr.moves", moveItems);

    // 3. Peupler playbooks
    // On doit d'abord récupérer les UUID des moves et équipements
    const movesPack = game.packs.get("the-sprawl-fr.moves");
    const equipPack = game.packs.get("the-sprawl-fr.equipment");
    const allMoves = await movesPack.getDocuments();
    const allEquip = await equipPack.getDocuments();
    
    const movesMap = {};
    for (const m of allMoves) movesMap[m.name] = m.uuid;
    const equipMap = {};
    for (const e of allEquip) equipMap[e.name] = e.uuid;

    // Data des playbooks
    const allPbMoves = {
      fixeur: ["Je connais du monde","Magouilles","Baron des rues","Chromé (Fixeur)","Face-à-face","Ingénieur technico-commercial","Injoignable","Jongler avec plusieurs balles","L'affaire du siècle","Le bruit qui court","Mielleux","Renforts","Réputation"],
      hacker: ["Branché (Hacker)","Cowboy informatique","Anonyme","Ceinture noire","Chromé (Hacker)","Cicatrices neurales","Optimisation de recherche","Programmation à la volée","Renom (Hacker)","Support technique","Tueur de Glace"],
      infiltre: ["Entrée subreptice","Haute voltige","Imposteur","Agent furtif","Assassin","Branché (Infiltré)","Chromé (Infiltré)","Guerre psychologique","Maître des artifices","Mère Gigogne","Plan B","Repérage"],
      limier: ["Mais c'est bien sûr !","Toujours à l'écoute","Agrandissement, stop","Chasseur de gros gibier","Chromé (Limier)","Le sens de l'observation","Remonter la trace","Sale rat","Sous tous les angles","Théâtre d'opération humain","Tireur embusqué"],
      pilote: ["Caisse","Seconde peau","Belle bagnole","Casse-cou","Chromé (Pilote)","De glace","L'outil adapté à la tâche","Opérateur de drones","Un œil dans le ciel","Un putain d'as du volant"],
      provocateur: ["Déterminé","Visionnaire","Adeptes","Agitateur","Beau parleur","Célèbre","Cercle intérieur","Chromé (Provocateur)","Opportuniste","Ramener au bercail","Sociable","Un million de points lumineux"],
      reporter: ["Du flair pour les nouvelles","En direct live","Rassembler les preuves","24 heures sur 24, 7 jours sur 7","Carte de presse","Chromé (Reporter)","Correspondant de guerre","Fouille-merde","Pitbull","Sources sûres"],
      soldat: ["J'adore quand un plan se déroule sans accroc","Voici le plan","Aura de professionnalisme","Chromé (Soldat)","Gestion directe","Glissant comme une anguille","Opérations tactiques","Présence rassurante","Recruteur","Savoirs corporatifs (Soldat)","Solution de repli"],
      tech: ["Bidouilleur","Bric-à-brac","Expert","Analytique","Chromé (Tech)","Court-circuitage","Homme de la Renaissance","Intérêts diversifiés","Je suis sur le coup","Obsessionnel","Se fondre dans la masse (Tech)","Touche-à-tout"],
      tueur: ["Arme personnalisée","Armé jusqu'aux dents","Dépourvu de sentiments","Dur à cuire","Membre des Forces Spéciales","Œil exercé","Passé militaire (Tueur)","Plus machine qu'homme","Regard de dur","Secrets corporatifs (Tueur)"]
    };
    const allPbEquip = {
      fixeur: ["Pistolet de poche","Pistolet semi-automatique","Gilet de protection","Vêtements renforcés","Véhicule +voyant","Traumapatch","Matériel de communication +encryptée"],
      hacker: ["Pistolet à fléchettes","Pistolet-mitrailleur","Gilet de protection","Vêtements renforcés","Réfrigérateur blindé","Station microélectronique de réparation","Console matricielle (performante)","Interface neurale","Stockage de données"],
      infiltre: ["Fusil de précision","Pistolet-mitrailleur","Taser de poing","Pistolet-mitrailleur silencieux","Pistolet semi-automatique silencieux","Fouet à monofilament","Épée","Shuriken ou couteaux de lancer","Combinaison furtive","Kit de déguisement","Traumapatch","Console d'infiltration"],
      limier: ["Revolver de gros calibre","Pistolet de poche","Pistolet à fléchettes","Taser de poing","Fusil de précision","Gilet de protection","Vêtements renforcés","Berline +quelconque","Traumapatch","Lunettes (équipement)","Processeur tactique","Yeux cybernétiques"],
      pilote: ["Fusil de combat","Pistolet (Soldat)","Machette","Gilet de protection","Combinaison de cuir synthétique","Traumapatch","Interface neurale","Module de contrôle à distance","Véhicule câblé"],
      provocateur: ["Pistolet de poche","Pistolet à fléchettes","Pistolet semi-automatique","Combinaison de cuir synthétique","Vêtements renforcés","Véhicule +racé","Équipement d'enregistrement simsense","Instruments de musique","Relais de communication","Traumapatch","Lames rétractables","Arme à feu cachée","Fouet à monofilament","Implant interne d'assassinat"],
      reporter: ["Pistolet de poche","Pistolet à fléchettes","Taser de poing","Vêtements renforcés","Matériel de communication +encryptée","Matériel d'enregistrement","Lunettes (équipement)","Traumapatch"],
      soldat: ["Pistolet (Soldat)","Fusil d'assaut","Grenades à fragmentation","Grenades incapacitantes","Gilet de protection","Vêtements renforcés","Relais de communication","Jumelles","Traumapatch"],
      tech: ["Pistolet de poche","Fusil d'assaut","Grenades à fragmentation","Grenades à gaz","Gilet de protection","Vêtements renforcés","Jumelles","Fourgon ou camion","Traumapatch","Relais de communication","Trousse à outils (Tech)","Atelier"],
      tueur: ["Pistolet-mitrailleur silencieux","Fusil de combat","Revolver de gros calibre","Fusil d'assaut","Épée","Gilet pare-balles","Gilet de protection","Traumapatch","Moto +agressive","Lames rétractables","Arme à feu cachée","Fouet à monofilament","Implant interne d'assassinat","Armure dermique","Bras cybernétique (force augmentée)","Bras cybernétique (outils intégrés)","Bras cybernétique (arme intégrée)","Interface neurale","Logiciel de visée","Nerfs synthétiques","Yeux cybernétiques"]
    };
    const pbDesc = {
      fixeur: '<p><strong>« Tout a un prix. Tout se négocie. Et moi, je connais tout le monde. »</strong></p><p>Le Fixeur est la plaque tournante du marché noir.</p>',
      hacker: '<p><strong>« La Matrice, c\'est chez moi. »</strong></p><p>Le Hacker est un virtuose du cyberespace.</p>',
      infiltre: '<p><strong>« Les murs ont des oreilles. »</strong></p><p>L\'Infiltré est un fantôme.</p>',
      limier: '<p><strong>« La vérité finit toujours par te rattraper. »</strong></p><p>Le Limier est un enquêteur cyber-noir.</p>',
      pilote: '<p><strong>« La route est à moi. »</strong></p><p>Le Pilote ne fait qu\'un avec sa machine.</p>',
      provocateur: '<p><strong>« Les révolutions se gagnent avec des idées. »</strong></p><p>Le Provocateur est un meneur.</p>',
      reporter: '<p><strong>« La vérité est une denrée rare. »</strong></p><p>Le Reporter est un journaliste d\'investigation.</p>',
      soldat: '<p><strong>« On m\'a appris à survivre. »</strong></p><p>Ancien militaire, le Soldat est un atout tactique.</p>',
      tech: '<p><strong>« Si ça a des circuits, je peux le réparer. »</strong></p><p>Le Tech est un génie de la technologie.</p>',
      tueur: '<p><strong>« Je ne laisse pas de traces. »</strong></p><p>Le Tueur est une arme.</p>'
    };
    const pbStats = {
      fixeur: { edge:1, mind:0, cool:0, synth:0, style:2, meat:-1, detail:"+1 Pro, +0 Esprit, +0 Cran, +0 Synth, +2 Style, -1 Chair" },
      hacker: { edge:0, mind:2, cool:1, synth:1, style:0, meat:-1, detail:"+0 Pro, +2 Esprit, +1 Cran, +1 Synth, +0 Style, -1 Chair" },
      infiltre: { edge:1, mind:0, cool:2, synth:0, style:1, meat:-1, detail:"+1 Pro, +0 Esprit, +2 Cran, +0 Synth, +1 Style, -1 Chair" },
      limier: { edge:2, mind:1, cool:1, synth:0, style:0, meat:-1, detail:"+2 Pro, +1 Esprit, +1 Cran, +0 Synth, +0 Style, -1 Chair" },
      pilote: { edge:1, mind:0, cool:1, synth:0, style:2, meat:-1, detail:"+1 Pro, +0 Esprit, +1 Cran, +0 Synth, +2 Style, -1 Chair" },
      provocateur: { edge:0, mind:0, cool:1, synth:0, style:2, meat:-1, detail:"+0 Pro, +0 Esprit, +1 Cran, +0 Synth, +2 Style, -1 Chair" },
      reporter: { edge:2, mind:0, cool:1, synth:0, style:1, meat:-1, detail:"+2 Pro, +0 Esprit, +1 Cran, +0 Synth, +1 Style, -1 Chair" },
      soldat: { edge:2, mind:0, cool:1, synth:-1, style:0, meat:1, detail:"+2 Pro, +0 Esprit, +1 Cran, -1 Synth, +0 Style, +1 Chair" },
      tech: { edge:0, mind:2, cool:1, synth:1, style:0, meat:-1, detail:"+0 Pro, +2 Esprit, +1 Cran, +1 Synth, +0 Style, -1 Chair" },
      tueur: { edge:1, mind:-1, cool:0, synth:2, style:0, meat:1, detail:"+1 Pro, -1 Esprit, +0 Cran, +2 Synth, +0 Style, +1 Chair" }
    };
    const names = { fixeur:"Le Fixeur", hacker:"Le Hacker", infiltre:"L'Infiltré", limier:"Le Limier", pilote:"Le Pilote", provocateur:"Le Provocateur", reporter:"Le Reporter", soldat:"Le Soldat", tech:"Le Tech", tueur:"Le Tueur" };

    const pbItems = [];
    for (const slug of Object.keys(allPbMoves)) {
      const s = pbStats[slug];
      const moveChoices = (allPbMoves[slug] || []).map(n => movesMap[n] ? { uuid: movesMap[n], img: "icons/svg/dice-target.svg", granted: true, advancement: 0 } : null).filter(Boolean);
      const equipChoices = (allPbEquip[slug] || []).map(n => equipMap[n] ? { uuid: equipMap[n], img: "icons/svg/backpack.svg", granted: true, advancement: 0 } : null).filter(Boolean);
      const choiceSets = [];
      if (moveChoices.length) choiceSets.push({ title: "Manœuvres de livret", desc: "Les manœuvres spécifiques à ce livret.", type: "multi", repeatable: false, grantOn: 0, advancement: 0, granted: false, choices: moveChoices });
      if (equipChoices.length) choiceSets.push({ title: "Équipement de départ", desc: "Armes, armures, cyberware et matériel.", type: "multi", repeatable: false, grantOn: 0, advancement: 0, granted: false, choices: equipChoices });

      pbItems.push({
        name: names[slug], type: "playbook",
        system: {
          slug, actorType: "character", description: pbDesc[slug],
          stats: { edge: {label:"Pro",value:s.edge}, mind: {label:"Esprit",value:s.mind}, cool: {label:"Cran",value:s.cool}, synth: {label:"Synth",value:s.synth}, style: {label:"Style",value:s.style}, meat: {label:"Chair",value:s.meat} },
          statsDetail: s.detail, attributes: {}, choiceSets
        }
      });
    }
    const pbCount = await populatePack("the-sprawl-fr.playbooks", pbItems);

    console.log(`THE SPRAWL | ✅ Peuplement terminé : ${eqCount} équipements, ${mvCount} manœuvres, ${pbCount} livrets`);

  } catch (err) {
    console.error("THE SPRAWL | Erreur lors du peuplement :", err);
  }
});