/* ------------------------------------------------------- */
/*   THE SPRAWL [FR] — POPULATE EQUIPMENT                   */
/*   84 items complets                        */
/* ------------------------------------------------------- */

const EQUIPMENT_DATA = [

  // ═══ WEAPONS ═══
  { name: "Revolver de gros calibre", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +recharge, +bruyant, 3-dégâts", description: "<p>Un revolver lourd qui fait mal là où ça compte.</p>" } },
  { name: "Pistolet à fléchettes", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +rapide, +fléchettes, 3-dégâts", description: "<p>Pistolet tirant des fléchettes tranquillisantes ou empoisonnées.</p>" } },
  { name: "Arme de poing", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +bruyant, +rapide, 2-dégâts", description: "<p>Pistolet standard, fiable et dissimulable.</p>" } },
  { name: "Fusil à pompe", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +bruyant, +carnage, 3-dégâts", description: "<p>Puissant à courte portée, dévastateur dans les espaces confinés.</p>" } },
  { name: "Fusil d'assaut", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+proche/longue, +bruyant, +automatique, 2-dégâts", description: "<p>Fusil automatique standard, polyvalent.</p>" } },
  { name: "Fusil de précision", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+longue/extrême, +bruyant, +recharge, 4-dégâts", description: "<p>Fusil à longue portée pour le tir d'élite.</p>" } },
  { name: "Lame", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+contact, 2-dégâts", description: "<p>Couteau, machette ou autre arme blanche.</p>" } },
  { name: "Fouet ou chaîne", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte, +zone, 1-dégât", description: "<p>Arme improvisée mais efficace pour garder ses distances.</p>" } },
  { name: "Pistolet-mitrailleur", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +automatique, +bruyant, 2-dégâts", description: "<p>Automatique compact, idéal pour le combat rapproché.</p>" } },
  { name: "Explosifs", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte, +dangereux, 4-dégâts, +carnage", description: "<p>Grenades, charges ou autres explosifs.</p>" } },
  { name: "Pistolet de poche", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+contact/courte, +discret, +rapide, +recharge, +bruyant, 2-dégâts", description: "<p>Arme de poing compacte, facile à dissimuler.</p>" } },
  { name: "Pistolet semi-automatique", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +bruyant, +rapide, 2-dégâts", description: "<p>Pistolet standard à tir rapide.</p>" } },
  { name: "Taser de poing", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+assommant, +contact, +recharge", description: "<p>Arme électrique non-létale.</p>" } },
  { name: "Pistolet-mitrailleur silencieux", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +automatique, +discret, 2-dégâts", description: "<p>PM avec silencieux intégré pour les opérations discrètes.</p>" } },
  { name: "Pistolet semi-automatique silencieux", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte, +rapide, +discret, 2-dégâts", description: "<p>Pistolet équipé d'un silencieux.</p>" } },
  { name: "Épée", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+contact, +carnage, 3-dégâts", description: "<p>Lame longue tranchante, efficace au combat.</p>" } },
  { name: "Shuriken ou couteaux de lancer", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte, +nombreux, 2-dégâts", description: "<p>Projectiles légers, nombreux et discrets.</p>" } },
  { name: "Fusil de combat", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +bruyant, +carnage, +automatique, 3-dégâts", description: "<p>Fusil automatique lourd pour l'assaut.</p>" } },
  { name: "Machette", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+contact, +carnage, 3-dégâts", description: "<p>Lame large et lourde, dévastatrice au corps à corps.</p>" } },
  { name: "Grenades à fragmentation", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+proche, +zone, +recharge, +bruyant, +carnage, 4-dégâts", description: "<p>Grenade explosive standard.</p>" } },
  { name: "Grenades incapacitantes", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+assommant, +proche, +zone, +bruyant, +recharge", description: "<p>Grenade à effet non-létal.</p>" } },
  { name: "Grenades à gaz", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+assommant, +proche, +zone, +recharge, +gaz", description: "<p>Grenade libérant un gaz incapacitant.</p>" } },
  { name: "Pistolet (Soldat)", type: "equipment", system: { equipmentType: "weapon", quantity: 1, tags: "+courte/proche, +bruyant, 3-dégâts", description: "<p>Pistolet militaire lourd.</p>" } },

  // ═══ ARMORS ═══
  { name: "Vêtements renforcés", type: "equipment", system: { equipmentType: "armor", quantity: 1, tags: "0-armure, +discret", description: "<p>Vêtements tactiques avec renforts discrets. Soustrait 1 lors des jets de Blessure.</p>" } },
  { name: "Gilet pare-balles", type: "equipment", system: { equipmentType: "armor", quantity: 1, tags: "1-armure, +voyant", description: "<p>Gilet offrant une protection balistique standard.</p>" } },
  { name: "Armure lourde", type: "equipment", system: { equipmentType: "armor", quantity: 1, tags: "2-armure, +lourd, +très voyant", description: "<p>Armure complète avec plaques balistiques.</p>" } },
  { name: "Blouson renforcé", type: "equipment", system: { equipmentType: "armor", quantity: 1, tags: "0-armure, +discret", description: "<p>Blouson en cuir ou synthétique avec mailles protectrices intégrées.</p>" } },
  { name: "Gilet de protection", type: "equipment", system: { equipmentType: "armor", quantity: 1, tags: "1-armure", description: "<p>Gilet balistique standard de niveau protection de base.</p>" } },

  // ═══ GEAR ═══
  { name: "Lunettes tactiques", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+zoom, +enregistrement", description: "<p>Lunettes à réalité augmentée avec zoom et enregistrement.</p>" } },
  { name: "Traumapatch", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+jetable, +premiers soins", description: "<p>Patch médical d'urgence pour blessures jusqu'à 21h00.</p>" } },
  { name: "Kit de Traitement Médical d'Urgence", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+médical, +encombrant", description: "<p>Kit complet pour les blessures graves au-delà de 21h00.</p>" } },
  { name: "Outils d'investigation de terrain", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+investigation", description: "<p>Kit complet : lampe UV, empreintes, enregistreur.</p>" } },
  { name: "Console matricielle", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+matrice", description: "<p>Console de decking avec processeur, mémoire et programmes.</p>" } },
  { name: "Atelier", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+atelier", description: "<p>Atelier spécialisé dans une sphère d'expertise (armurerie, chimie, cybernétique, électronique, mécanique, médical).</p>" } },
  { name: "Drone de reconnaissance", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+drone, +volant, +discret", description: "<p>Petit drone discret pour la surveillance et l'exploration.</p>" } },
  { name: "Drone de combat", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+drone, +volant, 2-dégâts, 1-armure", description: "<p>Drone armé pour le soutien tactique.</p>" } },
  { name: "Puce de compétence", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+puce, +compétence", description: "<p>Puce de compétence câblée pour Compétences câblées. Exemples : arts martiaux, crochetage, escalade, armes à feu, conduite extrême, premiers soins, parkour.</p>" } },
  { name: "Combinaison furtive", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+furtif, +discret", description: "<p>+1 continu pour éviter d'être repéré quand tu es seul et caché.</p>" } },
  { name: "Kit de déguisement", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+déguisement", description: "<p>+1 continu pour éviter d'être repéré en maintenant une fausse identité.</p>" } },
  { name: "Matériel d'enregistrement", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+enregistrement", description: "<p>Matériel audio/vidéo. Choisis jusqu'à 2 étiquettes : +audio, +vidéo, +discret, +encrypté.</p>" } },
  { name: "Console d'infiltration", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+matrice, +infiltration", description: "<p>Console spécialisée : Résistance 1, Pare-feu 1, Processeur 1, Furtivité 2. Avec Protection d'identité, Traitement de données, Verrouillage.</p>" } },
  { name: "Matériel de communication +encryptée", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+communication, +encrypté", description: "<p>Système de communication crypté, résistant aux interceptions.</p>" } },
  { name: "Relais de communication", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+communication, +relais", description: "<p>Relais de communication. Choisis 2 étiquettes parmi +encrypté, +brouillage.</p>" } },
  { name: "Station microélectronique de réparation", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+réparation, +électronique", description: "<p>Permet d'effectuer des réparations sur le terrain sur l'électronique et la cybernétique.</p>" } },
  { name: "Réfrigérateur blindé", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "3-armure, +immobile", description: "<p>Coffre blindé pour protéger du matériel sensible.</p>" } },
  { name: "Jumelles", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+vision", description: "<p>Jumelles. Choisis 2 étiquettes parmi : +thermographique, +amplification lumineuse, +zoom, +anti-flash, +enregistrement.</p>" } },
  { name: "Lunettes (équipement)", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+vision", description: "<p>Lunettes. Choisis 2 étiquettes parmi : +amplification lumineuse, +zoom, +enregistrement.</p>" } },
  { name: "Équipement d'enregistrement simsense", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+enregistrement, +simsense", description: "<p>Équipement d'enregistrement de simulation sensorielle (simsense).</p>" } },
  { name: "Instruments de musique", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+musique, +enregistrement", description: "<p>Instruments de musique. Choisis 2 étiquettes parmi : +enregistrement, +relais satellite, +simsense.</p>" } },
  { name: "Trousse à outils (Tech)", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+outils, +réparation", description: "<p>Trousse à outils et matériel adaptés à ta sphère d'expertise.</p>" } },
  { name: "Combinaison de cuir synthétique", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "0-armure, +discret", description: "<p>Soustrait 1 lors des jets de blessure.</p>" } },
  { name: "Berline +quelconque", type: "equipment", system: { equipmentType: "gear", quantity: 1, tags: "+véhicule, +quelconque", description: "<p>Berline discrète qui ne se fait pas remarquer.</p>" } },

  // ═══ CYBERWARE ═══
  { name: "Processeur tactique", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+implant cérébral", description: "<p>Système expert calculant trajectoires, distances et variables environnementales pour guider la prise de décision. Quand tu évalues au cœur d'une situation tactique, retiens 1 supplémentaire, même sur un raté.</p>" } },
  { name: "Yeux cybernétiques", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+zoom, +amplification lumineuse, +enregistrement, +implant", description: "<p>Yeux de remplacement offrant des capacités visuelles supérieures. Choisis 2 options parmi : +thermographique, +amplification lumineuse, +zoom, +anti-flash, +enregistrement, +crypté, +partition inaccessible. Quand ta vision améliorée peut aider, lance 2d6+Synth pour évaluer.</p>" } },
  { name: "Interface neurale", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+interface, +matrice, +implant cérébral", description: "<p>Interface cérébrale retranscrivant les impulsions nerveuses en signaux pour contrôler des engins extérieurs. Permet de prendre Seconde peau (Pilote) ou Branché (Hacker) comme avancement. Choisis une option : Logiciel de visée, Module de contrôle à distance, ou Stockage de données.</p>" } },
  { name: "Logiciel de visée", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+interface, +visée, +implant", description: "<p>Option de l'Interface neurale. Lien neural direct avec une arme +connectée. Inflige dégâts supplémentaires = Synth. Lance 2d6+Synth au lieu de Chair pour employer la manière forte. Précision de zone avec +automatique.</p>" } },
  { name: "Module de contrôle à distance", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+interface, +drone, +implant", description: "<p>Option de l'Interface neurale. Contrôle à distance de véhicules et drones sans fil. Choisis 2 parmi : +multitâche, +crypté, +relais satellite, +partition inaccessible.</p>" } },
  { name: "Stockage de données", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+interface, +mémoire, +implant", description: "<p>Option de l'Interface neurale. Communication pensée avec système/Matrice. Recherche dans données stockées : [info] supplémentaire sur succès. Choisis 2 parmi : +vitesse élevée, +large capacité, +crypté, +partition inaccessible.</p>" } },
  { name: "Réflexes augmentés", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+réflexes, +combat, +implant", description: "<p>Amélioration des réflexes par implants neuromusculaires. +1 pour agir sous pression quand la réaction compte.</p>" } },
  { name: "Armature synthétique", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+armature, +résistance, +implant", description: "<p>Renforcement du squelette et des muscles. +1 armure contre les dégâts physiques.</p>" } },
  { name: "Armure dermique", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+armure, +dermique, +implant", description: "<p>Plaques hypodermiques d'armure synthétique. Blessure : soustrais 2 au jet (3 si +fléchettes).</p>" } },
  { name: "Bras cybernétique (force augmentée)", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+force, +mêlée, +implant", description: "<p>Bras de remplacement avec force augmentée. +2 dégâts en utilisant une arme de mêlée qui dépend de la force physique.</p>" } },
  { name: "Bras cybernétique (outils intégrés)", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+outils, +bricolage, +implant", description: "<p>Bras de remplacement avec outils intégrés. +1 sur le prochain jet pour réparer, trafiquer ou court-circuiter un appareil.</p>" } },
  { name: "Bras cybernétique (arme intégrée)", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+arme, +implant", description: "<p>Bras de remplacement avec arme intégrée. Choisis : lames rétractables (2-dégâts +contact +carnage), arme à feu cachée (2-dégâts +courte +bruyant), ou fouet à monofilament (4-dégâts +contact +carnage +zone +dangereux).</p>" } },
  { name: "Lames rétractables", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+contact, +carnage, +implant, +dissimulé, 2-dégâts", description: "<p>Armes internes dissimulées montées dans les avant-bras, déployables à volonté. Variante de l'Armement incorporé.</p>" } },
  { name: "Arme à feu cachée", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+courte, +bruyant, +implant, +dissimulé, 2-dégâts", description: "<p>Arme à feu implantée dans le corps. Variante de l'Armement incorporé.</p>" } },
  { name: "Fouet à monofilament", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+contact, +carnage, +zone, +dangereux, +implant, 4-dégâts", description: "<p>Fouet à monofilament implanté, capable de trancher presque tout. Variante de l'Armement incorporé.</p>" } },
  { name: "Implant interne d'assassinat", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+intime, +lent, +implant, 4-dégâts", description: "<p>Implant discret conçu pour l'assassinat silencieux à bout portant.</p>" } },
  { name: "Compétences câblées", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+cérébral, +puce, +compétence, +implant", description: "<p>Système expert cérébral émulant réflexes et connaissances. +1 continu si la puce correspond à la Manœuvre. 2 ports standard, démarre avec 2 puces. Puces : arts martiaux, crochetage, escalade, armes à feu, conduite extrême, parkour, premiers soins, etc.</p>" } },
  { name: "Cybercoms", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+communication, +implant", description: "<p>Communications internes par impulsions mentales. Choisis 2 parmi : +brouillage, +relais satellite, +enregistrement, +crypté, +partition inaccessible. Surveiller des communications : 2d6+Synth pour évaluer.</p>" } },
  { name: "Greffe musculaire", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+muscle, +force, +mêlée, +implant", description: "<p>Fibres synthétiques greffées. Arme de mêlée pour employer la manière forte : 2d6+Synth au lieu de Chair, +1 dégât.</p>" } },
  { name: "Jambes cybernétiques", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+jambes, +athlétique, +implant", description: "<p>Jambes de remplacement aux capacités athlétiques surhumaines. +1 pour agir sous pression via capacités athlétiques. 12+ : gagne 1 retenue (comme évaluer).</p>" } },
  { name: "Nerfs synthétiques", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+réflexes, +nerfs, +combat, +implant", description: "<p>Remplacement partiel du système nerveux. +1 sur employer la manière forte si aucun ennemi n'en a. +1 sur agir sous pression si réaction importante.</p>" } },
  { name: "Oreilles cybernétiques", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+audition, +implant", description: "<p>Oreilles de remplacement aux capacités auditives supérieures. Choisis 2 parmi : +atténuation, +gamme de fréquences, +enregistrement, +crypté, +partition inaccessible. Audition améliorée : 2d6+Synth pour évaluer.</p>" } },
  { name: "Poumon filtrant", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+filtre, +survie, +implant", description: "<p>Implant pulmonaire filtrant les toxines et agents chimiques.</p>" } },
  { name: "Stimulateur adrénaline", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+stimulant, +adrénaline, +implant", description: "<p>Libération contrôlée d'adrénaline. Une fois par mission, +1 sur un jet de Chair ou Cran.</p>" } },
  { name: "Enregistreur mnésique", type: "equipment", system: { equipmentType: "cyberware", quantity: 1, tags: "+enregistrement, +mémoire, +implant", description: "<p>Implant qui enregistre tout ce que tu vois et entends avec une capacité de stockage étendue.</p>" } },

  // ═══ VEHICLES ═══
  { name: "Véhicule câblé", type: "equipment", system: { equipmentType: "vehicle", quantity: 1, tags: "+véhicule, +câblé", description: "<p>Véhicule personnalisé avec interface neurale. Puissance, Aspect, Défaut et Armure variables selon le modèle.</p>" } },
  { name: "Véhicule +voyant", type: "equipment", system: { equipmentType: "vehicle", quantity: 1, tags: "+véhicule, +voyant", description: "<p>Moto, voiture de sport ou hors-bord voyant.</p>" } },
  { name: "Véhicule +racé", type: "equipment", system: { equipmentType: "vehicle", quantity: 1, tags: "+véhicule, +racé", description: "<p>Moto, voiture ou hélicoptère racé.</p>" } },
  { name: "Moto +agressive", type: "equipment", system: { equipmentType: "vehicle", quantity: 1, tags: "+véhicule, +moto, +agressive", description: "<p>Moto au look agressif et performant.</p>" } },
  { name: "Fourgon ou camion", type: "equipment", system: { equipmentType: "vehicle", quantity: 1, tags: "+véhicule, +utilitaire", description: "<p>Fourgon utilitaire. Choisis un avantage (+robuste, +tout-terrain, +immense, +performant) et un défaut (+lent, +exigu, +bruyant).</p>" } },
  { name: "Console matricielle (défensive)", type: "equipment", system: { equipmentType: "vehicle", quantity: 1, tags: "+matrice, +défensive", description: "<p>Console défensive : Résistance 2, Pare-feu 2, Processeur 1, Furtivité 1. Avec 2 programmes.</p>" } },
  { name: "Console matricielle (performante)", type: "equipment", system: { equipmentType: "vehicle", quantity: 1, tags: "+matrice, +performante", description: "<p>Console performante : Résistance 1, Pare-feu 1, Processeur 2, Furtivité 2. Avec 3 programmes.</p>" } },
];

async function populateEquipment() {
  const pack = game.packs.get("the-sprawl-fr.equipment");
  if (!pack) { ui.notifications.error(`Compendium introuvable.`); return; }
  console.log(`THE SPRAWL | ${EQUIPMENT_DATA.length} équipements.`);
  const ex = await pack.getDocuments();
  if (ex.length > 0) await Document.deleteDocuments(ex.map(d => d.uuid));
  let c=0,f=0;
  for (const eq of EQUIPMENT_DATA) {
    try { const item = await Item.create(eq,{temporary:true}); await pack.importDocument(item); c++; }
    catch(e) { f++; console.error(`  ❌ ${eq.name}:`,e); }
  }
  console.log(`THE SPRAWL | ✅ ${c}/${c+f} équipements.`);
  ui.notifications.info(`The Sprawl: ${c} équipements importés.`);
  return {c,f};
}
populateEquipment().catch(e => console.error('THE SPRAWL | Erreur:',e));