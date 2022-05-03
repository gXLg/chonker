const fs = require("fs");
const size = require("fast-folder-size");
const extensions = JSON.parse(fs.readFileSync("./configs/extensions.json"));
const { spawn } = require ("child_process");
const axios = require("axios");

async function run(message, prefix, e, inst, args, col){

  /*
  if(message.author.id != "557260090621558805"){
    e.setDescription("[**ошибка**] Эта команда находится в разработке, ошибка безопасности была найдена и сейчас разработчик её фиксит.");
    await message.reply({"embeds": [e]});
    return;
  }
  */


  const env = "./env/" + message.author.id;

  if(!fs.existsSync(env)) fs.mkdirSync(env)
  if(message.author.id in inst){
    e.setDescription("[**ошибка**] У тебя уже запущен один процесс в твоей среде!");
    message.reply({ "embeds": [e] });
    return;
  }
  size(env, async (err, bytes) => {
    if(err || (bytes > 2097152)){
      e.setDescription("[**ошибка**] Твоя среда содержит поломанные файлы, либо превышает лимит по размеру. Чтобы очистить среду, используй `" + prefix + "clear`!");
      message.reply({ "embeds": [e] });
      return;
    }
    const lang = args[0];
    let code = args[1];
    if(!code){
      const file = message.attachments.first()?.url;
      if(!file){
        e
          .setDescription("[**ошибка**] Код не распознан либо отсутствует!")
          .setFooter({ "text": "Подробней: `" + prefix + "help do`" });
        message.reply({ "embeds": [e] });
        return;
      }
      let response;
      try {
        response = await axios.get(file);
      } catch(error){
        e.setDescription("[**ошибка**] Ошибка при получении файла!");
        message.reply({ "embeds": [e] });
        return;
      }
      code = response.data;
    }
    if(!extensions[lang]){
      e.setDescription("[**ошибка**] Неизвестный язык, получить список языков: `" + prefix + "langs`");
      message.reply({ "embeds": [e] });
      return;
    }
    const ext = extensions[lang][0];

    let limited = false;

    let stdout = "";
    let stderr = "";
    let g = "";
    let msg;
    async function get(finished, first){
      if(!finished){
        if(limited) return;
        limited = true;
        setTimeout(() => { limited = false }, 2000);
      }

      if(stdout.length > 2000)
        stdout = stdout.slice(0, 1994) + "\n(...)";

      if(stderr.length > 2000)
        stderr = stderr.slice(0, 1994) + "\n(...)";

      let stdo = stdout.split("\n");
      if(stdo.length > 75)
        stdout = stdo.slice(0, 75).join("\n") + "\n(...)";

      let stde = stderr.split("\n");
      if(stde.length > 75)
        stderr = stde.slice(0, 75).join("\n") + "\n(...)";

      let o, r, f;
      o = stdout.split("```").join("'''").trim();
      r = stderr.split("```").join("'''").trim();

      f = finished ? "**Обработка завершена**" : "**Код обрабатывается...**";

      let n = "**stdout**\n```\n" + (o || "(...)") + "\n```\n" +
              "**stderr**\n```\n" + (r || "(...)") + "\n```\n" + f;

      if(first){
        e.setDescription(n);
        msg = await message.reply({ "embeds": [e] });
        return;
      }

      if(finished){
        e.setDescription(n);
        try {
          await msg.edit({ "embeds": [e] });
        } catch(err){
          e.setDescription("[**ошибка**] По неизвестной причине я не могу изменить своё старое сообщение! Пожалуйста проверьте, что у бота есть все нужные права!");
          await message.reply({ "embeds": [e] });
        }
        return;
      }

      if(n.length - g.length > 20){
        g = n;
        e.setDescription(g);
        try {
          await msg.edit({ "embeds": [e] });
        } catch(err){
          e.setDescription("[**ошибка**] По неизвестной причине я не могу изменить своё старое сообщение! Пожалуйста проверьте, что у бота есть все нужные права!");
          await message.reply({ "embeds": [e] });
        }
      }
    }

    await get(false, true);

    await col.put(message.author.id, 12);
    try {
      fs.writeFileSync(env + "/code." + ext, code);
    } catch(err){
      e.setDescription("[**ошибка**] Не получается сохранить код в исходном файле. Попробуй очистить свою среду с помощью `" + prefix + "clear`");
      await message.reply({ "embeds": [e] });
      return;
    }

    const cmd = spawn("bash", [
      "-c",
      "firejail --noroot --hostname=calculator --rlimit-nofile=69 " +
      "--rlimit-as=650117120 " +
      "--net=none --rlimit-nproc=200 --cpu=0 --private=" + env +
      " --quiet --timeout=00:00:30 -- eval \"" +
      extensions[args[0]][1] + " | strip-ansi\""
    ]);
    inst[message.author.id] = cmd;

    cmd.stdout.on("data", data => {
      stdout += String(data);
      get();
    });

    cmd.stderr.on("data", data => {
      stderr += String(data);
      get();
    });

    cmd.on("error", error => {
      stderr += String(data);
      get();
    });

    cmd.on("close", code => {
      get(true);
      delete inst[message.author.id];
    });
  });
}

module.exports = {
  "run": run,
  "dep": [
    "message", "prefix", "e", "inst", "args", "col"
  ],
  "args": [
    [
      [/.*?/, arg => arg.toLowerCase()]
    ],
    [
      [new RegExp(), arg => false],
      [/`{3}\w*\n?[\S\s]+?\n?`{3}/m, arg => arg.slice(arg.split(/\s/)[0].length, - 3).trim()]
    ]
  ],
  "perm": [],
  "category": "coding"
};