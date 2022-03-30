const fs = require("fs");

async function run(message, e, inst, col){

  const env = "./env/" + message.author.id;

  if(!fs.existsSync(env)){
    e.setDescription("Готово");
    message.reply({ "embeds": [e] });
    return;
  }
  if(inst[message.author.id]){
    e.setDescription("[**ошибка**] У тебя запущен процесс в твоей среде!");
    message.reply({ "embeds": [e] });
    return;
  }
  fs.rmSync(env, { "recursive": true });
  await col.del(message.author.id);

  e.setDescription("Готово");
  message.reply({ "embeds": [e] });
}

module.exports = {
  "run": run,
  "dep": [
    "message", "e", "inst", "col"
  ],
  "args": [],
  "perm": [],
  "category": "coding"
}