const fs = require("fs");
const extensions = JSON.parse(fs.readFileSync("./configs/extensions.json"));

async function run(message, e){
  const langs = Object.keys(extensions);
  e.setDescription(langs.sort().join(", "));
  message.reply({ "embeds": [e] });
}

module.exports = {
  "run": run,
  "dep": ["message", "e"],
  "args": [],
  "perm": [],
  "category": "coding"
};