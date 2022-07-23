async function run(message, e, args){

  const id = args[0];

  let msg;
  try {
    msg = await message.channel.messages.fetch(id);
  } catch {
    e.setDescription("[**ошибка**] Данное сообщение не существует, либо мне не доступно!");
    message.reply({ "embeds": [e] }, false);
    return;
  }
  if(!msg.content){
    e.setDescription("[**ошибка**] Сообщение имеет пустое содержание!");
    message.reply({ "embeds": [e] }, false);
    return;
  }

  let content = msg.content;
  for(let i of "\\*_~`|<>")
    content = content.split(i).join("\\" + i);
  content = content.split("@everyone").join("`@everyone`");
  content = content.split("@here").join("`@here`");

  e.setDescription(content);
  message.reply({ "embeds": [e] }, false);
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "args"],
  "args": [
    [
      [/\d+/, arg => arg]
    ]
  ],
  "perm": [],
  "category": "other"
}