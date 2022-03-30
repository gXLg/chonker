require("cache-require-paths");

const config = require("./configs/config.json");
const { log, require_ } = require("./configs/functions.js");
const fs = require("fs");
const glob = require("glob");
const prove = require("./configs/prove.js");
const creator = config.creator;

class Database {
  constructor(path){
    this.path = path;
    this.data = JSON.parse(fs.readFileSync(path));
    this.worker = [];
    this.id = 0;
  }
  entries(){
    return new Promise(async (res, rej) => {
      const id = [this.id ++, "pull"];
      this.worker.push(id);
      while(this.worker.indexOf(id) > 0){ }
      res([...Object.keys(this.data)]);
      this.worker.splice(0, 1);
    });
  }
  pull(entry, expect){
    return new Promise(async (res, rej) => {
      const id = [this.id ++, "pull"];
      this.worker.push(id);
      while(this.worker.indexOf(id) > 0){ }
      if(!(entry in this.data)){
        await this.#fill(entry, expect ?? { });
      }
      const data = this.data[entry];
      res(data);
      this.worker.splice(0, 1);
    });
  }
  del(entry){
    return new Promise(async (res, rej) => {
      const id = [this.id ++, "put"];
      this.worker.push(id);
      while(this.worker.indexOf(id) > 0){ }
      delete this.data[entry];
      if(!this.worker.slice(1).map(w => w[1]).includes("put"))
        fs.writeFileSync(this.path, JSON.stringify(this.data));
      res();
      this.worker.splice(0, 1);
    });
  }
  put(entry, data){
    return new Promise(async (res, rej) => {
      const id = [this.id ++, "put"];
      this.worker.push(id);
      while(this.worker.indexOf(id) > 0){ }
      this.data[entry] = data;
      if(!this.worker.slice(1).map(w => w[1]).includes("put"))
        fs.writeFileSync(this.path, JSON.stringify(this.data));
      res();
      this.worker.splice(0, 1);
    });
  }
  #fill(entry, data){
    return new Promise(async (res, rej) => {
      this.data[entry] = data;
      fs.writeFileSync(this.path, JSON.stringify(this.data));
      res();
    });
  }
}

const data = new Database("./database/data.json");
const col = new Database("./database/collection.json");

let commands;
function get_commands(){
  commands = glob.sync("./commands/" + "*.js").map(name => {
    const cmd = name.slice(0, -3).split("/")[2];
    const r = require(name);
    return {
      "name": cmd,
      "r": r
    };
  });
}
get_commands();

const ds = require("discord.js");
const bot = new ds.Client({ "intents": ["GUILDS", "GUILD_MESSAGES"] });

const inst = { };

async function counter(){
  const entries = await col.entries();
  for(let en of entries){
    const d = (await col.pull(en)) - 1;
    if(!d){
      fs.rmSync("./env/" + en, { "recursive": true });
      await col.del(en);
    } else await col.put(en, d);
  }
  setTimeout(counter, 10 * 60 * 1000);
}

bot.once("ready", async () => {
  const status = {
    "activities": [{
      "name": "Бот оживёт на выходных!",
      "type": "PLAYING"
    }],
    "status": "idle"
  };
  bot.user.setPresence(status);
  counter();
  log("Logged in");
});

bot.on("messageCreate", async message => {
  if(message.author.id != creator) return;

  const d = await data.pull(message.guild.id);
  const chan = d.chan ? d.chan == message.guild.id : true;

  const prefix = d.prefix ?? ">_";

  const e = new ds.MessageEmbed()
    .setColor(config.color)

  if(message.author.bot) return;

  const spaces = message.content.trim().split(" ");

  const ping = new RegExp("^\\<@!?" + bot.user.id + "\\>$");

  if(!spaces[0].match(ping)){
    if(spaces[0].slice(0, prefix.length) != prefix) return;
  } else {
    spaces.splice(0, 1);
    if(!spaces[0]){
      if(!chan) return;
      e.setDescription("Мой префикс на этом сервере: \\`" + prefix + "\\`");
      message.reply({ "embeds": [e] });
      return;
    }
    spaces[0] = prefix + spaces[0];
  }
  if(spaces[0].slice(0, prefix.length) != prefix) return;

  const cmd = spaces[0].slice(prefix.length).toLowerCase();
  if(!cmd){
    if(!chan) return;
    e.setDescription("Это мой префикс!");
    message.reply({ "embeds": [e] });
    return;
  }
  let txt = spaces.slice(1).join(" ");
  const name = message.channel.name;
  if(!name) return;

  const command = commands.filter(c => c.name == cmd)[0];
  if(command){
    const c = command.r;
    prove(bot, message, c, chan);
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
  } else {
    if(!(await data.pull(message.guild.id).predict)) return;
    const cmds = commands.map(c => c.name);
    const predict = require("gxlg_predict");
    const fix = predict(cmds, cmd);
    e.setDescription("[**ошибка**] Неверная команда! " +
                    (fix ? ("Ты имел ввиду \\`" + prefix + fix + "\\`?")
                         : "Используй \\`" + prefix + "help\\` для помощи или \\`" + prefix + "commands\\` для списка команд."));
    message.reply({ "embeds": [e] });
  }
});

bot.login(config.token);
