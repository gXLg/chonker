const { MessageEmbed } = require("discord.js");
const { Database } = require("./functions.js");
const glob = require("glob");

async function run(code, eventName, events, e){

  class Token {
    constructor(value, type){
      this.value = value;
      this.type = type;
    }
  }
  class Node {
    constructor(visitor, tokens, type, reference){
      this.v = () => visitor(...tokens);
      this.tokens = tokens;
      this.type = type;
      this.r = () => reference(...tokens);
    }
  }

  class Instance {
    constructor(i, type){
      this.prop = { };
      this.type = type;
      this.i = type._init(i);
    }
    _call(method, ...args){
      if(!(method in this.type))
        throw new Error(method + " not supported for " + this.type.name);
      return this.type[method](this, ...args);
    }
    _get(prop){
      return this.prop[prop.i] ?? this.type._get(this, prop);
    }
    _set(prop, value){
      this.type._set?.(this, prop, value) ?? (this.prop[prop.i] = value);
    }
    v(){
      return this;
    }
  }

  const Int = {
    name: "Int",
    prop: { },
    _init: i => {
      i = parseInt(i.i);
      return isNaN(i) ? 0 : i;
    },
    _int: self => {
      return self;
    },
    _str: self => {
      return new Instance({ i: self.i + "" }, Str);
    },
    _bool: self => {
      return new Instance({ i: !!self.i }, Bool);
    },
    _add: (self, a) => {
      return new Instance({ i: self.i + a._call("_int").i }, Int);
    },
    _unadd: self => {
      return self;
    },
    _sub: (self, a) => {
      return new Instance({ i: self.i - a._call("_int").i }, Int);
    },
    _unsub: self => {
      return new Instance({ i: - self.i }, Int);
    },
    _mul: (self, a) => {
      return new Instance({ i: self.i * a._call("_int").i }, Int);
    },
    _div: (self, a) => {
      return new Instance({ i: self.i / a._call("_int").i }, Int);
    },
    _mod: (self, a) => {
      return new Instance({ i: self.i % a._call("_int").i }, Int);
    },
    _equ: (self, a) => {
      return new Instance({ i: self.i == a._call("_int").i }, Bool);
    },
    _leq: (self, a) => {
      return new Instance({ i: self.i <= a._call("_int").i }, Bool);
    },
    _geq: (self, a) => {
      return new Instance({ i: self.i >= a._call("_int").i }, Bool);
    },
    _les: (self, a) => {
      return new Instance({ i: self.i < a._call("_int").i }, Bool);
    },
    _gre: (self, a) => {
      return new Instance({ i: self.i > a._call("_int").i }, Bool);
    },
    _neq: (self, a) => {
      return new Instance({ i: self.i != a._call("_int").i }, Bool);
    }
  };
  const Str = {
    name: "String",
    prop: { },
    _init: i => {
      return i._call?.("_str")?.i ?? i.i + "";
    },
    _int: self => {
      return new Instance({ i: self.i.length }, Int);
    },
    _str: self => {
      return self;
    },
    _list: self => {
      return new Instance({
        i: [...self.i].map(j => new Instance({ i: j }, Str))
      }, List);
    },
    _bool: self => {
      return new Instance({ i: !!self.i.length }, Bool);
    },
    _add: (self, a) => {
      return new Instance({ i: self.i + a._call("_str").i }, Str);
    },
    _unadd: self => {
      return self;
    },
    _sub: (self, a) => {
      const r = a._call("_str").i;
      return new Instance({
        i: self.i.replace(new RegExp(r), "")
      }, Str);
    },
    _unsub: self => {
      return new Instance({ i: [...this.i].reverse().join("") }, Str);
    },
    _mul: (self, a) => {
      return new Instance({ i: self.i.repeat(a._call("_int").i) }, Str);
    },
    _div: (self, a) => {
      return new Instance({
        i: self.i.split(new RegExp(a._call("_str").i)).map(
          j => new Instance({ i: j }, Str)
        )
      }, List);
    },
    _mod: (self, a) => {
      return new Instance({
        i: (self.i.match(new RegExp(a._call("_str").i, "g")) ?? []).map(
          j => new Instance({ i: j }, Str)
        )
      }, List);
    },
    _equ: (self, a) => {
      return new Instance({ i: self.i == a._call("_str").i }, Bool);
    },
    _leq: (self, a) => {
      return new Instance({ i: self.i.length <= a._call("_str").i.length }, Bool);
    },
    _geq: (self, a) => {
      return new Instance({ i: self.i.length >= a._call("_str").i.length }, Bool);
    },
    _les: (self, a) => {
      return new Instance({ i: self.i.length < a._call("_str").i.length }, Bool);
    },
    _gre: (self, a) => {
      return new Instance({ i: self.i.length > a._call("_str").i.length }, Bool);
    },
    _neq: (self, a) => {
      return new Instance({ i: self.i != a._call("_str").i }, Bool);
    }
  };
  const List = {
    name: "List",
    prop: { },
    _init: i => {
      return i._call?.("_list")?.i ?? i.i.map(j => j.v());
    },
    _int: self => {
      return new Instance({ i: self.i.length }, Int);
    },
    _str: self => {
      return new Instance({
        i: self.i.map(j => j._call("_str").i).join(", ")
      }, Str);
    },
    _list: self => self,
    _bool: self => {
      return new Instance({ i: !!self.i.length }, Bool);
    },
    _mul: (self, a) => {
      return new Instance({
        i: self.i.map(j => j.i).join(a._call("_str").i)
      }, Str);
    },
    _get: (self, prop) => {
      return self.i[prop._call("_int").i] ??
        new Instance({ i: 0 }, Int);
    }
  };
  const Obj = {
    name: "Object",
    prop: { },
    _init: i => {
      return;
    },
    _list: self => {
      return new Instance({
        i: Object.keys(self.prop).map(j => new Instance({ i: j }, Str))
      }, List);
    },
    _bool: self => {
      return new Instance({ i: !!Object.keys(self.prop).length }, Bool);
    }
  }
  const Bool = {
    name: "Bool",
    prop: { },
    _init: i => {
      return !!i.i;
    },
    _int: self => {
      return new Instance({ i: self.i ? 1 : 0 }, Int);
    },
    _str: self => {
      return new Instance({ i: self.i ? "true" : "false" }, Str);
    },
    _bool: self => self,
    _and: (self, a) => {
      return new Instance({ i: self.i && a._call("_bool").i }, Bool);
    },
    _lor: (self, a) => {
      return new Instance({ i: self.i || a._call("_bool").i }, Bool);
    },
    _not: self => {
      return new Instance({ i: !self.i }, Bool);
    }
  }
  const Data = {
    name: "Database",
    _init: i => {
      const j = i._call("_str").i;
      if(!j.match(/^[A-Za-z_][A-Za-z_0-9]*$/))
        throw new Error(j + " is not a valid database name");
      const dbs = glob.sync("./database/custom_events/" + choGuild(eventName, events).id + "/database_*.json");
      if(dbs.length >= 5)
        throw new Error("You may only have 5 databases per guild!");
      return new Database("./database/custom_events/" + choGuild(eventName, events).id + "/database_" + j + ".json");
    },
    _get: (self, prop) => {
      const entry = self.i.pullSync(prop._call("_str").i, []);
      if(entry[1] == "Int") return new Instance({ i: entry[0] }, Int);
      else if(entry[1] == "Str") return new Instance({ i: entry[0] }, Str);
      else return new Instance({ i: 0 }, Int);
    },
    _set: (self, prop, value) => {
      if(value.type.name == "Int")
        self.i.putSync(prop._call("_str").i, [value.i, "Int"]);
      else
        self.i.putSync(prop._call("_str").i, [value._call("_str").i, "Str"]);
    }
  };
  const Type = {
    name: "Type",
    prop: { },
    _init: i => i.type ?? i.i,
    _call: (self, arg) => new Instance(arg, self.i),
    _str: self => new Instance({ i: self.i.name }, Str)
  };

  class ChoMath {
    constructor(){
      this.regExp = {
        "int": /\d+/,
        "add": /\+/,
        "sub": /\-/,
        "mul": /\*/,
        "div": /\//,
        "mod": /\%/,
        "lbr": /\(/,
        "rbr": /\)/,
        "str": /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/,
        "sep": /\,/,
        "lit": /[a-zA-Z_][a-zA-Z_0-9]*/,
        "call": /\:/,
        "get": /\./,
        "equ": /\=\=/,
        "leq": /\<\=/,
        "geq": /\>\=/,
        "les": /\</,
        "gre": /\>/,
        "and": /\&\&/,
        "lor": /\|\|/,
        "neq": /\!\=/,
        "not": /\!/,
        "end": /\=/
      };
      this.whitespace = /[ \t\n]+/;
    }

    lex(code){
      const tokens = [];
      if(code.search(this.whitespace) == 0)
        code = code.replace(this.whitespace, "");
      while(code.length){
        let was = false;
        for(let type in this.regExp){
          const regex = this.regExp[type];
          if(code.search(regex) == 0){
            const found = code.match(regex)[0];
            code = code.replace(found, "");
            if(code.search(this.whitespace) == 0)
              code = code.replace(this.whitespace, "");
            let token;
            if(type == "int"){
              const t = new Instance({ i: found }, Int);
              token = new Node(a => a, [t], "value");
            } else if(type == "str"){
              const replace = [
                ["\\0", "\0"],
                ["\\n", "\n"],
                ["\\t", "\t"],
                ["\\r", "\r"],
                ["\\'", "'"],
                ["\\\"", "\""],
                ["\\\\", "\\"],
              ];
              let str = found.slice(1, - 1);
              for(const r of replace)
                str = str.split(r[0]).join(r[1]);
              for(const x of str.match(/\\x[0-9a-f][0-9a-f]/g) ?? [])
                str = str.replace(x, String.fromCharCode(
                  parseInt(x.slice(2), 16)
                ));
              const t = new Instance({ i: str }, Str);
              token = new Node(a => a, [t], "value");
            } else
              token = new Token(found, type);
            tokens.push(token);
            was = true;
            break;
          }
        }
        if(!was)
          throw new Error("Unknown token at " + code.slice(0, 20));
      }
      tokens.push(new Token(null, "end"));
      return tokens;
    }

    parse(t){
      let current;
      const tokens = t.map(tk => tk);

      function n(){
        current = tokens.splice(0, 1)[0];
      }
      function expr(){
        let res = mod();
        while(
          current.type != "end" &&
          ["add", "sub"].includes(current.type)
        ){
          const token = current;
          const type = token.type;
          n();
          res = new Node(
            (a, b) => a.v()._call("_" + type, b.v()),
            [res, mod()], type
          );
        }
        return res;
      }
      function mod(){
        let res = list();
        while(
          current.type != "end" &&
          ["mod"].includes(current.type)
        ){
          const token = current;
          const type = token.type;
          n();
          res = new Node(
            (a, b) => a.v()._call("_" + type, b.v()),
            [res, list()], type
          );
        }
        return res;
      }
      function list(){
        const list = [];
        let res = term();
        list.push(res);
        while(
          current.type != "end" &&
          ["sep"].includes(current.type)
        ){
          n();
          list.push(term());
          const t = new Instance({ i: list }, List);
          res = new Node(a => a, [t], "value")
        }
        return res;
      }
      function term(){
        let res = logic();
        while(
          current.type != "end" &&
          ["mul", "div"].includes(current.type)
        ){
          const token = current;
          const type = token.type;
          n();
          res = new Node(
            (a, b) => a.v()._call("_" + type, b.v()),
            [res, logic()], type
          );
        }
        return res;
      }
      function logic(){
        let res = call();
        while(
          current.type != "end" &&
          ["equ", "leq", "geq", "les", "gre", "and", "lor", "neq"].includes(current.type)
        ){
          const token = current;
          const type = token.type;
          n();
          res = new Node(
            (a, b) => a.v()._call("_" + type, b.v()),
            [res, call()], type
          );
        }
        return res;
      }
      function call(){
        let res = get();
        if(
          current.type != "end" &&
          ["call"].includes(current.type)
        ){
          const token = current;
          const type = token.type;
          n();
          res = new Node(
            (a, b) => a.v()._call("_" + type, b.v()),
            [res, call()], type
          );
        }
        return res;
      }
      function get(){
        let res = factor();
        while(
          current.type != "end" &&
          ["get"].includes(current.type)
        ){
          const token = current;
          const type = token.type;
          n();
          res = new Node(
            (a, b) => a.v()._get(b.v()),
            [res, factor()], type,
            (a, b) => {
              const [c, d] = a.r();
              return [c[d], b.v()];
            }
          );
        }
        return res;
      }
      function factor(){
        const token = current;
        if(token.type == "lbr"){
          n();
          const res = expr();
          if(current.type != "rbr")
            throw new Error("Not closed bracket at " + current.type);
          n();
          return res;
        } else if(token.type == "value"){
          n();
          return new Node(a => a.v(), [token], "value");
        } else if(token.type == "lit"){
          n();
          return new Node(
            a => {
              const ret = variables[a.value];
              if(!ret)
                throw new Error(a.value + " is not defined");
              return ret;
            },
            [token],
            "value",
            a => [variables, a.value]
          );
        } else if(["add", "sub"].includes(token.type)){
          n();
          const type = token.type;
          return new Node(
            a => a.v()._call("_un" + type),
            [factor()], type
          );
        } else if(["not"].includes(token.type)){
          n();
          const type = token.type;
          return new Node(
            a => a.v()._call("_" + type),
            [factor()], type
          );
        } else if(current.type == "end"){
          return;
        } else {
          throw new Error("Unexpected token " + token.type);
        }
      }

      n();
      if(current.type == "end") return;
      const res = expr();
      if(current.type != "end")
        throw new Error("Unparsed " + current.type);
      if(!tokens.length)
        return res;
      n();
      const c = expr();
      if(current.type != "end")
        throw new Error("Unparsed " + current.type);
      return [res, c];
    }
  }
  const M = new ChoMath();

  function element(string, el){
    for(let i = 0; i < el; i ++){
      const cut = string.split(/[ \t]+/, 1)[0];
      string = string.slice(cut.length).replace(/^[ \t]+/, "");
    }
    return string;
  }

  const variables = {
    "Type": new Instance({ i: Type }, Type),
    "Int": new Instance({ i: Int }, Type),
    "String": new Instance({ i: Str }, Type),
    "List": new Instance({ i: List }, Type),
    "Object": new Instance({ i: Obj }, Type),
    "Bool": new Instance({ i: Bool }, Type),
    "Database": new Instance({ i: Data }, Type)
  };

  if(eventName == "messageCreate"){
    const message = events[0];
    if(message.author.bot) return;

    variables.message = new Instance(null, Obj);
    variables.message._set({ i: "id" }, new Instance({ i: message.id }, Str));
    variables.message._set({ i: "content" }, new Instance({ i: message.content }, Str));
    variables.message._set({ i: "channel" }, new Instance(null, Obj));
    variables.message.prop.channel._set(
      { i: "id" }, new Instance({ i: message.channel.id }, Str)
    );
    variables.message.prop.channel._set(
      { i: "name" }, new Instance({ i: message.channel.name }, Str)
    );
    variables.message._set({ i: "author" }, new Instance(null, Obj));
    variables.message.prop.author._set(
      { i: "id" }, new Instance({ i: message.author.id }, Str)
    );
    variables.message.prop.author._set(
      { i: "name" }, new Instance({ i: message.author.username }, Str)
    );
  } else if(eventName == "guildMemberAdd"){
    const member = events[0];

    variables.member = new Instance(null, Obj);
    variables.member._set({ i: "id" }, new Instance({ i: member.id }, Str));
    variables.member._set({ i: "name" }, new Instance({ i: member.user.username }, Str));
  } else if(eventName == "messageReactionAdd"){
    const reaction = events[0];
    const user = events[1];

    variables.reaction = new Instance(null, Obj);
    variables.reaction._set({ i: "emoji" }, new Instance({ i: reaction.emoji.toString() }, Str));
    variables.reaction._set({ i: "message" }, new Instance(null, Obj));

    variables.reaction.prop.message._set(
      { i: "id" }, new Instance({ i: reaction.message.id }, Str)
    );
    variables.reaction.prop.message._set(
      { i: "content" }, new Instance({ i: reaction.message.content }, Str)
    );
    variables.reaction.prop.message._set(
      { i: "channel" }, new Instance(null, Obj)
    );
    variables.reaction.prop.message.prop.channel._set(
      { i: "id" }, new Instance({ i: reaction.message.channel.id }, Str)
    );
    variables.reaction.prop.message._set(
      { i: "author" }, new Instance(null, Obj)
    );
    variables.reaction.prop.message.prop.author._set(
      { i: "id" }, new Instance({ i: reaction.message.author.id }, Str)
    );
    variables.reaction.prop.message.prop.author._set(
      { i: "name" }, new Instance({ i: reaction.message.author.username }, Str)
    );

    variables.user = new Instance(null, Obj);
    variables.user._set({ i: "id" }, new Instance({ i: user.id }, Str));
    variables.user._set({ i: "name" }, new Instance({ i: user.username }, Str));

  }

  const jump = { };
  code = code.split("\n");
  for(let l = 0; l < code.length; l ++){
    const line = code[l];

    const command = line.split(/[ \t]+/)[0];
    if(command == "FLAG"){
      const name = line.split(/[ \t]+/)[1];
      if(name in jump)
        throw new Error(name + " is already an existing jump point");
      jump[name] = l;
    }
  }

  for(let l = 0; l < code.length; l ++){
    const line = code[l];

    const command = line.split(/[ \t]+/)[0];
    if(command == "FLAG"){
      continue;
    } else if(command == "JUMP"){
      const name = line.split(/[ \t]+/)[1];
      if(!(name in jump))
        throw new Error(name + " is not an existing jump point");
      l = jump[name];
    } else if(command == "NEW"){
      const tm = line.split(/[ \t]+/)[1];
      const type = variables[tm];
      if(!type)
        throw new Error(tm + " is not defined")
      if(type.type.name != "Type")
        throw new Error(type.type.name + " is not a type");

      const [reference, c] = M.parse(M.lex(element(line, 2)));
      const [place, name] = reference.r();
      if(place == variables){
        if(name in place)
          throw new Error(name + " already defined");
        place[name] = new Instance(c.v(), type.i);
      } else {
        if(name in place.prop)
          throw new Error(name + " is already a defined property");
        place._set(name, new Instance(c.v(), type.i));
      }
    } else if(command == "SET"){
      const [reference, c] = M.parse(M.lex(element(line, 1)));
      const [place, name] = reference.r();
      if(place == variables){
        if(!(name in place))
          throw new Error(name + " is udefined");
        place[name] = new Instance(c.v(), place[name].type);
      } else {
        if(!(name in place.prop))
          throw new Error(name + " is not a defined property");
        place._set(name, new Instance(c.v(), place.prop[name].type));
      }
    } else if(command == "WRITE"){
      const c = M.parse(M.lex(element(line, 1)));
      const output = c.v();
      if(output.type.name != "List")
        throw new Error("WRITE needs a List as an argument");
      const id = output._get(new Instance({ i: 0 }, Int))._call("_str").i;
      const channel = choGuild(eventName, events).channels.cache.get(id);
      const content = output._get(new Instance({ i: 1 }, Int))._call("_str").i;
      if(!content.trim().length)
        throw new Error("Message may not be empty");
      e.setDescription(content);
      await channel.send({ "embeds": [e] });
    } else if(command == "JUMPIF"){
      const name = line.split(/[ \t]+/)[1];
      if(!(name in jump))
        throw new Error(name + " is not an existing jump point");
      const c = M.parse(M.lex(element(line, 2)));
      if(c.v()._call("_bool").i) l = jump[name];
    } else throw new Error(command + " is not a valid command");
  }
}

async function execute(code, eventName, events, cid, config, bot){
  const e = new MessageEmbed().setColor(config.color);
  let channel;
  try {
    channel = bot.channels.cache.get(cid);
  } catch { }
  try {
    await run(code, eventName, events, e);
  } catch(error){
    console.log(error);
    if(channel){
      e.setDescription("[**ошибка**] В кастомном ивенте " + eventName + ": " + error);
      channel.send({ "embeds": [e] });
    }
  }
}

function choGuild(eventName, events){
  if(eventName == "messageReactionAdd")
    return events[0].message.guild;
  if(eventName == "messageCreate")
    return events[0].guild;
  if(eventName == "guildMemberAdd")
    return events[0].guild;
}

module.exports = { execute, choGuild };