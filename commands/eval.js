async function run(message, e, bot, args){

  const code = args[0];

  const a = Date.now();
  try {
    const ret = await eval("(async() => { " + code + " })();");
    const b = Date.now();
    let r = ret + "";
    if(typeof ret == "object")
      r = JSON.stringify(ret);
    r = r.replace(/`/g, "'");
    e.setDescription(
      "**:question: Статус**\n" +
      "> Успешно\n" +
      "**:stopwatch: Время**\n" +
      "> " + (b - a) + "ms\n" +
      "**:speech_left: Ответ**\n" +
      "> `" + r + "`"
    );
  } catch(err){
    const b = Date.now();
    const r = err.toString().replace(/`/g, "'");
    e.setDescription(
      "**:question: Статус**\n" +
      "> Ошибка\n" +
      "**:stopwatch: Время**\n" +
      "> " + (b - a) + "ms\n" +
      "**:warning: Ошибка**\n" +
      ">>> `" + r + "`"
    );
  }
  message.reply({ "embeds": [e] }, false);
}

module.exports = {
  run,
  "dep": [
    "message", "e", "bot", "args"
  ],
  "args": [
    [
      [/`{3}\w*\n?[\S\s]+?\n?`{3}/m, arg => arg.slice(arg.split(/\s/)[0].length, - 3).trim()]
    ]
  ],
  "perm": ["creator"],
  "category": "bot"
};
