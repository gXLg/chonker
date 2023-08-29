const https = require("https");

async function run(message, prefix, e, args){

  let color = args[0];

  if(color == "chonker" || color == "чонкер"){
    e
      .setTitle("Ты нашёл пасхалку!")
      .addField("Логотип", "#ABC353")
      .addField("Фон", "#253238");
    message.reply({ "embeds": [e] }, false);
    return;
  }

  https.get("https://www.thecolorapi.com/id?hex=" + color, res => {

    let data = "";
    res.on("data", chunk => {
      data += chunk;
    }).on("end", () => {
      const info = JSON.parse(data.toString());

      let desc = [
        info.hex.value,
        info.rgb.value,
        info.hsl.value,
        info.hsv.value
      ];

      e
        .setTitle(info.name.value)
        .setDescription(desc.join("\n"))
        .setImage("https://dummyimage.com/100x50/" + color + "/" + color);

      message.reply({ "embeds": [e] }, false);
    }).on("error", err => {
      console.error(`Color error: ${err}`);
      e.setDescription("[**ошибка**] Попробуйте позже!");
      message.reply({ "embeds": [e] }, false);
    });
  });
}

module.exports = {
  "run": run,
  "dep": [
    "message", "prefix", "e", "args"
  ],
  "args": [
    [
      [/(чонкер)|(chonker)/i, arg => arg.toLowerCase()],
      [/#[0-9a-f]{1}/i, arg => arg.slice(1).repeat(6)],
      [/#[0-9a-f]{2}/i, arg => arg.slice(1).repeat(3)],
      [/#[0-9a-f]{3}/i, arg => [...arg.slice(1)].map(x => x.repeat(2)).join("")],
      [/#[0-9a-f]{6}/i, arg => arg.slice(1)],
      [/[0-9a-f]{1}/i, arg => arg.repeat(6)],
      [/[0-9a-f]{2}/i, arg => arg.repeat(3)],
      [/[0-9a-f]{3}/i, arg => [...arg].map(x => x.repeat(2)).join("")],
      [/[0-9a-f]{6}/i, arg => arg]
    ]
  ],
  "perm": [],
  "category": "api"
};
