const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function genId() { return crypto.randomBytes(8).toString("hex"); }

function safeName(s) {
  return s.normalize("NFC").replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 60);
}

const EQ_TYPE_MAP = { weapons: "weapon", armors: "armor", gear: "gear", cyberware: "cyberware", vehicles: "vehicle" };
const base = "/opt/data/the-sprawl-fr/packs";

function writeJSON(dir, data) {
  fs.mkdirSync(path.dirname(dir), { recursive: true });
  fs.writeFileSync(dir, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function makeStats() {
  return { systemId: "pbta", systemVersion: "1.2.0", coreVersion: "14.366",
    createdTime: Date.now(), modifiedTime: Date.now(), lastModifiedBy: "the-sprawl-fr",
    compendiumSource: null, duplicateSource: null, exportSource: null };
}

async function build() {
  for (const p of ["equipment", "moves", "playbooks"]) {
    const d = path.join(base, p);
    if (fs.existsSync(d)) fs.rmSync(d, { recursive: true });
    fs.mkdirSync(d, { recursive: true });
  }

  const eqData = JSON.parse(fs.readFileSync("/opt/data/the-sprawl-fr/data/equipment.json", "utf8"));
  const movesData = JSON.parse(fs.readFileSync("/opt/data/the-sprawl-fr/data/moves.json", "utf8"));

  // 1. ÉQUIPEMENT
  console.log("\n1. Équipement...");
  const eqFolderId = genId();
  const eqDir = path.join(base, "equipment", `Equipment_${eqFolderId}`);
  fs.mkdirSync(eqDir, { recursive: true });
  
  // _Folder.json
  writeJSON(path.join(eqDir, "_Folder.json"), {
    type: "Item", folder: null, name: "Equipment", color: "#00ff41", sorting: "a",
    _id: eqFolderId, description: "", sort: 100000, flags: {},
    _stats: makeStats(), _key: "!folders!" + eqFolderId
  });

  const equipStore = {};
  for (const [cat, items] of Object.entries(eqData.equipment)) {
    for (const item of items) {
      const _id = genId();
      equipStore[item.n] = _id;
      writeJSON(path.join(eqDir, safeName(item.n) + "_" + _id + ".json"), {
        _id, name: item.n, type: "equipment", img: "icons/svg/backpack.svg",
        folder: eqFolderId, sort: 0, ownership: { default: 2 }, flags: {},
        effects: [],
        _stats: makeStats(), _key: "!items!" + _id,
        system: { description: "<p>" + item.d + "</p>", equipmentType: EQ_TYPE_MAP[cat], quantity: 1, tags: item.t, uses: 0 }
      });
    }
  }
  console.log("  " + Object.keys(equipStore).length + " items");

  // 2. MANŒUVRES
  console.log("2. Manœuvres...");
  const mvFolderId = genId();
  const mvDir = path.join(base, "moves", `Moves_${mvFolderId}`);
  fs.mkdirSync(mvDir, { recursive: true });
  
  writeJSON(path.join(mvDir, "_Folder.json"), {
    type: "Item", folder: null, name: "Moves", color: "#ff6b35", sorting: "a",
    _id: mvFolderId, description: "", sort: 100000, flags: {},
    _stats: makeStats(), _key: "!folders!" + mvFolderId
  });

  const movesStore = {};
  for (const m of movesData.moves) {
    const _id = genId();
    movesStore[m.name] = _id;
    writeJSON(path.join(mvDir, safeName(m.name) + "_" + _id + ".json"), {
      _id, name: m.name, type: "move", img: "icons/svg/dice-target.svg",
      folder: mvFolderId, sort: 0, ownership: { default: 2 }, flags: {},
      effects: [],
      _stats: makeStats(), _key: "!items!" + _id,
      system: m.system
    });
  }
  console.log("  " + Object.keys(movesStore).length + " items");

  // 3. PLAYBOOKS
  console.log("3. Playbooks...");
  const pbFolderId = genId();
  const pbDir = path.join(base, "playbooks", `Playbooks_${pbFolderId}`);
  fs.mkdirSync(pbDir, { recursive: true });
  
  writeJSON(path.join(pbDir, "_Folder.json"), {
    type: "Item", folder: null, name: "Playbooks", color: "#00e5ff", sorting: "a",
    _id: pbFolderId, description: "", sort: 100000, flags: {},
    _stats: makeStats(), _key: "!folders!" + pbFolderId
  });

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
    tech: ["Pistolet de poche","Fusil d'assaut","Grenades à fragmentation","Grenades à gaz","Gilet de protection","Vêtements renforcés","Jumelles","Fourgon ou camion","Traumapatch","Relais de communication","Trousse à outils (Tech)","Atelier","Bras cybernétique (outils intégrés)"],
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

  for (const slug of Object.keys(allPbMoves)) {
    const s = pbStats[slug];
    const names = { fixeur:"Le Fixeur", hacker:"Le Hacker", infiltre:"L'Infiltré", limier:"Le Limier", pilote:"Le Pilote", provocateur:"Le Provocateur", reporter:"Le Reporter", soldat:"Le Soldat", tech:"Le Tech", tueur:"Le Tueur" };
    const name = names[slug];
    
    const moveChoices = (allPbMoves[slug] || []).map(n => {
      if (!movesStore[n]) { console.warn("  ⚠️ Move: " + n); return null; }
      return { uuid: movesStore[n], img: "icons/svg/dice-target.svg", granted: true, advancement: 0 };
    }).filter(Boolean);
    
    const equipChoices = (allPbEquip[slug] || []).map(n => {
      if (!equipStore[n]) { console.warn("  ⚠️ Equip: " + n); return null; }
      return { uuid: equipStore[n], img: "icons/svg/backpack.svg", granted: true, advancement: 0 };
    }).filter(Boolean);
    
    const choiceSets = [];
    if (moveChoices.length) choiceSets.push({ title: "Manœuvres de livret", desc: "Les manœuvres spécifiques à ce livret.", type: "multi", repeatable: false, grantOn: 0, advancement: 0, granted: false, choices: moveChoices });
    if (equipChoices.length) choiceSets.push({ title: "Équipement de départ", desc: "Armes, armures, cyberware et matériel.", type: "multi", repeatable: false, grantOn: 0, advancement: 0, granted: false, choices: equipChoices });

    const _id = genId();
    writeJSON(path.join(pbDir, safeName(name) + "_" + _id + ".json"), {
      _id, name, type: "playbook", img: "icons/svg/book.svg",
      folder: pbFolderId, sort: 0, ownership: { default: 2 }, flags: {},
      effects: [],
      _stats: makeStats(), _key: "!items!" + _id,
      system: {
        slug, actorType: "character", description: pbDesc[slug],
        stats: { edge: {label:"Pro",value:s.edge}, mind: {label:"Esprit",value:s.mind}, cool: {label:"Cran",value:s.cool}, synth: {label:"Synth",value:s.synth}, style: {label:"Style",value:s.style}, meat: {label:"Chair",value:s.meat} },
        statsDetail: s.detail, attributes: {}, choiceSets
      }
    });
    console.log("  " + name + ": " + moveChoices.length + " moves, " + equipChoices.length + " equip");
  }

  console.log("\n✅ Terminé !");
}

build().catch(e => { console.error("Erreur:", e.message); process.exit(1); });