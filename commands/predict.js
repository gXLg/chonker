async function run(message, e, data, args){
  const d = await data.pull(message.guild.id);
  if(args[0] == "off"){
    delete d.predict;
    await data.put(message.guild.id, d);
    e.setDescription("Готово, корректировка отключена");
    message.reply({ "embeds": [e] }, false);
  } else if(args[0] == "on"){
    d.predict = true;
    await data.put(message.guild.id, d);
    e.setDescription("Готово, корректировка включена");
    message.reply({ "embeds": [e] }, false);
  }
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "data", "args"],
  "args": [
    [
      [/(on)|(off)/i, arg => arg.toLowerCase()]
    ]
  ],
  "perm": ["admin"],
  "category": "server"
};