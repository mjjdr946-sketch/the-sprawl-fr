const { Level } = require('level');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function genId() { return crypto.randomBytes(8).toString('hex'); }
function slugify(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,''); }

async function readDB(dir) {
  const db = new Level(dir, { valueEncoding: 'json' });
  await db.open();
  const map = {};
  for await (const [key, value] of db.iterator()) {
    map[value.name] = { uuid: key, doc: value };
  }
  await db.close();
  return map;
}

async function writeDB(dir, items) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  fs.mkdirSync(dir, { recursive: true });
  const db = new Level(dir, { valueEncoding: 'json' });
  await db.open();
  for (const item of items) {
    await db.put(item._id, {
      _id: item._id, name: item.name, type: 'playbook', img: 'icons/svg/book.svg',
      folder: null, sort: 0, ownership: { default: 2 }, flags: {},
      _stats: { systemId: 'pbta', systemVersion: '1.2.0', coreVersion: '14.363',
        createdTime: Date.now(), modifiedTime: Date.now(), lastModifiedBy: 'the-sprawl-fr' },
      system: item.system
    });
  }
  await db.close();
  console.log(`  ${items.length} playbooks`);
}

async function main() {
  const base = '/opt/data/the-sprawl-fr/packs';
  const movesMap = await readDB(path.join(base, 'moves.db'));
  const equipMap = await readDB(path.join(base, 'equipment.db'));

  // DÃ©finition des playbooks avec leurs moves et equip
  const playbookDefs = [
    { slug: 'fixeur', name: 'Le Fixeur',
      desc: '<p><strong>« Tout a un prix. Tout se nÃ©gocie. Et moi, je connais tout le monde. »</strong></p><p>Le Fixeur est la plaque tournante du marchÃ© noir.</p>',
      stats: { edge: {label:'Pro',value:1}, mind: {label:'Esprit',value:0}, cool: {label:'Cran',value:0}, synth: {label:'Synth',value:0}, style: {label:'Style',value:2}, meat: {label:'Chair',value:-1} },
      statsDetail: '+1 Pro, +0 Esprit, +0 Cran, +0 Synth, +2 Style, -1 Chair',
      moves: ['Je connais du monde','Magouilles','Baron des rues','ChromÃ© (Fixeur)','Face-Ã -face','IngÃ©nieur technico-commercial','Injoignable','Jongler avec plusieurs balles','L\'affaire du siÃ¨cle','Le bruit qui court','Mielleux','Renforts','RÃ©putation'],
      equip: ['Pistolet de poche','Pistolet semi-automatique','Gilet de protection','VÃªtements renforcÃ©s','VÃ©hicule +voyant','Traumapatch','MatÃ©riel de communication +encryptÃ©e']
    },
    { slug: 'hacker', name: 'Le Hacker',
      desc: '<p><strong>« La Matrice, c\'est chez moi. »</strong></p><p>Le Hacker est un virtuose du cyberespace.</p>',
      stats: { edge: {label:'Pro',value:0}, mind: {label:'Esprit',value:2}, cool: {label:'Cran',value:1}, synth: {label:'Synth',value:1}, style: {label:'Style',value:0}, meat: {label:'Chair',value:-1} },
      statsDetail: '+0 Pro, +2 Esprit, +1 Cran, +1 Synth, +0 Style, -1 Chair',
      moves: ['BranchÃ© (Hacker)','Cowboy informatique','Anonyme','Ceinture noire','ChromÃ© (Hacker)','Cicatrices neurales','Optimisation de recherche','Programmation Ã  la volÃ©e','Renom (Hacker)','Support technique','Tueur de Glace'],
      equip: ['Pistolet Ã  flÃ©chettes','Pistolet-mitrailleur','Gilet de protection','VÃªtements renforcÃ©s','RÃ©frigÃ©rateur blindÃ©','Station microÃ©lectronique de rÃ©paration','Console matricielle (performante)','Interface neurale','Stockage de donnÃ©es']
    },
    { slug: 'infiltre', name: 'L\'InfiltrÃ©',
      desc: '<p><strong>« Les murs ont des oreilles. »</strong></p><p>L\'InfiltrÃ© est un fantÃ´me.</p>',
      stats: { edge: {label:'Pro',value:1}, mind: {label:'Esprit',value:0}, cool: {label:'Cran',value:2}, synth: {label:'Synth',value:0}, style: {label:'Style',value:1}, meat: {label:'Chair',value:-1} },
      statsDetail: '+1 Pro, +0 Esprit, +2 Cran, +0 Synth, +1 Style, -1 Chair',
      moves: ['EntrÃ©e subreptice','Haute voltige','Imposteur','Agent furtif','Assassin','BranchÃ© (InfiltrÃ©)','ChromÃ© (InfiltrÃ©)','Guerre psychologique','MaÃ®tre des artifices','MÃ¨re Gigogne','Plan B','RepÃ©rage'],
      equip: ['Fusil de prÃ©cision','Pistolet-mitrailleur','Taser de poing','Pistolet-mitrailleur silencieux','Pistolet semi-automatique silencieux','Fouet Ã  monofilament','Ã‰pÃ©e','Shuriken ou couteaux de lancer','Combinaison furtive','Kit de dÃ©guisement','Traumapatch','Console d\'infiltration']
    },
    { slug: 'limier', name: 'Le Limier',
      desc: '<p><strong>« La vÃ©ritÃ© finit toujours par te rattraper. »</strong></p><p>Le Limier est un enquÃªteur cyber-noir.</p>',
      stats: { edge: {label:'Pro',value:2}, mind: {label:'Esprit',value:1}, cool: {label:'Cran',value:1}, synth: {label:'Synth',value:0}, style: {label:'Style',value:0}, meat: {label:'Chair',value:-1} },
      statsDetail: '+2 Pro, +1 Esprit, +1 Cran, +0 Synth, +0 Style, -1 Chair',
      moves: ['Mais c\'est bien sÃ»r !','Toujours Ã  l\'Ã©coute','Agrandissement, stop','Chasseur de gros gibier','ChromÃ© (Limier)','Le sens de l\'observation','Remonter la trace','Sale rat','Sous tous les angles','ThÃ©Ã¢tre d\'opÃ©ration humain','Tireur embusquÃ©'],
      equip: ['Revolver de gros calibre','Pistolet de poche','Pistolet Ã  flÃ©chettes','Taser de poing','Fusil de prÃ©cision','Gilet de protection','VÃªtements renforcÃ©s','Berline +quelconque','Traumapatch','Lunettes (Ã©quipement)','Processeur tactique','Yeux cybernÃ©tiques']
    },
    { slug: 'pilote', name: 'Le Pilote',
      desc: '<p><strong>« La route est Ã  moi. »</strong></p><p>Le Pilote ne fait qu\'un avec sa machine.</p>',
      stats: { edge: {label:'Pro',value:1}, mind: {label:'Esprit',value:0}, cool: {label:'Cran',value:1}, synth: {label:'Synth',value:0}, style: {label:'Style',value:2}, meat: {label:'Chair',value:-1} },
      statsDetail: '+1 Pro, +0 Esprit, +1 Cran, +0 Synth, +2 Style, -1 Chair',
      moves: ['Caisse','Seconde peau','Belle bagnole','Casse-cou','ChromÃ© (Pilote)','De glace','L\'outil adaptÃ© Ã  la tÃ¢che','OpÃ©rateur de drones','Un Å“il dans le ciel','Un putain d\'as du volant'],
      equip: ['Fusil de combat','Pistolet (Soldat)','Machette','Gilet de protection','Combinaison de cuir synthÃ©tique','Traumapatch','Interface neurale','Module de contrÃ´le Ã  distance','VÃ©hicule cÃ¢blÃ©']
    },
    { slug: 'provocateur', name: 'Le Provocateur',
      desc: '<p><strong>« Les rÃ©volutions se gagnent avec des idÃ©es. »</strong></p><p>Le Provocateur est un meneur.</p>',
      stats: { edge: {label:'Pro',value:0}, mind: {label:'Esprit',value:0}, cool: {label:'Cran',value:1}, synth: {label:'Synth',value:0}, style: {label:'Style',value:2}, meat: {label:'Chair',value:-1} },
      statsDetail: '+0 Pro, +0 Esprit, +1 Cran, +0 Synth, +2 Style, -1 Chair',
      moves: ['DÃ©terminÃ©','Visionnaire','Adeptes','Agitateur','Beau parleur','CÃ©lÃ¨bre','Cercle intÃ©rieur','ChromÃ© (Provocateur)','Opportuniste','Ramener au bercail','Sociable','Un million de points lumineux'],
      equip: ['Pistolet de poche','Pistolet Ã  flÃ©chettes','Pistolet semi-automatique','Combinaison de cuir synthÃ©tique','VÃªtements renforcÃ©s','VÃ©hicule +racÃ©','Ã‰quipement d\'enregistrement simsense','Instruments de musique','Relais de communication','Traumapatch','Lames rÃ©tractables','Arme Ã  feu cachÃ©e','Fouet Ã  monofilament','Implant interne d\'assassinat']
    },
    { slug: 'reporter', name: 'Le Reporter',
      desc: '<p><strong>« La vÃ©ritÃ© est une denrÃ©e rare. »</strong></p><p>Le Reporter est un journaliste d\'investigation.</p>',
      stats: { edge: {label:'Pro',value:2}, mind: {label:'Esprit',value:0}, cool: {label:'Cran',value:1}, synth: {label:'Synth',value:0}, style: {label:'Style',value:1}, meat: {label:'Chair',value:-1} },
      statsDetail: '+2 Pro, +0 Esprit, +1 Cran, +0 Synth, +1 Style, -1 Chair',
      moves: ['Du flair pour les nouvelles','En direct live','Rassembler les preuves','24 heures sur 24, 7 jours sur 7','Carte de presse','ChromÃ© (Reporter)','Correspondant de guerre','Fouille-merde','Pitbull','Sources sÃ»res'],
      equip: ['Pistolet de poche','Pistolet Ã  flÃ©chettes','Taser de poing','VÃªtements renforcÃ©s','MatÃ©riel de communication +encryptÃ©e','MatÃ©riel d\'enregistrement','Lunettes (Ã©quipement)','Traumapatch']
    },
    { slug: 'soldat', name: 'Le Soldat',
      desc: '<p><strong>« On m\'a appris Ã  survivre. »</strong></p><p>Ancien militaire, le Soldat est un atout tactique.</p>',
      stats: { edge: {label:'Pro',value:2}, mind: {label:'Esprit',value:0}, cool: {label:'Cran',value:1}, synth: {label:'Synth',value:-1}, style: {label:'Style',value:0}, meat: {label:'Chair',value:1} },
      statsDetail: '+2 Pro, +0 Esprit, +1 Cran, -1 Synth, +0 Style, +1 Chair',
      moves: ['J\'adore quand un plan se dÃ©roule sans accroc','Voici le plan','Aura de professionnalisme','ChromÃ© (Soldat)','Gestion directe','Glissant comme une anguille','OpÃ©rations tactiques','PrÃ©sence rassurante','Recruteur','Savoirs corporatifs (Soldat)','Solution de repli'],
      equip: ['Pistolet (Soldat)','Fusil d\'assaut','Grenades Ã  fragmentation','Grenades incapacitantes','Gilet de protection','VÃªtements renforcÃ©s','Relais de communication','Jumelles','Traumapatch']
    },
    { slug: 'tech', name: 'Le Tech',
      desc: '<p><strong>« Si Ã§a a des circuits, je peux le rÃ©parer. »</strong></p><p>Le Tech est un gÃ©nie de la technologie.</p>',
      stats: { edge: {label:'Pro',value:0}, mind: {label:'Esprit',value:2}, cool: {label:'Cran',value:1}, synth: {label:'Synth',value:1}, style: {label:'Style',value:0}, meat: {label:'Chair',value:-1} },
      statsDetail: '+0 Pro, +2 Esprit, +1 Cran, +1 Synth, +0 Style, -1 Chair',
      moves: ['Bidouilleur','Bric-Ã -brac','Expert','Analytique','ChromÃ© (Tech)','Court-circuitage','Homme de la Renaissance','IntÃ©rÃªts diversifiÃ©s','Je suis sur le coup','Obsessionnel','Se fondre dans la masse (Tech)','Touche-Ã -tout'],
      equip: ['Pistolet de poche','Fusil d\'assaut','Grenades Ã  fragmentation','Grenades Ã  gaz','Gilet de protection','VÃªtements renforcÃ©s','Jumelles','Fourgon ou camion','Traumapatch','Relais de communication','Trousse Ã  outils (Tech)','Atelier','Bras cybernÃ©tique (outils intÃ©grÃ©s)']
    },
    { slug: 'tueur', name: 'Le Tueur',
      desc: '<p><strong>« Je ne laisse pas de traces. »</strong></p><p>Le Tueur est une arme.</p>',
      stats: { edge: {label:'Pro',value:1}, mind: {label:'Esprit',value:-1}, cool: {label:'Cran',value:0}, synth: {label:'Synth',value:2}, style: {label:'Style',value:0}, meat: {label:'Chair',value:1} },
      statsDetail: '+1 Pro, -1 Esprit, +0 Cran, +2 Synth, +0 Style, +1 Chair',
      moves: ['Arme personnalisÃ©e','ArmÃ© jusqu\'aux dents','DÃ©pourvu de sentiments','Dur Ã  cuire','Membre des Forces SpÃ©ciales','Å’il exercÃ©','PassÃ© militaire (Tueur)','Plus machine qu\'homme','Regard de dur','Secrets corporatifs (Tueur)'],
      equip: ['Pistolet-mitrailleur silencieux','Fusil de combat','Revolver de gros calibre','Fusil d\'assaut','Ã‰pÃ©e','Gilet pare-balles','Gilet de protection','Traumapatch','Moto +agressive','Lames rÃ©tractables','Arme Ã  feu cachÃ©e','Fouet Ã  monofilament','Implant interne d\'assassinat','Armure dermique','Bras cybernÃ©tique (force augmentÃ©e)','Bras cybernÃ©tique (outils intÃ©grÃ©s)','Bras cybernÃ©tique (arme intÃ©grÃ©e)','Interface neurale','Logiciel de visÃ©e','Nerfs synthÃ©tiques','Yeux cybernÃ©tiques']
    }
  ];

  const playbooks = [];
  
  for (const def of playbookDefs) {
    const choiceSets = [];
    
    // ChoiceSet: Manoeuvres de livret
    const moveChoices = [];
    for (const name of def.moves) {
      if (movesMap[name]) moveChoices.push({ uuid: movesMap[name].uuid, img: 'icons/svg/dice-target.svg', granted: true, advancement: 0 });
      else console.warn(`  ⚠️ Manoeuvre manquante: ${name}`);
    }
    if (moveChoices.length) {
      choiceSets.push({
        title: 'Manoeuvres de livret', desc: 'Les manoeuvres specifiques a ce livret.',
        type: 'multi', repeatable: false, grantOn: 0, advancement: 0, granted: false,
        choices: moveChoices
      });
    }
    
    // ChoiceSet: Equipement de depart
    const equipChoices = [];
    for (const name of def.equip) {
      if (equipMap[name]) equipChoices.push({ uuid: equipMap[name].uuid, img: 'icons/svg/backpack.svg', granted: true, advancement: 0 });
      else console.warn(`  ⚠️ Equipement manquant: ${name}`);
    }
    if (equipChoices.length) {
      choiceSets.push({
        title: 'Equipement de depart', desc: 'Armes, armures, cyberware et materiel.',
        type: 'multi', repeatable: false, grantOn: 0, advancement: 0, granted: false,
        choices: equipChoices
      });
    }
    
    playbooks.push({
      _id: genId(),
      name: def.name,
      system: {
        slug: def.slug, actorType: 'character',
        description: def.desc,
        stats: def.stats,
        statsDetail: def.statsDetail,
        attributes: {},
        choiceSets
      }
    });
    
    const m = moveChoices.length;
    const e = equipChoices.length;
    console.log(`  ${def.name}: ${m} manoeuvres, ${e} equipements`);
  }
  
  await writeDB(path.join(base, 'playbooks.db'), playbooks);
}

main().catch(e => { console.error('Erreur:', e.message, e.stack); process.exit(1); });