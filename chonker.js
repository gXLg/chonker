require("cache-require-paths");

const config = require("./configs/config.json");
const { log, perms, Database } = require("./configs/functions.js");
const fs = require("fs");
const glob = require("glob");
const prove = require("./configs/prove.js");
const creator = config.creator;

const data = new Database("./database/data.json");
const col = new Database("./database/collection.json");
const custom = new Database("./database/custom_events.json");

let commands;
async function get_commands(message, e){
  const glo = glob.sync("./commands/" + "*.js");
  commands = [];
  const t = [];
  for(let name of glo){
    const cmd = name.slice(0, - 3).split("/")[2];
    delete require.cache[require.resolve(name)];
    let r;
    try {
      r = require(name);
    } catch(error){
      if(message){
        t.push("> Ошибка при импорте \\`" + cmd + "\\`");
      }
      log("Error on importing " + cmd + ": " + error);
      continue;
    }
    commands.push({ "name": cmd, "r": r });
  }
  if(message){
    e.setDescription("Готово!\n" + t.join("\n"));
    await message.reply({ "embeds": [e] });
  }
}
get_commands();

const ds = require("discord.js");
const bot = new ds.Client({ "intents": ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] });

const inst = { };

let cinter;
async function counter(){
  const entries = await col.entries();
  for(const en of entries){
    const d = (await col.pull(en)) - 1;
    if(!d){
      fs.rmSync("./env/" + en, { "recursive": true });
      await col.del(en);
    } else await col.put(en, d);
  }
  cinter = setTimeout(counter, 10 * 60 * 1000);
}

let sinter;
async function setStatus(){
  const s = bot.guilds.cache.size;
  const ending = (s % 100 != 11) && (s % 10 == 1) ? "е" : "ах";
  const status = {
    "activities": [{
      "name": "программирую на " + s + " сервер" + ending,
      "type": "PLAYING"
    }],
    "status": "dnd"
  };
  bot.user.setPresence(status);
  sinter = setTimeout(setStatus, 60 * 1000);
}

let done = 0;

bot.once("ready", async () => {
  counter();
  setStatus();
  log("Logged in as " + bot.user.username);
});

bot.on("messageCreate", async message => {
  //if(message.author.id != creator) return;

  const d = await data.pull(message.guild.id);
  const chan = d.chan ? (d.chan == message.channel.id) : true;

  const prefix = d.prefix ?? config.prefix;

  const e = new ds.MessageEmbed()
    .setColor(config.color)

  if(message.author.bot) return;

  let first = message.content.trim().split(/[ \t\n]+/)[0];
  let all = message.content.trim().slice(first.length).trim();

  const ping = new RegExp("^\\<@!?" + bot.user.id + "\\>$");

  if(!first.match(ping)){
    if(first.slice(0, prefix.length) != prefix) return;
  } else {
    if(!all){
      if(!chan) return;
      if(!await perms(message, e)) return;
      e.setDescription("Мой префикс на этом сервере: \\`" + prefix + "\\`");
      message.reply({ "embeds": [e] });
      return;
    }
    first = all.split(/[ \t\n]+/)[0];
    all = all.slice(first.length).trim();
    first = prefix + first;
  }
  if(first.slice(0, prefix.length) != prefix) return;

  const cmd = first.slice(prefix.length).toLowerCase();
  if(!cmd){
    if(!chan) return;
    if(!await perms(message, e)) return;
    e.setDescription("Это мой префикс!");
    message.reply({ "embeds": [e] });
    return;
  }
  let txt = all;
  const name = message.channel.name;
  if(!name) return;

  const command = commands.filter(c => c.name == cmd)[0];
  if(command){
    if(!await perms(message, e)) return;
    const c = command.r;
    if(!prove(bot, message, c, chan, creator)) return;
    let count = 0;
    const args = [];
    for(let a of c.args){
      let m;
      for(let t of a){
        const mm = txt.match(new RegExp("^" + t[0].source + "(?=\\s|$)"), t[0].flags);
        if(mm){
          m = t[1](mm[0]);
          break;
        }
      }
      if(m == undefined){
        e
          .setDescription("[**ошибка**] Неверно указан либо отсутствует " + (count + 1) + ". аргумент")
          .setFooter({ "text": "Подробнее: `" + prefix + "help " + cmd + "`" });
        message.reply({ "embeds": [e] });
        return;
      }
      count ++;
      args.push(m);
      txt = txt.slice(m.length).trim();
    }
    const parameter = c.dep.map(d => eval(d));
    c.run(...parameter);
    log("[ " + name  + " / " + message.author.tag + " ] " + cmd + " (" +args.length + ")");
    done ++;
  } else {
    if(!chan) return;
    if(!d.predict) return;
    if(!await perms(message, e)) return;
    const cmds = commands.map(c => c.name);
    const predict = require("gxlg_predict");
    const fix = predict(cmds, cmd);
    e.setDescription("[**ошибка**] Неверная команда! " +
                    (fix ? ("Ты имел ввиду \\`" + prefix + fix + "\\`?")
                         : "Используй \\`" + prefix + "help\\` для помощи или \\`" + prefix + "commands\\` для списка команд."));
    message.reply({ "embeds": [e] });
  }
});

const { execute, choGuild } = require("./configs/cho.js");
const listeners = { };
(async () => {
  const entries = await custom.entries();
  for(const en of entries){
    const d = await custom.pull(en);
    const cid = d.cid;
    for(const eventName of d.d){
      const code = fs.readFileSync("./database/custom_events/" + en + "/" + eventName + ".cho", "utf8");
      const listen = (...events) => {
        if(choGuild(eventName, events).id != en) return;
        execute(code, eventName, events, cid, config, bot);
      };
      if(!(en in listeners))
        listeners[en] = { };
      listeners[en][eventName] = listen;
      bot.on(eventName, listen);
    }
  }
})();

bot.login(config.token);
