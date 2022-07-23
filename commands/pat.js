const nekoClient = require("nekos.life");
const neko = new nekoClient();

async function run(message, e, args){
  const json = await neko.sfw.pat();
  const author = message.member.nickname ?? message.author.username;
  const id = args[0];
  let mentioned;
  try {
    mentioned = await message.guild.members.fetch(id);
  } catch {
    e.setDescription("[**ошибка**] Этот пользователь не существует либо мне недоступен");
    message.reply({ "embeds": [e] }, false);
    return;
  }
  mentioned = mentioned.nickname ?? mentioned.user.username;
  if((mentioned == author) && (message.author.id == id))
    mentioned = "себя"

  mentioned = " гладит " + mentioned;
  e
    .setImage(json.url)
    .setDescription(author + mentioned);
  message.reply({ "embeds": [e] }, false);
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "args"],
  "args": [
    [
      [/\<@\d+\>/, arg => arg.slice(2, -1)],
      [/\<@!\d+\>/, arg => arg.slice(3, -1)],
      [/\d+/, arg => arg]
    ]
  ],
  "perm": [],
  "category": "roleplay"
};
