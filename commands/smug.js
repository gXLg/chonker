const nekoClient = require("nekos.life");
const neko = new nekoClient();

async function run(message, e){
  const json = await neko.sfw.smug();
  const author = message.member.nickname ?? message.author.username;
  e
    .setImage(json.url)
    .setDescription(author + " глупо лыбится");
  message.reply({ "embeds": [e] }, false);
}

module.exports = {
  "run": run,
  "dep": ["message", "e"],
  "args": [],
  "perm": [],
  "category": "roleplay"
};