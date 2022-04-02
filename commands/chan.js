const fs = require("fs");

async function run(message, e, args, data, prefix){
  const chan = args[0];
  const idname = message.guild.id;
  const d = await data.pull(idname);

  if(!chan){
    if(d.chan)
      e.setDescription("Я доступен в <#" + d.chan + ">");
    else
      e.setDescription("Фильтр на каналы не установлен");
    message.reply({ "embeds": [e] });
    return;
  } else if(chan == "none"){
    delete d.chan;
    await data.put(idname, d)
    e.setDescription("Готово, фильтр канала удалён");
    message.reply({ "embeds": [e] });
    return;
  } else if(chan == "here"){
    d.chan = message.channel.id;
    await data.put(idname, d);
    e.setDescription("Готово, теперь я доступен только в этом канале");
    message.reply({ "embeds": [e] });
    return;
  }
  let cc = message.guild.channels.cache.get(chan);
  if(!cc){
    e
      .setDescription("[**ошибка**] Данный канал не существует, либо мне не доступен")
      .setFooter({ "text": "Подробней: `" + prefix + "help chan`" });
    message.reply({ "embeds": [e] });
    return;
  }
  if(cc.type != "GUILD_TEXT"){
    e
      .setDescription("[**ошибка**] Неверный тип канала")
      .setFooter({ "text": "Подробней: `" + prefix + "help chan`" });
    message.reply({ "embeds": [e] });
    return;
  }
  d.chan = cc;
  await data.put(idname, d);

  e.setDescription("Готово, теперь я доступен только в <#" + chan + ">");
  message.reply({ "embeds": [e] });
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "args", "data", "prefix"],
  "args": [
     [
       [/(none)|(here)/i, arg => arg.toLowerCase()],
       [/\<#\d+\>/, arg => arg.slice(2, -1)],
       [/\d+/, arg => arg],
       [new RegExp(), arg => false]
     ]
  ],
  "perm": ["admin", "bypass"],
  "category": "server"
};
