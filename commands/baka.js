const nekoClient = require("nekos.life");
const neko = new nekoClient();

async function run(message, e, args){
  const json = await neko.sfw.baka();
  const author = message.member.nickname ?? message.author.username;
  const id = args[0];
  let mentioned;
  if(id){
    try {
      mentioned = await message.guild.members.fetch(id);
    } catch {
      e.setDescription("[**ошибка**] Этот пользователь не существует либо мне недоступен");
      message.reply({ "embeds": [e] });
      return;
    }
    mentioned = mentioned.nickname ?? mentioned.user.username;
    if((mentioned == author) && (message.author.id == id))
      mentioned = "себя";

    mentioned = " называет " + mentioned + " идиотом";
  } else {
    mentioned = " кричит 'БАКА!!1!'";
  }
  e
    .setImage(json.url)
    .setDescription(author + mentioned);
  message.reply({ "embeds": [e] });
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "args"],
  "args": [
    [
      [new RegExp(), arg => false],
      [/\<@\d+\>/, arg => arg.slice(2, -1)],
      [/\<@!\d+\>/, arg => arg.slice(3, -1)],
      [/\d+/, arg => arg]
    ]
  ],
  "perm": [],
  "category": "roleplay"
};
