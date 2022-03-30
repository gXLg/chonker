function run(message, e, inst, args){
  const txt = args[0];

  if(!inst[message.author.id]){
    e.setDescription("[**ошибка**] В твоей среде нету запущенных процессов!");
    message.reply({ "embeds": [e] });
    return;
  }
  inst[message.author.id].stdin.write(txt + "\n");
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "inst", "args"],
  "args": [
    [
      [/.*/gm, arg => arg]
    ]
  ],
  "perm": [],
  "category": "coding"
}
