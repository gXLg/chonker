const fs = require("fs");

function get_time(){
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  if(h < 10) h = "0" + h;
  if(m < 10) m = "0" + m;
  if(s < 10) s = "0" + s;
  let time = h + ":" + m + ":" + s;
  return time;
}

function log(text){
  console.log(get_time() + " | " + text);
}

async function perms(message, e){
  if(!message.guild.me.permissionsIn(message.channel).has(125952n)){
    try {
      e.setDescription("[**ошибка**] На сервере " + message.guild.name + " мне не выдали все права, свяжитесь с владельцем сервера.");
      await message.author.send({ "embeds": [e] });
    } catch { }
    return false;
  }
  return true;
}

class Database {
  constructor(path){
    this.path = path;
    if(!fs.existsSync(path))
      fs.writeFileSync(path, "{ }");
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
  pullSync(entry, expect){
    const id = [this.id ++, "pull"];
    this.worker.push(id);
    while(this.worker.indexOf(id) > 0){ }
    if(!(entry in this.data)){
      this.#fillSync(entry, expect ?? { });
    }
    const data = this.data[entry];
    this.worker.splice(0, 1);
    return data;
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
  delSync(entry){
    const id = [this.id ++, "put"];
    this.worker.push(id);
    while(this.worker.indexOf(id) > 0){ }
    delete this.data[entry];
    if(!this.worker.slice(1).map(w => w[1]).includes("put"))
      fs.writeFileSync(this.path, JSON.stringify(this.data));
    this.worker.splice(0, 1);
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
  putSync(entry, data){
    const id = [this.id ++, "put"];
    this.worker.push(id);
    while(this.worker.indexOf(id) > 0){ }
    this.data[entry] = data;
    if(!this.worker.slice(1).map(w => w[1]).includes("put"))
      fs.writeFileSync(this.path, JSON.stringify(this.data));
    this.worker.splice(0, 1);
  }
  #fill(entry, data){
    return new Promise(async (res, rej) => {
      this.data[entry] = data;
      fs.writeFileSync(this.path, JSON.stringify(this.data));
      res();
    });
  }
  #fillSync(entry, data){
    this.data[entry] = data;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

module.exports = { log, perms, Database };
