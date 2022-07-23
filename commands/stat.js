const os = require("os");

async function run(message, e, bot, ds, data, done){

  let t = "";

  const now = Date.now();
  const dat =  "> Регистрация: <t:1585870173:R>\n" +
               "> Время запуска: <t:" + Math.floor((now - bot.uptime) / 1000) + ":R>\n" +
               "> Верифицирован: <t:1633367880:R>";
  t += "**:date: Даты**\n" + dat + "\n";

  const used = process.memoryUsage().rss;
  const memo = os.totalmem();
  const perc = (100 * used / memo).toFixed(2);
  const stt = "> Команд выполнено: " + done + "\n" +
              "> RAM: " + perc + "% (" + parseInt(used / 1048576) + "/" + parseInt(memo / 1048576) + " MB)\n" +
              "> Пинг: " + bot.ws.ping + " ms";
  t += "**:bar_chart: Статистика**\n" + stt + "\n";

  let users = 0;
  let guilds = bot.guilds.cache.size;
  bot.guilds.cache.forEach(guild => users += guild.memberCount);
  let predi = 0;
  let cuspr = 0;
  for(let i of await data.entries()){
    const d = await data.pull(i);
    if(d.predict) predi ++;
    if(d.prefix) cuspr ++;
  }
  let se = (guilds % 10 == 1) && (guilds % 100 != 11) ? "е" : "ах";
  let u;
  if((users % 100 < 20 ) && (users % 100 > 10)) u = "ей";
  else if ((users % 10 < 5) && (users % 10 > 1)) u = "я";
  else if (users % 10 == 1) u = "ь"
  else u = "ей"
  let sc;
  if((cuspr % 100 < 20) && (cuspr % 100 > 10)) sc = "ов используют";
  else if ((cuspr % 10 < 5) && (cuspr % 10 > 1)) sc = "а используют";
  else if (cuspr % 10 == 1) sc = " использует";
  else sc = "ов используют";
  let sp;
  if((predi % 100 < 20) && (predi % 100 > 10)) sp = "ов используют";
  else if ((predi % 10 < 5) && (predi % 10 > 1)) sp = "а используют";
  else if (predi % 10 == 1) sp = " использует";
  else sp = "ов используют";
  const gld = "> " + users + " пользовател" + u + " на " + guilds + " сервер" + se + "\n" +
              "> " + cuspr + " сервер" + sc + " собственный префикс\n" +
              "> " + predi + " сервер" + sp + " модуль корректировки";
  t += "**:house: Сервера**\n" + gld + "\n";

  let sst = "> Язык: Javascript, NodeJS (" + process.version + ")\n" +
            "> Библиотека: discord.js (" + ds.version + ")\n" +
            "> Платформа: " + process.platform + " " + process.arch;
  t += "**:rocket: Система**\n" + sst;

  e.setDescription(t);
  message.reply({ "embeds": [e] }, false);
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "bot", "ds", "data", "done"],
  "args": [],
  "perm": [],
  "category": "bot"
};
