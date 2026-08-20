/* Minimal test to check JSON directory format in Foundry */
/* Run this in Foundry F12 console */

// Create a test compendium entry via the API
async function testCompendium() {
  const pack = game.packs.get("the-sprawl-fr.moves");
  if (!pack) {
    console.log("❌ Pack not found");
    return;
  }
  console.log(`✅ Pack found: ${pack.metadata.label}`);
  console.log(`   Path: ${pack.metadata.path}`);
  console.log(`   Type: ${pack.metadata.type}`);
  console.log(`   System: ${pack.metadata.system}`);
  
  // Get index
  try {
    const index = await pack.getIndex();
    console.log(`   Index size: ${index.size} documents`);
    if (index.size > 0) {
      index.forEach((entry, id) => {
        console.log(`   - ${id}: ${entry.name} (${entry.type})`);
      });
    }
  } catch(e) {
    console.log(`   Index error: ${e.message}`);
  }
  
  // Try to get documents directly
  try {
    const docs = await pack.getDocuments();
    console.log(`   Documents: ${docs.length}`);
    if (docs.length > 0) {
      docs.forEach(d => console.log(`   - ${d.name} (${d.type})`));
    }
  } catch(e) {
    console.log(`   Documents error: ${e.message}`);
  }
}

testCompendium();