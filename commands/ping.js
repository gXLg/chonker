async function run(message, e, bot){
  let time = Math.round(bot.ws.ping);
  e.setDescription("**:stopwatch: Pong!**\n> " +
                     "Задержка: " + time + " мс\nTest test :)");
  message.reply({ "embeds": [e] }, false);
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "bot"],
  "args": [],
  "perm": [],
  "category": "bot"
};
