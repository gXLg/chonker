const https = require("https");

async function run(message, prefix, e, args){

  /*
  message.mentions.users.forEach ( men => {
    e.setImage ( men.displayAvatarURL ( { size: 2048 }))
    //console.log ( men.displayAvatarURL ( { size: 2048 }))
    message.channel.send ( e )
  })

  return
  */

  const color = args[0];

  if(color == "chonker" || color == "чонкер"){
    e
      .setTitle("Ты нашёл пасхалку!")
      .addField("Логотип", "#ABC353")
      .addField("Фон", "#253238");
    message.reply({ "embeds": [e] });
    return;
  }

  if(color[0] == "#")
    color = color.slice(1);

  if(color.length == 1)
    color = color.repeat(6);
  else if(color.length == 2)
    color = color.repeat(3);
  else if(color.length == 3)
    color = [...color].map(x => x + "" + x).join("");

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

      message.reply({"embeds": [e]});
    }).on("error", err => {
      console.error(`Color error: ${err}`);
      e.setDescription("[**ошибка**] Попробуйте позже!");
      message.reply({"embeds": [e]});
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
      [/#[0-9a-f]{3}/i, arg => arg.slice(1).map(x => x.repeat(2))],
      [/#[0-9a-f]{6}/i, arg => arg.slice(1)],
      [/[0-9a-f]{1}/i, arg => arg.repeat(6)],
      [/[0-9a-f]{2}/i, arg => arg.repeat(3)],
      [/[0-9a-f]{3}/i, arg => arg.map(x => x.repeat(2))],
      [/[0-9a-f]{6}/i, arg => arg]
    ]
  ],
  "perm": [],
  "category": "api"
}

