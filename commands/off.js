async function run(message, e, bot, cinter, sinter){
  clearInterval(cinter);
  clearInterval(sinter);
  e.setDescription(":wave: Отключаюсь!");
  await message.reply({ "embeds": [e] });
  bot.destroy();
  //process.exit();
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "bot", "cinter", "sinter"],
  "args": [],
  "perm": ["creator"],
  "category": "bot"
};