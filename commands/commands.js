const categories = {
  "coding": ":computer: Программирование",
  "api": ":thought_balloon: API",
  "bot": ":robot: Бот",
  "server": ":gear: Сервер",
  "roleplay": ":heart: Ролевые",
  "other": ":game_die: Другие"
};

async function run(message, e, commands){
  e.setTitle("Список команд (" + commands.length + ")");
  let t = "";
  for(let category in categories){
    const name = categories[category];
    const cmds = commands
      .filter(c => c.r.category == category)
      .map(c => c.name);

    t += "**" + name + " (" +
         cmds.length + ")**\n> " +
         cmds.sort().join(", ") + "\n";
  }
  e.setDescription(t);
  message.reply({ "embeds": [e] });
}

module.exports = {
  "run": run,
  "dep": [
    "message", "e", "commands"
  ],
  "args": [],
  "perm": [],
  "category": "bot"
}
