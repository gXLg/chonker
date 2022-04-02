const https = require("https");
const zlib = require("zlib");
const decode = require("html-entities" ).decode;

async function run(message, e, args){

  https.get("https://api.stackexchange.com/2.3/search?page=1&pagesize=10" +
            "&order=desc&sort=activity&intitle=" +
            encodeURIComponent(args[0]) +
            "&site=stackoverflow", res => {

    let buffer = [];
    let gunzip = zlib.createGunzip();
    res.pipe(gunzip);

    gunzip.on("data", chunk => {
      buffer.push(chunk);
    }).on ("end", () => {

      const questions = JSON.parse(buffer.join(""));
      if(!questions.items){
        e.setDescription("[**ошибка**] Что-то пошло не так...\n");
        message.reply({ "embeds": [e] });
        return;
      }
      let a = questions.items.map(q =>
        (q.is_answered ? ":white_check_mark:" : ":no_entry_sign:") +
        " [" + decode(q.title) + "](" + q.link + ")" +
        "\nVotes: " + q.score + ", answers: " + q.answer_count
      ).join("\n\n");
      if(questions.has_more) e.setFooter({ "text": "Топ 10 результатов" });
      if(!a) a = "Результаты отсутсвуют";
      e.setDescription(a);
      message.reply({ "embeds": [e] });
      return;
    }).on("error", err => {
      console.error(`Stack error: ${err}`);
      e.setDescription("[**ошибка**] Попробуйте позже!");
      message.reply({ "embeds": [e] });
    });
  });
}

module.exports = {
  "run": run,
  "dep": ["message", "e", "args"],
  "args": [
    [
      [/.*/m, arg => arg]
    ]
  ],
  "perm": [],
  "category": "api"
};