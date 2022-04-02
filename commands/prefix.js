async function run(message, e, args, data){
  const d = await data.pull(message.guild.id);
  if(args[0] == ">_") delete d.prefix;
  else d.prefix = args[0];
  await data.put(message.guild.id, d);

  e.setDescription("Готово, префикс бота установлен на \\`" + args[0] + "\\`");
  message.reply({ "embeds": [e] });
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "args", "data"],
  "args": [
    [
      [/.+?/, arg => arg]
    ]
  ],
  "perm": ["admin"],
  "catergory": "server"
};