const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const base = "/opt/data/the-sprawl-fr/packs";

// Foundry-compatible random ID (alphanumeric, 16 chars)
function randomID() {
  return crypto.randomBytes(12).toString("base64url").slice(0, 16);
}

const ts = Date.now();
const id = randomID();
const id2 = randomID();

// Minimal test pack
const testDir = path.join(base, "testpack");
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

// Write a test document that matches Foundry's export format EXACTLY
const doc = {
  _id: id,
  name: "TEST - Pistol",
  type: "equipment",
  img: "icons/svg/backpack.svg",
  folder: null,
  sort: 0,
  ownership: {
    default: 2
  },
  flags: {},
  _stats: {
    systemId: "pbta",
    systemVersion: "1.2.0",
    coreVersion: "14.366",
    createdTime: ts,
    modifiedTime: ts,
    lastModifiedBy: randomID(),
    compendiumSource: null,
    duplicateSource: null,
    exportSource: null
  },
  system: {
    description: "<p>This is a test item.</p>",
    equipmentType: "weapon",
    quantity: 1,
    tags: "+test",
    uses: 0
  }
};

const filePath = path.join(testDir, id + ".json");
fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), "utf8");

console.log("=== TEST PACK CREATED ===");
console.log("ID:", id);
console.log("File:", filePath);
console.log();
console.log("Content:");
console.log(JSON.stringify(doc, null, 2));

// Also add to module.json for testing
console.log("\n\nAdd this to module.json to test:");
console.log(`{
  "name": "testpack",
  "label": "Test Pack",
  "path": "packs/testpack",
  "type": "Item",
  "system": "pbta",
  "flags": {}
}`);