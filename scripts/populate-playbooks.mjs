/* ------------------------------------------------------- */
/*   THE SPRAWL [FR] — POPULATE PLAYBOOKS                  */
/*   10 livrets avec liens vers les manœuvres              */
/*   À exécuter APRÈS populate-moves.mjs                   */
/* ------------------------------------------------------- */

// ── Le Fixeur ──
function createFixeur() {
  return {
    name: "Le Fixeur",
    type: "playbook",
    system: {
      slug: "fixeur",
      actorType: "character",
      description: `<p><strong>« Tout a un prix. Tout se négocie. Et moi, je connais tout le monde. »</strong></p><p>Le Fixeur est la plaque tournante du marché noir. Il connaît les bons contacts, les mauvaises personnes, et tout le monde entre les deux. Son réseau est son arme la plus puissante.</p>`,
      stats: {
        edge:  { label: "Pro", value: 1 },
        mind:  { label: "Esprit", value: 0 },
        cool:  { label: "Cran", value: 0 },
        synth: { label: "Synth", value: 0 },
        style: { label: "Style", value: 2 },
        meat:  { label: "Chair", value: -1 }
      },
      statsDetail: "+1 Pro, +0 Esprit, +0 Cran, +0 Synth, +2 Style, -1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── Le Hacker ──
function createHacker() {
  return {
    name: "Le Hacker",
    type: "playbook",
    system: {
      slug: "hacker",
      actorType: "character",
      description: `<p><strong>« La Matrice, c'est chez moi. Les murs de données, les IA, les Glaces… tout ça, c'est ma toile. Et je suis l'araignée. »</strong></p><p>Le Hacker est un virtuose du cyberespace, capable de traverser les systèmes les mieux protégés pour voler des données, manipuler des infrastructures ou neutraliser des IA.</p>`,
      stats: {
        edge:  { label: "Pro", value: 0 },
        mind:  { label: "Esprit", value: 2 },
        cool:  { label: "Cran", value: 1 },
        synth: { label: "Synth", value: 1 },
        style: { label: "Style", value: 0 },
        meat:  { label: "Chair", value: -1 }
      },
      statsDetail: "+0 Pro, +2 Esprit, +1 Cran, +1 Synth, +0 Style, -1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── L'Infiltré ──
function createInfiltre() {
  return {
    name: "L'Infiltré",
    type: "playbook",
    system: {
      slug: "infiltre",
      actorType: "character",
      description: `<p><strong>« Les murs ont des oreilles. Les plafonds ont des yeux. Et moi, je suis l'ombre entre les deux. »</strong></p><p>L'Infiltré est un fantôme. Là où les autres voient des murs infranchissables, des systèmes de verrouillage et des gardes, lui voit des chemins. Discret, méthodique et toujours un coup d'avance.</p>`,
      stats: {
        edge:  { label: "Pro", value: 1 },
        mind:  { label: "Esprit", value: 0 },
        cool:  { label: "Cran", value: 2 },
        synth: { label: "Synth", value: 0 },
        style: { label: "Style", value: 1 },
        meat:  { label: "Chair", value: -1 }
      },
      statsDetail: "+1 Pro, +0 Esprit, +2 Cran, +0 Synth, +1 Style, -1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── Le Limier ──
function createLimier() {
  return {
    name: "Le Limier",
    type: "playbook",
    system: {
      slug: "limier",
      actorType: "character",
      description: `<p><strong>« Tu peux courir, te cacher, payer des gens pour qu'ils mentent à ta place… la vérité finit toujours par te rattraper. Et moi, je suis juste la personne qui arrive en premier. »</strong></p><p>Le Limier est un enquêteur cyber-noir. Observation méthodique, déduction implacable, il compense son manque de force brute par une intelligence aiguisée.</p>`,
      stats: {
        edge:  { label: "Pro", value: 2 },
        mind:  { label: "Esprit", value: 1 },
        cool:  { label: "Cran", value: 1 },
        synth: { label: "Synth", value: 0 },
        style: { label: "Style", value: 0 },
        meat:  { label: "Chair", value: -1 }
      },
      statsDetail: "+2 Pro, +1 Esprit, +1 Cran, +0 Synth, +0 Style, -1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── Le Pilote ──
function createPilote() {
  return {
    name: "Le Pilote",
    type: "playbook",
    system: {
      slug: "pilote",
      actorType: "character",
      description: `<p><strong>« La route est à moi. Le ciel aussi, si j'ai assez de carburant. »</strong></p><p>Le Pilote ne fait qu'un avec sa machine. Que ce soit au volant, aux commandes ou au guidon, il est le meilleur dans ce qu'il fait. Sans lui, pas d'extraction. Sans lui, pas d'équipe.</p>`,
      stats: {
        edge:  { label: "Pro", value: 1 },
        mind:  { label: "Esprit", value: 0 },
        cool:  { label: "Cran", value: 1 },
        synth: { label: "Synth", value: 0 },
        style: { label: "Style", value: 2 },
        meat:  { label: "Chair", value: -1 }
      },
      statsDetail: "+1 Pro, +0 Esprit, +1 Cran, +0 Synth, +2 Style, -1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── Le Provocateur ──
function createProvocateur() {
  return {
    name: "Le Provocateur",
    type: "playbook",
    system: {
      slug: "provocateur",
      actorType: "character",
      description: `<p><strong>« Les révolutions ne se gagnent pas avec des armes. Elles se gagnent avec des idées. Et j'ai les meilleures idées. »</strong></p><p>Le Provocateur est un meneur, un idéaliste ou un démagogue — parfois les trois à la fois. Sa force ne réside pas dans ses poings mais dans sa capacité à émouvoir, convaincre et rassembler.</p>`,
      stats: {
        edge:  { label: "Pro", value: 0 },
        mind:  { label: "Esprit", value: 0 },
        cool:  { label: "Cran", value: 1 },
        synth: { label: "Synth", value: 0 },
        style: { label: "Style", value: 2 },
        meat:  { label: "Chair", value: -1 }
      },
      statsDetail: "+0 Pro, +0 Esprit, +1 Cran, +0 Synth, +2 Style, -1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── Le Reporter ──
function createReporter() {
  return {
    name: "Le Reporter",
    type: "playbook",
    system: {
      slug: "reporter",
      actorType: "character",
      description: `<p><strong>« La vérité est une denrée rare dans ce monde. Je suis là pour m'assurer qu'elle ne disparaisse pas complètement. »</strong></p><p>Le Reporter est un journaliste d'investigation prêt à tout pour publier le scoop qui fera tomber les puissants. Entre la rue, les informateurs et les risques du métier, chaque mission est une histoire à écrire.</p>`,
      stats: {
        edge:  { label: "Pro", value: 2 },
        mind:  { label: "Esprit", value: 0 },
        cool:  { label: "Cran", value: 1 },
        synth: { label: "Synth", value: 0 },
        style: { label: "Style", value: 1 },
        meat:  { label: "Chair", value: -1 }
      },
      statsDetail: "+2 Pro, +0 Esprit, +1 Cran, +0 Synth, +1 Style, -1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── Le Soldat ──
function createSoldat() {
  return {
    name: "Le Soldat",
    type: "playbook",
    system: {
      slug: "soldat",
      actorType: "character",
      description: `<p><strong>« On m'a appris à me battre, à survivre et à suivre les ordres. Maintenant, je choisis mes missions. Et je choisis mon équipe. »</strong></p><p>Ancien militaire, le Soldat a troqué l'uniforme contre le cred. Son expertise tactique et son sang-froid font de lui l'atout indispensable de toute opération.</p>`,
      stats: {
        edge:  { label: "Pro", value: 2 },
        mind:  { label: "Esprit", value: 0 },
        cool:  { label: "Cran", value: 1 },
        synth: { label: "Synth", value: -1 },
        style: { label: "Style", value: 0 },
        meat:  { label: "Chair", value: 1 }
      },
      statsDetail: "+2 Pro, +0 Esprit, +1 Cran, -1 Synth, +0 Style, +1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── Le Tech ──
function createTech() {
  return {
    name: "Le Tech",
    type: "playbook",
    system: {
      slug: "tech",
      actorType: "character",
      description: `<p><strong>« Si ça a des circuits, je peux le réparer. Si ça n'en a pas, je peux en ajouter. »</strong></p><p>Le Tech est un génie de la technologie. Armurier, médecin, mécanicien, cybernéticien, électronicien ou artificier — peu importe sa spécialité, il est celui qui fait fonctionner les choses.</p>`,
      stats: {
        edge:  { label: "Pro", value: 0 },
        mind:  { label: "Esprit", value: 2 },
        cool:  { label: "Cran", value: 1 },
        synth: { label: "Synth", value: 1 },
        style: { label: "Style", value: 0 },
        meat:  { label: "Chair", value: -1 }
      },
      statsDetail: "+0 Pro, +2 Esprit, +1 Cran, +1 Synth, +0 Style, -1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── Le Tueur ──
function createTueur() {
  return {
    name: "Le Tueur",
    type: "playbook",
    system: {
      slug: "tueur",
      actorType: "character",
      description: `<p><strong>« Je ne pose pas de questions. Je ne laisse pas de traces. Je termine le boulot. »</strong></p><p>Le Tueur est une arme. Pas un soldat, pas un garde — une arme. Loué pour le sale boulot, il est l'incarnation de l'efficacité létale. Sa réputation le précède, son silence le suit.</p>`,
      stats: {
        edge:  { label: "Pro", value: 1 },
        mind:  { label: "Esprit", value: -1 },
        cool:  { label: "Cran", value: 0 },
        synth: { label: "Synth", value: 2 },
        style: { label: "Style", value: 0 },
        meat:  { label: "Chair", value: 1 }
      },
      statsDetail: "+1 Pro, -1 Esprit, +0 Cran, +2 Synth, +0 Style, +1 Chair",
      attributes: {},
      choiceSets: []
    }
  };
}

// ── MAPPING LIVRET → MANŒUVRES ──
const PLAYBOOK_MOVE_MAP = {
  "fixeur": ["Je connais du monde", "Magouilles", "Baron des rues", "Chromé (Fixeur)", "Face-à-face", "Ingénieur technico-commercial", "Injoignable", "Jongler avec plusieurs balles", "L'affaire du siècle", "Le bruit qui court", "Mielleux", "Renforts", "Réputation"],
  "hacker": ["Branché (Hacker)", "Cowboy informatique", "Anonyme", "Ceinture noire", "Chromé (Hacker)", "Cicatrices neurales", "Optimisation de recherche", "Programmation à la volée", "Renom (Hacker)", "Support technique", "Tueur de Glace"],
  "infiltre": ["Entrée subreptice", "Haute voltige", "Imposteur", "Agent furtif", "Assassin", "Branché (Infiltré)", "Chromé (Infiltré)", "Guerre psychologique", "Maître des artifices", "Mère Gigogne", "Plan B", "Repérage"],
  "limier": ["Mais c'est bien sûr !", "Toujours à l'écoute", "Agrandissement, stop", "Chasseur de gros gibier", "Chromé (Limier)", "Le sens de l'observation", "Remonter la trace", "Sale rat", "Sous tous les angles", "Théâtre d'opération humain", "Tireur embusqué"],
  "pilote": ["Caisse", "Seconde peau", "Belle bagnole", "Casse-cou", "Chromé (Pilote)", "De glace", "L'outil adapté à la tâche", "Opérateur de drones", "Un œil dans le ciel", "Un putain d'as du volant"],
  "provocateur": ["Déterminé", "Visionnaire", "Adeptes", "Agitateur", "Beau parleur", "Célèbre", "Cercle intérieur", "Chromé (Provocateur)", "Opportuniste", "Ramener au bercail", "Sociable", "Un million de points lumineux"],
  "reporter": ["Du flair pour les nouvelles", "En direct live", "Rassembler les preuves", "24 heures sur 24, 7 jours sur 7", "Carte de presse", "Chromé (Reporter)", "Correspondant de guerre", "Fouille-merde", "Pitbull", "Sources sûres"],
  "soldat": ["J'adore quand un plan se déroule sans accroc", "Voici le plan", "Aura de professionnalisme", "Chromé (Soldat)", "Gestion directe", "Glissant comme une anguille", "Opérations tactiques", "Présence rassurante", "Recruteur", "Savoirs corporatifs (Soldat)", "Solution de repli"],
  "tech": ["Bidouilleur", "Bric-à-brac", "Expert", "Analytique", "Chromé (Tech)", "Court-circuitage", "Homme de la Renaissance", "Intérêts diversifiés", "Je suis sur le coup", "Obsessionnel", "Se fondre dans la masse (Tech)", "Touche-à-tout"],
  "tueur": ["Arme personnalisée", "Armé jusqu'aux dents", "Dépourvu de sentiments", "Dur à cuire", "Membre des Forces Spéciales", "Œil exercé", "Passé militaire (Tueur)", "Plus machine qu'homme", "Regard de dur", "Secrets corporatifs (Tueur)"]
};

// ── MAPPING LIVRET → ÉQUIPEMENT DE DÉPART ──
const PLAYBOOK_EQUIPMENT_MAP = {
  "fixeur": ["Pistolet de poche", "Pistolet semi-automatique", "Gilet de protection", "Vêtements renforcés", "Véhicule +voyant", "Traumapatch", "Matériel de communication +encryptée", "Cybercoms", "Interface neurale", "Yeux cybernétiques"],
  "hacker": ["Pistolet à fléchettes", "Pistolet-mitrailleur", "Gilet de protection", "Vêtements renforcés", "Réfrigérateur blindé", "Station microélectronique de réparation", "Console matricielle (performante)", "Console matricielle (défensive)", "Interface neurale", "Stockage de données"],
  "infiltre": ["Fusil de précision", "Pistolet-mitrailleur", "Taser de poing", "Pistolet-mitrailleur silencieux", "Pistolet semi-automatique silencieux", "Fouet à monofilament", "Épée", "Shuriken ou couteaux de lancer", "Combinaison furtive", "Kit de déguisement", "Matériel d'enregistrement", "Traumapatch", "Console d'infiltration", "Compétences câblées", "Interface neurale", "Nerfs synthétiques", "Oreilles cybernétiques", "Yeux cybernétiques"],
  "limier": ["Revolver de gros calibre", "Pistolet de poche", "Pistolet à fléchettes", "Taser de poing", "Fusil de précision", "Gilet de protection", "Vêtements renforcés", "Berline +quelconque", "Traumapatch", "Lunettes (équipement)", "Processeur tactique", "Yeux cybernétiques", "Compétences câblées", "Oreilles cybernétiques"],
  "pilote": ["Fusil de combat", "Pistolet (Soldat)", "Machette", "Gilet de protection", "Combinaison de cuir synthétique", "Traumapatch", "Interface neurale", "Module de contrôle à distance", "Véhicule câblé"],
  "provocateur": ["Pistolet de poche", "Pistolet à fléchettes", "Pistolet semi-automatique", "Combinaison de cuir synthétique", "Vêtements renforcés", "Véhicule +racé", "Équipement d'enregistrement simsense", "Instruments de musique", "Relais de communication", "Traumapatch", "Lames rétractables", "Arme à feu cachée", "Fouet à monofilament", "Implant interne d'assassinat", "Cybercoms", "Interface neurale", "Yeux cybernétiques"],
  "reporter": ["Pistolet de poche", "Pistolet à fléchettes", "Taser de poing", "Vêtements renforcés", "Matériel de communication +encryptée", "Matériel d'enregistrement", "Lunettes (équipement)", "Traumapatch", "Cybercoms", "Interface neurale", "Oreilles cybernétiques", "Yeux cybernétiques"],
  "soldat": ["Pistolet (Soldat)", "Fusil d'assaut", "Grenades à fragmentation", "Grenades incapacitantes", "Gilet de protection", "Vêtements renforcés", "Relais de communication", "Jumelles", "Traumapatch", "Compétences câblées", "Cybercoms", "Interface neurale", "Processeur tactique", "Yeux cybernétiques"],
  "tech": ["Pistolet de poche", "Fusil d'assaut", "Grenades à fragmentation", "Grenades à gaz", "Gilet de protection", "Vêtements renforcés", "Jumelles", "Fourgon ou camion", "Traumapatch", "Relais de communication", "Trousse à outils (Tech)", "Atelier", "Bras cybernétique (outils intégrés)", "Cybercoms", "Interface neurale", "Yeux cybernétiques"],
  "tueur": ["Pistolet-mitrailleur silencieux", "Fusil de combat", "Revolver de gros calibre", "Fusil d'assaut", "Épée", "Gilet pare-balles", "Gilet de protection", "Traumapatch", "Moto +agressive", "Lames rétractables", "Arme à feu cachée", "Fouet à monofilament", "Implant interne d'assassinat", "Armure dermique", "Bras cybernétique (force augmentée)", "Bras cybernétique (outils intégrés)", "Bras cybernétique (arme intégrée)", "Interface neurale", "Logiciel de visée", "Nerfs synthétiques", "Yeux cybernétiques"],
};

// ── GÉNÉRATION DE TOUS LES LIVRETS ──
function getAllPlaybooks() {
  const creators = [
    createFixeur,
    createHacker,
    createInfiltre,
    createLimier,
    createPilote,
    createProvocateur,
    createReporter,
    createSoldat,
    createTech,
    createTueur,
  ];
  return creators.map(c => c());
}

// ── LIER LES MANŒUVRES ET L'ÉQUIPEMENT AUX LIVRETS ──
async function linkPlaybookItems(pack, playbookItem, slug) {
  const choiceSets = [];

  // ── Lier les manœuvres ──
  const movesPack = game.packs.get("the-sprawl-fr.moves");
  if (movesPack) {
    const expectedMoves = PLAYBOOK_MOVE_MAP[slug];
    if (expectedMoves) {
      const allMoves = await movesPack.getDocuments();
      const moveUuids = {};
      for (const move of allMoves) moveUuids[move.name] = move.uuid;

      const found = [];
      for (const name of expectedMoves) {
        if (moveUuids[name]) {
          found.push({ uuid: moveUuids[name], img: "icons/svg/dice-target.svg", granted: true, advancement: 0 });
        } else {
          console.warn(`THE SPRAWL | ${slug} — manœuvre manquante: ${name}`);
        }
      }
      if (found.length > 0) {
        choiceSets.push({
          title: "Manœuvres de livret",
          desc: "Les manœuvres spécifiques à ce livret.",
          type: "multi",
          repeatable: false,
          grantOn: 0,
          advancement: 0,
          granted: false,
          choices: found
        });
      }
    }
  }

  // ── Lier l'équipement de départ ──
  const equipPack = game.packs.get("the-sprawl-fr.equipment");
  if (equipPack) {
    const expectedEquip = PLAYBOOK_EQUIPMENT_MAP[slug];
    if (expectedEquip) {
      const allEquip = await equipPack.getDocuments();
      const equipUuids = {};
      for (const eq of allEquip) equipUuids[eq.name] = eq.uuid;

      const found = [];
      for (const name of expectedEquip) {
        if (equipUuids[name]) {
          found.push({ uuid: equipUuids[name], img: "icons/svg/backpack.svg", granted: true, advancement: 0 });
        } else {
          console.warn(`THE SPRAWL | ${slug} — équipement manquant: ${name}`);
        }
      }
      if (found.length > 0) {
        choiceSets.push({
          title: "Équipement de départ",
          desc: "L'équipement et la cybernétique de départ.",
          type: "multi",
          repeatable: false,
          grantOn: 0,
          advancement: 0,
          granted: false,
          choices: found
        });
      }
    }
  }

  if (choiceSets.length > 0) {
    await playbookItem.update({ "system.choiceSets": choiceSets });
    console.log(`THE SPRAWL | ${slug} : ${choiceSets.map(c => c.choices.length + " " + c.title).join(", ")}`);
  }
}

// ── POPULATION ──
async function populatePlaybooks() {
  const packId = "the-sprawl-fr.playbooks";
  const pack = game.packs.get(packId);
  if (!pack) {
    ui.notifications.error(`Compendium "${packId}" introuvable.`);
    return;
  }

  const playbooks = getAllPlaybooks();
  console.log(`THE SPRAWL | ${playbooks.length} livrets à importer.`);

  // Vider l'ancien
  const existing = await pack.getDocuments();
  if (existing.length > 0) {
    await Document.deleteDocuments(existing.map(d => d.uuid));
  }

  let created = 0, failed = 0;
  for (const data of playbooks) {
    try {
      const item = await Item.create(data, { temporary: true });
      await pack.importDocument(item);

      // Vérifier après import : retrouver l'item dans le compendium
      const imported = await pack.getDocuments({ name: data.name });
      if (imported.length > 0) {
        await linkPlaybookItems(pack, imported[0], data.system.slug);
      }

      created++;
      console.log(`  ✅ ${data.name}`);
    } catch (err) {
      failed++;
      console.error(`  ❌ ${data.name} :`, err);
    }
  }

  console.log(`THE SPRAWL | ✅ ${created}/${created+failed} livrets importés.`);
  ui.notifications.info(`The Sprawl: ${created} livrets importés.`);
  return { created, failed };
}

populatePlaybooks().catch(err => {
  console.error("THE SPRAWL | Erreur :", err);
});