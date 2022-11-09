const { execute, choGuild } = require("../configs/cho.js");
const fs = require("fs");

async function run(message, prefix, e, args, bot, custom, config, listeners){

  if(message.author.id != "557260090621558805"){
    e.setDescription("Эта команда находится в разработке!");
    message.reply({ "embeds": [e] });
    return;
  }

  const events = ["messageCreate", "guildMemberAdd", "messageReactionAdd", "messageReactionRemove"];
  const eventName = args[0];
  if(!events.includes(eventName)){
    e.setDescription("[**ошибка**] Указан неверный ивент");
    message.reply({ "embeds": [e] });
    return;
  }

  const gid = message.guild.id;

  const d = await custom.pull(gid);
  d.cid = message.channel.id;
  if(!("d" in d))
    d.d = [];
  await custom.put(message.guild.id, d);

  if(args[1] == "clear"){
    if(d.d.includes(eventName))
      d.d = d.d.filter(i => i != eventName);

    await custom.put(message.guild.id, d);
    delete listeners[eventName][gid];

    e.setDescription("Ивент " + eventName + " был очищен");
    message.reply({ "embeds": [e] });
    return;
  } else if(args[1] == "show"){
    let escaped = "`отсутсвует`";
    if(d.d.includes(eventName)){
      const code = fs.readFileSync("./database/custom_events/" + gid + "/" + eventName + ".cho", "utf8");
      escaped = "\`\`\`\n" + code.replace(/\`\`\`/g, "'''") + "\n\`\`\`";
    }
    e.setDescription("**Код для ивента " + eventName + "**\n" + escaped);
    message.reply({ "embeds": [e] }, false);
    return;
  }

  const code = args[1].split("\n").map(l => l.trim()).filter(l => !!l).join("\n");

  const dir = "./database/custom_events/" + gid;
  if(!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(dir + "/" + eventName + ".cho", code);

  if(!("d" in d))
    d.d = [eventName];
  else if(!d.d.includes(eventName))
    d.d.push(eventName);
  await custom.put(message.guild.id, d);

  const listen = (...events) => {
    if(choGuild(eventName, events).id != gid) return;
    execute(code, eventName, events,
            message.channel.id, config, bot);
  };
  listeners[eventName][gid] = listen;

  e.setDescription("Код успешно был установлен на ивент " + eventName);
  message.reply({ "embeds": [e] }, false);
}

module.exports = {
  "run": run,
  "dep": [
    "message", "prefix", "e", "args", "bot", "custom", "config", "listeners"
  ],
  "args": [
    [
      [/.*?/, arg => arg]
    ],
    [
      [/`{3}\w*\n?[\S\s]+?\n?`{3}/m, arg => arg.slice(arg.split(/\s/)[0].length, - 3).trim()],
      [/.*?/, arg => arg.toLowerCase()]
    ]
  ],
  "perm": ["admin"],
  "category": "server"
};