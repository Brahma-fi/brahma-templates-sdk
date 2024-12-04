const fs = require("fs");

const assets = require("./src/full_list.json");

// Filter assets with chainId 42161 or 8453
const filteredAssets = assets.filter((asset) => asset.chainId === 8453);

const fileName = "base.json";

// Output to JSON file
fs.writeFile(fileName, JSON.stringify(filteredAssets, null, 4), (err) => {
  if (err) throw err;
  console.log(`Filtered assets have been saved to '${fileName}'.`);
});
